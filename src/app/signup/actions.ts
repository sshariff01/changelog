'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = formData.get('first_name') as string
  const lastName = formData.get('last_name') as string
  const username = formData.get('username') as string
  const supabase = await createClient()

  // Validate required fields
  if (!firstName.trim()) {
    return { error: 'first_name', message: 'First name is required' }
  }
  if (!lastName.trim()) {
    return { error: 'last_name', message: 'Last name is required' }
  }
  if (!username.trim()) {
    return { error: 'username', message: 'Username is required' }
  }
  if (!email.trim()) {
    return { error: 'email', message: 'Email is required' }
  }
  if (!password) {
    return { error: 'password', message: 'Password is required' }
  }

  // Check if username already exists
  const { data: existingUsername, error: usernameCheckError } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single()

  if (usernameCheckError && usernameCheckError.code !== 'PGRST116') {
    return { error: 'Error checking username availability' }
  }

  if (existingUsername) {
    return { error: 'Username already taken' }
  }

  // Check if email already exists
  const { data: existingEmail, error: emailCheckError } = await supabase
    .from('profiles')
    .select('email')
    .eq('email', email)
    .single()

  if (emailCheckError && emailCheckError.code !== 'PGRST116') {
    return { error: 'Error checking email availability' }
  }

  if (existingEmail) {
    return { error: 'Email already registered' }
  }

  // Create the user account with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        username: username,
      },
    },
  })

  if (authError) {
    console.error('Signup failed:', authError.message)
    return { error: 'general', message: 'Failed to create account. Please try again.' }
  }

  if (authData.user) {
    console.log('User created successfully, updating profile for user ID:', authData.user.id)

    // Update the profile record with username, first_name, and last_name
    // The email and id are already set by the trigger
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        username: username,
        first_name: firstName,
        last_name: lastName,
      })
      .eq('id', authData.user.id)

    if (profileError) {
      console.error('Profile update failed:', profileError.message)
      // The user account was created but profile update failed
      // We should still allow the signup to proceed, but log the issue
      // The profile can be updated later during email confirmation
    } else {
      console.log('Profile updated successfully with username:', username)
    }
  }

  // TODO: Right now, Supabase sends a confirmation email.
  // We should show a message to the user to check their email.
  // For now, we'll just redirect to the homepage.
  redirect('/')
}