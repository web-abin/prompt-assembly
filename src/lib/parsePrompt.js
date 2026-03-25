/** 按首次出现顺序提取 [] 内的占位符（去重） */
export function extractPlaceholders(text) {
  if (!text) return []
  const re = /\[([^\]]+)\]/g
  const seen = new Set()
  const keys = []
  let m
  while ((m = re.exec(text)) !== null) {
    const key = m[1].trim()
    if (!seen.has(key)) {
      seen.add(key)
      keys.push(key)
    }
  }
  return keys
}

/**
 * 将模版拆成文本段与占位符段，占位符带与 extractPlaceholders 一致的编号（从 1 起）。
 * @returns {Array<{ type: 'text', content: string } | { type: 'ph', key: string, keyIndex: number }>}
 */
export function getTemplateDisplaySegments(text) {
  if (!text) return []
  const keys = extractPlaceholders(text)
  const keyToIndex = new Map(keys.map((k, i) => [k, i + 1]))
  const re = /\[([^\]]+)\]/g
  const segments = []
  let lastIndex = 0
  let m
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, m.index) })
    }
    const inner = m[1].trim()
    const keyIndex = keyToIndex.get(inner) ?? 0
    segments.push({ type: 'ph', key: inner, keyIndex })
    lastIndex = m.index + m[0].length
  }
  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) })
  }
  return segments
}

/** 将模版中所有 [key] 替换为 values[key]（无括号） */
export function assemblePrompt(template, values) {
  if (!template) return ''
  return template.replace(/\[([^\]]+)\]/g, (_, raw) => {
    const key = raw.trim()
    const v = values[key]
    return v != null && v !== '' ? String(v) : ''
  })
}
