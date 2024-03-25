from typing import Optional

from sqlmodel import Field, SQLModel

# ==> Error for circular import
# https://pydantic-docs.helpmanual.io/usage/postponed_annotations/


class TeamBase(SQLModel):
    name: str = Field(index=True)
    headquarters: str


class TeamCreate(TeamBase):
    pass


class TeamUpdate(SQLModel):
    name: Optional[str] = None
    headquarters: Optional[str] = None
