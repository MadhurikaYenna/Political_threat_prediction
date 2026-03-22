"""Optional HTTP(S) URL → plain text for the pipeline."""

from __future__ import annotations

import re
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup

MAX_BYTES = 2_000_000
TIMEOUT_SEC = 15


class UrlFetchError(ValueError):
    pass


def text_from_url(url: str) -> str:
    raw = (url or "").strip()
    if not raw:
        raise UrlFetchError("Empty URL.")
    parsed = urlparse(raw)
    if parsed.scheme not in ("http", "https"):
        raise UrlFetchError("Only http and https URLs are allowed.")
    if not parsed.netloc:
        raise UrlFetchError("Invalid URL.")

    headers = {"User-Agent": "PoliticalThreatPipeline/1.0 (research)"}
    resp = requests.get(raw, headers=headers, timeout=TIMEOUT_SEC, stream=True)
    resp.raise_for_status()
    content = b""
    for chunk in resp.iter_content(65536):
        content += chunk
        if len(content) > MAX_BYTES:
            raise UrlFetchError("Response too large.")
    ctype = (resp.headers.get("Content-Type") or "").lower()
    if "html" not in ctype and not raw.lower().endswith((".htm", ".html")):
        # Best-effort: still try BeautifulSoup for mixed types
        pass
    html = content.decode(resp.encoding or "utf-8", errors="replace")
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()
    text = soup.get_text(separator="\n")
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]{2,}", " ", text)
    return text.strip()
