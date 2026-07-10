---
name: nla-lotto-signal
description: >
  Ghana NLA lottery signal automation. Use when the user references GW Online GH,
  Lucky Tuesday/Thursday, NLA Bankers, 2-Sure, lotto, lottery predictions,
  or self-funding via lottery.
---

# NLA Lotto Signal Automation

## Source Signal
- GW Online GH: Lucky Tuesday, Lucky Thursday, Fortune Thursday
- Format: Bankers, 2-Sure, Machine numbers, permutations

## Workflow
1. Capture prediction screenshots
2. Extract numbers: Banker, 2-Sure, Machine, Perm
3. Log to revenue ledger as `lotto_signal`
4. Alert via Telegram when high-confidence signal detected

## Integration
- Revenue ledger: `/root/.hermes/scripts/revenue-ledger/revenue.json`
- Telegram gateway: `127.0.0.1:17832`
- Vision tool: extract numbers from screenshots

## Revenue Path
- Track lotto bets as micro-investment
- Target: self-fund Hermes stack + OBM costs
- Status: `lotto_revenue_evolving` until proven
