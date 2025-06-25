"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ConfirmEmailPage() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Try to get the email from sessionStorage
    const storedEmail = sessionStorage.getItem("confirmEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If no email is found, redirect to login
      router.replace("/login");
    }
  }, [router]);

  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <Card className="mx-auto w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900">
        <CardHeader className="flex flex-col items-center gap-2 py-10">
          <div className="mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-zinc-800">
            <svg className="h-10 w-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-semibold text-zinc-100 text-center tracking-tight">Verify Your Email</CardTitle>
          <CardDescription className="text-lg text-zinc-300 text-center mt-4 leading-relaxed">
            A confirmation code has been sent to<br />
            <span className="font-semibold text-zinc-100">{email}</span>.<br />
            <br />
            <span className="text-zinc-400">Please check your inbox and follow the instructions to verify your account.</span>
          </CardDescription>
          <div className="mt-8 w-full flex justify-center">
            <Link
              href="/login"
              className="inline-block px-6 py-2 rounded-lg border border-emerald-900 text-emerald-300 font-medium text-base transition-colors hover:bg-emerald-900/30 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:ring-offset-2 focus:ring-offset-zinc-900"
            >
              &larr; Back to Login
            </Link>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}