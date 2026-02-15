from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

class Token(BaseModel):
    access_token: str
    token_type: str = "Bearer"

class RegisterIn(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2)
    password: str = Field(min_length=6)
    role: str

class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: str
    avatar_url: Optional[str] = None
    portfolio_urls: List[str] = []

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(default=None, min_length=2)

class FreelancerIn(BaseModel):
    user_id: int
    title: str = Field(min_length=3)
    bio: Optional[str] = Field(default=None, min_length=10)
    skills: Optional[List[str]] = None
    hourly_rate: Optional[float] = Field(default=None, ge=0)
    location: Optional[str] = None

class FreelancerOut(BaseModel):
    id: int
    user_id: int
    title: str
    bio: Optional[str] = None
    skills: Optional[List[str]] = None
    hourly_rate: Optional[float] = None
    location: Optional[str] = None

    class Config:
        from_attributes = True

class ProjectIn(BaseModel):
    client_id: int
    title: str = Field(min_length=3)
    description: str = Field(min_length=10)
    budget: Optional[float] = Field(default=None, ge=0)
    link: Optional[str] = None
    image_url: Optional[str] = None

class ProjectUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=3)
    description: Optional[str] = Field(default=None, min_length=10)
    budget: Optional[float] = Field(default=None, ge=0)
    status: Optional[str] = None
    link: Optional[str] = None
    image_url: Optional[str] = None

class ProjectOut(BaseModel):
    id: int
    client_id: int
    title: str
    description: str
    budget: Optional[float] = None
    status: str
    link: Optional[str] = None
    image_url: Optional[str] = None
    created_at: Optional[str] = None

    class Config:
        from_attributes = True
