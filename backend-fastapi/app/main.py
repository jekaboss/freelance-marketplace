from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from datetime import datetime
import os
from app.core.config import settings
from app.db import Base, engine
from app.routers import auth, users, freelancers, projects

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Store server start time
SERVER_START_TIME = datetime.utcnow()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(freelancers.router, prefix="/api")
app.include_router(projects.router, prefix="/api")

@app.get("/api/health")
def health_check():
    """Return server health and uptime information"""
    return {
        "status": "ok",
        "server_start_time": SERVER_START_TIME.isoformat()
    }

