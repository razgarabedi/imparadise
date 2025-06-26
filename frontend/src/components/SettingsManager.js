import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';

const SettingsManager = () => {
  const [settings, setSettings] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = () => {
    adminService.getSettings().then(response => {
      const settingsData = response.data.reduce((acc, setting) => ({ ...acc, [setting.key]: setting.value }), {});
      setSettings(settingsData);
    }).catch(err => {
      setError("Failed to fetch settings.");
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const settingsUpdatePromises = Object.keys(settings).map(key => 
      adminService.updateSetting(key, settings[key])
    );

    Promise.all(settingsUpdatePromises)
      .then(() => {
        setMessage('Settings updated successfully!');
        fetchSettings();
      })
      .catch(err => {
        setError('Failed to update one or more settings.');
      });
  };
  
  const getInputType = (key) => {
    if (key.includes('size')) return 'number';
    return 'text';
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Settings</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {message && <p className="text-green-500 dark:text-green-400">{message}</p>}
        {error && <p className="text-red-500 dark:text-red-400">{error}</p>}

        <div className="space-y-4">
          {Object.keys(settings).map((key) => (
            <div key={key}>
              <label htmlFor={key} className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {key.replace(/_/g, ' ')}
              </label>
              <div className="mt-1">
                {key === 'allow_registration' ? (
                  <select
                    id={key}
                    name={key}
                    value={settings[key]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                  </select>
                ) : (
                  <input
                    type={getInputType(key)}
                    id={key}
                    name={key}
                    value={settings[key]}
                    onChange={handleInputChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-md"
                  />
                )}
              </div>
              {key === 'max_upload_size' && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Value in bytes. e.g. 10485760 for 10MB</p>}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default SettingsManager; 