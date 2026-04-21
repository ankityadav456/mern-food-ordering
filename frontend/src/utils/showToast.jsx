import { toast } from "react-hot-toast";
import {
  CheckCircle,
  XCircle,
  Info,
  X,
} from "lucide-react";

export const showToast = (message, type = "success") => {
  const duration = 3000;

  const icon =
    type === "success" ? (
      <CheckCircle className="text-green-500" size={22} />
    ) : type === "error" ? (
      <XCircle className="text-red-500" size={22} />
    ) : (
      <Info className="text-orange-500" size={22} />
    );

  toast.custom(
    (t) => (
      <div
        className={`
          relative overflow-hidden
          w-[340px]
          flex items-center gap-3   /* ✅ FIXED */
          rounded-xl
          px-4 py-3
          shadow-xl
          backdrop-blur-lg
          border
          bg-white/95 dark:bg-[#1E1E1E]/95
          border-gray-200 dark:border-gray-700
          transition-all duration-300
          ${t.visible ? "animate-enter" : "animate-leave"}
        `}
      >
        {/* ICON */}
        <div className="shrink-0">{icon}</div>

        {/* MESSAGE */}
        <div className="flex-1 text-center">
          <p className="text-sm font-semibold text-gray-800 dark:text-white">
            {message}
          </p>
        </div>

        {/* CLOSE BUTTON */}
        <button
          onClick={() => toast.dismiss(t.id)}
          className="
            p-1.5 rounded-full
            text-gray-400
            hover:text-red-500
            hover:bg-gray-100
            dark:hover:bg-gray-800
            transition
          "
        >
          <X size={18} />
        </button>

        {/* PROGRESS BAR */}
        <div
          className="
            absolute bottom-0 left-0 h-[4px]
            bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600
            animate-progress
          "
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    ),
    { duration }
  );
};