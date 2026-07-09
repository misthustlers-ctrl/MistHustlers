# AWS Free Plan Deployment

This setup runs the MistHustlers public website, admin panel, API, chatbot and CRM/CMS on one private Ubuntu EC2 origin. Public traffic comes through Cloudflare Tunnel. The database stays on Supabase PostgreSQL.

Final stack:

```text
User -> Cloudflare -> Cloudflare Tunnel -> EC2 localhost:3000 -> PM2 Node.js App -> Supabase PostgreSQL
```

No Nginx, Certbot, Docker, AWS RDS, or public app ports are required.

## 1. AWS Resources

1. Launch Ubuntu 24.04 in `ap-south-1` using an eligible micro instance.
2. Use an Elastic IP only for stable SSH access if you want one. Website traffic does not use public EC2 ports.
3. Security Group inbound rules: keep only SSH `22` open, ideally restricted to your own IP.
4. Keep `80`, `443`, `3000`, `5173` and PostgreSQL `5432` closed.
5. Create an AWS Budget alert before deployment.
6. Optional: create a private S3 bucket for encrypted backups. Uploads remain local for now.

## 2. Install And Clone

```bash
sudo mkdir -p /var/www/misthustlers
sudo chown -R ubuntu:ubuntu /var/www/misthustlers
git clone https://github.com/NaveenSalve/MistHustlers.git /var/www/misthustlers
cd /var/www/misthustlers
sudo bash deploy/aws/setup-ubuntu.sh
```

If the repository files are inside a nested folder, run the remaining commands from the folder containing `package.json`.

The setup script installs Node.js 22, PM2, AWS CLI, PostgreSQL client tools for Supabase backups, Playwright browser dependencies and a 2 GB swap file for safer builds on micro instances.

## 3. Create Supabase Database

Do not install or run PostgreSQL on EC2. Create a Supabase project and copy the PostgreSQL connection string.

Use Supabase pooler URLs as:

```env
# Runtime uses transaction-mode pooler.
DATABASE_URL=postgresql://postgres.ysunzsuntpgwymwnfqmu:PASSWORD@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Prisma migrations and backups use session-mode pooler.
DIRECT_URL=postgresql://postgres.ysunzsuntpgwymwnfqmu:PASSWORD@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres
```

Keep the real URL only in `.env` on EC2.

## 4. Configure Environment

```bash
cp .env.example .env
nano .env
chmod 600 .env
```

Required production values:

```env
NODE_ENV=production
PORT=3000
HOST=127.0.0.1
TRUST_PROXY=loopback

DATABASE_URL=
DIRECT_URL=

SITE_URL=https://www.misthustlers.in
PUBLIC_SITE_URL=https://www.misthustlers.in
VITE_SITE_URL=https://www.misthustlers.in
CORS_ORIGIN=https://www.misthustlers.in,http://localhost:5173

UPLOAD_DIR=uploads
ADMIN_USERNAME=admin
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
```

Use at least 12 random characters for `ADMIN_PASSWORD` and at least 32 random characters for `ADMIN_SESSION_SECRET`. Never commit `.env`.

## 5. Build And Start With PM2

```bash
bash deploy/aws/deploy.sh
pm2 startup
```

Run the command printed by `pm2 startup`, then run:

```bash
pm2 save
```

The application binds only to `127.0.0.1:3000`; it is not directly reachable from the internet.

## 6. Connect Cloudflare Tunnel

1. Add `misthustlers.in` to Cloudflare and replace registrar nameservers with Cloudflare nameservers.
2. In Cloudflare Zero Trust, open **Networks > Tunnels**.
3. Create a named tunnel such as `misthustlers-aws`.
4. Select the Debian connector.
5. On EC2 run:

```bash
cd /var/www/misthustlers
sudo bash deploy/aws/setup-cloudflare-tunnel.sh
```

Paste only the named tunnel token when asked. Do not save the token in Git or `.env`.

In the tunnel's **Public Hostnames**, add:

```text
www.misthustlers.in  -> HTTP -> localhost:3000
misthustlers.in      -> HTTP -> localhost:3000
```

Remove conflicting old `A`, `AAAA`, or `CNAME` records for `@` and `www`. Do not use a temporary `trycloudflare.com` Quick Tunnel for production.

Recommended Cloudflare settings:

```text
Always Use HTTPS: On
Universal SSL: On
Minimum TLS: 1.2 or higher
Cache bypass: /api/* and /admin*
Bot Fight Mode: On if available
Free DDoS protection: On by default
```

Cloudflare remains invisible to visitors; SEO metadata, forms and admin continue using `https://www.misthustlers.in`.

## 7. Local Uploads

Uploads currently stay on EC2 local storage under `backend/uploads`.

Rules:

```text
Do not commit uploads to Git.
Do not delete backend/uploads during deployment.
Back up uploads before each update.
Move uploads to AWS S3 later when traffic grows.
```

## 8. Health Checks

```bash
curl http://127.0.0.1:3000/api/health
curl https://www.misthustlers.in/api/health
pm2 status
pm2 logs misthustlers --lines 100
sudo systemctl is-active cloudflared
```

Also verify `/`, `/admin`, form submission, chatbot, image upload and image reload.

## 9. Backups

The backup script uses `pg_dump` against Supabase and archives local uploads.

Manual backup:

```bash
bash deploy/aws/backup.sh
```

Optional S3 backup target in `.env`:

```env
BACKUP_S3_URI=s3://YOUR_PRIVATE_BUCKET/misthustlers
```

Daily cron:

```bash
crontab -e
0 2 * * * cd /var/www/misthustlers && bash deploy/aws/backup.sh >> /var/log/misthustlers-backup.log 2>&1
```

## 10. Updates

Manual update:

```bash
cd /var/www/misthustlers
bash deploy/aws/backup.sh
git pull --ff-only
bash deploy/aws/deploy.sh
```

Every deploy does:

```text
validate env -> install deps -> build -> backup -> Prisma migrate deploy
-> Prisma migrate status -> PM2 reload -> local health check -> optional Cloudflare cache purge
```

For automatic cache purge, create a Cloudflare API token restricted to this zone with only `Zone.Cache Purge` permission, then set both `CLOUDFLARE_ZONE_ID` and `CLOUDFLARE_API_TOKEN` in `.env`.

## 11. Before Free Period Ends

Before your AWS free period ends:

```text
Export Supabase database backup.
Download backend/uploads backup.
Download optional S3 backups.
Move to a cheaper server or stop/terminate EC2.
```

Never delete `.env`, `backend/uploads`, Supabase backups or S3 backups during cleanup.
