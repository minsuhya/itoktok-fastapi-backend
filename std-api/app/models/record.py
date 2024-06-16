from sqlmodel import SQLModel, Field
from typing import Optional
from sqlalchemy.sql import func
from sqlalchemy import Column, DateTime
from datetime import datetime

class Record(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    schedule_id: int
    consultation_content: Optional[str] = None
    record_content: Optional[str] = None
    special_notes: Optional[str] = None
    created_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), server_default=func.now())
    )

    updated_at: Optional[datetime] = Field(
        sa_column=Column(DateTime(timezone=True), onupdate=func.now())
    )
    deleted_at: Optional[datetime] = Field(default=None)
