import { useCallback, useRef, useState } from 'react'
import ToolPageLayout from '../components/ToolPageLayout'
import { useToast } from '../context/ToastContext'
import styles from './RemoveBackground.module.css'

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null
}

export default function RemoveBackground() {
  const { showToast } = useToast()
  const originalImageRef = useRef(null)
  const processRef = useRef(null)

  const [bgColorHex, setBgColorHex] = useState('#FFFFFF')
  const [threshold, setThreshold] = useState(30)
  const [feather, setFeather] = useState(2)
  const [originPreview, setOriginPreview] = useState(null)
  const [resultDataUrl, setResultDataUrl] = useState(null)

  const process = useCallback(() => {
    const originalImage = originalImageRef.current
    if (!originalImage) {
      showToast('请先上传图片')
      return
    }

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = originalImage.width
    canvas.height = originalImage.height
    ctx.drawImage(originalImage, 0, 0)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    const targetRgb = hexToRgb(bgColorHex)
    if (!targetRgb) {
      showToast('无效的背景颜色格式')
      return
    }

    const thresholdVal = parseInt(String(threshold), 10)
    const featherRange = parseInt(String(feather), 10) * 15

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[i + 3]

      if (a === 0) continue

      const colorDiff = Math.sqrt(
        (r - targetRgb.r) ** 2 +
          (g - targetRgb.g) ** 2 +
          (b - targetRgb.b) ** 2
      )

      if (colorDiff <= thresholdVal) {
        data[i + 3] = 0
      } else if (featherRange > 0 && colorDiff <= thresholdVal + featherRange) {
        const opacityFactor = (colorDiff - thresholdVal) / featherRange
        data[i + 3] = Math.min(a, opacityFactor * 255)
      }
    }

    ctx.putImageData(imageData, 0, 0)
    const finalDataUrl = canvas.toDataURL('image/png')
    setResultDataUrl(finalDataUrl)
  }, [bgColorHex, feather, showToast, threshold])

  processRef.current = process

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const input = e.target
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result
      if (typeof dataUrl !== 'string') return
      const img = new Image()
      img.onload = () => {
        originalImageRef.current = img
        setOriginPreview(dataUrl)
        setResultDataUrl(null)
        processRef.current()
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
    input.value = ''
  }

  const setQuickColor = (hex) => {
    setBgColorHex(hex.toUpperCase())
  }

  const handleColorPicker = (e) => {
    setBgColorHex(e.target.value.toUpperCase())
  }

  const handleHexInput = (e) => {
    const hex = e.target.value
    setBgColorHex(hex)
  }

  const handleHexBlur = () => {
    if (/^#[0-9A-F]{6}$/i.test(bgColorHex)) return
    setBgColorHex((h) => (h.startsWith('#') ? h : `#${h}`).slice(0, 7).toUpperCase())
  }

  const handleProcessClick = () => {
    if (!originalImageRef.current) {
      showToast('请先上传图片')
      return
    }
    process()
  }

  const downloadName = `ai_rembg_${Date.now()}.png`

  return (
    <ToolPageLayout title="通用背景去除">
      <div className={styles.root}>
        <div className={styles.card}>
          <h2 className={styles.title}>
            通用背景去除工具
            <small className={styles.subtitle}>(Canvas 零依赖版)</small>
          </h2>

          <div className={styles.area}>
            <label className={styles.label} htmlFor="rb-file">
              1. 上传图片 (支持 jpg, png, webp)
            </label>
            <input
              id="rb-file"
              className={styles.fileInput}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className={`${styles.controlsPanel} ${styles.area}`}>
            <label className={styles.label}>2. 设置背景参数</label>

            <div className={styles.controlRow}>
              <div className={styles.colorPickerGroup}>
                <input
                  className={styles.colorInput}
                  type="color"
                  value={bgColorHex.startsWith('#') ? bgColorHex.slice(0, 7) : '#ffffff'}
                  onChange={handleColorPicker}
                  aria-label="背景色"
                />
                <input
                  className={styles.hexInput}
                  type="text"
                  value={bgColorHex}
                  placeholder="#RRGGBB"
                  maxLength={7}
                  onChange={handleHexInput}
                  onBlur={handleHexBlur}
                  spellCheck={false}
                />
              </div>

              <div className={styles.quickRow}>
                <button
                  type="button"
                  className={styles.quickBtn}
                  onClick={() => setQuickColor('#FFFFFF')}
                >
                  白色
                </button>
                <button
                  type="button"
                  className={`${styles.quickBtn} ${styles.quickBtnGreen}`}
                  onClick={() => setQuickColor('#00B050')}
                >
                  绿幕
                </button>
                <button
                  type="button"
                  className={`${styles.quickBtn} ${styles.quickBtnBlue}`}
                  onClick={() => setQuickColor('#00479d')}
                >
                  蓝幕
                </button>
              </div>
            </div>

            <div className={styles.controlRow}>
              <div className={styles.sliderGroup}>
                <div className={styles.sliderHeader}>
                  <span>颜色容差 (阈值)</span>
                  <span>{threshold}</span>
                </div>
                <input
                  className={styles.rangeInput}
                  type="range"
                  min={0}
                  max={150}
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                />
              </div>

              <div className={styles.sliderGroup}>
                <div className={styles.sliderHeader}>
                  <span>边缘羽化 (平滑)</span>
                  <span>{feather}</span>
                </div>
                <input
                  className={styles.rangeInput}
                  type="range"
                  min={0}
                  max={10}
                  value={feather}
                  onChange={(e) => setFeather(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          <div className={styles.btnGroup}>
            <button
              type="button"
              className={styles.processBtn}
              onClick={handleProcessClick}
            >
              立即去除背景
            </button>
            <a
              className={`${styles.downloadBtn} ${resultDataUrl ? styles.downloadBtnVisible : ''}`}
              href={resultDataUrl || '#'}
              download={downloadName}
              onClick={(e) => {
                if (!resultDataUrl) e.preventDefault()
              }}
            >
              📥 保存透明 PNG
            </a>
          </div>

          <div className={styles.previewGrid}>
            <div>
              <h4 className={styles.boxTitle}>原始素材</h4>
              <div className={styles.imgContainer} id="originBox">
                {originPreview ? (
                  <img src={originPreview} alt="原图" />
                ) : (
                  <span className={styles.placeholder}>等待上传...</span>
                )}
              </div>
            </div>
            <div>
              <h4 className={styles.boxTitle}>去背景结果</h4>
              <div
                className={`${styles.imgContainer} ${styles.transparentBg}`}
                id="resultBox"
              >
                {resultDataUrl ? (
                  <img src={resultDataUrl} alt="去背景结果" />
                ) : (
                  <span className={styles.placeholder}>等待处理...</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
