import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllTemplates } from '../lib/storage'
import CreateModal from '../components/CreateModal'

const PREVIEW_LINES = 4

export default function Home() {
  const navigate = useNavigate()
  const [modal, setModal] = useState(false)
  const [createKey, setCreateKey] = useState(0)
  const [, tick] = useState(0)
  const templates = getAllTemplates()

  function refresh() {
    tick((n) => n + 1)
  }

  function openCreate() {
    setCreateKey((k) => k + 1)
    setModal(true)
  }

  return (
    <div className="page home-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Prompt 拼接</h1>
          <p className="page-sub">本地保存模版，填写占位符并一键复制组装结果。</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openCreate}>
          创建 Prompt 模版
        </button>
      </header>

      {templates.length === 0 ? (
        <div className="empty-state">
          <p>还没有模版，点击右上角创建第一个。</p>
        </div>
      ) : (
        <ul className="template-list">
          {templates.map((t) => (
            <li key={t.id}>
              <Link className="template-card" to={`/template/${t.id}`}>
                <h3 className="template-card-title">{t.title}</h3>
                <p
                  className="template-card-preview"
                  style={{ WebkitLineClamp: PREVIEW_LINES }}
                >
                  {t.body || '（空模版）'}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <CreateModal
        key={createKey}
        open={modal}
        onClose={() => {
          setModal(false)
          refresh()
        }}
        onUseNow={(id) => {
          refresh()
          navigate(`/template/${id}`)
        }}
      />
    </div>
  )
}
