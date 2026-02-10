from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models import models
from app.schemas import user as user_schema
from app.api.auth import get_current_user
from app.core import security

router = APIRouter()

# --- PREGLED SOPSTVENOG PROFILA ---
@router.get("/me", response_model=user_schema.UserOut)
def get_my_profile(current_user: models.User = Depends(get_current_user)):
    """Vraća podatke trenutno ulogovanog korisnika."""
    return current_user

# --- IZMENA SOPSTVENOG PROFILA ---
@router.put("/me", response_model=user_schema.UserOut)
def update_my_profile(
    user_update: user_schema.UserCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    """Korisnik menja svoje ime ili lozinku."""
    # Provera da li je novo ime već zauzeto (ako ga menja)
    if user_update.username != current_user.username:
        existing = db.query(models.User).filter(models.User.username == user_update.username).first()
        if existing:
            raise HTTPException(status_code=400, detail="Korisničko ime je zauzeto.")
        current_user.username = user_update.username

    # Heširanje nove lozinke
    if user_update.password:
        current_user.password_hash = security.get_password_hash(user_update.password)
    
    db.commit()
    db.refresh(current_user)
    return current_user