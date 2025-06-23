'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return redirect('/login')
}

export async function logoutWithoutRedirect() {
  const supabase = await createClient()

  // Clear the session
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout error:', error)
    throw error
  }

  return { success: true }
}