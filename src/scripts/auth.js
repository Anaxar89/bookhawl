/**
 * BookHawl — Auth Page Controller
 * Handles: tab switching, email login/register, Google OAuth, Apple OAuth, forgot password
 */

import { generateStars }   from '../components/Stars.js'
import { showToast }       from '../components/Toast.js'
import { isValidEmail, validatePassword, setFieldError } from '../lib/validation.js'
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signInWithApple,
  resetPassword,
  getSession
} from '../lib/auth.js'

// ─────────────────────────────────────────────
// 0. Check if already logged in → redirect
// ─────────────────────────────────────────────
;(async () => {
  const { session } = await getSession()
  if (session) {
    window.location.href = '/bookhawl/app.html'
  }
})()

// ─────────────────────────────────────────────
// 1. Stars
// ─────────────────────────────────────────────
generateStars(document.getElementById('starsContainer'), 85)

// ─────────────────────────────────────────────
// 2. DOM refs
// ─────────────────────────────────────────────
const tabs = {
  login:    document.getElementById('tab-login'),
  register: document.getElementById('tab-register'),
}

const panels = {
  login:    document.getElementById('panel-login'),
  register: document.getElementById('panel-register'),
  forgot:   document.getElementById('panel-forgot'),
}

// ─────────────────────────────────────────────
// 3. Tab switching
// ─────────────────────────────────────────────
function showPanel(name) {
  Object.entries(panels).forEach(([key, el]) => {
    el.hidden = (key !== name)
  })
  Object.entries(tabs).forEach(([key, btn]) => {
    if (!btn) return
    btn.classList.toggle('is-active', key === name)
    btn.setAttribute('aria-selected', key === name)
  })
}

tabs.login.addEventListener('click',    () => showPanel('login'))
tabs.register.addEventListener('click', () => showPanel('register'))

// ─────────────────────────────────────────────
// 4. Button loading helper
// ─────────────────────────────────────────────
function setLoading(btn, loading) {
  btn.disabled = loading
  btn.classList.toggle('is-loading', loading)
}

// ─────────────────────────────────────────────
// 5. LOGIN FORM
// ─────────────────────────────────────────────
document.getElementById('form-login').addEventListener('submit', async (e) => {
  e.preventDefault()

  const emailInput    = document.getElementById('login-email')
  const passwordInput = document.getElementById('login-password')
  const emailErr      = document.getElementById('login-email-error')
  const passwordErr   = document.getElementById('login-password-error')
  const btn           = document.getElementById('btn-login')

  // Client-side validation
  let hasError = false

  if (!isValidEmail(emailInput.value)) {
    setFieldError(emailInput, emailErr, 'Inserisci un indirizzo email valido')
    hasError = true
  } else {
    setFieldError(emailInput, emailErr, null)
  }

  if (!passwordInput.value) {
    setFieldError(passwordInput, passwordErr, 'Inserisci la password')
    hasError = true
  } else {
    setFieldError(passwordInput, passwordErr, null)
  }

  if (hasError) return

  setLoading(btn, true)

  const { data, error } = await signInWithEmail(emailInput.value.trim(), passwordInput.value)

  setLoading(btn, false)

  if (error) {
    const msg = mapAuthError(error.message)
    showToast(msg, 'error')
    setFieldError(emailInput, emailErr, ' ')      // highlight field
    setFieldError(passwordInput, passwordErr, ' ')
    return
  }

  showToast('Benvenuto! 🦉', 'success')
  setTimeout(() => { window.location.href = '/bookhawl/app.html' }, 800)
})

