import { useCallback, useEffect, useRef, useState } from 'react'
import JSZip from 'jszip'
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
const MIN_REGION_AREA = 16
const ALPHA_THRESHOLD = 8

export default function BrushCutout() {
  const { showToast } = useToast()

  const imageCanvasRef = useRef(null)
  const maskCanvasRef = useRef(null)
  const previewCanvasRef = useRef(null)

  const imageRef = useRef(null)
  const drawStateRef = useRef({ active: false, startX: 0, startY: 0, lastX: 0, lastY: 0 })
  const historyRef = useRef([])
  const resultsRef = useRef([])

  const [hasImage, setHasImage] = useState(false)
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 })
  const [tool, setTool] = useState(TOOLS.BRUSH)
  const [brushSize, setBrushSize] = useState(40)
  const [results, setResults] = useState([])
  const [busy, setBusy] = useState(false)

  const getMaskCtx = useCallback(() => maskCanvasRef.current?.getContext('2d') ?? null, [])
  const getPreviewCtx = useCallback(
    () => previewCanvasRef.current?.getContext('2d') ?? null,
    [],
  )

  const revokeResults = useCallback((list) => {
    list.forEach((r) => {
      if (r.url) URL.revokeObjectURL(r.url)
    })
  }, [])

  const updateResults = useCallback(
    (newResults) => {
      revokeResults(resultsRef.current)
      resultsRef.current = newResults
      setResults(newResults)
    },
    [revokeResults],
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
    updateResults([])
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
        updateResults([])
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
    [showToast, updateResults],
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

  const extract = useCallback(async () => {
    const img = imageRef.current
    const maskCanvas = maskCanvasRef.current
    if (!img || !maskCanvas) {
      showToast('请先上传图片')
      return
    }
    const maskCtx = maskCanvas.getContext('2d')
    const dispW = maskCanvas.width
    const dispH = maskCanvas.height
    const maskData = maskCtx.getImageData(0, 0, dispW, dispH)

    const { labels, components } = findConnectedComponents(
      maskData,
      dispW,
      dispH,
      ALPHA_THRESHOLD,
      MIN_REGION_AREA,
    )

    if (!components.length) {
      showToast('请先用画笔或形状框选区域')
      return
    }

    setBusy(true)
    try {
      const naturalW = img.naturalWidth
      const naturalH = img.naturalHeight
      const scaleX = naturalW / dispW
      const scaleY = naturalH / dispH

      const regionCanvases = components.map((c) =>
        buildRegionCanvas(img, maskData.data, labels, dispW, c, scaleX, scaleY, naturalW, naturalH),
      )

      const blobs = await Promise.all(
        regionCanvases.map((c) => canvasToBlob(c, 'image/png')),
      )

      const newResults = blobs.map((blob, i) => ({
        blob,
        url: URL.createObjectURL(blob),
        name: `cutout_${String(i + 1).padStart(2, '0')}.png`,
        width: regionCanvases[i].width,
        height: regionCanvases[i].height,
      }))
      updateResults(newResults)
    } catch (err) {
      console.error(err)
      showToast('提取失败')
    } finally {
      setBusy(false)
    }
  }, [showToast, updateResults])

  const handleDownload = useCallback(async () => {
    if (!results.length) return
    if (results.length === 1) {
      const a = document.createElement('a')
      a.href = results[0].url
      a.download = results[0].name
      a.click()
      return
    }
    try {
      const zip = new JSZip()
      results.forEach((r) => zip.file(r.name, r.blob))
      const content = await zip.generateAsync({ type: 'blob' })
      const zipUrl = URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = zipUrl
      a.download = `brush_cutouts_${Date.now()}.zip`
      a.click()
      setTimeout(() => URL.revokeObjectURL(zipUrl), 1000)
    } catch (err) {
      console.error(err)
      showToast('打包下载失败')
    }
  }, [results, showToast])

  const cursorClass = hasImage ? styles.cursorBrush : ''

  useEffect(() => {
    return () => {
      historyRef.current = []
      revokeResults(resultsRef.current)
      resultsRef.current = []
    }
  }, [revokeResults])

  const isToolActive = (t) => tool === t
  const regionCount = results.length
  const downloadLabel =
    regionCount === 0
      ? '📥 下载透明 PNG'
      : regionCount === 1
        ? '📥 下载透明 PNG'
        : `📦 下载 ZIP（共 ${regionCount} 张）`

  return (
    <ToolPageLayout title="自由框选抠图">
      <div className={styles.root}>
        <div className={styles.card}>
          <h2 className={styles.title}>✂️ 自由框选抠图</h2>
          <p className={styles.subtitle}>
            上传图片后，使用画笔 / 矩形 / 圆形等工具圈出需要保留的区域。每个独立的框选都会被单独导出为透明 PNG，多个区域将打包为 ZIP 下载。
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
                {busy ? '处理中...' : '提取所有选区'}
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
              <div className={styles.resultHeader}>
                <h4 className={styles.boxTitle}>提取结果</h4>
                {regionCount > 0 && (
                  <span className={styles.resultCount}>共 {regionCount} 个区域</span>
                )}
              </div>
              <div className={styles.resultBox}>
                {regionCount === 0 ? (
                  <span className={styles.placeholder}>等待提取...</span>
                ) : (
                  <div className={styles.resultGrid}>
                    {results.map((r, i) => (
                      <div className={styles.resultItem} key={r.url}>
                        <div className={styles.resultThumb}>
                          <img src={r.url} alt={`区域 ${i + 1}`} />
                        </div>
                        <div className={styles.resultMeta}>
                          <span className={styles.resultIndex}>#{i + 1}</span>
                          <span className={styles.resultDim}>
                            {r.width}×{r.height}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                className={`${styles.downloadBtn} ${regionCount === 0 ? styles.downloadBtnDisabled : ''}`}
                onClick={handleDownload}
                disabled={regionCount === 0}
              >
                {downloadLabel}
              </button>
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
                  <strong>多区域</strong>：彼此不相连的选区会各自导出为一张紧贴边缘的透明 PNG，超过 1 张将打包为 ZIP。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}

function findConnectedComponents(maskData, width, height, alphaThreshold, minArea) {
  const labels = new Int32Array(width * height)
  const data = maskData.data
  const stack = new Int32Array(width * height)
  const components = []
  let nextLabel = 0

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const start = y * width + x
      if (labels[start] !== 0) continue
      if (data[start * 4 + 3] < alphaThreshold) continue

      nextLabel++
      let stackTop = 0
      stack[stackTop++] = start
      labels[start] = nextLabel

      let minX = x
      let maxX = x
      let minY = y
      let maxY = y
      let count = 0

      while (stackTop > 0) {
        const idx = stack[--stackTop]
        const cy = (idx / width) | 0
        const cx = idx - cy * width
        count++
        if (cx < minX) minX = cx
        if (cx > maxX) maxX = cx
        if (cy < minY) minY = cy
        if (cy > maxY) maxY = cy

        for (let dy = -1; dy <= 1; dy++) {
          const ny = cy + dy
          if (ny < 0 || ny >= height) continue
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue
            const nx = cx + dx
            if (nx < 0 || nx >= width) continue
            const nIdx = ny * width + nx
            if (labels[nIdx] !== 0) continue
            if (data[nIdx * 4 + 3] < alphaThreshold) continue
            labels[nIdx] = nextLabel
            stack[stackTop++] = nIdx
          }
        }
      }

      if (count >= minArea) {
        components.push({ label: nextLabel, minX, maxX, minY, maxY, count })
      }
    }
  }

  // Sort by reading order (top-to-bottom, then left-to-right) for stable naming
  components.sort((a, b) => {
    if (a.minY !== b.minY) return a.minY - b.minY
    return a.minX - b.minX
  })

  return { labels, components }
}

function buildRegionCanvas(
  img,
  maskRgba,
  labels,
  dispW,
  component,
  scaleX,
  scaleY,
  naturalW,
  naturalH,
) {
  const { label, minX, maxX, minY, maxY } = component
  const bboxW = maxX - minX + 1
  const bboxH = maxY - minY + 1

  // Per-component mask at display resolution, restricted to bbox
  const compMask = new ImageData(bboxW, bboxH)
  const cmData = compMask.data
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (labels[y * dispW + x] !== label) continue
      const srcIdx = (y * dispW + x) * 4
      const dstIdx = ((y - minY) * bboxW + (x - minX)) * 4
      cmData[dstIdx + 3] = maskRgba[srcIdx + 3]
    }
  }
  const compMaskCanvas = document.createElement('canvas')
  compMaskCanvas.width = bboxW
  compMaskCanvas.height = bboxH
  compMaskCanvas.getContext('2d').putImageData(compMask, 0, 0)

  // Natural-resolution bbox (with 1px buffer to swallow rounding)
  const buffer = 1
  const nMinX = Math.max(0, Math.floor(minX * scaleX) - buffer)
  const nMinY = Math.max(0, Math.floor(minY * scaleY) - buffer)
  const nMaxX = Math.min(naturalW, Math.ceil((maxX + 1) * scaleX) + buffer)
  const nMaxY = Math.min(naturalH, Math.ceil((maxY + 1) * scaleY) + buffer)
  const regionW = nMaxX - nMinX
  const regionH = nMaxY - nMinY

  const work = document.createElement('canvas')
  work.width = regionW
  work.height = regionH
  const workCtx = work.getContext('2d')
  workCtx.imageSmoothingEnabled = true
  workCtx.drawImage(img, nMinX, nMinY, regionW, regionH, 0, 0, regionW, regionH)

  // Where the display-space bbox lands inside the natural-space region
  const drawX = minX * scaleX - nMinX
  const drawY = minY * scaleY - nMinY
  const drawW = bboxW * scaleX
  const drawH = bboxH * scaleY

  workCtx.globalCompositeOperation = 'destination-in'
  workCtx.drawImage(compMaskCanvas, drawX, drawY, drawW, drawH)
  workCtx.globalCompositeOperation = 'source-over'

  return cropToContent(work, 0)
}

function cropToContent(canvas, padding = 0) {
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
  if (padding > 0) {
    minX = Math.max(0, minX - padding)
    minY = Math.max(0, minY - padding)
    maxX = Math.min(width - 1, maxX + padding)
    maxY = Math.min(height - 1, maxY + padding)
  }
  const w = maxX - minX + 1
  const h = maxY - minY + 1
  const out = document.createElement('canvas')
  out.width = w
  out.height = h
  out.getContext('2d').drawImage(canvas, minX, minY, w, h, 0, 0, w, h)
  return out
}

function canvasToBlob(canvas, type = 'image/png', quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('toBlob failed'))
      },
      type,
      quality,
    )
  })
}
