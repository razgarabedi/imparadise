import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const profileMenuRef = useRef(null);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuRef]);
  
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  return (
    <nav className="sticky top-0 bg-background shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-text">
            <Link to="/" className="flex items-center space-x-2 text-accent">
              {settings.website_logo_url ? (
                <img src={settings.website_logo_url} alt="Logo" className="h-8 w-auto" />
              ) : (
                <span className="font-bold text-xl">{settings.website_name || t('navbar.title')}</span>
              )}
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-text hover:text-accent">{t('navbar.dashboard')}</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-text hover:text-accent">{t('navbar.admin')}</Link>
                )}
                <div className="relative" ref={profileMenuRef}>
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 focus:outline-none">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={user.profile_picture_url ? `${API_BASE_URL}${user.profile_picture_url}` : `https://picsum.photos/40`}
                      alt={user.username}
                    />
                    <span className="text-text font-semibold">{user.username}</span>
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 py-2 w-48 bg-background border rounded shadow-xl">
                      <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-text hover:bg-background-muted">{t('navbar.profile')}</Link>
                      <button onClick={() => { handleLogout(); setIsProfileOpen(false); }} className="w-full text-left block px-4 py-2 text-danger hover:bg-background-muted">
                        {t('navbar.logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-text hover:text-accent">{t('navbar.login')}</Link>
                <Link to="/register" className="bg-accent hover:bg-accent-hover text-white font-bold py-2 px-4 rounded-md">
                  {t('navbar.register')}
                </Link>
              </>
            )}
            <button onClick={toggleTheme} className="text-text hover:text-accent p-2 rounded-full">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <div className="flex items-center">
              <button onClick={() => changeLanguage('en')} className={`px-2 py-1 text-sm rounded-md ${i18n.language === 'en' ? 'bg-accent text-white' : 'text-text'}`}>EN</button>
              <button onClick={() => changeLanguage('de')} className={`px-2 py-1 text-sm rounded-md ${i18n.language === 'de' ? 'bg-accent text-white' : 'text-text'}`}>DE</button>
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={toggleTheme} className="text-text hover:text-accent p-2 rounded-full mr-2">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-text focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-background`}>
        {user ? (
          <>
            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block py-2 px-4 text-sm text-text hover:bg-background-muted">{t('navbar.dashboard')}</Link>
            <Link to="/profile" onClick={() => setIsOpen(false)} className="block py-2 px-4 text-sm text-text hover:bg-background-muted">{t('navbar.profile')}</Link>
            {user.role === 'admin' && (
              <Link to="/admin" onClick={() => setIsOpen(false)} className="block py-2 px-4 text-sm text-text hover:bg-background-muted">{t('navbar.admin')}</Link>
            )}
            <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full text-left block py-2 px-4 text-sm text-danger hover:bg-background-muted">
              {t('navbar.logout')}
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setIsOpen(false)} className="block py-2 px-4 text-sm text-text hover:bg-background-muted">{t('navbar.login')}</Link>
            <Link to="/register" onClick={() => setIsOpen(false)} className="block py-2 px-4 text-sm text-text hover:bg-background-muted">{t('navbar.register')}</Link>
          </>
        )}
        <div className="flex items-center justify-center py-2 space-x-2">
          <button onClick={() => { changeLanguage('en'); setIsOpen(false); }} className={`px-2 py-1 text-sm rounded-md ${i18n.language === 'en' ? 'bg-accent text-white' : 'text-text'}`}>EN</button>
          <button onClick={() => { changeLanguage('de'); setIsOpen(false); }} className={`px-2 py-1 text-sm rounded-md ${i18n.language === 'de' ? 'bg-accent text-white' : 'text-text'}`}>DE</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 