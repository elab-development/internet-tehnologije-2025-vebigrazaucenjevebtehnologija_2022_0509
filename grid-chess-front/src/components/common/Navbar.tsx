import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Resetuje aplikaciju i vraća na login
  };

  const navStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#37353E',
    borderBottom: '1px solid #44444E'
  };

  const linkStyle: React.CSSProperties = {
    color: '#D3DAD9',
    textDecoration: 'none',
    marginLeft: '20px',
    fontWeight: '500'
  };

  return (
    <nav style={navStyle}>
      <Link to="/dashboard" style={{ ...linkStyle, fontSize: '1.2rem', fontWeight: 'bold', marginLeft: 0 }}>
        ♟️ ChessGrid
      </Link>

      <div>
        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
        
        {token ? (
          <>
            <Link to="/leaderboard" style={linkStyle}>Leaderboard</Link>
            <Link to="/profile" style={linkStyle}>Profile</Link>
            <button 
              onClick={handleLogout}
              style={{
                marginLeft: '20px',
                background: '#715A5A',
                color: 'white',
                border: 'none',
                padding: '6px 15px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{...linkStyle, color: '#769656', fontWeight: 'bold'}}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;