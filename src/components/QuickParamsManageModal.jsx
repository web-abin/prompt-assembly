import { useState } from 'react'
import {
  getAllGroups,
  addGroup,
  updateGroupTitle,
  deleteGroup,
  addQuickParam,
  updateQuickParamItem,
  deleteQuickParamItem,
} from '../lib/quickParamsStorage'
import { exportQuickParamsMd } from '../lib/exportQuickParamsMd'
import { useToast } from '../context/ToastContext'

const PREVIEW_LEN = 120

export default function QuickParamsManageModal({ open, onClose }) {
  const { showToast } = useToast()
  const [screen, setScreen] = useState('list')
  /** group: { id?, title } | param: { groupId, id?, content } */
  const [groupForm, setGroupForm] = useState({ id: null, title: '' })
  const [paramForm, setParamForm] = useState({ groupId: '', id: null, content: '' })
  const [, setListVersion] = useState(0)

  const groups = getAllGroups()

  function refresh() {
    setListVersion((v) => v + 1)
  }

  if (!open) return null

  function openCreateGroup() {
    setGroupForm({ id: null, title: '' })
    setScreen('group-form')
  }

  function openEditGroup(g) {
    setGroupForm({ id: g.id, title: g.title ?? '' })
    setScreen('group-form')
  }

  function saveGroupForm() {
    const t = groupForm.title ?? ''
    if (groupForm.id) {
      updateGroupTitle(groupForm.id, t)
      showToast('分组已更新')
    } else {
      addGroup(t)
      showToast('分组已创建')
    }
    refresh()
    setScreen('list')
  }

  function handleDeleteGroup(g) {
    if (!window.confirm(`确定删除分组「${g.title}」及其中的全部快捷参数？`)) return
    deleteGroup(g.id)
    refresh()
    showToast('已删除分组')
  }

  function openCreateParam(groupId) {
    setParamForm({ groupId, id: null, content: '' })
    setScreen('param-form')
  }

  function openEditParam(groupId, item) {
    setParamForm({ groupId, id: item.id, content: item.content ?? '' })
    setScreen('param-form')
  }

  function saveParamForm() {
    const c = paramForm.content ?? ''
    if (paramForm.id) {
      updateQuickParamItem(paramForm.groupId, paramForm.id, c)
    } else {
      addQuickParam(paramForm.groupId, c)
    }
    refresh()
    setScreen('list')
    showToast('已保存')
  }

  function handleDeleteParam(groupId, itemId) {
    if (!window.confirm('确定删除这条快捷参数？')) return
    deleteQuickParamItem(groupId, itemId)
    refresh()
    showToast('已删除')
  }

  function handleExport() {
    const flat = groups.flatMap((g) => g.items || [])
    if (flat.length === 0) return
    exportQuickParamsMd()
    showToast('已导出 quick-params.md')
  }

  const hasAnyParam = groups.some((g) => (g.items || []).length > 0)

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal modal-wide quick-params-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qp-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="quick-params-modal-head">
          <h2 id="qp-modal-title" className="modal-title">
            快捷参数
          </h2>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            关闭
          </button>
        </div>

        {screen === 'list' && (
          <>
            <div className="quick-params-toolbar">
              <button type="button" className="btn btn-primary" onClick={openCreateGroup}>
                创建分组
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={!hasAnyParam}
                onClick={handleExport}
              >
                导出
              </button>
            </div>
            {groups.length === 0 ? (
              <p className="muted quick-params-empty">暂无分组，请先「创建分组」，再在分组内添加快捷参数。</p>
            ) : (
              <div className="quick-params-groups">
                {groups.map((g) => (
                  <section key={g.id} className="qp-group-card">
                    <div className="qp-group-head">
                      <h3 className="qp-group-title">{g.title || '未命名分组'}</h3>
                      <div className="qp-group-head-actions">
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => openEditGroup(g)}
                        >
                          编辑分组
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleDeleteGroup(g)}
                        >
                          删除分组
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => openCreateParam(g.id)}
                        >
                          添加参数
                        </button>
                      </div>
                    </div>
                    {(g.items || []).length === 0 ? (
                      <p className="muted qp-group-empty">本组暂无参数，点击「添加参数」。</p>
                    ) : (
                      <ul className="quick-params-list qp-group-items">
                        {(g.items || []).map((item) => (
                          <li key={item.id} className="quick-params-item">
                            <pre className="quick-params-preview">
                              {(item.content || '（空）').slice(0, PREVIEW_LEN)}
                              {(item.content || '').length > PREVIEW_LEN ? '…' : ''}
                            </pre>
                            <div className="quick-params-item-actions">
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => openEditParam(g.id, item)}
                              >
                                编辑
                              </button>
                              <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={() => handleDeleteParam(g.id, item.id)}
                              >
                                删除
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>
            )}
          </>
        )}

        {screen === 'group-form' && (
          <div className="quick-params-form">
            <label className="field-label" htmlFor="qp-group-title">
              分组标题
            </label>
            <input
              id="qp-group-title"
              className="input"
              type="text"
              placeholder="输入分组名称"
              value={groupForm.title}
              onChange={(e) => setGroupForm((d) => ({ ...d, title: e.target.value }))}
            />
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setScreen('list')}>
                取消
              </button>
              <button type="button" className="btn btn-primary" onClick={saveGroupForm}>
                保存
              </button>
            </div>
          </div>
        )}

        {screen === 'param-form' && (
          <div className="quick-params-form">
            <label className="field-label" htmlFor="qp-content">
              内容
            </label>
            <textarea
              id="qp-content"
              className="textarea"
              rows={12}
              placeholder="输入要保存的快捷参数文本…"
              value={paramForm.content}
              onChange={(e) => setParamForm((d) => ({ ...d, content: e.target.value }))}
            />
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setScreen('list')}>
                取消
              </button>
              <button type="button" className="btn btn-primary" onClick={saveParamForm}>
                保存
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
