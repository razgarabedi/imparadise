import axios from 'axios';
import authHeader from './auth-header';

const API_URL_IMAGES = 'http://localhost:5000/api/images/';
const API_URL_FOLDERS = 'http://localhost:5000/api/folders/';

const uploadImage = (file, folderId, onUploadProgress) => {
  const formData = new FormData();
  formData.append('image', file);

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

const imageService = {
  uploadImage,
  getImagesInFolder,
  deleteImage,
};

export default imageService; 