const KEY_GROUPS = 'prompt-assembly-quick-groups'
/** 旧版扁平列表，迁移后删除 */
const KEY_LEGACY = 'prompt-assembly-quick-params'

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

function saveGroups(groups) {
  localStorage.setItem(KEY_GROUPS, JSON.stringify(groups))
}

function migrateLegacy() {
  try {
    const legacy = localStorage.getItem(KEY_LEGACY)
    if (!legacy) return

    const existingRaw = localStorage.getItem(KEY_GROUPS)
    let newGroupsNonEmpty = false
    if (existingRaw) {
      const p = JSON.parse(existingRaw)
      newGroupsNonEmpty = Array.isArray(p) && p.length > 0
    }
    if (newGroupsNonEmpty) {
      localStorage.removeItem(KEY_LEGACY)
      return
    }

    const arr = JSON.parse(legacy)
    if (!Array.isArray(arr)) return
    localStorage.removeItem(KEY_LEGACY)
    if (arr.length === 0) {
      saveGroups([])
      return
    }
    const isLegacyFlat = arr[0].items === undefined && arr[0].content !== undefined
    if (isLegacyFlat) {
      saveGroups([
        {
          id: uid(),
          title: '默认分组',
          createdAt: Date.now(),
          items: arr.map((x) => ({
            id: x.id || uid(),
            content: x.content ?? '',
            createdAt: x.createdAt ?? Date.now(),
          })),
        },
      ])
    }
  } catch {
    /* ignore */
  }
}

function loadGroups() {
  migrateLegacy()
  try {
    const s = localStorage.getItem(KEY_GROUPS)
    if (!s) return []
    const arr = JSON.parse(s)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

/** @returns {Array<{ id: string, title: string, createdAt: number, items: Array<{ id: string, content: string, createdAt: number }> }>} */
export function getAllGroups() {
  return loadGroups()
}

export function addGroup(title) {
  const list = loadGroups()
  const g = {
    id: uid(),
    title: String(title ?? '').trim() || '未命名分组',
    createdAt: Date.now(),
    items: [],
  }
  list.unshift(g)
  saveGroups(list)
  return g
}

export function updateGroupTitle(groupId, title) {
  const list = loadGroups()
  const g = list.find((x) => x.id === groupId)
  if (!g) return null
  g.title = String(title ?? '').trim() || '未命名分组'
  saveGroups(list)
  return g
}

export function deleteGroup(groupId) {
  const list = loadGroups().filter((g) => g.id !== groupId)
  saveGroups(list)
}

export function addQuickParam(groupId, content) {
  const list = loadGroups()
  const g = list.find((x) => x.id === groupId)
  if (!g) return null
  if (!Array.isArray(g.items)) g.items = []
  const item = {
    id: uid(),
    content: content ?? '',
    createdAt: Date.now(),
  }
  g.items.unshift(item)
  saveGroups(list)
  return item
}

export function updateQuickParamItem(groupId, itemId, content) {
  const list = loadGroups()
  const g = list.find((x) => x.id === groupId)
  if (!g || !g.items) return null
  const i = g.items.findIndex((x) => x.id === itemId)
  if (i === -1) return null
  g.items[i] = { ...g.items[i], content: content ?? '' }
  saveGroups(list)
  return g.items[i]
}

export function deleteQuickParamItem(groupId, itemId) {
  const list = loadGroups()
  const g = list.find((x) => x.id === groupId)
  if (!g || !g.items) return
  g.items = g.items.filter((x) => x.id !== itemId)
  saveGroups(list)
}

export function reorderGroups(fromIndex, toIndex) {
  const list = loadGroups()
  if (fromIndex < 0 || fromIndex >= list.length) return
  if (toIndex < 0 || toIndex >= list.length) return
  if (fromIndex === toIndex) return
  const next = [...list]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  saveGroups(next)
}

/** 同一分组内快捷参数排序 */
export function reorderQuickParamItems(groupId, fromIndex, toIndex) {
  const list = loadGroups()
  const g = list.find((x) => x.id === groupId)
  if (!g || !Array.isArray(g.items)) return
  const items = g.items
  if (fromIndex < 0 || fromIndex >= items.length) return
  if (toIndex < 0 || toIndex >= items.length) return
  if (fromIndex === toIndex) return
  const next = [...items]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  g.items = next
  saveGroups(list)
}
