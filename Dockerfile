# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS deps
WORKDIR /app

COPY package*.json ./
COPY backend/package*.json backend/
COPY backend/admin-ui/package*.json backend/admin-ui/

RUN npm ci \
  && npm --prefix backend ci \
  && npm --prefix backend/admin-ui ci

FROM deps AS builder
WORKDIR /app

COPY . .

RUN npx playwright install --with-deps chromium \
  && npm run build:aws \
  && npm prune --prefix backend --omit=dev \
  && rm -rf backend/admin-ui/node_modules node_modules

FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0 \
    TRUST_PROXY=1 \
    UPLOAD_DIR=uploads

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl openssl \
  && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

COPY --from=builder /app/backend/package*.json ./backend/
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/server.js ./backend/server.js
COPY --from=builder /app/backend/config ./backend/config
COPY --from=builder /app/backend/controllers ./backend/controllers
COPY --from=builder /app/backend/middleware ./backend/middleware
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/backend/routes ./backend/routes
COPY --from=builder /app/backend/scripts ./backend/scripts
COPY --from=builder /app/backend/services ./backend/services
COPY --from=builder /app/backend/admin-ui/dist ./backend/admin-ui/dist

COPY deploy/docker/entrypoint.sh /usr/local/bin/misthustlers-entrypoint
RUN chmod +x /usr/local/bin/misthustlers-entrypoint \
  && mkdir -p /app/backend/uploads /app/backend/data \
  && chown -R node:node /app

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 \
  CMD curl --fail --silent http://127.0.0.1:3000/api/health >/dev/null || exit 1

ENTRYPOINT ["misthustlers-entrypoint"]
