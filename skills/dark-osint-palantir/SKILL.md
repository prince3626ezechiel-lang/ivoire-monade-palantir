---
name: dark-osint-palantir
description: >
  Sovereign OSINT + Dark Ops ingestion. Use for YouTube/Facebook/Reddit/Telegram
  surveillance, Google dorks, archive fallback, correlation, and revenue-signal detection.
triggers:
  - palantir
  - osint
  - dark ops
  - dork
  - facebook osint
  - youtube osint
  - telegram osint
  - revenue signal
---

# Dark OSINT Palantir

Sovereign OSINT stack for IVOIRE MONADE OBM/trading intelligence.

## Behavior
1. Run dorks against target URLs and platforms.
2. If blocked (403/geo/age-gate), fallback via:
   - web_search dorks
   - web_extract archive or headless browser
3. Normalize findings: title, author, engagement, timestamp, URL.
4. Store critical signals in holographic memory with tags: `osint`, `revenue`, `trading`, `obm`.
5. If revenue/trading signal detected, trigger Telegram alert via n8n.

## Revenue readiness
Score 4 dimensions 0-1 each: `signal_diversity`, `freshness`, `actionability`, `autonomy`.
When all >= 0.75, status = `revenue_ready=true`.

## Output
- Markdown brief: sources, findings, scores
- Memory: critical signals only
- Cron output: Telegram if actionable
