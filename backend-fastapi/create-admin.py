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
ADMIN_EMAIL = "admin"
ADMIN_PASSWORD = "0611"

# Check if admin exists
admin = session.query(User).filter(User.email == ADMIN_EMAIL).first()
password_hash = bcrypt.hashpw(ADMIN_PASSWORD.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

if admin:
    admin.password_hash = password_hash
    admin.role = "admin"
    session.commit()
    print("Admin user already exists. Credentials were updated.")
    print(f"Email: {ADMIN_EMAIL}")
    print(f"Password: {ADMIN_PASSWORD}")
else:
    # Create admin user
    admin = User(
        email=ADMIN_EMAIL,
        full_name="Admin User",
        password_hash=password_hash,
        role="admin",
        avatar_url=None,
        portfolio_urls=[]
    )
    session.add(admin)
    session.commit()
    print("Admin user created successfully!")
    print(f"Email: {ADMIN_EMAIL}")
    print(f"Password: {ADMIN_PASSWORD}")

session.close()
