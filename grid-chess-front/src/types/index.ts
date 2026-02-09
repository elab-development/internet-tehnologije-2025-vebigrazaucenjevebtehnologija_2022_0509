export interface User {
    id: number;
    username: string;
    role: string;
  }
  
  export interface ChessLevel {
    id: number;
    name: string;
    instruction: string;
    fen: string;
  }
  
  export interface AuthResponse {
    access_token: string;
    token_type: string;
  }