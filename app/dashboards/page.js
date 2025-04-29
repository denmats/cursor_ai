'use client';

import { useState, useEffect } from 'react';
import ApiKeyTable from '../components/ApiKeyTable';
import CreateKeyModal from '../components/CreateKeyModal';
import EditKeyModal from '../components/EditKeyModal';
import NewKeyDisplay from '../components/NewKeyDisplay';

// Placeholder Add icon (replace with actual icon)
const AddIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

export default function ApiKeysDashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingKey, setEditingKey] = useState(null);

  // State for displaying the newly created key
  const [newlyCreatedKeyInfo, setNewlyCreatedKeyInfo] = useState(null);

  // UI Interaction State (Copy related)
  const [copiedKeyId, setCopiedKeyId] = useState(null);

  // Fetch API Keys on mount
  useEffect(() => {
    const loadKeys = async () => {
      setIsLoading(true);
      setError(null);
      setNewlyCreatedKeyInfo(null);
      try {
        const response = await fetch('/api/apikeys');
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const keys = await response.json();
        setApiKeys(keys);
      } catch (err) {
        setError(err.message || "Failed to load API keys.");
        console.error("Error loading keys:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadKeys();
  }, []);

  // --- Handler Functions ---

  const handleCreateKey = async (newKeyName) => {
    if (!newKeyName || !newKeyName.trim()) {
        setError("Key name cannot be empty.");
        return;
    }
    setIsProcessing(true);
    setError(null);
    setNewlyCreatedKeyInfo(null);

    try {
      const response = await fetch('/api/apikeys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newKeyName.trim() }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || `Failed to create key (status: ${response.status})`);
      }

      // IMPORTANT: Show the full key ONLY this one time
      // Store the necessary info (including fullKey) temporarily
      setNewlyCreatedKeyInfo({
          id: responseData.id,
          name: responseData.name,
          fullKey: responseData.fullKey
      });

      // Add the key *without* the fullKey to the main list for the table
      const keyForTable = { ...responseData };
      delete keyForTable.fullKey;
      setApiKeys(prevKeys => [keyForTable, ...prevKeys]);

      setShowCreateModal(false);

    } catch (err) {
      setError(err.message || "An unexpected error occurred while creating the key.");
      console.error("Create key error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteKey = async (id) => {
    const keyToDelete = apiKeys.find(key => key.id === id);
    const keyNameToConfirm = keyToDelete ? keyToDelete.name : 'this key';

    if (window.confirm(`Are you sure you want to delete '${keyNameToConfirm}'? This action cannot be undone.`)) {
      setIsProcessing(true);
      setError(null);
      try {
        const response = await fetch(`/api/apikeys/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok && response.status !== 204) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
             throw new Error(errorData.error || `Failed to delete key (status: ${response.status})`);
        }

        setApiKeys(prevKeys => prevKeys.filter(key => key.id !== id));

      } catch (err) {
        setError(err.message || "An unexpected error occurred while deleting.");
        console.error("Delete key error:", err);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleSaveChanges = async (id, newName) => {
    if (!editingKey || id !== editingKey.id || !newName || !newName.trim()) {
        setError("Invalid data for saving changes.");
        return;
    }

    setIsProcessing(true);
    setError(null);
    const finalNewName = newName.trim();

    try {
        const response = await fetch(`/api/apikeys/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: finalNewName }),
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.error || `Failed to update key (status: ${response.status})`);
        }

        setApiKeys(prevKeys =>
            prevKeys.map(key =>
            key.id === id
                ? { ...key, ...responseData }
                : key
            )
        );
        setShowEditModal(false);
        setEditingKey(null);

    } catch (err) {
      setError(err.message || "An unexpected error occurred while saving changes.");
      console.error("Update key error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyKey = async (fullKey, id) => {
    if (!navigator.clipboard) {
      alert("Clipboard API not available in this browser.");
      return;
    }
    try {
      await navigator.clipboard.writeText(fullKey);
      setCopiedKeyId(id);
      setTimeout(() => setCopiedKeyId(null), 2000);
    } catch (err) {
      console.error("Failed to copy API key: ", err);
      alert("Failed to copy key.");
    }
  };

  const handleEditClick = (key) => {
    setError(null);
    setNewlyCreatedKeyInfo(null);
    setEditingKey(key);
    setShowEditModal(true);
  };

  const handleOpenCreateModal = () => {
    setError(null);
    setNewlyCreatedKeyInfo(null);
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
      setShowCreateModal(false);
  };

   const handleCloseEditModal = () => {
      setShowEditModal(false);
      setEditingKey(null);
  };

  // --- Render Logic ---
  return (
    <div className="p-4 sm:p-8">

      {/* Global Error Display (for API errors etc.) */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
           <button onClick={() => setError(null)} className="text-sm text-red-600 hover:text-red-800 ml-4">Dismiss</button>
        </div>
      )}

       {/* Display Newly Created Key (if available) */}
      {newlyCreatedKeyInfo && (
        <NewKeyDisplay
            keyInfo={newlyCreatedKeyInfo}
            onDismiss={() => setNewlyCreatedKeyInfo(null)}
            onCopy={handleCopyKey}
            copiedKeyId={copiedKeyId}
        />
      )}

      {/* API Keys Section Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-800">API Keys</h2>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition duration-150 ease-in-out disabled:opacity-50"
            title="Create New API Key"
            disabled={isLoading || isProcessing}
          >
            <AddIcon />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Manage API keys used to authenticate requests. Remember to store keys securely.
        </p>

        <ApiKeyTable
            apiKeys={apiKeys}
            isLoading={isLoading}
            copiedKeyId={null}
            onEdit={handleEditClick}
            onDelete={handleDeleteKey}
            isActionDisabled={isProcessing}
        />
      </div>

      {/* Create Key Modal Component */}
      <CreateKeyModal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        onCreate={handleCreateKey}
        isSaving={isProcessing}
      />

      {/* Edit Key Modal Component */}
      <EditKeyModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onSave={handleSaveChanges}
        isSaving={isProcessing}
        editingKey={editingKey}
      />

    </div>
  );
}