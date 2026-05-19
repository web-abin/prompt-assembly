import { useCallback, useEffect, useRef, useState } from 'react'
import ToolPageLayout from '../components/ToolPageLayout'
import { useToast } from '../context/ToastContext'
import styles from './ImageRegionInfo.module.css'

const TOOLS = {
  BRUSH: 'brush',
  RECT: 'rect',
  ELLIPSE: 'ellipse',
}

const MAX_DISPLAY_WIDTH = 1000
const MAX_DISPLAY_HEIGHT = 600
const PALETTE = ['#1890ff', '#52c41a', '#fa8c16', '#eb2f96', '#722ed1', '#13c2c2', '#fadb14', '#f5222d']

const REF_MODES = {
  WIDTH: 'width',
  HEIGHT: 'height',
  BOTH: 'both',
}

export default function ImageRegionInfo() {
  const { showToast } = useToast()

  const imageCanvasRef = useRef(null)
  const shapesCanvasRef = useRef(null)
  const previewCanvasRef = useRef(null)

  const imageRef = useRef(null)
  const shapeIdRef = useRef(1)
  const drawStateRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    points: [],
  })

  const [hasImage, setHasImage] = useState(false)
  const [imageInfo, setImageInfo] = useState({ naturalW: 0, naturalH: 0 })
  const [displaySize, setDisplaySize] = useState({ w: 0, h: 0 })
  const [tool, setTool] = useState(TOOLS.RECT)
  const [brushSize, setBrushSize] = useState(20)
  const [shapes, setShapes] = useState([])
  const [refMode, setRefMode] = useState(REF_MODES.HEIGHT)

  const scaleX = displaySize.w ? imageInfo.naturalW / displaySize.w : 1
  const scaleY = displaySize.h ? imageInfo.naturalH / displaySize.h : 1

  const drawShapesOverlay = useCallback(
    (allShapes) => {
      const canvas = shapesCanvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      allShapes.forEach((shape, idx) => {
        ctx.save()
        ctx.strokeStyle = shape.color
        ctx.fillStyle = hexToRgba(shape.color, 0.18)
        ctx.lineWidth = 2
        if (shape.type === TOOLS.RECT) {
          const { x, y, w, h } = shape
          ctx.fillRect(x, y, w, h)
          ctx.strokeRect(x, y, w, h)
        } else if (shape.type === TOOLS.ELLIPSE) {
          const { cx, cy, rx, ry } = shape
          ctx.beginPath()
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
        } else if (shape.type === TOOLS.BRUSH) {
          // Draw the stroke
          ctx.save()
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'
          ctx.lineWidth = shape.lineWidth
          ctx.strokeStyle = hexToRgba(shape.color, 0.45)
          ctx.beginPath()
          shape.points.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.y)
            else ctx.lineTo(p.x, p.y)
          })
          ctx.stroke()
          ctx.restore()
          // Also draw the bounding box dashed
          const bbox = brushBBox(shape)
          ctx.setLineDash([6, 4])
          ctx.lineWidth = 1.5
          ctx.strokeStyle = shape.color
          ctx.strokeRect(bbox.x, bbox.y, bbox.w, bbox.h)
          ctx.setLineDash([])
        }
        // Label index near top-left of bbox
        const labelPos = shapeAnchor(shape)
        const label = `#${idx + 1}`
        ctx.font = 'bold 12px system-ui, -apple-system, sans-serif'
        const textW = ctx.measureText(label).width + 10
        ctx.fillStyle = shape.color
        ctx.fillRect(labelPos.x, labelPos.y - 16, textW, 16)
        ctx.fillStyle = '#fff'
        ctx.fillText(label, labelPos.x + 5, labelPos.y - 4)
        ctx.restore()
      })
    },
    [],
  )

  useEffect(() => {
    if (!hasImage) return
    drawShapesOverlay(shapes)
  }, [shapes, hasImage, drawShapesOverlay])

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
        setImageInfo({ naturalW, naturalH })
        setDisplaySize({ w, h })
        setHasImage(true)
        setShapes([])
        shapeIdRef.current = 1

        requestAnimationFrame(() => {
          const imgCanvas = imageCanvasRef.current
          const shapesCanvas = shapesCanvasRef.current
          const previewCanvas = previewCanvasRef.current
          if (!imgCanvas || !shapesCanvas || !previewCanvas) return
          ;[imgCanvas, shapesCanvas, previewCanvas].forEach((c) => {
            c.width = w
            c.height = h
          })
          const imgCtx = imgCanvas.getContext('2d')
          imgCtx.clearRect(0, 0, w, h)
          imgCtx.drawImage(img, 0, 0, w, h)
          shapesCanvas.getContext('2d').clearRect(0, 0, w, h)
          previewCanvas.getContext('2d').clearRect(0, 0, w, h)
        })
      }
      img.onerror = () => showToast('图片加载失败')
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
    const canvas = shapesCanvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const sx = canvas.width / rect.width
    const sy = canvas.height / rect.height
    return {
      x: clamp((e.clientX - rect.left) * sx, 0, canvas.width),
      y: clamp((e.clientY - rect.top) * sy, 0, canvas.height),
    }
  }

  const drawPreview = (drawFn) => {
    const canvas = previewCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawFn(ctx)
  }

  const clearPreview = () => {
    const canvas = previewCanvasRef.current
    if (!canvas) return
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
  }

  const handlePointerDown = (e) => {
    if (!hasImage) return
    e.preventDefault()
    e.currentTarget.setPointerCapture?.(e.pointerId)
    const { x, y } = getPointerPos(e)
    drawStateRef.current = {
      active: true,
      startX: x,
      startY: y,
      lastX: x,
      lastY: y,
      points: [{ x, y }],
    }
  }

  const handlePointerMove = (e) => {
    const state = drawStateRef.current
    if (!state.active) return
    const { x, y } = getPointerPos(e)
    const color = nextColor(shapes.length)

    if (tool === TOOLS.BRUSH) {
      state.points.push({ x, y })
      state.lastX = x
      state.lastY = y
      drawPreview((ctx) => {
        ctx.save()
        ctx.strokeStyle = hexToRgba(color, 0.45)
        ctx.lineWidth = brushSize
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.beginPath()
        state.points.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.x, p.y)
          else ctx.lineTo(p.x, p.y)
        })
        ctx.stroke()
        ctx.restore()
      })
    } else if (tool === TOOLS.RECT) {
      const rx = Math.min(state.startX, x)
      const ry = Math.min(state.startY, y)
      const rw = Math.abs(x - state.startX)
      const rh = Math.abs(y - state.startY)
      drawPreview((ctx) => {
        ctx.save()
        ctx.strokeStyle = color
        ctx.fillStyle = hexToRgba(color, 0.18)
        ctx.lineWidth = 2
        ctx.fillRect(rx, ry, rw, rh)
        ctx.strokeRect(rx, ry, rw, rh)
        ctx.restore()
      })
    } else if (tool === TOOLS.ELLIPSE) {
      const cx = (state.startX + x) / 2
      const cy = (state.startY + y) / 2
      const r1 = Math.abs(x - state.startX) / 2
      const r2 = Math.abs(y - state.startY) / 2
      drawPreview((ctx) => {
        ctx.save()
        ctx.strokeStyle = color
        ctx.fillStyle = hexToRgba(color, 0.18)
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.ellipse(cx, cy, r1, r2, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.restore()
      })
    }
  }

  const handlePointerUp = (e) => {
    const state = drawStateRef.current
    if (!state.active) return
    state.active = false
    e.currentTarget.releasePointerCapture?.(e.pointerId)
    clearPreview()

    const { x, y } = getPointerPos(e)
    const id = shapeIdRef.current++
    const color = nextColor(shapes.length)

    if (tool === TOOLS.BRUSH) {
      const points = state.points
      if (points.length < 2) return
      const newShape = {
        id,
        type: TOOLS.BRUSH,
        points,
        lineWidth: brushSize,
        color,
      }
      setShapes((prev) => [...prev, newShape])
    } else if (tool === TOOLS.RECT) {
      const rx = Math.min(state.startX, x)
      const ry = Math.min(state.startY, y)
      const rw = Math.abs(x - state.startX)
      const rh = Math.abs(y - state.startY)
      if (rw < 2 || rh < 2) return
      setShapes((prev) => [...prev, { id, type: TOOLS.RECT, x: rx, y: ry, w: rw, h: rh, color }])
    } else if (tool === TOOLS.ELLIPSE) {
      const cx = (state.startX + x) / 2
      const cy = (state.startY + y) / 2
      const rx = Math.abs(x - state.startX) / 2
      const ry = Math.abs(y - state.startY) / 2
      if (rx < 1 || ry < 1) return
      setShapes((prev) => [...prev, { id, type: TOOLS.ELLIPSE, cx, cy, rx, ry, color }])
    }
  }

  const handleUndo = () => {
    setShapes((prev) => {
      if (!prev.length) {
        showToast('没有可撤销的选区')
        return prev
      }
      return prev.slice(0, -1)
    })
  }

  const handleClearAll = () => {
    if (!shapes.length) return
    setShapes([])
  }

  const handleRemoveShape = (id) => {
    setShapes((prev) => prev.filter((s) => s.id !== id))
  }

  const handleCopyAll = async () => {
    if (!shapes.length) {
      showToast('暂无选区')
      return
    }
    const text = shapes
      .map((s, i) => {
        const info = computeShapeInfo(s, scaleX, scaleY, imageInfo, refMode)
        return `#${i + 1} ${labelForType(s.type)}  ${info.formatted}`
      })
      .join('\n')
    try {
      await navigator.clipboard.writeText(text)
      showToast('已复制所有选区信息')
    } catch {
      showToast('复制失败，请手动复制')
    }
  }

  const cursorClass = hasImage ? styles.cursorBrush : ''
  const regionCount = shapes.length

  return (
    <ToolPageLayout title="图片选区信息">
      <div className={styles.root}>
        <div className={styles.card}>
          <h2 className={styles.title}>📐 图片选区信息</h2>
          <p className={styles.subtitle}>
            上传图片后，使用画笔 / 矩形 / 圆形在图上框选区域，点击「获取信息」即可读取每个选区的 x / y / w / h，支持按图片宽度、高度或宽高混合换算为百分比。
          </p>

          <div className={styles.area}>
            <label className={styles.label} htmlFor="iri-file">
              1. 上传图片（支持 jpg / png / webp）
            </label>
            <input
              id="iri-file"
              className={styles.fileInput}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {hasImage && (
              <div className={styles.imageMeta}>
                <span>原图尺寸</span>
                <strong>
                  {imageInfo.naturalW} × {imageInfo.naturalH} px
                </strong>
                <span style={{ color: '#888' }}>·</span>
                <span>预览尺寸</span>
                <strong>
                  {displaySize.w} × {displaySize.h} px
                </strong>
              </div>
            )}
          </div>

          <div className={styles.toolbar}>
            <div className={styles.toolGroup}>
              <button
                type="button"
                className={`${styles.toolBtn} ${tool === TOOLS.RECT ? styles.toolBtnActive : ''}`}
                onClick={() => setTool(TOOLS.RECT)}
              >
                ▭ 矩形
              </button>
              <button
                type="button"
                className={`${styles.toolBtn} ${tool === TOOLS.ELLIPSE ? styles.toolBtnActive : ''}`}
                onClick={() => setTool(TOOLS.ELLIPSE)}
              >
                ◯ 圆形
              </button>
              <button
                type="button"
                className={`${styles.toolBtn} ${tool === TOOLS.BRUSH ? styles.toolBtnActive : ''}`}
                onClick={() => setTool(TOOLS.BRUSH)}
              >
                🖌 画笔
              </button>
            </div>

            <div className={styles.divider} />

            <div className={styles.sizeGroup}>
              <span>画笔大小</span>
              <input
                className={styles.sizeRange}
                type="range"
                min={4}
                max={120}
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                disabled={tool !== TOOLS.BRUSH}
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
                onClick={handleCopyAll}
                disabled={!hasImage}
              >
                复制全部
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
                <canvas ref={shapesCanvasRef} className={styles.shapesCanvas} />
                <canvas ref={previewCanvasRef} className={styles.previewCanvas} />
              </div>
            ) : (
              <div className={styles.canvasPlaceholder}>请先上传一张图片开始框选</div>
            )}
          </div>

          <div className={styles.controls}>
            <span className={styles.controlsTitle}>百分比换算基准</span>
            <div className={styles.radioGroup}>
              <label className={styles.radioItem}>
                <input
                  type="radio"
                  name="ref-mode"
                  value={REF_MODES.HEIGHT}
                  checked={refMode === REF_MODES.HEIGHT}
                  onChange={() => setRefMode(REF_MODES.HEIGHT)}
                />
                基于图片高度（默认）
              </label>
              <label className={styles.radioItem}>
                <input
                  type="radio"
                  name="ref-mode"
                  value={REF_MODES.WIDTH}
                  checked={refMode === REF_MODES.WIDTH}
                  onChange={() => setRefMode(REF_MODES.WIDTH)}
                />
                基于图片宽度
              </label>
              <label className={styles.radioItem}>
                <input
                  type="radio"
                  name="ref-mode"
                  value={REF_MODES.BOTH}
                  checked={refMode === REF_MODES.BOTH}
                  onChange={() => setRefMode(REF_MODES.BOTH)}
                />
                基于图片宽高（x、w 用宽度，y、h 用高度）
              </label>
            </div>
          </div>

          <div className={styles.resultSection}>
            <div className={styles.resultHeader}>
              <h4 className={styles.boxTitle}>选区信息（基于原图像素）</h4>
              {regionCount > 0 && (
                <span className={styles.resultCount}>共 {regionCount} 个选区</span>
              )}
            </div>

            {regionCount === 0 ? (
              <div className={styles.placeholder}>
                {hasImage ? '请在图片上框选区域' : '等待上传图片...'}
              </div>
            ) : (
              <table className={styles.resultTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>类型</th>
                    <th>x</th>
                    <th>y</th>
                    <th>w</th>
                    <th>h</th>
                    <th>百分比</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {shapes.map((s, i) => {
                    const info = computeShapeInfo(s, scaleX, scaleY, imageInfo, refMode)
                    return (
                      <tr key={s.id}>
                        <td>
                          <span className={styles.shapeBadge}>
                            <span
                              className={styles.shapeDot}
                              style={{ background: s.color }}
                            />
                            {i + 1}
                          </span>
                        </td>
                        <td>{labelForType(s.type)}</td>
                        <td>{info.x}px</td>
                        <td>{info.y}px</td>
                        <td>{info.w}px</td>
                        <td>{info.h}px</td>
                        <td>{info.formatted}</td>
                        <td>
                          <button
                            type="button"
                            className={styles.copyBtn}
                            onClick={() => handleRemoveShape(s.id)}
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}

            <div className={styles.tipsBlock}>
              <div>
                <strong>矩形 / 圆形</strong>：按住鼠标拖出选区，松开即添加。
              </div>
              <div>
                <strong>画笔</strong>：自由涂抹形成笔画，记录其外接矩形作为选区。
              </div>
              <div>
                <strong>百分比基准</strong>：默认按图片高度换算；切换基准后表格中的百分比会实时更新，例如「基于图片宽度」时，y / h 也会以图片宽度作为分母。
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

function nextColor(idx) {
  return PALETTE[idx % PALETTE.length]
}

function hexToRgba(hex, alpha) {
  const m = /^#?([a-fA-F0-9]{6})$/.exec(hex)
  if (!m) return hex
  const num = parseInt(m[1], 16)
  const r = (num >> 16) & 0xff
  const g = (num >> 8) & 0xff
  const b = num & 0xff
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function labelForType(t) {
  if (t === TOOLS.RECT) return '矩形'
  if (t === TOOLS.ELLIPSE) return '圆形'
  if (t === TOOLS.BRUSH) return '画笔'
  return t
}

function brushBBox(shape) {
  const half = shape.lineWidth / 2
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  for (const p of shape.points) {
    if (p.x < minX) minX = p.x
    if (p.y < minY) minY = p.y
    if (p.x > maxX) maxX = p.x
    if (p.y > maxY) maxY = p.y
  }
  return {
    x: minX - half,
    y: minY - half,
    w: maxX - minX + half * 2,
    h: maxY - minY + half * 2,
  }
}

function shapeBBoxDisplay(shape) {
  if (shape.type === TOOLS.RECT) {
    return { x: shape.x, y: shape.y, w: shape.w, h: shape.h }
  }
  if (shape.type === TOOLS.ELLIPSE) {
    return {
      x: shape.cx - shape.rx,
      y: shape.cy - shape.ry,
      w: shape.rx * 2,
      h: shape.ry * 2,
    }
  }
  if (shape.type === TOOLS.BRUSH) {
    return brushBBox(shape)
  }
  return { x: 0, y: 0, w: 0, h: 0 }
}

function shapeAnchor(shape) {
  const bbox = shapeBBoxDisplay(shape)
  return { x: bbox.x, y: bbox.y }
}

function computeShapeInfo(shape, scaleX, scaleY, imageInfo, refMode) {
  const bbox = shapeBBoxDisplay(shape)
  const x = Math.round(bbox.x * scaleX)
  const y = Math.round(bbox.y * scaleY)
  const w = Math.round(bbox.w * scaleX)
  const h = Math.round(bbox.h * scaleY)
  const { naturalW, naturalH } = imageInfo

  const pct = (val, base) => {
    if (!base) return '0%'
    return `${((val / base) * 100).toFixed(2)}%`
  }

  let formatted = ''
  if (refMode === REF_MODES.WIDTH) {
    const base = naturalW
    formatted = `x:${pct(x, base)}图片宽度  y:${pct(y, base)}图片宽度  w:${pct(w, base)}图片宽度  h:${pct(h, base)}图片宽度`
  } else if (refMode === REF_MODES.HEIGHT) {
    const base = naturalH
    formatted = `x:${pct(x, base)}图片高度  y:${pct(y, base)}图片高度  w:${pct(w, base)}图片高度  h:${pct(h, base)}图片高度`
  } else {
    formatted = `x:${pct(x, naturalW)}图片宽度  y:${pct(y, naturalH)}图片高度  w:${pct(w, naturalW)}图片宽度  h:${pct(h, naturalH)}图片高度`
  }

  return { x, y, w, h, formatted }
}
