import asyncio
import json
import logging
import os
import sys
import time

import aiohttp
import httpx
import requests
from fastapi.testclient import TestClient

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(ROOT_DIR, "app"))
# this is to include backend dir in sys.path so that we can import from db,main.py

from main import app
from models import HeroRead

logging.basicConfig(level=logging.INFO)

client = TestClient(app)


def test_hello():
    response = client.get("/", headers={"Accept": "application/json"})
    assert response.status_code == 200
    result = response.json()
    assert result == {"msg": "Hello World"}
    logging.info(result)


def test_hero():
    response = client.get(
        "/heroes/last", headers={"Content-Type": "application/json", "Accept": "application/json"}
    )
    assert response.status_code == 200
    result = response.json()  # type: dict
    assert "id" in result

    assert isinstance(result, dict)
    try:
        hero = HeroRead(**result)
        logging.info(hero)
    except Exception as e:
        logging.debug(e)
        assert False

    assert result == json.loads(hero.json())


url = "http://localhost:8000/heroes/"
headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36"
}


##################################################
#  0) aiohttp with every AsyncClient()
#  Send 100 requests, time consuming: 0.7839
#


async def aiohttp_with_every_client():
    async def make_request():
        async with aiohttp.ClientSession() as client:
            async with client.get(url, headers=headers) as resp:
                assert resp.status == 200

    start = time.time()
    # tasks = [asyncio.ensure_future(make_request()) for _ in range(100)]
    # loop = asyncio.get_event_loop()
    # loop.run_until_complete(asyncio.wait(tasks))

    tasks = [asyncio.create_task(make_request()) for _ in range(1000)]
    await asyncio.gather(*tasks)
    end = time.time()
    logging.info(f"ASYNC0-aiohttp) Send 100 requests, time consuming: {end - start}")


def test_aiohttp_with_every_client():
    asyncio.run(aiohttp_with_every_client())


##################################################
#  1) httpx with every AsyncClient()
#  Send 100 requests, time consuming: 0.7839
#


async def httpx_with_every_client():
    async def make_request():
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, headers=headers)
            print(resp.status_code)

    start = time.time()
    tasks = [asyncio.create_task(make_request()) for _ in range(100)]
    await asyncio.gather(*tasks)
    end = time.time()
    logging.info(f"ASYNC1-httpx) Send 100 requests, time consuming: {end - start}")


# def test_httpx_with_every_client():
#     asyncio.run(httpx_with_every_client())


##################################################
#  2) httpx with one AsyncClient()
#  Send 100 requests, time consuming: 0.4447
#


async def httpx_with_one_client():
    async def make_request(client):
        resp = await client.get(url, headers=headers)
        print(resp.status_code)

    async with httpx.AsyncClient() as client:
        start = time.time()
        tasks = [asyncio.create_task(make_request(client)) for _ in range(100)]
        await asyncio.gather(*tasks)
        end = time.time()
    logging.info(f"ASYNC2-httpx) Send 100 requests, time consuming: {end - start}")


# def test_httpx_with_one_client():
#     asyncio.run(httpx_with_one_client())


##################################################
#  3) httpx.get with Sync
#  Send 100 requests, time consuming: 1.5978
#


def httpx_with_sync():
    # 내부적으로 co-routine 사용하는듯
    def make_request():
        resp = httpx.get(url, headers=headers)
        print(resp.status_code)

    start = time.time()
    for _ in range(100):
        make_request()
    end = time.time()
    logging.info(f"SYNC3-httpx) Send 100 requests, time consuming: {end - start}")


# def test_httpx_with_sync():
#     httpx_with_sync()


##################################################
#  4) requests with Sync
#  Send 100 requests, time consuming: 0.8913
#


def requests_with_sync():
    requests_session = requests.session()

    def make_request():
        resp = requests_session.get(url, headers=headers)
        print(resp.status_code)

    start = time.time()
    for _ in range(100):
        make_request()
    end = time.time()
    logging.info(f"SYNC4-requests) Send 100 requests, time consuming: {end - start}")


# def test_requests_with_sync():
#     requests_with_sync(requests_session)
