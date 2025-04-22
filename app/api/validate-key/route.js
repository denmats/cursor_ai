import { NextResponse } from 'next/server';
import { validateApiKey } from '../../../lib/apiKeysService'; // Adjust path as needed

export async function POST(request) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json({ valid: false, error: 'API key is required' }, { status: 400 });
    }

    const isValid = await validateApiKey(apiKey);

    if (isValid) {
      return NextResponse.json({ valid: true });
    } else {
      // It's generally better practice not to explicitly state *why* it's invalid
      // unless necessary. Just returning invalid is often sufficient.
      return NextResponse.json({ valid: false });
    }

  } catch (error) {
    console.error('[API Validate Key Error]', error);
    // Handle JSON parsing errors or unexpected issues
    if (error instanceof SyntaxError) {
        return NextResponse.json({ valid: false, error: 'Invalid request body' }, { status: 400 });
    }
    return NextResponse.json({ valid: false, error: 'Internal Server Error' }, { status: 500 });
  }
} 