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
from models import TeamRead

logging.basicConfig(level=logging.INFO)

client = TestClient(app)


def convert_result_to_team(result) -> TeamRead:
    assert isinstance(result, dict)
    try:
        hero = TeamRead(**result)
        logging.info(hero)
    except Exception as e:
        logging.error(e)
        assert False
    return hero


def convert_result_to_teams(result) -> List[TeamRead]:
    assert isinstance(result, list)
    try:
        heroes = [TeamRead(**r) for r in result]
        logging.info(heroes)
    except Exception as e:
        logging.error(e)
        assert False
    return heroes


def test_read_groups():
    response = client.get(
        "/teams", headers={"Content-Type": "application/json", "Accept": "application/json"}
    )
    assert response.status_code == 200
    result = response.json()  # type: List[dict]
    assert result != []
    convert_result_to_teams(result)


def test_read_group():
    response = client.get(
        "/team/1", headers={"Content-Type": "application/json", "Accept": "application/json"}
    )
    assert response.status_code == 200
    result = response.json()  # type: dict
    assert result != {}
    convert_result_to_team(result)


def test_create_group():
    response = client.post(
        "/teams/",
        headers={"Content-Type": "application/json", "Accept": "application/json"},
        json={"name": "뉴욕팀", "headquarters": "뉴욕시청"},
    )
    assert response.status_code == 200
    result = response.json()
    assert result["headquarters"] is not None
    convert_result_to_team(result)


def test_update_group():
    def last_hero():
        response = client.get(
            "/heroes/last",
            headers={"Content-Type": "application/json", "Accept": "application/json"},
        )
        assert response.status_code == 200
        return response.json()

    response = client.get(
        "/teams/last", headers={"Content-Type": "application/json", "Accept": "application/json"}
    )
    assert response.status_code == 200
    origin_result = response.json()
    assert "id" in origin_result
    item_id = origin_result["id"]

    team = convert_result_to_team(origin_result)
    team.name += " Super"
    team.headquarters += " 공원"

    response = client.patch(
        f"/teams/{item_id}",
        headers={"Content-Type": "application/json", "Accept": "application/json"},
        json=team.dict(exclude_unset=True),
    )
    assert response.status_code == 200
    updated_result = response.json()
    assert updated_result == json.loads(team.json())
    convert_result_to_team(updated_result)


def test_delete_group():
    response = client.get(
        "/teams/last", headers={"Content-Type": "application/json", "Accept": "application/json"}
    )
    assert response.status_code == 200
    result = response.json()
    assert "id" in result

    item_id = result["id"]
    response = client.delete(
        f"/teams/{item_id}",
        headers={"Content-Type": "application/json", "Accept": "application/json"},
    )
    assert response.status_code == 200
    assert response.json() == {"ok": True}
    logging.info(response.json())

    response = client.get(
        f"/team/{item_id}",
        headers={"Content-Type": "application/json", "Accept": "application/json"},
    )
    assert response.status_code == 404
