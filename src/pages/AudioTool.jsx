import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import JSZip from 'jszip'
import ToolPageLayout from '../components/ToolPageLayout'
import { useToast } from '../context/ToastContext'
import styles from './AudioTool.module.css'

const WAVEFORM_BUCKETS = 600

function computePeaks(buffer, buckets = WAVEFORM_BUCKETS) {
  const channels = buffer.numberOfChannels
  const len = buffer.length
  const samplesPerBucket = Math.max(1, Math.floor(len / buckets))
  const out = new Float32Array(buckets * 2)
  const datas = []
  for (let c = 0; c < channels; c++) datas.push(buffer.getChannelData(c))
  for (let i = 0; i < buckets; i++) {
    const sStart = i * samplesPerBucket
    const sEnd = i === buckets - 1 ? len : Math.min(len, sStart + samplesPerBucket)
    let min = 0
    let max = 0
    for (let c = 0; c < channels; c++) {
      const data = datas[c]
      for (let s = sStart; s < sEnd; s++) {
        const v = data[s]
        if (v < min) min = v
        if (v > max) max = v
      }
    }
    out[i * 2] = min
    out[i * 2 + 1] = max
  }
  return out
}

function Waveform({ buffer, start, end, removeSilence, silenceRange, volume }) {
  const canvasRef = useRef(null)
  const peaks = useMemo(() => computePeaks(buffer), [buffer])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height
    const mid = H / 2
    const buckets = peaks.length / 2

    const totalSamples = buffer.length
    const sr = buffer.sampleRate

    let selStartSample
    let selEndSample
    if (removeSilence && silenceRange && !silenceRange.allSilent) {
      selStartSample = silenceRange.start + Math.floor(start * sr)
      selEndSample = Math.min(silenceRange.end, silenceRange.start + Math.ceil(end * sr))
    } else {
      selStartSample = Math.floor(start * sr)
      selEndSample = Math.min(totalSamples, Math.ceil(end * sr))
    }
    const sampleToPx = (s) => (s / totalSamples) * W
    const selStartPx = Math.max(0, sampleToPx(selStartSample))
    const selEndPx = Math.min(W, sampleToPx(selEndSample))

    ctx.clearRect(0, 0, W, H)

    ctx.fillStyle = '#f5f7fb'
    ctx.fillRect(0, 0, W, H)

    if (selEndPx > selStartPx) {
      ctx.fillStyle = 'rgba(78, 130, 241, 0.14)'
      ctx.fillRect(selStartPx, 0, selEndPx - selStartPx, H)
    }

    if (removeSilence && silenceRange && !silenceRange.allSilent) {
      const silStartPx = sampleToPx(silenceRange.start)
      const silEndPx = sampleToPx(silenceRange.end)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, silStartPx, H)
      ctx.fillRect(silEndPx, 0, W - silEndPx, H)
    }

    const gain = Math.max(0, volume / 100)
    const pixelWidth = W / buckets
    for (let i = 0; i < buckets; i++) {
      const x = i * pixelWidth
      const inSel = x + pixelWidth >= selStartPx && x <= selEndPx
      const min = peaks[i * 2]
      const max = peaks[i * 2 + 1]
      const minScaled = inSel ? Math.max(-1, min * gain) : min
      const maxScaled = inSel ? Math.min(1, max * gain) : max
      const y1 = mid - maxScaled * mid * 0.95
      const y2 = mid - minScaled * mid * 0.95
      ctx.fillStyle = inSel ? '#4e82f1' : '#cbd5e1'
      ctx.fillRect(x, y1, Math.max(1, pixelWidth), Math.max(1, y2 - y1))
    }

    ctx.strokeStyle = '#dde2eb'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, mid + 0.5)
    ctx.lineTo(W, mid + 0.5)
    ctx.stroke()

    if (selEndPx > selStartPx) {
      ctx.strokeStyle = '#4e82f1'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(selStartPx + 0.5, 0)
      ctx.lineTo(selStartPx + 0.5, H)
      ctx.moveTo(selEndPx - 0.5, 0)
      ctx.lineTo(selEndPx - 0.5, H)
      ctx.stroke()
    }
  }, [buffer, peaks, start, end, removeSilence, silenceRange, volume])

  return <canvas ref={canvasRef} width={1200} height={120} className={styles.waveform} />
}

