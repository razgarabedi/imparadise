import React from 'react';
import { useTranslation } from 'react-i18next';

const ImagePreviewModal = ({ isOpen, onClose, image, onDelete, handleDownload }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const onDownload = (e) => {
    e.stopPropagation();
    handleDownload(image.url, image.filename);
  };
  
  const onDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(image.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={onClose}>
      <div className="relative max-w-4xl max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 bg-background rounded-full p-2 text-text hover:bg-muted focus:outline-none"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <img src={image.url} alt={image.filename} className="w-full h-auto object-contain max-h-[85vh] rounded-lg shadow-2xl"/>
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={onDownload}
            className="inline-flex items-center px-4 py-2 bg-accent text-white font-semibold rounded-lg shadow-md hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            {t('folder_detail.download_button')}
          </button>
          {onDelete && (
            <button
              onClick={onDeleteClick}
              className="inline-flex items-center px-4 py-2 bg-danger text-white font-semibold rounded-lg shadow-md hover:bg-danger-hover focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              {t('folder_detail.delete_button')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal; 