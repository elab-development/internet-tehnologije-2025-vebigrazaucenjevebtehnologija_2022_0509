from app.db.session import engine
from app.models.models import Base
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn


# Kreiranje tabela u bazi 
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Chess Grid - Database Init")

# CORS podešavanja - neophodna da bi frontend (React) mogao da priča sa backendom
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "status": "Success",
        "message": "Baza podataka je uspešno inicijalizovana i tabele su napravljene!",
        "docs": "/docs"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)