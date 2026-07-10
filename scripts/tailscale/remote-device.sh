#!/usr/bin/env bash
set -euo pipefail
API_KEY="$(gpg --quiet --decrypt /root/.gpg/tailscale-secrets.json.gpg 2>/dev/null | python3 -c 'import sys,json; print(json.load(sys.stdin)["tailscale"]["api_key"])')"
export HISTFILE=/dev/null
unset HISTFILE
AUTH_KEY="$(gpg --quiet --decrypt /root/.gpg/tailscale-secrets.json.gpg 2>/dev/null | python3 -c 'import sys,json; print(json.load(sys.stdin)["tailscale"]["auth_key"])')" || true
if [ -n "${AUTH_KEY}" ]; then
  tailscale up --authkey="${AUTH_KEY}" --accept-risk=lose-ssh --reset || true
else
  echo '{"status":"error","detail":"no_auth_key"}'
  exit 1
fi
