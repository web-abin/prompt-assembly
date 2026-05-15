import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ToolPageLayout from '../components/ToolPageLayout'
import { useToast } from '../context/ToastContext'
import styles from './SpritePlayer.module.css'

const DEFAULT_FPS = 12
const MIN_FPS = 1
const MAX_FPS = 60

function clampFps(value) {
  const n = Number(value)
  if (!Number.isFinite(n) || n < MIN_FPS) return MIN_FPS
  if (n > MAX_FPS) return MAX_FPS
  return Math.floor(n)
}

function parseFramesFromJson(data) {
  if (!data) return []

  if (Array.isArray(data)) {
    return data
      .map((item, i) => normalizeFrame(item, i))
      .filter(Boolean)
  }

  if (Array.isArray(data.frames)) {
    return data.frames
      .map((item, i) => normalizeFrame(item, i))
      .filter(Boolean)
  }

  if (data.frames && typeof data.frames === 'object') {
    return Object.entries(data.frames)
      .map(([name, item], i) => normalizeFrame(item, i, name))
      .filter(Boolean)
  }

  return []
}

function normalizeFrame(raw, index, fallbackName) {
  if (!raw || typeof raw !== 'object') return null
  const name = raw.name || raw.filename || fallbackName || `frame-${index + 1}`

  const inner = raw.frame && typeof raw.frame === 'object' ? raw.frame : raw
  const x = Number(inner.x)
  const y = Number(inner.y)
  const w = Number(inner.w ?? inner.width)
  const h = Number(inner.h ?? inner.height)

  if (![x, y, w, h].every((n) => Number.isFinite(n))) return null
  return { name, x, y, w, h }
}

