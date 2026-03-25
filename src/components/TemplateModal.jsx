import { useState } from 'react'
import { addTemplate, updateTemplate } from '../lib/storage'

/**
 * @param {object} props
 * @param {'create'|'edit'} props.mode
 * @param {boolean} props.open
 * @param {{ id: string, title: string, body: string } | null} props.template — edit 时传入
 * @param {() => void} props.onClose
 * @param {(id: string) => void} [props.onUseNow] — create：保存并进入详情
 */
export default function TemplateModal({ mode, open, template, onClose, onUseNow }) {
  const [title, setTitle] = useState(() =>
    mode === 'edit' && template ? template.title ?? '' : '',
  )
  const [body, setBody] = useState(() =>
    mode === 'edit' && template ? template.body ?? '' : '',
  )

  if (!open) return null

  const isEdit = mode === 'edit'

  function saveCreate() {
    const t = title.trim() || '未命名模版'
    const b = body
    return addTemplate({ title: t, body: b })
  }

  function saveEdit() {
    if (!template?.id) return null
    const t = title.trim() || '未命名模版'
    const b = body
    return updateTemplate(template.id, { title: t, body: b })
  }

  function handleConfirm() {
    if (isEdit) {
      saveEdit()
    } else {
      saveCreate()
    }
    onClose()
  }

  function handleUseNow() {
    const item = saveCreate()
    onClose()
    if (item && onUseNow) onUseNow(item.id)
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tmpl-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="tmpl-modal-title" className="modal-title">
          {isEdit ? '编辑 Prompt 模版' : '新建 Prompt 模版'}
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
          {!isEdit && (
            <>
              <button type="button" className="btn btn-primary" onClick={handleUseNow}>
                立即使用
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleConfirm}>
                确定
              </button>
            </>
          )}
          {isEdit && (
            <button type="button" className="btn btn-primary" onClick={handleConfirm}>
              保存
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
