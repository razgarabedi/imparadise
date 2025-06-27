import axios from 'axios';
import authHeader from './auth-header';

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/auth/';

const register = (username, email, password) => {
  return axios.post(API_URL + 'register', {
    username,
    email,
    password,
  });
};

const login = async (usernameOrEmail, password) => {
  const response = await axios.post(API_URL + 'login', {
    usernameOrEmail,
    password,
  });
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getLocalUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) return JSON.parse(userStr);
  return null;
}

const getCurrentUser = () => {
  return axios.get(API_URL + 'me', { headers: authHeader() });
};

const authService = {
  register,
  login,
  logout,
  getLocalUser,
  getCurrentUser,
};

export default authService;