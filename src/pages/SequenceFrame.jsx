import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import ToolPageLayout from '../components/ToolPageLayout'
import { useToast } from '../context/ToastContext'

const DEFAULT_FPS = 12
const MIN_FPS = 1
const MAX_FPS = 60

export default function SequenceFrame() {
  const { showToast } = useToast()
  const [frames, setFrames] = useState([])
  const [selected, setSelected] = useState(() => new Set())
  const [status, setStatus] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [fpsInput, setFpsInput] = useState(String(DEFAULT_FPS))
  const [extractedFps, setExtractedFps] = useState(DEFAULT_FPS)

  const selectedFrames = useMemo(
    () => frames.filter((_, i) => selected.has(i)),
    [frames, selected],
  )
  const hasFrames = frames.length > 0
  const hasSelection = selected.size > 0
  const allSelected = hasFrames && selected.size === frames.length

  const videoInputRef = useRef(null)
  const demoCanvasRef = useRef(null)
  const animTimerRef = useRef(null)

  const resolveFps = useCallback(() => {
    const n = Number(fpsInput)
    if (!Number.isFinite(n) || n < MIN_FPS) return MIN_FPS
    if (n > MAX_FPS) return MAX_FPS
    return Math.floor(n)
  }, [fpsInput])

  useEffect(() => {
    return () => {
      if (animTimerRef.current) clearTimeout(animTimerRef.current)
    }
  }, [])

  const extractFrames = useCallback(async () => {
    const file = videoInputRef.current?.files?.[0]
    if (!file) {
      showToast('请先选择视频')
      return
    }

    const fps = resolveFps()
    setFpsInput(String(fps))
    setExtractedFps(fps)

    setExtracting(true)
    setStatus('加载视频中…')
    setFrames([])
    setSelected(new Set())

    const video = document.createElement('video')
    video.muted = true
    const videoUrl = URL.createObjectURL(file)
    video.src = videoUrl

    await new Promise((resolve) => {
      video.onloadedmetadata = resolve
    })

    const duration = video.duration
    const totalFrames = Math.floor(duration * fps)
    setStatus(`总帧数：${totalFrames}，提取中…`)

    const canvas = document.createElement('canvas')
    const ctxTmp = canvas.getContext('2d')
    const collected = []

    try {
      for (let i = 0; i < totalFrames; i++) {
        video.currentTime = i / fps
        await new Promise((resolve) => {
          video.onseeked = resolve
        })

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctxTmp.drawImage(video, 0, 0)

        const url = canvas.toDataURL('image/png')
        collected.push(url)
        setStatus(`已提取 ${i + 1}/${totalFrames} 帧`)
      }
      setFrames(collected)
      setSelected(new Set(collected.map((_, i) => i)))
      setStatus('提取完成！')
    } finally {
      URL.revokeObjectURL(videoUrl)
      setExtracting(false)
    }
  }, [showToast, resolveFps])

  const startAnimation = useCallback(
    (sources) => {
      const canvas = demoCanvasRef.current
      if (!canvas || sources.length === 0) return
      const ctx = canvas.getContext('2d')
      let index = 0

      const loop = () => {
        const img = new Image()
        img.src = sources[index]
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0)
        }
        index = (index + 1) % sources.length
        animTimerRef.current = setTimeout(loop, 1000 / extractedFps)
      }
      loop()
    },
    [extractedFps],
  )

  const openModal = useCallback(() => {
    if (selectedFrames.length === 0) {
      showToast('请先选择至少一帧')
      return
    }
    if (animTimerRef.current) clearTimeout(animTimerRef.current)
    setModalOpen(true)
    const first = new Image()
    first.src = selectedFrames[0]
    first.onload = () => {
      const canvas = demoCanvasRef.current
      if (!canvas) return
      canvas.width = first.naturalWidth
      canvas.height = first.naturalHeight
      startAnimation(selectedFrames)
    }
  }, [selectedFrames, startAnimation, showToast])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    if (animTimerRef.current) {
      clearTimeout(animTimerRef.current)
      animTimerRef.current = null
    }
  }, [])

  const downloadZip = useCallback(async () => {
    if (selectedFrames.length === 0) {
      showToast('请先选择至少一帧')
      return
    }
    setStatus('正在打包 ZIP，请稍候…')

    const zip = new JSZip()
    const folder = zip.folder('序列帧')
    const pad = Math.max(2, String(selectedFrames.length).length)

    for (let i = 0; i < selectedFrames.length; i++) {
      const data = selectedFrames[i].split(',')[1]
      const num = String(i + 1).padStart(pad, '0')
      folder.file(`序列帧-${num}.png`, data, { base64: true })
    }

    const blob = await zip.generateAsync({ type: 'blob' })
    saveAs(blob, '视频序列帧.zip')
    setStatus('下载完成！')
  }, [selectedFrames, showToast])

  const toggleFrame = useCallback((index) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }, [])

  const selectAll = useCallback(() => {
    setSelected(new Set(frames.map((_, i) => i)))
  }, [frames])

  const clearSelection = useCallback(() => {
    setSelected(new Set())
  }, [])

  return (
    <ToolPageLayout title="视频转序列帧">
      <div className="tool-panel">
        <h2 className="tool-page-title">视频提取序列帧</h2>
        <p className="tool-page-lead">从视频中按指定帧率截取画面，支持预览动画与打包下载。</p>

        <div className="tool-field">
          <label className="tool-label" htmlFor="sequence-video-input">
            选择视频
          </label>
          <input
            ref={videoInputRef}
            id="sequence-video-input"
            className="tool-input-file"
            type="file"
            accept="video/*"
          />
        </div>

        <div className="tool-field">
          <label className="tool-label" htmlFor="sequence-fps-input">
            帧率 (FPS)
          </label>
          <input
            id="sequence-fps-input"
            className="tool-input"
            type="number"
            min={MIN_FPS}
            max={MAX_FPS}
            step="1"
            value={fpsInput}
            disabled={extracting}
            onChange={(e) => setFpsInput(e.target.value)}
            onBlur={() => setFpsInput(String(resolveFps()))}
          />
        </div>

        <div className="tool-btn-row">
          <button
            type="button"
            className="tool-btn-primary"
            disabled={extracting}
            onClick={extractFrames}
          >
            开始提取帧
          </button>
          <button
            type="button"
            className="tool-btn-secondary"
            disabled={!hasSelection || modalOpen}
            onClick={openModal}
          >
            试播选中帧
          </button>
          <button
            type="button"
            className="tool-btn-secondary"
            disabled={!hasSelection}
            onClick={downloadZip}
          >
            下载选中帧 (ZIP)
          </button>
        </div>

        {status && <p className="tool-status">{status}</p>}
      </div>

      <div className="tool-panel">
        <h3 className="tool-section-title">提取的序列帧列表</h3>
        {hasFrames && (
          <div className="tool-frame-toolbar">
            <button
              type="button"
              className="tool-btn-secondary"
              onClick={selectAll}
              disabled={allSelected}
            >
              全选
            </button>
            <button
              type="button"
              className="tool-btn-secondary"
              onClick={clearSelection}
              disabled={!hasSelection}
            >
              取消全选
            </button>
            <span className="tool-frame-count">
              已选 {selected.size} / {frames.length} 帧
            </span>
          </div>
        )}
        <div className="tool-frames-grid">
          {frames.map((src, i) => {
            const isSelected = selected.has(i)
            return (
              <button
                key={i}
                type="button"
                className={
                  'tool-frame-item ' +
                  (isSelected ? 'tool-frame-item--selected' : 'tool-frame-item--unselected')
                }
                onClick={() => toggleFrame(i)}
                aria-pressed={isSelected}
                aria-label={`第 ${i + 1} 帧 ${isSelected ? '已选中' : '未选中'}`}
              >
                <img src={src} alt="" />
                <span className="tool-frame-check" aria-hidden="true">
                  ✓
                </span>
                <span className="tool-frame-index">{i + 1}</span>
              </button>
            )
          })}
        </div>
      </div>

      {modalOpen && (
        <div
          className="tool-modal"
          role="dialog"
          aria-modal="true"
          aria-label="序列帧预览"
        >
          <div className="tool-modal-inner">
            <button type="button" className="tool-modal-close" onClick={closeModal}>
              关闭
            </button>
            <canvas ref={demoCanvasRef} className="tool-modal-canvas" />
          </div>
        </div>
      )}
    </ToolPageLayout>
  )
}
