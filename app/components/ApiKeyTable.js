'use client';

import { useState } from 'react';

// Placeholder icons (replace with actual icons)
const EyeIcon = () => '👁️';
const EyeSlashIcon = () => '🔒';
const ClipboardIcon = () => '📋';
const CheckIcon = () => '✅';
const PencilIcon = () => '✏️';
const TrashIcon = () => '🗑️';

// --- ApiKeyRow Component ---
function ApiKeyRow({ apiKey, isVisible, isCopied, onToggleVisibility, onCopy, onEdit, onDelete, isActionDisabled }) {
  return (
    <tr key={apiKey.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{apiKey.name}</td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{apiKey.type}</td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{apiKey.usage}</td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        <span className="inline-block bg-gray-100 px-3 py-1 rounded-md font-mono text-xs border border-gray-200 shadow-sm">
          {isVisible ? apiKey.full_key : apiKey.key_preview} {/* Use DB column names */} 
        </span>
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleVisibility(apiKey.id)}
            title={isVisible ? "Hide Key" : "View Key"}
            className="p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={isActionDisabled}
          >
            {isVisible ? <EyeSlashIcon /> : <EyeIcon />}
          </button>
          <button
            onClick={() => onCopy(apiKey.full_key, apiKey.id)} // Use full_key
            title="Copy Key"
            className={`p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 ${isCopied ? 'text-green-500' : ''}`}
            disabled={isActionDisabled}
          >
            {isCopied ? <CheckIcon /> : <ClipboardIcon />}
          </button>
          <button
            onClick={() => onEdit(apiKey)} // Pass the whole key object
            title="Edit Key"
            className="p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={isActionDisabled}
          >
            <PencilIcon />
          </button>
          <button
            onClick={() => onDelete(apiKey.id)}
            title="Delete Key"
            className="p-1 rounded-md text-red-400 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            disabled={isActionDisabled}
          >
            <TrashIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}

// --- ApiKeyTable Component ---
export default function ApiKeyTable({ apiKeys, isLoading, visibleKeyId, copiedKeyId, onToggleVisibility, onCopy, onEdit, onDelete, isActionDisabled }) {

  if (isLoading && apiKeys.length === 0) {
    return (
      <div className="min-w-full">
          <div className="px-4 py-4 text-center text-sm text-gray-500">Loading keys...</div>
      </div>
    );
  }

  if (!isLoading && apiKeys.length === 0) {
    return (
      <div className="min-w-full">
        <div className="px-4 py-4 text-center text-sm text-gray-500">No API keys found. Create one to get started.</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
        <table className="min-w-full">
            <thead>
            <tr className="border-b border-gray-200">
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Options</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {apiKeys.map((key) => (
                    <ApiKeyRow
                        key={key.id}
                        apiKey={key}
                        isVisible={visibleKeyId === key.id}
                        isCopied={copiedKeyId === key.id}
                        onToggleVisibility={onToggleVisibility}
                        onCopy={onCopy}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        isActionDisabled={isActionDisabled}
                    />
                ))}
            </tbody>
        </table>
    </div>
  );
} 