---
name: ooda-trading-loop
description: >
  OODA trading loop using RTK Hermes and candlestick patterns for crypto/equities.
triggers:
  - ooda
  - trading loop
  - rtk
  - reactive trading
  - autonomous trade
---

# OODA Trading Loop

## Behavior
1. Observe: fetch market data via exchange API or skill bridge.
2. Orient: apply RTK motifs and candlestick pattern detection.
3. Decide: score signal using strategy-lab rules.
4. Act: if score > threshold, create order via bridge/freqtrade/openalgo.
5. Loop and learn from outcomes.

## Output
Signal card: direction, entry, stop, target, confidence, motif.
