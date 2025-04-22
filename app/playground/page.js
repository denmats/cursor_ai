'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setNotification({ message: '', type: '' }); // Clear previous notification

    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setNotification({ message: 'Valid API key. Redirecting...', type: 'success' });
        // Redirect after a short delay to allow user to see the message
        setTimeout(() => {
          router.push('/protected');
        }, 1500);
      } else {
        // Handle invalid key or errors reported by the API route (like missing key)
        setNotification({ message: data.error || 'Invalid API key', type: 'error' });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Validation request failed:", error);
      setNotification({ message: 'Error validating key. Please check connection and try again.', type: 'error' });
      setIsSubmitting(false);
    }
    // Note: Don't set isSubmitting to false here if redirecting, to keep button disabled
  };

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">API Playground</h1>

      {/* Display Notification */}
      <Notification message={notification.message} type={notification.type} />

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKeyInput" className="block text-sm font-medium text-gray-700 mb-1">
              Enter your API Key:
            </label>
            <input
              id="apiKeyInput"
              type="text" // Consider type="password" if needed
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key here..."
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out disabled:bg-gray-100"
              disabled={isSubmitting} // Disable input while submitting
            />
          </div>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            disabled={isSubmitting} // Disable button while submitting
          >
            {isSubmitting ? 'Validating...' : 'Validate Key'}
          </button>
        </form>
      </div>
    </div>
  );
} 