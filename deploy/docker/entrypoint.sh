#!/usr/bin/env sh
set -eu

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required."
  exit 1
fi

if [ -z "${DIRECT_URL:-}" ]; then
  echo "DIRECT_URL is required."
  exit 1
fi

if [ -z "${ADMIN_USERNAME:-}" ] || [ -z "${ADMIN_PASSWORD:-}" ]; then
  echo "ADMIN_USERNAME and ADMIN_PASSWORD are required."
  exit 1
fi

cd /app/backend

mkdir -p "${UPLOAD_DIR:-uploads}" data

node scripts/resolve-service-packages-migration.js || true
node scripts/ensure-chatbot-config.js
npx prisma migrate deploy
node scripts/sync-service-packages.js
node scripts/sync-home-hero.js

exec node server.js
