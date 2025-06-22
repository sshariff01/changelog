"use client";

import { useAdmin } from "@/lib/admin-context";
import { useTheme } from "@/lib/theme-context";

export function AdminToggle() {
  const { isAdmin, toggleAdmin } = useAdmin();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleAdmin}
      className={`relative flex items-center h-7 w-[70px] rounded-full cursor-pointer transition-colors duration-300 ease-in-out border-2 bg-clip-padding ${
        isAdmin
          ? isDark ? "bg-purple-800/60 border-purple-500/80" : "bg-purple-200/95 border-purple-300"
          : isDark ? "bg-zinc-700/95 border-slate-700" : "border-slate-200 bg-transparent"
      }`}
      title={isAdmin ? "Switch to Viewer View" : "Switch to Admin View"}
      aria-label={isAdmin ? "Disable Admin Mode" : "Enable Admin Mode"}
    >
      {/* Sliding indicator with icon */}
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full flex items-center justify-center shadow-md transform transition-transform duration-300 ease-in-out ${
          isAdmin
            ? `translate-x-0 ${isDark ? "bg-[#21012E] text-slate-50" : "bg-white text-purple-600"}`
            : `translate-x-[42px] ${isDark ? "bg-black text-slate-50" : "bg-white text-gray-600"}`
        }`}
      >
        {isAdmin ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </div>

      {/* Text Labels */}
      <span
        className={`absolute right-2 text-[10px] font-bold transition-opacity duration-300 ${
          isAdmin ? "opacity-100" : "opacity-0"
        } ${isDark ? "text-slate-200" : "text-purple-700"}`}
      >
        Admin
      </span>
      <span
        className={`absolute left-2 text-[10px] font-bold transition-opacity duration-300 ${
          !isAdmin ? "opacity-100" : "opacity-0"
        } ${isDark ? "text-slate-200" : "text-gray-700"}`}
      >
        Viewer
      </span>
    </button>
  );
}