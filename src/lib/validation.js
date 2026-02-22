/**
 * Form validation utilities
 */

/**
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

/**
 * @param {string} password
 * @returns {{ valid: boolean, message: string }}
 */
export function validatePassword(password) {
  if (password.length < 8) {
    return { valid: false, message: 'La password deve avere almeno 8 caratteri' }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Inserisci almeno una lettera maiuscola' }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Inserisci almeno un numero' }
  }
  return { valid: true, message: '' }
}

/**
 * Show or hide field error
 * @param {HTMLInputElement} input
 * @param {HTMLElement} msgEl
 * @param {string|null} message  - null = clear error
 */
export function setFieldError(input, msgEl, message) {
  if (message) {
    input.classList.add('is-error')
    msgEl.textContent = message
    msgEl.classList.add('is-visible')
  } else {
    input.classList.remove('is-error')
    msgEl.classList.remove('is-visible')
  }
}
