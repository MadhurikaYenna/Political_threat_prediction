import { useMemo } from "react";
import { useSearch } from "../context/SearchContext";
import { getHistory, type PredictionRecord } from "../lib/storage";

function rowMatches(h: PredictionRecord, q: string) {
  if (!q.trim()) return true;
  const t = q.toLowerCase();
  return (
    h.preview.toLowerCase().includes(t) ||
    h.threatFinal.toLowerCase().includes(t) ||
    h.sentimentLabel.toLowerCase().includes(t) ||
    (h.sourceUrl && h.sourceUrl.toLowerCase().includes(t))
  );
}

export default function History() {
  const { query } = useSearch();
  const rows = useMemo(() => getHistory().filter((h) => rowMatches(h, query)), [query]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">History</h1>
        <p className="mt-1 text-sm text-slate-400">
          Past predictions from this browser. Use the top search to filter.
        </p>
      </div>

      <div className="glass-panel overflow-hidden border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">When</th>
                <th className="px-4 py-3 font-medium">Threat</th>
                <th className="px-4 py-3 font-medium">Sentiment</th>
                <th className="px-4 py-3 font-medium">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-slate-500">
                    No entries yet. Run an analysis from the Dashboard.
                  </td>
                </tr>
              ) : (
                rows.map((h) => (
                  <tr key={h.id} className="hover:bg-white/[0.02]">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-400">
                      {new Date(h.at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-teal-300">{h.threatFinal}</td>
                    <td className="px-4 py-3 text-slate-300">{h.sentimentLabel}</td>
                    <td className="max-w-md truncate px-4 py-3 text-slate-400">{h.preview}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
