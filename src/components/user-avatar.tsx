"use client";

import { useState, useRef, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { logoutWithoutRedirect } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { LoadingModal } from "@/components/loading-modal";

interface UserAvatarProps {
  user: (User & { profile?: { username: string; first_name: string; last_name: string } }) | null;
}

export function UserAvatar({ user }: UserAvatarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

      // Add a small delay to ensure the session is properly cleared
      await new Promise(resolve => setTimeout(resolve, 500));

      // The LoadingModal will handle the redirect after showing the success message
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  const handleLogoutComplete = () => {
    console.log('Logout complete, redirecting to login...');
    // Use window.location for a hard redirect to ensure middleware picks up the session change
    window.location.href = '/login';
  };

  if (!user) return null;

  const getInitial = () => {
    if (user.profile?.first_name) {
      return user.profile.first_name.charAt(0).toUpperCase();
    }
    if (user.profile?.username) {
      return user.profile.username.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = () => {
    if (user.profile?.first_name && user.profile?.last_name) {
      return `${user.profile.first_name} ${user.profile.last_name}`;
    }
    if (user.profile?.username) {
      return user.profile.username;
    }
    return user.email;
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 rounded-full p-0 hover:bg-muted/50 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
            {getInitial()}
          </div>
        </Button>

        <div
          className={`absolute right-0 top-12 w-48 bg-background border border-border rounded-lg shadow-lg z-50 transition-all duration-200 ease-in-out ${
            isOpen
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="p-3 border-b border-border">
            <div className="text-sm font-medium">{getUserDisplayName()}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
          </div>

          <div className="p-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm"
              onClick={() => {
                setIsOpen(false);
                router.push('/settings');
              }}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <LoadingModal
        isOpen={isLoggingOut}
        onComplete={handleLogoutComplete}
        operation="logout"
      />
    </>
  );
}