from typing import Optional

from sqlmodel import Field, SQLModel
from pydantic import BaseModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str = None


class UserBase(SQLModel):
    username: str = Field(index=True, unique=True)
    password: str = Field(index=False)
    email: str = Field(default=None, index=True)
    full_name: str
    is_active: Optional[bool] = Field(default=True)
    is_superuser: Optional[bool] = Field(default=False)


class UserCreate(UserBase):
    pass


class UserUpdate(SQLModel):
    username: Optional[str] = None
    password: Optional[str] = None
    email: Optional[str] = None
    full_name: Optional[int] = None
    is_active: bool = Field(default=True)
    is_superuser: bool = Field(default=False)
