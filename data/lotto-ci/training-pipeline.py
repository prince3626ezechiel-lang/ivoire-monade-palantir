#!/usr/bin/env python3
"""
Lotto Bonheur CI - Training Pipeline
Met à jour les poids du modèle après chaque tirage réel.
Usage: python3 training-pipeline.py <results_file.jsonl>
"""

import json
import sys
from pathlib import Path
from collections import Counter, defaultdict

def load_jsonl(path):
    items = []
    for line in Path(path).read_text(encoding='utf-8').splitlines():
        if line.strip():
            try:
                items.append(json.loads(line))
            except:
                pass
    return items

def extract_numbers_from_result(result):
    """Extrait tous les numéros d'un résultat réel Lonaci"""
    nums = []
    # Format standard: catégorie + numéros + code + event
    cats = result.get('categories', [])
    for cat in cats:
        nums.extend([str(n) for n in cat.get('numbers', []) if str(n).strip().isdigit()])
    return nums

def update_weights(results_path, weights_path, predictions_path):
    """Met à jour les poids du modèle avec les résultats réels"""
    results = load_jsonl(results_path)
    weights = json.loads(Path(weights_path).read_text(encoding='utf-8'))
    predictions = json.loads(Path(predictions_path).read_text(encoding='utf-8'))
    
    # Extraire tous les numéros des résultats réels
    all_real_numbers = []
    for r in results:
        all_real_numbers.extend(extract_numbers_from_result(r))
    
    real_freq = Counter(all_real_numbers)
    real_ter = Counter(str(n)[-1] for n in all_real_numbers)
    
    # Mettre à jour les poids
    weights['frequency_real'] = dict(real_freq.most_common(50))
    weights['terminaisons_real'] = dict(sorted(real_ter.items()))
    weights['updated_at'] = str(Path(results_path).stat().st_mtime)
    
    # Calculer le hit rate des prédictions
    predicted = set()
    for draw in predictions.get('draws', {}).values():
        predicted.update(draw.get('numbers', []))
    
    hits = predicted & set(all_real_numbers)
    weights['last_prediction_hits'] = list(hits)
    weights['last_prediction_accuracy'] = len(hits) / len(predicted) if predicted else 0
    
    # Sauvegarder
    Path(weights_path).write_text(json.dumps(weights, ensure_ascii=False, indent=2), encoding='utf-8')
    return weights

def generate_next_prediction(weights_path, output_path, date, hours=['8h', '12h', '14h']):
    """Génère les prédictions pour le prochain tirage"""
    weights = json.loads(Path(weights_path).read_text(encoding='utf-8'))
    
    freq = Counter(weights.get('frequency_real', {}))
    ter = Counter(weights.get('terminaisons_real', {}))
    ter_top3 = [t for t, _ in ter.most_common(3)]
    
    predictions = {}
    for hour in hours:
        # Formule améliorée avec poids réels
        candidates = []
        for n, f in freq.most_common(100):
            score = f * 10
            if str(n)[-1] in ter_top3:
                score += 5
            candidates.append((n, score))
        
        candidates.sort(key=lambda x: x[1], reverse=True)
        selected = [n for n, _ in candidates[:4]]
        
        conf = min(70, max(40, int(45 + (candidates[0][1] / max(candidates[0][1], 1)) * 20)))
        predictions[hour] = {
            'numbers': selected,
            'confidence_pct': conf,
            'formula': 'real_frequency + terminaison_historique'
        }
    
    output = {
        'game': 'lotto-bonheur-ivoirien',
        'date': date,
        'draws': predictions,
        'model_version': weights.get('version', '1.0'),
        'training_runs': weights.get('training_runs', 0) + 1
    }
    
    Path(output_path).write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding='utf-8')
    return output

if __name__ == '__main__':
    results_file = sys.argv[1] if len(sys.argv) > 1 else str(base / 'results-reels.jsonl')
    weights_file = str(base / 'model-weights.json')
    predictions_file = str(base / 'prediction-lundi-2026-07-13.json')
    
    # Mettre à jour les poids avec résultats réels
    weights = update_weights(results_file, weights_file, predictions_file)
    print(json.dumps({'status': 'trained', 'weights': weights}, ensure_ascii=False, indent=2))
