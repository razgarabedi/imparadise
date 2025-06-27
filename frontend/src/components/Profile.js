import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Profile = () => {
    const { t } = useTranslation();
    const { user, updateUser } = useAuth();
    const [profile, setProfile] = useState({ username: user?.username || '', email: user?.email || '', profile_picture_url: user?.profile_picture_url || '' });
    const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if(user) {
            userService.getProfile().then(response => {
                setProfile({
                    username: response.data.username,
                    email: response.data.email,
                    profile_picture_url: response.data.profile_picture_url
                });
            }).catch(err => {
                setError('Failed to fetch profile data.');
            });
        }
    }, [user]);

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPassword({ ...password, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        userService.updateProfile({ username: profile.username, email: profile.email })
            .then(response => {
                setMessage('Profile updated successfully.');
                const updatedUser = { ...user, username: response.data.username, email: response.data.email };
                updateUser(updatedUser);
            })
            .catch(err => {
                setError(err.response?.data?.message || 'Failed to update profile.');
            });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (password.newPassword !== password.confirmNewPassword) {
            setError("New passwords don't match.");
            return;
        }
        setMessage('');
        setError('');
        userService.changePassword({ currentPassword: password.currentPassword, newPassword: password.newPassword })
            .then(() => {
                setMessage('Password changed successfully.');
                setPassword({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
            })
            .catch(err => {
                setError(err.response?.data?.message || 'Failed to change password.');
            });
    };

    const handleProfilePictureSubmit = (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setError('Please select a file to upload.');
            return;
        }
        setMessage('');
        setError('');
        const formData = new FormData();
        formData.append('profilePicture', selectedFile);

        userService.uploadProfilePicture(formData)
            .then(response => {
                setMessage('Profile picture updated successfully.');
                setProfile({ ...profile, profile_picture_url: response.data.profilePictureUrl });
                const updatedUser = { ...user, profile_picture_url: response.data.profilePictureUrl };
                updateUser(updatedUser);
            })
            .catch(err => {
                setError(err.response?.data?.message || 'Failed to upload profile picture.');
            });
    };
    
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    return (
        <div className={`container mx-auto p-4 text-text bg-background`}>
            <h1 className="text-2xl font-bold mb-4">{t('profile.title')}</h1>
            {message && <div className="bg-success-muted border border-success text-success px-4 py-3 rounded relative mb-4" role="alert">{message}</div>}
            {error && <div className="bg-danger-muted border border-danger text-danger px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <h2 className="text-xl font-semibold mb-2">{t('profile.picture')}</h2>
                    <img
                        src={user?.profile_picture_url ? `${API_BASE_URL}${user.profile_picture_url}` : `https://picsum.photos/150`}
                        alt="Profile"
                        className="w-48 h-48 rounded-full object-cover mx-auto"
                    />
                    <form onSubmit={handleProfilePictureSubmit} className="mt-4">
                        <div className="flex flex-col items-center">
                            <input type="file" onChange={handleFileChange} className="p-2 border rounded w-full bg-background text-text border-border" />
                            <button type="submit" className="mt-2 bg-accent hover:bg-accent-hover text-white font-bold py-2 px-4 rounded">
                                {t('profile.uploadPicture')}
                            </button>
                        </div>
                    </form>
                </div>
                <div className="md:col-span-2">
                    <div className="bg-background-muted shadow-md rounded p-6 mb-8">
                        <h2 className="text-xl font-semibold mb-4">{t('profile.updateProfile')}</h2>
                        <form onSubmit={handleProfileSubmit}>
                            <div className="mb-4">
                                <label className="block text-text text-sm font-bold mb-2" htmlFor="username">{t('profile.username')}</label>
                                <input type="text" name="username" id="username" value={profile.username} onChange={handleProfileChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-text bg-background-muted leading-tight focus:outline-none focus:shadow-outline border-border" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-text text-sm font-bold mb-2" htmlFor="email">{t('profile.email')}</label>
                                <input type="email" name="email" id="email" value={profile.email} onChange={handleProfileChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-text bg-background-muted leading-tight focus:outline-none focus:shadow-outline border-border" />
                            </div>
                            <button type="submit" className="bg-accent hover:bg-accent-hover text-white font-bold py-2 px-4 rounded">{t('profile.update')}</button>
                        </form>
                    </div>

                    <div className="bg-background-muted shadow-md rounded p-6">
                        <h2 className="text-xl font-semibold mb-4">{t('profile.changePassword')}</h2>
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="mb-4">
                                <label className="block text-text text-sm font-bold mb-2" htmlFor="currentPassword">{t('profile.currentPassword')}</label>
                                <input type="password" name="currentPassword" id="currentPassword" value={password.currentPassword} onChange={handlePasswordChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-text bg-background-muted border-border" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-text text-sm font-bold mb-2" htmlFor="newPassword">{t('profile.newPassword')}</label>
                                <input type="password" name="newPassword" id="newPassword" value={password.newPassword} onChange={handlePasswordChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-text bg-background-muted border-border" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-text text-sm font-bold mb-2" htmlFor="confirmNewPassword">{t('profile.confirmNewPassword')}</label>
                                <input type="password" name="confirmNewPassword" id="confirmNewPassword" value={password.confirmNewPassword} onChange={handlePasswordChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-text bg-background-muted border-border" />
                            </div>
                            <button type="submit" className="bg-accent hover:bg-accent-hover text-white font-bold py-2 px-4 rounded">{t('profile.changePasswordBtn')}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 