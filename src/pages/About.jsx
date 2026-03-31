import LandingHeader from '../components/LandingHeader'
import LandingFooter from '../components/LandingFooter'

export default function About() {
  return (
    <div className="landing-page">
      <div className="landing-bg">
        <div className="bg-layer bg-1" />
        <div className="bg-layer bg-2" />
        <div className="grain" />
      </div>

      <LandingHeader variant="simple" />

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

      <LandingFooter />
    </div>
  )
}