export default function SpritePlayer() {
  const { showToast } = useToast()
  const [imageUrl, setImageUrl] = useState('')
  const [imageName, setImageName] = useState('')
  const [imageSize, setImageSize] = useState({ w: 0, h: 0 })
  const [frames, setFrames] = useState([])
  const [jsonName, setJsonName] = useState('')
  const [fpsInput, setFpsInput] = useState(String(DEFAULT_FPS))
  const [playing, setPlaying] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  const canvasRef = useRef(null)
  const imageRef = useRef(null)
  const blobUrlRef = useRef('')
  const timerRef = useRef(null)
  const fpsRef = useRef(DEFAULT_FPS)
  const indexRef = useRef(0)
  const playingRef = useRef(true)

  useEffect(() => {
    fpsRef.current = clampFps(fpsInput)
  }, [fpsInput])

  useEffect(() => {
    playingRef.current = playing
  }, [playing])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
    }
  }, [])

  const canvasSize = useMemo(() => {
    if (!frames.length) return { w: 0, h: 0 }
    let mw = 0
    let mh = 0
    frames.forEach((f) => {
      if (f.w > mw) mw = f.w
      if (f.h > mh) mh = f.h
    })
    return { w: mw, h: mh }
  }, [frames])

  const drawFrame = useCallback((i) => {
    const canvas = canvasRef.current
    const img = imageRef.current
    const f = frames[i]
    if (!canvas || !img || !f) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const dx = Math.round((canvas.width - f.w) / 2)
    const dy = Math.round((canvas.height - f.h) / 2)
    ctx.drawImage(img, f.x, f.y, f.w, f.h, dx, dy, f.w, f.h)
  }, [frames])

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (!frames.length || !imageRef.current) return undefined

    drawFrame(indexRef.current)

    let cancelled = false
    const tick = () => {
      if (cancelled) return
      const delay = Math.max(16, Math.round(1000 / fpsRef.current))
      timerRef.current = setTimeout(() => {
        if (cancelled) return
        if (playingRef.current && frames.length > 1) {
          const next = (indexRef.current + 1) % frames.length
          indexRef.current = next
          setCurrentIndex(next)
          drawFrame(next)
        }
        tick()
      }, delay)
    }
    tick()

    return () => {
      cancelled = true
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [frames, drawFrame, imageUrl])

  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current)
      blobUrlRef.current = ''
    }
    const url = URL.createObjectURL(file)
    blobUrlRef.current = url
    setImageName(file.name)

    const img = new Image()
    img.onload = () => {
      imageRef.current = img
      setImageSize({ w: img.naturalWidth, h: img.naturalHeight })
      setImageUrl(url)
      indexRef.current = 0
      setCurrentIndex(0)
    }
    img.onerror = () => {
      showToast('图片加载失败')
    }
    img.src = url
  }, [showToast])

  const handleJsonChange = useCallback(async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setJsonName(file.name)
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      const parsed = parseFramesFromJson(data)
      if (!parsed.length) {
        showToast('未解析到任何帧，请检查 JSON 格式')
        setFrames([])
        return
      }
      indexRef.current = 0
      setCurrentIndex(0)
      setFrames(parsed)
      showToast(`已解析 ${parsed.length} 帧`)
    } catch (err) {
      console.error(err)
      showToast('JSON 解析失败')
      setFrames([])
    }
  }, [showToast])

  const togglePlaying = useCallback(() => {
    setPlaying((v) => !v)
  }, [])

  const stepFrame = useCallback((delta) => {
    if (!frames.length) return
    setPlaying(false)
    const next = (indexRef.current + delta + frames.length) % frames.length
    indexRef.current = next
    setCurrentIndex(next)
    drawFrame(next)
  }, [frames.length, drawFrame])

  const hasAll = frames.length > 0 && imageUrl

  return (
    <ToolPageLayout title="精灵图试播">
      <div className="tool-panel">
        <h2 className="tool-page-title">精灵图序列帧试播</h2>
        <p className="tool-page-lead">
          上传一张精灵图与对应的 JSON，按指定帧率播放动画。JSON 支持 PixiJS / Phaser / Cocos / Egret / TexturePacker / 普通数组等常见格式。
        </p>

        <div className={`tool-field ${styles.uploadRow}`}>
          <div className={styles.uploadCell}>
            <label className="tool-label" htmlFor="sprite-player-image">
              精灵图（PNG）
            </label>
            <input
              id="sprite-player-image"
              className="tool-input-file"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imageName && (
              <div className={styles.fileName}>
                {imageName}
                {imageSize.w > 0 ? `  ·  ${imageSize.w} × ${imageSize.h}` : ''}
              </div>
            )}
          </div>

          <div className={styles.uploadCell}>
            <label className="tool-label" htmlFor="sprite-player-json">
              帧数据（JSON）
            </label>
            <input
              id="sprite-player-json"
              className="tool-input-file"
              type="file"
              accept="application/json,.json"
              onChange={handleJsonChange}
            />
            {jsonName && (
              <div className={styles.fileName}>
                {jsonName}
                {frames.length > 0 ? `  ·  共 ${frames.length} 帧` : ''}
              </div>
            )}
          </div>
        </div>

        <div className="tool-field">
          <label className="tool-label" htmlFor="sprite-player-fps">
            播放帧率（FPS）
          </label>
          <div className={styles.controls}>
            <input
              id="sprite-player-fps"
              className={`tool-input ${styles.fpsInput}`}
              type="number"
              min={MIN_FPS}
              max={MAX_FPS}
              step="1"
              value={fpsInput}
              onChange={(e) => setFpsInput(e.target.value)}
              onBlur={() => setFpsInput(String(clampFps(fpsInput)))}
            />
            <input
              className={styles.fpsRange}
              type="range"
              min={MIN_FPS}
              max={MAX_FPS}
              step="1"
              value={clampFps(fpsInput)}
              onChange={(e) => setFpsInput(e.target.value)}
              aria-label="播放帧率"
            />
          </div>
        </div>

        <div className="tool-btn-row">
          <button
            type="button"
            className="tool-btn-primary"
            onClick={togglePlaying}
            disabled={!hasAll}
          >
            {playing ? '暂停' : '播放'}
          </button>
          <button
            type="button"
            className="tool-btn-secondary"
            onClick={() => stepFrame(-1)}
            disabled={!hasAll}
          >
            上一帧
          </button>
          <button
            type="button"
            className="tool-btn-secondary"
            onClick={() => stepFrame(1)}
            disabled={!hasAll}
          >
            下一帧
          </button>
        </div>

        <div className={styles.stageWrap}>
          {hasAll ? (
            <canvas
              ref={canvasRef}
              className={styles.stage}
              width={canvasSize.w}
              height={canvasSize.h}
            />
          ) : (
            <p className="tool-status">请上传精灵图与 JSON 后开始播放。</p>
          )}
        </div>

        {hasAll && (
          <div className={styles.metaList}>
            <span>当前帧：{frames[currentIndex]?.name || '-'}</span>
            <span>序号：{currentIndex + 1} / {frames.length}</span>
            <span>状态：{playing ? '播放中' : '已暂停'}</span>
          </div>
        )}
      </div>
    </ToolPageLayout>
  )
}
