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

function detectFormat(data) {
  if (Array.isArray(data)) return 'array'
  if (data && Array.isArray(data.frames)) {
    const sample = data.frames[0]
    if (sample && (sample.filename || sample.frame)) return 'phaser'
    if (sample && (sample.name || sample.w !== undefined)) return 'egret'
    return 'phaser'
  }
  if (data && data.frames && typeof data.frames === 'object') {
    const firstKey = Object.keys(data.frames)[0]
    const sample = firstKey ? data.frames[firstKey] : null
    if (sample && sample.sourceSize) return 'texturepacker'
    if (sample && sample.frame) return 'pixi'
    if (sample && (sample.width !== undefined || sample.height !== undefined)) return 'cocos'
    return 'pixi'
  }
  return 'array'
}

function parseFramesFromJson(data) {
  if (!data) return []

  if (Array.isArray(data)) {
    return data.map((item, i) => normalizeFrame(item, i)).filter(Boolean)
  }

  if (Array.isArray(data.frames)) {
    return data.frames.map((item, i) => normalizeFrame(item, i)).filter(Boolean)
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

function serializeFrames(frames, format, meta) {
  const safeMeta = meta || {}
  if (format === 'phaser') {
    return {
      frames: frames.map((f) => ({
        filename: f.name,
        frame: { x: f.x, y: f.y, w: f.w, h: f.h }
      }))
    }
  }
  if (format === 'cocos') {
    const o = {}
    frames.forEach((f) => {
      o[f.name] = { x: f.x, y: f.y, width: f.w, height: f.h }
    })
    return { texture: safeMeta.texture || safeMeta.image || 'role.png', frames: o }
  }
  if (format === 'egret') {
    return {
      file: safeMeta.file || safeMeta.image || 'role.png',
      frames: frames.map((f) => ({ name: f.name, x: f.x, y: f.y, w: f.w, h: f.h }))
    }
  }
  if (format === 'texturepacker') {
    const o = {}
    frames.forEach((f) => {
      o[f.name] = {
        frame: { x: f.x, y: f.y, w: f.w, h: f.h },
        sourceSize: { w: f.w, h: f.h }
      }
    })
    return {
      frames: o,
      meta: {
        image: safeMeta.image || 'role.png',
        size: safeMeta.size || { w: 0, h: 0 }
      }
    }
  }
  if (format === 'array') {
    return frames.map((f) => ({ name: f.name, x: f.x, y: f.y, w: f.w, h: f.h }))
  }
  const o = {}
  frames.forEach((f) => {
    o[f.name] = { frame: { x: f.x, y: f.y, w: f.w, h: f.h } }
  })
  return {
    frames: o,
    meta: {
      image: safeMeta.image || 'role.png',
      size: safeMeta.size || { w: 0, h: 0 }
    }
  }
}

export default function SpritePlayer() {
  const { showToast } = useToast()
  const [imageUrl, setImageUrl] = useState('')
  const [imageName, setImageName] = useState('')
  const [imageSize, setImageSize] = useState({ w: 0, h: 0 })
  const [frames, setFrames] = useState([])
  const [jsonName, setJsonName] = useState('')
  const [jsonFormat, setJsonFormat] = useState('pixi')
  const [jsonMeta, setJsonMeta] = useState({})
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
    if (canvas.width !== canvasSize.w) canvas.width = canvasSize.w
    if (canvas.height !== canvasSize.h) canvas.height = canvasSize.h
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (f.w <= 0 || f.h <= 0) return
    const dx = Math.round((canvas.width - f.w) / 2)
    const dy = Math.round((canvas.height - f.h) / 2)
    try {
      ctx.drawImage(img, f.x, f.y, f.w, f.h, dx, dy, f.w, f.h)
    } catch (err) {
      // 当 x/y/w/h 越界或为负数时 drawImage 会抛 INDEX_SIZE_ERR；编辑过程中临时无效就忽略
    }
  }, [frames, canvasSize.w, canvasSize.h])

  // 实时重绘当前帧（包含编辑时数据变化的情形）
  useEffect(() => {
    if (!imageRef.current || !frames.length) return
    drawFrame(indexRef.current)
  }, [frames, drawFrame, imageUrl])

  // 播放循环
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (!frames.length || !imageRef.current) return undefined

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
  }, [frames.length, drawFrame, imageUrl])

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
      const fmt = detectFormat(data)
      setJsonFormat(fmt)
      setJsonMeta({
        image: data?.meta?.image || data?.texture || data?.file || '',
        size: data?.meta?.size || null,
        texture: data?.texture || '',
        file: data?.file || ''
      })
      indexRef.current = 0
      setCurrentIndex(0)
      setFrames(parsed)
      showToast(`已解析 ${parsed.length} 帧（${fmt} 格式）`)
    } catch (err) {
      console.error(err)
      showToast('JSON 解析失败')
      setFrames([])
    }
  }, [showToast])

  const togglePlaying = useCallback(() => {
    setPlaying((v) => !v)
  }, [])

  const jumpTo = useCallback((i) => {
    if (i < 0 || i >= frames.length) return
    indexRef.current = i
    setCurrentIndex(i)
    drawFrame(i)
  }, [frames.length, drawFrame])

  const stepFrame = useCallback((delta) => {
    if (!frames.length) return
    setPlaying(false)
    const next = (indexRef.current + delta + frames.length) % frames.length
    jumpTo(next)
  }, [frames.length, jumpTo])

  const updateFrameField = useCallback((i, key, raw) => {
    setFrames((prev) => {
      if (!prev[i]) return prev
      const next = [...prev]
      const value = key === 'name' ? raw : Number(raw)
      if (key !== 'name' && !Number.isFinite(value)) {
        next[i] = { ...next[i], [key]: 0 }
      } else {
        next[i] = { ...next[i], [key]: value }
      }
      return next
    })
  }, [])

  const deleteFrame = useCallback((i) => {
    setFrames((prev) => {
      const next = prev.filter((_, idx) => idx !== i)
      if (!next.length) {
        indexRef.current = 0
        setCurrentIndex(0)
      } else if (indexRef.current >= next.length) {
        indexRef.current = next.length - 1
        setCurrentIndex(next.length - 1)
      }
      return next
    })
  }, [])

  const moveFrame = useCallback((i, delta) => {
    setFrames((prev) => {
      const j = i + delta
      if (j < 0 || j >= prev.length) return prev
      const next = [...prev]
      ;[next[i], next[j]] = [next[j], next[i]]
      if (indexRef.current === i) {
        indexRef.current = j
        setCurrentIndex(j)
      } else if (indexRef.current === j) {
        indexRef.current = i
        setCurrentIndex(i)
      }
      return next
    })
  }, [])

  const downloadJson = useCallback(() => {
    if (!frames.length) return
    const meta = {
      ...jsonMeta,
      image: jsonMeta?.image || imageName || 'role.png',
      size: jsonMeta?.size || { w: imageSize.w, h: imageSize.h }
    }
    const data = serializeFrames(frames, jsonFormat, meta)
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const base = (jsonName || 'spritesheet.json').replace(/\.json$/i, '')
    a.download = `${base}-edited.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('已下载更新后的 JSON')
  }, [frames, jsonFormat, jsonMeta, imageName, imageSize, jsonName, showToast])

  const hasAll = frames.length > 0 && imageUrl
  const currentFrame = frames[currentIndex]

  return (
    <ToolPageLayout title="精灵图试播">
      <div className="tool-panel">
        <h2 className="tool-page-title">精灵图序列帧试播 & 校对</h2>
        <p className="tool-page-lead">
          上传精灵图与 JSON 即可播放；暂停后可逐帧查看、修改 x/y/w/h 与名称，缩略图实时高亮当前帧位置，确认无误后导出修正后的 JSON。
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
                {frames.length > 0 ? `  ·  共 ${frames.length} 帧  ·  ${jsonFormat}` : ''}
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
          <button
            type="button"
            className="tool-btn-secondary"
            onClick={downloadJson}
            disabled={!hasAll}
          >
            下载修正后的 JSON
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

        {hasAll && currentFrame && (
          <div className={styles.metaList}>
            <span>当前帧：{currentFrame.name}</span>
            <span>序号：{currentIndex + 1} / {frames.length}</span>
            <span>位置：x={currentFrame.x}, y={currentFrame.y}</span>
            <span>尺寸：w={currentFrame.w}, h={currentFrame.h}</span>
            <span>状态：{playing ? '播放中' : '已暂停'}</span>
          </div>
        )}
      </div>

      {hasAll && (
        <div className="tool-panel">
          <h3 className={styles.sectionTitle}>精灵图缩略图（当前帧高亮）</h3>
          <div className={styles.sheetOverview}>
            <img src={imageUrl} alt="精灵图缩略图" className={styles.sheetImage} />
            {imageSize.w > 0 && imageSize.h > 0 && currentFrame && (
              <div
                className={styles.frameRect}
                style={{
                  left: `${(currentFrame.x / imageSize.w) * 100}%`,
                  top: `${(currentFrame.y / imageSize.h) * 100}%`,
                  width: `${(currentFrame.w / imageSize.w) * 100}%`,
                  height: `${(currentFrame.h / imageSize.h) * 100}%`
                }}
              />
            )}
          </div>
        </div>
      )}

      {hasAll && (
        <div className="tool-panel">
          <div className={styles.editToolbar}>
            <h3 className={styles.sectionTitle} style={{ margin: 0 }}>
              帧列表（点击行可定位，输入框直接修改）
            </h3>
            <span className="spacer" style={{ marginLeft: 'auto' }}>
              {playing ? '播放中，编辑会自动暂停' : '已暂停，可逐帧编辑'}
            </span>
          </div>
          <div className={styles.frameTableWrap}>
            <table className={styles.frameTable}>
              <thead>
                <tr>
                  <th className={styles.indexCell}>#</th>
                  <th>名称</th>
                  <th>x</th>
                  <th>y</th>
                  <th>w</th>
                  <th>h</th>
                  <th style={{ width: 140 }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {frames.map((f, i) => (
                  <tr
                    key={i}
                    className={`${styles.frameRow} ${
                      i === currentIndex ? styles.frameRowActive : ''
                    }`}
                    onClick={() => {
                      setPlaying(false)
                      jumpTo(i)
                    }}
                  >
                    <td className={styles.indexCell}>{i + 1}</td>
                    <td>
                      <input
                        type="text"
                        className={`tool-input ${styles.nameInput}`}
                        value={f.name}
                        onChange={(e) => updateFrameField(i, 'name', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    {['x', 'y', 'w', 'h'].map((key) => (
                      <td key={key}>
                        <input
                          type="number"
                          className={`tool-input ${styles.numInput}`}
                          value={f[key]}
                          onChange={(e) => {
                            setPlaying(false)
                            updateFrameField(i, key, e.target.value)
                            indexRef.current = i
                            setCurrentIndex(i)
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                    ))}
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className={`tool-btn-secondary ${styles.deleteBtn}`}
                        onClick={() => moveFrame(i, -1)}
                        disabled={i === 0}
                      >
                        上移
                      </button>{' '}
                      <button
                        type="button"
                        className={`tool-btn-secondary ${styles.deleteBtn}`}
                        onClick={() => moveFrame(i, 1)}
                        disabled={i === frames.length - 1}
                      >
                        下移
                      </button>{' '}
                      <button
                        type="button"
                        className={`tool-btn-secondary ${styles.deleteBtn}`}
                        onClick={() => deleteFrame(i)}
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </ToolPageLayout>
  )
}
