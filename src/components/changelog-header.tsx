"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { AdminToggle } from "@/components/admin-toggle";
import { useAdmin } from "@/lib/admin-context";

export function ChangelogHeader() {
  const { isAdmin } = useAdmin();

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <h1 className="text-4xl font-bold">Changelog</h1>
        <AdminToggle />
      </div>
      <div className="flex items-center gap-4">
        {isAdmin && (
          <Link
            href="/create-post"
            className="flex items-center gap-1.5 px-3 h-8 text-[10px] font-medium rounded-full transition-colors border bg-blue-600 text-white hover:bg-blue-700 border-transparent dark:border-blue-400 dark:bg-transparent dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Post
          </Link>
        )}
        <ThemeToggle />
      </div>
    </div>
  );
}