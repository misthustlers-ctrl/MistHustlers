# Docker Deployment

This runs the MistHustlers website, admin panel, API, chatbot and CRM/CMS in one Docker container. Supabase PostgreSQL remains external.

## 1. Prepare `.env`

Create `.env` from the template and fill real secrets:

```bash
cp .env.example .env
nano .env
```

Required values:

```env
DATABASE_URL=
DIRECT_URL=
ADMIN_USERNAME=admin
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
VITE_SITE_URL=https://www.misthustlers.in
CORS_ORIGIN=https://www.misthustlers.in,http://localhost:5173
```

For Docker, the compose file overrides:

```env
PORT=3000
HOST=0.0.0.0
TRUST_PROXY=1
```

Do not commit `.env`.

## 2. Build And Run

```bash
docker compose up -d --build
docker compose logs -f app
```

The app is published only on the server itself:

```text
http://127.0.0.1:3000
```

This is intentional. Cloudflare Tunnel or a local reverse proxy should connect to `localhost:3000`.

## 3. Cloudflare Tunnel

Recommended: create a named tunnel in Cloudflare Zero Trust and point public hostnames to:

```text
www.misthustlers.in  -> HTTP -> localhost:3000
misthustlers.in      -> HTTP -> localhost:3000
```

If you want Cloudflare Tunnel inside Docker, add this to `.env`:

```env
CLOUDFLARE_TUNNEL_TOKEN=your-named-tunnel-token
```

Then run:

```bash
docker compose -f docker-compose.yml -f docker-compose.cloudflare.yml --profile tunnel up -d --build
```

## 4. Updates

```bash
git pull --ff-only
docker compose up -d --build
docker image prune -f
```

The container entrypoint runs:

```text
chatbot config repair -> Prisma migrate deploy -> CMS service package sync -> home content sync -> server start
```

## 5. Persistent Files

Uploads and runtime JSON files are stored in Docker volumes:

```text
misthustlers_uploads
misthustlers_data
```

Back them up before deleting Docker volumes.
