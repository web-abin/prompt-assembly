import { downloadTextFile } from './exportTemplatesMd'
import { getAllGroups } from './quickParamsStorage'

const SEP = '\n\n-----------------\n\n'

/** 按分组顺序展平所有快捷参数，条目之间用 ----------------- 分隔 */
export function quickParamsToMarkdownFromGroups() {
  const groups = getAllGroups()
  const chunks = []
  for (const g of groups) {
    for (const it of g.items || []) {
      chunks.push(String(it.content ?? '').trimEnd())
    }
  }
  return chunks.join(SEP)
}

export function exportQuickParamsMd(filename = 'quick-params.md') {
  const md = quickParamsToMarkdownFromGroups()
  downloadTextFile(filename, md)
}
