import { useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTemplate } from '../lib/storage'
import {
  extractPlaceholders,
  assemblePrompt,
  getTemplateDisplaySegments
} from '../lib/parsePrompt'
import ThemeToggle from '../components/ThemeToggle'
import QuickParamsPickerModal from '../components/QuickParamsPickerModal'
import { useToast } from '../context/ToastContext'
import StyleReferenceModal from '../components/StyleReferenceModal'
import iconGame from '../assets/icon-game.png'

function QuickFillIcon() {
  return (
    <svg
      className="icon-btn-svg"
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line
        x1="8"
        y1="6"
        x2="21"
        y2="6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="8"
        y1="12"
        x2="21"
        y2="12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="8"
        y1="18"
        x2="21"
        y2="18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="3"
        y1="6"
        x2="3.01"
        y2="6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="3"
        y1="12"
        x2="3.01"
        y2="12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="3"
        y1="18"
        x2="3.01"
        y2="18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function TemplateBlock({ body }) {
  const [open, setOpen] = useState(true)
  const segments = useMemo(() => getTemplateDisplaySegments(body ?? ''), [body])

  return (
    <section className="template-section">
      <button
        type="button"
        className="collapse-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="collapse-label">Prompt 模版</span>
        <span className="collapse-icon">{open ? '收起' : '展开'}</span>
      </button>
      {open && (
        <div className="template-block template-block-rendered">
          {segments.length === 0 ? (
            <span className="muted">（空）</span>
          ) : (
            segments.map((seg, i) =>
              seg.type === 'text' ? (
                <span key={i}>{seg.content}</span>
              ) : (
                <span
                  key={i}
                  className="ph-token"
                  title={`占位符 ${seg.keyIndex}：${seg.key}`}
                >
                  <span className="ph-badge">{seg.keyIndex}</span>
                  <span className="ph-brackets">[{seg.key}]</span>
                </span>
              )
            )
          )}
        </div>
      )}
    </section>
  )
}

export default function Detail() {
  const { id } = useParams()
  const { showToast } = useToast()
  const tpl = useMemo(() => getTemplate(id), [id])
  const [values, setValues] = useState({})
  const [quickPickerKey, setQuickPickerKey] = useState(null)
  const [styleRefOpen, setStyleRefOpen] = useState(false)
  const outputRef = useRef(null)

  const keys = useMemo(() => (tpl ? extractPlaceholders(tpl.body) : []), [tpl])

  const assembled = useMemo(() => {
    if (!tpl) return ''
    return assemblePrompt(tpl.body, values)
  }, [tpl, values])

  function setField(key, v) {
    setValues((prev) => ({ ...prev, [key]: v }))
  }

  async function handleCopy() {
    const v = outputRef.current?.value ?? ''
    try {
      await navigator.clipboard.writeText(v)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = v
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    showToast('已复制到剪贴板')
  }

  if (!tpl) {
    return (
      <div className="page detail-page">
        <p className="muted">找不到该模版。</p>
        <Link to="/">返回首页</Link>
      </div>
    )
  }

  return (
    <div className="page detail-page detail-page-fill">
      <div className="detail-layout detail-layout-fill">
        <div className="detail-main">
          <nav className="breadcrumb breadcrumb-bar">
            <Link to="/">← 模版列表</Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button
                type="button"
              className="btn btn-secondary btn-sm btn-game"
                onClick={() => setStyleRefOpen(true)}
                title="常见游戏UI风格参考"
              >
              <img src={iconGame} alt="" />
              游戏风格
              </button>
              <ThemeToggle />
            </div>
          </nav>

          <TemplateBlock body={tpl.body} />

          <section className="form-section">
            <h2 className="section-title">填写占位符</h2>
            {keys.length === 0 ? (
              <p className="muted">
                本模版没有 [占位符]，可直接在右侧编辑全文。
              </p>
            ) : (
              <div className="placeholder-form">
                {keys.map((key, i) => (
                  <div key={key} className="form-row">
                    <div className="field-label-row">
                      <label
                        className="field-label field-label-numbered"
                        htmlFor={`ph-${key}`}
                        aria-label={`第 ${i + 1} 项：${key}`}
                      >
                        <span
                          className="placeholder-form-num"
                          aria-hidden="true"
                        >
                          {i + 1}
                        </span>
                        <span className="placeholder-form-key">{key}</span>
                      </label>
                      <button
                        type="button"
                        className="icon-btn icon-btn-compact"
                        title="从快捷参数填入"
                        aria-label={`从快捷参数填入「${key}」`}
                        onClick={() => setQuickPickerKey(key)}
                      >
                        <QuickFillIcon />
                      </button>
                    </div>
                    <textarea
                      id={`ph-${key}`}
                      className="textarea"
                      rows={3}
                      placeholder={`输入「${key}」`}
                      value={values[key] ?? ''}
                      onChange={(e) => setField(key, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="detail-aside detail-aside-fill">
          <div className="aside-header">
            <h2 className="section-title">组装结果</h2>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleCopy}
            >
              复制
            </button>
          </div>
          <textarea
            ref={outputRef}
            key={assembled}
            className="textarea aside-output aside-output-fill"
            defaultValue={assembled}
            spellCheck={false}
            placeholder="填写左侧或在此直接编辑…"
          />
          <p className="aside-hint">
            修改上方表单会重新拼接；也可在本框内编辑后再复制。
          </p>
        </aside>
      </div>

      <QuickParamsPickerModal
        open={quickPickerKey !== null}
        onClose={() => setQuickPickerKey(null)}
        onSelect={(content) => {
          if (quickPickerKey) setField(quickPickerKey, content)
        }}
      />
      <StyleReferenceModal
        open={styleRefOpen}
        onClose={() => setStyleRefOpen(false)}
      />
    </div>
  )
}
