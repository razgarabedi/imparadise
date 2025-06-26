import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSwipeable } from 'react-swipeable';

const ImagePreviewModal = ({ isOpen, onClose, image, onDelete, handleDownload, onNext, onPrevious }) => {
  const { t } = useTranslation();

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => onNext && onNext(),
    onSwipedRight: () => onPrevious && onPrevious(),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

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

  const handleNextClick = (e) => {
    e.stopPropagation();
    if (onNext) {
      onNext();
    }
  };

  const handlePreviousClick = (e) => {
    e.stopPropagation();
    if (onPrevious) {
      onPrevious();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={onClose}>
      <div {...swipeHandlers} className="relative max-w-4xl max-h-[90vh] p-4 flex items-center" onClick={(e) => e.stopPropagation()}>
        {onPrevious && (
          <button
            onClick={handlePreviousClick}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/50 rounded-full p-2 text-text hover:bg-background/75 focus:outline-none"
            aria-label="Previous"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
        )}
        
        <div className="relative w-full">
          <button
            onClick={onClose}
            className="absolute -top-8 -right-4 z-20 bg-background rounded-full p-2 text-text hover:bg-muted focus:outline-none"
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

        {onNext && (
          <button
            onClick={handleNextClick}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/50 rounded-full p-2 text-text hover:bg-background/75 focus:outline-none"
            aria-label="Next"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ImagePreviewModal; 