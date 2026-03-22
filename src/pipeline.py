"""End-to-end inference: preprocessing → emotion → sentiment → TF-IDF → ML → threat."""

from __future__ import annotations

from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any, Dict, Optional

from src.emotion_lexicon import dominant_emotion, emotion_scores_from_text
from src.ml import load_artifacts, predict_threats, default_model_dir
from src.preprocess import preprocess
from src.sentiment_nlp import classify_sentiment


@dataclass
class PipelineResult:
    user_text_preview: str
    preprocessed: str
    emotions: Dict[str, int]
    dominant_emotion: Optional[str]
    sentiment: Dict[str, Any]
    models: Dict[str, str]
    threat_final: str


def run_pipeline_on_text(
    raw_text: str,
    *,
    model_dir: Optional[Path] = None,
) -> PipelineResult:
    root = model_dir or default_model_dir()
    art = load_artifacts(root)
    preview = (raw_text or "").strip()
    if len(preview) > 500:
        preview = preview[:500] + "…"

    preprocessed = preprocess(raw_text or "")
    emotions = emotion_scores_from_text(raw_text or "")
    dom = dominant_emotion(emotions)
    sent = classify_sentiment(raw_text or "")
    sentiment_dict = {
        "label": sent.label,
        "compound": round(sent.compound, 4),
        "positive": round(sent.positive, 4),
        "neutral": round(sent.neutral, 4),
        "negative": round(sent.negative, 4),
    }
    votes, final_label = predict_threats(art, preprocessed)

    return PipelineResult(
        user_text_preview=preview,
        preprocessed=preprocessed,
        emotions=emotions,
        dominant_emotion=dom,
        sentiment=sentiment_dict,
        models=votes,
        threat_final=final_label,
    )


def result_to_json(result: PipelineResult) -> Dict[str, Any]:
    d = asdict(result)
    return d
