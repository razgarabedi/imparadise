import axios from 'axios';
import authHeader from './auth-header';

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/user';

const getProfile = () => {
    return axios.get(API_URL + '/profile', { headers: authHeader() });
};

const updateProfile = (userData) => {
    return axios.put(API_URL + '/profile', userData, { headers: authHeader() });
};

const changePassword = (passwordData) => {
    return axios.put(API_URL + '/password', passwordData, { headers: authHeader() });
};

const uploadProfilePicture = (formData) => {
    const headers = {
        ...authHeader(),
        'Content-Type': 'multipart/form-data',
    };
    return axios.post(API_URL + '/profile-picture', formData, { headers });
};

const userService = {
    getProfile,
    updateProfile,
    changePassword,
    uploadProfilePicture,
};

export default userService; 