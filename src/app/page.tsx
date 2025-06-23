import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from "next/image";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { code?: string }
}) {
  const supabase = await createClient()

  // Handle email confirmation
  if (searchParams.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(searchParams.code)

    if (!error) {
      // Email confirmed successfully, redirect to changelog
      redirect('/changelog')
    } else {
      console.error('Email confirmation failed:', error.message)
      // Redirect to login with error message
      redirect('/login?error=confirmation_failed')
    }
  }

  // Default redirect to changelog
  redirect('/changelog')
}
