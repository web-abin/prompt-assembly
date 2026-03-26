import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import { useToast } from '../context/ToastContext'
import { addTemplate } from '../lib/storage'
import { data } from '../data/template'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'

function CartIcon() {
  return (
    <svg
      className="icon-btn-svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 6h15l-2 8H8L6 6z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="19" r="1.8" fill="currentColor" />
      <circle cx="18" cy="19" r="1.8" fill="currentColor" />
    </svg>
  )
}

export default function Mall() {
  const { showToast } = useToast()
  const [q, setQ] = useState('')
  const templates = useMemo(() => {
    const list = Array.isArray(data) ? data : []
    const norm = String(q).trim().toLowerCase()
    if (!norm) return list
    return list.filter((t) =>
      String(t.title || '')
        .toLowerCase()
        .includes(norm)
    )
  }, [q])

  function handleAddToMy(t) {
    addTemplate({ title: t.title ?? '未命名模版', body: t.content ?? '' })
    showToast('已添加到我的模版')
  }

  return (
    <div className="page mall-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">模版商城</h1>
          <p className="page-sub">
            内置模版列表，支持标题模糊搜索与一键加入我的模版。
          </p>
        </div>
        <div className="page-header-actions">
          <ThemeToggle />
          <Link className="btn btn-secondary" to="/" title="返回我的模版列表">
            返回首页
          </Link>
        </div>
      </header>

      <div className="mall-toolbar">
        <input
          type="search"
          className="mall-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索标题（支持模糊匹配）"
          aria-label="搜索标题"
        />
      </div>

      {templates.length === 0 ? (
        <div className="empty-state">
          <p>未找到匹配的模版。</p>
        </div>
      ) : (
        <div className="mall-list-box">
          <ul className="template-list mall-list">
            {templates.map((t, i) => (
              <li key={`${t.title}-${i}`} className="template-item">
                <div className="template-card-wrap mall-card-wrap">
                <Tippy
                  content={
                    <div className="mall-tooltip-content">
                      {t.content || '（空模版）'}
                    </div>
                  }
                  maxWidth={540}
                  placement="right"
                  delay={[60, 120]}
                  interactive
                  interactiveBorder={8}
                  hideOnClick={false}
                  offset={[0, 8]}
                >
                  <div className="template-card mall-card">
                    <h3 className="template-card-title">{t.title}</h3>
                    <p
                      className="template-card-preview"
                      style={{ WebkitLineClamp: 6 }}
                    >
                      {t.content || '（空模版）'}
                    </p>
                  </div>
                </Tippy>
                  <button
                    type="button"
                    className="mall-add-btn"
                    onClick={() => handleAddToMy(t)}
                    aria-label={`添加到我的模版：${t.title}`}
                  >
                    <span className="mall-add-label">添加到我的模版</span>
                    <CartIcon />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
