import React, { useState, useEffect } from 'react';
import folderService from '../services/folderService';
import './CreateFolderModal.css'; // Reusing the same CSS

const EditFolderModal = ({ isOpen, onClose, onFolderUpdated, folder }) => {
  const [name, setName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (folder) {
      setName(folder.name);
      setIsPublic(folder.is_public);
    }
  }, [folder]);

  const handleUpdateFolder = async (e) => {
    e.preventDefault();
    try {
      await folderService.updateFolder(folder.id, name, isPublic);
      onFolderUpdated();
    } catch (err) {
      setError('Failed to update folder.');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleUpdateFolder}>
          <h2>Edit Folder</h2>
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
            <button type="submit">Update</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFolderModal; 