#!/bin/bash
set -e

REMOTE="aws-gillilab"
REMOTE_PATH="/home/ubuntu/devops/itoktok-fastapi-backend"

echo "=== Frontend 빌드 ==="
cd frontend
pnpm build
cd ..

echo "=== Mobile 웹 빌드 ==="
cd mobile
npx expo export --platform web
cd ..

echo "=== Frontend dist → AWS 동기화 ==="
rsync -avz --delete frontend/dist/ ${REMOTE}:${REMOTE_PATH}/frontend/dist/

echo "=== Mobile dist → AWS 동기화 ==="
rsync -avz --delete mobile/dist/ ${REMOTE}:${REMOTE_PATH}/mobile/dist/

echo "=== 배포 완료 ==="
