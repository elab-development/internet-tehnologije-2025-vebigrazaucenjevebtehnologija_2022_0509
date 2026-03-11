import React, { forwardRef, useImperativeHandle } from 'react';

interface ChessBoardProps {
  initialPosition: string; 
  pieceType?: string;      
  userStyle?: React.CSSProperties; 
}

const PIECE_IMAGES: Record<string, string> = {
  'p': "https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg",
  'r': "https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg",
  'n': "https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg",
  'b': "https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg",
  'q': "https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg",
  'k': "https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg",
  'P': "https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg",
  'R': "https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg",
  'N': "https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg",
  'B': "https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg",
  'Q': "https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg",
  'K': "https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg",
};

export const ChessBoard = forwardRef<any, ChessBoardProps>(({ initialPosition, pieceType, userStyle }, ref) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const parseFen = (fen: string) => {
    if (!fen) return [];
    const rows = fen.split(' ')[0].split('/');
    const board: { type: string; row: number; col: number; id: string }[] = [];
    rows.forEach((row, rowIndex) => {
      let colIndex = 0;
      for (const char of row) {
        if (isNaN(parseInt(char))) {
          board.push({ 
            type: char, 
            row: rowIndex + 1, 
            col: colIndex + 1,
            id: `${char}-${rowIndex}-${colIndex}` 
          });
          colIndex++;
        } else {
          colIndex += parseInt(char);
        }
      }
    });
    return board;
  };

  // Ova funkcija se poziva iz Dashboard-a preko ref.current.calculateFen()
  useImperativeHandle(ref, () => ({
    calculateFen: () => {
      const currentPieces = parseFen(initialPosition);
      const updatedPieces = currentPieces.map(p => {
        const isTarget = 
          (pieceType === 'pawn' && p.type === 'P' && p.row === 7 && p.col === 5) ||
          (pieceType === 'knight' && p.type === 'N' && p.row === 8 && p.col === 7) ||
          (pieceType === 'bishop' && p.type === 'B' && p.row === 8 && p.col === 6);

        if (isTarget && userStyle) {
          return {
            ...p,
            row: userStyle.gridRow ? parseInt(userStyle.gridRow as string) : p.row,
            col: userStyle.gridColumn ? parseInt(userStyle.gridColumn as string) : p.col
          };
        }
        return p;
      });

      let fenRows = [];
      for (let r = 1; r <= 8; r++) {
        let rowStr = "";
        let emptyCount = 0;
        for (let c = 1; c <= 8; c++) {
          const p = updatedPieces.find(piece => piece.row === r && piece.col === c);
          if (p) {
            if (emptyCount > 0) { rowStr += emptyCount; emptyCount = 0; }
            rowStr += p.type;
          } else {
            emptyCount++;
          }
        }
        if (emptyCount > 0) rowStr += emptyCount;
        fenRows.push(rowStr);
      }
      return fenRows.join('/') + " w - - 0 1";
    }
  }));

  const pieces = parseFen(initialPosition);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
      {/* Vertikalni brojevi */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '560px', justifyContent: 'space-around', color: '#bababa', fontSize: '14px', fontWeight: 'bold', paddingBottom: '25px' }}>
        {ranks.map(r => <span key={r}>{r}</span>)}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Tabla */}
        <div style={{
          position: 'relative', width: '560px', height: '560px', backgroundColor: '#312e2b', borderRadius: '2px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gridTemplateRows: 'repeat(8, 1fr)',
        }}>
          {Array.from({ length: 64 }).map((_, i) => {
            const r = Math.floor(i / 8);
            const c = i % 8;
            return <div key={`sq-${i}`} style={{ gridRow: r + 1, gridColumn: c + 1, backgroundColor: (r + c) % 2 === 0 ? '#ebecd0' : '#779556' }} />;
          })}

          {pieces.map((piece) => {
            const isTarget = 
              (pieceType === 'pawn' && piece.type === 'P' && piece.row === 7 && piece.col === 5) ||
              (pieceType === 'knight' && piece.type === 'N' && piece.row === 8 && piece.col === 7) ||
              (pieceType === 'bishop' && piece.type === 'B' && piece.row === 8 && piece.col === 6);

            return (
              <div
                key={piece.id}
                style={{
                  gridRow: piece.row,
                  gridColumn: piece.col,
                  zIndex: isTarget ? 10 : 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transition: 'all 0.4s ease-out',
                  ...(isTarget ? userStyle : {}),
                }}
              >
                <img src={PIECE_IMAGES[piece.type]} alt={piece.type} style={{ width: '95%', height: '95%', pointerEvents: 'none' }} />
              </div>
            );
          })}
        </div>

        {/* Horizontalna slova */}
        <div style={{ display: 'flex', width: '560px', justifyContent: 'space-around', color: '#bababa', fontSize: '14px', fontWeight: 'bold' }}>
          {files.map(f => <span key={f}>{f}</span>)}
        </div>
      </div>
    </div>
  );
});