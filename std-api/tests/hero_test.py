import json
import logging
import os
import sys
from typing import List

from fastapi.testclient import TestClient

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(ROOT_DIR, "app"))
# this is to include backend dir in sys.path so that we can import from db,main.py

from main import app
from models import HeroRead

logging.basicConfig(level=logging.INFO)

client = TestClient(app)


def convert_result_to_hero(result) -> HeroRead:
    assert isinstance(result, dict)
    try:
        hero = HeroRead(**result)
        logging.info(hero)
    except Exception as e:
        logging.debug(e)
        assert False
    return hero


def convert_result_to_heroes(result) -> List[HeroRead]:
    assert isinstance(result, list)
    try:
        heroes = [HeroRead(**r) for r in result]
        logging.info(heroes)
    except Exception as e:
        logging.debug(e)
        assert False
    return heroes


def test_read_items():
    response = client.get(
        "/heroes", headers={"Content-Type": "application/json", "Accept": "application/json"}
    )
    assert response.status_code == 200
    result = response.json()  # type: List[dict]
    assert result != []
    convert_result_to_heroes(result)


def test_read_item():
    response = client.get(
        "/hero/1", headers={"Content-Type": "application/json", "Accept": "application/json"}
    )
    assert response.status_code == 200
    result = response.json()  # type: dict
    assert result != {}
    convert_result_to_hero(result)


def test_create_item():
    response = client.post(
        "/heroes/",
        headers={"Content-Type": "application/json", "Accept": "application/json"},
        json={"name": "ABC", "secret_name": "foo bar", "age": 35},
    )
    assert response.status_code == 200
    result = response.json()
    assert result["secret_name"] is not None
    convert_result_to_hero(result)


def test_update_item():
    response = client.get(
        "/heroes/last", headers={"Content-Type": "application/json", "Accept": "application/json"}
    )
    assert response.status_code == 200
    origin_result = response.json()
    assert "id" in origin_result
    item_id = origin_result["id"]

    hero = convert_result_to_hero(origin_result)
    hero.name += " Super"
    hero.age = None
    hero.team_id = 1

    response = client.patch(
        f"/heroes/{item_id}",
        headers={"Content-Type": "application/json", "Accept": "application/json"},
        json=hero.dict(exclude_unset=True),
    )
    assert response.status_code == 200
    updated_result = response.json()
    assert updated_result == json.loads(hero.json())
    convert_result_to_hero(updated_result)


def test_delete_item():
    response = client.get(
        "/heroes/last", headers={"Content-Type": "application/json", "Accept": "application/json"}
    )
    assert response.status_code == 200
    result = response.json()
    assert "id" in result

    item_id = result["id"]
    response = client.delete(
        f"/heroes/{item_id}",
        headers={"Content-Type": "application/json", "Accept": "application/json"},
    )
    assert response.status_code == 200
    assert response.json() == {"ok": True}
    logging.info(response.json())

    response = client.get(
        f"/hero/{item_id}",
        headers={"Content-Type": "application/json", "Accept": "application/json"},
    )
    assert response.status_code == 404
