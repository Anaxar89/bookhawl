import { supabase } from './supabase.js'

const BASE_URL  = window.location.origin
const RESET_URL = `${BASE_URL}/reset-password.html`

/**
 * Registrazione email/password
 */
export async function signUpWithEmail(email, password, displayName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
      emailRedirectTo: BASE_URL
    }
  })

  return { data, error }
}

/**
 * Login email/password
 */
export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  return { data, error }
}

/**
 * Login Google OAuth
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: BASE_URL
    }
  })

  return { data, error }
}

/**
 * Login Apple OAuth
 */
export async function signInWithApple() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: BASE_URL
    }
  })

  return { data, error }
}

/**
 * Reset password
 */
export async function resetPassword(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: RESET_URL
  })

  return { data, error }
}

/**
 * Logout
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Ottieni sessione corrente
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}