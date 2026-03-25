const STORAGE_KEY = 'prompt-assembly-theme'

;(function initTheme() {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s === 'light' || s === 'dark') {
      document.documentElement.dataset.theme = s
      return
    }
  } catch {
    /* ignore */
  }
  document.documentElement.dataset.theme = window.matchMedia('(prefers-color-scheme: dark)')
    .matches
    ? 'dark'
    : 'light'
})()
