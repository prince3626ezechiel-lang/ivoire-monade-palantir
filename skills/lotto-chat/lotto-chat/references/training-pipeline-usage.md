# Training pipeline usage notes
- Workflow: user results → results-reels.jsonl → train-lotto.sh → model-weights.json + comparison-report.html
- Pitfall: <15 real draws gives structurally 0% hit rate
- Pitfall: hour mismatch between predictions and real draws also gives 0% hit rate
- MAC derivation: prefer WIN frequency + real WIN bonus unless enough MAC history exists