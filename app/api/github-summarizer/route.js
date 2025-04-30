import { NextResponse } from 'next/server';
import { validateApiKey, getApiKeyRecord, incrementApiKeyUsage } from '../../../lib/apiKeysService';
import { getGithubSummary } from '../../../lib/githubSummarizerChain'; // Import the new chain function

// Note: Removed Langchain/Zod imports from here

// Ensure Google API key is available (checked more thoroughly in chain file)
if (!process.env.GOOGLE_API_KEY) {
  console.error("Missing GOOGLE_API_KEY environment variable");
  // Optionally throw an error during build/startup if preferred
}

export async function POST(request) {
  try {
    const body = await request.json();
    // Get API key from header
    const apiKey = request.headers.get('x-api-key');

    // --- API Key Validation & Rate Limiting ---
    if (!apiKey) {
      return NextResponse.json({ valid: false, error: 'API key is required' }, { status: 400 });
    }

    // 1. Check if the key is fundamentally valid (exists, active, etc.)
    const isValid = await validateApiKey(apiKey);
    if (!isValid) {
       return NextResponse.json({ valid: false, error: 'Invalid API key' }, { status: 401 });
    }

    console.log("valid: "+isValid);

    // 2. Fetch the full record to check usage limits
    let apiKeyRecord;
    try {
        apiKeyRecord = await getApiKeyRecord(apiKey);
        if (!apiKeyRecord) {
            // This case should ideally not happen if validateApiKey passed,
            // but handle it defensively.
            console.error(`[API Consistency Error] API key ${apiKey} passed validation but record not found.`);
            return NextResponse.json({ valid: false, error: 'API key validation inconsistency.' }, { status: 500 });
        }
    } catch (fetchError) {
        console.error(`[API Fetch Error] Failed to fetch record for key ${apiKey}:`, fetchError);
        return NextResponse.json({ valid: false, error: 'Failed to retrieve API key details.' }, { status: 500 });
    }


    // 3. Check if usage exceeds the limit
    if (apiKeyRecord.usage >= apiKeyRecord.limit) {
        console.log(`[API Rate Limit] Key ${apiKey} exceeded limit (${apiKeyRecord.usage}/${apiKeyRecord.limit})`);
        return NextResponse.json({ error: 'API rate limit exceeded' }, { status: 429 }); // 429 Too Many Requests
    }

    // 4. Increment the usage count (fire-and-forget or await)
    incrementApiKeyUsage(apiKeyRecord.id).catch(err => {
        console.error(`[API Usage Increment Error] Failed to increment usage for key ${apiKey}:`, err);
    });
    // --- End API Key Validation & Rate Limiting ---

    // Validate required fields from body
    const { githubUrl } = body;
    if (!githubUrl) {
      return NextResponse.json({ error: 'Github URL is required' }, { status: 400 });
    }

    let owner, repo, readmeContent;

    // --- Fetch README Content ---
    try {
      const url = new URL(githubUrl);
      const urlParts = url.pathname.split('/').filter(Boolean);
      owner = urlParts[0];
      repo = urlParts[1];

      if (!owner || !repo) {
        throw new Error('Invalid GitHub repository URL path');
      }

      const readmeUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
      console.log(`Fetching README from: ${readmeUrl}`);
      const response = await fetch(readmeUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3.raw',
          'User-Agent': 'Node.js-GitHub-Summarizer'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return NextResponse.json({ error: 'README not found in the repository' }, { status: 404 });
        }
        const errorText = await response.text();
        console.error(`GitHub API error (${response.status}): ${errorText}`);
        throw new Error(`GitHub API error: ${response.statusText}`);
      }
      readmeContent = await response.text();
    } catch (error) {
      console.error('[GitHub Processing Error]', error);
      if (error instanceof TypeError || error.message.includes('Invalid URL') || error.message.includes('Invalid GitHub repository URL path')) {
          return NextResponse.json({ error: 'Invalid GitHub repository URL format provided.' }, { status: 400 });
      }
      return NextResponse.json({ error: 'Failed to fetch or process GitHub repository information.' }, { status: 500 });
    }
    // --- End Fetch README Content ---

    // --- Call Langchain Summarization Logic ---
    console.log('[API Github Summarizer] Key validated, rate limit checked, proceeding with summarization...');

    try {
      // Call the extracted function
      const { summary, cool_facts } = await getGithubSummary(readmeContent);

      // Return the structured response
      return NextResponse.json({ success: true, summary: summary, cool_facts: cool_facts });

    } catch (langchainError) {
        // Handle errors specifically from the Langchain part (e.g., OpenAI key issue, parsing failure)
        console.error('[Langchain Execution Error in API Route]', langchainError);
        return NextResponse.json({ error: langchainError.message || 'Failed to generate summary.' }, { status: 500 });
    }
    // --- End Langchain Summarization Logic ---

  } catch (error) {
    console.error('[API Github Summarizer Error - Top Level]', error);
    // Handle JSON parsing errors or other unexpected issues
    if (error instanceof SyntaxError) {
        return NextResponse.json({ valid: false, error: 'Invalid request body' }, { status: 400 });
    }
    return NextResponse.json({ valid: false, error: 'Internal Server Error' }, { status: 500 });
  }
} 
