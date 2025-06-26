import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import folderService from '../services/folderService';
import CreateFolderModal from './CreateFolderModal';
import EditFolderModal from './EditFolderModal';
import DeleteFolderModal from './DeleteFolderModal';

const Dashboard = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedFolder, setSelectedFolder] = useState(null);

  const fetchFolders = () => {
    folderService.getFolders().then(
      (response) => {
        setFolders(response.data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching folders:", error);
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const handleFolderCreated = () => {
    setIsCreateModalOpen(false);
    fetchFolders();
  };

  const handleFolderUpdated = () => {
    setIsEditModalOpen(false);
    setSelectedFolder(null);
    fetchFolders();
  };

  const handleFolderDeleted = () => {
    setIsDeleteModalOpen(false);
    setSelectedFolder(null);
    fetchFolders();
  };

  const openEditModal = (folder) => {
    setSelectedFolder(folder);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (folder) => {
    setSelectedFolder(folder);
    setIsDeleteModalOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={() => setIsCreateModalOpen(true)}>Create New Folder</button>
      
      <CreateFolderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onFolderCreated={handleFolderCreated}
      />
      
      <EditFolderModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onFolderUpdated={handleFolderUpdated}
        folder={selectedFolder}
      />

      <DeleteFolderModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onFolderDeleted={handleFolderDeleted}
        folder={selectedFolder}
      />

      <h3>Your Folders</h3>
      <ul>
        {folders.map((folder) => (
          <li key={folder.id}>
            <Link to={`/folders/${folder.id}`}>{folder.name}</Link>
            <button onClick={() => openEditModal(folder)} style={{ marginLeft: '10px' }}>Edit</button>
            <button onClick={() => openDeleteModal(folder)} style={{ marginLeft: '5px' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard; 