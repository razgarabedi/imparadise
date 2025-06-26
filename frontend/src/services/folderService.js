import axios from 'axios';
import authHeader from './auth-header';

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/folders/';

const createFolder = (name, isPublic) => {
  return axios.post(API_URL, { name, isPublic }, { headers: authHeader() });
};

const getFolders = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const getPublicFolders = () => {
  return axios.get(API_URL + 'public');
};

const getFolderById = (id) => {
  return axios.get(API_URL + id, { headers: authHeader() });
};

const updateFolder = (id, name, isPublic) => {
  return axios.put(API_URL + id, { name, isPublic }, { headers: authHeader() });
};

const deleteFolder = (id) => {
  return axios.delete(API_URL + id, { headers: authHeader() });
};

const folderService = {
  createFolder,
  getFolders,
  getPublicFolders,
  getFolderById,
  updateFolder,
  deleteFolder,
};

export default folderService; 