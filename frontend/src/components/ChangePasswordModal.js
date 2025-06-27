import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import adminService from '../services/adminService';

const ChangePasswordModal = ({ user, onClose, onSuccess }) => {
    const { t } = useTranslation();
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!newPassword) {
            setError('Password cannot be empty.');
            return;
        }

        try {
            await adminService.changeUserPassword(user.id, newPassword);
            setMessage(`Password for ${user.username} has been changed successfully.`);
            setNewPassword('');
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change password.');
        }
    };

    return (
        <div className="fixed inset-0 bg-overlay bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-background p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-text">{`Change Password for ${user.username}`}</h2>
                {message && <div className="bg-success-muted border border-success text-success px-4 py-3 rounded mb-4">{message}</div>}
                {error && <div className="bg-danger-muted border border-danger text-danger px-4 py-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-text text-sm font-bold mb-2" htmlFor="newPassword">
                            {t('profile.newPassword')}
                        </label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-text bg-background-muted leading-tight focus:outline-none focus:shadow-outline border-border"
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-danger hover:bg-danger-hover text-white font-bold py-2 px-4 rounded">
                            {t('modals.cancel_button')}
                        </button>
                        <button type="submit" className="bg-accent hover:bg-accent-hover text-white font-bold py-2 px-4 rounded">
                            {t('profile.changePasswordBtn')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal; 