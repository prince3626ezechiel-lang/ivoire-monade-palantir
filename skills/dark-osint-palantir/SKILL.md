---
name: dark-osint-palantir
description: >
  Sovereign OSINT + Dark Ops ingestion skill. Use for YouTube/Facebook/Reddit/Telegram
  surveillance, Google dorks, archive fallback, correlation, and revenue-signal detection.
  Designed to operate under 8-minute evolutionary cycles.
triggers:
  - palantir
  - osint
  - dark ops
  - dork
  - facebook osint
  - youtube osint
  - telegram osint
  - revenue signal
  - money signal
---

# Dark OSINT Palantir

Sovereign OSINT stack for IVOIRE MONADE OBM/trading intelligence.

## Behavior
1. Run dork queries against target URLs and platforms.
2. If direct fetch blocked (403/geo/age-gate), fallback to:
   - `web_search` with dork operators
   - `web_extract` archive/headless browser fallback
3. Normalize findings to Markdown: title, author, engagement, timestamp, URL.
4. Store critical signals in holographic memory with tags: `osint`, `revenue`, `trading`, `obm`.
5. If revenue/trading signal detected, trigger Telegram alert via MCP/n8n workflow.

## Revenue readiness evaluation
After each 8-minute cycle, self-score:
- Signal diversity: number of distinct platforms yielding data
- Freshness: ratio of new vs cached findings
- Actionability: conversions to deals/trades in last 7 days
- Autonomy: fraction needing human intervention

When all four ≥ 0.75, mark `revenue_ready=true`.

## Output
- Markdown brief: sources, findings, scores
- Memory: critical signals only
- Cron output: Telegram if actionable
