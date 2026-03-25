import { useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTemplate } from '../lib/storage'
import { extractPlaceholders, assemblePrompt } from '../lib/parsePrompt'

function TemplateBlock({ body }) {
  const [open, setOpen] = useState(true)
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
      {open && <pre className="template-block">{body || '（空）'}</pre>}
    </section>
  )
}

export default function Detail() {
  const { id } = useParams()
  const tpl = useMemo(() => getTemplate(id), [id])
  const [values, setValues] = useState({})
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
    <div className="page detail-page detail-layout">
      <div className="detail-main">
        <nav className="breadcrumb">
          <Link to="/">← 模版列表</Link>
        </nav>

        <TemplateBlock body={tpl.body} />

        <section className="form-section">
          <h2 className="section-title">填写占位符</h2>
          {keys.length === 0 ? (
            <p className="muted">本模版没有 [占位符]，可直接在右侧编辑全文。</p>
          ) : (
            <div className="placeholder-form">
              {keys.map((key) => (
                <div key={key} className="form-row">
                  <label className="field-label" htmlFor={`ph-${key}`}>
                    {key}
                  </label>
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

      <aside className="detail-aside">
        <div className="aside-header">
          <h2 className="section-title">组装结果</h2>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleCopy}>
            复制
          </button>
        </div>
        <textarea
          ref={outputRef}
          key={assembled}
          className="textarea aside-output"
          defaultValue={assembled}
          spellCheck={false}
          placeholder="填写左侧或在此直接编辑…"
        />
        <p className="aside-hint">
          修改上方表单会重新根据模版拼接；你也可以在本框内任意编辑后再复制。
        </p>
      </aside>
    </div>
  )
}
