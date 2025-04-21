import { supabase } from './supabaseClient';

/**
 * Fetches API keys from the database.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of API key objects.
 */
export const fetchApiKeys = async () => {
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching API keys:", error);
    throw error; // Re-throw the error to be caught by the caller
  }

  // Map Supabase data (snake_case) to application format (camelCase) if needed
  // Assuming keys in the component state match DB columns for now
  // Example mapping:
  // return (data || []).map(key => ({ id: key.id, name: key.name, ... }));
  return data || [];
};

/**
 * Creates a new API key in the database.
 * @param {Object} keyData - The data for the new key (name, type, key_preview, full_key).
 * @returns {Promise<Object>} A promise that resolves to the newly created API key object.
 */
export const createApiKey = async (keyData) => {
    // Consider moving key generation logic (prefix, random part) here or to a backend function
    const { data, error } = await supabase
        .from('api_keys')
        .insert([keyData])
        .select() // Select the newly inserted row
        .single(); // Expecting a single row back

    if (error) {
        console.error("Error creating API key:", error);
        throw error;
    }
    if (!data) {
        throw new Error("Failed to create key, no data returned.");
    }
    // Map DB -> App format if needed
    return data;
};

/**
 * Deletes an API key from the database.
 * @param {string} id - The ID of the key to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is complete.
 */
export const deleteApiKey = async (id) => {
  const { error } = await supabase
    .from('api_keys')
    .delete()
    .match({ id: id });

  if (error) {
    console.error("Error deleting API key:", error);
    throw error;
  }
};

/**
 * Updates an API key's name in the database.
 * @param {string} id - The ID of the key to update.
 * @param {string} newName - The new name for the key.
 * @returns {Promise<Object>} A promise that resolves to the updated API key object.
 */
export const updateApiKeyName = async (id, newName) => {
    const { data, error } = await supabase
        .from('api_keys')
        .update({ name: newName })
        .match({ id: id })
        .select()
        .single();

    if (error) {
        console.error("Error updating API key name:", error);
        throw error;
    }
     if (!data) {
        throw new Error("Failed to update key, no data returned.");
    }
    // Map DB -> App format if needed
    return data;
};

/**
 * Validates if an API key exists in the database.
 * @param {string} apiKey - The full API key string to validate.
 * @returns {Promise<boolean>} A promise that resolves to true if the key is valid, false otherwise.
 */
export const validateApiKey = async (apiKey) => {
    if (!apiKey) {
        return false;
    }
    try {
        const { data, error } = await supabase
            .from('api_keys')
            .select('id') // Select only necessary field
            .eq('full_key', apiKey) // Check against the full key column
            .maybeSingle(); // Returns the row or null, doesn't error if not found

        if (error) {
            console.error("Error validating API key:", error);
            // Decide if DB errors should be treated as invalid or throw
            // For simplicity, treat DB errors as potentially invalid/retry scenario
            return false;
        }

        return !!data; // Return true if a row was found (data is not null), false otherwise
    } catch (err) {
        console.error("Unexpected error during API key validation:", err);
        return false; // Treat unexpected errors as invalid
    }
}; 