import { supabase } from './supabaseClient';


/**
 * Validates if an API key string exists in the database.
 * This performs a basic existence check.
 * @param {string} apiKey - The full API key string (`full_key`).
 * @returns {Promise<boolean>} True if the key exists, false otherwise.
 */
export async function validateApiKey(apiKey) {
  if (!apiKey) {
    console.warn('[API Validation] Attempted validation with empty key.');
    return false;
  }
  try {
    const { data, error, count } = await supabase
      .from('api_keys') // Your table name
      .select('id', { count: 'exact', head: true }) // Check existence efficiently
      .eq('full_key', apiKey); // Use the actual key string column

    if (error) {
      console.error('[Supabase Error] Error validating API key existence:', error.message);
      return false; // Treat database errors as invalid for safety
    }

    return count > 0; // Return true if count is 1 (or more, though should be unique)
  } catch (error) {
    console.error('[Supabase Error] Unexpected error during API key validation:', error);
    return false;
  }
}

/**
 * Fetches the API key record including usage and limit, based on the key string.
 * Intended for server-side use (e.g., in API routes) to check rate limits.
 * @param {string} apiKey - The full API key string (`full_key`).
 * @returns {Promise<object|null>} The API key record object { id, usage, limit, ... } or null if not found or on error.
 */
export async function getApiKeyRecord(apiKey) {
  if (!apiKey) {
    console.warn('[API Record Fetch] Attempted fetch with empty key.');
    return null;
  }
  try {
    const { data, error } = await supabase
      .from('api_keys') // Your table name
      .select('id, usage, limit') // Select ID (for incrementing) and rate limit fields
      // Add other fields if needed by the calling route, but keep it minimal
      .eq('full_key', apiKey) // Query based on the full key string
      .single(); // Expect exactly one record for a valid key

    if (error) {
      // Handle case where the key is not found
      if (error.code === 'PGRST116') { // PostgREST code for "Searched item was not found"
          // This is expected if the key is invalid, log perhaps at a lower level or not at all depending on needs
          // console.log(`[API Record Fetch] API key record not found for key ending with ...${apiKey.slice(-4)}`);
          return null;
      }
      // Log other unexpected database errors
      console.error('[Supabase Error] Error fetching API key record by full key:', error.message);
      return null; // Return null on database errors
    }

    return data; // Return the record object { id, usage, limit }
  } catch (error) {
    console.error('[Supabase Error] Unexpected error fetching API key record:', error);
    return null;
  }
}

/**
 * Increments the usage count for a given API key using its database ID.
 * Uses Supabase RPC for atomic increment if available, otherwise read-modify-write.
 * @param {string} apiKeyId - The database ID of the API key record (e.g., UUID or integer).
 * @returns {Promise<boolean>} True if increment was successful, false otherwise.
 */
export async function incrementApiKeyUsage(apiKeyId) {
   if (!apiKeyId) {
        console.error('[API Usage Increment Error] API key ID is required.');
        return false;
    }

    try {
        // Option 1: Use Supabase RPC function (Recommended for atomicity)
        // Assumes you have created a function `increment_api_key_usage(key_id UUID)` or similar in Supabase SQL Editor
        /*
        const { error } = await supabase.rpc('increment_api_key_usage_by_id', { // Example RPC name
            key_id: apiKeyId
        });

        if (error) {
            console.error(`[Supabase RPC Error] Error incrementing usage for key ID ${apiKeyId}:`, error.message);
            return false;
        }
        return true; // RPC succeeded
        */

        // Option 2: Read-Modify-Write (Simpler if RPC not set up, less safe under high concurrency)
        // Fetch the current usage first (optional, can sometimes update directly, but read adds safety)
         const { data: currentData, error: fetchError } = await supabase
            .from('api_keys')
            .select('usage') // Select current usage
            .eq('id', apiKeyId)
            .single();

        if (fetchError || !currentData) {
            console.error(`[Supabase Error] Error fetching key ID ${apiKeyId} before increment:`, fetchError?.message || 'Key ID not found');
            return false;
        }

        // Increment usage client-side (potential race condition here without atomicity)
        const newUsage = currentData.usage + 1;

        // Update the record using the ID
        const { error: updateError } = await supabase
            .from('api_keys')
            .update({ usage: newUsage })
            .eq('id', apiKeyId); // Use the primary key (id) for the update

        if (updateError) {
            console.error(`[Supabase Error] Error updating usage for key ID ${apiKeyId}:`, updateError.message);
            return false;
        }

        // console.log(`[API Usage] Incremented usage for key ID ${apiKeyId} to ${newUsage}`);
        return true; // Increment successful

    } catch (error) {
        console.error(`[Supabase Error] Unexpected error during API key usage increment for ID ${apiKeyId}:`, error);
        return false;
    }
} 