---
name: keychain-hermes
description: >
  Inspect Hermes OS keychain/secret stores and ensure wallet/API credentials
  are vaulted and not exposed in plaintext files.
triggers:
  - keychain
  - secrets audit
  - credential hygiene
  - gpg vault
  - plaintext secret
---

# Keychain Hermes

Audit local secret stores for plaintext exposure.

## Behavior
1. Scan ~/.hermes for plaintext tokens, keys, seeds.
2. Check GPG vault status for github-secrets.json.gpg and wallet-secrets.json.gpg.
3. Verify no secrets are committed to Git history.
4. If plaintext found, recommend vaulting and rotation.

## Output
- Plaintext findings table.
- Vault status.
- Risk score: none/low/medium/high/critical.
