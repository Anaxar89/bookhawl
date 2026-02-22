/**
 * Toast notification utility
 */

let toastEl = null
let toastTimer = null

/**
 * @param {string} message
 * @param {'error'|'success'|'info'} type
 * @param {number} duration ms
 */
export function showToast(message, type = 'info', duration = 3500) {
  if (!toastEl) {
    toastEl = document.getElementById('toast')
  }

  if (!toastEl) return

  // Clear previous timer
  if (toastTimer) clearTimeout(toastTimer)

  // Reset classes
  toastEl.className = `toast toast--${type}`
  toastEl.textContent = message

  // Force reflow to re-trigger animation if already visible
  void toastEl.offsetWidth

  toastEl.classList.add('is-visible')

  toastTimer = setTimeout(() => {
    toastEl.classList.remove('is-visible')
  }, duration)
}
