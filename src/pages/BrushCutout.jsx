import { useCallback, useEffect, useRef, useState } from 'react'
import ToolPageLayout from '../components/ToolPageLayout'
import { useToast } from '../context/ToastContext'
import styles from './BrushCutout.module.css'

const TOOLS = {
  BRUSH: 'brush',
  RECT: 'rect',
  ELLIPSE: 'ellipse',
  ERASER: 'eraser',
}

const MAX_DISPLAY_WIDTH = 900
const MAX_DISPLAY_HEIGHT = 560
const MASK_COLOR = 'rgba(24, 144, 255, 0.9)'
const HISTORY_LIMIT = 30

export default function BrushCutout() {
  const { showToast } = useToast()

  const imageCanvasRef = useRef(null)
  const maskCanvasRef = useRef(null)
  const previewCanvasRef = useRef(null)

  const imageRef = useRef(null)
  const drawStateRef = useRef({ active: false, startX: 0, startY: 0, lastX: 0, lastY: 0 })
  const historyRef = useRef([])

  const [hasImage, setHasImage] = useState(false)
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 })
  const [tool, setTool] = useState(TOOLS.BRUSH)
  const [brushSize, setBrushSize] = useState(40)
  const [resultUrl, setResultUrl] = useState(null)
  const [busy, setBusy] = useState(false)

  const getMaskCtx = useCallback(() => maskCanvasRef.current?.getContext('2d') ?? null, [])
  const getPreviewCtx = useCallback(
    () => previewCanvasRef.current?.getContext('2d') ?? null,
    [],
  )

  const pushHistory = useCallback(() => {
    const ctx = getMaskCtx()
    const canvas = maskCanvasRef.current
    if (!ctx || !canvas) return
    try {
      const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
      historyRef.current.push(snapshot)
      if (historyRef.current.length > HISTORY_LIMIT) {
        historyRef.current.shift()
      }
    } catch {
      // ignore
    }
  }, [getMaskCtx])

  const clearMask = useCallback(() => {
    const ctx = getMaskCtx()
    const canvas = maskCanvasRef.current
    if (!ctx || !canvas) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }, [getMaskCtx])

  const clearPreview = useCallback(() => {
    const ctx = getPreviewCtx()
    const canvas = previewCanvasRef.current
    if (!ctx || !canvas) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }, [getPreviewCtx])

  const handleClearAll = () => {
    if (!hasImage) return
    historyRef.current = []
    clearMask()
    clearPreview()
    setResultUrl(null)
  }

  const handleUndo = () => {
    if (!historyRef.current.length) {
      showToast('没有可撤销的操作')
      return
    }
    const ctx = getMaskCtx()
    if (!ctx) return
    const snapshot = historyRef.current.pop()
    ctx.putImageData(snapshot, 0, 0)
  }

  const loadImage = useCallback(
    (dataUrl) => {
      const img = new Image()
      img.onload = () => {
        const naturalW = img.naturalWidth
        const naturalH = img.naturalHeight
        const scale = Math.min(
          1,
          MAX_DISPLAY_WIDTH / naturalW,
          MAX_DISPLAY_HEIGHT / naturalH,
        )
        const w = Math.round(naturalW * scale)
        const h = Math.round(naturalH * scale)
        imageRef.current = img
        setDisplaySize({ w, h })
        setHasImage(true)
        setResultUrl(null)
        historyRef.current = []

        requestAnimationFrame(() => {
          const imgCanvas = imageCanvasRef.current
          const maskCanvas = maskCanvasRef.current
          const previewCanvas = previewCanvasRef.current
          if (!imgCanvas || !maskCanvas || !previewCanvas) return
          ;[imgCanvas, maskCanvas, previewCanvas].forEach((c) => {
            c.width = w
            c.height = h
          })
          const imgCtx = imgCanvas.getContext('2d')
          imgCtx.clearRect(0, 0, w, h)
          imgCtx.drawImage(img, 0, 0, w, h)
          maskCanvas.getContext('2d').clearRect(0, 0, w, h)
          previewCanvas.getContext('2d').clearRect(0, 0, w, h)
        })
      }
      img.onerror = () => {
        showToast('图片加载失败')
      }
      img.src = dataUrl
    },
    [showToast],
  )

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showToast('请选择图片文件')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const url = ev.target?.result
      if (typeof url !== 'string') return
      loadImage(url)
    }
    reader.readAsDataURL(file)
  }

  const getPointerPos = (e) => {
    const canvas = maskCanvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const drawBrushSegment = (fromX, fromY, toX, toY, isEraser) => {
    const ctx = getMaskCtx()
    if (!ctx) return
    ctx.save()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = brushSize
    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.strokeStyle = 'rgba(0,0,0,1)'
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = MASK_COLOR
    }
    ctx.beginPath()
    ctx.moveTo(fromX, fromY)
    ctx.lineTo(toX, toY)
    ctx.stroke()
    ctx.restore()
  }

  const drawShapePreview = (x1, y1, x2, y2, shape) => {
    const ctx = getPreviewCtx()
    const canvas = previewCanvasRef.current
    if (!ctx || !canvas) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.fillStyle = MASK_COLOR
    ctx.strokeStyle = 'rgba(24, 144, 255, 1)'
    ctx.lineWidth = 1
    if (shape === TOOLS.RECT) {
      const x = Math.min(x1, x2)
      const y = Math.min(y1, y2)
      const w = Math.abs(x2 - x1)
      const h = Math.abs(y2 - y1)
      ctx.globalAlpha = 0.5
      ctx.fillRect(x, y, w, h)
      ctx.globalAlpha = 1
      ctx.strokeRect(x, y, w, h)
    } else if (shape === TOOLS.ELLIPSE) {
      const cx = (x1 + x2) / 2
      const cy = (y1 + y2) / 2
      const rx = Math.abs(x2 - x1) / 2
      const ry = Math.abs(y2 - y1) / 2
      ctx.beginPath()
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
      ctx.globalAlpha = 0.5
      ctx.fill()
      ctx.globalAlpha = 1
      ctx.stroke()
    }
    ctx.restore()
  }

  const commitShape = (x1, y1, x2, y2, shape) => {
    const ctx = getMaskCtx()
    if (!ctx) return
    ctx.save()
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = MASK_COLOR
    if (shape === TOOLS.RECT) {
      const x = Math.min(x1, x2)
      const y = Math.min(y1, y2)
      const w = Math.abs(x2 - x1)
      const h = Math.abs(y2 - y1)
      if (w > 0 && h > 0) ctx.fillRect(x, y, w, h)
    } else if (shape === TOOLS.ELLIPSE) {
      const cx = (x1 + x2) / 2
      const cy = (y1 + y2) / 2
      const rx = Math.abs(x2 - x1) / 2
      const ry = Math.abs(y2 - y1) / 2
      if (rx > 0 && ry > 0) {
        ctx.beginPath()
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.restore()
  }

  const handlePointerDown = (e) => {
    if (!hasImage) return
    e.preventDefault()
    e.currentTarget.setPointerCapture?.(e.pointerId)
    pushHistory()
    const { x, y } = getPointerPos(e)
    drawStateRef.current = { active: true, startX: x, startY: y, lastX: x, lastY: y }

    if (tool === TOOLS.BRUSH || tool === TOOLS.ERASER) {
      drawBrushSegment(x, y, x + 0.001, y + 0.001, tool === TOOLS.ERASER)
    }
  }

  const handlePointerMove = (e) => {
    const state = drawStateRef.current
    if (!state.active) return
    const { x, y } = getPointerPos(e)
    if (tool === TOOLS.BRUSH || tool === TOOLS.ERASER) {
      drawBrushSegment(state.lastX, state.lastY, x, y, tool === TOOLS.ERASER)
      drawStateRef.current.lastX = x
      drawStateRef.current.lastY = y
    } else if (tool === TOOLS.RECT || tool === TOOLS.ELLIPSE) {
      drawShapePreview(state.startX, state.startY, x, y, tool)
    }
  }

  const handlePointerUp = (e) => {
    const state = drawStateRef.current
    if (!state.active) return
    const { x, y } = getPointerPos(e)
    if (tool === TOOLS.RECT || tool === TOOLS.ELLIPSE) {
      clearPreview()
      commitShape(state.startX, state.startY, x, y, tool)
    }
    drawStateRef.current.active = false
    e.currentTarget.releasePointerCapture?.(e.pointerId)
  }

  const extract = useCallback(() => {
    const img = imageRef.current
    const maskCanvas = maskCanvasRef.current
    if (!img || !maskCanvas) {
      showToast('请先上传图片')
      return
    }
    const maskCtx = maskCanvas.getContext('2d')
    const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)
    let hasAny = false
    for (let i = 3; i < maskData.data.length; i += 4) {
      if (maskData.data[i] > 0) {
        hasAny = true
        break
      }
    }
    if (!hasAny) {
      showToast('请先用画笔或形状框选区域')
      return
    }

    setBusy(true)
    try {
      const naturalW = img.naturalWidth
      const naturalH = img.naturalHeight

      const out = document.createElement('canvas')
      out.width = naturalW
      out.height = naturalH
      const outCtx = out.getContext('2d')
      outCtx.drawImage(img, 0, 0, naturalW, naturalH)

      const scaledMask = document.createElement('canvas')
      scaledMask.width = naturalW
      scaledMask.height = naturalH
      const smCtx = scaledMask.getContext('2d')
      smCtx.imageSmoothingEnabled = true
      smCtx.drawImage(maskCanvas, 0, 0, naturalW, naturalH)

      outCtx.globalCompositeOperation = 'destination-in'
      outCtx.drawImage(scaledMask, 0, 0)
      outCtx.globalCompositeOperation = 'source-over'

      const cropped = cropToContent(out)
      setResultUrl(cropped.toDataURL('image/png'))
    } catch (err) {
      console.error(err)
      showToast('提取失败')
    } finally {
      setBusy(false)
    }
  }, [showToast])

  const cursorClass = hasImage ? styles.cursorBrush : ''

  useEffect(() => {
    return () => {
      historyRef.current = []
    }
  }, [])

  const isToolActive = (t) => tool === t

  return (
    <ToolPageLayout title="自由框选抠图">
      <div className={styles.root}>
        <div className={styles.card}>
          <h2 className={styles.title}>✂️ 自由框选抠图</h2>
          <p className={styles.subtitle}>
            上传图片后，使用画笔 / 矩形 / 圆形等工具圈出需要保留的区域，未涂抹部分将变成透明背景导出 PNG。
          </p>

          <div className={styles.area}>
            <label className={styles.label} htmlFor="bc-file">
              1. 上传图片（支持 jpg / png / webp）
            </label>
            <input
              id="bc-file"
              className={styles.fileInput}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className={styles.toolbar}>
            <div className={styles.toolGroup}>
              <button
                type="button"
                className={`${styles.toolBtn} ${isToolActive(TOOLS.BRUSH) ? styles.toolBtnActive : ''}`}
                onClick={() => setTool(TOOLS.BRUSH)}
              >
                🖌 画笔
              </button>
              <button
                type="button"
                className={`${styles.toolBtn} ${isToolActive(TOOLS.RECT) ? styles.toolBtnActive : ''}`}
                onClick={() => setTool(TOOLS.RECT)}
              >
                ▭ 矩形
              </button>
              <button
                type="button"
                className={`${styles.toolBtn} ${isToolActive(TOOLS.ELLIPSE) ? styles.toolBtnActive : ''}`}
                onClick={() => setTool(TOOLS.ELLIPSE)}
              >
                ◯ 圆形
              </button>
              <button
                type="button"
                className={`${styles.toolBtn} ${isToolActive(TOOLS.ERASER) ? styles.toolBtnActive : ''}`}
                onClick={() => setTool(TOOLS.ERASER)}
              >
                🩹 橡皮
              </button>
            </div>

            <div className={styles.divider} />

            <div className={styles.sizeGroup}>
              <span>画笔大小</span>
              <input
                className={styles.sizeRange}
                type="range"
                min={4}
                max={200}
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
              />
              <span className={styles.sizeValue}>{brushSize}</span>
            </div>

            <div className={styles.divider} />

            <div className={styles.toolGroup}>
              <button type="button" className={styles.toolBtn} onClick={handleUndo}>
                ↩︎ 撤销
              </button>
              <button type="button" className={styles.dangerBtn} onClick={handleClearAll}>
                清空选区
              </button>
            </div>

            <div className={styles.actionGroup}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={extract}
                disabled={!hasImage || busy}
              >
                {busy ? '处理中...' : '提取选区为透明 PNG'}
              </button>
            </div>
          </div>

          <div className={styles.canvasStage}>
            {hasImage ? (
              <div
                className={`${styles.canvasWrap} ${cursorClass}`}
                style={{ width: displaySize.w, height: displaySize.h }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onPointerLeave={handlePointerUp}
              >
                <canvas ref={imageCanvasRef} className={styles.imageCanvas} />
                <canvas ref={maskCanvasRef} className={styles.maskCanvas} />
                <canvas ref={previewCanvasRef} className={styles.previewCanvas} />
              </div>
            ) : (
              <div className={styles.canvasPlaceholder}>请先上传一张图片开始抠图</div>
            )}
          </div>

          <div className={styles.bottomBar}>
            <div>
              <h4 className={styles.boxTitle}>提取结果</h4>
              <div className={styles.resultBox}>
                {resultUrl ? (
                  <img src={resultUrl} alt="提取结果" />
                ) : (
                  <span className={styles.placeholder}>等待提取...</span>
                )}
              </div>
              <a
                className={`${styles.downloadBtn} ${!resultUrl ? styles.downloadBtnDisabled : ''}`}
                href={resultUrl || '#'}
                download="brush_cutout.png"
                onClick={(e) => {
                  if (!resultUrl) e.preventDefault()
                }}
              >
                📥 下载透明 PNG
              </a>
            </div>
            <div>
              <h4 className={styles.boxTitle}>使用说明</h4>
              <div className={styles.tipsBlock}>
                <div>
                  <strong>画笔</strong>：自由涂抹想要保留的区域，按住鼠标拖动即可。
                </div>
                <div>
                  <strong>矩形 / 圆形</strong>：按住鼠标拖出形状，松开即追加到选区。
                </div>
                <div>
                  <strong>橡皮</strong>：擦除已经画好的选区，便于精修边缘。
                </div>
                <div>
                  <strong>撤销</strong>：可回退最近一次涂抹/形状操作（最多 {HISTORY_LIMIT} 步）。
                </div>
                <div>
                  <strong>提取</strong>：只保留蓝色选区下的像素，其余像素变透明并自动裁剪空白边。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}

function cropToContent(canvas) {
  const ctx = canvas.getContext('2d')
  const { width, height } = canvas
  const data = ctx.getImageData(0, 0, width, height).data
  let minX = width
  let minY = height
  let maxX = -1
  let maxY = -1
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = data[(y * width + x) * 4 + 3]
      if (a > 0) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  if (maxX < 0 || maxY < 0) return canvas
  const w = maxX - minX + 1
  const h = maxY - minY + 1
  const out = document.createElement('canvas')
  out.width = w
  out.height = h
  out.getContext('2d').drawImage(canvas, minX, minY, w, h, 0, 0, w, h)
  return out
}
