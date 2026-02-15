from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import asc, desc
from app.db import get_db
from app import models, schemas
from app.auth import get_current_user

router = APIRouter(prefix="/projects", tags=["projects"])

def serialize_project(project):
    return {
        "id": project.id,
        "client_id": project.client_id,
        "title": project.title,
        "description": project.description,
        "budget": float(project.budget) if project.budget else None,
        "status": project.status,
        "link": project.link,
        "image_url": project.image_url,
        "created_at": project.created_at.isoformat() if project.created_at else None,
    }

@router.get("")
def list_projects(
    client_id: int | None = None,
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    sort_by: str = Query("created_at"),
    sort_dir: str = Query("desc"),
    search: str | None = Query(None),
):
    allowed = {
        "id": models.Project.id,
        "title": models.Project.title,
        "status": models.Project.status,
        "budget": models.Project.budget,
        "created_at": models.Project.created_at,
    }
    sort_col = allowed.get(sort_by, models.Project.created_at)
    order = asc(sort_col) if sort_dir.lower() == "asc" else desc(sort_col)

    query = db.query(models.Project)
    if client_id:
        query = query.filter(models.Project.client_id == client_id)
    if search:
        like = f"%{search}%"
        query = query.filter(models.Project.title.ilike(like) | models.Project.description.ilike(like))

    total = query.count()
    items = query.order_by(order).offset((page - 1) * page_size).limit(page_size).all()
    return {"items": [serialize_project(p) for p in items], "total": total, "page": page, "pageSize": page_size}

@router.get("/{project_id}", response_model=schemas.ProjectOut)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.post("", response_model=schemas.ProjectOut)
def create_project(payload: schemas.ProjectIn, _: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    project = models.Project(
        client_id=payload.client_id,
        title=payload.title,
        description=payload.description,
        budget=payload.budget,
        status="open",
        link=payload.link,
        image_url=payload.image_url,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return serialize_project(project)

@router.patch("/{project_id}", response_model=schemas.ProjectOut)
def update_project(project_id: int, payload: schemas.ProjectUpdate, _: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(project, field, value)
    db.commit()
    db.refresh(project)
    return serialize_project(project)

@router.delete("/{project_id}")
def delete_project(project_id: int, _: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    deleted = db.query(models.Project).filter(models.Project.id == project_id).delete()
    db.commit()
    if not deleted:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"deleted": True}
