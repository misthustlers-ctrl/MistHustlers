#!/usr/bin/env bash
set -euo pipefail
umask 077

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$ROOT_DIR/backups}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"

cd "$ROOT_DIR"
set -a
source .env
set +a
mkdir -p "$BACKUP_DIR"

PG_DUMP_URL="$(node -e 'const url = new URL(process.env.DIRECT_URL || process.env.DATABASE_URL); url.searchParams.delete("schema"); url.searchParams.delete("pgbouncer"); process.stdout.write(url.toString())')"
pg_dump "$PG_DUMP_URL" --format=custom --file="$BACKUP_DIR/database-$STAMP.dump"
tar -czf "$BACKUP_DIR/uploads-$STAMP.tar.gz" -C backend "${UPLOAD_DIR:-uploads}"
find "$BACKUP_DIR" -type f -mtime +14 -delete

if [[ -n "${BACKUP_S3_URI:-}" ]]; then
  aws s3 sync "$BACKUP_DIR" "$BACKUP_S3_URI" --sse AES256 --only-show-errors
fi

echo "Backup completed: $BACKUP_DIR"
