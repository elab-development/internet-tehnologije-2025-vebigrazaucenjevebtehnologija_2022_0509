import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Navbar from '../components/common/Navbar';

const Profile: React.FC = () => {
  // --- STATE ZA PODATKE ---
  const [username, setUsername] = useState(''); // Trenutno ime (prikaz)
  const [newUsername, setNewUsername] = useState(''); // Polje za unos novog imena
  const [password, setPassword] = useState(''); // Polje za novu lozinku
  const [message, setMessage] = useState({ text: '', type: '' }); // Poruke o uspehu/grešci
  
  // --- STATE ZA AVATAR ---
  const [currentAvatar, setCurrentAvatar] = useState('Felix');
  const avatarOptions = ['Felix', 'Aneka', 'Jack', 'Cali', 'Buddy', 'Milo', 'Leo'];

  // --- UČITAVANJE PODATAKA PRI POKRETANJU ---
  useEffect(() => {
    api.get('/users/me')
      .then(res => {
        setUsername(res.data.username);
        setNewUsername(res.data.username);
        if (res.data.avatar_seed) {
          setCurrentAvatar(res.data.avatar_seed);
        }
      })
      .catch(() => {
        setUsername("Gost");
        setMessage({ text: "Nije moguće učitati profil.", type: "error" });
      });
  }, []);

  // --- FUNKCIJA ZA SLANJE IZMENA ---
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      const response = await api.put('/users/me', { 
        username: newUsername,
        // Ako je lozinka prazna, šaljemo undefined da je JS ne bi uključio u JSON
        password: password || undefined, 
        avatar_seed: currentAvatar
      });
      
      // Ako je uspeh, ažuriraj lokalni prikaz
      setUsername(response.data.username);
      setPassword('');
      setMessage({ text: 'Profil je uspešno ažuriran!', type: 'success' });
    } catch (err: any) {
      const errorDetail = err.response?.data?.detail || 'Greška pri čuvanju izmena.';
      setMessage({ text: errorDetail, type: 'error' });
    }
  };

  const handleAvatarChange = (seed: string) => {
    setCurrentAvatar(seed);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#262421', color: 'white' }}>
      <Navbar />
      
      <div style={{ 
        maxWidth: '600px', 
        margin: '50px auto', 
        padding: '30px', 
        backgroundColor: '#312e2b', 
        borderRadius: '15px', 
        textAlign: 'center',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{ color: '#81b64c', marginBottom: '10px' }}>Tvoj Profil</h1>
        
        {/* Sekcija za prikaz avatara i imena */}
        <div style={{ margin: '20px 0' }}>
          <img 
            src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${currentAvatar}`} 
            alt="Avatar" 
            style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              border: '5px solid #81b64c', 
              backgroundColor: '#454341' 
            }}
          />
          <h2 style={{ marginTop: '15px', fontSize: '24px' }}>{username}</h2>
        </div>

        {/* Prikaz poruka (zeleno za uspeh, crveno za grešku) */}
        {message.text && (
          <div style={{ 
            padding: '10px', 
            marginBottom: '20px', 
            borderRadius: '5px', 
            backgroundColor: message.type === 'success' ? 'rgba(129, 182, 76, 0.2)' : 'rgba(255, 68, 68, 0.2)',
            color: message.type === 'success' ? '#81b64c' : '#ff4444',
            border: `1px solid ${message.type === 'success' ? '#81b64c' : '#ff4444'}`
          }}>
            {message.text}
          </div>
        )}

        {/* FORMA ZA IZMENU */}
        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
          
          {/* Izbor avatara */}
          <div>
            <p style={{ color: '#bababa', marginBottom: '10px', fontSize: '14px' }}>Izaberi novi avatar:</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {avatarOptions.map(seed => (
                <img 
                  key={seed}
                  src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}`} 
                  alt={seed}
                  style={{ 
                    width: '45px', 
                    height: '45px', 
                    borderRadius: '50%', 
                    cursor: 'pointer',
                    border: currentAvatar === seed ? '3px solid #81b64c' : '2px solid transparent',
                    transition: '0.2s transform',
                    transform: currentAvatar === seed ? 'scale(1.1)' : 'scale(1)'
                  }}
                  onClick={() => handleAvatarChange(seed)}
                />
              ))}
            </div>
          </div>

          <hr style={{ border: '0', borderTop: '1px solid #444', margin: '10px 0' }} />

          {/* Polje za korisničko ime */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: '#bababa' }}>Korisničko ime</label>
            <input 
              type="text" 
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              style={inputStyle}
              placeholder="Unesi novo ime"
            />
          </div>

          {/* Polje za lozinku */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '14px', color: '#bababa' }}>Nova lozinka</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="Ostavi prazno ako ne menjaš"
            />
          </div>

          {/* Dugme za slanje */}
          <button type="submit" style={buttonStyle}>
            Sačuvaj sve izmene
          </button>
        </form>

      </div>
    </div>
  );
};

// --- STILOVI ---
const inputStyle = {
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #454341',
  backgroundColor: '#262421',
  color: 'white',
  fontSize: '16px',
  outline: 'none'
};

const buttonStyle = {
  padding: '14px',
  marginTop: '10px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#81b64c',
  color: 'white',
  fontWeight: 'bold' as const,
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.2s'
};

export default Profile;