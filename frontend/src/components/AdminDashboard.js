import React from 'react';
import authService from '../services/authService';
import UserList from './UserList';
import SettingsManager from './SettingsManager';

const AdminDashboard = () => {
  const currentUser = authService.getCurrentUser();

  if (currentUser?.role !== 'admin') {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold text-red-500">Access Denied</h2>
        <p>You must be an administrator to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">User Management</h3>
          <UserList />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Application Settings</h3>
          <SettingsManager />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 