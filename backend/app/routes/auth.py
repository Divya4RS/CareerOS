from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import User
from app.utils.jwt_handler import create_token

router = APIRouter()


class UserSignup(BaseModel):
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


@router.post("/signup")
def signup(user: UserSignup):

    db: Session = SessionLocal()

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        return {
            "message": "Email already exists"
        }

    new_user = User(
        email=user.email,
        password=user.password
    )

    db.add(new_user)
    db.commit()

    return {
        "message": "User created successfully"
    }


@router.post("/login")
def login(user: UserLogin):

    db: Session = SessionLocal()

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not existing_user:
        return {
            "message": "User not found"
        }

    if existing_user.password != user.password:
        return {
            "message": "Wrong password"
        }

    token = create_token(
        existing_user.email
    )

    return {
        "message": "Login successful",
        "email": existing_user.email,
        "token": token
    }