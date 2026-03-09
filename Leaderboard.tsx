import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/common/Navbar';

interface Ranking {
  username: string;
  score: number;
  avatar_seed: string | null; // Dodato polje za avatar
}

const Leaderboard: React.FC = () => {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/leaderboard')
      .then(res => {
        setRankings(res.data);
      })
      .catch(err => {
        console.error("Greška pri učitavanju rang liste:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const getRankStyle = (index: number) => {
    if (index === 0) return { color: '#ffd700', fontSize: '1.2em' }; // Zlato
    if (index === 1) return { color: '#c0c0c0', fontSize: '1.1em' }; // Srebro
    if (index === 2) return { color: '#cd7f32', fontSize: '1.05em' }; // Bronza
    return { color: '#fff' };
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#262421', color: 'white' }}>
      <Navbar />
      
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#81b64c', fontSize: '2.5rem', marginBottom: '10px' }}>Leaderboard</h1>
          <p style={{ color: '#bababa' }}>Najbolji šahovski programeri zajednice</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Učitavanje rang liste...</div>
        ) : (
          <div style={{ 
            backgroundColor: '#312e2b', 
            borderRadius: '12px', 
            overflow: 'hidden', 
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            border: '1px solid #3d3a37'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#2b2926', color: '#81b64c', textAlign: 'left' }}>
                  <th style={{ padding: '20px' }}>Rang</th>
                  <th style={{ padding: '20px' }}>Korisnik</th>
                  <th style={{ padding: '20px', textAlign: 'right' }}>Rešeni nivoi</th>
                </tr>
              </thead>
              <tbody>
                {rankings.length > 0 ? (
                  rankings.map((user, index) => (
                    <tr 
                      key={user.username} 
                      style={{ 
                        borderBottom: '1px solid #3d3a37',
                        backgroundColor: index % 2 === 0 ? 'transparent' : '#2d2b28',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#383531')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? 'transparent' : '#2d2b28')}
                    >
                      <td style={{ padding: '20px', fontWeight: 'bold', ...getRankStyle(index) }}>
                        {index + 1}. {' '}
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                      </td>
                      
                      {/* --- KOLONA SA AVATAROM I IMENOM --- */}
                      <td style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <img 
                          src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user.avatar_seed || 'Felix'}`} 
                          alt="Avatar" 
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '50%', 
                            border: '2px solid #454341',
                            backgroundColor: '#262421' 
                          }}
                        />
                        <span style={{ fontWeight: '500' }}>{user.username}</span>
                      </td>

                      <td style={{ padding: '20px', textAlign: 'right', color: '#81b64c', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        {user.score}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                      Još uvek nema podataka. Budi prvi koji će osvojiti vrh!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;