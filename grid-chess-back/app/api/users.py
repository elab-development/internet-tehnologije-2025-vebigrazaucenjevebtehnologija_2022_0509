from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from typing import Any
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
    payload: dict = Body(...), 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(get_current_user)
):
    """
    Korisnik menja svoje ime, lozinku ili avatar.
    Prima sirovi JSON (dict) kako bi izbegli striktnu validaciju UserCreate šeme.
    """
    
    # 1. Izmena korisničkog imena
    new_username = payload.get("username")
    if new_username and new_username != current_user.username:
        # Provera da li je novo ime već zauzeto
        existing = db.query(models.User).filter(models.User.username == new_username).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Korisničko ime je zauzeto."
            )
        current_user.username = new_username

    # 2. Izmena lozinke
    new_password = payload.get("password")
    if new_password: # Ako string nije prazan
        current_user.password_hash = security.get_password_hash(new_password)
    
    # 3. Izmena avatara (opciono, ako kolona postoji u bazi)
    avatar_seed = payload.get("avatar_seed")
    if avatar_seed and hasattr(current_user, "avatar_seed"):
        current_user.avatar_seed = avatar_seed
    
    try:
        db.commit()
        db.refresh(current_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Greška pri čuvanju podataka u bazi."
        )
        
    return current_user