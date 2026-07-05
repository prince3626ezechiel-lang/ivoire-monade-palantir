---
name: hermes-web3-keychain
description: >
  Hermes Web3 terminal keys keychain. Use for verifying MetaMask wallets,
  browser dApps, Ledger/Trezor/MetaMask/Phantom/Backpack connections,
  smart contract interactions, and crypto revenue flows.
triggers:
  - web3
  - metamask
  - wallet
  - keychain
  - terminal keys
  - ledger
  - trezor
  - phantom
  - backpack
  - dapp
  - smart contract
---

# Hermes Web3 Keychain

Verify and bridge crypto wallets and terminal keys for Hermes revenue flows.

## Behavior
1. Check installed CLI tools: `which metamask`, `which phantom`, `which trezor`, `which ledger`.
2. Check browser extensions: Chrome/Firefox profile metadata.
3. Check wallets: MetaMask 0x..., Ledger L09..., Trezor T..., Phantom/Backpack.
4. Revocation check: MetaMask/Backpack offline mode with browser verification tools.
5. Verify browser client dApp wallet connections via Playwright inspection.
6. Verify smart contract interaction signatures if needed.

## Output
- Markdown status table.
- Evidence files in assets/.
- Alert if any wallet is unverified or exposed.
