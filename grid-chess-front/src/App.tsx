import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';

function App() {
  // Inicijalizujemo token direktno iz localStorage
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const handleSetToken = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  return (
    <Router>
      <Routes>
        {/* POČETNA STRANICA - Sada je Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<Login setToken={handleSetToken} />} />
        <Route path="/register" element={<Register />} />
        
        {/* JAVNA RUTA (ali u Navbaru ćemo kontrolisati šta vidi) */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* STROGO ZAŠTIĆENE RUTE */}
        <Route 
          path="/profile" 
          element={token ? <Profile /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/leaderboard" 
          element={token ? <Leaderboard /> : <Navigate to="/login" replace />} 
        />

        {/* Sve ostalo baci na Login ako nisi ulogovan */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;