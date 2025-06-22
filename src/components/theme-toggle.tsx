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
      className="text-sm px-3 py-1 border rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >
      Switch to {theme === "dark" ? "Light" : "Dark"} Mode
    </button>
  );
}