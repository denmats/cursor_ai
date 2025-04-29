'use client';

// Using simple text for icons for now, replace with actual icon components if available
const PencilIcon = () => '✏️';
const TrashIcon = () => '🗑️';

// --- ApiKeyRow Component (Simplified) ---
// Removed isVisible, isCopied, onToggleVisibility, onCopy props and related logic
function ApiKeyRow({ apiKey, onEdit, onDelete, isActionDisabled }) {
  return (
    <tr key={apiKey.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 align-middle">
        {apiKey.name}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 align-middle">
        {apiKey.type || 'N/A'} {/* Show N/A if type is missing */}
      </td>
       <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 align-middle">
        {apiKey.usage !== undefined ? apiKey.usage : 'N/A'} {/* Handle potential missing usage */}
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 align-middle">
        <span className="inline-block bg-gray-100 px-3 py-1 rounded-md font-mono text-xs border border-gray-200 shadow-sm">
          {apiKey.key_preview}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium align-middle">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(apiKey)} // Pass the whole key object
            title="Edit Key Name"
            className="p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={isActionDisabled}
            aria-label={`Edit API key named ${apiKey.name}`}
          >
            <PencilIcon />
          </button>
          <button
            onClick={() => onDelete(apiKey.id)}
            title="Delete Key"
            className="p-1 rounded-md text-red-400 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            disabled={isActionDisabled}
             aria-label={`Delete API key named ${apiKey.name}`}
          >
            <TrashIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}

// --- ApiKeyTable Component (Simplified) ---
// Removed visibleKeyId, copiedKeyId, onToggleVisibility, onCopy props
export default function ApiKeyTable({ apiKeys, isLoading, onEdit, onDelete, isActionDisabled }) {

  // Loading State
  if (isLoading) { // Show loading indicator even if there are stale keys visible
    return (
      <div className="min-w-full">
          <div className="px-4 py-4 text-center text-sm text-gray-500">Loading keys...</div>
      </div>
    );
  }

  // Empty State (after loading)
  if (!apiKeys || apiKeys.length === 0) {
    return (
      <div className="min-w-full">
        <div className="px-4 py-4 text-center text-sm text-gray-500">
            No API keys found. Create one using the button above to get started.
        </div>
      </div>
    );
  }

  // Table Display
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Preview</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {apiKeys.map((key) => (
                    <ApiKeyRow
                        key={key.id}
                        apiKey={key}
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