# 환경 설정 파일 일관성 정리 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** API, Frontend, Mobile의 환경 설정 파일을 `.env.example` + `.env.{development,production}` 패턴으로 통일하고, 민감 정보를 git에서 제거한다.

**Architecture:** 각 서비스별 `.env.example`(git 추적, placeholder 값)을 생성하고, 실제 값이 담긴 `.env.development`/`.env.production`은 `.gitignore`로 제외한다. Docker Compose에서 `env_file`로 환경별 파일을 지정한다. Frontend의 `VITE_API_BASE_URL`을 `VITE_API_URL`로 리네이밍한다.

**Tech Stack:** Docker Compose, Vite, Expo, FastAPI

---

### Task 1: .env.example 파일 3개 생성

**Files:**
- Create: `.env.example`
- Create: `frontend/.env.example`
- Create: `mobile/.env.example`

- [ ] **Step 1: API .env.example 생성**

`.env.example` 파일을 루트에 생성:

```bash
# Database
CONN_URL=mysql+pymysql://user:password@host:port/database

# JWT
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

- [ ] **Step 2: Frontend .env.example 생성**

`frontend/.env.example` 파일 생성:

```bash
VITE_API_URL=http://localhost:3000
VITE_TOKEN_KEY=access_token
```

- [ ] **Step 3: Mobile .env.example 생성**

`mobile/.env.example` 파일 생성:

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_TOKEN_KEY=access_token
```

- [ ] **Step 4: Commit**

```bash
git add .env.example frontend/.env.example mobile/.env.example
git commit -m "chore: add .env.example templates for all services

- API: CONN_URL, JWT settings
- Frontend: VITE_API_URL, VITE_TOKEN_KEY
- Mobile: EXPO_PUBLIC_API_URL, EXPO_PUBLIC_TOKEN_KEY"
```

---

### Task 2: API 환경 파일 분리 (.env → .env.development + .env.production)

**Files:**
- Create: `.env.development`
- Create: `.env.production`
- Delete: `.env`

- [ ] **Step 1: .env.development 생성**

현재 `.env` 내용을 `.env.development`로 복사:

```bash
cp .env .env.development
```

- [ ] **Step 2: .env.production 생성**

`.env.production` 파일 생성 (운영 값으로 편집 — 현재는 개발과 동일한 DB를 사용하므로 동일 값, 나중에 운영 DB로 변경):

```bash
cp .env .env.production
```

- [ ] **Step 3: 기존 .env를 git에서 제거**

Run: `cd /Users/rupi/Colima/gillilab/itoktok && git rm .env`
Expected: `rm '.env'`

- [ ] **Step 4: Commit**

```bash
git commit -m "refactor: split API .env into .env.development and .env.production

- .env.development for local dev
- .env.production for AWS deployment
- Remove .env from git tracking"
```

주의: `.env.development`와 `.env.production`은 아직 git add 하지 않음 (Task 5에서 .gitignore 설정 후 확인).

---

### Task 3: Frontend 환경 파일 정리 (변수명 변경 + 주석 수정)

**Files:**
- Modify: `frontend/.env.development`
- Modify: `frontend/.env.production`
- Modify: `frontend/src/api/interceptors.js:9-10`

- [ ] **Step 1: frontend/.env.development 수정**

`frontend/.env.development` 전체를 다음으로 교체:

```bash
VITE_API_URL=http://localhost:3000
VITE_TOKEN_KEY=access_token
```

변경점: `VITE_API_BASE_URL` → `VITE_API_URL`, `//` 주석 제거

- [ ] **Step 2: frontend/.env.production 수정**

`frontend/.env.production` 전체를 다음으로 교체:

```bash
VITE_API_URL=https://itoktok-api.gillilab.com
VITE_TOKEN_KEY=access_token
```

변경점: `VITE_API_BASE_URL` → `VITE_API_URL`

- [ ] **Step 3: interceptors.js 변수명 변경**

`frontend/src/api/interceptors.js`의 9-10행을 수정:

변경 전:
```javascript
if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
```

변경 후:
```javascript
if (import.meta.env.VITE_API_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL
```

- [ ] **Step 4: frontend 환경 파일을 git에서 제거**

Run: `cd /Users/rupi/Colima/gillilab/itoktok && git rm --cached frontend/.env.development frontend/.env.production`
Expected: `rm 'frontend/.env.development'` 및 `rm 'frontend/.env.production'`

- [ ] **Step 5: Commit**

```bash
git add frontend/src/api/interceptors.js
git commit -m "refactor: rename VITE_API_BASE_URL to VITE_API_URL

- Update interceptors.js reference
- Fix .env.development comment syntax (// → removed)
- Remove frontend env files from git tracking"
```

---

### Task 4: Mobile 환경 파일 정리

**Files:**
- Modify: (없음 — mobile/.env 내용 유지)

- [ ] **Step 1: mobile 환경 파일을 git에서 제거**

Run: `cd /Users/rupi/Colima/gillilab/itoktok && git rm --cached mobile/.env mobile/.env.production`
Expected: `rm 'mobile/.env'` 및 `rm 'mobile/.env.production'`

- [ ] **Step 2: Commit**

```bash
git commit -m "chore: remove mobile env files from git tracking

Mobile uses .env (dev) + .env.production (prod) following Expo defaults."
```

---

### Task 5: Docker Compose env_file 변경

