from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import asc, desc
from app.db import get_db
from app import models, schemas
from app.auth import get_current_user

router = APIRouter(prefix="/freelancers", tags=["freelancers"])

@router.get("")
def list_freelancers(
    user_id: int | None = None,
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    sort_by: str = Query("id"),
    sort_dir: str = Query("desc"),
    search: str | None = Query(None),
):
    allowed = {
        "id": models.Freelancer.id,
        "title": models.Freelancer.title,
        "hourly_rate": models.Freelancer.hourly_rate,
        "location": models.Freelancer.location,
    }
    sort_col = allowed.get(sort_by, models.Freelancer.id)
    order = asc(sort_col) if sort_dir.lower() == "asc" else desc(sort_col)

    query = db.query(models.Freelancer)
    if user_id:
        query = query.filter(models.Freelancer.user_id == user_id)
    if search:
        like = f"%{search}%"
        query = query.filter(
            models.Freelancer.title.ilike(like) | models.Freelancer.bio.ilike(like) | models.Freelancer.location.ilike(like)
        )

    total = query.count()
    items = query.order_by(order).offset((page - 1) * page_size).limit(page_size).all()
    return {"items": items, "total": total, "page": page, "pageSize": page_size}

@router.get("/{freelancer_id}", response_model=schemas.FreelancerOut)
def get_freelancer(freelancer_id: int, db: Session = Depends(get_db)):
    freelancer = db.query(models.Freelancer).filter(models.Freelancer.id == freelancer_id).first()
    if not freelancer:
        raise HTTPException(status_code=404, detail="Freelancer not found")
    return freelancer

@router.post("", response_model=schemas.FreelancerOut)
def create_freelancer(payload: schemas.FreelancerIn, _: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    freelancer = models.Freelancer(
        user_id=payload.user_id,
        title=payload.title,
        bio=payload.bio,
        skills=payload.skills,
        hourly_rate=payload.hourly_rate,
        location=payload.location,
    )
    db.add(freelancer)
    db.commit()
    db.refresh(freelancer)
    return freelancer

@router.patch("/{freelancer_id}", response_model=schemas.FreelancerOut)
def update_freelancer(freelancer_id: int, payload: schemas.FreelancerIn, _: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    freelancer = db.query(models.Freelancer).filter(models.Freelancer.id == freelancer_id).first()
    if not freelancer:
        raise HTTPException(status_code=404, detail="Freelancer not found")

    freelancer.title = payload.title
    freelancer.bio = payload.bio
    freelancer.skills = payload.skills
    freelancer.hourly_rate = payload.hourly_rate
    freelancer.location = payload.location
    db.commit()
    db.refresh(freelancer)
    return freelancer

@router.delete("/{freelancer_id}")
def delete_freelancer(freelancer_id: int, _: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    deleted = db.query(models.Freelancer).filter(models.Freelancer.id == freelancer_id).delete()
    db.commit()
    if not deleted:
        raise HTTPException(status_code=404, detail="Freelancer not found")
    return {"deleted": True}
