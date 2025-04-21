'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState('');
  const router = useRouter(); // Initialize router

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    // Navigate to the protected page with the API key as a query parameter
    router.push(`/protected?apiKey=${encodeURIComponent(apiKey)}`);
  };

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">API Playground</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKeyInput" className="block text-sm font-medium text-gray-700 mb-1">
              Enter your API Key:
            </label>
            <input
              id="apiKeyInput"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key here..."
              required // Make the field required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
            />
          </div>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm disabled:opacity-50 transition duration-150 ease-in-out"
          >
            Validate Key
          </button>
        </form>
      </div>
    </div>
  );
} 