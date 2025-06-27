import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import folderService from '../services/folderService';
import imageService from '../services/imageService';
import settingsService from '../services/settingsService';
import ImagePreviewModal from './ImagePreviewModal';

const FolderDetail = () => {
  const { folderId } = useParams();
  const [folder, setFolder] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [maxUploadSize, setMaxUploadSize] = useState(10485760); // Default 10MB
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage, setImagesPerPage] = useState(15);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [filesUploaded, setFilesUploaded] = useState(0);
  const [totalFilesToUpload, setTotalFilesToUpload] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const { t } = useTranslation();

  const fetchFolderData = useCallback(async () => {
    try {
      setLoading(true);
      const folderRes = await folderService.getFolderById(folderId);
      setFolder(folderRes.data);
      const imagesRes = await imageService.getImagesInFolder(folderId);
      setImages(imagesRes.data);
    } catch (err) {
      console.error("Failed to fetch folder data:", err);
      setError('Failed to fetch folder data.');
    } finally {
      setLoading(false);
    }
  }, [folderId]);

  useEffect(() => {
    fetchFolderData();
    settingsService.getUserSettings().then(res => {
      const maxSizeSetting = res.data.find(s => s.key === 'max_upload_size');
      if (maxSizeSetting && maxSizeSetting.value) {
        setMaxUploadSize(parseInt(maxSizeSetting.value, 10));
      }
    });
  }, [fetchFolderData]);

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    let uploadSkippedMessage = '';
    if (rejectedFiles && rejectedFiles.length > 0) {
      const rejectedNames = rejectedFiles.map(f => f.file.name).join(', ');
      uploadSkippedMessage = t('folder_detail.skipped_unsupported', { rejectedNames });
    }

    if (acceptedFiles.length === 0) {
      setUploadMessage(uploadSkippedMessage || t('folder_detail.no_valid_files'));
      return;
    }
    
    setIsUploading(true);
    setUploadMessage(uploadSkippedMessage);
    setTotalFilesToUpload(acceptedFiles.length);
    setFilesUploaded(0);
    setError('');

    for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        try {
            const onUploadProgress = (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadMessage(`${t('folder_detail.uploading')} ${i + 1}/${acceptedFiles.length}: ${file.name} - ${percentCompleted}%`);
                if (percentCompleted === 100) {
                    setUploadMessage(t('folder_detail.processing_file', { current: i + 1, total: acceptedFiles.length, filename: file.name }));
                }
            };
            await imageService.uploadImage(file, folderId, onUploadProgress);
            setFilesUploaded(prev => prev + 1);
        } catch (err) {
            console.error(`Upload failed for ${file.name}:`, err);
            let errorMessage = t('errors.upload_failed_for', { filename: file.name });
            if (err.response) {
                const apiError = err.response.data.error || err.response.data.message;
                if (err.response.status === 413) {
                    errorMessage += ` - ${t('errors.storage_limit_exceeded')}`;
                } else if (apiError) {
                    errorMessage += ` - ${apiError}`;
                }
            } else if (err.request) {
                errorMessage += ` - ${t('errors.upload_failed_network')}`;
            }
            setError(prevError => prevError ? `${prevError}\n${errorMessage}` : errorMessage);
        }
    }

    setIsUploading(false);
    setUploadMessage(t('folder_detail.upload_finished'));
    fetchFolderData();
  }, [folderId, fetchFolderData, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {
      'image/*': [
        '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff', '.svg',
        '.heic', '.heif', '.avif', '.jxl', '.jxr', '.ico', '.psd', '.raw',
        '.ppm', '.pgm', '.pbm'
      ]
    }
  });

  const handleDeleteImage = async (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await imageService.deleteImage(imageId);
        fetchFolderData(); // Refresh data
      } catch (err) {
        setError('Failed to delete image.');
      }
    }
  };
  
  const handleDeleteFromPreview = async (imageId) => {
    if (window.confirm(t('folder_detail.confirm_delete'))) {
      try {
        await imageService.deleteImage(imageId);
        
        const updatedImages = images.filter(img => img.id !== imageId);
        setImages(updatedImages);

        if (updatedImages.length === 0) {
          closeImagePreview();
        } else {
          const nextIndex = currentImageIndex >= updatedImages.length
            ? updatedImages.length - 1
            : currentImageIndex;
          
          setSelectedImage(updatedImages[nextIndex]);
          setCurrentImageIndex(nextIndex);
        }
      } catch (err) {
        setError(t('folder_detail.delete_error'));
      }
    }
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      fetchFolderData();
    } catch (err) {
      setError('Failed to delete selected images.');
    }
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
      link.setAttribute('download', `${folderName || 'images'}-selected.zip`);
      
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

  if (loading) return <div className="text-center mt-10">{t('loading')}</div>;
  if (error) return <div className="text-center mt-10 text-danger">{error}</div>;
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Uploader Component */}
      <div className="bg-background p-8 rounded-lg shadow-md mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-text">{t('folder_detail.upload_title', { folderName: folder?.name })}</h2>
          <p className="text-muted">{t('folder_detail.upload_subtitle', { maxSize: Math.round(maxUploadSize / 1024 / 1024) })}</p>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
          <div {...getRootProps()} className={`w-full p-10 border-2 border-dashed rounded-lg text-center cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-100' : 'border-gray-300'}`}>
            <input {...getInputProps()} />
            <p>{t('folder_detail.dropzone_text')}</p>
          </div>
          {isUploading && (
            <div className="w-full mt-4">
              <p>{t('folder_detail.upload_status', { filesUploaded, totalFilesToUpload })}</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${totalFilesToUpload > 0 ? (filesUploaded / totalFilesToUpload) * 100 : 0}%` }}></div>
              </div>
            </div>
          )}
          {uploadMessage && <p className="mt-2 text-sm text-gray-600">{uploadMessage}</p>}
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
      </div>

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
      <div className="flex items-center space-x-4 mb-4">
        <button
          onClick={handleDeleteSelected}
          disabled={selectedImages.length === 0}
          className="bg-danger hover:bg-danger-hover text-white font-medium py-1 px-3 rounded disabled:opacity-50"
        >
          {`${t('folder_detail.delete_selected')} (${selectedImages.length})`}
        </button>
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

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-text">{t('folder_detail.gallery_title')}</h3>
        <button
          onClick={handleDownloadAll}
          className="bg-accent hover:bg-accent-hover text-white font-medium py-1 px-3 rounded"
          disabled={images.length === 0 || isDownloading}
        >
          {isDownloading ? t('folder_detail.downloading') : t('folder_detail.download_all')}
        </button>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
              {/* Selection checkbox */}
              <div className="absolute top-2 left-2">
                <input
                  type="checkbox"
                  checked={selectedImages.includes(image.id)}
                  onChange={() => toggleSelectImage(image.id)}
                  onClick={(e) => e.stopPropagation()} // Prevent opening modal
                  className="form-checkbox h-5 w-5 text-accent bg-background border-border rounded focus:ring-accent"
                />
              </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <p className="text-sm text-muted truncate">{image.filename}</p>
              <div className="flex-grow"></div>
              <div className="flex justify-between items-center mt-2">
                <button 
                  onClick={() => handleDownload(image.url, image.filename)} 
                  className="text-accent hover:underline text-xs"
                >
                  {t('download')}
                </button>
                <button 
                  onClick={() => handleDeleteImage(image.id)} 
                  className="text-danger hover:underline text-xs"
                >
                  {t('delete')}
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
          <span className="text-text">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-1 bg-muted text-text rounded-md disabled:opacity-50"
          >
            {t('next')}
          </button>
        </div>
      )}

      {selectedImage && (
        <ImagePreviewModal 
          isOpen={!!selectedImage}
          image={selectedImage} 
          onClose={closeImagePreview} 
          onDelete={handleDeleteFromPreview}
          handleDownload={handleDownload}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
    </div>
  );
};

export default FolderDetail; 