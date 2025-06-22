"use client";

import { useTheme } from "@/lib/theme-context";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      className={`relative w-16 h-10 rounded-full
  border transition-all duration-300 ease-in-out shadow-sm
  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2
  ${
    theme === "light"
      ? "bg-white border-gray-300 hover:bg-gray-50"
      : "bg-zinc-800 border-zinc-600 hover:bg-zinc-700"
  }`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {/* Sun icon (left side) */}
      <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
        theme === "light"
          ? "opacity-100 text-yellow-500"
          : "opacity-40 text-gray-400"
      }`}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      </div>

      {/* Moon icon (right side) */}
      <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
        theme === "dark"
          ? "opacity-100 text-blue-400"
          : "opacity-40 text-gray-400"
      }`}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>

      {/* Sliding indicator */}
      <div className={`absolute top-1.5 w-6 h-6 rounded-full shadow-sm transition-all duration-300 ease-in-out border ${
        theme === "light"
          ? "left-2 bg-gray-100 border-gray-200"
          : "left-8 bg-zinc-200 border-zinc-400"
      }`} />
    </button>
  );
}