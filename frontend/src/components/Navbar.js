import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';

const Navbar = ({ currentUser, logOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="sticky top-0 bg-white dark:bg-gray-800 shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            <Link to={currentUser ? '/dashboard' : '/'}>Imparadise</Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400">Dashboard</Link>
                {currentUser.role === 'admin' && (
                  <Link to="/admin" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400">Admin</Link>
                )}
                <button onClick={logOut} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400">Login</Link>
                <Link to="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md">
                  Register
                </Link>
              </>
            )}
            <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 p-2 rounded-full">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
          <div className="md:hidden flex items-center">
             <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 p-2 rounded-full mr-2">
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 dark:text-white focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden bg-white dark:bg-gray-800`}>
        {currentUser ? (
          <>
            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block py-2 px-4 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</Link>
            {currentUser.role === 'admin' && (
              <Link to="/admin" onClick={() => setIsOpen(false)} className="block py-2 px-4 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Admin</Link>
            )}
            <button onClick={() => { logOut(); setIsOpen(false); }} className="w-full text-left block py-2 px-4 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setIsOpen(false)} className="block py-2 px-4 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Login</Link>
            <Link to="/register" onClick={() => setIsOpen(false)} className="block py-2 px-4 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 