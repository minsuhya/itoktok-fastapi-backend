# Docker Compose 재구성 설계

## 목적

Docker Compose 파일을 로컬 개발과 운영 환경으로 명확히 분리하여, 로컬에서는 `docker compose up`으로 HMR이 적용된 전체 스택을 실행하고, 운영에서는 `docker compose -f docker-compose.yml up`으로 nginx 기반 정적 서빙을 실행한다.

## 현재 상태

- `docker-compose.yml`: nginx(8082) + api(3000), frontend/mobile 주석 처리
- `docker-compose.dev.yml`: nginx(2080/2443) + api(3000), DB 서비스 주석 처리
- 두 환경 모두 nginx를 사용
- mobile 서비스 Docker 구성 없음
- `.gitignore`에 frontend/dist, mobile/dist 미포함

## 설계

### 파일 구조

```
변경 전:
├── docker-compose.yml          # 운영
├── docker-compose.dev.yml      # 개발 ← 삭제
├── conf/nginx.conf             # 운영 nginx
├── conf/nginx.dev.conf         # 개발 nginx ← 삭제

변경 후:
├── docker-compose.yml          # 운영 기본
├── docker-compose.override.yml # 로컬 자동 병합 (git 추적)
├── conf/nginx.conf             # 운영 nginx (mobile 도메인 추가)
```

### 실행 방식

| 환경 | 명령어 | 동작 |
|------|--------|------|
| 로컬 | `docker compose up` | base + override 자동 병합 |
| 운영 | `docker compose -f docker-compose.yml up` | base만 사용 |

### docker-compose.yml (운영 기본)

```yaml
services:
  nginx:
    container_name: std-nginx
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "8082:80"
    volumes:
      - ./conf/nginx.conf:/etc/nginx/nginx.conf
      - ./frontend/dist:/var/www/html
      - ./mobile/dist:/var/www/mobile
    environment:
      - TZ=Asia/Seoul
    depends_on:
      - api
    networks:
      - std-net
    logging:
      options:
        max-size: "20m"
        max-file: "1"

  api:
    image: std-api
    container_name: std-api
    build:
      context: ./backend
      dockerfile: Dockerfile
    command: poetry run uvicorn app.main:app --host 0.0.0.0 --port 3000
    ports:
      - "3000:3000"
    env_file: ./.env
    volumes:
      - ./backend/app:/backend/app
      - ./data:/data
    networks:
      - std-net
    logging:
      options:
        max-size: "20m"
        max-file: "1"

networks:
  std-net:
    driver: bridge
```

**운영 변경점:**
- nginx에 `mobile/dist` 볼륨 추가
- api에서 `--reload` 제거 (운영에서 불필요)

### docker-compose.override.yml (로컬 개발)

```yaml
services:
  # nginx 비활성화
  nginx:
    profiles:
      - prod

  # API: 소스 마운트 + 핫 리로드
  api:
    command: poetry run uvicorn app.main:app --host 0.0.0.0 --port 3000 --reload
    volumes:
      - ./backend/app:/backend/app
      - ./backend/tests:/backend/tests
      - ./data:/data

  # Frontend: Vite 개발 서버 (HMR)
  frontend:
    image: node:22-alpine
    container_name: std-frontend
    working_dir: /app
    command: sh -c "npm install -g pnpm && pnpm install && pnpm dev"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "5173:5173"
    environment:
      - TZ=Asia/Seoul
    networks:
      - std-net

  # Mobile: Expo 개발 서버 (HMR)
  mobile:
    image: node:22-alpine
    container_name: std-mobile
    working_dir: /app
    command: sh -c "npm install && npx expo start --web --host 0.0.0.0 --port 8081"
    volumes:
      - ./mobile:/app
      - /app/node_modules
    ports:
      - "8081:8081"
    environment:
      - TZ=Asia/Seoul
    networks:
      - std-net
```

**로컬 핵심:**
- nginx에 `profiles: ["prod"]` 추가 → 로컬에서 자동 비활성화
- api command를 `--reload`로 오버라이드, tests 볼륨 추가
- frontend/mobile은 Dockerfile 없이 `node:22-alpine` 직접 사용
- `- /app/node_modules` anonymous volume으로 호스트와 node_modules 분리

### 로컬 접속 URL

| 서비스 | URL |
|--------|-----|
| API | http://localhost:3000 |
| API Docs | http://localhost:3000/docs |
| Frontend | http://localhost:5173 |
| Mobile Web | http://localhost:8081 |

### nginx.conf 변경 (운영)

기존 서버 블록 유지 + mobile 도메인 추가:

```nginx
# 추가할 서버 블록
server {
  listen 80;
  server_name itoktok-m.gillilab.com;

  location / {
    root /var/www/mobile;
    index index.html index.htm;
    try_files $uri $uri/ /index.html?$args;
  }
}
```

기존 `itoktok-www-dev.gillilab.com` 서버 블록은 삭제 (docker-compose.dev.yml 삭제에 맞춰 불필요).

### .gitignore 추가

```
frontend/dist/
mobile/dist/
```

### 삭제 파일

- `docker-compose.dev.yml` — override로 대체
- `conf/nginx.dev.conf` — 더 이상 사용하지 않음

## 환경별 서비스 비교

| 항목 | 로컬 (`docker compose up`) | 운영 (`docker compose -f docker-compose.yml up`) |
|------|--------------------------|----------------------------------------------|
| nginx | 비활성 (profiles) | 8082 포트, 3개 도메인 서빙 |
| api | 3000, `--reload`, 소스+테스트 마운트 | 3000, reload 없음 |
| frontend | 5173, Vite HMR | nginx → `frontend/dist` |
| mobile | 8081, Expo HMR | nginx → `mobile/dist` |

## 구현 범위

1. `docker-compose.yml` — 운영 기본으로 재작성
2. `docker-compose.override.yml` — 신규 생성
3. `conf/nginx.conf` — mobile 도메인 추가, dev 도메인 삭제
4. `.gitignore` — frontend/dist, mobile/dist 추가
5. `docker-compose.dev.yml` — 삭제
6. `conf/nginx.dev.conf` — 삭제
7. `CLAUDE.md` — 개발/운영 명령어 및 접속 URL 업데이트
