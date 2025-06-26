import React from 'react';
import { useTranslation } from 'react-i18next';
import folderService from '../services/folderService';

const DeleteFolderModal = ({ isOpen, onClose, onFolderDeleted, folder }) => {
  const { t } = useTranslation();
  const handleDelete = async () => {
    try {
      await folderService.deleteFolder(folder.id);
      onFolderDeleted();
      onClose();
    } catch (err) {
      // It's better to show an error toast or message outside the modal
      // For now, we'll just log it.
      console.error('Failed to delete folder', err);
      alert('Failed to delete folder. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-overlay"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-background rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-background px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-danger-muted sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-danger" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-text" id="modal-title">
                  {t('modals.delete_folder_title')}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-text">
                    {t('modals.delete_folder_confirm', { folderName: folder?.name })}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-background-muted px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleDelete}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-danger text-base font-medium text-white hover:bg-danger-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-danger sm:ml-3 sm:w-auto sm:text-sm"
            >
              {t('modals.delete_button')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-border shadow-sm px-4 py-2 bg-background text-base font-medium text-text hover:bg-background-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {t('modals.cancel_button')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteFolderModal; 