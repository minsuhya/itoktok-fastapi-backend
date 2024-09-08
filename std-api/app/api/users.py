from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi_pagination import Page, add_pagination
from passlib.context import CryptContext
from sqlmodel import Session, desc, select

from ..core import get_session, oauth2_scheme
from ..crud.user import get_users
from ..models.user import User
from ..schemas import ErrorResponse, SuccessResponse
from ..schemas.user import UserCreate  # center director; center info
from ..schemas.user import UserRead, UserUpdate
from .auth import get_current_user

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(
    prefix="/users",
    tags=["users"],
    dependencies=[Depends(get_session), Depends(oauth2_scheme)],
    # dependencies=[Depends(get_session)],
    responses={404: {"description": "API Not found"}},
)


@router.get("/last", response_model=UserRead)
def get_last_user(*, session: Session = Depends(get_session)):
    user = session.exec(select(User).order_by(desc(User.id))).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/me")
def read_me(
    *,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    return SuccessResponse(data=current_user)


@router.get("/{user_id}", response_model=SuccessResponse[UserRead])
def read_user(
    user_id: int,
    *,
    session: Session = Depends(get_session),
):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return SuccessResponse(data=user)


@router.get("/", response_model=Page[UserRead])
def read_Users(
    *,
    session: Session = Depends(get_session),
    page: int = 1,
    size: int = Query(default=10, lte=10),
    search_qry: str = Query(default="", max_length=50),
):
    return get_users(session, page=page, size=size, search_qry=search_qry)


@router.post("/", response_model=UserRead)
def create_user(user: UserCreate, *, session: Session = Depends(get_session)):
    db_user = User.from_orm(user)
    db_user.password = pwd_context.hash(db_user.password)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


@router.put("/{user_id}", response_model=UserRead)
def update_user(
    user_id: int, *, session: Session = Depends(get_session), user: UserUpdate
):
    db_user = session.get(User, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.password:
        user.password = pwd_context.hash(user.password)
    user_data = user.dict(exclude_unset=True)
    for key, value in user_data.items():
        setattr(db_user, key, value)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


@router.delete("/{user_id}")
def delete_user(user_id: int, *, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    session.delete(user)
    session.commit()
    return {"ok": True}
