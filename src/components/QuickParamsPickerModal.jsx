import { useMemo } from 'react'
import { getAllGroups } from '../lib/quickParamsStorage'

const PREVIEW_LEN = 200

export default function QuickParamsPickerModal({ open, onClose, onSelect }) {
  const groups = useMemo(() => (open ? getAllGroups() : []), [open])

  if (!open) return null

  function handlePick(content) {
    onSelect(content ?? '')
    onClose()
  }

  const hasAny = groups.some((g) => (g.items || []).length > 0)

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal modal-wide quick-params-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qp-pick-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="quick-params-modal-head">
          <h2 id="qp-pick-title" className="modal-title">
            选择快捷参数
          </h2>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            关闭
          </button>
        </div>
        <p className="muted quick-params-pick-hint">点击一条即可填入当前表单项。</p>
        {!hasAny ? (
          <p className="muted quick-params-empty">暂无快捷参数，请先在首页创建分组并添加。</p>
        ) : (
          <div className="quick-params-pick-groups">
            {groups.map((g) => (
              <section key={g.id} className="quick-params-pick-section">
                <h3 className="quick-params-pick-group-title">{g.title || '未命名分组'}</h3>
                {(g.items || []).length === 0 ? (
                  <p className="muted qp-pick-group-empty">（本组暂无参数）</p>
                ) : (
                  <ul className="quick-params-pick-list">
                    {(g.items || []).map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          className="quick-params-pick-row"
                          onClick={() => handlePick(item.content)}
                        >
                          <pre className="quick-params-pick-preview">
                            {(item.content || '（空）').slice(0, PREVIEW_LEN)}
                            {(item.content || '').length > PREVIEW_LEN ? '…' : ''}
                          </pre>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
