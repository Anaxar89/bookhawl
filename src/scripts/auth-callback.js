import { supabase } from '../lib/supabase.js'

async function handleCallback() {
  // Aspetta che Supabase elabori il token nell’URL
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error(error)
    window.location.replace('/')
    return
  }

  if (data.session) {
    window.location.replace('/app.html')
    return
  }

  // Se ancora non c'è sessione, ascolta il cambio stato
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      window.location.replace('/app.html')
    }
  })
}

handleCallback()