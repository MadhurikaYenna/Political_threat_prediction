import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export default function AuthLayout({
  children,
  rightTitle,
}: {
  children: ReactNode;
  rightTitle: string;
}) {
  return (
    <div className="mesh-bg network-pattern relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-glow opacity-90" />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-12 lg:flex-row lg:items-center lg:gap-16">
        <section className="flex-1 space-y-6 lg:pr-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-teal-300/90">
            Hybrid lexicon + ML
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.35rem]">
            Political Security Threat Prediction
          </h1>
          <p className="max-w-lg text-base text-slate-400">
            Hybrid lexicon-based and machine learning approach for analyzing political
            content from news and social sources — preprocessing, sentiment, and
            multi-classifier threat scoring.
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
              TF-IDF + DT / NB / SVM
            </span>
            <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
              VADER + emotion lexicon
            </span>
          </div>
        </section>

        <section className="w-full flex-1 lg:max-w-md">
          <div className="glass-panel p-8 shadow-glow">
            <h2 className="text-center text-xl font-semibold text-white">{rightTitle}</h2>
            {children}
          </div>
          <div className="mt-6 flex justify-center gap-6 text-xs text-slate-500">
            <Link to="#" className="hover:text-teal-400">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-teal-400">
              Terms of Service
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
