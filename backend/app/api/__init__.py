from .announcement import router as announcement_router
from .auth import router as auth_router
from .center import router as center_router
from .client import router as client_router
from .customer import router as customer_router
from .inquiry import router as inquiry_router
from .password import router as password_router
from .program import router as program_router
from .record import router as record_router
from .schedule import router as schedule_router
from .signup import router as signup_router
from .teacher import router as teacher_router
from .users import router as users_router
from .voucher import router as voucher_router

__all__ = [
    auth_router,
    users_router,
    signup_router,
    teacher_router,
    customer_router,
    password_router,
    program_router,
    voucher_router,
    schedule_router,
    record_router,
    inquiry_router,
    announcement_router,
    center_router,
    client_router,
]
