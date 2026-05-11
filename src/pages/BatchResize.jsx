import { useCallback, useEffect, useRef, useState } from 'react'
import JSZip from 'jszip'
import ToolPageLayout from '../components/ToolPageLayout'
import { useToast } from '../context/ToastContext'

export default function BatchResize() {
  const { showToast } = useToast()
  const fileRef = useRef(null)
  const imgRef = useRef(null)
  const dragRef = useRef(null)
  const [width, setWidth] = useState(512)
  const [previewUrls, setPreviewUrls] = useState([])
  const [previewSrc, setPreviewSrc] = useState('')
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 })
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 })
  const [selection, setSelection] = useState(null)

  const onFilesChange = useCallback(() => {
    const files = Array.from(fileRef.current?.files || [])
    setSelection(null)
    setPreviewUrls([])
    if (files.length === 0) {
      setPreviewSrc('')
      return
    }
    setPreviewSrc((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(files[0])
    })
  }, [])

  const refreshDisplaySize = useCallback(() => {
    const el = imgRef.current
    if (!el) return
    setDisplaySize({ w: el.clientWidth, h: el.clientHeight })
  }, [])

  const onImageLoad = useCallback(() => {
    const el = imgRef.current
    if (!el) return
    setNaturalSize({ w: el.naturalWidth, h: el.naturalHeight })
    setDisplaySize({ w: el.clientWidth, h: el.clientHeight })
  }, [])

  useEffect(() => {
    if (!previewSrc) return
    const handler = () => refreshDisplaySize()
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [previewSrc, refreshDisplaySize])

  useEffect(() => {
    return () => {
      if (previewSrc) URL.revokeObjectURL(previewSrc)
    }
  }, [previewSrc])

  useEffect(() => {
    return () => {
      previewUrls.forEach((u) => {
        if (u.startsWith('blob:')) URL.revokeObjectURL(u)
      })
    }
  }, [previewUrls])

  const getPos = (e) => {
    const el = imgRef.current
    if (!el) return { x: 0, y: 0 }
    const rect = el.getBoundingClientRect()
    const point = e.touches ? e.touches[0] : e
    const x = Math.max(0, Math.min(rect.width, point.clientX - rect.left))
    const y = Math.max(0, Math.min(rect.height, point.clientY - rect.top))
    return { x, y }
  }

  const onPointerDown = (e) => {
    if (!imgRef.current) return
    e.preventDefault()
    const { x, y } = getPos(e)
    dragRef.current = { startX: x, startY: y }
    setSelection({ x, y, w: 0, h: 0 })
  }

  const onPointerMove = (e) => {
    if (!dragRef.current) return
    const { x, y } = getPos(e)
    const { startX, startY } = dragRef.current
    setSelection({
      x: Math.min(startX, x),
      y: Math.min(startY, y),
      w: Math.abs(x - startX),
      h: Math.abs(y - startY),
    })
  }

  const onPointerUp = () => {
    dragRef.current = null
  }

  const hasCrop =
    selection &&
    selection.w > 2 &&
    selection.h > 2 &&
    displaySize.w > 0 &&
    displaySize.h > 0

  const cropPixels = hasCrop
    ? {
        x: Math.round((selection.x / displaySize.w) * naturalSize.w),
        y: Math.round((selection.y / displaySize.h) * naturalSize.h),
        w: Math.round((selection.w / displaySize.w) * naturalSize.w),
        h: Math.round((selection.h / displaySize.h) * naturalSize.h),
      }
    : null

  const runResize = useCallback(async () => {
    const files = Array.from(fileRef.current?.files || [])
    if (files.length === 0) {
      showToast('请选择图片')
      return
    }

    const targetW = Math.max(1, parseInt(String(width), 10) || 512)
    const rel = hasCrop
      ? {
          x: selection.x / displaySize.w,
          y: selection.y / displaySize.h,
          w: selection.w / displaySize.w,
          h: selection.h / displaySize.h,
        }
      : null

    const results = []
    for (const f of files) {
      const img = new Image()
      const objectUrl = URL.createObjectURL(f)
      img.src = objectUrl
      try {
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
        })
      } catch {
        URL.revokeObjectURL(objectUrl)
        continue
      }

      const srcX = rel ? rel.x * img.width : 0
      const srcY = rel ? rel.y * img.height : 0
      const srcW = rel ? rel.w * img.width : img.width
      const srcH = rel ? rel.h * img.height : img.height

      const outH = Math.max(1, Math.round((targetW * srcH) / srcW))
      const canvas = document.createElement('canvas')
      canvas.width = targetW
      canvas.height = outH
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, targetW, outH)

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      )
      URL.revokeObjectURL(objectUrl)
      if (!blob) continue

      const baseName = f.name.replace(/\.[^.]+$/, '')
      results.push({ name: `resized-${baseName}.png`, blob })
    }

    if (results.length === 0) {
      showToast('图片处理失败')
      return
    }

    setPreviewUrls(results.map((r) => URL.createObjectURL(r.blob)))

    if (results.length === 1) {
      const url = URL.createObjectURL(results[0].blob)
      const a = document.createElement('a')
      a.href = url
      a.download = results[0].name
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } else {
      const zip = new JSZip()
      results.forEach((r) => zip.file(r.name, r.blob))
      const content = await zip.generateAsync({ type: 'blob' })
      const zipUrl = URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = zipUrl
      a.download = `resized_images_${Date.now()}.zip`
      a.click()
      setTimeout(() => URL.revokeObjectURL(zipUrl), 1000)
    }
  }, [showToast, width, selection, displaySize, hasCrop])

  return (
    <ToolPageLayout title="图片批量改尺寸">
      <div className="tool-panel">
        <h2 className="tool-page-title">图片批量修改尺寸</h2>
        <p className="tool-page-lead">
          指定统一宽度，可在第一张图上框选区域，批量裁剪并缩放后下载。未框选时按整图缩放。
        </p>

        <div className="batch-resize-layout">
          <div className="batch-resize-controls">
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
                style={{ width: 180, maxWidth: 180 }}
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
                onChange={onFilesChange}
              />
            </div>

            <div className="tool-field">
              <div className="batch-resize-crop-info">
                {hasCrop && cropPixels ? (
                  <>
                    <div>
                      裁剪区域（原图像素）：{cropPixels.x}, {cropPixels.y} ·{' '}
                      {cropPixels.w} × {cropPixels.h}
                    </div>
                    <button
                      type="button"
                      className="tool-btn-secondary batch-resize-clear"
                      onClick={() => setSelection(null)}
                    >
                      清除选区
                    </button>
                  </>
                ) : (
                  <div>未选择裁剪区域，将按整图缩放</div>
                )}
              </div>
            </div>

            <button
              type="button"
              className="tool-btn-primary"
              onClick={runResize}
            >
              开始修改尺寸
            </button>
          </div>

          <div className="batch-resize-preview">
            {previewSrc ? (
              <div
                className="batch-resize-preview-wrap"
                onMouseDown={onPointerDown}
                onMouseMove={onPointerMove}
                onMouseUp={onPointerUp}
                onMouseLeave={onPointerUp}
                onTouchStart={onPointerDown}
                onTouchMove={onPointerMove}
                onTouchEnd={onPointerUp}
              >
                <img
                  ref={imgRef}
                  src={previewSrc}
                  alt="预览"
                  className="batch-resize-preview-img"
                  draggable={false}
                  onLoad={onImageLoad}
                />
                {selection && (
                  <div
                    className="batch-resize-selection"
                    style={{
                      left: `${selection.x}px`,
                      top: `${selection.y}px`,
                      width: `${selection.w}px`,
                      height: `${selection.h}px`,
                    }}
                  />
                )}
              </div>
            ) : (
              <div className="batch-resize-preview-empty">
                选择图片后此处显示预览，可在图上按住鼠标拖动框选裁剪区域
              </div>
            )}
          </div>
        </div>

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
