import React, { useState, useEffect } from 'react';
import adminService from '../services/adminService';

const SettingsManager = () => {
  const [settings, setSettings] = useState([]);
  const [maxUploadSize, setMaxUploadSize] = useState('');

  const fetchSettings = () => {
    adminService.getSettings().then(response => {
      setSettings(response.data);
      const sizeSetting = response.data.find(s => s.key === 'max_upload_size');
      if (sizeSetting) {
        setMaxUploadSize(sizeSetting.value);
      }
    });
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpdateSetting = () => {
    adminService.updateSetting('max_upload_size', maxUploadSize).then(() => {
      fetchSettings();
    });
  };

  return (
    <div>
      <h3>Settings</h3>
      <div>
        <label>Max Upload Size (bytes):</label>
        <input
          type="number"
          value={maxUploadSize}
          onChange={(e) => setMaxUploadSize(e.target.value)}
        />
        <button onClick={handleUpdateSetting}>Save</button>
      </div>
    </div>
  );
};

export default SettingsManager; 