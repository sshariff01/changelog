"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { AdminToggle } from "@/components/admin-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { useAdmin } from "@/lib/admin-context";
import { useTheme } from "@/lib/theme-context";
import { useEditing } from "@/lib/editing-context";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";

interface ChangelogHeaderProps {
  user: (User & { profile?: { username: string; first_name: string; last_name: string } }) | null;
}

export function ChangelogHeader({ user }: ChangelogHeaderProps) {
  const { isAdmin } = useAdmin();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { editingPostId } = useEditing();

  return (
    <div className="flex items-start justify-between mb-8">
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl md:text-4xl font-bold">Changelog</h1>
        {user && (
          <div>
            <AdminToggle />
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-3 pt-1">
        {user ? (
          <UserAvatar user={user} />
        ) : (
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">
                Sign Up
              </Button>
            </Link>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="hidden md:flex">
            {isAdmin && !editingPostId && (
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
            )}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}