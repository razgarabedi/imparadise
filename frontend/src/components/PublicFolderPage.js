import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import folderService from '../services/folderService';
import imageService from '../services/imageService';
import ImagePreviewModal from './ImagePreviewModal';

const PublicFolderPage = () => {
  const { folderId } = useParams();
  const [folder, setFolder] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const { t } = useTranslation();

  const fetchPublicFolderData = useCallback(async () => {
    try {
      setLoading(true);
      const folderRes = await folderService.getFolderById(folderId);
      if (!folderRes.data.is_public) {
        setError('This folder is not public.');
        return;
      }
      setFolder(folderRes.data);

      const imagesRes = await imageService.getImagesInFolder(folderId);
      setImages(imagesRes.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Folder not found.');
      } else {
        setError('Failed to fetch folder data.');
      }
    } finally {
      setLoading(false);
    }
  }, [folderId]);

  useEffect(() => {
    fetchPublicFolderData();
  }, [fetchPublicFolderData]);

  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">{folder?.name}</h2>
      
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image) => (
            <div key={image.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
              <div className="cursor-pointer" onClick={() => setSelectedImage(image)}>
                <img src={image.url} alt={image.filename} className="object-cover w-full h-48" />
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600 flex justify-around items-center">
                <button onClick={() => handleDownload(image.url)} className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{t('public_folder.empty_folder')}</h3>
        </div>
      )}

      <ImagePreviewModal 
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        image={selectedImage}
        handleDownload={handleDownload}
      />
    </div>
  );
};

export default PublicFolderPage; 