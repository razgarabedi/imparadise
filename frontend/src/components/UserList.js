import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import adminService from '../services/adminService';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchUsers();
  }, []);

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