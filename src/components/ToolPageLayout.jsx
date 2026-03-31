import { useEffect } from 'react'
import LandingHeader from './LandingHeader'
import LandingFooter from './LandingFooter'

/**
 * @param {{ title: string, children: import('react').ReactNode, mainClassName?: string }} props
 */
export default function ToolPageLayout({ title, children, mainClassName = '' }) {
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

      <main
        className={['landing-main', 'tool-page-main', mainClassName].filter(Boolean).join(' ')}
      >
        {children}
      </main>

      <LandingFooter />
    </div>
  )
}
