import axios from 'axios';
import authHeader from './auth-header';

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/settings/';

const getUserSettings = () => {
  return axios.get(API_URL, { headers: authHeader() });
};

const settingsService = {
  getUserSettings,
};

export default settingsService; 