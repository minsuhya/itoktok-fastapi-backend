# from typing import List
#
# from ..core import get_session, oauth2_scheme
# from fastapi import APIRouter, Depends, HTTPException, Query
# from ..models import User, UserCreate, UserUpdate, UserRead
# from sqlmodel import Session, desc, select
# from passlib.context import CryptContext
#
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
#
# router = APIRouter(
#     prefix="/users",
#     tags=["users"],
#     # dependencies=[Depends(get_session), Depends(oauth2_scheme)],
#     dependencies=[Depends(get_session)],
#     responses={404: {"description": "API Not found"}},
# )
#
#
# @router.get("/last", response_model=UserRead)
# def get_last_user(*, session: Session = Depends(get_session)):
#     user = session.exec(select(User).order_by(desc(User.id))).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     return user
#
#
# @router.get("/{user_id}", response_model=UserRead)
# def read_user(user_id: int, *, session: Session = Depends(get_session)):
#     user = session.get(User, user_id)
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     return user
#
#
# @router.get("/", response_model=List[UserRead])
# def read_Users(
#     *,
#     session: Session = Depends(get_session),
#     offset: int = 0,
#     limit: int = Query(default=100, lte=100),
# ):
#     users = session.exec(select(User).offset(offset).limit(limit)).all()
#     return users
#
#
# @router.post("/", response_model=UserRead)
# def create_user(user: UserCreate, *, session: Session = Depends(get_session)):
#     db_user = User.from_orm(user)
#     db_user.password = pwd_context.hash(db_user.password)
#     session.add(db_user)
#     session.commit()
#     session.refresh(db_user)
#     return db_user
#
#
# @router.patch("/{user_id}", response_model=UserRead)
# def update_user(
#     user_id: int, *, session: Session = Depends(get_session), user: UserUpdate
# ):
#     db_user = session.get(User, user_id)
#     if not db_user:
#         raise HTTPException(status_code=404, detail="User not found")
#
#     user_data = user.dict(exclude_unset=True)
#     for key, value in user_data.items():
#         setattr(db_user, key, value)
#     session.add(db_user)
#     session.commit()
#     session.refresh(db_user)
#     return db_user
#
#
# @router.delete("/{user_id}")
# def delete_user(user_id: int, *, session: Session = Depends(get_session)):
#     user = session.get(User, user_id)
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#
#     session.delete(user)
#     session.commit()
#     return {"ok": True}
