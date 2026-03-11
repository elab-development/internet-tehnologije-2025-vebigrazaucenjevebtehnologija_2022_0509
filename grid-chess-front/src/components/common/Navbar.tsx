import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isGuest = token === 'guest-mode';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navItemStyle = {
    color: '#bababa',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 'bold' as const,
    cursor: 'pointer',
    transition: '0.2s'
  };

  return (
    <nav style={{ 
      height: '60px', 
      backgroundColor: '#2b2b2b', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      padding: '0 30px',
      borderBottom: '2px solid #333'
    }}>
      {/* LOGO I DASHBOARD */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <Link to="/dashboard" style={{ ...navItemStyle, color: '#81b64c', fontSize: '18px' }}>
          ♟️ CSS Chess
        </Link>
        <Link to="/dashboard" style={navItemStyle} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#bababa'}>
          Dashboard
        </Link>
        
        
      </div>

      {/* DESNA STRANA: PROFIL, LEADERBOARD ILI LOGIN */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
        
        {!isGuest ? (
          <>
            <Link to="/leaderboard" style={navItemStyle} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#bababa'}>
              Leaderboard
            </Link>
            <Link to="/profile" style={navItemStyle} onMouseOver={(e) => e.currentTarget.style.color = '#fff'} onMouseOut={(e) => e.currentTarget.style.color = '#bababa'}>
              Profile
            </Link>
          </>
        ) : (
          <span style={{ color: '#715A5A', fontSize: '12px', fontStyle: 'italic' }}>
            Režim Gosta
          </span>
        )}

        <button 
          onClick={handleLogout}
          style={{
            backgroundColor: isGuest ? '#715A5A' : '#454341',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '13px'
          }}
        >
          {isGuest ? "Prijavi se" : "Odjavi se"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;