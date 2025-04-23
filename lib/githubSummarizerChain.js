import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod"; // Keep Zod for schema validation locally

// Ensure Google API key is available
if (!process.env.GOOGLE_API_KEY) {
    console.error("Missing GOOGLE_API_KEY environment variable in githubSummarizerChain");
    // Optionally throw an error here if needed
}

// Define strict schema for output using Zod
const schema = z.object({
    summary: z.string()
        .min(1, "Summary cannot be empty")
        .max(2000, "Summary too long")
        .describe("A concise summary of the project's purpose and key features."),
    cool_facts: z.array(z.string())
        .min(2, "Must have at least 2 cool facts")
        .max(3, "Cannot have more than 3 cool facts")
        .refine(facts => facts.every(fact => fact.length > 0), {
            message: "Cool facts cannot be empty strings"
        }).describe("A list of 2-3 interesting or cool facts about the project mentioned in the README.")
});

// Initialize the Gemini model directly
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

/**
 * Create a prompt with formatting instructions for structured output
 * @param {string} readmeContent - The README content to summarize
 * @returns {string} - Complete formatted prompt
 */
const createPrompt = (readmeContent) => {
    return `Summarize the primary purpose and key features of the GitHub repository based on its README file content. Also, list 2-3 interesting or cool facts about the project mentioned in the README.

    README Content: ${readmeContent}

    IMPORTANT: Your response must be only a valid JSON object with no other text or explanations.
    The JSON must use this exact structure:
    {
      "summary": "A concise summary of the project's purpose and key features (between 1 and 2000 characters)",
      "cool_facts": ["fact 1", "fact 2", "optional fact 3"]
    }
    
    Do not include any text before or after the JSON. The response should start with '{' and end with '}' with no additional text.`;
};

/**
 * Generates a summary and cool facts for a given README content using Google Gemini directly.
 * @param {string} readmeContent - The content of the README file.
 * @returns {Promise<{summary: string, cool_facts: string[]}>} A promise that resolves to the parsed summary and cool facts.
 * @throws Will throw an error if the Gemini API call fails or the API key is missing.
 */
// Modify the getGithubSummary function to better handle non-JSON responses

export const getGithubSummary = async (readmeContent) => {
    if (!process.env.GOOGLE_API_KEY) {
        throw new Error("Google API Key not configured.");
    }

    try {
        console.log("Running Gemini summarization...");
        
        // Create the prompt
        const prompt = createPrompt(readmeContent);
        
        // Generate content with Gemini
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        console.log("Raw Gemini response:", responseText);
        
        // Try to extract JSON from the response (in case Gemini added extra text)
        let parsedResult;
        try {
            // First try direct parsing
            parsedResult = JSON.parse(responseText);
        } catch (initialParseError) {
            // If direct parsing fails, try to find and extract JSON
            try {
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    parsedResult = JSON.parse(jsonMatch[0]);
                } else {
                    throw new Error("Could not find JSON in response");
                }
            } catch (extractError) {
                console.error("Failed to parse JSON from Gemini response:", initialParseError);
                console.log("Raw response:", responseText);
                
                // Last resort: Try to manually extract the summary and cool facts
                const summaryMatch = responseText.match(/["']summary["']\s*:\s*["']([^"']*)["']/);
                const coolFactsMatch = responseText.match(/["']cool_facts["']\s*:\s*\[(.*?)\]/s);
                
                if (summaryMatch && coolFactsMatch) {
                    const summary = summaryMatch[1];
                    const coolFactsString = coolFactsMatch[1];
                    const coolFacts = coolFactsString
                        .split(',')
                        .map(fact => fact.trim().replace(/^["']|["']$/g, ''))
                        .filter(fact => fact.length > 0);
                    
                    parsedResult = { summary, cool_facts: coolFacts };
                } else {
                    throw new Error("Could not extract structured data from response");
                }
            }
        }
        
        // Validate against our schema
        try {
            const validatedResult = schema.parse(parsedResult);
            console.log('[Gemini Direct Result]', validatedResult);
            return validatedResult;
        } catch (validationError) {
            console.error("Schema validation failed:", validationError);
            throw new Error("Response did not match expected format");
        }
    } catch (error) {
        console.error("[Gemini Direct API Error]", error);
        // Re-throw with a more user-friendly message
        throw new Error("Failed to generate summary using Gemini: " + error.message);
    }
};