import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { InputField } from '../components/common/InputField';
import { CustomButton } from '../components/common/CustomButton';
import Navbar from '../components/common/Navbar';

const Profile: React.FC = () => {
  const [username, setUsername] = useState('');
  const [initialUsername, setInitialUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const colors = {
    darkest: '#37353E',
    dark: '#44444E',
    accent: '#715A5A',
    light: '#D3DAD9'
  };

  // 1. Učitavanje podataka prilikom ulaska na stranicu
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/me');
        setUsername(response.data.username);
        setInitialUsername(response.data.username);
      } catch (err: any) {
        console.error("Greška pri učitavanju profila", err);
        setMessage({ type: 'error', text: 'Neuspelo učitavanje profila.' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 2. Slanje izmena na backend
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validacija: ako ništa nije promenjeno
    if (username === initialUsername && password === '') {
      setMessage({ type: 'info', text: 'Niste uneli nikakve promene.' });
      return;
    }

    try {
      // Tvoj backend koristi PUT na /users/me i očekuje UserCreate šemu
      await api.put('/users/me', {
        username: username,
        password: password || "" // Šaljemo prazan string ako se lozinka ne menja
      });

      setInitialUsername(username);
      setPassword(''); // Resetujemo polje za lozinku nakon uspeha
      setMessage({ type: 'success', text: 'Profil uspešno ažuriran!' });
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || "Greška pri ažuriranju.";
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: colors.darkest, minHeight: '100vh', color: colors.light, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2>Učitavanje...</h2>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: colors.darkest, minHeight: '100vh' }}>
      <Navbar />

      <div style={{ padding: '60px 20px' }}>
        <div style={{ 
          maxWidth: '500px', 
          margin: '0 auto', 
          backgroundColor: colors.dark, 
          padding: '40px', 
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          color: colors.light 
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>👤 Moj Profil</h2>
          <p style={{ textAlign: 'center', color: colors.accent, marginBottom: '30px', fontSize: '14px' }}>
            Promenite svoje korisničko ime ili lozinku
          </p>

          {message.text && (
            <div style={{ 
              padding: '12px', 
              borderRadius: '8px', 
              marginBottom: '20px', 
              textAlign: 'center',
              fontSize: '14px',
              backgroundColor: message.type === 'success' ? '#2e7d32' : message.type === 'info' ? '#0288d1' : '#d32f2f',
              color: 'white'
            }}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleUpdate}>
            <InputField 
              label="Korisničko ime" 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
            
            <div style={{ position: 'relative' }}>
              <InputField 
                label="Nova lozinka (ostavi prazno ako ne menjaš)" 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '38px',
                  background: 'none',
                  border: 'none',
                  color: colors.accent,
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}
              >
                {showPassword ? "SAKRIJ" : "PRIKAŽI"}
              </button>
            </div>
            
            <div style={{ marginTop: '30px' }}>
              <CustomButton 
                label="Sačuvaj izmene" 
                type="submit" 
                disabled={username === initialUsername && password === ''}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;