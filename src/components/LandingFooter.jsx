import { useEffect, useState } from 'react'

/**
 * 统计与不蒜子 public/lib/busuanzi.js 同源（ibruce JSONP）。
 * 在 React 内用 JSONP 拉取并在基础值上叠加，避免静态脚本只执行一次、且早于首屏 DOM 导致无法写入的问题。
 */
const BUSUANZI_JSONP =
  'https://busuanzi.ibruce.info/busuanzi?jsonpCallback='

/** 访客数（site_uv）基础增量 */
const BASE_SITE_UV = 22466
/** 全站访问次数（site_pv）基础增量 */
const BASE_SITE_PV = 131982

function fetchBusuanziJsonp() {
  const cb = `bz_${Math.random().toString(36).slice(2)}`
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    const cleanup = () => {
      delete window[cb]
      script.remove()
    }
    window[cb] = (data) => {
      try {
        resolve(data)
      } finally {
        cleanup()
      }
    }
    script.onerror = () => {
      cleanup()
      reject(new Error('busuanzi load failed'))
    }
    script.src = `${BUSUANZI_JSONP}${cb}`
    document.head.appendChild(script)
  })
}

export default function LandingFooter() {
  const [siteUv, setSiteUv] = useState(null)
  const [sitePv, setSitePv] = useState(null)

  useEffect(() => {
    let cancelled = false
    fetchBusuanziJsonp()
      .then((data) => {
        if (cancelled || !data) return
        if (data.site_uv != null) {
          setSiteUv(BASE_SITE_UV + Number(data.site_uv))
        }
        if (data.site_pv != null) {
          setSitePv(BASE_SITE_PV + Number(data.site_pv))
        }
      })
      .catch(() => {
        console.error('busuanzi load failed')
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <footer className="landing-footer">
      <p>
        © AI造物 · 快出图 | 2026.03.10 | 保留所有权利 |
        联系我们：wellxabin@gmail.com
      </p>
      <p className="landing-footer-stats" aria-live="polite">
        访客数 {siteUv ?? '—'} · 访问次数 {sitePv ?? '—'}
      </p>
    </footer>
  )
}
