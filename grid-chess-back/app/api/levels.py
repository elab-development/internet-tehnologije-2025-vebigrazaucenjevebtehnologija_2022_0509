from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.db.session import get_db
from app.models import models
from app.api.deps import get_current_user
from app.schemas.level import LevelOut, LevelCreate, LevelSolve

router = APIRouter()

# 1. LISTANJE SVIH NIVOA (Za Dashboard/Meni)
@router.get("/", response_model=List[LevelOut])
def list_levels(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Vraća listu svih nivoa za dashboard."""
    return db.query(models.Level).order_by(models.Level.order_index).all()

# 2. DETALJI JEDNOG NIVOA (Kada klikneš na nivo da ga igraš)
@router.get("/{level_id}", response_model=LevelOut)
def get_level(
    level_id: UUID, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    level = db.query(models.Level).filter(models.Level.id == level_id).first()
    if not level:
        raise HTTPException(status_code=404, detail="Nivo nije pronađen")
    return level


# 3. PROVERA REŠENJA (Kada korisnik pošalje potez/kod)
@router.post("/{level_id}/solve")
def solve_level(
    level_id: UUID, 
    solution: LevelSolve, 
    db: Session = Depends(get_db), 
    current_user = Depends(get_current_user)
):
    level = db.query(models.Level).filter(models.Level.id == level_id).first()
    if not level:
        raise HTTPException(status_code=404, detail="Nivo nije pronađen")

    # Provera da li je uneti kod/potez identičan onom u bazi
    if solution.submitted_code == level.target_code:
        # Ako je ulogovan korisnik (nije gost), sačuvaj mu progres u bazu
        is_guest = current_user.get("is_guest") if isinstance(current_user, dict) else False
        
        if not is_guest:
            # Proveri da li progres već postoji da ne dupliramo
            existing_progress = db.query(models.UserProgress).filter(
                models.UserProgress.user_id == current_user.id,
                models.UserProgress.level_id == level.id
            ).first()
            
            if not existing_progress:
                progress = models.UserProgress(
                    user_id=current_user.id,
                    level_id=level.id,
                    is_completed=True
                )
                db.add(progress)
                db.commit()
        
        return {"status": "success", "message": "Tačno! Nivo uspešno završen."}
    
    return {"status": "error", "message": "Pogrešan potez, pokušaj ponovo."}