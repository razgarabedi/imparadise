import axios from 'axios';
import authHeader from './auth-header';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const API_URL_IMAGES = `${API_BASE_URL}/api/images/`;
const API_URL_FOLDERS = `${API_BASE_URL}/api/folders/`;

const uploadImage = (file, folderId, onUploadProgress) => {
  const formData = new FormData();
  formData.append('images', file);

  return axios.post(API_URL_IMAGES + `upload/${folderId}`, formData, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
};

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

const downloadImages = (imageIds) => {
  return axios.post(
    API_URL_IMAGES + 'download/bulk',
    imageIds,
    {
      headers: authHeader(),
      responseType: 'blob',
    }
  );
};

const imageService = {
  uploadImage,
  uploadImages,
  getImagesInFolder,
  deleteImage,
  downloadImages,
};

export default imageService; 