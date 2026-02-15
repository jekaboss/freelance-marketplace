from sqlalchemy import Column, Integer, String, Text, Numeric, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import ARRAY
from app.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="client", nullable=False)
    avatar_url = Column(String, nullable=True)
    portfolio_urls = Column(ARRAY(String), nullable=False, server_default="{}")
    is_blocked = Column(String, default="false", nullable=False)  # "true" or "false"
    blocked_reason = Column(String, nullable=True)  # причина блокування

    freelancers = relationship("Freelancer", back_populates="user")
    projects = relationship("Project", back_populates="client")

class Freelancer(Base):
    __tablename__ = "freelancers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    bio = Column(Text, nullable=True)
    skills = Column(ARRAY(String), nullable=True)
    hourly_rate = Column(Numeric, nullable=True)
    location = Column(String, nullable=True)

    user = relationship("User", back_populates="freelancers")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    budget = Column(Numeric, nullable=True)
    status = Column(String, default="open", nullable=False)
    link = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    client = relationship("User", back_populates="projects")
