FROM python:3.12-slim

LABEL maintainer="Monkey.d.rupi <minsuhya@gmail.com>"
LABEL description="FastAPI + sqlmodel + mariadb + graphql with poetry"

RUN apt-get update && apt-get upgrade -y

# install utils: localedef, curl, sudo, ping, vim, git, libpq5
RUN apt-get install -y locales curl sudo iputils-ping vim git
    # python3-dev default-libmysqlclient-dev build-essential pkg-config # install for mysqlclient

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

# add USER as sudoer with GROUP
RUN groupadd --system -g 1001 $GRP
RUN useradd --system -m -s /bin/bash -g $GRP -u 1001 -c "Python User" $USR
RUN echo "$USR ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
# RUN usermod -aG sudo $USR

USER $USR
ENV HOME "/home/$USR"
ENV VENV_PATH=$HOME/.local
ENV EDITOR vim

# install poetry manually (need gcc libffi-dev)
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="${PATH}:$VENV_PATH/bin"

WORKDIR /backend

# copy .env, toml and sources
COPY --chown=fastapi $APP_TOML ./pyproject.toml
# COPY --chown=fastapi $APP_ROOT ./$APP_ROOT
# make virtualenv in project
RUN poetry config virtualenvs.in-project true
# install dependencies only
RUN poetry install --no-root && poetry run which python

# poetry run alembic upgrade head after depends_on DB
# COPY --chown=fastapi alembic.ini ./
# COPY --chown=fastapi alembic ./alembic

# multiple ports for concat with blanks
EXPOSE $APP_PORT
ENV PORT $APP_PORT
