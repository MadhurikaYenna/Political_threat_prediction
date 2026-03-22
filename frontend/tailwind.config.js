/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "Segoe UI", "Roboto", "sans-serif"],
      },
      colors: {
        navy: {
          950: "#050810",
          900: "#0a0e1a",
          850: "#0d1224",
          800: "#111827",
        },
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(56, 189, 248, 0.15), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(168, 85, 247, 0.08), transparent), radial-gradient(ellipse 50% 30% at 0% 80%, rgba(34, 211, 238, 0.06), transparent)",
        "btn-primary": "linear-gradient(135deg, #14b8a6 0%, #22c55e 100%)",
        "btn-feedback": "linear-gradient(135deg, #f97316 0%, #a855f7 100%)",
        "btn-danger": "linear-gradient(135deg, #fb923c 0%, #ef4444 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        glow: "0 0 40px rgba(45, 212, 191, 0.15)",
      },
    },
  },
  plugins: [],
};
