import React from 'react';

interface SuccessModalProps {
  message: string;
  onNext: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ message, onNext }) => {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', 
      justifyContent: 'center', alignItems: 'center', zIndex: 9999
    }}>
      <div style={{
        backgroundColor: '#262421', padding: '40px', borderRadius: '12px',
        border: '2px solid #81b64c', textAlign: 'center', maxWidth: '400px',
        boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)'
      }}>
        <h1 style={{ color: '#81b64c', marginBottom: '20px' }}>🎉 Tačan potez!</h1>
        
        <div style={{ 
          fontSize: '18px', color: '#fff', fontStyle: 'italic', 
          marginBottom: '30px', lineHeight: '1.4' 
        }}>
          "{message}"
        </div>

        <button 
          onClick={onNext}
          style={{
            padding: '12px 30px', backgroundColor: '#81b64c', color: '#000',
            border: 'none', borderRadius: '4px', fontWeight: 'bold',
            cursor: 'pointer', fontSize: '16px'
          }}
        >
          Sledeći nivo ➔
        </button>
      </div>
    </div>
  );
};