from ..models.notice import Notice
from ..schemas.notice import NoticeCreate, NoticeUpdate
from sqlmodel import Session

def create_notice(db: Session, notice: NoticeCreate):
    db_notice = Notice(**notice.dict())
    print(db_notice)
    db.add(db_notice)
    db.commit()
    db.refresh(db_notice)

    return db_notice

def get_notices(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Notice).offset(skip).limit(limit).all()

def get_notice(db: Session, notice_id: int):
    return db.query(Notice).filter(Notice.id == notice_id).first()

def update_notice(db: Session, notice_id: int, notice: NoticeUpdate):
    db_notice = db.get(Notice, notice_id)
    if not db_notice:
        raise HTTPExcopton(status_code=404, detail="Notice not found")
    notice_data = notice.model_dump(exclude_unset=True)
    db_notice.sqlmodel_update(notice_data)
    db.add(db_notice)
    db.commit()
    db.refresh(db_notice)

    return db_notice

def delete_notice(db: Session, notice_id: int):
    db_notice = db.get(Notice, notice_id)
    if not db_notice:
        raise HTTPExcopton(status_code=404, detail="Notice not found")
    db.delete(db_notice)
    db.commit()
