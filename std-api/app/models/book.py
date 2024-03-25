import uuid
from typing import Optional

# from bson import ObjectId
from bson.objectid import ObjectId
from pydantic import BaseModel, Field


class Person(BaseModel):
    id: str = Field(default_factory=str, alias="_id")
    name: str
    age: Optional[int] = None
    height: Optional[int] = None
    weight: Optional[float] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "id": "1",
                "name": "Alice",
                "age": 20,
                "height": 62,
                "weight": 120.6,
            }
        }


class Book(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    title: str = Field(...)
    author: str = Field(...)
    synopsis: str = Field(...)

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
                "title": "Don Quixote",
                "author": "Miguel de Cervantes",
                "synopsis": "...",
            }
        }


class BookUpdate(BaseModel):
    title: Optional[str]
    author: Optional[str]
    synopsis: Optional[str]

    class Config:
        schema_extra = {
            "example": {
                "title": "Don Quixote",
                "author": "Miguel de Cervantes",
                "synopsis": "Don Quixote is a Spanish novel by Miguel de Cervantes...",
            }
        }
