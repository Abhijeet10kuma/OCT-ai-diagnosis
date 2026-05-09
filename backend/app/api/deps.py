from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session
from app.core import security
from app.core.config import settings
from app.models.user import TokenPayload, UserResponse, DBUser
from app.core.database import get_db

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

def get_current_user(
    db: Session = Depends(get_db)
) -> UserResponse:
    # Bypass auth for testing: always return the first user (admin) or a dummy user
    user = db.query(DBUser).first()
    if not user:
        # Create a dummy user if DB is completely empty
        user = DBUser(id="test_id", name="Test Doctor", email="test@hospital.com", role="doctor")
        db.add(user)
        db.commit()
    return UserResponse.model_validate(user)
