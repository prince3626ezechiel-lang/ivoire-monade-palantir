---
name: lotto-chat
description: >
  Chat/workspace dédié lotto LONACI Côte d'Ivoire. Use when user references
  Cash 10H/16H, Digital 08H, Solution 13H, Wari 16H, LONACI, Win/Mac,
  POINTEZ, RÉSULTATS ET MATRICES, 0546136651, or self-funding via lottery.
---

# Lotto Chat — LONACI CI

## Objectif
Canaliser tous les signaux LONACI CI, les stocker, et produire un briefing
jouable pour chaque tirage.

## Sources
- Groupe WhatsApp "RÉSULTATS ET MATRICES"
- Canaux/prédicteurs : MOMO LE GÉNÉREUX, GAME OF THRONES
- Draws : Digital 08H, Cash 10H/16H, LONACI 13H/16H, Solution 13H, Wari 16H

## Format
- Date : JJ-MM-AAAA (ex: 10-07-2026)
- WIN : 5 numéros
- MAC : 5 numéros matrix
- POINTEZ : 2 paires à viser
- Contact : 0546136651

## Stockage
- Signaux : `/root/.hermes/cache/nla-signals/`
- Revenue ledger : `/root/.hermes/scripts/revenue-ledger/revenue.json`
- Telegram : `127.0.0.1:17832`

## Règles
- Ne jamais exposer les sources/médias après traitement
- Chaque signal horodaté UTC
