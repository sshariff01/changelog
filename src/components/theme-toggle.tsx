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
      className="text-sm px-3 py-1 rounded
  bg-inherit text-inherit
  border border-transparent
  hover:bg-gray-100 dark:hover:bg-zinc-800
  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
    >
      Switch to {theme === "dark" ? "Light" : "Dark"} Mode
    </button>
  );
}