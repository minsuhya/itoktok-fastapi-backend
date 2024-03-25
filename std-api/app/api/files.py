import codecs
import csv
import os
from typing import Any, List

from ..core import get_mongodb
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

# from fastapi.encoders import jsonable_encoder
from loguru import logger
from ..models import Person

# https://pymongo.readthedocs.io/en/stable/tutorial.html
from pymongo.collection import Collection
from pymongo.database import Database

router = APIRouter(
    prefix="/files",
    tags=["files"],
    dependencies=[Depends(get_mongodb)],
    responses={404: {
        "description": "API Not found"
    }},
)


@router.get("/hello")
def reader_hello(*, db: Database = Depends(get_mongodb)):
    db.drop_collection("hello")

    coll: Collection = db["hello"]
    # coll.delete_many({})
    coll.insert_one({"id": 1001, "name": "tonyne", "score": 100.5})
    result = coll.insert_many([
        {
            "id": 1002,
            "name": "tonyne",
            "score": 100.5
        },
        {
            "id": 1003,
            "name": "tonyne",
            "score": 100.5
        },
        {
            "id": 1004,
            "name": "tonyne",
            "score": 100.5
        },
        {
            "id": 1005,
            "name": "tonyne",
            "score": 100.5
        },
    ])
    logger.info(f"_ids = {result.inserted_ids}")
    cusor = coll.find({})
    for doc in cusor:
        logger.info(f"\n{doc}")
    return {"msg": "Hello, Files", "collections": db.list_collection_names()}


@router.get("/{name}", response_model=List[Person])
def reader_collection(*, db=Depends(get_mongodb), name: str):
    list_of_collections = db.list_collection_names()
    if name not in list_of_collections:
        raise HTTPException(status_code=404,
                            detail=f"Collection['{name}'] not found")
    logger.info(f"Collection['{name}'] found")
    collection: Collection = db[name]
    return [Person(**r) for r in collection.find({})]


def insert_data(collection: Collection, data: List[Any]):
    try:
        collection.drop()
        result = collection.insert_many(data)
    except Exception as e:
        logger.error(e)
    return result.inserted_ids


@router.post("/upload")
def reader_upload(
    file: UploadFile = File(...), *, db: Database = Depends(get_mongodb)):
    """
    curl -F 'file=@../assets/data/test.csv' -X POST "http://localhost:8000/files/upload"
    """
    csvReader = csv.DictReader(codecs.iterdecode(file.file, "utf-8"))
    rows = []
    for row in csvReader:
        row["_id"] = str(row.pop("id"))
        rows.append(row)
    file.file.close()

    collection_name = os.path.splitext(file.filename)[0]
    inserted_ids = insert_data(db[collection_name], rows)
    logger.info(f"coll['{collection_name}'].ids = {inserted_ids}")
    return rows
