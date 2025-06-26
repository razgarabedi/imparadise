import React, { useState } from 'react';
import folderService from '../services/folderService';
import './CreateFolderModal.css';

const CreateFolderModal = ({ isOpen, onClose, onFolderCreated }) => {
  const [name, setName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState('');

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    try {
      await folderService.createFolder(name, isPublic);
      onFolderCreated();
    } catch (err) {
      setError('Failed to create folder.');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleCreateFolder}>
          <h2>Create New Folder</h2>
          {error && <p className="error">{error}</p>}
          <div>
            <label>Folder Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              Public
            </label>
          </div>
          <div className="modal-actions">
            <button type="submit">Create</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolderModal; 