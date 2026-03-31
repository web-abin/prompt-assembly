import { useLayoutEffect, useState } from 'react'
import ToolPageLayout from './ToolPageLayout'
import styles from './EmbeddedHtmlTool.module.css'

/**
 * 公共 Header + Footer，中间全宽 iframe 嵌入 public 下的静态 HTML。
 * iframe 高度 = 视口高度 − 顶部 header 实际高度（随布局变化更新）。
 * @param {{ title: string, htmlFile: string, iframeTitle?: string }} props
 */
export default function EmbeddedHtmlTool({ title, htmlFile, iframeTitle }) {
  const normalized = htmlFile.replace(/^\/+/, '')
  const src = `${import.meta.env.BASE_URL}${normalized}`
  const [iframeHeightPx, setIframeHeightPx] = useState(null)

  useLayoutEffect(() => {
    const header = document.getElementById('landing-app-header')
    if (!header) return undefined

    const update = () => {
      const h = header.getBoundingClientRect().height
      setIframeHeightPx(Math.max(0, window.innerHeight - h))
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(header)
    window.addEventListener('resize', update)
    const vv = window.visualViewport
    vv?.addEventListener('resize', update)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
      vv?.removeEventListener('resize', update)
    }
  }, [])

  return (
    <ToolPageLayout title={title} mainClassName={styles.embeddedMain}>
      <iframe
        className={styles.frame}
        title={iframeTitle || title}
        src={src}
        style={
          iframeHeightPx != null ? { height: iframeHeightPx, minHeight: iframeHeightPx } : undefined
        }
      />
    </ToolPageLayout>
  )
}
