import uuid
from enum import Enum as PyEnum
from sqlalchemy import String, Text, Integer, Boolean, ForeignKey, Enum, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

class UserRole(str, PyEnum):
    ADMIN = "admin"
    LOGGED_USER = "logged_user"
    GUEST = "guest"

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=True)
    password_hash: Mapped[str] = mapped_column(Text, nullable=True)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.GUEST)
    avatar_seed: Mapped[str] = mapped_column(String(100), nullable=True, default="Felix")

    progress: Mapped[list["UserProgress"]] = relationship(back_populates="user")

class Level(Base):
    __tablename__ = "levels"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, unique=True, nullable=False)
    instruction: Mapped[str] = mapped_column(Text, nullable=False)
    
    # DODAJEMO OVO: Početni raspored figura (FEN)
    initial_position: Mapped[str] = mapped_column(Text, nullable=False)
    
    # OSTAJE OVO: Tačan kod/potez koji korisnik treba da unese
    target_code: Mapped[str] = mapped_column(Text, nullable=False)

    user_progress: Mapped[list["UserProgress"]] = relationship(back_populates="level")

class UserProgress(Base):
    __tablename__ = "user_progress"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    level_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("levels.id"), nullable=False)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)

    user: Mapped["User"] = relationship(back_populates="progress")
    level: Mapped["Level"] = relationship(back_populates="user_progress")