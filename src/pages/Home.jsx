import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllTemplates, reorderTemplates, deleteTemplate } from '../lib/storage'
import { templatesToMarkdown, downloadTextFile } from '../lib/exportTemplatesMd'
import { copyTextToClipboard } from '../lib/copyText'
import TemplateModal from '../components/TemplateModal'
import QuickParamsManageModal from '../components/QuickParamsManageModal'
import ThemeToggle from '../components/ThemeToggle'
import { useToast } from '../context/ToastContext'

const PREVIEW_LINES = 4

function EditIcon() {
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
        d="M12 20h9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CopyIcon() {
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
      <rect
        x="9"
        y="9"
        width="13"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function DeleteIcon() {
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
        d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [modal, setModal] = useState(false)
  const [createKey, setCreateKey] = useState(0)
  const [editing, setEditing] = useState(null)
  const [quickParamsOpen, setQuickParamsOpen] = useState(false)
  const [, tick] = useState(0)
  const dragIndexRef = useRef(null)
  const templates = getAllTemplates()

  function refresh() {
    tick((n) => n + 1)
  }

  function openCreate() {
    setCreateKey((k) => k + 1)
    setModal(true)
  }

  function handleExportMd() {
    if (!templates.length) return
    const md = templatesToMarkdown(templates)
    downloadTextFile('prompt-templates.md', md)
    showToast('已导出 prompt-templates.md')
  }

  async function handleCopyBody(t) {
    await copyTextToClipboard(t.body ?? '')
    showToast('已复制模版内容')
  }

  function handleDeleteTemplate(t) {
    if (!window.confirm(`确定删除模版「${t.title}」？此操作不可恢复。`)) return
    deleteTemplate(t.id)
    refresh()
    showToast('已删除模版')
  }

  return (
    <div className="page home-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Prompt 拼接</h1>
          <p className="page-sub">本地保存模版，填写占位符并一键复制组装结果。</p>
        </div>
        <div className="page-header-actions">
          <ThemeToggle />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setQuickParamsOpen(true)}
          >
            快捷参数
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={templates.length === 0}
            title={templates.length === 0 ? '暂无模版' : '导出为 Markdown 文件'}
            onClick={handleExportMd}
          >
            导出模版
          </button>
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            创建 Prompt 模版
          </button>
        </div>
      </header>

      {templates.length === 0 ? (
        <div className="empty-state">
          <p>还没有模版，点击右上角创建第一个。</p>
        </div>
      ) : (
        <ul className="template-list">
          {templates.map((t, i) => (
            <li
              key={t.id}
              className="template-item"
              onDragOver={(e) => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
                const from = dragIndexRef.current
                if (from === null || from === i) return
                reorderTemplates(from, i)
                dragIndexRef.current = i
                refresh()
              }}
              onDrop={(e) => {
                e.preventDefault()
                dragIndexRef.current = null
              }}
            >
              <button
                type="button"
                className="drag-handle"
                aria-label="拖拽排序"
                draggable
                onDragStart={(e) => {
                  dragIndexRef.current = i
                  e.dataTransfer.effectAllowed = 'move'
                  e.stopPropagation()
                }}
                onDragEnd={() => {
                  dragIndexRef.current = null
                }}
              >
                ⋮⋮
              </button>
              <div className="template-card-wrap">
                <Link className="template-card" to={`/template/${t.id}`}>
                  <h3 className="template-card-title">{t.title}</h3>
                  <p
                    className="template-card-preview"
                    style={{ WebkitLineClamp: PREVIEW_LINES }}
                  >
                    {t.body || '（空模版）'}
                  </p>
                </Link>
                <div className="template-card-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label={`编辑「${t.title}」`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setEditing(t)
                    }}
                  >
                    <EditIcon />
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label={`复制「${t.title}」模版内容`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleCopyBody(t)
                    }}
                  >
                    <CopyIcon />
                  </button>
                  <button
                    type="button"
                    className="icon-btn icon-btn-danger"
                    aria-label={`删除「${t.title}」`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleDeleteTemplate(t)
                    }}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <TemplateModal
        key={createKey}
        mode="create"
        open={modal}
        template={null}
        onClose={() => {
          setModal(false)
          refresh()
        }}
        onUseNow={(id) => {
          refresh()
          navigate(`/template/${id}`)
        }}
      />

      {editing && (
        <TemplateModal
          key={editing.id}
          mode="edit"
          open
          template={editing}
          onClose={() => {
            setEditing(null)
            refresh()
          }}
        />
      )}

      <QuickParamsManageModal
        key={quickParamsOpen ? 'open' : 'closed'}
        open={quickParamsOpen}
        onClose={() => setQuickParamsOpen(false)}
      />
    </div>
  )
}
