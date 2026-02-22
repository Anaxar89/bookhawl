/**
 * Stars background generator
 * Generates random twinkling stars for the auth background
 */

/**
 * @param {HTMLElement} container
 * @param {number} count
 */
export function generateStars(container, count = 80) {
  const fragment = document.createDocumentFragment()

  for (let i = 0; i < count; i++) {
    const star = document.createElement('div')
    star.className = 'star'

    const size = Math.random() * 2.5 + 0.8
    const x    = Math.random() * 100
    const y    = Math.random() * 70       // only top 70% of screen
    const dur  = (Math.random() * 3 + 2).toFixed(1)
    const delay = (Math.random() * 4).toFixed(1)
    const minO  = (Math.random() * 0.15 + 0.05).toFixed(2)
    const maxO  = (Math.random() * 0.5 + 0.5).toFixed(2)

    star.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      top: ${y}%;
      --star-dur: ${dur}s;
      --star-delay: ${delay}s;
      --star-min: ${minO};
      --star-max: ${maxO};
    `

    fragment.appendChild(star)
  }

  container.appendChild(fragment)
}
