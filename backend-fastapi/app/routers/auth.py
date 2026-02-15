from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import get_db
from app import models, schemas
from app.auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=schemas.Token)
def register(payload: schemas.RegisterIn, db: Session = Depends(get_db)):
    exists = db.query(models.User).filter(models.User.email == payload.email).first()
    if exists:
        raise HTTPException(status_code=400, detail="Email already in use")

    user = models.User(
        email=payload.email,
        full_name=payload.full_name,
        password_hash=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": user.role, "avatar_url": None})
    return schemas.Token(access_token=token)

@router.post("/login", response_model=schemas.Token)
def login(payload: schemas.LoginIn, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    # Перевірка чи користувач заблокований
    if user.is_blocked == "true":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail=f"Ваш обліковий запис заблоковано. Причина: {user.blocked_reason or 'Не вказана'}"
        )

    token = create_access_token({
        "sub": str(user.id), 
        "role": user.role,
        "avatar_url": user.avatar_url
    })
    return schemas.Token(access_token=token)

@router.get("/me", response_model=schemas.UserOut)
def me(user: models.User = Depends(get_current_user)):
    # Return user with avatar_url explicitly set
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "avatar_url": user.avatar_url,
        "portfolio_urls": user.portfolio_urls or []
    }
