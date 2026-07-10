---
name: trading-knowledge-core
description: >
  Index des actifs de connaissance trading.
  Résumés à la demande des PDFs provenant des scans
  et de la bibliothèque utilisateur.
version: 0.1.0
author: Prince Ezéchiel 👑
license: Proprietary
metadata:
  hermes:
    tags: [knowledge, trading, finance, pdf, summary, open-source]
---

# trading-knowledge-core

## Mission
Répondre à partir des PDFs trading/finance sans exfiltrer les secrets.

## Capabilities
- Résumer un actif par titre.
- Extraire vocabulaires/structures: dividende, Elliot, supply/demand, quant, options, forex.
- Proposer une skill Hermes dérivée lorsqu’un thème apparaît 3 fois.

## Usage
1. Pointer le chemin `/root/.hermes/cache/documents/`.
2. Appeler `terminal()` pour extraire via `pymupdf`.
3. Répondre en markdown structuré.
4. Mettre à jour registry si nouveau thème dédié.

## Security
- Aucune extraction de secrets depuis les docs
- Stockage en cache local uniquement
- GPG-only pour chemins sensibles
