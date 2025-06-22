import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/lib/theme-context";
import { AdminProvider } from "@/lib/admin-context";
import { EditingProvider } from "@/lib/editing-context";

export const metadata: Metadata = {
  title: "Changelog App",
  description: "A simple changelog app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AdminProvider>
            <EditingProvider>{children}</EditingProvider>
          </AdminProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
