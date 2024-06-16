from .auth import router as auth_router
from .users import router as user_router
from .notice import router as notice_router
from .teacher import router as teacher_router
from .customer import router as customer_router
from .program import router as program_router
from .voucher import router as voucher_router
from .schedule import router as schedule_router
from .record import router as record_router
from .inquiry import router as inquiry_router
from .announcement import router as announcement_router

__all__ = [
    auth_router,
    user_router,
    notice_router,
    teacher_router,
    customer_router,
    program_router,
    voucher_router,
    schedule_router,
    record_router,
    inquiry_router,
    announcement_router,
]
