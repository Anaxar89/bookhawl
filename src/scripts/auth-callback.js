/**
 * BookHawl — Auth Callback
 * Handles OAuth redirects (Google, Apple) and email confirmation links.
 * Supabase automatically parses the URL hash/query params.
 */

import { supabase } from '../lib/supabase.js'

async function handleCallback() {
  try {
    // exchangeCodeForSession handles PKCE flow (code param in URL)
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')

    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) throw error
    }

    // Check if we have a valid session now
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      // No session — possibly just an email confirmation
      // Redirect to auth with a message
      window.location.href = '/src/pages/auth.html?confirmed=1'
      return
    }

    // Logged in → go to app
    window.location.href = '/src/pages/app.html'

  } catch (err) {
    console.error('Auth callback error:', err)
    window.location.href = '/src/pages/auth.html?error=callback'
  }
}

handleCallback()
