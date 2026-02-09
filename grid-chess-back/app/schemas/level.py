from pydantic import BaseModel, ConfigDict
from uuid import UUID
from typing import Optional

class LevelBase(BaseModel):
    name: str
    order_index: int
    instruction: str
    initial_position: str

class LevelCreate(LevelBase):
    target_code: str

# Sema bez resenja koju saljemo frontendu
class LevelOut(LevelBase):
    id: UUID
    
    model_config = ConfigDict(from_attributes=True)

# Sema za proveru resenja
class LevelSolve(BaseModel):
    submitted_code: str