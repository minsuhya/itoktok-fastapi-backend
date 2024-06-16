from typing import Optional

from sqlmodel import Field, SQLModel
from sqlalchemy.sql import func
from sqlalchemy import Column, DateTime
from datetime import datetime

class Teacher(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str # 이름
    birthdate: Optionnal[str] = None # 생년월일
    login_account: str # 로그인아이디
    login_password: str # 로그인비밀번호
    position: str # 직급(호칭)
    personal_history: Optional[str] = Nonea # 사번
    mobile_number: str # 휴대폰번호
    office_number: Optional[str] = None # 업무용전화번호
    email: Optional[str] = None # 이메일
    address: Optional[str] = None # 주소
    role: str # 역할(재활사, 관리자)
    created_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )

    updated_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), onupdate=func.now())
    )
    deleted_at: Optional[datetime] = Field(default=None)
