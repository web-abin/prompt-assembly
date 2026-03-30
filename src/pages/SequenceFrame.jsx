import { useCallback, useEffect, useRef, useState } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import ToolPageLayout from '../components/ToolPageLayout'
import { useToast } from '../context/ToastContext'

const FPS = 12

export default function SequenceFrame() {
  const { showToast } = useToast()
  const [frames, setFrames] = useState([])
  const [status, setStatus] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [playDisabled, setPlayDisabled] = useState(true)
  const [zipDisabled, setZipDisabled] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  const videoInputRef = useRef(null)
  const demoCanvasRef = useRef(null)
  const animTimerRef = useRef(null)

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

    setExtracting(true)
    setPlayDisabled(true)
    setZipDisabled(true)
    setStatus('加载视频中…')
    setFrames([])

    const video = document.createElement('video')
    video.muted = true
    const videoUrl = URL.createObjectURL(file)
    video.src = videoUrl

    await new Promise((resolve) => {
      video.onloadedmetadata = resolve
    })

    const duration = video.duration
    const totalFrames = Math.floor(duration * FPS)
    setStatus(`总帧数：${totalFrames}，提取中…`)

    const canvas = document.createElement('canvas')
    const ctxTmp = canvas.getContext('2d')
    const collected = []

    try {
      for (let i = 0; i < totalFrames; i++) {
        video.currentTime = i / FPS
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
      setStatus('提取完成！')
      setPlayDisabled(false)
      setZipDisabled(false)
    } finally {
      URL.revokeObjectURL(videoUrl)
      setExtracting(false)
    }
  }, [showToast])

  const startAnimation = useCallback(() => {
    const canvas = demoCanvasRef.current
    if (!canvas || frames.length === 0) return
    const ctx = canvas.getContext('2d')
    let index = 0

    const loop = () => {
      const img = new Image()
      img.src = frames[index]
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
      }
      index = (index + 1) % frames.length
      animTimerRef.current = setTimeout(loop, 1000 / FPS)
    }
    loop()
  }, [frames])

  const openModal = useCallback(() => {
    if (frames.length === 0) return
    if (animTimerRef.current) clearTimeout(animTimerRef.current)
    setModalOpen(true)
    const first = new Image()
    first.src = frames[0]
    first.onload = () => {
      const canvas = demoCanvasRef.current
      if (!canvas) return
      canvas.width = first.naturalWidth
      canvas.height = first.naturalHeight
      startAnimation()
    }
  }, [frames, startAnimation])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    if (animTimerRef.current) {
      clearTimeout(animTimerRef.current)
      animTimerRef.current = null
    }
  }, [])

  const downloadZip = useCallback(async () => {
    if (frames.length === 0) return
    setZipDisabled(true)
    setStatus('正在打包 ZIP，请稍候…')

    const zip = new JSZip()
    const folder = zip.folder('序列帧')

    for (let i = 0; i < frames.length; i++) {
      const data = frames[i].split(',')[1]
      const num = String(i + 1).padStart(2, '0')
      folder.file(`序列帧-${num}.png`, data, { base64: true })
    }

    const blob = await zip.generateAsync({ type: 'blob' })
    saveAs(blob, '视频序列帧.zip')
    setStatus('下载完成！')
    setZipDisabled(false)
  }, [frames])

  return (
    <ToolPageLayout title="视频转序列帧">
      <div className="tool-panel">
        <h2 className="tool-page-title">视频提取序列帧（{FPS} 帧/秒）</h2>
        <p className="tool-page-lead">从视频中按固定帧率截取画面，支持预览动画与打包下载。</p>

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
            disabled={playDisabled || modalOpen}
            onClick={openModal}
          >
            播放序列帧动画
          </button>
          <button
            type="button"
            className="tool-btn-secondary"
            disabled={zipDisabled}
            onClick={downloadZip}
          >
            一键下载所有帧 (ZIP)
          </button>
        </div>

        {status && <p className="tool-status">{status}</p>}
      </div>

      <div className="tool-panel">
        <h3 className="tool-section-title">提取的序列帧列表</h3>
        <div className="tool-frames-grid">
          {frames.map((src, i) => (
            <img key={i} src={src} alt="" className="tool-frame-thumb" />
          ))}
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
