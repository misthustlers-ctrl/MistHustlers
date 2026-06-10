#!/usr/bin/env bash
set -e

echo "=== Installing backend dependencies ==="
cd backend
npm install

echo "=== Generating Prisma client ==="
npx prisma generate

echo "=== Building admin UI ==="
VITE_ADMIN_USERNAME="${ADMIN_USERNAME:-admin}" \
VITE_ADMIN_PASSWORD="${ADMIN_PASSWORD:-admin}" \
npm run build-admin

echo "=== Installing frontend dependencies ==="
cd ..
npm install

echo "=== Building frontend ==="
npm run build

echo "=== Done ==="
