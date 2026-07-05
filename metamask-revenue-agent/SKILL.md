---
name: metamask-revenue-agent
description: >
  MetaMask payment bridge for Hermes agent services. Use when receiving or
  sending crypto payments, scanning wallet balances, or automating revenue
  collection for OBM/trading signals.
triggers:
  - metamask
  - wallet revenue
  - usd revenue
  - crypto payment
  - ethereum balance
---

# MetaMask Revenue Agent

Bridge Hermes services to MetaMask for automated crypto revenue.

## Behavior
1. Load wallet seed from GPG-encrypted secret store.
2. Derive address with Ethereum ABI.
3. Query public RPC for ETH/USDT/USDC balance.
4. When balance >= $28 equivalent, mark `revenue_ready=true` and notify Telegram.
5. If service payment detected, confirm transaction hash and record revenue.

## Safety
- Never expose private keys in logs.
- Minimum confirmation: 12 blocks.
- Max gas: standard tracked via public RPC.

## Output
Wallet status JSON + revenue alert if threshold reached.
