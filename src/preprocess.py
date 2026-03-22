"""Text cleaning and normalization for NLP pipeline."""

from __future__ import annotations

import re
import string
from typing import List

import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

_stemmer: PorterStemmer | None = None
_stop: set[str] | None = None


def _ensure_nltk() -> None:
    global _stemmer, _stop
    if _stemmer is not None and _stop is not None:
        return
    try:
        nltk.data.find("corpora/stopwords")
    except LookupError:
        nltk.download("stopwords", quiet=True)
    _stemmer = PorterStemmer()
    _stop = set(stopwords.words("english"))


def clean_text(raw: str) -> str:
    """Lowercase, remove URLs and most punctuation, collapse whitespace."""
    if not raw or not raw.strip():
        return ""
    text = raw.lower()
    text = re.sub(r"https?://\S+|www\.\S+", " ", text)
    text = text.translate(str.maketrans("", "", string.punctuation.replace("'", "")))
    text = re.sub(r"\s+", " ", text).strip()
    return text


def preprocess(raw: str, *, use_stemming: bool = True) -> str:
    """
    Clean, tokenize, remove stopwords, optional stemming.
    Returns a single space-joined string for vectorizers.
    """
    _ensure_nltk()
    assert _stemmer is not None and _stop is not None
    cleaned = clean_text(raw)
    if not cleaned:
        return ""
    # Whitespace tokenization after punctuation removal avoids punkt/punkt_tab installs.
    tokens = cleaned.split()
    out: List[str] = []
    for t in tokens:
        if t in _stop or not t.isalnum() and "'" not in t:
            continue
        if use_stemming:
            out.append(_stemmer.stem(t))
        else:
            out.append(t)
    return " ".join(out)


def preprocess_tokens(raw: str) -> List[str]:
    """Same as preprocess but return token list (for lexicon matching on stems)."""
    s = preprocess(raw, use_stemming=True)
    return s.split() if s else []