const LAMEJS_CDN = 'https://cdn.jsdelivr.net/npm/lamejs@1.2.1/lame.all.min.js'

let lamejsLoadPromise = null
function loadLamejs() {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'))
  if (window.lamejs) return Promise.resolve(window.lamejs)
  if (lamejsLoadPromise) return lamejsLoadPromise
  lamejsLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = LAMEJS_CDN
    script.async = true
    script.onload = () => resolve(window.lamejs)
    script.onerror = () => {
      lamejsLoadPromise = null
      reject(new Error('MP3 编码库加载失败'))
    }
    document.head.appendChild(script)
  })
  return lamejsLoadPromise
}

let sharedAudioCtx = null
function getAudioCtx() {
  if (!sharedAudioCtx) {
    sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return sharedAudioCtx
}

function detectNonSilenceRange(buffer, thresholdDb = -45, paddingMs = 30) {
  const threshold = Math.pow(10, thresholdDb / 20)
  const padSamples = Math.floor((paddingMs / 1000) * buffer.sampleRate)
  const channels = buffer.numberOfChannels
  const len = buffer.length
  const datas = []
  for (let c = 0; c < channels; c++) datas.push(buffer.getChannelData(c))

  const amp = (i) => {
    let m = 0
    for (let c = 0; c < channels; c++) {
      const v = Math.abs(datas[c][i])
      if (v > m) m = v
    }
    return m
  }

  let start = 0
  while (start < len && amp(start) < threshold) start++
  let end = len
  while (end > start && amp(end - 1) < threshold) end--

  if (end <= start) return { start: 0, end: len, allSilent: true }
  start = Math.max(0, start - padSamples)
  end = Math.min(len, end + padSamples)
  return { start, end, allSilent: false }
}

function buildProcessedBuffer(buffer, opts) {
  let baseStart = 0
  let baseEnd = buffer.length
  if (opts.removeSilence) {
    const r = detectNonSilenceRange(buffer)
    if (!r.allSilent) {
      baseStart = r.start
      baseEnd = r.end
    }
  }

  const sr = buffer.sampleRate
  const baseDuration = (baseEnd - baseStart) / sr
  const userStart = Math.max(0, Math.min(opts.start, baseDuration))
  const userEnd = Math.max(userStart, Math.min(opts.end, baseDuration))

  const offsetStart = baseStart + Math.floor(userStart * sr)
  const offsetEnd = Math.min(baseEnd, baseStart + Math.ceil(userEnd * sr))
  const frameCount = Math.max(1, offsetEnd - offsetStart)

  const gain = opts.volume / 100
  const ctx = getAudioCtx()
  const out = ctx.createBuffer(buffer.numberOfChannels, frameCount, sr)
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const src = buffer.getChannelData(c)
    const dst = out.getChannelData(c)
    for (let i = 0; i < frameCount; i++) {
      let v = src[offsetStart + i] * gain
      if (v > 1) v = 1
      else if (v < -1) v = -1
      dst[i] = v
    }
  }
  return out
}

