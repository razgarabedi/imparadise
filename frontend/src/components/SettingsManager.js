import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import adminService from '../services/adminService';

const SettingsManager = () => {
  const [settings, setSettings] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();
  
  const logoInputRef = useRef(null);
  const homepageImageInputRef = useRef(null);

  const backendUrl = 'http://localhost:5000';

  const processSettings = useCallback((settingsData) => {
    const processed = { ...settingsData };
    const imageKeys = ['website_logo_url', 'homepage_image_url'];

    imageKeys.forEach(key => {
      if (processed[key] && processed[key].startsWith('/')) {
        processed[key] = `${backendUrl}${processed[key]}`;
      }
    });
    return processed;
  }, [backendUrl]);

  const fetchSettings = useCallback(() => {
    adminService.getSettings().then(response => {
      const settingsData = response.data.reduce((acc, setting) => ({ ...acc, [setting.key]: setting.value }), {});
      const finalSettings = processSettings(settingsData);
      setSettings(finalSettings);
    }).catch(err => {
      setError("Failed to fetch settings.");
    });
  }, [processSettings]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };
  
  const handleImageUpload = async (settingKey, file) => {
    if (!file) return;
    try {
      const res = await adminService.uploadSettingImage(settingKey, file);
      setSettings(prev => ({ ...prev, [settingKey]: res.data.imageUrl }));
      setMessage(`${settingKey.replace(/_/g, ' ')} uploaded successfully. Save settings to apply.`);
      
      // Clear the file input
      if (settingKey === 'website_logo_url' && logoInputRef.current) {
        logoInputRef.current.value = "";
      } else if (settingKey === 'homepage_image_url' && homepageImageInputRef.current) {
        homepageImageInputRef.current.value = "";
      }

    } catch (err) {
      setError(`Failed to upload ${settingKey.replace(/_/g, ' ')}.`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const settingsToUpdate = { ...settings };
    delete settingsToUpdate.website_logo_url;
    delete settingsToUpdate.homepage_image_url;

    const settingsUpdatePromises = Object.keys(settingsToUpdate).map(key => 
      adminService.updateSetting(key, settingsToUpdate[key])
    );

    Promise.all(settingsUpdatePromises)
      .then(() => {
        setMessage(t('admin.settings.success_message'));
        fetchSettings();
        // Force a reload to see changes globally
        window.location.reload();
      })
      .catch(err => {
        setError(t('admin.settings.error_message'));
      });
  };

  const renderSettingInput = (key) => {
    if (key === 'website_logo_url' || key === 'homepage_image_url') {
      const ref = key === 'website_logo_url' ? logoInputRef : homepageImageInputRef;
      return (
        <div className="flex items-center space-x-4 mt-1">
          {settings[key] && <img src={settings[key]} alt={key} className="w-24 h-auto bg-muted rounded"/>}
          <input
            type="file"
            ref={ref}
            accept=".jpg,.jpeg,.png,.gif,.bmp,.webp,.tiff,.svg,.heic,.heif,.avif,.jxl,.jxr,.ico,.psd,.raw,.ppm,.pgm,.pbm"
            onChange={(e) => handleImageUpload(key, e.target.files[0])}
            className="block w-full text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-muted file:text-accent hover:file:bg-accent-muted"
          />
        </div>
      );
    }

    if (key === 'allow_registration') {
      return (
        <select
          id={key}
          name={key}
          value={settings[key]}
          onChange={handleInputChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-border bg-background text-text focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-md"
        >
          <option value="true">{t('admin.settings.enabled')}</option>
          <option value="false">{t('admin.settings.disabled')}</option>
        </select>
      );
    }

    return (
       <input
        type={key.includes('size') ? 'number' : 'text'}
        id={key}
        name={key}
        value={settings[key]}
        onChange={handleInputChange}
        className="shadow-sm focus:ring-accent focus:border-accent block w-full sm:text-sm border-border bg-background text-text rounded-md"
      />
    );
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">{t('admin.settings.title')}</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {message && <p className="text-success">{message}</p>}
        {error && <p className="text-danger">{error}</p>}

        <div className="space-y-4">
          {Object.keys(settings).sort().map((key) => (
            <div key={key}>
              <label htmlFor={key} className="block text-sm font-medium text-muted capitalize">
                {t(`admin.settings.${key}`, { defaultValue: key.replace(/_/g, ' ') })}
              </label>
              {renderSettingInput(key)}
              {key === 'max_upload_size' && <p className="mt-2 text-sm text-muted">{t('admin.settings.bytes_info')}</p>}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-success-emphasis hover:bg-success-emphasis-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success"
        >
          {t('admin.settings.save_settings')}
        </button>
      </form>
    </div>
  );
};

export default SettingsManager; 