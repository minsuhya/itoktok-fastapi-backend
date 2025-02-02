# Hero Tutorial of SqlModel

## 2. Backend: API

FastAPI 프레임워크로 DB 에 연결해 API 제공하는 백엔드 프로젝트

> 참고문서

- [SqlModel 공식문서 - FastAPI and Pydantic](https://sqlmodel.tiangolo.com/tutorial/fastapi/)
- [FastAPI 공식문서 - SQL (Relational) Databases](https://fastapi.tiangolo.com/tutorial/sql-databases/)

| <img alt="fastapi docs screen" src="https://github.com/maxmin93/fastapi-sqlmodel-heroes/blob/main/assets/img/12-fastapi-sqlmodel-pg14-docs-crunch.png?raw=true" style="width:580px;"/> |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                           &lt;그림&gt; FastAPI `/docs` 화면                                                                            |

### 1) build image with pythion:3.9-slim

```bash
# 파이썬 바닐라 이미지에서 도커 개발 시작
$ docker run -it --rm --name py39-slim -p 58000:8000 \
    python:3.9-slim /bin/bash

# 이미지 생성
$ docker build -t py39-slim:latest .

# 도커 컴포즈에서 이미지 생성
$ env DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose build
```

### 2) 시행착오 기록

#### (1) Error: /backend/smp_api does not contain any element

poetry install 과정에서 `... does not contain any element` 메시지와 함께 build 작업이 멈춘다.

- 해결방법 : `--no-root` 옵션 추가
  - 참고: [Poetry still fails to install in Docker #1227](https://github.com/python-poetry/poetry/issues/1227)

```bash
$ docker compose build
#...
#0 13.92   • Installing uvicorn (0.18.3)
#0 14.73
#0 14.73 /backend/smp_api does not contain any element
------
failed to solve: executor failed running [/bin/sh -c poetry install && poetry run which python]: exit code: 1
```

#### (2) Mac M1 에서 postgresql DB 서비스로 접속할 수 없음

설정에 문제가 없고, `libpq5` 또는 `libpq-dev` 를 설치해도 마찬가지.

- 해결방법 : `env DOCKER_DEFAULT_PLATFORM=linux/amd64` 옵션 추가해 빌드
  - aarch64 아키텍처에서 libpq 바이너리가 잘못 로딩되는 문제가 있다고
  - 그래서, `linux/amd64` 아키텍처로 빌드하면 문제 해결 (rosetta 실행)
  - => `env DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose build`
    - 참고: [How can I solve Postgresql SCRAM authentication problem?](https://stackoverflow.com/a/70238851)

```bash
smp-api  |   File "/backend/.venv/lib/python3.9/site-packages/psycopg2/__init__.py", line 122, in connect
smp-api  |     conn = _connect(dsn, connection_factory=connection_factory, **kwasync)
smp-api  | psycopg2.OperationalError: SCRAM authentication requires libpq version 10 or above
smp-api  |
#...
smp-api  |
smp-api  | sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) SCRAM authentication requires libpq version 10 or above
smp-api  |
smp-api  | (Background on this error at: https://sqlalche.me/e/14/e3q8)
smp-api  |
smp-api  | ERROR:    Application startup failed. Exiting.
smp-api exited with code 3
```

#### (3) SQLModel 에서 session.commit 이후 refresh 하기

**&lt;권장&gt;**

- function 은 transaction 단위로 작성
  - transaction 하나에 commit 한번
  - commit 이후 관련된 모든 객체에 대해 refresh 적용
    - commit 하면 모든 객체가 invalidate 됨

예를 들어,

```python
def insert_team_and_heroes(session):
  """두개의 transaction 을 하나의 함수에 담은 경우"""
  team = Team(...)
  session.add(team)
  session.commit()
  session.refresh(team)
  print(team)  # 값 있음

  hero = Hero(...)
  hero.team = team
  session.add(hero)
  session.commit()
  session.refresh(hero)
  print(team)  # 값 없음 (refresh 필요)
```

#### (4) SQLModel 에서 relation 관계 model 들은 같은 파일에 정의할 것

ImportError: most likely due to a circular import

- 상호참조 모델은 한곳에서 정의해야 한다.
  - 'joined.py' 파일에 기술
- 쪼개려고 노력해봐야 소용없음 (시간 낭비!)

#### (5) tests 파일을 별도 디렉토리로 분리시, sys.path.append 필요

예제에서는 main.py 와 동일한 위치에 둔다.

- pytest 의 실행 위치는 해당 파일의 위치를 base 로 삼음

```bash
# 상세 로그를 보고 싶으면 -vv 옵션 사용
$ poetry run pytest tests --log-cli-level=DEBUG -vv
```

- fastapi 의 app 을 참조하고 싶으면, module 참조 경로가 추가되어야 함
  - `..app.main` 이런 방식은 안됨 (상위 참조 오류)

```python
# ROOT_DIR = '../../test.py'
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(ROOT_DIR, "app"))

# from ..app.main 이런 방식은 안됨 (상위 참조 오류)
from main import app
from models import HeroRead
```

### 3) Dockerfile

```dockerfile
FROM python:3.9-slim

LABEL maintainer="Tonyne@JEJU <tonyne.jeju@gmail.com>"
LABEL description="FastAPI + sqlalchemy + psycopg2 with poetry"

RUN apt-get update && apt-get upgrade -y

# install utils: localedef, curl, sudo, ping, vim, git, libpq5
RUN apt-get install -y locales curl sudo iputils-ping vim git

# default env.
ENV TZ Asia/Seoul
ENV LANG=C.UTF-8 LC_ALL=C.UTF-8
ENV GRP=pythonapp USR=fastapi
ENV PATH=/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# default value
ENV APP_PORT ${APP_PORT:-8000}
ENV APP_ROOT ${APP_ROOT:-app}
ENV APP_MAIN ${APP_MAIN:-main:app}
ENV APP_TOML ${APP_TOML:-pyproject.toml}

# for pm2: --build-arg BUILD_DEV_MODE=development
ARG BUILD_DEV_MODE
ENV NODE_ENV=${BUILD_DEV_MODE:-production}

# add USER as sudoer with GROUP
RUN groupadd --system -g 1001 $GRP
RUN useradd --system -m -s /bin/bash -g $GRP -u 1001 -c "Python User" $USR
RUN echo "$USR ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
# RUN usermod -aG sudo $USR


USER $USR
ENV HOME "/home/$USR"
ENV VENV_PATH=$HOME/.local
ENV EDITOR vim

# for root
RUN echo $'             \n\
alias ll="ls -al"       \n\
alias vi="vim"          \n\
export PATH=$PATH:$VENV_PATH/bin' >> $HOME/.bashrc

# for vim
RUN echo $'             \n\
set nonu                \n\
set title               \n\
set showmatch           \n\
set ruler               \n\
syntax on               \n\
set t_Co=256            \n\
set autoindent          \n\
set tabstop=4           \n\
set shiftwidth=4        \n\
set softtabstop=4       \n\
set smarttab            \n\
set expandtab           \n\
inoremap { {}<ESC>ha    \n\
set mouse-=a            \n\
set encoding=utf-8      \n\
set termencoding=utf-8  \n\
set cursorline          \n\
set ignorecase          ' > $HOME/.vimrc

# install poetry manually (need gcc libffi-dev)
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="${PATH}:$VENV_PATH/bin"
# check python & poetry
RUN python --version && poetry --version

WORKDIR backend

# copy .env, toml and sources
COPY --chown=fastapi $APP_TOML ./pyproject.toml
COPY --chown=fastapi $APP_ROOT ./$APP_ROOT
# make virtualenv in project
RUN poetry config virtualenvs.in-project true
RUN poetry install --no-root && poetry run which python

# multiple ports for concat with blanks
EXPOSE $APP_PORT
ENV PORT $APP_PORT
```
