# AWS Free Plan Deployment

This deployment runs the public site, admin panel, API and PostgreSQL on one Ubuntu EC2 instance. It is intended for the six-month AWS Free Plan and low traffic.

## 1. AWS resources

1. Launch Ubuntu 24.04 in `ap-south-1` using an eligible micro instance.
2. Allocate an Elastic IP for stable SSH/outbound access. The website itself will use an outbound Cloudflare Tunnel.
3. Security Group inbound rules: SSH `22` from your IP only. Keep `80`, `443`, `9000` and PostgreSQL `5432` closed.
4. Create an S3 bucket for encrypted backups. Block all public access.
5. Create an AWS Budget alert before deployment.

## 2. Install and clone

```bash
sudo mkdir -p /var/www/misthustlers
sudo chown -R ubuntu:ubuntu /var/www/misthustlers
git clone https://github.com/NaveenSalve/MistHustlers.git /var/www/misthustlers
cd /var/www/misthustlers
sudo bash deploy/aws/setup-ubuntu.sh
```

If the repository files are inside a nested folder, run the remaining commands from the folder containing `package.json`.

## 3. Create PostgreSQL database

Replace both passwords with a strong generated value and use the same value in `.env`.

```bash
sudo -u postgres psql
CREATE USER misthustlers WITH ENCRYPTED PASSWORD 'REPLACE_WITH_STRONG_PASSWORD';
CREATE DATABASE misthustlers OWNER misthustlers;
\q
```

## 4. Configure environment

```bash
cp .env.example .env
nano .env
chmod 600 .env
```

Set strong values for `DATABASE_URL`, `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`. Keep `UPLOAD_DIR=uploads`. SMTP and Google Sheets are optional.

Use at least 12 random characters for the admin password and at least 32 random characters for the session secret. Quote values containing shell-special characters. The deployment script rejects missing, weak or placeholder production values.

## 5. Build and start the private origin

The 2 GB swap created by setup protects a micro instance during Vite/Playwright builds. Before migrations, deployment validates the environment and creates a restricted local database/media backup.

```bash
bash deploy/aws/deploy.sh
pm2 startup
```

Run the command printed by `pm2 startup`, then run `pm2 save` once more.

The application binds only to `127.0.0.1:9000`; it is not directly reachable from the internet.

## 6. Connect the permanent Cloudflare domain

1. Add `misthustlers.in` to Cloudflare and replace the registrar nameservers with the two nameservers Cloudflare provides.
2. In Cloudflare Zero Trust, open **Networks > Tunnels**, create a named tunnel such as `misthustlers-aws`, and select the Debian connector.
3. On EC2 run the command below. Paste only the tunnel token when the hidden prompt appears; do not save it in Git or `.env`.

```bash
cd /var/www/misthustlers
sudo bash deploy/aws/setup-cloudflare-tunnel.sh
```

4. In the tunnel's **Public Hostnames**, add both entries:

```text
www.misthustlers.in  -> HTTP -> localhost:9000
misthustlers.in      -> HTTP -> localhost:9000
```

5. Remove conflicting old `A`, `AAAA`, or `CNAME` records for `@` and `www`. Do not use a temporary `trycloudflare.com` Quick Tunnel.
6. Enable **Always Use HTTPS**, keep Universal SSL enabled, and set minimum TLS to 1.2.
7. Create cache bypass rules for `/api/*` and `/admin*`. Static hashed JS/CSS/images may be cached.
8. Enable the Free-plan DDoS protections and Bot Fight Mode available in your Cloudflare dashboard.

Cloudflare remains invisible to visitors; the browser, SEO metadata and admin continue using `https://www.misthustlers.in`.

## 7. Domain and checks

```bash
curl https://www.misthustlers.in/api/health
pm2 status
pm2 logs misthustlers --lines 100
sudo systemctl is-active cloudflared
```

Verify `/`, `/admin`, a form submission, an image upload and an image reload.

## 8. Backups

Attach an IAM role that can write only to the private backup bucket. Add this to `.env`:

```text
BACKUP_S3_URI=s3://YOUR_PRIVATE_BUCKET/misthustlers
```

Test `bash deploy/aws/backup.sh`, then schedule it:

```bash
crontab -e
0 2 * * * cd /var/www/misthustlers && bash deploy/aws/backup.sh >> /var/log/misthustlers-backup.log 2>&1
```

## 9. Automatic GitHub deployment

Before pushing this workflow, add these GitHub repository secrets under **Settings > Secrets and variables > Actions**:

| Secret | Value |
|---|---|
| `AWS_EC2_HOST` | Elastic IP or trusted SSH hostname |
| `AWS_EC2_USER` | Usually `ubuntu` |
| `AWS_APP_PATH` | `/var/www/misthustlers` |
| `AWS_SSH_PRIVATE_KEY` | Dedicated deployment private key |
| `AWS_KNOWN_HOSTS` | Verified EC2 SSH host-key line |

Use a dedicated SSH deployment key, not your personal key. Add its public key to `/home/ubuntu/.ssh/authorized_keys`. Obtain the host key from a trusted first connection and compare its fingerprint with the EC2 host before storing it as `AWS_KNOWN_HOSTS`.

Every push to `main` will now:

```text
verify build -> SSH to EC2 -> git pull --ff-only -> validate env
-> backup -> migrate -> PM2 reload -> local health check -> public health check
```

For automatic cache purge, create a Cloudflare API token restricted to this zone with only `Zone.Cache Purge` permission, then set both `CLOUDFLARE_ZONE_ID` and `CLOUDFLARE_API_TOKEN` in the EC2 `.env`. They are optional; hashed assets work safely without them.

## 10. Manual updates and rollback

Create a database backup before every update.

```bash
cd /var/www/misthustlers
bash deploy/aws/backup.sh
git pull --ff-only
bash deploy/aws/deploy.sh
```

Never delete `.env`, `backend/uploads`, PostgreSQL data or S3 backups during cleanup. Before the six-month period ends, export the database and media and either migrate or terminate the AWS resources.
