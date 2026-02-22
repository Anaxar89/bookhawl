import owlOk from '../assets/owl-ok.png'
import owlKo from '../assets/owl-ko.png'

let toastEl = null
let toastTimer = null

export function showToast(message, type = 'info', duration = 3500) {
  if (!toastEl) {
    toastEl = document.getElementById('toast')
  }
  if (!toastEl) return

  if (toastTimer) clearTimeout(toastTimer)

  const owl = (type === 'error') ? owlKo : owlOk

  toastEl.className = `toast toast--${type}`
  toastEl.innerHTML = `
    <img class="toast__owl" src="${owl}" alt="BookHawl owl">
    <div class="toast__bubble">${message}</div>
  `

  void toastEl.offsetWidth
  toastEl.classList.add('is-visible')

  toastTimer = setTimeout(() => {
    toastEl.classList.remove('is-visible')
  }, duration)
}