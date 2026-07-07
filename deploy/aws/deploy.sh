#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f .env ]]; then
  echo "Missing .env. Copy .env.example to .env and configure it first."
  exit 1
fi

ln -sfn ../.env backend/.env
mkdir -p backend/uploads

node --env-file=.env scripts/validate-production-env.mjs

npm run install:all
npx playwright install chromium
npm run build:aws
bash deploy/aws/backup.sh
npm run db:deploy
npm run db:status

pm2 startOrReload ecosystem.config.cjs --update-env
pm2 save

curl --fail --silent --show-error http://127.0.0.1:9000/api/health
echo
bash deploy/aws/purge-cloudflare-cache.sh
echo "Deployment complete."
