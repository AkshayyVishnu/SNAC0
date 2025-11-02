import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminPage from './components/AdminPage';
import UserPage from './components/UserPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login'); // 'login', 'signup', 'user', 'admin'
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const storedUser = localStorage.getItem('user');
    
    if (isAuthenticated === 'true' && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setCurrentPage(userData.role === 'admin' ? 'admin' : 'user');
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage(userData.role === 'admin' ? 'admin' : 'user');
  };

  const handleSignup = (userData) => {
    setUser(userData);
    setCurrentPage(userData.role === 'admin' ? 'admin' : 'user');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    setUser(null);
    setCurrentPage('login');
  };

  const switchToSignup = () => {
    setCurrentPage('signup');
  };

  const switchToLogin = () => {
    setCurrentPage('login');
  };

  // Render appropriate page based on current state
  if (currentPage === 'login') {
    return <Login onLogin={handleLogin} onSwitchToSignup={switchToSignup} />;
  }

  if (currentPage === 'signup') {
    return <Signup onSignup={handleSignup} onSwitchToLogin={switchToLogin} />;
  }

  if (currentPage === 'admin' && user) {
    return <AdminPage user={user} onLogout={handleLogout} />;
  }

  if (currentPage === 'user' && user) {
    return <UserPage user={user} onLogout={handleLogout} />;
  }

  // Fallback to login if somehow no valid state
  return <Login onLogin={handleLogin} />;
}

export default App;
