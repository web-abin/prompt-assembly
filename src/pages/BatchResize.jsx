import { useCallback, useRef, useState } from 'react'
import ToolPageLayout from '../components/ToolPageLayout'
import { useToast } from '../context/ToastContext'

export default function BatchResize() {
  const { showToast } = useToast()
  const fileRef = useRef(null)
  const [width, setWidth] = useState(512)
  const [previewUrls, setPreviewUrls] = useState([])

  const runResize = useCallback(async () => {
    const files = Array.from(fileRef.current?.files || [])
    if (files.length === 0) {
      showToast('请选择图片')
      return
    }

    const targetW = Math.max(1, parseInt(String(width), 10) || 512)
    const nextPreview = []
    for (const f of files) {
      const img = new Image()
      const objectUrl = URL.createObjectURL(f)
      img.src = objectUrl
      await new Promise((r) => {
        img.onload = r
      })

      const h = Math.round((targetW * img.height) / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = targetW
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, targetW, h)

      const url = canvas.toDataURL('image/png')
      nextPreview.push(url)
      URL.revokeObjectURL(objectUrl)

      const a = document.createElement('a')
      a.href = url
      a.download = `resized-${f.name}`
      a.click()
    }
    setPreviewUrls(nextPreview)
  }, [showToast, width])

  return (
    <ToolPageLayout title="图片批量改尺寸">
      <div className="tool-panel">
        <h2 className="tool-page-title">图片批量修改尺寸</h2>
        <p className="tool-page-lead">指定统一宽度，批量缩放多张图片并自动下载。</p>

        <div className="tool-field">
          <label className="tool-label" htmlFor="batch-width">
            统一宽度（px）
          </label>
          <input
            id="batch-width"
            className="tool-input"
            type="number"
            min={1}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value) || 0)}
          />
        </div>

        <div className="tool-field">
          <label className="tool-label" htmlFor="batch-resize-files">
            选择图片（可批量）
          </label>
          <input
            ref={fileRef}
            id="batch-resize-files"
            className="tool-input-file"
            type="file"
            accept="image/*"
            multiple
          />
        </div>

        <button type="button" className="tool-btn-primary" onClick={runResize}>
          开始修改尺寸
        </button>

        {previewUrls.length > 0 && (
          <div className="tool-preview-row" aria-live="polite">
            {previewUrls.map((url, i) => (
              <img key={i} src={url} alt="" className="tool-preview-thumb" />
            ))}
          </div>
        )}
      </div>
    </ToolPageLayout>
  )
}
