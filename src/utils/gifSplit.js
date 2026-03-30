import { parseGIF, decompressFrames } from 'gifuct-js'

/**
 * 将 GIF 拆成每一帧的完整画布 PNG data URL（与 gifuct-js demo 相同的逐帧合成方式）。
 * @param {ArrayBuffer} arrayBuffer
 * @returns {{ dataUrls: string[], width: number, height: number }}
 */
export function gifToFrameDataUrls(arrayBuffer) {
  const gif = parseGIF(arrayBuffer)
  const frames = decompressFrames(gif, true)
  if (!frames.length) {
    throw new Error('GIF 无有效帧')
  }

  const width = gif.lsd.width
  const height = gif.lsd.height

  const gifCanvas = document.createElement('canvas')
  gifCanvas.width = width
  gifCanvas.height = height
  const gifCtx = gifCanvas.getContext('2d')

  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  let frameImageData = null

  const drawPatch = (frame) => {
    const dims = frame.dims
    if (
      !frameImageData ||
      dims.width !== frameImageData.width ||
      dims.height !== frameImageData.height
    ) {
      tempCanvas.width = dims.width
      tempCanvas.height = dims.height
      frameImageData = tempCtx.createImageData(dims.width, dims.height)
    }
    frameImageData.data.set(frame.patch)
    tempCtx.putImageData(frameImageData, 0, 0)
    gifCtx.drawImage(tempCanvas, dims.left, dims.top)
  }

  const dataUrls = []
  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i]
    if (frame.disposalType === 2) {
      gifCtx.clearRect(0, 0, width, height)
    }
    drawPatch(frame)
    dataUrls.push(gifCanvas.toDataURL('image/png'))
  }

  return { dataUrls, width, height }
}
