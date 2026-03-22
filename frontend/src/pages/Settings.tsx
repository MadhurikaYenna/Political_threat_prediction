import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { clearAppData } from "../lib/storage";

export default function Settings() {
  const { signOut } = useAuth();
  const nav = useNavigate();

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-400">
          Session and local data for this demo UI (no server-side accounts).
        </p>
      </div>

      <div className="glass-panel space-y-4 border-white/10 p-6">
        <h2 className="text-sm font-semibold text-slate-300">Account</h2>
        <button
          type="button"
          onClick={() => {
            signOut();
            nav("/sign-in", { replace: true });
          }}
          className="w-full rounded-xl border border-white/15 bg-white/5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Sign out
        </button>
      </div>

      <div className="glass-panel space-y-4 border-white/10 p-6">
        <h2 className="text-sm font-semibold text-slate-300">Data</h2>
        <p className="text-xs text-slate-500">
          Clears saved users, session, prediction history, aggregate counts, and feedback stored in
          this browser.
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("Reset all local app data?")) {
              clearAppData();
              signOut();
              nav("/sign-in", { replace: true });
            }
          }}
          className="w-full rounded-xl bg-btn-danger py-3 text-sm font-semibold text-white shadow-lg"
        >
          Clear all local data
        </button>
      </div>

      <div className="glass-panel border-white/10 p-6 text-xs text-slate-500">
        <p className="mb-2 font-medium text-slate-400">Privacy Policy &amp; Terms</p>
        <p>
          This prototype stores credentials and history in <code className="text-slate-400">localStorage</code>{" "}
          for demonstration only. Do not use real passwords.
        </p>
      </div>
    </div>
  );
}
