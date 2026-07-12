---
title: CCXT MCP Server
description: "Hermes skill: use ccxt-mcp to query crypto prices, balances, order books, and execute trades."
metadata:
  - trading
  - crypto
  - ccxt
  - mcp
---

# CCXT MCP Server

Connect Hermes to crypto exchanges via CCXT MCP.

## URL
https://github.com/lazy-dinosaur/ccxt-mcp

## What it does
- Price/orderbook/balance/ticker queries across 100+ exchanges
- Trade/order operations via CCXT unified API

## Constraints
- paper-first unless user asks live trading
- show only normalized fields; no raw secrets
- one exchange per run unless user requests multi-exchange arb

## Usage
1) Launch the CCXT MCP server locally (port or stdio).
2) Call listing/ticker/orderbook tools.
3) For execution, confirm exchange, symbol, size, and type first.

## Credentials
Store exchange API keys in Hermes vault. This skill never persists plaintext keys.
