from typing import Any, Optional, Generic, TypeVar
from pydantic import BaseModel

T = TypeVar('T')

# pydantic http response success, fail
class SuccessResponse(BaseModel, Generic[T]):
    data: Any = Optional[T] | None
    status: str = "ok"
    msg: str = "success"
    code: int = 20000

class ErrorResponse(BaseModel, Generic[T]):
    data: Any = Optional[T] | None
    status: str = "fail"
    msg: str = "fail"
    code: int = 50000

