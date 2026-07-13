#!/bin/bash
# Trigger training if real results available
RESULTS="/root/obm-ci-suite/data/lotto-ci/results-reels.jsonl"
WEIGHTS="/root/obm-ci-suite/data/lotto-ci/model-weights.json"
SCRIPT="/root/obm-ci-suite/data/lotto-ci/training-pipeline.py"

if [ -f "$RESULTS" ] && [ -s "$RESULTS" ]; then
    cd /root/obm-ci-suite/data/lotto-ci
    python3 training-pipeline.py "$RESULTS"
    echo "Training completed at $(date)"
else
    echo "No real results yet. Waiting for input."
fi
