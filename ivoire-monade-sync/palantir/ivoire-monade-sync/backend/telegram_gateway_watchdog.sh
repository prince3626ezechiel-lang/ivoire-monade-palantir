#!/usr/bin/env bash
set -euo pipefail
while true; do
  echo "[watchdog] starting telegram_gateway"
  cd /opt/ivoire-monade/backend
  python3 telegram_gateway.py > /tmp/telegram-gateway.log 2>&1 || true
  echo "[watchdog] telegram_gateway exited, restarting in 2s"
  sleep 2
done
