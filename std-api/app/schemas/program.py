from pydantic import BaseModel
from typing import Optional
from ..models.program import ProgramCategory, ProgramMethod, ProgramLocation, ProgramStatus

class ProgramCreate(BaseModel):
    category: ProgramCategory
    program_type: str
    program_name: str
    method: ProgramMethod
    location: ProgramLocation
    teacher_id: Optional[int] = None
    price: Optional[float] = None
    base_price: Optional[float] = None
    status: ProgramStatus

class ProgramUpdate(BaseModel):
    category: Optional[ProgramCategory] = None
    program_type: Optional[str] = None
    program_name: Optional[str] = None
    method: Optional[ProgramMethod] = None
    location: Optional[ProgramLocation] = None
    teacher_id: Optional[int] = None
    price: Optional[float] = None
    base_price: Optional[float] = None
    status: Optional[ProgramStatus] = None

class ProgramRead(BaseModel):
    id: int
    category: ProgramCategory
    program_type: str
    program_name: str
    method: ProgramMethod
    location: ProgramLocation
    teacher_id: Optional[int] = None
    price: Optional[float] = None
    base_price: Optional[float] = None
    status: ProgramStatus

    class Config:
        orm_mode = True
