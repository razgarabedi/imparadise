import React, { useState, useEffect } from 'react';
import folderService from '../services/folderService';

const EditFolderModal = ({ isOpen, onClose, onFolderUpdated, folder }) => {
  const [folderName, setFolderName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (folder) {
      setFolderName(folder.name);
      setIsPublic(folder.is_public);
    }
  }, [folder]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await folderService.updateFolder(folder.id, folderName, isPublic);
      onFolderUpdated();
      onClose();
    } catch (err) {
      setError('Failed to update folder.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100" id="modal-title">
                    Edit Folder
                  </h3>
                  <div className="mt-4 w-full">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Folder Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={folderName}
                      onChange={(e) => setFolderName(e.target.value)}
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md"
                      required
                    />
                  </div>
                  <div className="mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                        className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Publicly accessible</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm text-center px-4 pb-2">{error}</p>}
            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-500 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditFolderModal; 