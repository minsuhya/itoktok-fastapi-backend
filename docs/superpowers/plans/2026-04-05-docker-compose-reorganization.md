# Docker Compose 재구성 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Docker Compose를 운영(base)과 로컬(override) 구조로 분리하여, 로컬에서는 nginx 없이 HMR 전체 스택을, 운영에서는 nginx 기반 정적 서빙을 실행한다.

**Architecture:** `docker-compose.yml`이 운영 기본, `docker-compose.override.yml`이 로컬 자동 병합. 로컬에서 `docker compose up`은 두 파일을 자동 합성하고, 운영에서 `docker compose -f docker-compose.yml up`은 base만 사용한다. nginx는 profiles 기능으로 로컬에서 비활성화한다.

**Tech Stack:** Docker Compose, Nginx, Node 22 Alpine, Vite, Expo

---

### Task 1: docker-compose.yml 재작성 (운영 기본)

**Files:**
- Modify: `docker-compose.yml`

- [ ] **Step 1: docker-compose.yml을 운영 기본으로 재작성**

`docker-compose.yml` 전체를 다음 내용으로 교체:

```yaml
---
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

- [ ] **Step 2: YAML 문법 검증**

Run: `cd /Users/rupi/Colima/gillilab/itoktok && docker compose -f docker-compose.yml config --quiet`
Expected: 에러 없이 종료 (exit 0)

- [ ] **Step 3: Commit**

```bash
git add docker-compose.yml
git commit -m "refactor: rewrite docker-compose.yml as production base

- Remove --reload from api command (production)
- Add mobile/dist volume to nginx
- Remove commented-out frontend/mobile/db services"
```

---

### Task 2: docker-compose.override.yml 생성 (로컬 개발)

**Files:**
- Create: `docker-compose.override.yml`

- [ ] **Step 1: docker-compose.override.yml 생성**

다음 내용으로 `docker-compose.override.yml` 생성:

```yaml
---
services:
  # nginx 비활성화 (로컬에서는 사용하지 않음)
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

- [ ] **Step 2: 병합 결과 검증 (base + override)**

Run: `cd /Users/rupi/Colima/gillilab/itoktok && docker compose config --quiet`
Expected: 에러 없이 종료 (exit 0). `docker compose config`로 nginx에 profiles가 적용되었는지 확인.

- [ ] **Step 3: 운영 모드 검증 (base만)**

Run: `cd /Users/rupi/Colima/gillilab/itoktok && docker compose -f docker-compose.yml config --quiet`
Expected: 에러 없이 종료 (exit 0). nginx에 profiles가 없는지 확인.

- [ ] **Step 4: Commit**

```bash
git add docker-compose.override.yml
git commit -m "feat: add docker-compose.override.yml for local development

- Disable nginx locally via profiles
- Add frontend (Vite HMR on :5173) and mobile (Expo HMR on :8081)
- Override api with --reload and tests volume mount
- Use node:22-alpine with anonymous volumes for node_modules"
```

---

### Task 3: nginx.conf 업데이트 (mobile 도메인 추가)

**Files:**
- Modify: `conf/nginx.conf`

- [ ] **Step 1: mobile 서버 블록 추가 및 dev 블록 삭제**

`conf/nginx.conf`에서:

1. `itoktok-www-dev.gillilab.com` 서버 블록을 삭제 (54-65행)
2. 그 자리에 mobile 도메인 서버 블록을 추가:

```nginx
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

최종 `conf/nginx.conf`는 3개의 서버 블록을 포함:
- `itoktok-api.gillilab.com` → API 프록시 (기존 유지)
- `itoktok-www.gillilab.com` → frontend/dist (기존 유지)
- `itoktok-m.gillilab.com` → mobile/dist (신규)

- [ ] **Step 2: nginx 설정 문법 검증**

Run: `docker run --rm -v /Users/rupi/Colima/gillilab/itoktok/conf/nginx.conf:/etc/nginx/nginx.conf:ro nginx:alpine nginx -t`
Expected: `nginx: the configuration file /etc/nginx/nginx.conf syntax is ok`

- [ ] **Step 3: Commit**

```bash
git add conf/nginx.conf
git commit -m "feat: add itoktok-m.gillilab.com server block for mobile

- Serve mobile/dist at /var/www/mobile
- Remove unused itoktok-www-dev.gillilab.com server block"
```

---

### Task 4: .gitignore 업데이트

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: frontend/dist 및 mobile/dist 추가**

`.gitignore` 파일 상단의 `### Custom` 섹션 (5-6행) 뒤에 추가:

