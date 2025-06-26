import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { useSettings } from '../contexts/SettingsContext';

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { settings, loading } = useSettings();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await authService.login(username, password);
      navigate('/dashboard');
      window.location.reload();
    } catch (err) {
      const resMessage =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString();
      setError(resMessage);
    }
  };

  if (loading) {
    return <div>{t('loading')}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-background shadow-xl rounded-lg">
        <div>
          {settings.homepage_image_url && (
            <img 
              className="mx-auto h-48 w-auto object-cover rounded-lg" 
              src={settings.homepage_image_url} 
              alt="Homepage" 
            />
          )}
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text">
            {t('login.title')}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">{t('login.username_or_email')}</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-border placeholder-text-muted text-text bg-background rounded-t-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                placeholder={t('login.username_or_email')}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">{t('login.password')}</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-border placeholder-text-muted text-text bg-background rounded-b-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                placeholder={t('login.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="mt-2 text-center text-sm text-danger">
              {error}
            </p>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-success-emphasis hover:bg-success-emphasis-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success"
            >
              {t('login.button')}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <span className="text-muted">{t('login.or_create_account_pre')} </span>
          <Link to="/register" className="font-medium text-accent hover:text-accent-hover">
            {t('login.or_create_account_link')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 