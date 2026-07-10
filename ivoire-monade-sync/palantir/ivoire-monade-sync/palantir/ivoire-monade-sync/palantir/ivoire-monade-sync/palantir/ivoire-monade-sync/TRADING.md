# Trading IVOIRE MONADE

## Objectif
- Ouvrir une section trading sans casser la logique B2B XCMG.
- Mode dry run prioritaire, aucun ordre live sans validation manuelle.

## Stack locale
- Frontend Next.js + Tailwind + Framer Motion
- Composants : `MiniChart`, `InspirationGrid`
- Pages : `/trading`, `/dashboard`
- Skills Hermes : `strategy-lab`, `trading-knowledge-core`, `telegram-signal-relay`

## Règles
- 1% max par trade
- SL/TP systématique
- Journalisation dans `backend/logs/`
- Source de prix : nos propres flux ou brokers open source validés

## Déploiement
- Build via `next build`
- Domaine : ivoire-monade.shop
- Reverse-proxy à configurer séparément
