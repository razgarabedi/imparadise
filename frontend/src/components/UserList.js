import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import adminService from '../services/adminService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [editingLimit, setEditingLimit] = useState({});
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    if(user){
      fetchUsers();
    }
  }, [user, navigate]);

  const fetchUsers = () => {
    adminService.getAllUsers().then(response => {
      setUsers(response.data);
    }).catch(error => {
      setError(error.response?.data?.message || 'An error occurred');
    });
  };

  const handleRoleChange = (userId, newRole) => {
    adminService.updateUserRole(userId, newRole).then(() => {
      fetchUsers();
    }).catch(error => {
      setError(error.response?.data?.message || 'An error occurred');
    });
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm(t('admin.users.delete_user_confirm'))) {
      adminService.deleteUser(userId).then(() => {
        fetchUsers();
      }).catch(error => {
        setError(error.response?.data?.message || 'An error occurred');
      });
    }
  };

  const handleStorageLimitChange = (userId, newLimit) => {
    const newLimitInBytes = newLimit * 1024 * 1024 * 1024;
    adminService.updateUserStorageLimit(userId, newLimitInBytes).then(() => {
        fetchUsers();
        setEditingLimit({ ...editingLimit, [userId]: undefined });
    }).catch(error => {
        setError(error.response?.data?.message || 'An error occurred');
    });
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div>
      {error && <p className="text-danger mb-4">{error}</p>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-background rounded-lg">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">{t('admin.users.username')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">{t('admin.users.email')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">{t('admin.users.role')}</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Storage Usage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">{t('admin.users.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="p-2 border rounded-md bg-background text-text border-border focus:outline-none focus:ring-accent focus:border-accent"
                    disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1}
                  >
                    <option value="user">{t('admin.users.make_user')}</option>
                    <option value="admin">{t('admin.users.make_admin')}</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                    {editingLimit[user.id] !== undefined ? (
                        <div className="flex items-center">
                            <input
                                type="number"
                                value={editingLimit[user.id]}
                                onChange={(e) => setEditingLimit({ ...editingLimit, [user.id]: e.target.value })}
                                className="p-1 border rounded-md w-24"
                            />
                            <span className="ml-2">GB</span>
                            <button onClick={() => handleStorageLimitChange(user.id, editingLimit[user.id])} className="ml-2 p-1 text-sm bg-green-500 text-white rounded">Save</button>
                            <button onClick={() => setEditingLimit({ ...editingLimit, [user.id]: undefined })} className="ml-2 p-1 text-sm bg-gray-500 text-white rounded">Cancel</button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <span>{`${formatBytes(user.storage_used)} / ${formatBytes(user.storage_limit)}`}</span>
                            <button onClick={() => setEditingLimit({ ...editingLimit, [user.id]: (user.storage_limit / (1024*1024*1024)).toFixed(2) })} className="ml-4 p-1 text-sm bg-blue-500 text-white rounded">Edit</button>
                        </div>
                    )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-danger hover:text-danger-hover"
                    disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1}
                  >
                    {t('modals.delete_button')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList; 