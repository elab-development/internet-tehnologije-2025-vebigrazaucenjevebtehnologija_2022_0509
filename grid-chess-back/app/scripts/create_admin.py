from app.db.session import SessionLocal
from app.models import models
from app.core import security
from app.models.models import UserRole  # Važno zbog tvog Enuma

def create_admin():
    db = SessionLocal()
    try:
        admin_username = "admin"
        admin_password = "admin"
        
        # Provera da li admin već postoji
        existing_admin = db.query(models.User).filter(models.User.username == admin_username).first()
        
        if existing_admin:
            print(f"⚠️ Korisnik '{admin_username}' već postoji u bazi.")
        else:
            # Kreiranje novog admina koristeći tvoja polja iz modela
            new_admin = models.User(
                username=admin_username,
                password_hash=security.get_password_hash(admin_password),
                role=UserRole.ADMIN  # Koristimo tvoj UserRole Enum
            )
            
            db.add(new_admin)
            db.commit()
            print(f"✅ Admin korisnik uspešno kreiran!")
            print(f"Username: {admin_username}")
            print(f"Password: {admin_password}")

    except Exception as e:
        print(f"❌ Greška pri kreiranju admina: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()