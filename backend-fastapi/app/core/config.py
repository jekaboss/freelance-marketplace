from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseModel):
    port: int = int(os.getenv("PORT", "4002"))
    database_url: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://postgres:postgres@localhost:5432/freelance_marketplace",
    )
    jwt_secret: str = os.getenv("JWT_SECRET", "change_me")
    jwt_expires_minutes: int = int(os.getenv("JWT_EXPIRES_MINUTES", "10080"))

settings = Settings()
