from enum import Enum
from typing import Optional

from sqlmodel import Field, SQLModel
from sqlalchemy.sql import func
from sqlalchemy import Column, DateTime
from datetime import datetime

class NoticeType(str, Enum):
    CENTER = 'center'
    CUSTOM = 'custom'

class Notice(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    notice_type: str = Field(default=NoticeType.CENTER)
    title: str
    content: str
    created_by: Optional[str] = Field(default=None)  # 생성자
    updated_by: Optional[str] = Field(default=None)  # 수정자
    created_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )

    updated_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), onupdate=func.now())
    )
    deleted_at: Optional[datetime] = Field(default=None)
    # created_at: Optional[datetime] = Field(default=datetime.now)
    # updated_at: Optional[datetime] = Field(default=datetime.now)
    # deleted_at: Optional[datetime] = Field(default=None)

# # 게시판 모델
# class BoardInfoBase(SQLModel):
#     board_name: str = Field(index=True)  # 게시판 이름
#     board_description: str = Field(default=None)  # 게시판 설명
#     board_type: str = Field(
#         default=None
#     )  # 게시판 타입 (공지사항, 센터게시판, 고객게시판, 자료실, ...)
#     board_order: int = Field(default=0)  # 게시판 순서
#     is_active: bool = Field(default=True)  # 활성화 여부
#     is_private: bool = Field(default=False)  # 비공개 여부
#     is_comment: bool = Field(default=True)  # 댓글 여부
#     is_notice: bool = Field(default=False)  # 공지사항 여부
#     is_secret: bool = Field(default=False)  # 비밀글 여부
#     is_file: bool = Field(default=False)  # 파일 업로드 여부
#     is_anonymous: bool = Field(default=False)  # 익명 여부
#     created_by: str = Field(default=None)  # 생성자
#     updated_by: str = Field(default=None)  # 수정자
#     created_at: str = Field(default=None)  # 생성일
#     updated_at: str = Field(default=None)  # 수정일
#     deleted_at: str = Field(default=None)  # 삭제일
#
#
# class BoardInfoCreate(BoardInfoBase):
#     pass
#
#
# class BoardInfoUpdate(SQLModel):
#     board_name: Optional[str] = Field(index=True)  # 게시판 이름
#     board_description: Optional[str] = Field(default=None)  # 게시판 설명
#     board_type: Optional[str] = Field(
#         default=None
#     )  # 게시판 타입 (공지사항, 센터게시판, 고객게시판, 자료실, ...)
#     board_order: Optional[int] = Field(default=0)  # 게시판 순서
#     is_active: Optional[bool] = Field(default=True)  # 활성화 여부
#     is_private: Optional[bool] = Field(default=False)  # 비공개 여부
#     is_comment: Optional[bool] = Field(default=True)  # 댓글 여부
#     is_notice: Optional[bool] = Field(default=False)  # 공지사항 여부
#     is_secret: Optional[bool] = Field(default=False)  # 비밀글 여부
#     is_file: Optional[bool] = Field(default=False)  # 파일 업로드 여부
#     is_anonymous: Optional[bool] = Field(default=False)  # 익명 여부
#     created_by: Optional[str] = Field(default=None)  # 생성자
#     updated_by: Optional[str] = Field(default=None)  # 수정자
#     created_at: Optional[str] = Field(default=None)  # 생성일
#     updated_at: Optional[str] = Field(default=None)  # 수정일
#     deleted_at: Optional[str] = Field(default=None)  # 삭제일
#
#
# # 게시판 데이터 모델
# class BoardBase(SQLModel):
#     board_id: Optional[int] = Field(default=None)  # 게시판 ID
#     username: Optional[int] = Field(default=None)  # 사용자 ID
#     title: str = Field(index=True)  # 제목
#     content: str = Field(default=None)  # 내용
#     file: str = Field(default=None)  # 파일
#     is_secret: bool = Field(default=False)  # 비밀글 여부
#     is_notice: bool = Field(default=False)  # 공지글 여부
#     status: str = Field(default=None)  # 상태
#     created_at: str = Field(default=None)  # 생성일
#     updated_at: str = Field(default=None)  # 수정일
#     deleted_at: str = Field(default=None)  # 삭제일
#
#
# class BoardCreate(BoardBase):
#     pass
#
#
# class BoardUpdate(SQLModel):
#     board_id: Optional[int] = None  # 게시판 ID
#     username: Optional[int] = None  # 사용자 ID
#     title: Optional[str] = None  # 제목
#     content: Optional[str] = None  # 내용
#     file: Optional[str] = None  # 파일
#     is_secret: Optional[bool] = None  # 비밀글 여부
#     is_notice: Optional[bool] = None  # 공지글 여부
#     status: Optional[str] = None  # 상태
#     created_at: Optional[str] = None  # 생성일
#     updated_at: Optional[str] = None  # 수정일
#     deleted_at: Optional[str] = None  # 삭제일
