import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login'; 

function App() {
  // Stanje za token koje Login komponenta zahteva
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  return (
    <Router>
      <div className="App">
        <Routes>
          {}
          <Route 
            path="/login" 
            element={<Login setToken={(t: string) => setToken(t)} />} 
          />
          
          <Route 
            path="/" 
            element={<Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;