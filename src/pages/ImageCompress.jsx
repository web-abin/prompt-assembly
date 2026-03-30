import { useCallback, useEffect, useRef, useState } from 'react'
import imageCompression from 'browser-image-compression'
import JSZip from 'jszip'
import ToolPageLayout from '../components/ToolPageLayout'
import { useToast } from '../context/ToastContext'
import styles from './ImageCompress.module.css'

export default function ImageCompress() {
  const { showToast } = useToast()
  const fileInputRef = useRef(null)
  const itemsRef = useRef([])

  const [quality, setQuality] = useState(80)
  const [status, setStatus] = useState('')
  const [items, setItems] = useState([])
  const [processing, setProcessing] = useState(false)
  const [zipping, setZipping] = useState(false)

  itemsRef.current = items

  const revokeAllPreviews = useCallback((list) => {
    list.forEach((i) => URL.revokeObjectURL(i.previewUrl))
  }, [])

  useEffect(() => {
    return () => {
      revokeAllPreviews(itemsRef.current)
    }
  }, [revokeAllPreviews])

  const downloadSingle = useCallback((item) => {
    const a = document.createElement('a')
    a.href = item.previewUrl
    a.download = item.downloadName
    a.click()
  }, [])

  const handleStart = useCallback(async () => {
    const files = Array.from(fileInputRef.current?.files || [])
    if (files.length === 0) {
      showToast('请选择图片')
      return
    }

    setProcessing(true)
    revokeAllPreviews(itemsRef.current)
    setItems([])
    setStatus('')

    const q = quality / 100
    const nextItems = []

    try {
      for (let i = 0; i < files.length; i++) {
        const f = files[i]
        setStatus(`正在压缩: ${i + 1}/${files.length}`)

        const options = {
          maxSizeMB: 1,
          initialQuality: q,
          useWebWorker: true
        }

        const compressedBlob = await imageCompression(f, options)
        const previewUrl = URL.createObjectURL(compressedBlob)
        const entry = {
          previewUrl,
          displayName: f.name,
          blob: compressedBlob,
          downloadName: `compressed_${f.name}`
        }
        nextItems.push(entry)
        setItems([...nextItems])
      }

      setStatus('✅ 处理完成')
    } catch (err) {
      console.error('压缩失败', err)
      showToast('部分或全部图片压缩失败')
      setStatus('处理出错，请重试')
    } finally {
      setProcessing(false)
    }
  }, [quality, revokeAllPreviews, showToast])

  const handleZip = useCallback(async () => {
    if (items.length === 0) return
    setZipping(true)
    setStatus('正在生成压缩包...')

    try {
      const zip = new JSZip()
      items.forEach((item) => {
        zip.file(item.downloadName, item.blob)
      })
      const content = await zip.generateAsync({ type: 'blob' })
      const zipUrl = URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = zipUrl
      a.download = `images_package_${Date.now()}.zip`
      a.click()
      URL.revokeObjectURL(zipUrl)
      setStatus('✅ 打包下载成功')
    } catch (err) {
      console.error(err)
      showToast('打包失败')
      setStatus('打包失败')
    } finally {
      setZipping(false)
    }
  }, [items, showToast])

  return (
    <ToolPageLayout title="图片压缩">
      <div className={styles.root}>
        <div className={styles.card}>
          <h2 className={styles.title}>
            图片压缩工具
            <small className={styles.subtitle}>(支持 ZIP 打包)</small>
          </h2>

          <div className={styles.area}>
            <label className={styles.label} htmlFor="ic-quality">
              <span className={styles.qRow}>
                压缩质量：<span>{quality}</span>%
              </span>
            </label>
            <input
              id="ic-quality"
              className={styles.rangeInput}
              type="range"
              min={10}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
            />
          </div>

          <div className={styles.area}>
            <label className={styles.label} htmlFor="ic-files">
              选择图片
            </label>
            <input
              ref={fileInputRef}
              id="ic-files"
              className={styles.fileInput}
              type="file"
              accept="image/*"
              multiple
            />
          </div>

          <button
            type="button"
            className={styles.startBtn}
            disabled={processing}
            onClick={handleStart}
          >
            开始处理
          </button>
          <div className={styles.status}>{status}</div>

          {items.length > 0 && (
            <div className={styles.previewList}>
              {items.map((item) => (
                <div key={item.previewUrl} className={styles.item}>
                  <img
                    className={styles.itemImg}
                    src={item.previewUrl}
                    alt=""
                  />
                  <span className={styles.itemName}>{item.displayName}</span>
                  <button
                    type="button"
                    className={styles.dlBtn}
                    onClick={() => downloadSingle(item)}
                  >
                    下载单图
                  </button>
                </div>
              ))}
            </div>
          )}

          <div
            className={`${styles.actions} ${items.length > 0 ? styles.actionsVisible : ''}`}
          >
            <button
              type="button"
              className={styles.zipBtn}
              disabled={zipping}
              onClick={handleZip}
            >
              📦 一键打包下载全部 (ZIP)
            </button>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
