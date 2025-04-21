'use client';

import { useState, useEffect } from 'react';
import { fetchApiKeys, createApiKey, deleteApiKey, updateApiKeyName } from '../../lib/apiKeysService';
import ApiKeyTable from '../components/ApiKeyTable';
import CreateKeyModal from '../components/CreateKeyModal';
import EditKeyModal from '../components/EditKeyModal';

// Placeholder Add icon (replace with actual icon)
const AddIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

export default function ApiKeysDashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false); // Used for Create/Edit/Delete operations
  const [error, setError] = useState(null);

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingKey, setEditingKey] = useState(null); // Stores the key being edited

  // UI Interaction States
  const [visibleKeyId, setVisibleKeyId] = useState(null);
  const [copiedKeyId, setCopiedKeyId] = useState(null);

  // Fetch API Keys on mount
  useEffect(() => {
    const loadKeys = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const keys = await fetchApiKeys();
        setApiKeys(keys);
      } catch (err) {
        setError(err.message || "Failed to load API keys.");
      } finally {
        setIsLoading(false);
      }
    };
    loadKeys();
  }, []);

  // --- Handler Functions ---

  const handleCreateKey = async (newKeyName) => {
    setIsSaving(true);
    setError(null);

    // Basic key generation (consider moving to service or backend)
    const keyNameOrDefault = newKeyName.trim() || `Key-${Date.now().toString().slice(-4)}`;
    const keyType = 'dev'; // Hardcoded for now
    const keyPrefix = `dmatsai-${keyType}-`;
    const randomPart = Math.random().toString(36).substring(2);
    const fullKey = `${keyPrefix}${Date.now()}${randomPart}`;
    const previewLength = keyPrefix.length + 8;
    const keyPreview = `${fullKey.substring(0, previewLength)}**********************`;

    const keyData = {
        name: keyNameOrDefault,
        type: keyType,
        usage: 0,
        key_preview: keyPreview,
        full_key: fullKey,
    };

    try {
      const newlyCreatedKey = await createApiKey(keyData);
      // Add the new key (returned from service) to the local state
      setApiKeys(prevKeys => [newlyCreatedKey, ...prevKeys]);
      setShowCreateModal(false);

      // IMPORTANT: Show the full key ONLY this one time using alert (consider a better UX)
      alert(`Key Created!\nName: ${newlyCreatedKey.name}\nFull Key: ${newlyCreatedKey.full_key}\n\nThis key will only be shown once. Store it securely.`);

    } catch (err) {
      setError(err.message || "An unexpected error occurred while creating the key.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteKey = async (id) => {
    const keyToDelete = apiKeys.find(key => key.id === id);
    const keyNameToConfirm = keyToDelete ? keyToDelete.name : 'this key';

    if (window.confirm(`Are you sure you want to delete '${keyNameToConfirm}'? This action cannot be undone.`)) {
      setIsSaving(true);
      setError(null);
      try {
        await deleteApiKey(id);
        setApiKeys(prevKeys => prevKeys.filter(key => key.id !== id));
        if (visibleKeyId === id) {
          setVisibleKeyId(null); // Hide if it was visible
        }
        // Add success notification/toast here?
      } catch (err) {
        setError(err.message || "An unexpected error occurred while deleting.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSaveChanges = async (id, newName) => {
    if (!editingKey || id !== editingKey.id) return; // Ensure we are saving the correct key

    setIsSaving(true);
    setError(null);
    const finalNewName = newName.trim() || `Key-${id.slice(-4)}`;

    try {
      const updatedKeyData = await updateApiKeyName(id, finalNewName);

      // Update the key in the local state using the returned data
      setApiKeys(prevKeys =>
        prevKeys.map(key =>
          key.id === id
            ? { ...key, ...updatedKeyData } // Merge existing and updated data
            : key
        )
      );
      setShowEditModal(false);
      setEditingKey(null);
       // Add success notification/toast here?
    } catch (err) {
      setError(err.message || "An unexpected error occurred while saving changes.");
      // Keep the modal open on error?
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleKeyVisibility = (id) => {
    setVisibleKeyId(prevVisibleId => (prevVisibleId === id ? null : id));
  };

  const handleCopyKey = async (fullKey, id) => {
    if (!navigator.clipboard) {
      alert("Clipboard API not available."); // Simple feedback
      return;
    }
    try {
      await navigator.clipboard.writeText(fullKey);
      setCopiedKeyId(id);
      setTimeout(() => setCopiedKeyId(null), 1500); // Reset feedback
    } catch (err) {
      console.error("Failed to copy API key: ", err);
      alert("Failed to copy key."); // Simple feedback
    }
  };

  const handleEditClick = (key) => {
    setEditingKey(key);
    setShowEditModal(true);
  };

  const handleCloseCreateModal = () => {
      setShowCreateModal(false);
      setError(null); // Clear error when closing modal
  };

   const handleCloseEditModal = () => {
      setShowEditModal(false);
      setEditingKey(null);
      setError(null); // Clear error when closing modal
  };

  // --- Render Logic ---
  return (
    // Use a wrapper div if needed, or directly render content
    // The outer min-h-screen and container were previously here, but might belong in the layout
    <div className="p-4 sm:p-8"> {/* Padding adjusted from layout */}

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* API Keys Section Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-800">API Keys</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition duration-150 ease-in-out disabled:opacity-50"
            title="Create New API Key"
            disabled={isLoading || isSaving} // Disable button during any loading state
          >
            <AddIcon />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          The key is used to authenticate your requests to the API. To learn more, see the <a href="#" className="text-indigo-600 hover:underline">documentation page</a>.
        </p>

        {/* API Keys Table Component */}
        <ApiKeyTable
            apiKeys={apiKeys}
            isLoading={isLoading}
            visibleKeyId={visibleKeyId}
            copiedKeyId={copiedKeyId}
            onToggleVisibility={handleToggleKeyVisibility}
            onCopy={handleCopyKey}
            onEdit={handleEditClick}
            onDelete={handleDeleteKey}
            isActionDisabled={isSaving} // Disable row actions during create/edit/delete
        />
      </div>

      {/* Create Key Modal Component */}
      <CreateKeyModal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        onCreate={handleCreateKey}
        isSaving={isSaving}
      />

      {/* Edit Key Modal Component */}
      <EditKeyModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onSave={handleSaveChanges}
        isSaving={isSaving}
        editingKey={editingKey} // Pass the key object being edited
      />

    </div>
  );
}