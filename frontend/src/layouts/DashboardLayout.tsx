import { Outlet } from "react-router-dom";
import FeedbackFab from "../components/FeedbackFab";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import { SearchProvider } from "../context/SearchContext";

export default function DashboardLayout() {
  return (
    <SearchProvider>
      <div className="mesh-bg network-pattern min-h-screen">
        <div className="pointer-events-none fixed inset-0 bg-grid-glow opacity-50" />
        <div className="relative z-10 flex min-h-screen">
          <Sidebar />
          <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
            <TopNav />
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
              <Outlet />
            </main>
          </div>
        </div>
        <FeedbackFab />
      </div>
    </SearchProvider>
  );
}
