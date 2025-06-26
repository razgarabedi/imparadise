import React from 'react';
import authService from '../services/authService';
import UserList from './UserList';
import SettingsManager from './SettingsManager';

const AdminDashboard = () => {
  const currentUser = authService.getCurrentUser();

  if (currentUser?.role !== 'admin') {
    return (
      <div>
        <h2>Access Denied</h2>
        <p>You must be an administrator to view this page.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <hr />
      <UserList />
      <hr />
      <SettingsManager />
    </div>
  );
};

export default AdminDashboard; 