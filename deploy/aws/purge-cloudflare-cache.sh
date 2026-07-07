#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

if [[ -f .env ]]; then
  set -a
  source .env
  set +a
fi

if [[ -z "${CLOUDFLARE_ZONE_ID:-}" || -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  echo "Cloudflare cache purge skipped: credentials not configured."
  exit 0
fi

response="$(curl --fail --silent --show-error \
  --request POST "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache" \
  --header "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  --header "Content-Type: application/json" \
  --data '{"purge_everything":true}')"

node -e 'const result = JSON.parse(process.argv[1]); if (!result.success) { console.error(result.errors); process.exit(1); }' "$response"
echo "Cloudflare cache purged."
