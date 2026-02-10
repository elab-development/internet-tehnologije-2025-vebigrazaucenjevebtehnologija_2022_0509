import React from 'react';
import Navbar from '../components/common/Navbar';

const Leaderboard: React.FC = () => {
  const colors = {
    darkest: '#37353E',
    dark: '#44444E',
    accent: '#715A5A',
    light: '#D3DAD9',
    chessGreen: '#769656'
  };

  return (
    <div style={{ backgroundColor: colors.darkest, minHeight: '100vh', color: colors.light }}>
      <Navbar />
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh',
        textAlign: 'center',
        padding: '0 20px'
      }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🏆</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Rang Lista</h1>
        <h2 style={{ color: colors.chessGreen, fontWeight: 'normal', opacity: 0.8 }}>
          Stranica je trenutno u pripremi...
        </h2>
        
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          border: `1px dashed ${colors.accent}`, 
          borderRadius: '10px',
          maxWidth: '400px'
        }}>
          <p style={{ fontSize: '14px', lineHeight: '1.6', opacity: 0.7 }}>
            Ovde će se uskoro nalaziti najbolji rešavači šahovskih problema. 
            Vrati se uskoro da proveriš svoje mesto na tabeli!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;