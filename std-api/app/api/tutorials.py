from ..core import get_session
from fastapi import APIRouter, Depends, HTTPException
from loguru import logger
from ..models import Hero, Team
from sqlmodel import Session, select

router = APIRouter(
    prefix="/pgdb",
    tags=["tutorials"],
    dependencies=[Depends(get_session)],
    responses={404: {
        "description": "API Not found"
    }},
)


@router.get("/tutorial/0")
def tutorial_0(*, session: Session = Depends(get_session)):
    """remove all tutorials"""
    statement = select(Hero).where(Hero.name.match("%Tutorial%"))
    result = session.exec(statement)
    heroes = result.all()
    logger.info(f"\nTutorial Heroes ==> IDs={[r.id for r in heroes]}")

    for hero in heroes:
        session.delete(hero)
    session.commit()

    statement = select(Team).where(Team.name.match("%Tutorial%"))
    result = session.exec(statement)
    teams = result.all()
    logger.info(f"\nTutorial Teams ==> IDs={[r.id for r in teams]}")

    for team in teams:
        session.delete(team)
    session.commit()

    return {"heroes": [h.id for h in heroes], "teams": [t.id for t in teams]}


@router.get("/tutorial/1")
def tutorial_1(*, session: Session = Depends(get_session)):
    """create heroes and teams"""
    team_preventers = Team(name="Tutorial Preventers",
                           headquarters="Sharp Tower")
    team_z_force = Team(name="Tutorial Z-Force",
                        headquarters="Sister Margaret’s Bar")
    session.add(team_preventers)
    session.add(team_z_force)
    session.commit()

    hero_deadpond = Hero(name="Tutorial Deadpond",
                         secret_name="Dive Wilson",
                         team_id=team_z_force.id)
    hero_rusty_man = Hero(
        name="Tutorial Rusty-Man",
        secret_name="Tommy Sharp",
        age=48,
        team_id=team_preventers.id,
    )
    hero_spider_boy = Hero(name="Tutorial Spider-Boy",
                           secret_name="Pedro Parqueador")
    session.add(hero_deadpond)
    session.add(hero_rusty_man)
    session.add(hero_spider_boy)
    session.commit()

    session.refresh(hero_deadpond)
    session.refresh(hero_rusty_man)
    session.refresh(hero_spider_boy)
    logger.info(f"\nCreated hero1: {hero_deadpond}, {hero_deadpond.team}")
    logger.info(f"\nCreated hero2: {hero_rusty_man}, {hero_rusty_man.team}")
    logger.info(f"\nCreated hero3: {hero_spider_boy}, {hero_spider_boy.team}")

    # commit 실행 이후, refresh를 해야 team 정보가 나온다.
    # 그게 내 commit 이든, 다른 commit 이든 상관없이.
    # refresh 안하면 team_preventers, team_z_force 가 비어있음
    session.refresh(team_preventers)
    session.refresh(team_z_force)
    logger.info(f"Created team1: {team_preventers}")
    logger.info(f"\n==> heroes of team1: {team_preventers.heroes}")
    logger.info(f"Created team2: {team_z_force}")
    logger.info(f"\n==> heroes of team2: {team_z_force.heroes}")

    return {
        "teams": [team_preventers, team_z_force],
        "heroes": [hero_deadpond, hero_rusty_man, hero_spider_boy],
    }


@router.get("/tutorial/2")
def tutorial_2(*, session: Session = Depends(get_session)):
    """select heroes and teams"""
    statement = select(Hero).where(Hero.name == "Tutorial Spider-Boy")
    result = session.exec(statement)
    hero_spider_boy = result.one()
    if not hero_spider_boy:
        raise HTTPException(status_code=404, detail="Hero not found")
    logger.info(f"\n==> {hero_spider_boy}")

    statement = select(Team).where(Team.id == hero_spider_boy.team_id)
    result = session.exec(statement)
    team = result.first()
    logger.info(f"\n==> Tutorial Spider-Boy's team: {team}")

    # same statement
    logger.info(f"\n==> Spider-Boy's team again: {hero_spider_boy.team}")

    return {"hero": hero_spider_boy, "team": hero_spider_boy.team}


@router.get("/tutorial/3")
def tutorial_3(*, session: Session = Depends(get_session)):
    """update heroes and teams"""
    statement = select(Hero).where(Hero.name == "Tutorial Spider-Boy")
    result = session.exec(statement)
    hero_spider_boy = result.one()
    if not hero_spider_boy:
        raise HTTPException(status_code=404, detail="Hero not found")
    logger.info(f"\n==> Tutorial Spider-Boy without team: {hero_spider_boy}")

    statement = select(Team).where(Team.name == "Tutorial Preventers")
    result = session.exec(statement)
    team_preventers = result.one()
    logger.info(f"\n==> Tutorial Preventers heroes: {team_preventers.heroes}")

    hero_spider_boy.team = team_preventers
    session.add(hero_spider_boy)
    session.commit()

    session.refresh(hero_spider_boy)
    logger.info(f"\n==> Spider-Boy with team: {hero_spider_boy}")

    return {"hero": hero_spider_boy, "team": hero_spider_boy.team}


@router.get("/tutorial/4")
def tutorial_4(*, session: Session = Depends(get_session)):
    """delete heroes and teams"""
    statement = select(Team).where(Team.name == "Tutorial Preventers")
    result = session.exec(statement)
    team_preventers = result.one()
    if not team_preventers:
        raise HTTPException(status_code=404, detail="Hero not found")
    logger.info(f"\n==> Tutorial Preventers heroes: {team_preventers.heroes}")

    session.delete(team_preventers)
    session.commit()

    statement = select(Hero).where(Hero.name == "Spider-Boy")
    result = session.exec(statement)
    hero_spider_boy = result.one()
    if not hero_spider_boy:
        raise HTTPException(status_code=404, detail="Hero not found")
    logger.info(f"\n==> Tutorial Spider-Boy without team: {hero_spider_boy}")

    return {"hero": hero_spider_boy, "team": hero_spider_boy.team}
