#!/usr/bin/env bash
set -euo pipefail
while true; do
  ts=$(date -u +%Y-%m-%dT%H:%M:%SZ)
  if bash /opt/ivoire-monade/scripts/ooda_tick.sh >/tmp/ooda_tick.log 2>&1; then
    echo "[${ts}] OK"
  else
    echo "[${ts}] FAIL" >&2
  fi
  sleep 8
done
