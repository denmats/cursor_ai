'use client';

import { useState } from 'react';
// Remove useRouter as it's no longer needed for redirection
// import { useRouter } from 'next/navigation';

// Define Notification component locally or import if extracted
function Notification({ message, type }) {
    const baseClasses = "p-4 mb-4 rounded-md text-sm transition-opacity duration-300 ease-in-out";
    const typeClasses = type === 'success'
        ? "bg-green-100 border border-green-300 text-green-800"
        : type === 'error'
        ? "bg-red-100 border border-red-300 text-red-800"
        : "hidden"; // Hide if no type

    if (!message) return null;

    return (
        <div className={`${baseClasses} ${typeClasses}`} role="alert">
            {message}
        </div>
    );
}

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState('');
  const [githubUrl, setGithubUrl] = useState(''); // State for GitHub URL
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  // State for summarization results or errors
  const [summaryResult, setSummaryResult] = useState({ summary: '', cool_facts: [], error: null });
  // Remove router instance
  // const router = useRouter();

  // Rename and refactor submit handler
  const handleSummarizeSubmit = async (event) => {
    event.preventDefault();
    if (!apiKey || !githubUrl) {
      setNotification({ message: 'API Key and GitHub URL are required.', type: 'error' });
      return;
    }
    setIsSubmitting(true);
    setNotification({ message: '', type: '' }); // Clear previous notification
    setSummaryResult({ summary: '', cool_facts: [], error: null }); // Clear previous results

    try {
      const response = await fetch('/api/github-summarizer', { // Target the new endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey, // Send API key in header
        },
        body: JSON.stringify({ githubUrl }), // Send GitHub URL in body
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setNotification({ message: 'Summary generated successfully!', type: 'success' });
        setSummaryResult({ summary: data.summary, cool_facts: data.cool_facts || [], error: null });
      } else {
        // Handle errors from the API (validation, rate limit, GitHub fetch, summarization)
        const errorMessage = data.error || `An error occurred (Status: ${response.status})`;
        setNotification({ message: errorMessage, type: 'error' });
        setSummaryResult({ summary: '', cool_facts: [], error: errorMessage });
      }
    } catch (error) {
      console.error("Summarization request failed:", error);
      const errorMessage = 'Network error or failed to reach the server. Please check connection.';
      setNotification({ message: errorMessage, type: 'error' });
      setSummaryResult({ summary: '', cool_facts: [], error: errorMessage });
    } finally {
      setIsSubmitting(false); // Ensure button is re-enabled
    }
  };

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">GitHub Repo Summarizer</h1>

      {/* Display Notification */}
      <Notification message={notification.message} type={notification.type} />

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Update form handler */}
        <form onSubmit={handleSummarizeSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKeyInput" className="block text-sm font-medium text-gray-700 mb-1">
              API Key:
            </label>
            <input
              id="apiKeyInput"
              type="text" // Consider type="password" if the key should be obscured
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key..."
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out disabled:bg-gray-100"
              disabled={isSubmitting}
            />
          </div>

          {/* Input field for GitHub URL */}
          <div>
            <label htmlFor="githubUrlInput" className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Repository URL:
            </label>
            <input
              id="githubUrlInput"
              type="url" // Use type="url" for better semantics/validation
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="e.g., https://github.com/owner/repo"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out disabled:bg-gray-100"
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            disabled={isSubmitting}
          >
            {/* Update button text */}
            {isSubmitting ? 'Summarizing...' : 'Summarize Repository'}
          </button>
        </form>
      </div>

      {/* Section to display results */}
      {(summaryResult.summary || summaryResult.error) && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Results</h2>
          {summaryResult.error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-md text-sm">
              <strong>Error:</strong> {summaryResult.error}
            </div>
          )}
          {summaryResult.summary && (
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Summary:</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{summaryResult.summary}</p>
            </div>
          )}
          {summaryResult.cool_facts && summaryResult.cool_facts.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Cool Facts:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {summaryResult.cool_facts.map((fact, index) => (
                  <li key={index}>{fact}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 