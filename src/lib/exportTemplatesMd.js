/**
 * 导出为 Markdown：每个模版为「# 标题」+ 空行 + 正文；模版之间空 5 行。
 * @param {Array<{ title: string, body: string }>} templates
 */
export function templatesToMarkdown(templates) {
  if (!templates.length) return ''
  const blocks = templates.map((t) => {
    const title = String(t.title ?? '').replace(/\r\n/g, '\n').split('\n')[0] || '未命名'
    const body = t.body != null ? String(t.body) : ''
    return `# ${title}\n\n${body}`.trimEnd()
  })
  // 模版之间空 5 行：两段之间用 6 个换行衔接（上一段末尾换行 + 中间 5 个空行）
  return blocks.join('\n\n\n\n\n\n')
}

export function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  a.click()
  URL.revokeObjectURL(url)
}
