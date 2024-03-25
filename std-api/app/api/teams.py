from typing import List

from ..core import get_session
from fastapi import APIRouter, Depends, HTTPException, Query
from ..models import Team, TeamCreate, TeamRead, TeamReadWithHeroes, TeamUpdate
from sqlmodel import Session, desc, select

router = APIRouter(
    prefix="/pgdb",
    tags=["teams"],
    dependencies=[Depends(get_session)],
    responses={404: {
        "description": "API Not found"
    }},
)


# select the last team
@router.get("/teams/last", response_model=TeamRead)
def get_last_team(*, session: Session = Depends(get_session)):
    team = session.exec(select(Team).order_by(desc(Team.id))).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team


@router.get("/teams/{team_id}", response_model=TeamReadWithHeroes)
def read_team(*, team_id: int, session: Session = Depends(get_session)):
    team = session.get(Team, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team


# select all teams
@router.get("/teams/", response_model=List[TeamRead])
def read_teams(*,
               session: Session = Depends(get_session),
               offset: int = 0,
               limit: int = Query(default=100, lte=100)):
    teams = session.exec(select(Team).offset(offset).limit(limit)).all()
    return teams


# create a team
@router.post("/teams/", response_model=TeamRead)
def create_team(*, session: Session = Depends(get_session), team: TeamCreate):
    db_team = Team.from_orm(team)
    session.add(db_team)
    session.commit()
    session.refresh(db_team)
    return db_team


# update a team
@router.patch("/teams/{team_id}", response_model=TeamRead)
def update_team(team_id: int,
                *,
                session: Session = Depends(get_session),
                team: TeamUpdate):
    db_team = session.get(Team, team_id)
    if not db_team:
        raise HTTPException(status_code=404, detail="Team not found")

    team_data = team.dict(exclude_unset=True)
    for key, value in team_data.items():
        setattr(db_team, key, value)
    session.add(db_team)
    session.commit()
    session.refresh(db_team)
    return db_team


# delete a team
@router.delete("/teams/{team_id}")
def delete_team(team_id: int, *, session: Session = Depends(get_session)):
    team = session.get(Team, team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    session.delete(team)
    session.commit()
    return {"ok": True}


# select a team by id
@router.get("/team/{id}", response_model=Team)
def get_team(id: int, *, session: Session = Depends(get_session)):
    team = session.exec(select(Team).where(Team.id == id)).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return team
