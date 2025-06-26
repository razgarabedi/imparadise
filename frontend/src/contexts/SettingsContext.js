import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    website_name: 'Imparadise',
    website_logo_url: null,
    homepage_image_url: null,
  });
  const [loading, setLoading] = useState(true);
  const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/public-settings`);
        if (response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch site settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteSettings();
  }, [backendUrl]);

  useEffect(() => {
    // Update title
    if (settings.website_name) {
      document.title = settings.website_name;
    }

    // Update favicon
    const favicon = document.getElementById('favicon');
    if (favicon && settings.website_logo_url) {
      favicon.href = settings.website_logo_url;
    }
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}; 