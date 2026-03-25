import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'prompt-assembly-theme'

const ThemeContext = createContext(null)

function getInitialTheme() {
  if (typeof document !== 'undefined') {
    const d = document.documentElement.dataset.theme
    if (d === 'light' || d === 'dark') return d
  }
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s === 'light' || s === 'dark') return s
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      /** 在亮色 / 暗色之间切换 */
      toggleTheme: () => setThemeState((t) => (t === 'light' ? 'dark' : 'light')),
      setTheme: setThemeState,
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- useTheme 与 ThemeProvider 配对导出
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
