import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('hotel_user');
    const token = localStorage.getItem('hotel_token');
    if (stored && token) setUser(JSON.parse(stored));
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('hotel_user', JSON.stringify(userData));
    localStorage.setItem('hotel_token', token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('hotel_user');
    localStorage.removeItem('hotel_token');
    setUser(null);
  };

  return (
    <Router>
      {user && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Auth onLogin={handleLogin} />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
