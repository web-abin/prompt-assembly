import { useCallback, useEffect, useRef, useState } from 'react'
import ToolPageLayout from '../components/ToolPageLayout'
import { useToast } from '../context/ToastContext'

const FORMATS = [
  { value: 'normal', label: '普通数组格式' },
  { value: 'pixi', label: 'PixiJS 标准 Hash' },
  { value: 'phaser', label: 'Phaser 2/3 格式' },
  { value: 'cocos', label: 'Cocos Creator 格式' },
  { value: 'egret', label: 'Egret 格式' },
  { value: 'texturepacker', label: 'TexturePacker 通用 Hash' }
]

export default function Spritesheet() {
  const { showToast } = useToast()
  const [cellWidth, setCellWidth] = useState(128)
  const [cols, setCols] = useState(10)
  const [padding, setPadding] = useState(0)
  const [jsonFormat, setJsonFormat] = useState('normal')
  const [images, setImages] = useState([])
  const [frames, setFrames] = useState([])
  const [sheetUrl, setSheetUrl] = useState('')
  const [sheetSize, setSheetSize] = useState({ w: 0, h: 0 })
  const [sheetVisible, setSheetVisible] = useState(false)
  const sheetBlobUrlRef = useRef(null)
  const imagesRef = useRef([])

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
      showToast(`已加载 ${loaded.length} 张图片`)
    },
    [showToast]
  )

  const makeSheet = useCallback(() => {
    if (!images.length) {
      showToast('请选择图片')
      return
    }

    const w = Math.max(1, parseInt(String(cellWidth), 10) || 128)
    const colCount = Math.max(1, parseInt(String(cols), 10) || 10)
    const pad = Math.max(0, parseInt(String(padding), 10) || 0)
    const count = images.length
    const rows = Math.ceil(count / colCount)

    const ratio = images[0].img.height / images[0].img.width
    const h = Math.round(w * ratio)

    const canvas = document.createElement('canvas')
    canvas.width = colCount * w + (colCount - 1) * pad
    canvas.height = rows * h + (rows - 1) * pad

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const nextFrames = []
    images.forEach(({ img }, i) => {
      const col = i % colCount
      const row = Math.floor(i / colCount)
      const x = col * (w + pad)
      const y = row * (h + pad)
      ctx.drawImage(img, x, y, w, h)
      nextFrames.push({ name: `frame-${i + 1}`, x, y, w, h })
    })

    if (sheetBlobUrlRef.current) {
      URL.revokeObjectURL(sheetBlobUrlRef.current)
      sheetBlobUrlRef.current = null
    }

    canvas.toBlob(
      (blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        sheetBlobUrlRef.current = url
        setSheetUrl(url)
        setSheetSize({ w: canvas.width, h: canvas.height })
        setFrames(nextFrames)
        setSheetVisible(true)
      },
      'image/png',
      0.95
    )
  }, [cellWidth, cols, images, padding, showToast])

  const downloadPng = useCallback(() => {
    if (!sheetUrl) return
    const a = document.createElement('a')
    a.href = sheetUrl
    a.download = 'role.png'
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
          多张图片合成一张雪碧图，并导出主流引擎可用的 JSON。
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
        </div>

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
            min={0}
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
                下载 role.png
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
