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
      className={`relative w-18 h-9 rounded-full
  border transition-all duration-300 ease-in-out shadow-inner
  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2
  ${
    theme === "light"
      ? "bg-gray-200 border-gray-300"
      : "bg-zinc-800 border-zinc-600"
  }`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {/* Faint sun icon (inactive in dark mode) */}
      <div className={`absolute left-2 top-1/2 -translate-y-1/2 text-zinc-700 transition-opacity duration-300 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}>
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
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

      {/* Faint moon icon (inactive in light mode) */}
      <div className={`absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 transition-opacity duration-300 ${theme === 'light' ? 'opacity-100' : 'opacity-0'}`}>
         <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
      </div>

      {/* Sliding indicator with the active icon */}
      <div className={`absolute top-1 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ease-in-out ${
        theme === "light"
          ? "left-1 bg-white text-gray-500"
          : "left-10 bg-slate-600 text-white"
      }`}>
        {theme === 'light' ? (
           <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
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
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </div>
    </button>
  );
}