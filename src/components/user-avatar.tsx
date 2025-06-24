"use client";

import { useState, useRef, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { logoutWithoutRedirect } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { LoadingModal } from "@/components/loading-modal";
import { useTheme } from "@/lib/theme-context";
import Link from "next/link";

interface UserAvatarProps {
  user: (User & {
    profile?: {
      username?: string | null;
      first_name?: string | null;
      last_name?: string | null;
    } | null
  }) | null;
}

export function UserAvatar({ user }: UserAvatarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    setIsLoggingOut(true);

    try {
      console.log('Starting logout process...');
      const result = await logoutWithoutRedirect();
      console.log('Logout result:', result);
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  const handleLogoutComplete = () => {
    console.log('Logout complete, redirecting to login...');
    window.location.href = '/login';
  };

  const getInitial = () => {
    if (user?.profile?.first_name) {
      return user.profile.first_name.charAt(0).toUpperCase();
    }
    if (user?.profile?.username) {
      return user.profile.username.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = () => {
    if (user?.profile?.first_name && user?.profile?.last_name) {
      return `${user.profile.first_name} ${user.profile.last_name}`;
    }
    if (user?.profile?.username) {
      return user.profile.username;
    }
    return user?.email;
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200 border-2 cursor-pointer ${
            isDark
              ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border-zinc-600 hover:border-zinc-500 shadow-sm"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300 hover:border-slate-400 shadow-sm"
          }`}
        >
          {getInitial()}
        </button>

        {isOpen && (
          <div
            className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg py-1 z-50 ${
              isDark ? "bg-zinc-800 border border-zinc-700" : "bg-white border border-gray-200"
            }`}
          >
            {user ? (
              <>
                <div className="p-2.5 border-b border-border">
                  <div className="text-sm font-medium truncate">{getUserDisplayName()}</div>
                  <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                </div>

                <div className="p-1">
                  <Link
                    href="/settings"
                    className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors duration-200 ${
                      isDark
                        ? "hover:bg-zinc-700 text-zinc-100"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`flex items-center gap-2 px-3 py-2 text-sm w-full text-left transition-colors duration-200 ${
                      isDark
                        ? "hover:bg-zinc-700 text-red-400 hover:text-red-300"
                        : "hover:bg-gray-100 text-red-600 hover:text-red-500"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm"
                  onClick={() => {
                    setIsOpen(false);
                    router.push('/login');
                  }}
                >
                  <LogOut className="h-3.5 w-3.5 mr-2" />
                  Login
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <LoadingModal
        isOpen={isLoggingOut}
        onComplete={handleLogoutComplete}
        operation="logout"
      />
    </>
  );
}