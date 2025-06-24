import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function HomePage({
  searchParams,
}: PageProps) {
  const supabase = await createClient()
  const params = await searchParams

  // Handle email confirmation
  if (params.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(params.code as string)

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
