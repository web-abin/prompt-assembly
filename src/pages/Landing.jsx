import { Link } from 'react-router-dom'
import giftUrl from '../assets/gift.png'
import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import RedeemModal from '../components/RedeemModal'
import LandingHeader from '../components/LandingHeader'
import LandingFooter from '../components/LandingFooter'

export default function Landing() {
  const [redeemOpen, setRedeemOpen] = useState(false)
  const { showToast } = useToast()

  const tools = [
    {
      key: 'prompts',
      title: 'Prompt 拼接',
      desc: '结构化拼接、多模版管理、占位符一键替换与复制',
      to: '/prompts'
    },
    {
      key: 'frames',
      title: '视频转序列帧',
      desc: '从视频中提取序列帧并预览、打包下载',
      to: '/sequence-frame'
    },
    {
      key: 'spritesheet',
      title: '精灵图合成',
      desc: '多张图片快速合成 SpriteSheet 并导出通用 JSON',
      to: '/spritesheet'
    },
    {
      key: 'img-to-spritesheet',
      title: '精灵图采集',
      desc: '从整张贴图智能提取与挑选元素，导出选用',
      to: '/img-to-spritesheet'
    },
    {
      key: 'batch-resize',
      title: '图片批量改尺寸',
      desc: '指定统一宽度，批量缩放多张图片并预览',
      to: '/batch-resize'
    },
    {
      key: 'gif-tool',
      title: 'GIF 合成与拆分',
      desc: '多图合成 GIF、或拆分 GIF 为逐帧预览',
      to: '/gif-tool'
    },
    {
      key: 'remove-background',
      title: '通用背景去除',
      desc: '按背景色抠图、边缘羽化，导出透明 PNG（Canvas 纯前端）',
      to: '/remove-background'
    },
    {
      key: 'image-compress',
      title: '图片压缩',
      desc: '批量压缩画质与体积，单张下载或一键 ZIP 打包',
      to: '/image-compress'
    }
  ]

  return (
    <div className="landing-page">
      <div className="landing-bg">
        <div className="bg-layer bg-1" />
        <div className="bg-layer bg-2" />
        <div className="grain" />
      </div>

      <LandingHeader />

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
            <Link to="/spritesheet" className="btn btn-ghost">
              试试 SpriteSheet
            </Link>
          </div>
        </section>

        <section className="feature-grid">
          {tools.map((t) => (
            <Link key={t.key} to={t.to} className="feature-card">
              <div className="feature-card-head">
                <span className="dot" />
                <h3>{t.title}</h3>
              </div>
              <p>{t.desc}</p>
              <span className="feature-more">进入</span>
            </Link>
          ))}
        </section>
      </main>

      <LandingFooter />

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
