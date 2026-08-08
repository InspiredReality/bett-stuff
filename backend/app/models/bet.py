from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db import Base


class Bet(Base):
    __tablename__ = "bets"

    id = Column(Integer, primary_key=True, index=True)
    bet_id = Column(String, unique=True, index=True, nullable=False)
    status = Column(String, default="Open")  # Open, Live, Decided, Expired, Cancelled

    # Teams stored as JSON: {"TeamName": score}
    blue_team = Column(JSON, default={})
    red_team = Column(JSON, default={})
    spread = Column(String, nullable=True)

    # Creator
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    creator = relationship("User", back_populates="bets_created", foreign_keys=[created_by_id])
    created_by = Column(String, nullable=True)  # Email for quick access

    # Bet pools stored as JSON arrays
    open_bets = Column(JSON, default=[])      # [{bettor, bet_amount}]
    live_bets = Column(JSON, default=[])      # [{bettor, caller, bet_amount}]
    decided_bets = Column(JSON, default=[])   # [{bettor, caller, bet_amount, winner}]
    expired_bets = Column(JSON, default=[])
    cancelled_bets = Column(JSON, default=[])

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    decision_timestamp = Column(Integer, nullable=True)
    expiration_timestamp = Column(Integer, nullable=True)

    def to_dict(self):
        return {
            "bet_id": self.bet_id,
            "status": self.status,
            "blue_team": self.blue_team or {},
            "red_team": self.red_team or {},
            "spread": self.spread,
            "created_by": self.created_by,
            "open_bets": self.open_bets or [],
            "live_bets": self.live_bets or [],
            "decided_bets": self.decided_bets or [],
            "expired_bets": self.expired_bets or [],
            "cancelled_bets": self.cancelled_bets or [],
            "created_at": int(self.created_at.timestamp()) if self.created_at else None,
            "decision_timestamp": self.decision_timestamp,
            "expiration_timestamp": self.expiration_timestamp
        }
