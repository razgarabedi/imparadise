import React from 'react';
import folderService from '../services/folderService';
import './CreateFolderModal.css'; // Reusing the same CSS

const DeleteFolderModal = ({ isOpen, onClose, onFolderDeleted, folder }) => {
  const handleDelete = async () => {
    try {
      await folderService.deleteFolder(folder.id);
      onFolderDeleted();
    } catch (error) {
      console.error("Failed to delete folder:", error);
      // Optionally, show an error message to the user
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete the folder "{folder?.name}"?</p>
        <div className="modal-actions">
          <button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }}>Delete</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteFolderModal; 