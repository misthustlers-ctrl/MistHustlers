#!/usr/bin/env bash
# MistHustlers App - Unix start script
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)/misthustlers-merged-app"

echo "[MistHustlers] Starting Backend..."
(cd "$ROOT_DIR/backend" && node --watch server.js &)

sleep 3

echo "[MistHustlers] Starting Frontend..."
(cd "$ROOT_DIR" && npx vite &)

sleep 2
echo "[MistHustlers] Both servers started!"
echo "  Backend  : http://localhost:5000"
echo "  Frontend : http://localhost:5173"
