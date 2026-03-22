# Multi-stage: build React app, then Python + ML + Gunicorn (Render-compatible).

FROM node:20-alpine AS frontend
WORKDIR /build
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM python:3.11-slim-bookworm
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py run_pipeline.py ./
COPY src ./src
COPY data ./data
COPY templates ./templates
COPY --from=frontend /build/dist ./frontend/dist

# NLTK data at build time so cold starts are faster.
RUN python -c "import nltk; nltk.download('vader_lexicon', quiet=True); nltk.download('stopwords', quiet=True)"

# Train and persist models inside the image.
RUN python run_pipeline.py

EXPOSE 8000
# Render sets PORT at runtime.
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-8000} --workers 2 --timeout 120 app:app"]
