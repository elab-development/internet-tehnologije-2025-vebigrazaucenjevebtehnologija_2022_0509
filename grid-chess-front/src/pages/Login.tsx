import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { InputField } from '../components/common/InputField';
import { CustomButton } from '../components/common/CustomButton';
import { AuthResponse } from '../types';

interface LoginProps {
  setToken: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const colors = {
    darkest: '#37353E',
    dark: '#44444E',
    accent: '#715A5A',
    light: '#D3DAD9'
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const res = await api.post<AuthResponse>('/auth/login', formData);
      
      // Regularan login - dobijamo pravi JWT token
      localStorage.setItem('token', res.data.access_token);
      setToken(res.data.access_token);
      
      navigate('/dashboard');
    } catch (err) {
      alert('Neispravni podaci! Proverite korisničko ime i lozinku.');
    }
  };

  // IZMENA: Gost dobija "guest-mode" string kao propusnicu
  const handleGuestLogin = () => {
    const guestToken = "guest-mode";
    
    // Spremamo u localStorage i obaveštavamo App.tsx state
    localStorage.setItem('token', guestToken);
    setToken(guestToken); 
    navigate('/dashboard');
  };

  return (
    <div style={{ 
      backgroundColor: colors.darkest, 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        backgroundColor: colors.dark, 
        padding: '40px', 
        borderRadius: '15px', 
        width: '100%', 
        maxWidth: '400px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        color: colors.light
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: colors.light }}>♟️ Chess Master</h2>
        
        <form onSubmit={handleLogin}>
          <InputField 
            label="Korisničko ime" 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
          <InputField 
            label="Lozinka" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          
          <div style={{ marginTop: '25px' }}>
            <CustomButton label="Prijavi se" type="submit" variant="primary" />
          </div>
        </form>

        <div style={{ 
          margin: '25px 0', 
          textAlign: 'center', 
          borderBottom: `1px solid ${colors.accent}`, 
          lineHeight: '0.1em' 
        }}>
          <span style={{ backgroundColor: colors.dark, padding: '0 10px', color: colors.accent, fontSize: '14px' }}>
            ili
          </span>
        </div>

        <button 
          type="button"
          onClick={handleGuestLogin}
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: 'transparent', 
            border: `2px solid ${colors.accent}`, 
            color: colors.light, 
            borderRadius: '5px', 
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: '0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(113, 90, 90, 0.2)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          Nastavi kao gost
        </button>

        <p style={{ textAlign: 'center', marginTop: '25px', color: colors.light, fontSize: '14px' }}>
          Nemaš nalog? <Link to="/register" style={{ color: colors.accent, fontWeight: 'bold', textDecoration: 'none' }}>Registruj se</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;