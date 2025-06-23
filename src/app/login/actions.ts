'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  console.log('Login attempt with username:', username)

  // Validate required fields
  if (!username.trim()) {
    return { error: 'username', message: 'Username is required' }
  }
  if (!password) {
    return { error: 'password', message: 'Password is required' }
  }

  // First, check if the input looks like an email
  const isEmail = username.includes('@')

  let email: string

  if (isEmail) {
    // If it's an email, use it directly
    email = username
    console.log('Using email directly:', email)
  } else {
    // If it's a username, look it up in the profiles table
    console.log('Looking up username in profiles table:', username)

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, username')
      .eq('username', username)
      .single()

    console.log('Profile lookup result:', { profile, error: profileError?.message })

    if (profileError || !profile) {
      console.error('User not found:', profileError?.message)
      return { error: 'credentials', message: 'Invalid username or password' }
    }

    email = profile.email
    console.log('Found email for username:', email)
  }

  // Now authenticate with email and password using Supabase Auth
  console.log('Attempting authentication with email:', email)

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Login failed:', error.message)

    // Provide specific error message for email confirmation
    if (error.message.includes('Email not confirmed')) {
      return { error: 'general', message: 'Please check your email and click the confirmation link before logging in.' }
    }

    // For generic "Invalid login credentials", use a specific error type
    if (error.message === 'Invalid login credentials') {
      return { error: 'credentials', message: 'Invalid username or password' }
    }

    // Fallback for other unexpected auth errors
    return { error: 'general', message: 'An unexpected authentication error occurred.' }
  }

  console.log('Login successful, redirecting...')
  redirect('/changelog')
}