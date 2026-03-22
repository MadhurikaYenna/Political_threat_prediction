"""Compact lexicon-based emotion scoring (token match counts)."""

from __future__ import annotations

import re
from typing import Dict, Iterable, List

from src.preprocess import clean_text

# Demo lexicon: common cues per category (not exhaustive; swap for NRC-style files in production).
EMOTION_WORDS: Dict[str, List[str]] = {
    "anger": [
        "angry", "rage", "furious", "outraged", "hostile", "hatred", "hate", "resent",
        "violent", "attack", "destroy", "revenge", "vengeance", "enemy", "traitor",
    ],
    "fear": [
        "afraid", "fear", "scared", "terror", "panic", "threat", "danger", "unsafe",
        "worried", "anxious", "alarm", "catastrophe", "crisis", "emergency",
    ],
    "joy": [
        "happy", "hope", "proud", "celebrate", "victory", "peace", "unity", "progress",
        "grateful", "optimistic", "together", "freedom", "democracy",
    ],
    "sadness": [
        "sad", "grief", "loss", "mourning", "tragedy", "suffering", "hurt", "broken",
        "hopeless", "despair", "disappointed",
    ],
    "disgust": [
        "disgusting", "vile", "corrupt", "shame", "rotten", "filthy", "revolting",
        "despicable", "deplorable",
    ],
    "surprise": [
        "shocking", "unbelievable", "sudden", "unexpected", "stunning", "wow",
        "astonishing", "bombshell",
    ],
}


def _tokenize_for_match(text: str) -> List[str]:
    text = text.lower()
    return re.findall(r"[a-z0-9']+", text)


def emotion_scores(tokens: Iterable[str]) -> Dict[str, int]:
    """Return match counts per emotion category for pre-tokenized or raw tokens."""
    if isinstance(tokens, str):
        tokens = _tokenize_for_match(tokens)
    token_set = set(tokens)
    scores: Dict[str, int] = {}
    for emotion, words in EMOTION_WORDS.items():
        scores[emotion] = sum(1 for w in words if w in token_set)
    return scores


def emotion_scores_from_text(text: str) -> Dict[str, int]:
    """Lexicon match on cleaned (non-stemmed) tokens so dictionary words align."""
    return emotion_scores(_tokenize_for_match(clean_text(text)))


def dominant_emotion(scores: Dict[str, int]) -> str | None:
    if not scores or max(scores.values()) == 0:
        return None
    return max(scores, key=scores.get)
