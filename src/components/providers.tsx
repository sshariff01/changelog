"use client";

import { ThemeProvider } from "@/lib/theme-context";
import { useTheme } from "@/lib/theme-context";
import { useEffect } from "react";

function ThemeApplier({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ThemeApplier>{children}</ThemeApplier>
    </ThemeProvider>
  );
}