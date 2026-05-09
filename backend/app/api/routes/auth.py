from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core import security
from app.core.database import get_db
from app.models.user import UserCreate, UserResponse, DBUser
from app.api import deps

router = APIRouter()

@router.post("/register", response_model=dict)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(DBUser).filter(DBUser.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    
    hashed_password = security.get_password_hash(user_in.password)
    new_user = DBUser(
        name=user_in.name,
        email=user_in.email,
        password_hash=hashed_password,
        role=user_in.role,
        last_login=datetime.utcnow()
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token = security.create_access_token(new_user.id)
    
    return {
        "token": access_token,
        "user": UserResponse.model_validate(new_user).model_dump()
    }

@router.post("/login", response_model=dict)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # form_data.username can be either an email or the actual username (name)
    user = db.query(DBUser).filter(
        (DBUser.email == form_data.username) | (DBUser.name == form_data.username)
    ).first()
    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=400, detail="Incorrect username/email or password"
        )
    
    user.last_login = datetime.utcnow()
    db.commit()
    
    access_token = security.create_access_token(user.id)
    
    return {
        "token": access_token,
        "user": UserResponse.model_validate(user).model_dump()
    }
