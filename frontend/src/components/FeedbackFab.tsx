import { MessageCircleHeart } from "lucide-react";
import { useState } from "react";
import FeedbackModal from "./FeedbackModal";

export default function FeedbackFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-btn-feedback px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-purple-900/40 transition hover:scale-[1.02] hover:opacity-95"
      >
        <MessageCircleHeart className="h-5 w-5" />
        Feedback
      </button>
      {open ? <FeedbackModal onClose={() => setOpen(false)} /> : null}
    </>
  );
}
