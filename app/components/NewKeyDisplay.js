'use client';

import React from 'react'; // Import React if not implicitly available

// Simple Checkmark Icon for copy success
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 inline-block">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

// Simple Copy Icon
const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1 inline-block">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5-.124m7.5 10.375h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876V5.25a.75.75 0 00-.75-.75h-7.5a.75.75 0 00-.75.75v11.25c0 .621.504 1.125 1.125 1.125h9.75a1.125 1.125 0 001.125-1.125zm-17.25-1.125l.25.001M15 11.25l.25.001M15 14.25l.25.001" />
    </svg>
);


export default function NewKeyDisplay({ keyInfo, onDismiss, onCopy, copiedKeyId }) {
    if (!keyInfo) {
        return null;
    }

    const hasCopied = copiedKeyId === keyInfo.id;

    const handleCopy = () => {
        if (onCopy && typeof onCopy === 'function') {
            onCopy(keyInfo.fullKey, keyInfo.id);
        }
    };

    return (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-800 p-4 mb-6 rounded-md shadow relative" role="alert">
            <button
                onClick={onDismiss}
                className="absolute top-1 right-1 text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-400"
                aria-label="Dismiss notification"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <h3 className="font-bold text-lg mb-2">API Key Created Successfully</h3>
            <p className="mb-1">
                <span className="font-semibold">Name:</span> {keyInfo.name}
            </p>
            <p className="mb-3 text-sm">
                <span className="font-semibold text-red-600">Important:</span> This is the only time your full API key will be shown. Please copy it and store it securely.
            </p>

            <div className="bg-gray-100 p-3 rounded font-mono text-sm break-all mb-3 relative">
                <code>{keyInfo.fullKey}</code>
                <button
                    onClick={handleCopy}
                    disabled={hasCopied}
                    className={`absolute top-1 right-1 p-1 rounded ${hasCopied ? 'text-green-600 bg-green-100' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'} focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors duration-150`}
                    aria-live="polite" // Announce change when copied
                    aria-label={hasCopied ? "Copied API Key" : "Copy API Key"}
                >
                    {hasCopied ? <CheckIcon /> : <CopyIcon />}
                </button>
            </div>

            <button
                onClick={onDismiss}
                className="mt-2 px-4 py-1 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
                Got it!
            </button>
        </div>
    );
}
