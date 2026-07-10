---
name: lotto-chat
description: >
  Chat/workspace dédié lotto NLA Ghana. Use when user references GW Online GH,
  Lucky Tuesday/Thursday, Fortune Thursday, Banker, 2-Sure, Machine, Perm,
  Terminaison, NLA, lotto chat, 22h draw, or self-funding via lottery signals.
---

# Lotto Chat — NLA Ghana

## Objectif
Canaliser tous les signaux lotto NLA dans un espace unique, les stocker,
et produire un briefing jouable pour chaque tirage.

## Sources
- GW Online GH
- Lucky Tuesday / Lucky Thursday / Fortune Thursday
- Captures d’écran Terminaison / Cross / Wheel / Star

## Format de sortie
- Banker
- 2-Sure #1 / #2
- Machine #1 / #2 / #3
- Permutations recommandées
- Confiance : high / medium / low

## Intégrations
- Stockage signaux : `/root/.hermes/cache/nla-signals/`
- Revenue ledger : `/root/.hermes/scripts/revenue-ledger/revenue.json`
- Telegram gateway : `127.0.0.1:17832`

## Règles
- Ne jamais exposer les images sources une fois traitées
- Ne jamais stocker de credentials
- Chaque signal est horodaté UTC
