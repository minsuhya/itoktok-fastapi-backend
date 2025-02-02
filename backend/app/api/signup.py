from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from passlib.context import CryptContext
from sqlmodel import Session

from ..core import get_session
from ..crud import user as crud
from ..models.user import User
from ..schemas import ErrorResponse, SuccessResponse
from ..schemas.user import UserCreate, UserRead

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(
    prefix="/signup",
    tags=["auth"],
    dependencies=[Depends(get_session)],
    responses={404: {"description": "API Not found"}},
)


@router.post("", response_model=SuccessResponse)
def create_user(user: UserCreate, *, session: Session = Depends(get_session)):
    user_data = User.model_validate(user)
    return SuccessResponse(data=crud.create_user(session, user_data))


@router.get("/check-username")
def check_username(username: str, db: Session = Depends(get_session)):
    user = db.query(User).filter(User.username == username).first()
    if user:
        return SuccessResponse(data={"exists": True})
    return SuccessResponse(data={"exists": False})
