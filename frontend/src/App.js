import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import FolderDetail from './components/FolderDetail';
import AdminDashboard from './components/AdminDashboard';
import authService from './services/authService';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import PublicFolderPage from './components/PublicFolderPage';
import Footer from './components/Footer';

function App() {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

  const navigate = useNavigate();

  const logOut = () => {
    authService.logout();
    setCurrentUser(undefined);
    navigate('/');
  };
  
  return (
    <div className="bg-background-muted min-h-screen text-text flex flex-col">
      <Navbar currentUser={currentUser} logOut={logOut} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={currentUser ? <Navigate to="/dashboard" /> : <HomePage />} />
          <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={currentUser ? <Navigate to="/dashboard" /> : <Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/folders/:folderId" element={<PrivateRoute><FolderDetail /></PrivateRoute>} />
          <Route path="/public/folders/:folderId" element={<PublicFolderPage />} />
          <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