function encodeWav(buffer) {
  const numChannels = buffer.numberOfChannels
  const sampleRate = buffer.sampleRate
  const numFrames = buffer.length
  const bytesPerSample = 2
  const dataSize = numFrames * numChannels * bytesPerSample
  const totalSize = 44 + dataSize
  const ab = new ArrayBuffer(totalSize)
  const dv = new DataView(ab)

  let off = 0
  const writeStr = (s) => {
    for (let i = 0; i < s.length; i++) dv.setUint8(off + i, s.charCodeAt(i))
    off += s.length
  }
  writeStr('RIFF')
  dv.setUint32(off, totalSize - 8, true); off += 4
  writeStr('WAVE')
  writeStr('fmt ')
  dv.setUint32(off, 16, true); off += 4
  dv.setUint16(off, 1, true); off += 2
  dv.setUint16(off, numChannels, true); off += 2
  dv.setUint32(off, sampleRate, true); off += 4
  dv.setUint32(off, sampleRate * numChannels * bytesPerSample, true); off += 4
  dv.setUint16(off, numChannels * bytesPerSample, true); off += 2
  dv.setUint16(off, 16, true); off += 2
  writeStr('data')
  dv.setUint32(off, dataSize, true); off += 4

  const channels = []
  for (let c = 0; c < numChannels; c++) channels.push(buffer.getChannelData(c))
  for (let i = 0; i < numFrames; i++) {
    for (let c = 0; c < numChannels; c++) {
      let s = channels[c][i]
      if (s > 1) s = 1
      else if (s < -1) s = -1
      dv.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
      off += 2
    }
  }
  return new Blob([ab], { type: 'audio/wav' })
}

async function encodeMp3(buffer) {
  const lame = await loadLamejs()
  const channels = buffer.numberOfChannels
  const sampleRate = buffer.sampleRate
  const enc = new lame.Mp3Encoder(channels, sampleRate, 128)
  const mp3Data = []

  const toInt16 = (arr) => {
    const l = arr.length
    const res = new Int16Array(l)
    for (let i = 0; i < l; i++) {
      let s = arr[i]
      if (s > 1) s = 1
      else if (s < -1) s = -1
      res[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
    }
    return res
  }

  const block = 1152
  if (channels > 1) {
    const left = toInt16(buffer.getChannelData(0))
    const right = toInt16(buffer.getChannelData(1))
    for (let i = 0; i < left.length; i += block) {
      const lc = left.subarray(i, i + block)
      const rc = right.subarray(i, i + block)
      const buf = enc.encodeBuffer(lc, rc)
      if (buf.length > 0) mp3Data.push(buf)
    }
  } else {
    const mono = toInt16(buffer.getChannelData(0))
    for (let i = 0; i < mono.length; i += block) {
      const buf = enc.encodeBuffer(mono.subarray(i, i + block))
      if (buf.length > 0) mp3Data.push(buf)
    }
  }
  const endBuf = enc.flush()
  if (endBuf.length > 0) mp3Data.push(endBuf)
  return new Blob(mp3Data, { type: 'audio/mp3' })
}

function pickMimeType(candidates) {
  if (typeof MediaRecorder === 'undefined') return ''
  for (const m of candidates) {
    if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) return m
  }
  return ''
}

async function encodeViaMediaRecorder(buffer, mimeCandidates) {
  const mime = pickMimeType(mimeCandidates)
  if (!mime) throw new Error('当前浏览器不支持该格式编码')
  return await new Promise((resolve, reject) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const source = ctx.createBufferSource()
      source.buffer = buffer
      const dest = ctx.createMediaStreamDestination()
      source.connect(dest)
      const recorder = new MediaRecorder(dest.stream, { mimeType: mime })
      const chunks = []
      recorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunks.push(e.data) }
      recorder.onstop = () => {
        ctx.close()
        resolve({ blob: new Blob(chunks, { type: mime }), mime })
      }
      recorder.onerror = (e) => {
        ctx.close()
        reject(e.error || new Error('录制失败'))
      }
      recorder.start()
      source.onended = () => {
        try { recorder.stop() } catch (err) { reject(err) }
      }
      source.start()
    } catch (err) {
      reject(err)
    }
  })
}

function detectFormatFromName(name) {
  const ext = (name.toLowerCase().split('.').pop() || '').trim()
  if (ext === 'mp3') return 'mp3'
  if (ext === 'wav') return 'wav'
  if (ext === 'ogg' || ext === 'oga' || ext === 'opus') return 'ogg'
  if (ext === 'aac' || ext === 'm4a' || ext === 'mp4') return 'aac'
  return 'mp3'
}

