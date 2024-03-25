from typing import List

from ..core import get_mongodb
from fastapi import APIRouter, Body, Depends, HTTPException, Response, status
from fastapi.encoders import jsonable_encoder
from loguru import logger
from ..models import Book, BookUpdate

# https://pymongo.readthedocs.io/en/stable/tutorial.html
from pymongo.database import Database

router = APIRouter(
    prefix="/books",
    tags=["books"],
    dependencies=[Depends(get_mongodb)],
    responses={404: {
        "description": "API Not found"
    }},
)


@router.post(
    "/",
    response_description="Create a new book",
    status_code=status.HTTP_201_CREATED,
    response_model=Book,
)
def create_book(
    book: Book = Body(...), *, db: Database = Depends(get_mongodb)):
    """
    curl -X POST "http://localhost:8000/books/" -H "Content-Type: application/json" -d '''{ "_id": "066de609-b04a-4b30-b46c-32537c7f1f6e",
      "title": "Don Quixote",
      "author": "Miguel de Cervantes",
      "synopsis": "..."
    }
    '''
    """
    book = jsonable_encoder(book)
    new_book = db["books"].insert_one(book)
    created_book = db["books"].find_one({"_id": new_book.inserted_id})
    logger.info(f"created_book = {created_book}")
    return created_book


@router.get("/",
            response_description="List all books",
            response_model=List[Book])
def list_books(*, db: Database = Depends(get_mongodb)):
    books = list(db["books"].find(limit=100))
    logger.info(f"books.size = {len(books)}")
    return books


@router.get("/{id}",
            response_description="Get a single book by id",
            response_model=Book)
def find_book(id: str, *, db: Database = Depends(get_mongodb)):
    if (book := db["books"].find_one({"_id": id})) is not None:
        return book

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Book with ID {id} not found")


@router.put("/{id}", response_description="Update a book", response_model=Book)
def update_book(id: str,
                *,
                db: Database = Depends(get_mongodb),
                book: BookUpdate = Body(...)):
    """
    curl -X PUT "http://localhost:8000/books/066de609-b04a-4b30-b46c-32537c7f1f6e" -H "Content-Type: application/json" -d '''{
      "title": "Don Quixote",
      "author": "Miguel de Cervantes",
      "synopsis": "Don Quixote is a Spanish novel by Miguel de Cervantes..."
    }
    '''
    """
    book = {k: v for k, v in book.dict().items() if v is not None}

    if len(book) >= 1:
        update_result = db["books"].update_one({"_id": id}, {"$set": book})

        if update_result.modified_count == 0:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Book with ID {id} not found")

    # Walrus Operator (since Python 3.8)
    if (existing_book := db["books"].find_one({"_id": id})) is not None:
        return existing_book

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Book with ID {id} not found")


@router.delete("/{id}", response_description="Delete a book")
def delete_book(id: str,
                *,
                db: Database = Depends(get_mongodb),
                response: Response):
    delete_result = db["books"].delete_one({"_id": id})

    if delete_result.deleted_count == 1:
        response.status_code = status.HTTP_204_NO_CONTENT
        return response

    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                        detail=f"Book with ID {id} not found")
