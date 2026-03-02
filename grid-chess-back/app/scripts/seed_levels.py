from app.db.session import SessionLocal
from app.models import models

def seed_levels():
    db = SessionLocal()
    try:
        # Brišemo stare nivoe da imamo čistu situaciju
        db.query(models.Level).delete()
        
        levels = [
            models.Level(
                name="Nivo 1: Kraljev pešak",
                order_index=1,
                instruction="Počni partiju klasično. Pomeri belog pešaka sa e2 na e4 koristeći 'grid-row: 5;'.",
                initial_position="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR", 
                target_code="grid-row: 5;"
            ),
            models.Level(
                name="Nivo 2: Razvijanje skakača",
                order_index=2,
                instruction="Crni je odigrao e5. Sada razvij svog skakača sa g1 na f3. (grid-column: 6; grid-row: 6;)",
                initial_position="rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR", 
                target_code="grid-column: 6; grid-row: 6;"
            ),
            models.Level(
                name="Nivo 3: Napad lovcem",
                order_index=3,
                instruction="Vreme je za pritisak. Pomeri lovca sa f1 na c4 da napadneš polje f7. (grid-column: 3; grid-row: 5;)",
                initial_position="rnbqkbnr/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R", 
                target_code="grid-column: 3; grid-row: 5;"
            )
        ]
        
        db.add_all(levels)
        db.commit()
        print("✅ Uspešno dodata 3 nivoa!")
    except Exception as e:
        print(f"❌ Greška: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_levels()