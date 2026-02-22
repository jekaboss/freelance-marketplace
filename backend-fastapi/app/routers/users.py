from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File, Body, Request
from sqlalchemy.orm import Session
from sqlalchemy import asc, desc
import os
import uuid
from app.db import get_db
from app import models, schemas
from app.auth import require_role, get_current_user

router = APIRouter(prefix="/users", tags=["users"])

UPLOAD_ROOT = os.path.join(os.getcwd(), "uploads")
AVATAR_DIR = os.path.join(UPLOAD_ROOT, "avatars")
PORTFOLIO_DIR = os.path.join(UPLOAD_ROOT, "portfolio")
ALLOWED_PORTFOLIO = {".pdf", ".png", ".jpg", ".jpeg"}
MAX_AVATAR_MB = 5
MAX_PORTFOLIO_MB = 10


def ensure_dir(path: str):
    os.makedirs(path, exist_ok=True)


def save_upload(file: UploadFile, target_dir: str, max_mb: int, allow_images_only: bool = False, allowed_exts: set[str] | None = None) -> str:
    ensure_dir(target_dir)
    ext = os.path.splitext(file.filename or "")[1].lower()
    if allow_images_only and (not file.content_type or not file.content_type.startswith("image/")):
        raise HTTPException(status_code=400, detail="Only image files are allowed")
    if allowed_exts is not None and ext not in allowed_exts:
        raise HTTPException(status_code=400, detail="Unsupported file type")

    file.file.seek(0, os.SEEK_END)
    size = file.file.tell()
    file.file.seek(0)
    if size > max_mb * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File is too large")

    name = f"{uuid.uuid4().hex}{ext}"
    path = os.path.join(target_dir, name)
    with open(path, "wb") as f:
        f.write(file.file.read())
    return name


@router.get("")
def list_users(
    _: models.User = Depends(require_role("admin")),
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    sort_by: str = Query("id"),
    sort_dir: str = Query("desc"),
    search: str | None = Query(None),
):
    allowed = {"id": models.User.id, "email": models.User.email, "full_name": models.User.full_name, "role": models.User.role}
    sort_col = allowed.get(sort_by, models.User.id)
    order = asc(sort_col) if sort_dir.lower() == "asc" else desc(sort_col)

    query = db.query(models.User)
    if search:
        like = f"%{search}%"
        query = query.filter(
            models.User.email.ilike(like) | models.User.full_name.ilike(like) | models.User.role.ilike(like)
        )

    total = query.count()
    items = query.order_by(order).offset((page - 1) * page_size).limit(page_size).all()
    return {"items": items, "total": total, "page": page, "pageSize": page_size}


@router.get("/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/{user_id}", response_model=schemas.UserOut)
def update_user(
    user_id: int,
    payload: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.email is not None:
        user.email = payload.email
    if payload.full_name is not None:
        user.full_name = payload.full_name

    db.commit()
    db.refresh(user)
    return user


@router.post("/{user_id}/avatar")
def upload_avatar(
    user_id: int,
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")

    filename = save_upload(file, AVATAR_DIR, MAX_AVATAR_MB, allow_images_only=True)
    url = f"/uploads/avatars/{filename}"
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        user.avatar_url = url
        db.commit()

    return {"userId": user_id, "url": url}

@router.delete("/{user_id}/avatar")
def delete_avatar(
    user_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.avatar_url:
        file_path = os.path.join(os.getcwd(), user.avatar_url.replace("/uploads/", "uploads/"))
        if os.path.exists(file_path):
            os.remove(file_path)
        user.avatar_url = None
        db.commit()

    return {"userId": user_id, "deleted": True}


@router.post("/{user_id}/portfolio")
def upload_portfolio(
    user_id: int,
    files: list[UploadFile] = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")

    urls: list[str] = []
    for file in files:
        filename = save_upload(file, PORTFOLIO_DIR, MAX_PORTFOLIO_MB, allowed_exts=ALLOWED_PORTFOLIO)
        urls.append(f"/uploads/portfolio/{filename}")

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        existing = user.portfolio_urls or []
        user.portfolio_urls = existing + urls
        db.commit()

    return {"userId": user_id, "urls": urls}

@router.delete("/{user_id}/portfolio")
def delete_portfolio_item(
    user_id: int,
    url: str = Query(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.id != user_id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.portfolio_urls = [item for item in (user.portfolio_urls or []) if item != url]
    db.commit()

    file_path = os.path.join(os.getcwd(), url.replace("/uploads/", "uploads/"))
    if os.path.exists(file_path):
        os.remove(file_path)

    return {"userId": user_id, "deleted": True}


@router.delete("/{user_id}")
def delete_user(user_id: int, _: models.User = Depends(require_role("admin")), db: Session = Depends(get_db)):
    try:
        # Сначала удаляем все проекты пользователя (если это клиент)
        db.query(models.Project).filter(models.Project.client_id == user_id).delete()
        
        # Затем удаляем самого пользователя
        deleted = db.query(models.User).filter(models.User.id == user_id).delete()
        db.commit()
        
        if not deleted:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {"deleted": True}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"Delete user error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to delete user: {str(e)}")


@router.post("/{user_id}/block")
def block_user(
    user_id: int,
    reason: str | None = None,
    _: models.User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    """Заблокувати користувача"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Неможна заблокувати адміна
    if user.role == "admin":
        raise HTTPException(status_code=400, detail="Cannot block admin users")
    
    user.is_blocked = "true"
    user.blocked_reason = reason
    db.commit()
    
    return {"user_id": user_id, "blocked": True, "reason": reason}


@router.post("/{user_id}/unblock")
def unblock_user(
    user_id: int,
    _: models.User = Depends(require_role("admin")),
    db: Session = Depends(get_db)
):
    """Розблокувати користувача"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_blocked = "false"
    user.blocked_reason = None
    db.commit()

    return {"user_id": user_id, "blocked": False}

