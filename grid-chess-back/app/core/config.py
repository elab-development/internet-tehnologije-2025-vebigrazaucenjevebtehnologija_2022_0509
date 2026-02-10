import os
from dotenv import load_dotenv

# Učitavamo .env fajl
load_dotenv()

class Settings:
    PROJECT_NAME: str = "Chess Grid"
    
    # Izvlačimo podatke iz .env, a ako ih nema, koristimo "fallback" vrednosti
    SECRET_KEY: str = os.getenv("SECRET_KEY", "default_secret_key_for_dev")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440))
    
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/chess_grid")

# Instanciramo podešavanja da bismo ih koristili svuda
settings = Settings()