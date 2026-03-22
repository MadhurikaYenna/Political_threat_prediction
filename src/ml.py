"""TF-IDF features and sklearn classifiers (Decision Tree, Naive Bayes, SVM)."""

from __future__ import annotations

from collections import Counter
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Tuple

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC
from sklearn.tree import DecisionTreeClassifier

THREAT_NAMES = ("No Threat", "Potential Threat", "High Threat")

MODEL_DIRNAME = "models"
VECTORIZER_NAME = "tfidf_vectorizer.joblib"
DT_NAME = "decision_tree.joblib"
NB_NAME = "naive_bayes.joblib"
SVM_NAME = "linear_svc.joblib"


@dataclass
class ModelArtifacts:
    vectorizer: TfidfVectorizer
    decision_tree: DecisionTreeClassifier
    naive_bayes: MultinomialNB
    svm: LinearSVC


def default_model_dir(root: Path | None = None) -> Path:
    base = root or Path(__file__).resolve().parent.parent
    return base / MODEL_DIRNAME


def train_artifacts(
    texts: List[str],
    labels: List[int],
    *,
    max_features: int = 8000,
    random_state: int = 42,
) -> ModelArtifacts:
    vectorizer = TfidfVectorizer(
        max_features=max_features,
        ngram_range=(1, 2),
        min_df=1,
        sublinear_tf=True,
    )
    X = vectorizer.fit_transform(texts)
    y = pd.Series(labels).astype(int).values

    dt = DecisionTreeClassifier(max_depth=12, random_state=random_state)
    dt.fit(X, y)

    nb = MultinomialNB(alpha=0.5)
    nb.fit(X, y)

    svm = LinearSVC(random_state=random_state, max_iter=5000, dual="auto")
    svm.fit(X, y)

    return ModelArtifacts(
        vectorizer=vectorizer,
        decision_tree=dt,
        naive_bayes=nb,
        svm=svm,
    )


def save_artifacts(art: ModelArtifacts, directory: Path) -> None:
    directory.mkdir(parents=True, exist_ok=True)
    joblib.dump(art.vectorizer, directory / VECTORIZER_NAME)
    joblib.dump(art.decision_tree, directory / DT_NAME)
    joblib.dump(art.naive_bayes, directory / NB_NAME)
    joblib.dump(art.svm, directory / SVM_NAME)


def load_artifacts(directory: Path) -> ModelArtifacts:
    return ModelArtifacts(
        vectorizer=joblib.load(directory / VECTORIZER_NAME),
        decision_tree=joblib.load(directory / DT_NAME),
        naive_bayes=joblib.load(directory / NB_NAME),
        svm=joblib.load(directory / SVM_NAME),
    )


def predict_threats(
    art: ModelArtifacts,
    preprocessed_text: str,
) -> Tuple[Dict[str, str], str]:
    """
    Return per-model threat labels and majority-vote ensemble label.
    preprocessed_text must be the stemmed/joined string from preprocess.preprocess().
    """
    if not preprocessed_text.strip():
        empty = {k: THREAT_NAMES[0] for k in ("decision_tree", "naive_bayes", "svm")}
        return empty, THREAT_NAMES[0]
    X = art.vectorizer.transform([preprocessed_text])
    dt_pred = int(art.decision_tree.predict(X)[0])
    nb_pred = int(art.naive_bayes.predict(X)[0])
    svm_pred = int(art.svm.predict(X)[0])
    preds = [dt_pred, nb_pred, svm_pred]
    votes: Dict[str, str] = {
        "decision_tree": THREAT_NAMES[dt_pred],
        "naive_bayes": THREAT_NAMES[nb_pred],
        "svm": THREAT_NAMES[svm_pred],
    }
    # Majority vote; tie -> highest severity index (conservative).
    counts = Counter(preds)
    best = max(counts.values())
    candidates = [c for c, n in counts.items() if n == best]
    final_idx = max(candidates)
    return votes, THREAT_NAMES[final_idx]


def artifacts_ready(directory: Path) -> bool:
    return all((directory / n).is_file() for n in (VECTORIZER_NAME, DT_NAME, NB_NAME, SVM_NAME))
