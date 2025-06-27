import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSettings } from '../contexts/SettingsContext';

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, resetLoginSuccess } = useAuth();
  const { settings, loading } = useSettings();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await login(username, password);
      setSuccess(t('login.success_message'));
      setTimeout(() => {
        resetLoginSuccess();
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(t('login.failed_login'));
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
          {error && <p className="text-danger text-center text-sm">{error}</p>}
          {success && <p className="text-success text-center text-sm">{success}</p>}
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
            <div className="relative">
              <label htmlFor="password" className="sr-only">{t('login.password')}</label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-border placeholder-text-muted text-text bg-background rounded-b-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                placeholder={t('login.password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted hover:text-text focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-1.29.29m1.29-.29l.29-1.29m-1.29 1.29L8.5 11.5M12 15a3 3 0 002.122-5.122M15 12a3 3 0 00-3-3" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

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