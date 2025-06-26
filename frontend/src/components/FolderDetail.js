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
  const [isUploading, setIsUploading] = useState(false);
  const [maxUploadSize, setMaxUploadSize] = useState(10485760); // Default 10MB
  const [selectedImage, setSelectedImage] = useState(null);
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage, setImagesPerPage] = useState(15);
  const [selectedImages, setSelectedImages] = useState([]);

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
  }, [fetchFolderData]);

  const onDrop = useCallback(acceptedFiles => {
    const validFiles = acceptedFiles.filter(file => {
        if (file.size > maxUploadSize) {
            setError(`File ${file.name} exceeds the maximum limit of ${Math.round(maxUploadSize / 1024 / 1024)}MB.`);
            return false;
        }
        return true;
    });

    if (validFiles.length > 0) {
        setIsUploading(true);
        setError('');
        imageService.uploadImages(validFiles, folderId)
            .then(() => {
                fetchFolderData(); // Refresh data
            })
            .catch(err => {
                console.error("Upload failed", err);
                setError(`Upload failed. Please try again.`);
            })
            .finally(() => {
                setIsUploading(false);
            });
    }
  }, [folderId, fetchFolderData, maxUploadSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {
      'image/*': [
        '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff', '.svg',
        '.heic', '.heif', '.avif', '.jxl', '.jxr', '.ico', '.psd', '.raw',
        '.ppm', '.pgm', '.pbm'
      ]
    },
    onDropRejected: (rejectedFiles) => {
      const errors = rejectedFiles.map(({ file, errors }) => {
        if (errors.some(e => e.code === 'file-invalid-type')) {
          return `File "${file.name}" is not a supported image format.`;
        }
        if (errors.some(e => e.code === 'file-too-large')) {
          return `File "${file.name}" is too large. Max size is ${Math.round(maxUploadSize / 1024 / 1024)}MB.`;
        }
        return `File "${file.name}" could not be uploaded.`;
      });
      setError(errors.join(' '));
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
  
  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
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

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Uploader Component */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('folder_detail.upload_title', { folderName: folder?.name })}</h2>
          <p className="text-gray-500 dark:text-gray-400">{t('folder_detail.upload_subtitle', { maxSize: Math.round(maxUploadSize / 1024 / 1024) })}</p>
        </div>
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${isDragActive ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            <svg className="w-16 h-16 text-indigo-400 dark:text-indigo-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"><path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path><path d="M12 12v9"></path><path d="M16 16l-4-4-4 4"></path></path></svg>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{isUploading ? t('folder_detail.uploading') : t('folder_detail.dropzone_title')}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('folder_detail.dropzone_subtitle', { maxSize: Math.round(maxUploadSize / 1024 / 1024) })}</p>
          </div>
        </div>
        <button 
          type="button"
          {...getRootProps()}
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md shadow-sm transition-colors duration-300 flex items-center justify-center"
        >
           <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
          Select Image(s)
        </button>
        
        {/* Supported Formats Info */}
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
            {t('folder_detail.supported_formats')}
          </p>
        </div>
      </div>

      {isUploading && (
          <div className="mb-8">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className="bg-indigo-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{ width: `100%` }}>
                      {t('folder_detail.uploading')}
                  </div>
              </div>
          </div>
      )}

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

      {/* Image Gallery */}
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
              <button onClick={() => handleDeleteImage(image.id)} className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
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

      <ImagePreviewModal 
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        image={selectedImage}
      />
    </div>
  );
};

export default FolderDetail; 