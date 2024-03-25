from typing import List

from ..core import get_session
from fastapi import APIRouter, Depends, HTTPException, Query
from ..models import Hero, HeroCreate, HeroRead, HeroReadWithTeam, HeroUpdate
from sqlmodel import Session, desc, select

router = APIRouter(
    prefix="/pgdb",
    tags=["heroes"],
    dependencies=[Depends(get_session)],
    responses={404: {
        "description": "API Not found"
    }},
)


@router.get("/heroes/last", response_model=HeroRead)
def get_last_hero(*, session: Session = Depends(get_session)):
    hero = session.exec(select(Hero).order_by(desc(Hero.id))).first()
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    return hero


@router.get("/heroes/{hero_id}", response_model=HeroReadWithTeam)
def read_hero(*, session: Session = Depends(get_session), hero_id: int):
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    return hero


@router.get("/heroes/", response_model=List[HeroRead])
def read_heroes(*,
                session: Session = Depends(get_session),
                offset: int = 0,
                limit: int = Query(default=100, lte=100)):
    heroes = session.exec(select(Hero).offset(offset).limit(limit)).all()
    return heroes


@router.post("/heroes/", response_model=HeroRead)
def create_hero(*, session: Session = Depends(get_session), hero: HeroCreate):
    db_hero = Hero.from_orm(hero)
    session.add(db_hero)
    session.commit()
    session.refresh(db_hero)
    return db_hero


@router.patch("/heroes/{hero_id}", response_model=HeroRead)
def update_hero(hero_id: int,
                *,
                session: Session = Depends(get_session),
                hero: HeroUpdate):
    db_hero = session.get(Hero, hero_id)
    if not db_hero:
        raise HTTPException(status_code=404, detail="Hero not found")

    hero_data = hero.dict(exclude_unset=True)
    for key, value in hero_data.items():
        setattr(db_hero, key, value)
    session.add(db_hero)
    session.commit()
    session.refresh(db_hero)
    return db_hero


@router.delete("/heroes/{hero_id}")
def delete_hero(hero_id: int, *, session: Session = Depends(get_session)):
    hero = session.get(Hero, hero_id)
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")

    session.delete(hero)
    session.commit()
    return {"ok": True}


@router.get("/hero/{id}", response_model=Hero)
def get_hero(id: int, *, session: Session = Depends(get_session)):
    hero = session.exec(select(Hero).where(Hero.id == id)).first()
    if not hero:
        raise HTTPException(status_code=404, detail="Hero not found")
    return hero
