from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.db.session import get_db
from app.models import models

router = APIRouter()

@router.get("/", response_model=List[dict])
def get_leaderboard(db: Session = Depends(get_db)):
    """
    Povlači top 10 korisnika sa njihovim avatarima, 
    sortiranih po broju rešenih nivoa.
    """
    leaderboard_data = (
        db.query(
            models.User.username,
            models.User.avatar_seed, # DODATO: Eksplicitno tražimo avatar_seed iz baze
            func.count(models.UserProgress.level_id).label("score")
        )
        .join(models.UserProgress, models.User.id == models.UserProgress.user_id)
        .group_by(models.User.id, models.User.username, models.User.avatar_seed) # DODATO u group_by
        .order_by(func.count(models.UserProgress.level_id).desc())
        .limit(10)
        .all()
    )

    # DODATO: Uključujemo avatar_seed u rečnik koji šaljemo frontendu
    return [
        {
            "username": row.username, 
            "avatar_seed": row.avatar_seed, 
            "score": row.score
        } 
        for row in leaderboard_data
    ]