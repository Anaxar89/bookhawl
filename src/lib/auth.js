import { supabase } from './supabase.js'

/**
 * Registrazione con email + password
 * @param {string} email
 * @param {string} password
 * @param {string} displayName
 * @returns {Promise<{data, error}>}
 */
export async function signUpWithEmail(email, password, displayName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
      emailRedirectTo: `${window.location.origin}/auth-callback.html`
    }
  })
  return { data, error }
}

/**
 * Login con email + password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{data, error}>}
 */
export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

/**
 * Login / Registrazione con Google OAuth
 * @returns {Promise<{data, error}>}
 */
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth-callback.html`
    }
  })
  return { data, error }
}

/**
 * Login / Registrazione con Apple OAuth
 * @returns {Promise<{data, error}>}
 */
export async function signInWithApple() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: `${window.location.origin}/auth-callback.html`
    }
  })
  return { data, error }
}

/**
 * Reset password via email
 * @param {string} email
 * @returns {Promise<{data, error}>}
 */
export async function resetPassword(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/src/pages/reset-password.html`
  })
  return { data, error }
}

/**
 * Logout
 * @returns {Promise<{error}>}
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Recupera la sessione corrente
 * @returns {Promise<{session, error}>}
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}
