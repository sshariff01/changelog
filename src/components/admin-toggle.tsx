"use client";

import { useAdmin } from "@/lib/admin-context";
import { useState } from "react";

export function AdminToggle() {
  const { isAdmin, toggleAdmin } = useAdmin();
  const [isHovered, setIsHovered] = useState(false);

  // Show shield if:
  // 1. We ARE in admin mode AND we are NOT hovering.
  // 2. We are NOT in admin mode AND we ARE hovering.
  const showShield = (isAdmin && !isHovered) || (!isAdmin && isHovered);

  return (
    <button
      onClick={toggleAdmin}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`p-1.5 rounded-full transition-colors duration-300 ease-in-out border cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500 ${
        isAdmin
          ? "bg-purple-200 text-white border-purple-400 dark:bg-purple-700 dark:border-transparent"
          : "bg-transparent text-gray-500 border-gray-300 dark:text-gray-400 dark:border-zinc-700"
      }`}
      title={isAdmin ? "Switch to Viewer View" : "Switch to Admin View"}
      aria-label={isAdmin ? "Disable Admin Mode" : "Enable Admin Mode"}
    >
      {showShield ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );
}