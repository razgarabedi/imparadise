import axios from 'axios';
import authHeader from './auth-header';

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/admin/';

const getAllUsers = () => {
  return axios.get(API_URL + 'users', { headers: authHeader() });
};

const updateUserRole = (id, newRole) => {
  return axios.put(API_URL + `users/${id}/role`, { role: newRole }, { headers: authHeader() });
};

const deleteUser = (id) => {
  return axios.delete(API_URL + `users/${id}`, { headers: authHeader() });
};

const updateUserStorageLimit = (userId, storageLimit) => {
  return axios.put(API_URL + `users/${userId}/storage-limit`, { storageLimit }, { headers: authHeader() });
};

const getSettings = () => {
  return axios.get(API_URL + 'settings', { headers: authHeader() });
};

const updateSetting = (key, value) => {
  return axios.put(API_URL + 'settings', { key, value }, { headers: authHeader() });
};

const uploadSettingImage = (settingKey, file) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('settingKey', settingKey);

  return axios.post(API_URL + 'settings/upload', formData, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
};

const changeUserPassword = (userId, newPassword) => {
  return axios.put(API_URL + `users/${userId}/password`, { newPassword }, { headers: authHeader() });
};

const adminService = {
  getAllUsers,
  updateUserRole,
  deleteUser,
  updateUserStorageLimit,
  getSettings,
  updateSetting,
  uploadSettingImage,
  changeUserPassword,
};

export default adminService; 