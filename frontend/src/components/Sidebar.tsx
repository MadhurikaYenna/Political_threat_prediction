import { LayoutDashboard, History, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const linkBase =
  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition";
const inactive = "text-slate-400 hover:bg-white/5 hover:text-white";
const active = "bg-gradient-to-r from-teal-500/20 to-emerald-500/10 text-teal-300 border border-teal-500/20";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="fixed bottom-0 left-0 top-0 z-20 hidden w-64 flex-col border-r border-white/10 bg-navy-900/90 p-4 backdrop-blur-xl lg:flex">
      <div className="mb-10 flex items-center gap-2 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 text-lg font-bold text-navy-950 shadow-lg">
          P
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-teal-400/90">
            PSTP
          </p>
          <p className="text-sm font-semibold text-white">Threat Lab</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}
        >
          <LayoutDashboard className="h-5 w-5 shrink-0 opacity-80" />
          Dashboard
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}
        >
          <History className="h-5 w-5 shrink-0 opacity-80" />
          History
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}
        >
          <Settings className="h-5 w-5 shrink-0 opacity-80" />
          Settings
        </NavLink>
      </nav>

      <div className="mt-auto glass-panel border-white/10 p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 text-sm font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user?.name ?? "User"}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
