import { supabase } from '../lib/supabase.js'

async function handleCallback() {
  try {
    const code = new URLSearchParams(window.location.search).get('code')
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) throw error
    }

    const { data: { session }, error } = await supabase.auth.getSession()
    if (error || !session) {
      window.location.href = `${window.location.origin}/?confirmed=1`
      return
    }
    window.location.href = `${window.location.origin}/app.html`
  } catch (err) {
    console.error('Auth callback error:', err)
    window.location.href = `${window.location.origin}/?error=callback`
  }
}

handleCallback()