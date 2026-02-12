import uvicorn

from .api import (
    announcement_router,
    auth_router,
    center_router,
    client_router,
    customer_router,
    inquiry_router,
    password_router,
    program_router,
    record_router,
    schedule_router,
    signup_router,
    teacher_router,
    users_router,
    voucher_router,
)
from .core import app

app.include_router(auth_router)
app.include_router(signup_router)
app.include_router(password_router)
app.include_router(customer_router)
app.include_router(teacher_router)
app.include_router(program_router)
app.include_router(voucher_router)
app.include_router(schedule_router)
app.include_router(record_router)
app.include_router(inquiry_router)
app.include_router(announcement_router)
app.include_router(center_router)
app.include_router(users_router)
app.include_router(client_router)


@app.get("/")
def hello():
    return {"msg": "Hello World"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
