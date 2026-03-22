import { LayoutDashboard, History, Settings, Search, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";

export default function TopNav() {
  const { user } = useAuth();
  const { query: q, setQuery: setQ } = useSearch();

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-navy-950/80 px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center gap-4">
        <div className="flex items-center gap-2 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-emerald-600 text-sm font-bold text-navy-950">
            P
          </div>
        </div>

        <div className="relative hidden max-w-md flex-1 md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            placeholder="Search…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="glass-input !py-2.5 !pl-10 text-sm"
          />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-lg p-2 lg:hidden ${isActive ? "bg-white/10 text-teal-300" : "text-slate-400"}`
            }
            end
          >
            <LayoutDashboard className="h-5 w-5" />
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `rounded-lg p-2 lg:hidden ${isActive ? "bg-white/10 text-teal-300" : "text-slate-400"}`
            }
          >
            <History className="h-5 w-5" />
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `rounded-lg p-2 lg:hidden ${isActive ? "bg-white/10 text-teal-300" : "text-slate-400"}`
            }
          >
            <Settings className="h-5 w-5" />
          </NavLink>
          <div
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5"
            title={user?.email}
          >
            <User className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>
      <div className="mx-auto mt-3 max-w-6xl md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            placeholder="Search…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="glass-input !py-2.5 !pl-10 text-sm"
          />
        </div>
      </div>
    </header>
  );
}
