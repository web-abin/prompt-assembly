import { useState } from 'react'
import { addTemplate } from '../lib/storage'

export default function CreateModal({ open, onClose, onUseNow }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  if (!open) return null

  function save() {
    const t = title.trim() || '未命名模版'
    const b = body
    return addTemplate({ title: t, body: b })
  }

  function handleConfirm() {
    save()
    onClose()
  }

  function handleUseNow() {
    const item = save()
    onClose()
    onUseNow(item.id)
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="create-modal-title" className="modal-title">
          新建 Prompt 模版
        </h2>
        <label className="field-label" htmlFor="tmpl-title">
          标题
        </label>
        <input
          id="tmpl-title"
          className="input"
          type="text"
          placeholder="例如：文章大纲生成"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label className="field-label" htmlFor="tmpl-body">
          模版内容
        </label>
        <textarea
          id="tmpl-body"
          className="textarea modal-body-input"
          placeholder="输入模版，用 [占位名称] 标记可填写处，例如：请根据 [主题] 写一段介绍。"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
        />
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            取消
          </button>
          <button type="button" className="btn btn-primary" onClick={handleUseNow}>
            立即使用
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleConfirm}>
            确定
          </button>
        </div>
      </div>
    </div>
  )
}
