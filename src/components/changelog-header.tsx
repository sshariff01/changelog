"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { AdminToggle } from "@/components/admin-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { useAdmin } from "@/lib/admin-context";
import { useTheme } from "@/lib/theme-context";
import { useEditing } from "@/lib/editing-context";
import { User } from "@supabase/supabase-js";

interface ChangelogHeaderProps {
  user: (User & { profile?: { username: string; first_name: string; last_name: string } }) | null;
}

export function ChangelogHeader({ user }: ChangelogHeaderProps) {
  const { isAdmin } = useAdmin();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { editingPostId } = useEditing();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Changelog</h1>
        <div className="flex items-center gap-4">
          {isAdmin && !editingPostId && user && (
            <div className="hidden md:block">
              <Link
                href="/create-post"
                className={`group inline-flex items-center justify-center h-8 w-8 rounded-full overflow-hidden transition-all duration-300 ease-in-out border-2 hover:w-28 ${
                  isDark
                    ? "border-blue-500 text-blue-300 hover:bg-blue-500/20"
                    : "border-blue-200 text-blue-600 hover:bg-blue-50"
                }`}
              >
                <svg
                  className="transition-transform duration-300 ease-in-out"
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
                <span className="opacity-0 w-0 whitespace-nowrap transition-opacity duration-100 ease-in-out group-hover:opacity-100 group-hover:w-auto group-hover:ml-1.5 text-xs font-semibold">
                  New Post
                </span>
              </Link>
            </div>
          )}
          <div className={`flex items-center ${isAdmin ? 'gap-4' : 'gap-0'}`}>
            <ThemeToggle />
            {isAdmin && <UserAvatar user={user} />}
          </div>
        </div>
      </div>
      {user && (
        <div className="mt-4">
          <AdminToggle />
        </div>
      )}
    </>
  );
}