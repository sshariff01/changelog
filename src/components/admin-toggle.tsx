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
      className={`relative flex items-center h-8 w-20 rounded-full cursor-pointer transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500 ${
        isAdmin
          ? isDark ? "bg-purple-600/95" : "bg-purple-300/95"
          : isDark ? "bg-zinc-700/95" : "bg-gray-300/95"
      }`}
      title={isAdmin ? "Switch to Viewer View" : "Switch to Admin View"}
      aria-label={isAdmin ? "Disable Admin Mode" : "Enable Admin Mode"}
    >
      {/* Sliding indicator with icon */}
      <div
        className={`absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md transform transition-transform duration-300 ease-in-out ${
          isAdmin
            ? `translate-x-0 bg-white ${isDark ? "text-purple-600" : "text-purple-600"}`
            : `translate-x-[48px] bg-white ${isDark ? "text-gray-500" : "text-gray-600"}`
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
        className={`absolute right-2.5 text-[10px] font-bold transition-opacity duration-300 ${
          isAdmin ? "opacity-100" : "opacity-0"
        } ${isDark ? "text-white" : "text-purple-700"}`}
      >
        Admin
      </span>
      <span
        className={`absolute left-2.5 text-[10px] font-bold transition-opacity duration-300 ${
          !isAdmin ? "opacity-100" : "opacity-0"
        } ${isDark ? "text-white" : "text-gray-700"}`}
      >
        Viewer
      </span>
    </button>
  );
}