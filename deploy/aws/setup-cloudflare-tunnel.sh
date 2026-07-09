#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Run with sudo and pass the tunnel token through the environment."
  echo "Example: sudo TUNNEL_TOKEN='...' bash deploy/aws/setup-cloudflare-tunnel.sh"
  exit 1
fi

if [[ -z "${TUNNEL_TOKEN:-}" ]]; then
  if [[ -t 0 ]]; then
    read -r -s -p "Paste the named Cloudflare Tunnel token: " TUNNEL_TOKEN
    echo
  else
    echo "TUNNEL_TOKEN is required. Create a named tunnel in Cloudflare Zero Trust first."
    exit 1
  fi
fi

install -d -m 0755 /usr/share/keyrings
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | gpg --dearmor --yes -o /usr/share/keyrings/cloudflare-main.gpg
echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main" > /etc/apt/sources.list.d/cloudflared.list
apt-get update
apt-get install -y cloudflared

if systemctl list-unit-files cloudflared.service >/dev/null 2>&1; then
  cloudflared service uninstall >/dev/null 2>&1 || true
fi

cloudflared service install "$TUNNEL_TOKEN"
systemctl enable --now cloudflared
systemctl is-active --quiet cloudflared

unset TUNNEL_TOKEN
echo "Cloudflare Tunnel installed. Keep ports 80, 443, 3000 and 5432 closed in the AWS Security Group."
