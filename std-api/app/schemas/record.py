from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RecordCreate(BaseModel):
    schedule_id: int
    consultation_content: Optional[str] = None
    record_content: Optional[str] = None
    special_notes: Optional[str] = None

class RecordUpdate(BaseModel):
    schedule_id: Optional[int] = None
    consultation_content: Optional[str] = None
    record_content: Optional[str] = None
    special_notes: Optional[str] = None

class RecordRead(BaseModel):
    id: int
    schedule_id: int
    consultation_content: Optional[str]
    record_content: Optional[str]
    special_notes: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True
