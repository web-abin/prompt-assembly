import { useCallback, useEffect, useRef, useState } from 'react'
import ToolPageLayout from '../components/ToolPageLayout'
import { useToast } from '../context/ToastContext'
import styles from './Spritesheet.module.css'

const FORMATS = [
  { value: 'normal', label: '普通数组格式' },
  { value: 'pixi', label: 'PixiJS 标准 Hash' },
  { value: 'phaser', label: 'Phaser 2/3 格式' },
  { value: 'cocos', label: 'Cocos Creator 格式' },
  { value: 'egret', label: 'Egret 格式' },
  { value: 'texturepacker', label: 'TexturePacker 通用 Hash' }
]

const LAYOUT_MODES = [
  { value: 'equal-width', label: '等宽（按宽度等比例缩放）' },
  { value: 'equal-height', label: '等高（按高度等比例缩放）' },
  { value: 'natural', label: '自然拼接（按原尺寸不缩放）' }
]

export default function Spritesheet() {
  const { showToast } = useToast()
  const [layoutMode, setLayoutMode] = useState('equal-width')
  const [cellWidth, setCellWidth] = useState(128)
  const [cellHeight, setCellHeight] = useState(128)
  const [cols, setCols] = useState(10)
  const [padding, setPadding] = useState(10)
  const [jsonFormat, setJsonFormat] = useState('pixi')
  const [images, setImages] = useState([])
  const [frames, setFrames] = useState([])
  const [sheetUrl, setSheetUrl] = useState('')
  const [sheetSize, setSheetSize] = useState({ w: 0, h: 0 })
  const [sheetVisible, setSheetVisible] = useState(false)
  const sheetBlobUrlRef = useRef(null)
  const imagesRef = useRef([])
  const dragFromRef = useRef(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [draggingIndex, setDraggingIndex] = useState(null)

  useEffect(() => {
    imagesRef.current = images
  }, [images])

  useEffect(() => {
    return () => {
      if (sheetBlobUrlRef.current) URL.revokeObjectURL(sheetBlobUrlRef.current)
      imagesRef.current.forEach((p) => URL.revokeObjectURL(p.revoke))
    }
  }, [])

  const loadFiles = useCallback(
    async (e) => {
      const files = Array.from(e.target.files || [])
      if (files.length === 0) return

      setImages((prev) => {
        prev.forEach((p) => URL.revokeObjectURL(p.revoke))
        return []
      })
      if (sheetBlobUrlRef.current) {
        URL.revokeObjectURL(sheetBlobUrlRef.current)
        sheetBlobUrlRef.current = null
      }

      const loaded = []
      for (const f of files) {
        const img = new Image()
        const u = URL.createObjectURL(f)
        img.src = u
        await new Promise((r) => {
          img.onload = r
        })
        loaded.push({ img, revoke: u })
      }
      setImages(loaded)
      setSheetVisible(false)
      setFrames([])
      setSheetUrl('')
      showToast(`已加载 ${loaded.length} 张图片`)
    },
    [showToast]
  )

  const moveImage = useCallback((index, delta) => {
    setImages((prev) => {
      const j = index + delta
      if (j < 0 || j >= prev.length) return prev
      const next = [...prev]
      const t = next[index]
      next[index] = next[j]
      next[j] = t
      return next
    })
  }, [])

  const handleOrderSlotBlur = useCallback(
    (fromIndex) => (e) => {
      const el = e.currentTarget
      const n = images.length
      const cur = fromIndex + 1
      const slot = parseInt(String(el.value).trim(), 10)
      if (!Number.isFinite(slot) || slot < 1 || slot > n) {
        showToast(`请输入 1～${n} 的序号`)
        el.value = String(cur)
        return
      }
      if (slot === cur) return
      const toIndex = slot - 1
      setImages((prev) => {
        const next = [...prev]
        const a = next[fromIndex]
        next[fromIndex] = next[toIndex]
        next[toIndex] = a
        return next
      })
    },
    [images.length, showToast]
  )

  const clearDragState = useCallback(() => {
    dragFromRef.current = null
    setDragOverIndex(null)
    setDraggingIndex(null)
  }, [])

  const handleRowDragStart = useCallback((index) => (e) => {
    dragFromRef.current = index
    setDraggingIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }, [])

  const handleRowDragOver = useCallback((index) => (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverIndex((prev) => (prev === index ? prev : index))
  }, [])

  const handleRowDrop = useCallback(
    (toIndex) => (e) => {
      e.preventDefault()
      const from = dragFromRef.current
      clearDragState()
      if (from === null || from === toIndex) return
      setImages((prev) => {
        const next = [...prev]
        const [item] = next.splice(from, 1)
        next.splice(toIndex, 0, item)
        return next
      })
    },
    [clearDragState]
  )

  const handleRowDragEnd = useCallback(() => {
    clearDragState()
  }, [clearDragState])

  const makeSheet = useCallback(() => {
    if (!images.length) {
      showToast('请选择图片')
      return
    }

    const colCount = Math.max(1, parseInt(String(cols), 10) || 10)
    const pad = Math.max(0, parseInt(String(padding), 10) || 0)
    const count = images.length
    const rows = Math.ceil(count / colCount)

    const canvas = document.createElement('canvas')
    const nextFrames = []

    if (layoutMode === 'natural') {
      const colWidths = new Array(colCount).fill(0)
      const rowHeights = new Array(rows).fill(0)
      images.forEach(({ img }, i) => {
        const col = i % colCount
        const row = Math.floor(i / colCount)
        if (img.width > colWidths[col]) colWidths[col] = img.width
        if (img.height > rowHeights[row]) rowHeights[row] = img.height
      })
      const colX = new Array(colCount)
      let cx = 0
      for (let c = 0; c < colCount; c++) {
        colX[c] = cx
        cx += colWidths[c] + (c < colCount - 1 ? pad : 0)
      }
      const rowY = new Array(rows)
      let cy = 0
      for (let r = 0; r < rows; r++) {
        rowY[r] = cy
        cy += rowHeights[r] + (r < rows - 1 ? pad : 0)
      }
      canvas.width = Math.max(1, cx)
      canvas.height = Math.max(1, cy)
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      images.forEach(({ img }, i) => {
        const col = i % colCount
        const row = Math.floor(i / colCount)
        const cw = colWidths[col]
        const ch = rowHeights[row]
        const x = colX[col]
        const y = rowY[row]
        const offsetX = Math.round((cw - img.width) / 2)
        const offsetY = Math.round((ch - img.height) / 2)
        ctx.drawImage(img, x + offsetX, y + offsetY, img.width, img.height)
        nextFrames.push({ name: `frame-${i + 1}`, x, y, w: cw, h: ch })
      })
    } else if (layoutMode === 'equal-height') {
      const h = Math.max(1, parseInt(String(cellHeight), 10) || 128)
      const w = Math.max(
        1,
        Math.ceil(
          images.reduce((maxW, { img }) => {
            const scale = h / img.height
            return Math.max(maxW, img.width * scale)
          }, 0)
        )
      )
      canvas.width = colCount * w + (colCount - 1) * pad
      canvas.height = rows * h + (rows - 1) * pad
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      images.forEach(({ img }, i) => {
        const col = i % colCount
        const row = Math.floor(i / colCount)
        const x = col * (w + pad)
        const y = row * (h + pad)
        const scale = h / img.height
        const drawW = Math.round(img.width * scale)
        const drawH = h
        const offsetX = Math.round((w - drawW) / 2)
        const offsetY = 0
        ctx.drawImage(img, x + offsetX, y + offsetY, drawW, drawH)
        nextFrames.push({ name: `frame-${i + 1}`, x, y, w, h })
      })
    } else {
      const w = Math.max(1, parseInt(String(cellWidth), 10) || 128)
      const h = Math.max(
        1,
        Math.ceil(
          images.reduce((maxH, { img }) => {
            const scale = w / img.width
            return Math.max(maxH, img.height * scale)
          }, 0)
        )
      )
      canvas.width = colCount * w + (colCount - 1) * pad
      canvas.height = rows * h + (rows - 1) * pad
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      images.forEach(({ img }, i) => {
        const col = i % colCount
        const row = Math.floor(i / colCount)
        const x = col * (w + pad)
        const y = row * (h + pad)
        const scale = w / img.width
        const drawW = w
        const drawH = Math.round(img.height * scale)
        const offsetX = 0
        const offsetY = Math.round((h - drawH) / 2)
        ctx.drawImage(img, x + offsetX, y + offsetY, drawW, drawH)
        nextFrames.push({ name: `frame-${i + 1}`, x, y, w, h })
      })
    }

    if (sheetBlobUrlRef.current) {
      URL.revokeObjectURL(sheetBlobUrlRef.current)
      sheetBlobUrlRef.current = null
    }

    const canvasW = canvas.width
    const canvasH = canvas.height
    canvas.toBlob(
      (blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        sheetBlobUrlRef.current = url
        setSheetUrl(url)
        setSheetSize({ w: canvasW, h: canvasH })
        setFrames(nextFrames)
        setSheetVisible(true)
      },
      'image/png',
      0.95
    )
  }, [cellWidth, cellHeight, cols, images, layoutMode, padding, showToast])

  const downloadPng = useCallback(() => {
    if (!sheetUrl) return
    const a = document.createElement('a')
    a.href = sheetUrl
    a.download = 'spritesheet.png'
    a.click()
  }, [sheetUrl])

  const downloadJson = useCallback(() => {
    if (!frames.length || !sheetSize.w) return

    let jsonData
    const fmt = jsonFormat
    const { w: mw, h: mh } = sheetSize

    if (fmt === 'pixi') {
      const o = {}
      frames.forEach((f) => {
        o[f.name] = { frame: { x: f.x, y: f.y, w: f.w, h: f.h } }
      })
      jsonData = {
        frames: o,
        meta: { image: 'role.png', size: { w: mw, h: mh } }
      }
    } else if (fmt === 'phaser') {
      jsonData = {
        frames: frames.map((f) => ({
          filename: f.name,
          frame: { x: f.x, y: f.y, w: f.w, h: f.h }
        }))
      }
    } else if (fmt === 'cocos') {
      const o = {}
      frames.forEach((f) => {
        o[f.name] = { x: f.x, y: f.y, width: f.w, height: f.h }
      })
      jsonData = { texture: 'role.png', frames: o }
    } else if (fmt === 'egret') {
      jsonData = {
        file: 'role.png',
        frames: frames.map((f) => ({
          name: f.name,
          x: f.x,
          y: f.y,
          w: f.w,
          h: f.h
        }))
      }
    } else if (fmt === 'texturepacker') {
      const o = {}
      frames.forEach((f) => {
        o[f.name] = {
          frame: { x: f.x, y: f.y, w: f.w, h: f.h },
          sourceSize: { w: f.w, h: f.h }
        }
      })
      jsonData = {
        frames: o,
        meta: { image: 'role.png', size: { w: mw, h: mh } }
      }
    } else {
      jsonData = frames
    }

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: 'application/json'
    })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'spritesheet.json'
    a.click()
  }, [frames, jsonFormat, sheetSize])

  return (
    <ToolPageLayout title="精灵图合成">
      <div className="tool-panel">
        <h2 className="tool-page-title">SpriteSheet 精灵图合成</h2>
        <p className="tool-page-lead">
          多张图片合成一张雪碧图，并导出主流引擎可用的 JSON。加载后可调整顺序再生成。
        </p>

        <div className="tool-field">
          <label className="tool-label" htmlFor="spritesheet-files">
            选择图片（可多选）
          </label>
          <input
            id="spritesheet-files"
            className="tool-input-file"
            type="file"
            multiple
            accept="image/*"
            onChange={loadFiles}
          />
          {images.length > 0 && (
            <div className={styles.orderBlock}>
              <div className={styles.orderHint}>
                合成顺序（影响雪碧图格子与 frame 编号）：可拖左侧手柄或上移/下移；左侧序号为可编辑序号，改为目标位置后失焦即与对调。
              </div>
              <div className={styles.orderList}>
                {images.map((entry, index) => (
                  <div
                    key={entry.revoke}
                    className={`${styles.orderRow} ${
                      dragOverIndex === index ? styles.orderRowDropOver : ''
                    } ${draggingIndex === index ? styles.orderRowDragging : ''}`}
                    onDragOver={handleRowDragOver(index)}
                    onDrop={handleRowDrop(index)}
                  >
                    <button
                      type="button"
                      className={styles.dragHandle}
                      draggable
                      onDragStart={handleRowDragStart(index)}
                      onDragEnd={handleRowDragEnd}
                      aria-label={`拖拽调整第 ${index + 1} 张的顺序`}
                      title="拖拽排序"
                    >
                      <span className={styles.dragGripDots} aria-hidden />
                    </button>
                    <input
                      key={`slot-${entry.revoke}-${index}`}
                      type="number"
                      min={1}
                      max={images.length}
                      inputMode="numeric"
                      defaultValue={index + 1}
                      className={`tool-input ${styles.orderSlotInput}`}
                      aria-label={`当前第 ${index + 1} 张，改为目标序号 1～${images.length} 后失焦即与该位置对调`}
                      onBlur={handleOrderSlotBlur(index)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          e.currentTarget.blur()
                        }
                      }}
                    />
                    <img
                      className={styles.orderThumb}
                      src={entry.revoke}
                      alt=""
                      width={40}
                      height={40}
                      draggable={false}
                    />
                    <div className={styles.orderActions}>
                      <button
                        type="button"
                        className={`tool-btn-secondary ${styles.orderBtn}`}
                        disabled={index === 0}
                        onClick={() => moveImage(index, -1)}
                        aria-label={`将第 ${index + 1} 张上移`}
                      >
                        上移
                      </button>
                      <button
                        type="button"
                        className={`tool-btn-secondary ${styles.orderBtn}`}
                        disabled={index === images.length - 1}
                        onClick={() => moveImage(index, 1)}
                        aria-label={`将第 ${index + 1} 张下移`}
                      >
                        下移
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="tool-field">
          <label className="tool-label" htmlFor="spritesheet-layout-mode">
            拼接方式
          </label>
          <select
            id="spritesheet-layout-mode"
            className="tool-select"
            value={layoutMode}
            onChange={(e) => setLayoutMode(e.target.value)}
          >
            {LAYOUT_MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {layoutMode === 'equal-width' && (
          <div className="tool-field">
            <label className="tool-label" htmlFor="spritesheet-cell-w">
              每个小图宽度（px，建议用二倍图）→ 高度自动等比例
            </label>
            <input
              id="spritesheet-cell-w"
              className="tool-input"
              type="number"
              min={1}
              value={cellWidth}
              onChange={(e) => setCellWidth(Number(e.target.value) || 0)}
            />
          </div>
        )}

        {layoutMode === 'equal-height' && (
          <div className="tool-field">
            <label className="tool-label" htmlFor="spritesheet-cell-h">
              每个小图高度（px，建议用二倍图）→ 宽度自动等比例
            </label>
            <input
              id="spritesheet-cell-h"
              className="tool-input"
              type="number"
              min={1}
              value={cellHeight}
              onChange={(e) => setCellHeight(Number(e.target.value) || 0)}
            />
          </div>
        )}

        <div className="tool-field">
          <label className="tool-label" htmlFor="spritesheet-cols">
            每行数量（默认 10）
          </label>
          <input
            id="spritesheet-cols"
            className="tool-input"
            type="number"
            min={1}
            value={cols}
            onChange={(e) => setCols(Number(e.target.value) || 0)}
          />
        </div>

        <div className="tool-field">
          <label className="tool-label" htmlFor="spritesheet-pad">
            图片间距（px）
          </label>
          <input
            id="spritesheet-pad"
            className="tool-input"
            type="number"
            min={4}
            value={padding}
            onChange={(e) => setPadding(Number(e.target.value) || 0)}
          />
        </div>

        <div className="tool-field">
          <label className="tool-label" htmlFor="spritesheet-json-fmt">
            JSON 导出格式（主流引擎全支持）
          </label>
          <select
            id="spritesheet-json-fmt"
            className="tool-select"
            value={jsonFormat}
            onChange={(e) => setJsonFormat(e.target.value)}
          >
            {FORMATS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <button type="button" className="tool-btn-primary" onClick={makeSheet}>
          生成精灵图
        </button>

        {sheetVisible && sheetUrl && (
          <div className="tool-result-block">
            <img
              src={sheetUrl}
              alt="生成的精灵图预览"
              className="tool-sheet-preview"
            />
            <div className="tool-btn-row tool-btn-row-stacked">
              <button type="button" className="tool-btn-download" onClick={downloadPng}>
                下载 spritesheet.png
              </button>
              <button type="button" className="tool-btn-json" onClick={downloadJson}>
                下载 spritesheet.json
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  )
}
