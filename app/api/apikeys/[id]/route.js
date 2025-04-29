import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../../../../lib/authOptions'; // Corrected relative path
import { supabase } from '@/lib/supabaseClient';

// PUT handler to update a specific key for the authenticated user
export async function PUT(request, { params }) {
    const session = await getServerSession(authOptions);
    const { id } = params; // Get key ID from the URL path

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!id) {
        return NextResponse.json({ error: 'API key ID is required' }, { status: 400 });
    }

    const userId = session.user.id;

    let reqBody;
    try {
        reqBody = await request.json();
    } catch (e) {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { name: newName } = reqBody;

    if (!newName || typeof newName !== 'string' || newName.trim().length === 0) {
        return NextResponse.json({ error: 'New name is required and must be a non-empty string' }, { status: 400 });
    }

    try {
        // Update only if the user owns the key
        const { data, error, count } = await supabase
            .from('api_keys')
            .update({ name: newName.trim() })
            .match({ id: id, user_id: userId }) // Match both id and user_id
            .select('id, name, type, key_preview, created_at')
            .single(); // Use single to ensure we get the updated record or null


        // Handle errors after the query
        if (error) {
            console.error(`Error updating API key ${id}:`, error);
             // Handle potential DB constraints errors (e.g., duplicate names)
            if (error.code === '23505') {
                 return NextResponse.json({ error: 'An API key with this name might already exist.' }, { status: 409 });
            }
            throw new Error('Failed to update API key name');
        }

        // Check if the key was found and updated for the user
        if (!data) {
            // This means either the key doesn't exist OR the user doesn't own it.
            // Treat both as 'Not Found' from the client's perspective for security.
            return NextResponse.json({ error: 'API key not found or access denied' }, { status: 404 });
        }

        // Successfully updated
        return NextResponse.json(data);

    } catch (error) {
        console.error(`API Route PUT /api/apikeys/${id} Error:`, error.message);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE handler to delete a specific key for the authenticated user
export async function DELETE(request, { params }) {
    const session = await getServerSession(authOptions);
    const { id } = params; // Get key ID from the URL path

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
     if (!id) {
        return NextResponse.json({ error: 'API key ID is required' }, { status: 400 });
    }

    const userId = session.user.id;

    try {
        // Delete only if the user owns the key
        const { error, count } = await supabase
            .from('api_keys')
            .delete({ count: 'exact' }) // Request count to check if deletion happened
            .match({ id: id, user_id: userId }); // Match both id and user_id

        if (error) {
            console.error(`Error deleting API key ${id} from DB:`, error);
            throw new Error('Failed to delete API key');
        }

        // Check if exactly one row was deleted
        if (count === 0) {
            // Key not found or user doesn't own it
            return NextResponse.json({ error: 'API key not found or access denied' }, { status: 404 });
        }

        // Successfully deleted
        return new NextResponse(null, { status: 204 }); // No Content

    } catch (error) {
        console.error(`API Route DELETE /api/apikeys/${id} Error:`, error.message);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
