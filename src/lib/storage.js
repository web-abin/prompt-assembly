const KEY = 'prompt-assembly-templates'

function loadRaw() {
  try {
    const s = localStorage.getItem(KEY)
    if (!s) return []
    const arr = JSON.parse(s)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

function saveRaw(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

export function getAllTemplates() {
  return loadRaw()
}

export function getTemplate(id) {
  return loadRaw().find((t) => t.id === id) ?? null
}

/** @param {{ title: string, body: string }} data */
export function addTemplate(data) {
  const list = loadRaw()
  const item = {
    id: uid(),
    title: data.title?.trim() || '未命名模版',
    body: data.body ?? '',
    createdAt: Date.now(),
  }
  list.unshift(item)
  saveRaw(list)
  return item
}

export function updateTemplate(id, patch) {
  const list = loadRaw()
  const i = list.findIndex((t) => t.id === id)
  if (i === -1) return null
  list[i] = { ...list[i], ...patch }
  saveRaw(list)
  return list[i]
}

export function deleteTemplate(id) {
  const list = loadRaw().filter((t) => t.id !== id)
  saveRaw(list)
}

/** 将模版列表按下标移动（拖拽排序） */
export function reorderTemplates(fromIndex, toIndex) {
  const list = loadRaw()
  if (fromIndex < 0 || fromIndex >= list.length) return
  if (toIndex < 0 || toIndex >= list.length) return
  if (fromIndex === toIndex) return
  const next = [...list]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  saveRaw(next)
}
