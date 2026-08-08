from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import JWTError, jwt
from werkzeug.security import generate_password_hash, check_password_hash
from typing import Optional

from app.db import get_db
from app.models import User
from app.core.settings import settings

router = APIRouter()
security = HTTPBearer(auto_error=False)


# Pydantic models
class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    email: str
    password: str
    display_name: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


# JWT helpers
def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None


# Dependencies
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")

    payload = decode_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user


def get_optional_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> Optional[User]:
    if not credentials:
        return None

    payload = decode_token(credentials.credentials)
    if not payload:
        return None

    user_id = payload.get("sub")
    if not user_id:
        return None

    return db.query(User).filter(User.id == int(user_id)).first()


def get_admin_user(user: User = Depends(get_current_user)) -> User:
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# Routes
@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.login_email == request.email).first()

    if not user or not check_password_hash(user.password_hash, request.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(user.id)})

    return {
        "access_token": token,
        "user": user.to_dict()
    }


@router.post("/register", response_model=TokenResponse)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    # Check if user exists
    existing = db.query(User).filter(User.login_email == request.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user
    user = User(
        login_email=request.email,
        password_hash=generate_password_hash(request.password),
        display_name=request.display_name or request.email.split("@")[0]
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id)})

    return {
        "access_token": token,
        "user": user.to_dict()
    }


@router.post("/change_password")
def change_password(
    request: ChangePasswordRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not check_password_hash(user.password_hash, request.current_password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    user.password_hash = generate_password_hash(request.new_password)
    db.commit()

    # Return new token
    token = create_access_token({"sub": str(user.id)})

    return {
        "access_token": token,
        "message": "Password changed successfully"
    }


@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    return user.to_dict()
