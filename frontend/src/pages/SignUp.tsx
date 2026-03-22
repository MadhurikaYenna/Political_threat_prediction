import { Lock, Mail, User } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../layouts/AuthLayout";

export default function SignUp() {
  const { signUp } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [email2, setEmail2] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (email.trim().toLowerCase() !== email2.trim().toLowerCase()) {
      setError("Email addresses do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      signUp(name, email, password);
      nav("/", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-up failed.");
    }
  }

  return (
    <AuthLayout rightTitle="Sign Up">
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {error ? (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        ) : null}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="glass-input"
              placeholder="Richard Davis"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass-input"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Confirm Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email2}
              onChange={(e) => setEmail2(e.target.value)}
              className="glass-input"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-400">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass-input"
              placeholder="••••••••"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-btn-primary py-3 text-sm font-semibold text-navy-950 shadow-lg transition hover:brightness-110"
        >
          Sign Up
        </button>
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/sign-in" className="font-medium text-teal-400 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
