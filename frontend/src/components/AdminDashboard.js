import React from 'react';
import UserList from './UserList';
import SettingsManager from './SettingsManager';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">{t('admin.title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{t('admin.user_management')}</h3>
          <UserList />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">{t('admin.app_settings')}</h3>
          <SettingsManager />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 