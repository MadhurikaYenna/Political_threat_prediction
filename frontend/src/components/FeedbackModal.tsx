import { X } from "lucide-react";
import { useState } from "react";

const MOODS = [
  { emoji: "🤩", label: "Awesome", color: "from-teal-400 to-cyan-400" },
  { emoji: "😊", label: "Great", color: "from-emerald-400 to-teal-400" },
  { emoji: "🙂", label: "Good", color: "from-sky-400 to-blue-400" },
  { emoji: "😐", label: "Okay", color: "from-slate-400 to-slate-500" },
  { emoji: "😕", label: "Bad", color: "from-amber-400 to-orange-400" },
  { emoji: "😫", label: "Terrible", color: "from-red-400 to-rose-500" },
];

const FEEDBACK_KEY = "pst_feedback";

export type FeedbackEntry = {
  id: string;
  at: string;
  moodIndex: number;
  stars: number;
  text: string;
  contactOk: boolean;
};

function saveFeedback(entry: FeedbackEntry) {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    const list: FeedbackEntry[] = raw ? JSON.parse(raw) : [];
    list.unshift(entry);
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify(list.slice(0, 50)));
  } catch {
    /* ignore */
  }
}

export default function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [moodIndex, setMoodIndex] = useState(2);
  const [stars, setStars] = useState(4);
  const [text, setText] = useState("");
  const [contactOk, setContactOk] = useState(false);
  const [done, setDone] = useState(false);

  function submit() {
    saveFeedback({
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      moodIndex,
      stars,
      text: text.trim(),
      contactOk,
    });
    setDone(true);
    setTimeout(onClose, 1200);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
        aria-label="Close overlay"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg glass-panel border border-white/15 p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 id="feedback-title" className="text-lg font-semibold text-white">
              Feedback
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Please let us know about your experience.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
          How was your experience?
        </p>
        <div className="mb-6 flex flex-wrap justify-between gap-2">
          {MOODS.map((m, i) => (
            <button
              key={m.label}
              type="button"
              onClick={() => setMoodIndex(i)}
              title={m.label}
              className={`flex flex-1 min-w-[3rem] flex-col items-center gap-1 rounded-xl border p-2 transition ${
                moodIndex === i
                  ? `border-white/30 bg-gradient-to-br ${m.color} bg-opacity-30 shadow-lg`
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="hidden text-[10px] text-slate-400 sm:block">{m.label}</span>
            </button>
          ))}
        </div>

        <label className="mb-2 block text-xs font-medium text-slate-400">
          Write your feedback…
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Write your feedback..."
          className="mb-4 w-full resize-y rounded-xl border border-white/10 bg-navy-900/80 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-orange-400/40 focus:ring-2 focus:ring-orange-500/20"
        />

        <p className="mb-2 text-xs font-medium text-slate-400">Rating</p>
        <div className="mb-4 flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setStars(n)}
              className={`text-2xl transition ${n <= stars ? "text-amber-400 drop-shadow" : "text-slate-600"}`}
              aria-label={`${n} stars`}
            >
              ★
            </button>
          ))}
        </div>

        <label className="mb-6 flex cursor-pointer items-start gap-3 text-sm text-slate-400">
          <input
            type="checkbox"
            checked={contactOk}
            onChange={(e) => setContactOk(e.target.checked)}
            className="mt-1 rounded border-white/20 bg-navy-900"
          />
          <span>I agree to be contacted later regarding this feedback.</span>
        </label>

        <button
          type="button"
          onClick={submit}
          disabled={done}
          className="w-full rounded-xl bg-btn-feedback py-3 text-center text-sm font-semibold text-white shadow-lg transition hover:opacity-95 disabled:opacity-60"
        >
          {done ? "Thank you!" : "Submit Feedback"}
        </button>
      </div>
    </div>
  );
}
