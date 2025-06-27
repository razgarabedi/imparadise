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
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

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

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const handleDownloadSelected = async () => {
    if (selectedImages.length === 0) return;
    setIsDownloading(true);
    setDownloadProgress(0);
    try {
      const response = await imageService.downloadImages(
        { imageIds: selectedImages },
        (progressEvent) => {
          setDownloadProgress(progressEvent.loaded);
        }
      );
      
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const folderName = folder.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.setAttribute('download', `${folderName || 'images'}.zip`);
      
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(t('folder_detail.download_error'));
      console.error("Download failed", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadAll = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    try {
      const response = await folderService.downloadFolder(
        folderId,
        (progressEvent) => {
          setDownloadProgress(progressEvent.loaded);
        }
      );
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const folderName = folder.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.setAttribute('download', `${folderName || 'images'}.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(t('folder_detail.download_error'));
      console.error("Download failed", err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) return <div className="text-center mt-10">{t('loading')}</div>;
  if (error) return <div className="text-center mt-10 text-danger">{error}</div>;

  const openImagePreview = (image) => {
    const index = images.findIndex(img => img.id === image.id);
    setCurrentImageIndex(index);
    setSelectedImage(image);
  };

  const closeImagePreview = () => {
    setSelectedImage(null);
    setCurrentImageIndex(null);
  };

  const handleNext = () => {
    if (currentImageIndex === null) return;
    const nextIndex = (currentImageIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
    setCurrentImageIndex(nextIndex);
  };

  const handlePrevious = () => {
    if (currentImageIndex === null) return;
    const nextIndex = (currentImageIndex - 1 + images.length) % images.length;
    setSelectedImage(images[nextIndex]);
    setCurrentImageIndex(nextIndex);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-text">{folder?.name}</h2>
        <button
          onClick={handleDownloadAll}
          className="bg-accent hover:bg-accent-hover text-white font-medium py-1 px-3 rounded"
          disabled={images.length === 0 || isDownloading}
        >
          {isDownloading ? t('folder_detail.downloading') : t('folder_detail.download_all')}
        </button>
      </div>
      
      {images.length > 0 ? (
        <>
        {isDownloading && (
          <div className="mb-4">
            <p className="text-text">
              {t('folder_detail.downloading_images')}... {(downloadProgress / 1024 / 1024).toFixed(2)} MB
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
              <div className="bg-blue-600 h-2.5 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
        {/* Bulk Actions */}
        <div className="flex items-center mb-4 gap-2">
            <button
                onClick={handleDownloadSelected}
                disabled={selectedImages.length === 0 || isDownloading}
                className="bg-primary hover:bg-primary-dark text-white font-medium py-1 px-3 rounded disabled:opacity-50"
            >
                {isDownloading ? t('folder_detail.downloading') : `${t('folder_detail.download_selected')} (${selectedImages.length})`}
            </button>
            <button
                onClick={selectAllOnPage}
                className="bg-muted text-text font-medium py-1 px-3 rounded"
            >
                {paginatedImages.every((img) => selectedImages.includes(img.id)) ? t('folder_detail.unselect_all_on_page') : t('folder_detail.select_all_on_page')}
            </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {paginatedImages.map((image) => (
            <div key={image.id} className="bg-background rounded-lg shadow-md overflow-hidden flex flex-col">
              <div className="cursor-pointer relative" onClick={() => openImagePreview(image)}>
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
                <div className="absolute top-2 left-2">
                  <input
                    type="checkbox"
                    checked={selectedImages.includes(image.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSelectImage(image.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="form-checkbox h-5 w-5 text-accent bg-background border-border rounded focus:ring-accent"
                    title={t('select_for_bulk_actions')}
                  />
                </div>
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <p className="text-sm text-muted truncate">{image.filename}</p>
                <div className="flex-grow"></div>
                <div className="mt-2 flex justify-end">
                  <button onClick={() => handleDownload(image.url, image.filename)} className="text-accent hover:underline text-xs">
                    {t('download')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination Controls */}
        {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8">
                <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 mx-1 bg-muted text-text rounded-md disabled:opacity-50"
                >
                {t('previous')}
                </button>
                <span className="text-text">{`${t('page')} ${currentPage} ${t('of')} ${totalPages}`}</span>
                <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 mx-1 bg-muted text-text rounded-md disabled:opacity-50"
                >
                {t('next')}
                </button>
            </div>
        )}
        </>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-muted">{t('public_folder.empty_folder')}</h3>
        </div>
      )}

      {selectedImage && (
        <ImagePreviewModal 
            isOpen={!!selectedImage}
            onClose={closeImagePreview}
            image={selectedImage}
            handleDownload={handleDownload}
            onNext={handleNext}
            onPrevious={handlePrevious}
        />
      )}
    </div>
  );
};

export default PublicFolderPage; 