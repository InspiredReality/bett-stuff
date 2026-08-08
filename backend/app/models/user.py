from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    login_email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    display_name = Column(String, nullable=True)
    display_icon_path = Column(String, nullable=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    bets_created = relationship("Bet", back_populates="creator", foreign_keys="Bet.created_by_id")

    def to_dict(self):
        return {
            "id": self.id,
            "login_email": self.login_email,
            "display_name": self.display_name,
            "display_icon_path": self.display_icon_path,
            "is_admin": self.is_admin,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
