from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models import models
from app.core.config import settings  # Importujemo settings gde se nalazi SECRET_KEY

# Ovo govori Swagger-u i FastAPI-ju gde se nalazi login ruta
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    """
    Ova funkcija je 'čuvar'. Ona uzima token, proverava ga i 
    vraća ili pravog korisnika iz baze ili 'virtuelnog' gosta.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Nevažeći token ili sesija je istekla.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # 1. Dekodiranje tokena pomoću tajnog ključa iz settings-a
        payload = jwt.decode(
            token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        username: str = payload.get("username")
        user_id: str = payload.get("sub") # ID za usere ili "guest_ime" za goste
        is_guest: bool = payload.get("is_guest", False)
        
        if username is None:
            raise credentials_exception
            
    except jwt.PyJWTError:
        raise credentials_exception

    # 2. Logika za GOSTA
    if is_guest:
        # Vraćamo rečnik koji glumi usera da ostatak koda ne pukne
        return {
            "username": username, 
            "role": "guest", 
            "id": None, 
            "is_guest": True
        }

    # 3. Logika za REGISTROVANOG KORISNIKA
    # Ovde pretpostavljamo da je user_id u tokenu zapravo UUID u bazi
    user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if user is None:
        raise credentials_exception
        
    return user