```
frontend/dist/
mobile/dist/
```

변경 후 `### Custom` 섹션:
```
### Custom
mysql/data
.src/
frontend/dist/
mobile/dist/
```

- [ ] **Step 2: git에서 기존 추적 중인 dist 파일 제거 (있는 경우)**

Run: `cd /Users/rupi/Colima/gillilab/itoktok && git ls-files frontend/dist mobile/dist`
Expected: 출력 없음 (추적 중인 파일 없음). 만약 파일이 있으면 `git rm -r --cached frontend/dist mobile/dist` 실행.

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: add frontend/dist and mobile/dist to .gitignore"
```

---

### Task 5: 레거시 파일 삭제

**Files:**
- Delete: `docker-compose.dev.yml`
- Delete: `conf/nginx.dev.conf`

- [ ] **Step 1: docker-compose.dev.yml 삭제**

Run: `cd /Users/rupi/Colima/gillilab/itoktok && git rm docker-compose.dev.yml`
Expected: `rm 'docker-compose.dev.yml'`

- [ ] **Step 2: conf/nginx.dev.conf 삭제**

Run: `cd /Users/rupi/Colima/gillilab/itoktok && git rm conf/nginx.dev.conf`
Expected: `rm 'conf/nginx.dev.conf'`

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: remove docker-compose.dev.yml and nginx.dev.conf

Replaced by docker-compose.override.yml for local development."
```

---

### Task 6: CLAUDE.md 업데이트

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Docker Compose 실행 섹션 업데이트**

`CLAUDE.md`의 `### Docker Compose 실행` 섹션 (29-44행)을 다음으로 교체:

```markdown
### Docker Compose 실행

**로컬 개발:**
```bash
docker compose up -d
# API: http://localhost:3000
# API Docs: http://localhost:3000/docs
# Frontend (Vite HMR): http://localhost:5173
# Mobile Web (Expo HMR): http://localhost:8081
```

**운영:**
```bash
docker compose -f docker-compose.yml up -d
# Frontend: http://itoktok-www.gillilab.com:8082
# Mobile: http://itoktok-m.gillilab.com:8082
# Backend API: http://itoktok-api.gillilab.com:8082
# API Docs: http://localhost:3000/docs
```

**참고:**
- 로컬: `docker-compose.override.yml`이 자동 병합되어 nginx 비활성, HMR 활성화
- 운영: `-f docker-compose.yml`로 base만 사용, nginx가 정적 파일 서빙
- 데이터베이스는 외부 MySQL 서버(AWS RDS)를 사용 (`.env`의 `CONN_URL`로 설정)
```

- [ ] **Step 2: 개발 워크플로우 섹션 업데이트**

`CLAUDE.md`의 `### 백엔드 작업` 섹션 (309-315행)에서 2번 항목을 업데이트:

변경 전:
```
2. Docker Compose로 백엔드 실행: `docker compose -f docker-compose.dev.yml up -d api`
```

변경 후:
```
2. Docker Compose로 전체 스택 실행: `docker compose up -d`
```

- [ ] **Step 3: 프론트엔드 Docker 개발 섹션 업데이트**

`CLAUDE.md`의 `### 프론트엔드 작업` 내 `**Docker 개발:**` 섹션 (323-326행)을 다음으로 교체:

변경 전:
```markdown
**Docker 개발:**
1. `pnpm build`로 빌드
2. `docker compose -f docker-compose.dev.yml up -d` 실행
3. http://localhost:2080 접속
```

변경 후:
```markdown
**Docker 개발:**
1. `docker compose up -d` 실행 (frontend 서비스 자동 포함)
2. http://localhost:5173 접속 (Vite HMR 활성)
```

- [ ] **Step 4: Nginx 설정 섹션 업데이트**

`CLAUDE.md`의 `### Nginx 설정` 섹션 (426-438행)을 다음으로 교체:

```markdown
### Nginx 설정

Nginx는 운영 환경에서만 사용되며, 도메인(server_name) 기반으로 서비스를 분리합니다.

- **설정 파일**: `conf/nginx.conf`
  - 포트: 8082 (Host) → 80 (Container)
  - `itoktok-api.gillilab.com` → `std-api:3000` (API 프록시)
  - `itoktok-www.gillilab.com` → `frontend/dist/` (데스크톱 정적 파일)
  - `itoktok-m.gillilab.com` → `mobile/dist/` (모바일 웹 정적 파일)

- **로컬 개발**: nginx 미사용, 각 서비스 직접 접속
```

