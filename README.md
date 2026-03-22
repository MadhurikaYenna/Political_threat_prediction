# Political Threat Prediction

End-to-end NLP and ML framework for predicting political security threats from text.

## Pipeline

1. **User input** — paste news or social text, or an optional **http(s) URL** (fetched server-side; text wins if both are provided).
2. **Preprocessing** — cleaning, stopword removal, stemming.
3. **Emotion extraction** — lexicon match counts (demo word lists in `src/emotion_lexicon.py`).
4. **Sentiment classification** — VADER lexicon (Positive / Neutral / Negative + scores).
5. **Feature extraction** — TF-IDF (1–2 grams), trained on `data/labeled_examples.csv`.
6. **ML models** — Decision Tree, Multinomial Naive Bayes, Linear SVM; ensemble threat label by majority vote (ties → higher severity).
7. **Threat prediction** — No Threat / Potential Threat / High Threat.
8. **Visualization** — React + Vite + Tailwind SPA (glassmorphism dashboard, auth, history, feedback); legacy HTML report still at `templates/index.html` if `frontend/dist` is missing.

## Setup

```bash
pip install -r requirements.txt
```

## Train models and static report

```bash
python run_pipeline.py
```

Writes trained artifacts under `models/` and `outputs/report.html`.

## Interactive frontend (React + Tailwind)

Build the UI once (outputs to `frontend/dist/`, served by Flask):

```bash
cd frontend
npm install
npm run build
cd ..
python app.py
```

Open `http://127.0.0.1:5000` — **Sign Up** first (demo auth stored in the browser). The dashboard includes **Input / Processing / Prediction** cards, **History**, **Settings**, top **Search**, and a **Feedback** FAB with emoji + stars + consent checkbox.

**Local dev** (hot reload; API proxied to Flask on port 5000):

```bash
# terminal 1
python app.py

# terminal 2
cd frontend && npm run dev
```

Use `http://127.0.0.1:5173`. On first run, models train automatically if `models/` is empty.

If `frontend/dist/` does not exist, `/` falls back to the older `templates/index.html` page.

## Deploy on Render (Docker)

The repo includes a `Dockerfile` that builds the React app, installs NLTK data, trains models, and runs **Gunicorn**.

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In [Render](https://render.com): **New +** → **Web Service** → connect the repository.
3. Set:
   - **Runtime:** **Docker**
   - **Dockerfile path:** `Dockerfile`
   - **Instance type:** your plan (Docker web services need a paid instance on many accounts—pick what Render offers).
4. Leave **Build Command** / **Start Command** empty (Docker `CMD` handles start). Render injects **`PORT`** automatically.
5. **Create Web Service**. First deploy builds the image (several minutes).

Optional: **New** → **Blueprint** → select the repo and use `render.yaml`.

Local check: `docker build -t pstp .` then `docker run -p 8080:8080 -e PORT=8080 pstp` → open `http://localhost:8080`.

## Data

Replace or extend `data/labeled_examples.csv` (columns `text`, `threat_label` with integers `0` = no, `1` = potential, `2` = high), then run `python run_pipeline.py` again.