// ─────────────────────────────────────────────
// 6. REGISTER FORM
// ─────────────────────────────────────────────
document.getElementById('form-register').addEventListener('submit', async (e) => {
  e.preventDefault()

  const nameInput     = document.getElementById('reg-name')
  const emailInput    = document.getElementById('reg-email')
  const passwordInput = document.getElementById('reg-password')
  const confirmInput  = document.getElementById('reg-confirm')
  const nameErr       = document.getElementById('reg-name-error')
  const emailErr      = document.getElementById('reg-email-error')
  const passwordErr   = document.getElementById('reg-password-error')
  const confirmErr    = document.getElementById('reg-confirm-error')
  const btn           = document.getElementById('btn-register')

  let hasError = false

  if (!nameInput.value.trim()) {
    setFieldError(nameInput, nameErr, 'Inserisci il tuo nome')
    hasError = true
  } else {
    setFieldError(nameInput, nameErr, null)
  }

  if (!isValidEmail(emailInput.value)) {
    setFieldError(emailInput, emailErr, 'Inserisci un indirizzo email valido')
    hasError = true
  } else {
    setFieldError(emailInput, emailErr, null)
  }

  const pwCheck = validatePassword(passwordInput.value)
  if (!pwCheck.valid) {
    setFieldError(passwordInput, passwordErr, pwCheck.message)
    hasError = true
  } else {
    setFieldError(passwordInput, passwordErr, null)
  }

  if (confirmInput.value !== passwordInput.value) {
    setFieldError(confirmInput, confirmErr, 'Le password non coincidono')
    hasError = true
  } else {
    setFieldError(confirmInput, confirmErr, null)
  }

  if (hasError) return

  setLoading(btn, true)

  const { data, error } = await signUpWithEmail(
    emailInput.value.trim(),
    passwordInput.value,
    nameInput.value.trim()
  )

  setLoading(btn, false)

  if (error) {
    showToast(mapAuthError(error.message), 'error')
    return
  }

  // Show success screen (email confirmation required)
  document.getElementById('form-register').style.display = 'none'
  document.querySelector('.auth-divider + .btn-social').style.display = 'none'
  const successEl = document.getElementById('register-success')
  successEl.classList.add('is-visible')
})

// ─────────────────────────────────────────────
// 7. FORGOT PASSWORD
// ─────────────────────────────────────────────
document.getElementById('btn-forgot').addEventListener('click', () => {
  showPanel('forgot')
  // Hide tabs visually but keep them in DOM
  document.querySelector('.auth-tabs').style.visibility = 'hidden'
})

document.getElementById('btn-back-to-login').addEventListener('click', () => {
  document.querySelector('.auth-tabs').style.visibility = 'visible'
  showPanel('login')
})

document.getElementById('form-forgot').addEventListener('submit', async (e) => {
  e.preventDefault()

  const emailInput = document.getElementById('forgot-email')
  const emailErr   = document.getElementById('forgot-email-error')
  const btn        = document.getElementById('btn-forgot-submit')

  if (!isValidEmail(emailInput.value)) {
    setFieldError(emailInput, emailErr, 'Inserisci un indirizzo email valido')
    return
  }
  setFieldError(emailInput, emailErr, null)

  setLoading(btn, true)

  const { error } = await resetPassword(emailInput.value.trim())

  setLoading(btn, false)

  if (error) {
    showToast(mapAuthError(error.message), 'error')
    return
  }

  document.getElementById('form-forgot').style.display = 'none'
  document.getElementById('forgot-success').classList.add('is-visible')
})

// ─────────────────────────────────────────────
// 8. OAUTH — Google
// ─────────────────────────────────────────────
async function handleGoogle() {
  const { error } = await signInWithGoogle()
  if (error) showToast(mapAuthError(error.message), 'error')
}

document.getElementById('btn-google').addEventListener('click', handleGoogle)
document.getElementById('btn-google-reg').addEventListener('click', handleGoogle)

// ─────────────────────────────────────────────
// 9. OAUTH — Apple
// ─────────────────────────────────────────────
async function handleApple() {
  const { error } = await signInWithApple()
  if (error) showToast(mapAuthError(error.message), 'error')
}

document.getElementById('btn-apple').addEventListener('click', handleApple)
document.getElementById('btn-apple-reg').addEventListener('click', handleApple)

// ─────────────────────────────────────────────
// 10. Error message mapping (IT)
// ─────────────────────────────────────────────
function mapAuthError(msg) {
  if (!msg) return 'Qualcosa è andato storto. Riprova.'
  const m = msg.toLowerCase()
  if (m.includes('invalid login credentials') || m.includes('invalid email or password')) {
    return 'Email o password non corretti'
  }
  if (m.includes('email not confirmed')) {
    return 'Conferma prima la tua email'
  }
  if (m.includes('user already registered') || m.includes('already been registered')) {
    return 'Esiste già un account con questa email'
  }
  if (m.includes('password should be at least')) {
    return 'La password deve avere almeno 6 caratteri'
  }
  if (m.includes('rate limit')) {
    return 'Troppi tentativi. Attendi qualche minuto.'
  }
  if (m.includes('network') || m.includes('fetch')) {
    return 'Errore di rete. Controlla la connessione.'
  }
  return 'Qualcosa è andato storto. Riprova.'
}
