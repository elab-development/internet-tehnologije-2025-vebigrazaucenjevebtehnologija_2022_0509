import React from 'react';
import { ChessLevel } from '../../types'; // Proveri da li je putanja do types ispravna
import { CustomButton } from './CustomButton';

interface LevelCardProps {
  level: ChessLevel;
  onPlay: (level: ChessLevel) => void;
}

export const LevelCard: React.FC<LevelCardProps> = ({ level, onPlay }) => {
  return (
    <div style={{ 
      border: '1px solid #ddd', 
      padding: '20px', 
      borderRadius: '12px', 
      textAlign: 'center', 
      backgroundColor: '#fdfdfd',
      boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
    }}>
      <h3 style={{ marginTop: 0, color: '#333' }}>{level.name}</h3>
      <p style={{ minHeight: '40px', color: '#666', fontSize: '14px' }}>
        {level.instruction}
      </p>
      {/* Koristimo tvoj CustomButton unutar kartice */}
      <CustomButton 
        label="Igraj nivo" 
        onClick={() => onPlay(level)} 
      />
    </div>
  );
};