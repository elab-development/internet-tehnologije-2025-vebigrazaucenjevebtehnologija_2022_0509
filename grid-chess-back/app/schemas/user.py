from pydantic import BaseModel, ConfigDict
from uuid import UUID
from typing import Optional
from app.models.models import UserRole

# Osnovna shema koju dele i kreiranje i čitanje
class UserBase(BaseModel):
    username: Optional[str] = None
    role: UserRole = UserRole.LOGGED_USER
    # Dodajemo avatar_seed ovde jer ga koriste i UserCreate (opciono) i UserOut
    avatar_seed: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: UUID
    # avatar_seed je već nasleđen iz UserBase, tako da će se pojaviti u odgovoru
    
    # Ovo dozvoljava Pydantic-u da čita podatke iz SQLAlchemy objekata
    model_config = ConfigDict(from_attributes=True)