- [ ] **Step 5: 프로젝트 구조 섹션 업데이트**

`CLAUDE.md`의 프로젝트 구조 트리 (239-275행)에서 다음을 변경:

1. `mobile/` 디렉토리 추가
2. `conf/nginx.dev.conf` 제거
3. `docker-compose.dev.yml` → `docker-compose.override.yml`로 변경

변경 후 하단 부분:
```markdown
├── mobile/                     # Expo 모바일 (React Native)
├── conf/                       # Nginx 설정 파일
│   └── nginx.conf             # 운영 설정
├── data/                       # 데이터 파일
├── .env                        # 백엔드 환경 변수
├── docker-compose.yml          # 운영 Docker Compose
└── docker-compose.override.yml # 로컬 개발 Docker Compose (자동 병합)
```

- [ ] **Step 6: 모바일 버전 섹션 업데이트**

`CLAUDE.md`의 `### 모바일 버전` 섹션 (193-195행)을 다음으로 교체:

```markdown
### 모바일 버전 (Expo)

모바일은 Expo 프레임워크로 구축 중이며, `mobile/` 디렉토리에 위치합니다.
로컬 개발 시 `docker compose up`으로 Expo 웹 개발 서버가 http://localhost:8081 에서 실행됩니다.
운영 시 `npx expo export --platform web`으로 빌드한 결과물이 nginx를 통해 서빙됩니다.
```

- [ ] **Step 7: 배포 섹션 업데이트**

`CLAUDE.md`의 `### 프로덕션 빌드 및 배포` 섹션 (403-417행)을 다음으로 교체:

```markdown
### 프로덕션 빌드 및 배포

```bash
# 1. 프론트엔드 빌드
cd frontend && pnpm build && cd ..

# 2. 모바일 웹 빌드
cd mobile && npx expo export --platform web && cd ..

# 3. Docker Compose로 운영 스택 실행
docker compose -f docker-compose.yml up -d

# 4. 서비스 확인
docker compose -f docker-compose.yml ps
docker compose -f docker-compose.yml logs -f
```
```

- [ ] **Step 8: 배포 후 확인 사항 업데이트**

`CLAUDE.md`의 `### 배포 후 확인 사항` 섹션 (419-424행)을 다음으로 교체:

```markdown
### 배포 후 확인 사항

1. **데스크톱 버전**: http://itoktok-www.gillilab.com:8082 접속 확인
2. **모바일 웹**: http://itoktok-m.gillilab.com:8082 접속 확인
3. **API 문서**: http://localhost:3000/docs 확인
4. 로그인 및 주요 기능 동작 테스트
5. 브라우저 콘솔에서 오류 확인
```

- [ ] **Step 9: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md for new Docker Compose structure

- Update Docker Compose commands (override-based local dev)
- Add mobile service URLs and deployment steps
- Update nginx documentation (production only, 3 domains)
- Update project structure tree"
```

---

### Task 7: 로컬 환경 검증

**Files:** (없음 — 검증만)

- [ ] **Step 1: 운영 모드 config 검증**

Run: `cd /Users/rupi/Colima/gillilab/itoktok && docker compose -f docker-compose.yml config`
Expected: nginx, api 서비스만 출력. nginx에 profiles 없음. api command에 `--reload` 없음.

- [ ] **Step 2: 로컬 모드 config 검증**

Run: `cd /Users/rupi/Colima/gillilab/itoktok && docker compose config`
Expected: nginx(profiles: [prod]), api(--reload), frontend(:5173), mobile(:8081) 서비스 출력.

- [ ] **Step 3: 로컬 모드 서비스 시작 테스트**

Run: `cd /Users/rupi/Colima/gillilab/itoktok && docker compose up -d`
Expected: api, frontend, mobile 3개 컨테이너 시작. nginx는 시작되지 않음.

- [ ] **Step 4: 각 서비스 접속 확인**

Run:
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/docs
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173
curl -s -o /dev/null -w "%{http_code}" http://localhost:8081
```
Expected: 각각 200 응답 (frontend/mobile은 초기 설치 시간 필요, 최대 60초 대기).

- [ ] **Step 5: 서비스 종료**

Run: `cd /Users/rupi/Colima/gillilab/itoktok && docker compose down`
Expected: 모든 컨테이너 정상 종료.
