---
name: lotto-chat
description: >
  Lotto CI + GH polarisé : extraction, stockage, scoring χ², prédictions 1-90,
  entraînement continu. Use for LONACI CI/Ghana NLA, 2-Sure, WIN/MAC, Lonaci draws,
  Lonaci Digital/Cash/Solution/Wari, Lonaci weekly matrices, NLA Bankers, and
  self-funding via lottery.
---

# Lotto Chat — Polarized Pipeline CI/GH

## Objectif
Un seul pipeline pour tout signal lotto CI + GH. Extraction → stockage → scoring → prédiction → entraînement continu.

## Plage de jeu
- **CI** : 1-90 uniquement
- **GH** : 1-90 + pyramides structurelles

## Sources CI
- Groupe WhatsApp "RÉSULTATS ET MATRICES"
- Instagram : `resultats_et_matrices` + comptes similaires
- Lonaci CI officiel : site + app
- Format : catégorie + 4 numéros + Code + Event + WIN/MAC

## Sources GH
- GW Online GH
- Format : Bankers, 2-Sure, Machine numbers, pyramides, permutations

## Base data
- `/root/obm-ci-suite/data/lotto-ci/` — pipeline CI
- `/root/obm-ci-suite/data/lotto-ghana/` — pipeline GH

## Polarisation méthodes
### 1. Cross-category
- Numéros apparaissant dans ≥2 catégories CI
### 2. Frequency weighting
- Fréquence observée dans matrices + résultats réels
### 3. Terminaison forte
- Terminaisons les plus fréquentes : CI `8,4,7,6,1` — GH `0,2,6,1,8`
### 4. Chi-squared (χ²)
- H0 : distribution uniforme 1-90
- `χ² = Σ((observed - expected)² / expected)`, `expected = total/90`
- Contribution χ² élevée = numéro "chaud"
### 5. MAC signal
- Bonus si numéro déjà sorti en WIN
### 6. Hour alignment
- Prédire sur les heures réelles observées (07H, 08H, 10H, 13H...)

## Formules polarisées
```
WIN score = (frequency × 10)
          + (χ²_contrib × 3)
          + (cross_category × 5)
          + (terminaison_forte × 3)

MAC score = (frequency × 8)
          + (real_win_bonus × 6)
          + (χ²_contrib × 2)
          + (terminaison_forte × 3)
```

## Sortie attendue
- **3 numéros WIN** + **3 numéros MAC** seulement
- Plage **1-90**
- Probabilités bornées : **22% minimum**, **78% maximum**
- Confiance réaliste : **40%-70%**

## Entraînement continu
1. User fournit résultats réels Lonaci CI
2. Sauvegarde dans `results-reels.jsonl`
3. Lance `bash /root/obm-ci-suite/data/lotto-ci/train-lotto.sh`
4. Met à jour `model-weights.json`
5. Génère `comparison-report.html`
6. Relancer prédiction pour prochain tirage

## Règles
- Pas de nombres >90 dans les prédictions
- Jamais exposer les numéros bruts en chat sans demande
- Nécessite ≥15 tirages annotés avant mesure fiable du hit rate
- Backtest continu pour valider la méthode
- Tous les résultats bruts stockés localement uniquement
- Traçabilité source : chaque entrée contient `source: img_xxx`

## Scripts
- `training-pipeline.py` — mise à jour des poids
- `visual-compare.py` — rapport HTML hits/miss
- `train-lotto.sh` — wrapper complet
- `check-and-train.sh` — vérifie et entraîne

## Palantir sync
- Pousser vers `/opt/ivoire-monade/palantir/data/lotto-ci/`
- Garder une trace des sources par image
