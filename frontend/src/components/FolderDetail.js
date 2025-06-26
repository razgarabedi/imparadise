import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import folderService from '../services/folderService';
import imageService from '../services/imageService';
import adminService from '../services/adminService';
import ImagePreviewModal from './ImagePreviewModal';

const FolderDetail = () => {
  const { folderId } = useParams();
  const [folder, setFolder] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [maxUploadSize, setMaxUploadSize] = useState(10485760); // Default 10MB
  const [selectedImage, setSelectedImage] = useState(null);
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage, setImagesPerPage] = useState(15);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);

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
    adminService.getSettings().then(res => {
      const maxSizeSetting = res.data.find(s => s.key === 'max_upload_size');
      if (maxSizeSetting) {
        setMaxUploadSize(parseInt(maxSizeSetting.value, 10));
      }
    });
  }, [fetchFolderData]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    let uploadSkippedMessage = '';
    if (rejectedFiles.length > 0) {
      const rejectedNames = rejectedFiles.map(f => f.file.name).join(', ');
      uploadSkippedMessage = `Skipped unsupported files: ${rejectedNames}`;
    }

    if (acceptedFiles.length === 0) {
      setUploadMessage(uploadSkippedMessage || 'No valid files to upload.');
      return;
    }
    
    setIsUploading(true);
    setUploadMessage(uploadSkippedMessage);
    imageService.uploadImages(acceptedFiles, folderId, (progressEvent) => {
      const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
      setUploadProgress(progress);
    })
    .then(response => {
        let message = response.data.message || 'Upload successful.';
        if (response.data.skippedFiles && response.data.skippedFiles.length > 0) {
            const skippedNames = response.data.skippedFiles.join(', ');
            message += ` Skipped files: ${skippedNames}.`;
        }
        setUploadMessage(uploadSkippedMessage ? `${uploadSkippedMessage}\\n${message}` : message);
        fetchFolderData();
    })
    .catch(err => {
      console.error("Upload failed", err);
      let errorMsg = 'An unexpected error occurred during upload.';
      if (err.response && err.response.data && err.response.data.message) {
        errorMsg = err.response.data.message;
        if(err.response.data.skippedFiles) {
          errorMsg += ` Skipped: ${err.response.data.skippedFiles.join(', ')}`;
        }
      }
      setError(errorMsg);
    })
    .finally(() => {
      setIsUploading(false);
      setUploadProgress(0);
    });
  }, [folderId, fetchFolderData]);

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
    try {
      const response = await imageService.downloadImages({ imageIds: selectedImages });
      
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
    }
  };

  const handleDownloadAll = async () => {
    try {
      const response = await folderService.downloadFolder(folderId);
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
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-accent bg-accent-muted' : 'border-border hover:border-accent'}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            <svg className="w-16 h-16 text-accent mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"><path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path><path d="M12 12v9"></path><path d="M16 16l-4-4-4 4"></path></path></svg>
            <p className="text-lg font-semibold text-muted">{isUploading ? t('folder_detail.uploading') : t('folder_detail.dropzone_title')}</p>
            <p className="text-sm text-muted">{t('folder_detail.dropzone_subtitle', { maxSize: Math.round(maxUploadSize / 1024 / 1024) })}</p>
          </div>
        </div>
        <button 
          type="button"
          {...getRootProps()}
          className="w-full mt-6 bg-accent hover:bg-accent-hover text-white font-bold py-3 px-4 rounded-md shadow-sm transition-colors duration-300 flex items-center justify-center"
        >
           <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
          Select Image(s)
        </button>
        
        {/* Supported Formats Info */}
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted text-center">
            {t('folder_detail.supported_formats')}
          </p>
        </div>
        {uploadMessage && (
          <div className="mt-4 p-4 bg-warning/20 border border-warning rounded-lg">
            <p className="text-sm text-warning-text text-center whitespace-pre-line">
              {uploadMessage}
            </p>
          </div>
        )}
      </div>

      {isUploading && (
          <div className="mb-8">
            <div className="flex justify-between mb-1">
              <span className="text-base font-medium text-text">{t('folder_detail.uploading')}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div 
                className="bg-accent h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
      )}

      {/* Bulk Actions */}
      <div className="flex items-center mb-4 gap-2">
        <button
          onClick={handleDeleteSelected}
          disabled={selectedImages.length === 0}
          className="bg-danger hover:bg-danger-hover text-white font-medium py-1 px-3 rounded disabled:opacity-50"
        >
          {`${t('folder_detail.delete_selected')} (${selectedImages.length})`}
        </button>
        <button
          onClick={handleDownloadSelected}
          disabled={selectedImages.length === 0}
          className="bg-primary hover:bg-primary-dark text-white font-medium py-1 px-3 rounded disabled:opacity-50"
        >
          {t('folder_detail.download_selected')}
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
          disabled={images.length === 0}
        >
          {t('folder_detail.download_all')}
        </button>
      </div>

      {/* Image Gallery */}
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