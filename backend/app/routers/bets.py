from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime
import uuid

from app.db import get_db
from app.models import Bet, User
from app.routers.auth import get_current_user, get_optional_current_user

router = APIRouter()


# Pydantic models
class CreateBetRequest(BaseModel):
    blue_team: Dict[str, Any]
    red_team: Dict[str, Any]
    spread: Optional[str] = None
    bet_amount: float


class CallBetRequest(BaseModel):
    bet_id: str
    call_amount: float


class UpdateBetRequest(BaseModel):
    bet_id: str
    status: Optional[str] = None
    blue_team: Optional[Dict[str, Any]] = None
    red_team: Optional[Dict[str, Any]] = None
    spread: Optional[str] = None


class BandwagonBetRequest(BaseModel):
    bet_id: str
    bet_amount: float


# Routes
@router.get("/get_recent_bets")
def get_recent_bets(
    last_synced_timestamp: int = Query(default=0),
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_optional_current_user)
):
    # Get all bets (or filter by timestamp for incremental sync)
    query = db.query(Bet)

    if last_synced_timestamp > 0:
        # Convert timestamp to datetime
        sync_time = datetime.fromtimestamp(last_synced_timestamp / 1000)
        query = query.filter(Bet.updated_at >= sync_time)

    bets = query.order_by(Bet.created_at.desc()).all()
    return [bet.to_dict() for bet in bets]


@router.get("/get_bet")
def get_bet(
    bet_id: str = Query(...),
    db: Session = Depends(get_db)
):
    bet = db.query(Bet).filter(Bet.bet_id == bet_id).first()
    if not bet:
        raise HTTPException(status_code=404, detail="Bet not found")
    return bet.to_dict()


@router.post("/create_bet")
def create_bet(
    request: CreateBetRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    bet_id = f"BET-{uuid.uuid4().hex[:8].upper()}"

    bet = Bet(
        bet_id=bet_id,
        status="Open",
        blue_team=request.blue_team,
        red_team=request.red_team,
        spread=request.spread,
        created_by_id=user.id,
        created_by=user.login_email,
        open_bets=[{
            "bettor": user.login_email,
            "bet_amount": request.bet_amount
        }]
    )

    db.add(bet)
    db.commit()
    db.refresh(bet)

    return bet.to_dict()


@router.post("/call_bet")
def call_bet(
    request: CallBetRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    bet = db.query(Bet).filter(Bet.bet_id == request.bet_id).first()
    if not bet:
        raise HTTPException(status_code=404, detail="Bet not found")

    if bet.status != "Open":
        raise HTTPException(status_code=400, detail="Bet is not open")

    if not bet.open_bets:
        raise HTTPException(status_code=400, detail="No open bets to call")

    # Move the first open bet to live
    open_bet = bet.open_bets[0]
    remaining_open = bet.open_bets[1:] if len(bet.open_bets) > 1 else []

    live_bet = {
        "bettor": open_bet["bettor"],
        "caller": user.login_email,
        "bet_amount": min(open_bet["bet_amount"], request.call_amount)
    }

    bet.open_bets = remaining_open
    bet.live_bets = (bet.live_bets or []) + [live_bet]

    # If no more open bets, change status to Live
    if not bet.open_bets:
        bet.status = "Live"

    db.commit()
    db.refresh(bet)

    return bet.to_dict()


@router.post("/update_bet")
def update_bet(
    request: UpdateBetRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    bet = db.query(Bet).filter(Bet.bet_id == request.bet_id).first()
    if not bet:
        raise HTTPException(status_code=404, detail="Bet not found")

    # Only creator or admin can update
    if bet.created_by != user.login_email and not user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized to update this bet")

    if request.status:
        old_status = bet.status
        bet.status = request.status

        # Handle status transitions
        if request.status == "Decided" and old_status == "Live":
            bet.decision_timestamp = int(datetime.utcnow().timestamp())
            # Move live bets to decided
            bet.decided_bets = bet.live_bets or []
            bet.live_bets = []

        elif request.status == "Expired":
            bet.expiration_timestamp = int(datetime.utcnow().timestamp())
            bet.expired_bets = (bet.open_bets or []) + (bet.live_bets or [])
            bet.open_bets = []
            bet.live_bets = []

        elif request.status == "Cancelled":
            bet.cancelled_bets = (bet.open_bets or []) + (bet.live_bets or [])
            bet.open_bets = []
            bet.live_bets = []

    if request.blue_team:
        bet.blue_team = request.blue_team
    if request.red_team:
        bet.red_team = request.red_team
    if request.spread:
        bet.spread = request.spread

    db.commit()
    db.refresh(bet)

    return bet.to_dict()


@router.post("/bandwagon_bet")
def bandwagon_bet(
    request: BandwagonBetRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    bet = db.query(Bet).filter(Bet.bet_id == request.bet_id).first()
    if not bet:
        raise HTTPException(status_code=404, detail="Bet not found")

    if bet.status != "Open":
        raise HTTPException(status_code=400, detail="Bet is not open for bandwagon")

    # Add user to open bets
    new_open_bet = {
        "bettor": user.login_email,
        "bet_amount": request.bet_amount
    }

    bet.open_bets = (bet.open_bets or []) + [new_open_bet]

    db.commit()
    db.refresh(bet)

    return bet.to_dict()
