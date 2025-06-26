import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
        Welcome to Imparadise
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Your personal cloud storage solution. Upload, organize, and share your images from anywhere in the world, securely and efficiently.
      </p>
      <div>
        <Link 
          to="/register" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md shadow-lg transition-transform transform hover:scale-105"
        >
          Get Started for Free
        </Link>
        <p className="mt-4 text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default HomePage; 