from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "OCT AI Diagnosis"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "your-256-bit-secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    DATABASE_URL: str = "sqlite:///./oct_database.db"
    ADMIN_USERNAME: str = "admin321"
    ADMIN_PASSWORD: str = "admin@321"
    MODEL_PATH: str = "./ml/model/oct_model.pt"
    MAX_IMAGE_SIZE_MB: int = 10
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "https://your-app.vercel.app", "http://localhost:5173"]

    class Config:
        env_file = ".env"

settings = Settings()
