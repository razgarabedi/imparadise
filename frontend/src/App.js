import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import FolderDetail from './components/FolderDetail';
import AdminDashboard from './components/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import PublicFolderPage from './components/PublicFolderPage';
import Footer from './components/Footer';
import { useAuth } from './contexts/AuthContext';
import Profile from './components/Profile';

function App() {
  const { user, loading, loginSuccess } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <Router>
      <div className="bg-background-muted min-h-screen text-text flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={!user || loginSuccess ? <HomePage /> : <Navigate to="/dashboard" />} />
            <Route path="/login" element={!user || loginSuccess ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user || loginSuccess ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/folders/:folderId" element={<PrivateRoute><FolderDetail /></PrivateRoute>} />
            <Route path="/public/folders/:folderId" element={<PublicFolderPage />} />
            <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
