import sys
sys.path.insert(0, '/app')

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import bcrypt

# Get database URL from environment
import os
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:postgres@postgres:5432/freelancemarketplacedb")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
from app.models import User, Base
Base.metadata.create_all(bind=engine)

session = SessionLocal()

# Check if admin exists
admin = session.query(User).filter(User.email == "admin").first()

if admin:
    print("Admin user already exists!")
else:
    # Hash password using bcrypt
    password_hash = bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # Create admin user
    admin = User(
        email="admin",
        full_name="Admin User",
        password_hash=password_hash,
        role="admin",
        avatar_url=None,
        portfolio_urls=[]
    )
    session.add(admin)
    session.commit()
    print("Admin user created successfully!")
    print("Email: admin")
    print("Password: admin123")

session.close()
