import axios from 'axios';
import authHeader from './auth-header';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_URL_IMAGES = `${API_BASE_URL}/api/images/`;
const API_URL_FOLDERS = `${API_BASE_URL}/api/folders/`;

const uploadImages = (files, folderId, onUploadProgress) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('images', file);
  });

  return axios.post(API_URL_IMAGES + `upload/${folderId}`, formData, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

const getImagesInFolder = (folderId) => {
  return axios.get(API_URL_FOLDERS + `${folderId}/images`, { headers: authHeader() });
};

const deleteImage = (id) => {
  return axios.delete(API_URL_IMAGES + id, { headers: authHeader() });
};

const downloadSelectedImages = (imageIds) => {
  return axios.post(
    API_URL_IMAGES + 'download-selected',
    { imageIds },
    {
      headers: authHeader(),
      responseType: 'blob', // Important for file downloads
    }
  );
};

const imageService = {
  uploadImages,
  getImagesInFolder,
  deleteImage,
  downloadSelectedImages,
};

export default imageService; 