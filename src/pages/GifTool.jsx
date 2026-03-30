import { useCallback, useEffect, useRef, useState } from 'react'
import GIF from 'gif.js/dist/gif.js'
import { gifToFrameDataUrls } from '../utils/gifSplit'
import workerScriptUrl from 'gif.js/dist/gif.worker.js?url'
import ToolPageLayout from '../components/ToolPageLayout'
import { useToast } from '../context/ToastContext'

const loadImage = (file) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('图片加载失败'))
    }
    img.src = url
  })

export default function GifTool() {
  const { showToast } = useToast()
  const fileRef = useRef(null)
  const resultBlobUrlRef = useRef(null)

  const [status, setStatus] = useState('')
  const [splitUrls, setSplitUrls] = useState([])
  const [making, setMaking] = useState(false)
  const [resultBlob, setResultBlob] = useState(null)
  const [resultPreviewUrl, setResultPreviewUrl] = useState('')

  useEffect(() => {
    return () => {
      if (resultBlobUrlRef.current) {
        URL.revokeObjectURL(resultBlobUrlRef.current)
      }
    }
  }, [])

  const splitGif = useCallback(async () => {
    const file = fileRef.current?.files?.[0]
    if (!file || !file.type.includes('gif')) {
      showToast('请上传 GIF 文件')
      return
    }

    setStatus('正在解析 GIF 帧…')
    setSplitUrls([])
    setResultBlob(null)
    if (resultBlobUrlRef.current) {
      URL.revokeObjectURL(resultBlobUrlRef.current)
      resultBlobUrlRef.current = null
    }
    setResultPreviewUrl('')

    try {
      const buf = await file.arrayBuffer()
      const { dataUrls } = gifToFrameDataUrls(buf)
      setStatus(`拆分完成，共 ${dataUrls.length} 帧`)
      setSplitUrls(dataUrls)
    } catch (err) {
      console.error(err)
      setStatus('拆分失败，请检查文件')
      showToast('拆分失败')
    }
  }, [showToast])

  const makeGif = useCallback(async () => {
    const files = Array.from(fileRef.current?.files || [])
    if (files.length < 2) {
      showToast('请选择至少 2 张图片')
      return
    }

    setMaking(true)
    setStatus('正在预加载图片…')
    setSplitUrls([])
    if (resultBlobUrlRef.current) {
      URL.revokeObjectURL(resultBlobUrlRef.current)
      resultBlobUrlRef.current = null
    }
    setResultPreviewUrl('')
    setResultBlob(null)

    try {
      const images = await Promise.all(files.map(loadImage))

      setStatus('正在渲染 GIF…')

      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: images[0].naturalWidth,
        height: images[0].naturalHeight,
        workerScript: workerScriptUrl
      })

      images.forEach((img) => {
        gif.addFrame(img, { delay: 200, copy: true })
      })

      gif.on('finished', (blob) => {
        if (resultBlobUrlRef.current) {
          URL.revokeObjectURL(resultBlobUrlRef.current)
        }
        const url = URL.createObjectURL(blob)
        resultBlobUrlRef.current = url
        setResultBlob(blob)
        setResultPreviewUrl(url)
        setStatus('合成完成，可预览后下载')
        setMaking(false)
      })

      gif.render()
    } catch (err) {
      console.error(err)
      setStatus('合成失败')
      showToast('合成失败')
      setMaking(false)
    }
  }, [showToast])

  const downloadGif = useCallback(() => {
    if (!resultBlob) return
    const a = document.createElement('a')
    const url = URL.createObjectURL(resultBlob)
    a.href = url
    a.download = `ai-creation-${Date.now()}.gif`
    a.click()
    URL.revokeObjectURL(url)
  }, [resultBlob])

  return (
    <ToolPageLayout title="GIF 合成与拆分">
      <div className="tool-panel">
        <h2 className="tool-page-title">GIF 极速合成与拆分</h2>
        <p className="tool-page-lead">
          合成：选择多张图片生成 GIF；拆分：选择单个 GIF 导出每一帧。纯前端处理。
        </p>

        <div className="tool-field">
          <label className="tool-label" htmlFor="gif-tool-files">
            选择文件（合成请选多张图 / 拆分请选单个 GIF）
          </label>
          <input
            ref={fileRef}
            id="gif-tool-files"
            className="tool-input-file"
            type="file"
            accept="image/gif,image/*"
            multiple
          />
        </div>

        <div className="tool-btn-row">
          <button
            type="button"
            className="tool-btn-secondary"
            onClick={splitGif}
            disabled={making}
          >
            拆分 GIF
          </button>
          <button
            type="button"
            className="tool-btn-primary"
            onClick={makeGif}
            disabled={making}
          >
            合成 GIF
          </button>
        </div>

        {status && <p className="tool-status">{status}</p>}

        {splitUrls.length > 0 && (
          <div className="tool-preview-row" aria-live="polite">
            {splitUrls.map((url, i) => (
              <img key={i} src={url} alt="" className="tool-preview-thumb" />
            ))}
          </div>
        )}

        {resultPreviewUrl && (
          <div className="tool-result-block">
            <p className="tool-page-lead" style={{ marginBottom: 12 }}>
              生成结果预览
            </p>
            <img
              src={resultPreviewUrl}
              alt="生成的 GIF 预览"
              className="tool-sheet-preview tool-gif-result-preview"
            />
            <div className="tool-btn-row tool-btn-row-stacked">
              <button
                type="button"
                className="tool-btn-download"
                onClick={downloadGif}
              >
                下载 GIF
              </button>
            </div>
          </div>
        )}

        <div className="tool-follow-hint">
          <strong>独立开发者福利：</strong>
          关注公众号 <b>【AI造物进化】</b> 回复【GIF】获取本工具思路与更多资源。
        </div>
      </div>
    </ToolPageLayout>
  )
}
