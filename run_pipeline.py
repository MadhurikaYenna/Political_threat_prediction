#!/usr/bin/env python3
"""Train TF-IDF + DT/NB/SVM from labeled CSV and write a static HTML report."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

import pandas as pd

from src.ml import THREAT_NAMES, default_model_dir, save_artifacts, train_artifacts
from src.preprocess import preprocess


def main() -> None:
    csv_path = ROOT / "data" / "labeled_examples.csv"
    if not csv_path.is_file():
        print(f"Missing training file: {csv_path}", file=sys.stderr)
        sys.exit(1)

    model_dir = default_model_dir(ROOT)
    df = pd.read_csv(csv_path)
    if "text" not in df.columns or "threat_label" not in df.columns:
        print("CSV must have columns: text, threat_label (integers 0–2)", file=sys.stderr)
        sys.exit(1)

    texts = [preprocess(str(t)) for t in df["text"].tolist()]
    labels = [int(x) for x in df["threat_label"].tolist()]
    art = train_artifacts(texts, labels)
    save_artifacts(art, model_dir)
    print(f"Saved models to {model_dir}")

    out_dir = ROOT / "outputs"
    out_dir.mkdir(parents=True, exist_ok=True)
    summary = {
        "n_samples": len(df),
        "threat_label_meaning": list(THREAT_NAMES),
        "models_trained": ["decision_tree", "naive_bayes", "linear_svc"],
        "feature_extractor": "TF-IDF (1–2 grams)",
    }
    (out_dir / "training_summary.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")

    report = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Political Threat Pipeline — Training</title>
  <style>
    body {{ font-family: system-ui, sans-serif; max-width: 720px; margin: 2rem auto; line-height: 1.5; }}
    code {{ background: #f4f4f4; padding: 0.1em 0.35em; border-radius: 4px; }}
  </style>
</head>
<body>
  <h1>Training complete</h1>
  <p>Artifacts written to <code>models/</code>. Summary:</p>
  <pre>{json.dumps(summary, indent=2)}</pre>
  <p>Run the interactive app: <code>python app.py</code></p>
</body>
</html>
"""
    (out_dir / "report.html").write_text(report, encoding="utf-8")
    print(f"Wrote {out_dir / 'report.html'}")


if __name__ == "__main__":
    main()
