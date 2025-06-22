import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/lib/theme-context";
import { AdminProvider } from "@/lib/admin-context";

export const metadata: Metadata = {
  title: "Changelog App",
  description: "A simple changelog app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AdminProvider>{children}</AdminProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
