#!/usr/bin/env python3
"""Flask frontend: paste text or optional URL → full NLP/ML pipeline + JSON for charts."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

import pandas as pd
from flask import Flask, jsonify, render_template, request, send_from_directory

from src.ml import artifacts_ready, default_model_dir, save_artifacts, train_artifacts
from src.pipeline import result_to_json, run_pipeline_on_text
from src.preprocess import preprocess
from src.url_fetch import UrlFetchError, text_from_url

app = Flask(__name__, static_folder=None)

SPA_DIST = ROOT / "frontend" / "dist"


def _serve_spa_index():
    index = SPA_DIST / "index.html"
    if index.is_file():
        return send_from_directory(SPA_DIST, "index.html")
    return render_template("index.html")


def ensure_trained_models() -> None:
    model_dir = default_model_dir(ROOT)
    if artifacts_ready(model_dir):
        return
    csv_path = ROOT / "data" / "labeled_examples.csv"
    if not csv_path.is_file():
        raise FileNotFoundError(f"Need {csv_path} to train models on first run.")
    df = pd.read_csv(csv_path)
    texts = [preprocess(str(t)) for t in df["text"].tolist()]
    labels = [int(x) for x in df["threat_label"].tolist()]
    art = train_artifacts(texts, labels)
    save_artifacts(art, model_dir)


@app.route("/", methods=["GET"])
def index():
    return _serve_spa_index()


@app.route("/<path:path>", methods=["GET"])
def spa_or_asset(path: str):
    """Serve Vite-built assets or SPA shell for client-side routes (e.g. /sign-in)."""
    if path.startswith("api"):
        return jsonify({"ok": False, "error": "Not found"}), 404
    try:
        candidate = (SPA_DIST / path).resolve()
        dist_resolved = SPA_DIST.resolve()
        if not str(candidate).startswith(str(dist_resolved)):
            return _serve_spa_index()
    except OSError:
        return _serve_spa_index()
    if candidate.is_file():
        rel = candidate.relative_to(dist_resolved)
        return send_from_directory(SPA_DIST, str(rel).replace("\\", "/"))
    return _serve_spa_index()


@app.route("/api/predict", methods=["POST"])
def api_predict():
    ensure_trained_models()
    data = request.get_json(silent=True) or {}
    raw_text = (data.get("text") or "").strip()
    url = (data.get("url") or "").strip()

    if raw_text:
        combined = raw_text
    elif url:
        try:
            combined = text_from_url(url)
        except UrlFetchError as e:
            return jsonify({"ok": False, "error": str(e)}), 400
        except Exception as e:
            return jsonify({"ok": False, "error": f"Could not fetch URL: {e}"}), 502
    else:
        return jsonify({"ok": False, "error": "Provide text or a valid http(s) URL."}), 400

    if len(combined) > 500_000:
        return jsonify({"ok": False, "error": "Input text is too long."}), 400

    result = run_pipeline_on_text(combined, model_dir=default_model_dir(ROOT))
    payload = result_to_json(result)
    payload["ok"] = True
    payload["source_url"] = url if url and not raw_text else None
    return jsonify(payload)


def main() -> None:
    ensure_trained_models()
    app.run(host="127.0.0.1", port=5000, debug=False)


if __name__ == "__main__":
    main()
