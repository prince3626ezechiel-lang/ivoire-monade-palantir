#!/usr/bin/env python3
"""
Comparaison visuelle entre prédictions et résultats réels.
Génère un rapport HTML lisible.
"""

import json
from pathlib import Path

def load_json(path):
    p = Path(path)
    if not p.exists():
        return None
    return json.loads(p.read_text(encoding='utf-8'))

def compare_draws(predictions, real_results):
    """Compare predicted vs real numbers for each draw"""
    report = []

    # Build real number set
    real_nums = set()
    for r in real_results:
        for cat in r.get('categories', []):
            for n in cat.get('numbers', []):
                if str(n).strip().isdigit():
                    real_nums.add(str(n))

    for hour, pred_data in predictions.get('draws', {}).items():
        pred_set = set(str(n) for n in pred_data.get('numbers', []))
        hits = pred_set & real_nums

        report.append({
            'hour': hour,
            'predicted': list(pred_set),
            'real_count': len(real_nums),
            'hits': list(hits),
            'hit_count': len(hits),
            'accuracy_pct': round((len(hits) / len(pred_set) * 100) if pred_set else 0, 1)
        })

    return report

def generate_html_report(report, predictions, output_path):
    """Génère un rapport HTML"""
    total_pred = sum(len(d['predicted']) for d in report)
    total_hits = sum(d['hit_count'] for d in report)
    global_acc = round(total_hits / max(total_pred, 1) * 100, 1)

    rows = '\n'.join(
        "<div class=\"draw-card\">" +
        f"<h3>Tirage {d['hour']}</h3>" +
        "<div class=\"numbers\">" +
        ''.join(f"<span class=\"number hit\">{n}</span>" if n in d['hits'] else f"<span class=\"number miss\">{n}</span>" for n in d['predicted']) +
        "</div>" +
        f"<p>Hits: {d['hit_count']}/{len(d['predicted'])} ({d['accuracy_pct']}%)</p>" +
        "</div>"
        for d in report
    )

    html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset=\"UTF-8\">
    <title>Lotto CI - Prédictions vs Résultats</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 20px; background: #1a1a2e; color: #eee; }}
        .container {{ max-width: 900px; margin: 0 auto; }}
        h1 {{ color: #00d9ff; }}
        .draw-card {{ background: #16213e; border-radius: 8px; padding: 15px; margin: 10px 0; }}
        .numbers {{ display: flex; gap: 10px; margin: 10px 0; flex-wrap: wrap; }}
        .number {{ background: #0f3460; padding: 8px 12px; border-radius: 4px; font-weight: bold; }}
        .hit {{ background: #00d9ff; color: #1a1a2e; }}
        .miss {{ background: #e94560; color: #fff; }}
        .accuracy {{ font-size: 24px; color: #00d9ff; font-weight: bold; }}
        .stats {{ background: #0f3460; padding: 15px; border-radius: 8px; margin: 20px 0; }}
    </style>
</head>
<body>
    <div class=\"container\">
        <h1>Lotto Bonheur CI - Rapport de comparaison</h1>
        <p>Date: {predictions.get('date', 'N/A')}</p>
        <div class=\"stats\">
            <h2>Statistiques globales</h2>
            <p>Tirages analysés: {len(report)}</p>
            <p>Prédictions totales: {total_pred}</p>
            <p>Hits total: {total_hits}</p>
            <p>Précision globale: {global_acc}%</p>
        </div>
        {rows}
    </div>
</body>
</html>
"""

    Path(output_path).write_text(html, encoding='utf-8')
    return output_path

if __name__ == '__main__':
    base = Path('/root/obm-ci-suite/data/lotto-ci')
    predictions = load_json(base / 'prediction-lundi-2026-07-13.json')
    real_results = [json.loads(line) for line in (base / 'results-reels.jsonl').read_text(encoding='utf-8').splitlines() if line.strip()]

    if not predictions:
        print('Error: No predictions found')
        exit(1)

    if not real_results:
        print('Error: No real results yet. Provide results-reels.jsonl')
        exit(1)

    report = compare_draws(predictions, real_results)
    html_path = base / 'comparison-report.html'
    generate_html_report(report, predictions, html_path)

    print(json.dumps({
        'status': 'report_generated',
        'html_path': str(html_path),
        'report': report
    }, ensure_ascii=False, indent=2))
