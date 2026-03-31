import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import logoUrl from '../assets/icon/logo.svg'
import qrcodeUrl from '../assets/qrcode.png'
import FollowQrcodeModal from './FollowQrcodeModal'

const MOBILE_MAX_CSS = '(max-width: 640px)'

/**
 * @param {{ variant?: 'full' | 'simple' }} props
 * full：与首页一致（关于 + 提示词领取）；simple：关于页用「返回首页」
 */
export default function LandingHeader({ variant = 'full' }) {
  const [followModalOpen, setFollowModalOpen] = useState(false)

  const handlePromptLinkClick = useCallback((e) => {
    if (typeof window !== 'undefined' && window.matchMedia(MOBILE_MAX_CSS).matches) {
      e.preventDefault()
      setFollowModalOpen(true)
    }
  }, [])

  return (
    <>
    <header id="landing-app-header" className="landing-header">
      <Link to="/" className="brand brand-link">
        <div className="logo">
          <img src={logoUrl} alt="" />
        </div>
        <div className="brand-text">
          <h1 className="brand-title">快出图</h1>
          <p className="brand-sub">轻量、实用的设计工具集合</p>
        </div>
      </Link>
      <nav className="landing-nav">
        {variant === 'simple' ? (
          <Link className="nav-link" to="/">
            返回首页
          </Link>
        ) : (
          <>
            <Link className="nav-link" to="/about">
              关于/商务合作
            </Link>
            <span className="nav-with-qrcode">
              <Link
                className="nav-link"
                to="/spritesheet"
                onClick={handlePromptLinkClick}
              >
                🎁 免费领取提示词大全
              </Link>
              <div className="nav-qrcode-popover" role="tooltip">
                <img
                  src={qrcodeUrl}
                  alt="公众号二维码"
                  className="nav-qrcode-popover-img"
                  width={200}
                  height={200}
                />
                <p className="nav-qrcode-popover-caption">
                  扫码关注公众号，发送「生图提示词」获取 Nano、即梦等提示词大全
                </p>
              </div>
            </span>
          </>
        )}
      </nav>
    </header>
    {variant === 'full' && (
      <FollowQrcodeModal
        open={followModalOpen}
        onClose={() => setFollowModalOpen(false)}
      />
    )}
    </>
  )
}
