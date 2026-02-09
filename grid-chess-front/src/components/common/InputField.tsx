import React from 'react';

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputField: React.FC<InputFieldProps> = ({ label, type, value, onChange }) => (
  <div style={{ marginBottom: '15px' }}>
    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={onChange} 
      style={{ 
        width: '100%', 
        padding: '12px', 
        borderRadius: '6px', 
        border: '1px solid #715A5A', 
        backgroundColor: '#D3DAD9', // Svetla boja iz palete za unutrašnjost
        color: '#37353E', // Tamna boja za tekst koji korisnik kuca
        boxSizing: 'border-box' // Da padding ne raširi input preko ivica
      }}
    />
  </div>
);