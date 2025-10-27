from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi_pagination import Page, add_pagination
from passlib.context import CryptContext
from sqlmodel import Session, desc, select

from ..core import get_session, oauth2_scheme
from ..crud.user import get_teachers, get_users, get_user_selected_teachers, create_user_selected_teachers, update_user_selected_teachers, delete_user_selected_teachers
from ..models.user import User
from ..schemas import ErrorResponse, SuccessResponse
from ..schemas.user import UserCreate  # center director; center info
from ..schemas.user import UserRead, UserUpdate
from ..schemas.user import (
    UserSearchSelectedTeacherCreate,
    UserSearchSelectedTeacherRead,
    UserSearchSelectedTeacherUpdate
)
from .auth import get_current_user

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter(
    prefix="/users",
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


@router.get("/teachers")
def read_teachers(
    *,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    print("current_user:", current_user)
    return SuccessResponse(data=get_teachers(session, current_user))

@router.get("/selected-teachers", response_model=UserSearchSelectedTeacherRead)
def read_user_selected_teachers(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """사용자가 선택한 상담사 목록 조회"""
    selected = get_user_selected_teachers(session, current_user.username)
    if not selected:
        return UserSearchSelectedTeacherRead(username=current_user.username, selected_teacher="")
    return selected

@router.post("/selected-teachers", response_model=UserSearchSelectedTeacherRead)
def create_user_selected_teachers_endpoint(
    data: UserSearchSelectedTeacherCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """사용자가 선택한 상담사 목록 생성 또는 갱신"""
    data.username = current_user.username
    existing = get_user_selected_teachers(session, current_user.username)
    if existing:
        # 기존 데이터가 있으면 갱신
        update_data = UserSearchSelectedTeacherUpdate(selected_teacher=data.selected_teacher)
        return update_user_selected_teachers(session, current_user.username, update_data)
    # 신규 생성
    return create_user_selected_teachers(session, data)

@router.put("/selected-teachers", response_model=UserSearchSelectedTeacherRead)
def update_user_selected_teachers_endpoint(
    data: UserSearchSelectedTeacherUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """사용자가 선택한 상담사 목록 업데이트"""
    updated = update_user_selected_teachers(session, current_user.username, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Selected teachers not found")
    return updated

@router.delete("/selected-teachers")
def delete_user_selected_teachers_endpoint(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """사용자가 선택한 상담사 목록 삭제"""
    if not delete_user_selected_teachers(session, current_user.username):
        raise HTTPException(status_code=404, detail="Selected teachers not found")
    return {"ok": True}


@router.get("/username/{username}", response_model=SuccessResponse[UserRead])
def read_user_by_username(
    username: str,
    *,
    session: Session = Depends(get_session),
):
    user = session.exec(select(User).where(User.username == username)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return SuccessResponse(data=user)


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
    current_user: User = Depends(get_current_user),
    page: int = 1,
    size: int = Query(default=10, lte=10),
    search_qry: str = Query(default="", max_length=50),
):
    return get_users(
        session, page=page, size=size, search_qry=search_qry, login_user=current_user
    )


@router.post("/", response_model=UserRead)
def create_user(
    user: UserCreate,
    *,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    db_user = User.from_orm(user)
    db_user.password = pwd_context.hash(db_user.password)
    if db_user.center_username == "":
        db_user.center_username = current_user.center_username
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
    print("user", user)
    
    user_data = user.model_dump(exclude_unset=True)
    
    # password가 빈값이거나 None이면 update에서 제외
    if user.password and user.password.strip():
        user_data["password"] = pwd_context.hash(user.password)
    else:
        user_data.pop("password", None)
        
    for key, value in user_data.items():
        setattr(db_user, key, value)
        
    print("db_user", db_user)
    
    # db_user.password가 빈값이면 password 필드 제외
    if not db_user.password:
        user_data.pop("password", None)
        
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

