from fastapi import APIRouter
from pydantic import BaseModel, EmailStr

from ..schemas import SuccessResponse


class ForgotPasswordPayload(BaseModel):
    email: EmailStr | None = None


router = APIRouter(
    prefix="/api",
    tags=["auth"],
    responses={404: {"description": "API Not found"}},
)


@router.post("/forget-password", response_model=SuccessResponse)
def forget_password(payload: ForgotPasswordPayload | None = None):
    return SuccessResponse(
        data={"requested": True, "email": payload.email if payload else None},
        msg="password reset request accepted",
    )
