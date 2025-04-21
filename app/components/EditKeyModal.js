'use client';

import { useState, useEffect } from 'react';

export default function EditKeyModal({ isOpen, onClose, onSave, isSaving, editingKey }) {
  const [keyName, setKeyName] = useState('');

  // Pre-fill the form when the editingKey prop changes
  useEffect(() => {
    if (editingKey) {
      setKeyName(editingKey.name || '');
    } else {
      setKeyName('');
    }
  }, [editingKey]);

  const handleSave = () => {
    if (!editingKey) return;
    onSave(editingKey.id, keyName); // Pass ID and new name up
    // Closing is handled by parent component after successful save
  };

  const handleClose = () => {
      // Reset name? Optionally keep it if the user might reopen quickly
      // setKeyName('');
      onClose();
  };

  if (!isOpen || !editingKey) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-75 transition-opacity flex items-center justify-center p-4" aria-labelledby="edit-modal-title" role="dialog" aria-modal="true">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="text-center mb-4">
            <h3 className="text-xl leading-6 font-semibold text-gray-900" id="edit-modal-title">Edit API key</h3>
          </div>
          <p className="text-sm text-center text-gray-500 mb-6">
            Enter a new name for the API key.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="editKeyName" className="block text-sm font-medium text-gray-700 mb-1">
                Key Name <span className="text-gray-500 font-normal">– A unique name to identify this key</span>
              </label>
              <input
                id="editKeyName"
                name="name" // Keep name for potential form handling libraries
                type="text"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="Enter key name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out disabled:bg-gray-50"
                disabled={isSaving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Type <span className="text-gray-500 font-normal">– Environment for this key</span>
              </label>
              <div className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 text-sm">
                {editingKey.type === 'dev' ? 'Development' : 'Production'} (Non-editable)
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={handleSave}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 transition duration-150 ease-in-out"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 transition duration-150 ease-in-out"
            disabled={isSaving}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 