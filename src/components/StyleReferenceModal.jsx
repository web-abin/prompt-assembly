import { useMemo, useState } from 'react'
import { styleList, categoryDict } from '../data/style'

function useFilteredStyles(open, q, categoryId) {
  return useMemo(() => {
    if (!open) return []
    const query = (q || '').trim().toLowerCase()
    const tokens = query ? query.split(/\s+/).filter(Boolean) : []
    return styleList.filter((s) => {
      if (categoryId && !(s.type || []).includes(categoryId)) return false
      if (!tokens.length) return true
      const text = `${s.name}\n${s.features}`.toLowerCase()
      return tokens.every((t) => fuzzyMatch(text, t))
    })
  }, [open, q, categoryId])
}

function fuzzyMatch(text, token) {
  if (!token) return true
  let i = 0
  for (const ch of text) {
    if (ch === token[i]) {
      i += 1
      if (i >= token.length) return true
    }
  }
  return false
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function Highlight({ text, tokens }) {
  if (!tokens?.length || !text) return <>{text}</>
  const uniq = Array.from(new Set(tokens.filter(Boolean)))
  const pattern = uniq.map((t) => escapeRegExp(t)).join('|')
  const re = new RegExp(pattern, 'gi')
  const parts = []
  let lastIndex = 0
  for (;;) {
    const m = re.exec(text)
    if (!m) break
    const idx = m.index
    if (idx > lastIndex) parts.push(text.slice(lastIndex, idx))
    parts.push(
      <mark key={`${idx}-${m[0].length}`} style={{ background: 'var(--accent-bg)', color: 'inherit', padding: '0 2px', borderRadius: 4 }}>
        {m[0]}
      </mark>
    )
    lastIndex = idx + m[0].length
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return <>{parts}</>
}

export default function StyleReferenceModal({ open, onClose }) {
  const [q, setQ] = useState('')
  const [categoryKey, setCategoryKey] = useState('ALL')
  const [preview, setPreview] = useState(null)

  const categoryOptions = useMemo(() => {
    return [{ key: 'ALL', id: 0, name: '全部' }].concat(
      Object.entries(categoryDict).map(([key, v]) => ({ key, id: v.id, name: v.name }))
    )
  }, [])

  const selectedCategoryId = categoryKey === 'ALL' ? 0 : categoryDict[categoryKey]?.id || 0
  const list = useFilteredStyles(open, q, selectedCategoryId)

  const tokens = useMemo(() => (q.trim() ? q.trim().toLowerCase().split(/\s+/).filter(Boolean) : []), [q])

  if (!open) return null

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal modal-wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="style-ref-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
          <h2 id="style-ref-title" className="modal-title">游戏风格参考</h2>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>关闭</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 10, marginBottom: 12 }}>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索标题或风格 Prompt（支持模糊匹配）"
            aria-label="搜索标题或Prompt"
            className="input"
          />
          <select
            value={categoryKey}
            onChange={(e) => setCategoryKey(e.target.value)}
            aria-label="按分类筛选"
            className="input"
            style={{ width: 160 }}
          >
            {categoryOptions.map((c) => (
              <option key={c.key} value={c.key}>{c.name}</option>
            ))}
          </select>
        </div>

        {list.length === 0 ? (
          <p className="muted" style={{ margin: 0, padding: '16px 0', textAlign: 'center' }}>暂无匹配的风格。</p>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '65vh', overflowY: 'auto', paddingRight: 4 }}>
            {list.map((s) => (
              <li key={s.id} style={{ border: '1px solid var(--border)', borderRadius: 12, background: 'var(--bg)', boxShadow: 'var(--shadow)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px minmax(0, 1fr)', gap: 12, alignItems: 'stretch' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                    {(() => {
                      const base = (import.meta.env?.BASE_URL || '/').replace(/\/+$/, '/')
                      const imgSrc = `${base}game-style/${s.img}`
                      return (
                    <img
                      src={imgSrc}
                      alt={s.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)', cursor: 'zoom-in' }}
                      loading="lazy"
                      onClick={() => setPreview({ src: imgSrc, title: s.name })}
                    />
                      )
                    })()}
                  </div>
                  <div style={{ padding: '12px 12px 12px 0', minWidth: 0 }}>
                    <h3 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 600, color: 'var(--text-h)' }}>
                      <Highlight text={s.name} tokens={tokens} />
                    </h3>
                    <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--text)' }}>
                      示例：{s.example}
                    </p>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--text-h)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      <Highlight text={s.features} tokens={tokens} />
                    </p>
                    <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {(s.type || []).map((tid) => {
                        const label = Object.values(categoryDict).find((c) => c.id === tid)?.name
                        if (!label) return null
                        return (
                          <span key={`${s.id}-cat-${tid}`} style={{ display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 8px', fontSize: 12, border: '1px solid var(--border)', borderRadius: 999, background: 'var(--code-bg)', color: 'var(--text)' }}>
                            {label}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        {preview && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="图片预览"
            onClick={() => setPreview(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'var(--modal-backdrop)',
              zIndex: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                boxShadow: 'var(--shadow)',
                padding: 12,
                maxWidth: 'min(92vw, 900px)'
              }}
            >
              <img
                src={preview.src}
                alt={preview.title || '预览图片'}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '78vh',
                  objectFit: 'contain',
                  borderRadius: 10,
                  border: '1px solid var(--border)'
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, width: '100%' }}>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--text-h)' }}>{preview.title}</p>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setPreview(null)}>
                  关闭预览
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
