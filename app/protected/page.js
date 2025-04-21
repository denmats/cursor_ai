'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { validateApiKey } from '../../lib/apiKeysService';

// Define Notification component locally or import from a components file
function Notification({ message, type }) {
    const baseClasses = "p-4 mb-4 rounded-md text-sm";
    const typeClasses = type === 'success'
        ? "bg-green-100 border border-green-300 text-green-800"
        : "bg-red-100 border border-red-300 text-red-800";

    if (!message) return null;

    return (
        <div className={`${baseClasses} ${typeClasses}`} role="alert">
            {message}
        </div>
    );
}

function ProtectedContent() {
    const searchParams = useSearchParams();
    const apiKey = searchParams.get('apiKey');
    const [validationStatus, setValidationStatus] = useState('idle'); // idle, loading, success, error
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => {
        if (!apiKey) {
            setValidationStatus('error');
            setNotification({ message: 'No API Key provided.', type: 'error' });
            return;
        }

        const checkKey = async () => {
            setValidationStatus('loading');
            setNotification({ message: 'Validating API Key...', type: 'info' }); // Optional loading state
            try {
                const isValid = await validateApiKey(apiKey);
                if (isValid) {
                    setValidationStatus('success');
                    setNotification({ message: 'Valid API key', type: 'success' });
                } else {
                    setValidationStatus('error');
                    setNotification({ message: 'Invalid API key', type: 'error' });
                }
            } catch (error) {
                // Handle potential errors from the service function (e.g., network issues)
                console.error("Validation error:", error);
                setValidationStatus('error');
                setNotification({ message: 'Error validating API key. Please try again.', type: 'error' });
            }
        };

        checkKey();
    }, [apiKey]); // Re-run effect if apiKey changes

    return (
        <div className="p-4 sm:p-8">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Protected Area</h1>

            {/* Display Notification */}
            <Notification message={notification.message} type={notification.type} />

            {/* Optionally display content only if key is valid */}
            {validationStatus === 'success' && (
                <div className="bg-white rounded-lg shadow-md p-6 mt-4">
                    <p className="text-gray-700">API Key is valid. You can now access protected content or features.</p>
                    {/* Add actual protected content here */}
                </div>
            )}
        </div>
    );
}

// Wrap the component using useSearchParams with Suspense
export default function ProtectedPage() {
    return (
        <Suspense fallback={<div className="p-8">Loading...</div>}>
            <ProtectedContent />
        </Suspense>
    );
} 