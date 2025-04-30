'use client';

import { useState } from 'react';
// Remove Sidebar import - handled by layout.js
// import Sidebar from '../components/Sidebar';

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

// --- Remove the inline Sidebar function (already done) ---

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [summaryResult, setSummaryResult] = useState({ summary: '', cool_facts: [], error: null });

  // --- Remove sidebar state and toggle function ---
  // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // const handleToggleSidebar = () => { ... };

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

  // --- Remove the outer layout div and main tag adjustments ---
  // The content returned here will be the 'children' prop in layout.js
  return (
    // The layout provides the outer structure and padding (pt-16, px-4, sm:px-8)
    // We only need to return the specific content for this page.
    <>
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">GitHub Repo Summarizer</h1>

        {/* Display Notification */}
        <Notification message={notification.message} type={notification.type} />

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form onSubmit={handleSummarizeSubmit} className="space-y-4">
                {/* API Key Input */}
                <div>
                    <label htmlFor="apiKeyInput" className="block text-sm font-medium text-gray-700 mb-1">
                        API Key:
                    </label>
                    <input
                        id="apiKeyInput"
                        type="text"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter your API key..."
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out disabled:bg-gray-100"
                        disabled={isSubmitting}
                    />
                </div>

                {/* GitHub URL Input */}
                <div>
                    <label htmlFor="githubUrlInput" className="block text-sm font-medium text-gray-700 mb-1">
                        GitHub Repository URL:
                    </label>
                    <input
                        id="githubUrlInput"
                        type="url"
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
                    {isSubmitting ? 'Summarizing...' : 'Summarize Repository'}
                </button>
            </form>
        </div>

        {/* Results Section */}
        {(summaryResult.summary || summaryResult.error) && (
            <div className="bg-white rounded-lg shadow-md p-6">
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
    </> // Use a Fragment as the root element
  );
} 