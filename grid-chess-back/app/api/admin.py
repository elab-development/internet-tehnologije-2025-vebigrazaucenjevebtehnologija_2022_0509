from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from app.db.session import get_db
from app.models import models
from app.schemas import user as user_schema
from app.schemas import level as level_schema
from app.api.auth import get_current_user
from app.core import security

router = APIRouter()

# --- ZAŠTITA: Provera da li je korisnik admin ---
def verify_admin(current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Pristup odbijen. Potrebna su administratorska prava."
        )
    return current_user

# ==========================================
#          UPRAVLJANJE KORISNICIMA
# ==========================================

@router.get("/users", response_model=list[user_schema.UserOut])
def list_users(db: Session = Depends(get_db), _=Depends(verify_admin)):
    """Admin vidi sve korisnike u bazi."""
    return db.query(models.User).all()

@router.post("/users", response_model=user_schema.UserOut)
def create_user_by_admin(user_in: user_schema.UserCreate, db: Session = Depends(get_db), _=Depends(verify_admin)):
    """Admin ručno dodaje novog korisnika (npr. drugog admina)."""
    existing = db.query(models.User).filter(models.User.username == user_in.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Korisničko ime je već zauzeto.")
    
    new_user = models.User(
        username=user_in.username,
        password_hash=security.get_password_hash(user_in.password),
        role=user_in.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.put("/users/{user_id}", response_model=user_schema.UserOut)
def update_user_by_admin(
    user_id: UUID, 
    user_update: user_schema.UserCreate, 
    db: Session = Depends(get_db), 
    _=Depends(verify_admin)
):
    """Admin menja podatke korisnika (username, password ili role)."""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    user.username = user_update.username
    user.role = user_update.role
    # Ako je admin poslao novu lozinku, heširaj je i sačuvaj
    if user_update.password:
        user.password_hash = security.get_password_hash(user_update.password)
        
    db.commit()
    db.refresh(user)
    return user

@router.delete("/users/{user_id}")
def delete_user_by_admin(user_id: UUID, db: Session = Depends(get_db), _=Depends(verify_admin)):
    """Admin briše korisnika iz baze."""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen.")
    
    db.delete(user)
    db.commit()
    return {"message": f"Korisnik {user.username} je uspešno obrisan."}

# ==========================================
#            UPRAVLJANJE NIVOIMA
# ==========================================

@router.post("/levels", response_model=level_schema.LevelOut)
def create_level_by_admin(level_in: level_schema.LevelCreate, db: Session = Depends(get_db), _=Depends(verify_admin)):
    """Admin dodaje novi nivo igre."""
    new_level = models.Level(**level_in.dict())
    db.add(new_level)
    db.commit()
    db.refresh(new_level)
    return new_level

@router.put("/levels/{level_id}", response_model=level_schema.LevelOut)
def update_level_by_admin(
    level_id: UUID, 
    level_update: level_schema.LevelCreate, 
    db: Session = Depends(get_db), 
    _=Depends(verify_admin)
):
    """Admin menja postojeći nivo (FEN, uputstvo, kod)."""
    level = db.query(models.Level).filter(models.Level.id == level_id).first()
    if not level:
        raise HTTPException(status_code=404, detail="Nivo nije pronađen.")
    
    for key, value in level_update.dict().items():
        setattr(level, key, value)
    
    db.commit()
    db.refresh(level)
    return level

@router.delete("/levels/{level_id}")
def delete_level_by_admin(level_id: UUID, db: Session = Depends(get_db), _=Depends(verify_admin)):
    """Admin uklanja nivo iz igre."""
    level = db.query(models.Level).filter(models.Level.id == level_id).first()
    if not level:
        raise HTTPException(status_code=404, detail="Nivo nije pronađen.")
    
    db.delete(level)
    db.commit()
    return {"message": "Nivo je uspešno obrisan."}