import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';

window.addEventListener('error', e => {
  if (e.message === 'ResizeObserver loop completed with undelivered notifications' || 
      e.message === 'ResizeObserver loop limit exceeded') {
    e.stopImmediatePropagation();
  }
});

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleSetToken = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login setToken={handleSetToken} />} />
        <Route path="/register" element={<Register />} />
        
        <Route 
          path="/dashboard" 
          element={token ? <Dashboard /> : <Navigate to="/login" replace />} 
        />
        
        <Route 
          path="/profile" 
          element={token ? <Profile /> : <Navigate to="/login" replace />} 
        />
        
        <Route 
          path="/leaderboard" 
          element={token ? <Leaderboard /> : <Navigate to="/login" replace />} 
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;