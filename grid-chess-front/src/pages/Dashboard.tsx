import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react'; // Importujemo Monaco
import api from '../api/axios';
import { ChessLevel } from '../types';
import { LevelCard } from '../components/common/LevelCard';
import Navbar from '../components/common/Navbar';

const Dashboard: React.FC = () => {
  const [levels, setLevels] = useState<ChessLevel[]>([]);
  const [code, setCode] = useState<string | undefined>(
    "/* Vežbaj CSS Grid za šahovsku tablu */\n.board {\n  display: grid;\n  grid-template-columns: repeat(8, 50px);\n  grid-template-rows: repeat(8, 50px);\n}"
  );

  const colors = {
    darkest: '#37353E',
    dark: '#44444E',
    accent: '#715A5A',
    light: '#D3DAD9'
  };

  useEffect(() => {
    api.get<ChessLevel[]>('/levels')
      .then(res => setLevels(res.data))
      .catch(err => console.error("Greška", err));
  }, []);

  return (
    <div style={{ backgroundColor: colors.darkest, minHeight: '100vh' }}>
      <Navbar />

      <div style={{ padding: '30px', maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '30px', height: 'calc(100vh - 150px)' }}>
          
          {/* LEVO: Nivoi (Skroluju se nezavisno) */}
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
            <h2 style={{ color: colors.light, marginBottom: '20px' }}>Šahovski Moduli</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {levels.map(lvl => (
                <LevelCard 
                  key={lvl.id} 
                  level={lvl} 
                  onPlay={(l) => alert(`Analiziraj CSS Grid za nivo: ${l.name}`)} 
                />
              ))}
            </div>
          </div>

          {/* DESNO: Monaco Code Editor */}
          <div style={{ 
            flex: 2, 
            backgroundColor: colors.dark, 
            borderRadius: '15px', 
            overflow: 'hidden', // Važno za zaobljene ivice editora
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <div style={{ padding: '15px', backgroundColor: '#2d2d30', color: colors.light, fontSize: '14px', borderBottom: `1px solid ${colors.accent}` }}>
              ⚡ CSS Grid Editor (Board-Logic-Lab)
            </div>
            <Editor
              height="100%"
              defaultLanguage="css"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value)}
              options={{
                fontSize: 16,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;