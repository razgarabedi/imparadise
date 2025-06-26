import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:5000/api/auth/';

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

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const user = JSON.parse(userStr);
    const decodedToken = jwtDecode(user.token);
    return { ...user, ...decodedToken };
  }
  return null;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default authService; 