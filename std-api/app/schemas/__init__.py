from typing import Any
from pydantic import BaseModel

# pydantic http response success, fail
class SuccessResponse(BaseModel):
    data: Any = None
    status: str = "ok"
    msg: str = "success"
    code: int = 20000

class ErrorResponse(BaseModel):
    data: Any = None
    status: str = "fail"
    msg: str = "fail"
    code: int = 50000

