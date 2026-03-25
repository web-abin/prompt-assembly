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

/** 将模版中所有 [key] 替换为 values[key]（无括号） */
export function assemblePrompt(template, values) {
  if (!template) return ''
  return template.replace(/\[([^\]]+)\]/g, (_, raw) => {
    const key = raw.trim()
    const v = values[key]
    return v != null && v !== '' ? String(v) : ''
  })
}
