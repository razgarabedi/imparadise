import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import folderService from '../services/folderService';
import CreateFolderModal from './CreateFolderModal';
import EditFolderModal from './EditFolderModal';
import DeleteFolderModal from './DeleteFolderModal';

const Dashboard = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedFolderId, setCopiedFolderId] = useState(null);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedFolder, setSelectedFolder] = useState(null);

  const { t } = useTranslation();

  const fetchFolders = useCallback(() => {
    setLoading(true);
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
  }, []);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

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

  const handleShareFolder = (folderId) => {
    const url = `${window.location.origin}/public/folders/${folderId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedFolderId(folderId);
      setTimeout(() => setCopiedFolderId(null), 2000); // Reset after 2 seconds
    });
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t('dashboard.title')}</h2>
        <button 
          onClick={() => setIsCreateModalOpen(true)} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          {t('dashboard.create_folder')}
        </button>
      </div>
      
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

      {folders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {folders.map((folder) => (
            <div key={folder.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
              <Link to={`/folders/${folder.id}`} className="block p-6">
                <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100 truncate">{folder.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{folder.is_public ? t('dashboard.public') : t('dashboard.private')}</p>
              </Link>
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex justify-end items-center space-x-2">
                {folder.is_public && (
                  <button onClick={() => handleShareFolder(folder.id)} className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 transition-colors duration-300 relative">
                    {copiedFolderId === folder.id ? (
                      <span className="text-sm text-indigo-600 dark:text-indigo-400">{t('dashboard.copied')}</span>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 8.586V3a1 1 0 10-2 0v5.586L8.707 7.293zM3 9a2 2 0 012-2h1a1 1 0 010 2H5v7h10V9h-1a1 1 0 110-2h1a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg>
                    )}
                  </button>
                )}
                <button onClick={() => openEditModal(folder)} className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>
                </button>
                <button onClick={() => openDeleteModal(folder)} className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 p-2 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd"></path></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{t('dashboard.no_folders_title')}</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{t('dashboard.no_folders_subtitle')}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 