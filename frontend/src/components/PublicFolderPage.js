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
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage, setImagesPerPage] = useState(15);
  const [selectedImages, setSelectedImages] = useState([]);

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

  // Responsive images per page
  useEffect(() => {
    const updateImagesPerPage = () => {
      if (window.innerWidth < 640) {
        setImagesPerPage(10);
      } else {
        setImagesPerPage(15);
      }
    };
    updateImagesPerPage();
    window.addEventListener('resize', updateImagesPerPage);
    return () => window.removeEventListener('resize', updateImagesPerPage);
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(images.length / imagesPerPage);
  const paginatedImages = images.slice((currentPage - 1) * imagesPerPage, currentPage * imagesPerPage);

  // Reset to first page if images or imagesPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [imagesPerPage, images.length]);

  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  // Toggle selection for a single image
  const toggleSelectImage = (imageId) => {
    setSelectedImages((prev) =>
      prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]
    );
  };

  // Select all images on current page
  const selectAllOnPage = () => {
    const idsOnPage = paginatedImages.map((img) => img.id);
    setSelectedImages((prev) => {
      const allSelected = idsOnPage.every((id) => prev.includes(id));
      if (allSelected) {
        // Unselect all on page
        return prev.filter((id) => !idsOnPage.includes(id));
      } else {
        // Add all on page
        return Array.from(new Set([...prev, ...idsOnPage]));
      }
    });
  };

  // Delete selected images
  const handleDeleteSelected = async () => {
    if (selectedImages.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedImages.length} image(s)?`)) return;
    try {
      for (const imageId of selectedImages) {
        await imageService.deleteImage(imageId);
      }
      setSelectedImages([]);
      fetchPublicFolderData();
    } catch (err) {
      setError('Failed to delete selected images.');
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">{folder?.name}</h2>
      
      {images.length > 0 ? (
        <>
        {/* Bulk Actions */}
        <div className="flex items-center mb-4 gap-2">
          <button
            onClick={handleDeleteSelected}
            disabled={selectedImages.length === 0}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {`Delete Selected (${selectedImages.length})`}
          </button>
          <button
            onClick={selectAllOnPage}
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold py-2 px-4 rounded"
          >
            {paginatedImages.every((img) => selectedImages.includes(img.id)) ? 'Unselect All on Page' : 'Select All on Page'}
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {paginatedImages.map((image) => (
            <div key={image.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
              <div className="cursor-pointer relative" onClick={() => setSelectedImage(image)}>
                <img 
                  src={image.thumbnail_url || image.url} 
                  alt={image.filename} 
                  className="object-cover w-full h-48" 
                  onError={(e) => {
                    if (e.target.src !== image.url) {
                      e.target.src = image.url;
                    }
                  }}
                />
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600 flex justify-around items-center gap-2">
                <button onClick={() => handleDownload(image.url)} className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                </button>
                <input
                  type="checkbox"
                  checked={selectedImages.includes(image.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleSelectImage(image.id);
                  }}
                  className="w-5 h-5 accent-indigo-600 bg-white rounded shadow"
                  title="Select for bulk actions"
                />
              </div>
            </div>
          ))}
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
            >
              &lt;
            </button>
            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx + 1}
                onClick={() => setCurrentPage(idx + 1)}
                className={`px-3 py-1 rounded ${currentPage === idx + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        )}
        </>
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