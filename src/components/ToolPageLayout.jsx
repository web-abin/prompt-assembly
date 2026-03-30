import { useEffect } from 'react'
import LandingHeader from './LandingHeader'

/**
 * @param {{ title: string, children: import('react').ReactNode }} props
 */
export default function ToolPageLayout({ title, children }) {
  useEffect(() => {
    const prev = document.title
    document.title = `${title} · 快出图`
    return () => {
      document.title = prev
    }
  }, [title])

  return (
    <div className="landing-page">
      <div className="landing-bg">
        <div className="bg-layer bg-1" />
        <div className="bg-layer bg-2" />
        <div className="grain" />
      </div>

      <LandingHeader />

      <main className="landing-main tool-page-main">{children}</main>

      <footer className="landing-footer">
        <p>
          © AI造物 · 快出图 | 2026.03.10 | 保留所有权利 |
          联系我们：wellxabin@gmail.com
        </p>
      </footer>
    </div>
  )
}