async function encodeBufferToFormat(buffer, format) {
  if (format === 'mp3') {
    return { blob: await encodeMp3(buffer), ext: 'mp3' }
  }
  if (format === 'wav') {
    return { blob: encodeWav(buffer), ext: 'wav' }
  }
  if (format === 'aac') {
    const { blob } = await encodeViaMediaRecorder(buffer, [
      'audio/mp4;codecs=mp4a.40.2',
      'audio/mp4',
      'audio/aac'
    ])
    return { blob, ext: 'm4a' }
  }
  if (format === 'ogg') {
    const { blob } = await encodeViaMediaRecorder(buffer, [
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/webm;codecs=opus'
    ])
    return { blob, ext: 'ogg' }
  }
  throw new Error('不支持的格式: ' + format)
}

function splitName(filename) {
  const dot = filename.lastIndexOf('.')
  if (dot <= 0) return { base: filename, ext: '' }
  return { base: filename.slice(0, dot), ext: filename.slice(dot + 1) }
}

function fmtSec(s) {
  if (!Number.isFinite(s)) return '0.000'
  return s.toFixed(3)
}

let _idSeq = 1

export default function AudioTool() {
  const { showToast } = useToast()
  const inputRef = useRef(null)
  const [items, setItems] = useState([])
  const [format, setFormat] = useState('original')
  const [processing, setProcessing] = useState(false)
  const [status, setStatus] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [playingId, setPlayingId] = useState(null)
  const previewRef = useRef({ ctx: null, source: null, gain: null, itemId: null })

  const stopPreview = useCallback(() => {
    const p = previewRef.current
    if (p.source) {
      try { p.source.onended = null } catch { /* ignore */ }
      try { p.source.stop() } catch { /* ignore */ }
      try { p.source.disconnect() } catch { /* ignore */ }
    }
    if (p.gain) {
      try { p.gain.disconnect() } catch { /* ignore */ }
    }
    if (p.ctx) {
      try { p.ctx.close() } catch { /* ignore */ }
    }
    previewRef.current = { ctx: null, source: null, gain: null, itemId: null }
    setPlayingId(null)
  }, [])

  useEffect(() => {
    return () => stopPreview()
  }, [stopPreview])

  const handleFiles = useCallback(async (fileList) => {
    const files = Array.from(fileList || []).filter((f) => f && f.type.startsWith('audio') || /\.(mp3|wav|ogg|oga|opus|aac|m4a|mp4|flac)$/i.test(f.name))
    if (files.length === 0) {
      showToast('请选择音频文件')
      return
    }
    const ctx = getAudioCtx()
    for (const file of files) {
      setStatus(`正在读取: ${file.name}`)
      try {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = await ctx.decodeAudioData(arrayBuffer.slice(0))
        const { base } = splitName(file.name)
        const duration = buffer.duration
        const silenceRange = detectNonSilenceRange(buffer)
        const id = _idSeq++
        const newItem = {
          id,
          file,
          originalName: file.name,
          baseName: base,
          buffer,
          duration,
          silenceRange,
          volume: 100,
          removeSilence: true,
          start: 0,
          end: Number(duration.toFixed(3))
        }
        setItems((prev) => [...prev, newItem])
      } catch (err) {
        console.error('解码失败', file.name, err)
        showToast(`无法解码: ${file.name}`)
      }
    }
    setStatus(`已导入 ${files.length} 个文件`)
  }, [showToast])

  const onPick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const onInputChange = useCallback((e) => {
    handleFiles(e.target.files)
    e.target.value = ''
  }, [handleFiles])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const updateItem = useCallback((id, patch) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }, [])

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
    if (previewRef.current.itemId === id) stopPreview()
  }, [stopPreview])

  const previewItem = useCallback((item) => {
    if (previewRef.current.itemId === item.id) {
      stopPreview()
      return
    }
    stopPreview()
    try {
      const processed = buildProcessedBuffer(item.buffer, {
        removeSilence: item.removeSilence,
        start: item.start,
        end: item.end,
        volume: 100
      })
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      const source = ctx.createBufferSource()
      source.buffer = processed
      const gainNode = ctx.createGain()
      gainNode.gain.value = item.volume / 100
      source.connect(gainNode)
      gainNode.connect(ctx.destination)
      source.onended = () => {
        if (previewRef.current.itemId === item.id) {
          try { ctx.close() } catch { /* ignore */ }
          previewRef.current = { ctx: null, source: null, gain: null, itemId: null }
          setPlayingId(null)
        }
      }
      source.start()
      previewRef.current = { ctx, source, gain: gainNode, itemId: item.id }
      setPlayingId(item.id)
    } catch (err) {
      console.error(err)
      showToast('试听失败')
    }
  }, [showToast, stopPreview])

  useEffect(() => {
    if (playingId == null) return
    const item = items.find((it) => it.id === playingId)
    const gain = previewRef.current.gain
    if (!item || !gain) return
    try {
      gain.gain.value = item.volume / 100
    } catch { /* ignore */ }
  }, [items, playingId])

  const handleExport = useCallback(async () => {
    if (items.length === 0) {
      showToast('请先导入音频')
      return
    }
    setProcessing(true)
    stopPreview()
    const zip = new JSZip()
    const usedNames = new Set()

    try {
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        setStatus(`正在处理 (${i + 1}/${items.length}): ${item.originalName}`)

        const isUntouched =
          format === 'original' &&
          item.volume === 100 &&
          !item.removeSilence &&
          item.start === 0 &&
          Math.abs(item.end - item.duration) < 0.0005

        let blob
        let ext
        if (isUntouched) {
          blob = item.file
          ext = splitName(item.originalName).ext || detectFormatFromName(item.originalName)
        } else {
          const processed = buildProcessedBuffer(item.buffer, {
            removeSilence: item.removeSilence,
            start: item.start,
            end: item.end,
            volume: item.volume
          })
          const targetFormat = format === 'original'
            ? detectFormatFromName(item.originalName)
            : format
          const encoded = await encodeBufferToFormat(processed, targetFormat)
          blob = encoded.blob
          ext = encoded.ext
        }

        let name = `${item.baseName}.${ext}`
        let suffix = 1
        while (usedNames.has(name)) {
          name = `${item.baseName}_${suffix}.${ext}`
          suffix++
        }
        usedNames.add(name)
        zip.file(name, blob)
      }

      setStatus('正在生成压缩包...')
      const content = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(content)
      const a = document.createElement('a')
      a.href = url
      a.download = `audio_pack_${Date.now()}.zip`
      a.click()
      URL.revokeObjectURL(url)
      setStatus('✅ 导出完成')
    } catch (err) {
      console.error(err)
      showToast(err.message || '导出失败')
      setStatus('导出失败，请重试')
    } finally {
      setProcessing(false)
    }
  }, [items, format, showToast, stopPreview])

  return (
    <ToolPageLayout title="音频处理">
      <div className={styles.root}>
        <div className={styles.card}>
          <h2 className={styles.title}>
            音频处理工具
            <small className={styles.subtitle}>(批量音量 / 去空白 / 裁剪 / 转格式)</small>
          </h2>
          <p className={styles.tip}>
            适用于游戏音效一致性整理：调整音量、自动去除前后空白、按时间裁剪、统一编码格式后打包导出。
          </p>

          <div
            className={`${styles.dropZone} ${dragOver ? styles.dragOver : ''}`}
            onClick={onPick}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          >
            <div className={styles.dropMain}>点击或拖拽音频到此处</div>
            <div className={styles.dropSub}>支持 MP3 / WAV / OGG / AAC / M4A / FLAC 等浏览器可解码格式</div>
            <input
              ref={inputRef}
              type="file"
              accept="audio/*"
              multiple
              style={{ display: 'none' }}
              onChange={onInputChange}
            />
          </div>

          {items.length > 0 && (
            <div className={styles.list}>
              {items.map((item, index) => {
                const playing = playingId === item.id
                return (
                  <div key={item.id} className={styles.item}>
                    <div className={styles.itemHead}>
                      <div className={styles.itemName} title={item.originalName}>
                        <span className={styles.itemIndex}>[{index + 1}]</span> {item.originalName}
                      </div>
                      <div className={styles.itemMeta}>
                        时长 {fmtSec(item.duration)}s · {item.buffer.numberOfChannels} 声道 · {item.buffer.sampleRate} Hz
                        {item.removeSilence && item.silenceRange && !item.silenceRange.allSilent ? (
                          <span className={styles.metaAccent}>
                            {' '}· 去空白后 {fmtSec((item.silenceRange.end - item.silenceRange.start) / item.buffer.sampleRate)}s
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className={styles.itemActions}>
                      <button type="button" className={styles.btnGhost} onClick={() => previewItem(item)}>
                        {playing ? '停止' : '试听'}
                      </button>
                      <button type="button" className={styles.btnDanger} onClick={() => removeItem(item.id)}>
                        删除
                      </button>
                    </div>

                    <div className={styles.waveformWrap}>
                      <Waveform
                        buffer={item.buffer}
                        start={item.start}
                        end={item.end}
                        removeSilence={item.removeSilence}
                        silenceRange={item.silenceRange}
                        volume={item.volume}
                      />
                    </div>

                    <div className={styles.controls}>
                      <div className={styles.field}>
                        <div className={styles.fieldLabel}>
                          <span>音量</span>
                          <span className={styles.fieldValue}>{item.volume}%</span>
                        </div>
                        <input
                          className={styles.range}
                          type="range"
                          min={0}
                          max={500}
                          step={1}
                          value={item.volume}
                          onChange={(e) => updateItem(item.id, { volume: Number(e.target.value) })}
                        />
                      </div>

                      <div className={styles.field}>
                        <div className={styles.fieldLabel}>
                          <span>选项</span>
                        </div>
                        <label className={styles.checkRow}>
                          <input
                            type="checkbox"
                            checked={item.removeSilence}
                            onChange={(e) => updateItem(item.id, { removeSilence: e.target.checked })}
                          />
                          去掉前后空白间奏
                        </label>
                      </div>

                      <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                        <div className={styles.fieldLabel}>
                          <span>截取区间（秒）</span>
                          <span className={styles.fieldValue}>
                            {fmtSec(item.start)}s → {fmtSec(item.end)}s
                          </span>
                        </div>
                        <div className={styles.rangeFields}>
                          <input
                            className={styles.numInput}
                            type="number"
                            min={0}
                            max={item.duration}
                            step={0.001}
                            value={item.start}
                            onChange={(e) => {
                              const v = Math.max(0, Math.min(Number(e.target.value) || 0, item.end))
                              updateItem(item.id, { start: v })
                            }}
                          />
                          <input
                            className={styles.numInput}
                            type="number"
                            min={0}
                            max={item.duration}
                            step={0.001}
                            value={item.end}
                            onChange={(e) => {
                              const v = Math.max(item.start, Math.min(Number(e.target.value) || 0, item.duration))
                              updateItem(item.id, { end: v })
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className={styles.divider} />

          <div className={styles.globalRow}>
            <label className={styles.checkRow} style={{ gap: 8 }}>
              <span style={{ color: '#444', fontWeight: 500 }}>导出格式</span>
              <select
                className={styles.select}
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="original">原格式（默认）</option>
                <option value="mp3">MP3</option>
                <option value="aac">AAC</option>
                <option value="ogg">OGG</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            className={styles.exportBtn}
            disabled={processing || items.length === 0}
            onClick={handleExport}
          >
            {processing ? '处理中…' : '一键打包导出 (.zip)'}
          </button>
          <div className={styles.status}>{status}</div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
