# Prediction Methodology

## Formule principale
```
score = cross_category_count * 5
      + global_frequency * 10
      + terminaison_forte_bonus * 3
      + hour_bonus
```

## Hour bonus mapping
- 8H : bonus si catégorie `lundi étoile`
- 12H : bonus si catégorie `réveil`
- 14H : bonus si catégorie `akwaba`
- Randomisation légère : `+ random(0, 2)` pour diversifier

## Terminaisons dominantes CI
- Top 3 actuelles : `8, 4, 7, 6, 1`
- Surpondérer les numéros finissant par ces chiffres

## Cross-category
- Un numéro apparaissant dans ≥2 catégories gagne un bonus structurel
- Préférer ces numéros pour les 2-sure

## Entraînement
- Ajouter résultats réels dans `results-reels.jsonl`
- Lancer `training-pipeline.py`
- Ajuster les poids selon hit rate observé
