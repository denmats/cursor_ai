import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../../lib/authOptions'; // Import from the new shared location
import { supabase } from '@/lib/supabaseClient';
import { randomBytes } from 'crypto';

// Helper function to generate a secure API key
const generateApiKey = (prefix = 'dmatsai') => {
  const key = randomBytes(24).toString('hex'); // Generate a 48-character hex string
  return `${prefix}_${key}`;
};

// GET handler to fetch keys for the authenticated user
export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, type, key_preview, created_at') // Exclude full_key
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching API keys:", error);
        // Don't expose detailed DB errors to the client
        throw new Error('Failed to fetch API keys');
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("API Route GET /api/apikeys Error:", error.message);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST handler to create a new key for the authenticated user
export async function POST(request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    let reqBody;
    try {
        reqBody = await request.json();
    } catch (e) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { name, type = 'secret' } = reqBody; // Default type to 'secret'

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json({ error: 'API key name is required and must be a non-empty string' }, { status: 400 });
    }

    if (type !== 'secret' && type !== 'public') {
         return NextResponse.json({ error: 'Invalid key type specified' }, { status: 400 });
    }

    const fullKey = generateApiKey(type === 'public' ? 'pk' : 'dmatsai');
    const keyPreview = `${fullKey.substring(0, 5)}...${fullKey.substring(fullKey.length - 4)}`;

    try {
        const { data, error } = await supabase
            .from('api_keys')
            .insert([{
                user_id: userId,
                name: name.trim(),
                type: type,
                full_key: fullKey, // Store the securely generated key
                key_preview: keyPreview,
            }])
            .select('id, name, type, key_preview, created_at') // Return details BUT NOT the full_key from DB select
            .single();

        if (error) {
            console.error("Error creating API key in DB:", error);
            // Handle potential DB constraints errors (e.g., duplicate names if you have a unique constraint)
            if (error.code === '23505') { // Example: PostgreSQL unique violation code
                 return NextResponse.json({ error: 'An API key with this name might already exist.' }, { status: 409 }); // Conflict
            }
            throw new Error('Failed to save API key');
        }
        if (!data) {
            throw new Error("Key creation returned no data.");
        }

        // Return the newly created key details ALONG WITH the fullKey (only on creation response)
        return NextResponse.json({ ...data, fullKey }, { status: 201 });

    } catch (error) {
        console.error("API Route POST /api/apikeys Error:", error.message);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
