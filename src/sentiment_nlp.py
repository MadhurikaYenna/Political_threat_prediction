"""Lexicon-based sentiment (VADER) — maps compound score to Positive / Neutral / Negative."""

from __future__ import annotations

from dataclasses import dataclass

import nltk
from nltk.sentiment import SentimentIntensityAnalyzer


@dataclass
class SentimentResult:
    compound: float
    positive: float
    neutral: float
    negative: float
    label: str


_analyzer: SentimentIntensityAnalyzer | None = None


def _ensure_vader() -> SentimentIntensityAnalyzer:
    global _analyzer
    if _analyzer is not None:
        return _analyzer
    try:
        nltk.data.find("sentiment/vader_lexicon.zip")
    except LookupError:
        nltk.download("vader_lexicon", quiet=True)
    _analyzer = SentimentIntensityAnalyzer()
    return _analyzer


def classify_sentiment(text: str) -> SentimentResult:
    """VADER on raw or lightly cleaned text (VADER handles punctuation and caps)."""
    if not text or not str(text).strip():
        return SentimentResult(0.0, 0.0, 1.0, 0.0, "Neutral")
    sia = _ensure_vader()
    scores = sia.polarity_scores(text)
    compound = scores["compound"]
    if compound >= 0.05:
        label = "Positive"
    elif compound <= -0.05:
        label = "Negative"
    else:
        label = "Neutral"
    return SentimentResult(
        compound=compound,
        positive=scores["pos"],
        neutral=scores["neu"],
        negative=scores["neg"],
        label=label,
    )