**Files:**
- Modify: `docker-compose.yml`
- Modify: `docker-compose.override.yml`

- [ ] **Step 1: docker-compose.yml의 env_file 변경**

`docker-compose.yml`에서 api 서비스의 `env_file` 변경:

변경 전:
```yaml
    env_file: ./.env
```

변경 후:
```yaml
    env_file: ./.env.production
```

- [ ] **Step 2: docker-compose.override.yml에 env_file 추가**

`docker-compose.override.yml`의 api 서비스에 `env_file` 추가:

변경 전:
```yaml
  api:
    command: poetry run uvicorn app.main:app --host 0.0.0.0 --port 3000 --reload
    volumes:
```

변경 후:
```yaml
  api:
    command: poetry run uvicorn app.main:app --host 0.0.0.0 --port 3000 --reload
    env_file: ./.env.development
    volumes:
```

- [ ] **Step 3: 설정 검증**

Run: `cd /Users/rupi/Colima/gillilab/itoktok && docker compose config --quiet && docker compose -f docker-compose.yml config --quiet && echo "OK"`
Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add docker-compose.yml docker-compose.override.yml
git commit -m "refactor: use env-specific files in Docker Compose

- Production: env_file: .env.production
- Development: env_file: .env.development (via override)"
```

---

### Task 6: .gitignore 업데이트

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: 환경 파일 제외 규칙 추가**

`.gitignore`의 `### Custom` 섹션에 추가:

변경 전:
```
### Custom
mysql/data
.src/
frontend/dist/
mobile/dist/
```

변경 후:
```
### Custom
mysql/data
.src/
frontend/dist/
mobile/dist/

# 환경 설정 파일 (민감 정보)
.env.development
.env.production
frontend/.env.development
frontend/.env.production
mobile/.env
mobile/.env.production
```

- [ ] **Step 2: 기존 .env 규칙 확인**

`.gitignore`에 이미 `.env` 항목이 있는지 확인. 130행 근처에 `.env`가 있으므로 루트 `.env`는 이미 제외됨. 추가 작업 불필요.

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: add all env files to .gitignore

Exclude .env.development, .env.production for API/Frontend/Mobile.
Only .env.example files are tracked in git."
```

---

### Task 7: 문서 업데이트 (CLAUDE.md, frontend/CLAUDE.md)

**Files:**
- Modify: `CLAUDE.md`
- Modify: `frontend/CLAUDE.md`

- [ ] **Step 1: CLAUDE.md 환경 변수 섹션 업데이트**

`CLAUDE.md`의 `## 환경 변수` 섹션에서:

1. `### 백엔드 (.env)` 제목을 `### 백엔드 (.env.development / .env.production)` 으로 변경

2. 해당 섹션의 설명을 업데이트:

변경 전:
```markdown
루트 디렉토리의 `.env` 파일:
```

변경 후:
```markdown
루트 디렉토리의 `.env.development` (로컬) / `.env.production` (운영) 파일:
```

3. `### 프론트엔드` 섹션에서 `VITE_API_BASE_URL` → `VITE_API_URL` 변경:

변경 전:
```
VITE_API_BASE_URL=http://localhost:2080
```

변경 후:
```
VITE_API_URL=http://localhost:3000
```

그리고:
```
VITE_API_BASE_URL=http://itoktok-api.gillilab.com
```
→
```
VITE_API_URL=https://itoktok-api.gillilab.com
```

- [ ] **Step 2: frontend/CLAUDE.md 업데이트**

`frontend/CLAUDE.md`에서 `VITE_API_BASE_URL` 참조를 `VITE_API_URL`로 변경.

`## 환경 설정` 섹션:

변경 전:
```markdown
- `VITE_API_BASE_URL`: 백엔드 API 기본 URL
```

변경 후:
```markdown
- `VITE_API_URL`: 백엔드 API 기본 URL
```

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md frontend/CLAUDE.md
git commit -m "docs: update env variable references in CLAUDE.md files

- VITE_API_BASE_URL → VITE_API_URL
- Document .env.development / .env.production split
- Update example URLs"
```

---

### Task 8: 검증

**Files:** (없음 — 검증만)

- [ ] **Step 1: git에 민감 파일이 없는지 확인**

Run:
```bash
cd /Users/rupi/Colima/gillilab/itoktok && git ls-files | grep -E '\.env($|\.development|\.production)' | grep -v example
```
Expected: 출력 없음 (모든 실제 env 파일이 git에서 제거됨)

- [ ] **Step 2: .env.example 파일이 git에 있는지 확인**

Run:
```bash
cd /Users/rupi/Colima/gillilab/itoktok && git ls-files | grep example
```
Expected:
```
.env.example
frontend/.env.example
mobile/.env.example
```

- [ ] **Step 3: Docker Compose config 검증**

Run:
```bash
cd /Users/rupi/Colima/gillilab/itoktok && docker compose config 2>&1 | grep env_file
docker compose -f docker-compose.yml config 2>&1 | grep env_file
```
Expected: 로컬은 `.env.development`, 운영은 `.env.production` 표시

- [ ] **Step 4: Frontend 변수 참조 확인**

Run:
```bash
cd /Users/rupi/Colima/gillilab/itoktok && grep -r "VITE_API_BASE_URL" frontend/src/
```
Expected: 출력 없음 (모든 참조가 `VITE_API_URL`로 변경됨)
