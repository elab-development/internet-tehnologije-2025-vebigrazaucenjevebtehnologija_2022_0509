from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
import jwt
from jwt.exceptions import InvalidTokenError
from app.db.session import get_db
from app.models import models
from app.core.config import settings
from app.core import security
from app.schemas import user as user_schema
import random

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Moraš biti ulogovan",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Dekodiramo token
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        
        # Izvlačimo "sub" (to je user.id koji si stavio u login funkciji)
        user_id_val = payload.get("sub")
        if user_id_val is None:
            raise credentials_exception
            
    except (InvalidTokenError, jwt.ExpiredSignatureError):
        raise credentials_exception
    
    # PROVERA GUEST KORISNIKA
    if str(user_id_val).startswith("guest_"):
        # Vraćamo privremeni objekat korisnika koji nije u bazi
        # Dodajemo i default avatar za gosta da frontend ne bi pukao
        return models.User(
            username=payload.get("username"), 
            role="guest", 
            avatar_seed="Buddy" 
        )

    # PROVERA REGISTROVANOG KORISNIKA
    user = db.query(models.User).filter(models.User.id == user_id_val).first()
    
    if user is None:
        raise credentials_exception
        
    return user

# --- REGISTRACIJA ---
@router.post("/register", response_model=user_schema.UserOut)
def register(user_in: user_schema.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.username == user_in.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Korisničko ime je zauzeto.")
    
    try:
        hashed_pw = security.get_password_hash(user_in.password)
        
        # --- NASUMIČAN AVATAR PRI REGISTRACIJI ---
        starter_avatars = ['Felix', 'Aneka', 'Jack', 'Cali', 'Buddy', 'Milo', 'Leo']
        random_avatar = random.choice(starter_avatars)
        
        new_user = models.User(
            username=user_in.username,
            password_hash=hashed_pw,
            role=user_in.role,
            avatar_seed=random_avatar  # Upisujemo nasumičan izbor u bazu
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

    except Exception as e:
        db.rollback()
        print(f"Greška pri registraciji: {e}")
        raise HTTPException(status_code=500, detail="Sistemska greška pri upisu u bazu.")

# --- KLASIČAN LOGIN ---
@router.post("/login")
def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    
    if not user or not user.password_hash or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Neispravno korisničko ime ili lozinka"
        )
    
    # Token sadrži ID korisnika u "sub" polju
    access_token = security.create_access_token(
        data={"sub": str(user.id), "role": str(user.role), "username": user.username}
    )
    return {"access_token": access_token, "token_type": "bearer"}

# --- GUEST LOGIN ---
@router.post("/guest-login")
def guest_login(username: str):
    # Za gosta stavljamo fiksni ili nasumični avatar u token ako zatreba
    access_token = security.create_access_token(
        data={
            "sub": f"guest_{username}", 
            "role": "guest", 
            "username": username,
            "is_guest": True,
            "avatar_seed": "Buddy"
        }
    )
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "username": username,
        "role": "guest"
    }