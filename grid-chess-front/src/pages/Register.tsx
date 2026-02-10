import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { InputField } from '../components/common/InputField';
import { CustomButton } from '../components/common/CustomButton';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const colors = {
    darkest: '#37353E',
    dark: '#44444E',
    accent: '#715A5A',
    light: '#D3DAD9'
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Lozinke se ne podudaraju!");
      return;
    }

    try {
      await api.post('/auth/register', {
        username: username,
        password: password
      });
      
      alert("Uspešna registracija! Sada se ulogujte.");
      navigate('/login');
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Greška pri registraciji!";
      alert(errorMsg);
    }
  };

  return (
    <div style={{ 
      backgroundColor: colors.darkest, 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{ 
        backgroundColor: colors.dark, 
        padding: '40px', 
        borderRadius: '15px', 
        width: '100%', 
        maxWidth: '400px',
        color: colors.light,
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: colors.light }}>🆕 Napravi Profil</h2>
        <form onSubmit={handleRegister}>
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
          {/* POPRAVLJENO POLJE ISPOD */}
          <InputField 
            label="Potvrdi lozinku" 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
          />
          <div style={{ marginTop: '20px' }}>
            <CustomButton label="Registruj se" type="submit" />
          </div>
        </form>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: colors.light }}>
          Već imaš nalog? <Link to="/login" style={{ color: colors.accent, fontWeight: 'bold', textDecoration: 'none' }}>Prijavi se</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;