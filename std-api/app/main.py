import uvicorn

from .api import (auth_router, customer_router, 
    teacher_router, program_router, voucher_router, 
    schedule_router, record_router, inquiry_router, 
    announcement_router, center_router)
from .core import app

app.include_router(auth_router)
app.include_router(customer_router)
app.include_router(teacher_router)
app.include_router(program_router)
app.include_router(voucher_router)
app.include_router(schedule_router)
app.include_router(record_router)
app.include_router(inquiry_router)
app.include_router(announcement_router)
app.include_router(center_router)


@app.get("/")
def hello():
    return {"msg": "Hello World"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
