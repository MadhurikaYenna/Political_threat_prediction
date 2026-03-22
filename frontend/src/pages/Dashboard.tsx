import { AlertTriangle, Check, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useSearch } from "../context/SearchContext";
import { predict } from "../lib/api";
import {
  getStats,
  incrementStatForThreat,
  prependHistory,
  type ThreatStats,
} from "../lib/storage";

const INPUT_ITEMS = ["Sentiment signals", "Preprocessing pipeline", "Automation & batch scoring"];
const STEPS = ["Cleaning", "Tokenization", "Remove Stopwords"] as const;

function matchesSearch(text: string, q: string) {
  if (!q.trim()) return true;
  return text.toLowerCase().includes(q.trim().toLowerCase());
}

export default function Dashboard() {
  const { query } = useSearch();
  const [stats, setStats] = useState<ThreatStats>(() => getStats());
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [stepDone, setStepDone] = useState<boolean[]>(() => STEPS.map(() => false));
  const [error, setError] = useState("");
  const [lastPreview, setLastPreview] = useState<string | null>(null);
  const [lastThreat, setLastThreat] = useState<string | null>(null);

  const filteredInputItems = useMemo(
    () => INPUT_ITEMS.filter((t) => matchesSearch(t, query)),
    [query]
  );

  const runStepsAnimation = useCallback(() => {
    setStepDone(STEPS.map(() => false));
    STEPS.forEach((_, i) => {
      window.setTimeout(() => {
        setStepDone((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 400 + i * 450);
    });
  }, []);

  async function runPipeline() {
    setError("");
    if (!text.trim() && !url.trim()) {
      setError("Paste text or enter a valid http(s) URL.");
      return;
    }
    setLoading(true);
    runStepsAnimation();
    try {
      const res = await predict(text, url);
      if (!res.ok || !res.threat_final) {
        setError(res.error ?? "Prediction failed.");
        setStepDone(STEPS.map(() => false));
        return;
      }
      const threat = res.threat_final;
      setLastPreview(res.user_text_preview ?? "");
      setLastThreat(threat);
      const newStats = incrementStatForThreat(threat);
      setStats(newStats);
      prependHistory({
        id: crypto.randomUUID(),
        at: new Date().toISOString(),
        preview: (res.user_text_preview ?? "").slice(0, 200),
        threatFinal: threat,
        sentimentLabel: res.sentiment?.label ?? "",
        models: res.models ?? {},
        sourceUrl: res.source_url ?? null,
      });
      setStepDone(STEPS.map(() => true));
    } catch {
      setError("Could not reach the API. Start Flask (python app.py) or use npm run dev with proxy.");
      setStepDone(STEPS.map(() => false));
    } finally {
      setLoading(false);
    }
  }

  const showCards =
    matchesSearch("input data sentiment preprocessing", query) ||
    matchesSearch("processing", query) ||
    matchesSearch("prediction", query) ||
    !query.trim();

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-teal-400/90">
          <Sparkles className="h-3.5 w-3.5" />
          Dashboard
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Political Security Threat Prediction
        </h1>
        <p className="max-w-2xl text-sm text-slate-400">
          Hybrid lexicon-based &amp; machine learning approach — monitor pipeline health, run new
          analyses, and review aggregate threat counts.
        </p>
      </header>

      {error ? (
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm text-orange-100">
          {error}
        </div>
      ) : null}

      {showCards ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="glass-panel flex flex-col border-white/10 p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Input Data
            </h2>
            <ul className="mb-4 flex flex-col gap-3">
              {(filteredInputItems.length ? filteredInputItems : INPUT_ITEMS).map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 text-sm text-slate-300"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                  {item}
                </li>
              ))}
            </ul>
            <label className="mb-1 text-xs text-slate-500">News / social text</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              placeholder="Paste content…"
              className="mb-3 w-full resize-y rounded-xl border border-white/10 bg-navy-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-teal-500/40"
            />
            <label className="mb-1 text-xs text-slate-500">Optional URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
              className="mb-3 w-full rounded-xl border border-white/10 bg-navy-900/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-teal-500/40"
            />
            <button
              type="button"
              onClick={() => void runPipeline()}
              disabled={loading}
              className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-btn-primary py-2.5 text-sm font-semibold text-navy-950 transition hover:brightness-110 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Run analysis
            </button>
          </div>

          <div className="glass-panel border-white/10 p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Processing Steps
            </h2>
            <ul className="space-y-3">
              {STEPS.map((label, i) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3"
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                      stepDone[i]
                        ? "border-teal-500/40 bg-teal-500/20 text-teal-300"
                        : "border-white/10 bg-navy-900 text-slate-500"
                    }`}
                  >
                    {stepDone[i] ? <Check className="h-4 w-4" /> : <span className="text-xs">{i + 1}</span>}
                  </span>
                  <span className="text-sm font-medium text-slate-200">{label}</span>
                </li>
              ))}
            </ul>
            {lastThreat ? (
              <p className="mt-4 rounded-lg border border-white/10 bg-navy-900/50 p-3 text-xs text-slate-400">
                Latest threat:{" "}
                <span className="font-semibold text-teal-300">{lastThreat}</span>
              </p>
            ) : null}
          </div>

          <div className="glass-panel border-white/10 p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Prediction Results
            </h2>
            <ul className="space-y-4">
              <li className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
                <span className="flex items-center gap-2 text-sm text-slate-200">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  No Threat
                </span>
                <span className="text-xl font-bold text-emerald-400">{stats.noThreat}</span>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3">
                <span className="flex items-center gap-2 text-sm text-slate-200">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  Potential Threat
                </span>
                <span className="text-xl font-bold text-amber-400">{stats.potential}</span>
              </li>
              <li className="flex items-center justify-between rounded-xl border border-red-500/25 bg-red-500/5 px-4 py-3">
                <span className="flex items-center gap-2 text-sm text-slate-200">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  High Threat
                </span>
                <span className="text-xl font-bold text-red-400">{stats.high}</span>
              </li>
            </ul>
            <p className="mt-4 text-xs text-slate-500">
              Counts include seeded dashboard totals and every new run you execute in this browser.
            </p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500">No dashboard modules match “{query}”.</p>
      )}

      {lastPreview ? (
        <div className="glass-panel border-white/10 p-5">
          <h3 className="mb-2 text-sm font-semibold text-slate-400">Last input preview</h3>
          <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">{lastPreview}</p>
        </div>
      ) : null}
    </div>
  );
}
