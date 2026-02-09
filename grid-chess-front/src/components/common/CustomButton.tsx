import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'danger';
  disabled?: boolean; // <-- DODATO
}

export const CustomButton: React.FC<ButtonProps> = ({ 
  label, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  disabled = false // <-- DODATO podrazumevano stanje
}) => {
  
  // Određujemo boju: ako je disabled, biće siva, inače ide tvoja primarna ili danger boja
  const getBackgroundColor = () => {
    if (disabled) return '#555555'; 
    return variant === 'primary' ? '#769656' : '#e74c3c';
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled} // <-- Prosleđujemo HTML atributu
      style={{ 
        backgroundColor: getBackgroundColor(), 
        color: disabled ? '#aaaaaa' : 'white', 
        padding: '10px 20px', 
        border: 'none', 
        borderRadius: '5px', 
        cursor: disabled ? 'not-allowed' : 'pointer', // Menja kursor u "stop" znak
        width: '100%',
        fontWeight: 'bold',
        opacity: disabled ? 0.7 : 1, // Malo providnije kad je ugašeno
        transition: 'all 0.3s ease'
      }}
    >
      {label}
    </button>
  );
};