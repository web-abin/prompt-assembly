import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      title={isDark ? '切换为亮色' : '切换为暗色'}
      aria-label={isDark ? '切换为亮色主题' : '切换为暗色主题'}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        {isDark ? '☀' : '☾'}
      </span>
      <span className="theme-toggle-label">{isDark ? '亮色' : '暗色'}</span>
    </button>
  )
}
