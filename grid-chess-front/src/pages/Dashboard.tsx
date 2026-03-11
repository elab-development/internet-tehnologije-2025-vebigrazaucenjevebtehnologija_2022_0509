import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import api from '../api/axios';
import { ChessBoard } from '../components/common/ChessBoard';
import { SuccessModal } from '../components/common/SuccessModal'; // Importovan modal
import Navbar from '../components/common/Navbar';

const Dashboard: React.FC = () => {
  const [levels, setLevels] = useState<any[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<any>(null);
  const [userCode, setUserCode] = useState<string>("");
  const [appliedStyle, setAppliedStyle] = useState<React.CSSProperties>({});
  const [loading, setLoading] = useState(true);
  
  // NOVO ZA SUCCESS MODAL I API
  const [showSuccess, setShowSuccess] = useState(false);
  const [advice, setAdvice] = useState("");

  // NOVO: Prati koliko je nivoa Gost otključao (kreće od 1)
  const [unlockedLevelsCount, setUnlockedLevelsCount] = useState<number>(1);

  const boardRef = useRef<any>(null);
  const isGuest = localStorage.getItem('token') === 'guest-mode';

  useEffect(() => {
    setLoading(true);
    api.get('/levels')
      .then(res => {
        const sorted = res.data.sort((a: any, b: any) => a.order_index - b.order_index);
        setLevels(sorted);
        if (sorted.length > 0) {
          setSelectedLevel(sorted[0]);
        }
      })
      .catch(err => console.error("Greška:", err))
      .finally(() => setLoading(false));
  }, []);

  useLayoutEffect(() => {
    const style: React.CSSProperties = {};
    const rowMatch = userCode.match(/grid-row:\s*(\d+)/);
    const colMatch = userCode.match(/grid-column:\s*(\d+)/);
    if (rowMatch) style.gridRow = rowMatch[1];
    if (colMatch) style.gridColumn = colMatch[1];
    setAppliedStyle(style);
  }, [userCode]);

  // Funkcija za dovlačenje motivacione poruke sa spoljnog API-ja
  const fetchAdvice = async () => {
    try {
      const res = await fetch('https://api.adviceslip.com/advice');
      const data = await res.json();
      setAdvice(data.slip.advice);
    } catch (err) {
      setAdvice("Always double check your moves, Grandmaster!");
    }
  };

  const handleLevelChange = (level: any, index: number) => {
    if (isGuest && index + 1 > unlockedLevelsCount) {
      alert("Moraš preći prethodne nivoe da bi otključao ovaj!");
      return;
    }
    setSelectedLevel(level);
    setUserCode(""); 
    setAppliedStyle({});
  };

  const prelazakNaSledeciNivo = () => {
    const currentIndex = levels.findIndex(l => l.id === selectedLevel.id);
    
    if (isGuest && currentIndex + 1 === unlockedLevelsCount) {
      setUnlockedLevelsCount(prev => prev + 1);
    }

    if (currentIndex < levels.length - 1) {
      const nextLevel = levels[currentIndex + 1];
      setSelectedLevel(nextLevel);
      setUserCode("");
      setAppliedStyle({});
    } else {
      alert("Čestitamo! Prešli ste sve nivoe.");
    }
  };

  const handleCheckMove = async () => {
    if (!selectedLevel || !boardRef.current) return;
    const currentFen = boardRef.current.calculateFen();

    try {
      const res = await api.post(`/levels/${selectedLevel.id}/solve`, {
        submitted_code: userCode,
        current_fen: currentFen 
      });
      
      if (res.data.status === "success") {
        // Pozivamo API za poruku i otvaramo modal umesto alert-a
        await fetchAdvice();
        setShowSuccess(true);
      }
    } catch (err: any) {
      const message = err.response?.data?.detail || "Netačna pozicija, pokušaj ponovo.";
      alert(message);
    }
  };

  if (loading) return <div style={{ color: 'white', padding: '20px' }}>Učitavanje...</div>;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#262421' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, padding: '20px', gap: '20px', overflow: 'hidden' }}>
        
        <div style={{ width: '450px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#312e2b', padding: '20px', borderRadius: '8px', color: '#fff' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
              {levels.map((l, i) => {
                const isLocked = isGuest && (i + 1 > unlockedLevelsCount);
                return (
                  <button 
                    key={l.id} 
                    onClick={() => handleLevelChange(l, i)} 
                    style={{
                      width: '35px', height: '35px', border: 'none', borderRadius: '4px',
                      backgroundColor: selectedLevel?.id === l.id ? '#81b64c' : (isLocked ? '#2a2a2a' : '#454341'),
                      color: isLocked ? '#666' : 'white', 
                      cursor: isLocked ? 'not-allowed' : 'pointer', 
                      fontWeight: 'bold',
                      opacity: isLocked ? 0.5 : 1
                    }}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <h2 style={{ margin: '0 0 10px 0', color: '#81b64c' }}>{selectedLevel?.name}</h2>
            <p style={{ fontSize: '14px', color: '#bababa', lineHeight: '1.6' }}>{selectedLevel?.instruction}</p>
          </div>

          <div style={{ flex: 1, backgroundColor: '#1e1e1e', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', border: '1px solid #333' }}>
            <div style={{ padding: '10px', fontSize: '12px', color: '#666', background: '#2b2b2b' }}>CSS EDITOR</div>
            <Editor
              theme="vs-dark"
              defaultLanguage="css"
              value={userCode}
              onChange={(v) => setUserCode(v || "")}
              options={{ minimap: { enabled: false }, fontSize: 16, lineNumbers: 'on', automaticLayout: true }}
            />
            <button 
              onClick={handleCheckMove}
              style={{ padding: '20px', border: 'none', backgroundColor: '#81b64c', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}
            >
              PROVERI POTEZ
            </button>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#211f1c', borderRadius: '8px', border: '1px solid #333' }}>
          {selectedLevel && (
            <ChessBoard 
              ref={boardRef} 
              initialPosition={selectedLevel.initial_position}
              pieceType={selectedLevel.order_index === 1 ? 'pawn' : (selectedLevel.order_index === 2 ? 'knight' : 'bishop')}
              userStyle={appliedStyle}
            />
          )}
        </div>
      </div>

      {/* RENDER MODALA AKO JE POTEZ TAČAN */}
      {showSuccess && (
        <SuccessModal 
          message={advice} 
          onNext={() => {
            setShowSuccess(false);
            prelazakNaSledeciNivo();
          }} 
        />
      )}
    </div>
  );
};

export default Dashboard;