import { Link } from 'react-router-dom'
import logoUrl from '../assets/icon/logo.svg'

export default function About() {
  return (
    <div className="landing-page">
      <div className="landing-bg">
        <div className="bg-layer bg-1" />
        <div className="bg-layer bg-2" />
        <div className="grain" />
      </div>

      <header className="landing-header">
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
          <Link className="nav-link" to="/">
            返回首页
          </Link>
        </nav>
      </header>

      <main className="landing-main about-main">
        <article className="about-panel">
          <h2 className="about-heading">关于本站</h2>
          <p className="about-lead">
            快出图（Prompt Assembly）是一套面向创作者与前端开发者的轻量工具站，提供
            Prompt 结构化拼接、视频转序列帧、精灵图合成、图像去背景等能力，尽量在浏览器端完成处理，开箱即用。
          </p>
          <p className="about-text">
            我们会持续补充实用小工具；若你有功能建议或合作意向，欢迎通过下方方式联系。
          </p>

          <h2 className="about-heading about-heading-spaced">联系方式</h2>
          <ul className="about-contact-list">
            <li>
              <span className="about-contact-label">邮箱</span>
              <a className="about-contact-value" href="mailto:wellxabin@gmail.com">
                wellxabin@gmail.com
              </a>
              <p className="about-contact-value">QQ：3532371314</p>
            </li>
            <li>
              <span className="about-contact-label">商务合作</span>
              <span className="about-contact-value about-contact-note">
                请邮件说明合作方向与期望，我们会在工作日内回复。
              </span>
            </li>
          </ul>
        </article>
      </main>

      <footer className="landing-footer">
        <p>
          © AI造物 · 快出图 | 2026.03.10 | 保留所有权利 |
          联系我们：wellxabin@gmail.com
        </p>
      </footer>
    </div>
  )
}
