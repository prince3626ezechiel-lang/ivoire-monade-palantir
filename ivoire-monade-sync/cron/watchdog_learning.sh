#!/usr/bin/env bash
set -euo pipefail
LOG=/opt/ivoire-monade/logs/learning-watchdog.log
TS=$(date -Iseconds)
echo "[$TS] learning watchdog running" >> "$LOG"
for f in /opt/ivoire-monade/scripts/scaling_insight.py /opt/ivoire-monade/scripts/maxwell_autodream.py /opt/ivoire-monade/scripts/training_analyzer.py; do
  if [ -f "$f" ]; then
    ( cd /opt/ivoire-monade && python3 "$f" >> "$LOG" 2>&1 ) || true
  fi
done
