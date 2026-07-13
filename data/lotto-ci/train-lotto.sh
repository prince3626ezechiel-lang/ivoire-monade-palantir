#!/bin/bash
# Lotto CI - Manual training trigger
# Usage: ./train-lotto.sh <real-results.jsonl>
# Ou place le fichier dans results-reels.jsonl puis lance sans argument

set -euo pipefail

BASE="/root/obm-ci-suite/data/lotto-ci"
RESULTS="${1:-$BASE/results-reels.jsonl}"
SCRIPT="$BASE/training-pipeline.py"
VISUAL="$BASE/visual-compare.py"

if [ ! -f "$RESULTS" ] || [ ! -s "$RESULTS" ]; then
    echo "Error: No real results found at $RESULTS"
    echo "Usage: $0 <real-results.jsonl>"
    exit 1
fi

echo "=== LOTTO CI TRAINING TRIGGER ==="
echo "Results file: $RESULTS"
echo ""

# Run training pipeline
cd "$BASE"
python3 "$SCRIPT" "$RESULTS"

echo ""
echo "=== GENERATING VISUAL COMPARISON ==="
python3 "$VISUAL"

echo ""
echo "=== RESULTS ==="
echo "Model weights updated: $BASE/model-weights.json"
echo "HTML report: $BASE/comparison-report.html"
echo "Training complete!"
