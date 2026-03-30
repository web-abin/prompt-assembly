import { Link } from 'react-router-dom'
import giftUrl from '../assets/gift.png'
import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import RedeemModal from '../components/RedeemModal'
import logoUrl from '../assets/icon/logo.svg'
import qrcodeUrl from '../assets/qrcode.png'
export default function Landing() {
  const [redeemOpen, setRedeemOpen] = useState(false)
  const { showToast } = useToast()

  const base = import.meta.env.BASE_URL || '/'
  const tools = [
    {
      key: 'prompts',
      title: 'Prompt 拼接',
      desc: '结构化拼接、多模版管理、占位符一键替换与复制',
      href: '#/prompts',
      internal: true
    },
    {
      key: 'frames',
      title: '视频转序列帧',
      desc: '从视频中提取序列帧并预览、打包下载',
      href: `${base}sequence-frame.html`
    },
    {
      key: 'spritesheet',
      title: '精灵图合成',
      desc: '多张图片快速合成 SpriteSheet 并导出通用 JSON',
      href: `${base}spritesheet.html`
    },
    // {
    //   key: 'remove',
    //   title: '去背景/去水印',
    //   desc: '轻量图像处理，快速去除背景或模糊覆盖水印',
    //   href: `${base}remove-watermark.html`
    // },
    // {
    //   key: 'gif',
    //   title: 'GIF 合成与拆分',
    //   desc: '多图合成 GIF，或将 GIF 拆成序列帧导出',
    //   href: `${base}gif-tool.html`
    // },
    {
      key: 'batch-resize',
      title: '图片批量改尺寸',
      desc: '指定统一宽度，批量缩放多张图片并预览',
      href: `${base}batch-resize.html`
    },
    // {
    //   key: 'image-compress',
    //   title: '图片压缩',
    //   desc: '可调压缩质量，支持批量处理与预览',
    //   href: `${base}image-compress.html`
    // }
  ]

  return (
    <div className="landing-page">
      <div className="landing-bg">
        <div className="bg-layer bg-1" />
        <div className="bg-layer bg-2" />
        <div className="grain" />
      </div>

      <header className="landing-header">
        <div className="brand">
          <div className="logo">
            <img src={logoUrl} alt="" />
          </div>
          <div className="brand-text">
            <h1 className="brand-title">快出图</h1>
            <p className="brand-sub">轻量、实用的设计工具集合</p>
          </div>
        </div>
        <nav className="landing-nav">
          <Link className="nav-link" to="/about">
            关于/商务合作
          </Link>
          <span className="nav-with-qrcode">
            <a className="nav-link" href={`${base}spritesheet.html`}>
              🎁 免费领取提示词大全
            </a>
            <div className="nav-qrcode-popover" role="tooltip">
              <img
                src={qrcodeUrl}
                alt="公众号二维码"
                className="nav-qrcode-popover-img"
                width={200}
                height={200}
              />
              <p className="nav-qrcode-popover-caption">扫码关注公众号，发送“生图提示词”获取Nano、即梦等提示词大全</p>
            </div>
          </span>
        </nav>
      </header>

      <main className="landing-main">
        <section className="hero">
          <h2 className="hero-title">更快产出视觉素材与 AI 产物</h2>
          <p className="hero-desc">
            面向创作者与前端的小而美工具，开箱即用、纯前端运行。
          </p>
          <div className="hero-actions">
            <Link to="/prompts" className="btn btn-primary-lg">
              开始使用
            </Link>
            <a href={`${base}spritesheet.html`} className="btn btn-ghost">
              试试 SpriteSheet
            </a>
          </div>
        </section>

        <section className="feature-grid">
          {tools.map((t) =>
            t.internal ? (
              <Link key={t.key} to="/prompts" className="feature-card">
                <div className="feature-card-head">
                  <span className="dot" />
                  <h3>{t.title}</h3>
                </div>
                <p>{t.desc}</p>
                <span className="feature-more">进入</span>
              </Link>
            ) : (
              <a key={t.key} href={t.href} className="feature-card">
                <div className="feature-card-head">
                  <span className="dot" />
                  <h3>{t.title}</h3>
                </div>
                <p>{t.desc}</p>
                <span className="feature-more">打开</span>
              </a>
            )
          )}
        </section>
      </main>

      <footer className="landing-footer">
        <p>
          © AI造物 · 快出图 | 2026.03.10 | 保留所有权利 |
          联系我们：wellxabin@gmail.com
        </p>
      </footer>

      <img
        src={giftUrl}
        alt="礼物"
        className="gift-float"
        onClick={() => setRedeemOpen(true)}
      />
      <RedeemModal
        open={redeemOpen}
        onClose={() => setRedeemOpen(false)}
        onRedeemed={() => showToast('兑换成功')}
        message="使用兑换码才能享受更多权益"
      />
    </div>
  )
}
