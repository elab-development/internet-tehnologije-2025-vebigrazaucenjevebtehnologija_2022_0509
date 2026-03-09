from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Optional

from app.db.session import get_db
from app.models import models
from app.api.deps import get_current_user
from app.schemas.level import LevelOut, LevelCreate, LevelSolve

router = APIRouter()

# 1. LISTANJE SVIH NIVOA - JAVNO
@router.get("/", response_model=List[LevelOut])
def list_levels(db: Session = Depends(get_db)):
    return db.query(models.Level).order_by(models.Level.order_index).all()

# 2. DETALJI JEDNOG NIVOA - JAVNO
@router.get("/{level_id}", response_model=LevelOut)
def get_level(level_id: UUID, db: Session = Depends(get_db)):
    level = db.query(models.Level).filter(models.Level.id == level_id).first()
    if not level:
        raise HTTPException(status_code=404, detail="Nivo nije pronađen")
    return level

# 3. PROVERA REŠENJA
@router.post("/{level_id}/solve")
def solve_level(
    level_id: UUID, 
    solution: LevelSolve, 
    request: Request, # Dodajemo request da bismo ručno proverili token ako postoji
    db: Session = Depends(get_db)
):
    level = db.query(models.Level).filter(models.Level.id == level_id).first()
    if not level:
        raise HTTPException(status_code=404, detail="Nivo nije pronađen")

    # Čistimo FEN stringove
    client_fen = solution.current_fen.split(' ')[0].strip()
    target_fen = level.target_code.split(' ')[0].strip()

    # Prvo proveravamo da li je potez uopšte tačan
    if client_fen != target_fen:
        raise HTTPException(status_code=400, detail="Netačna pozicija, pokušaj ponovo.")

    # Ako je potez tačan, proveravamo da li je korisnik ulogovan da bismo upisali progres
    # Koristimo tvoj get_current_user samo ako u headeru postoji Authorization
    auth_header = request.headers.get("Authorization")
    
    if auth_header:
        try:
            # Ručno pozivamo tvoj dependency samo ako ima tokena
            current_user = get_current_user(db=db, token=auth_header.replace("Bearer ", ""))
            
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
        except Exception:
            # Ako je token neispravan, tretiramo ga kao gosta (ne pucamo)
            pass

    return {"status": "success", "message": "Tačno! Pozicija je ispravna."}