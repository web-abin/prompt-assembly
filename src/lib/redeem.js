export const REQUIRED_CODE = 'AIZAOWUJINHUA'

const KEY = 'prompt-assembly-redeem-code'

export function getRedeemCode() {
  try {
    return localStorage.getItem(KEY) || ''
  } catch {
    return ''
  }
}

export function hasRedeemed() {
  return getRedeemCode() === REQUIRED_CODE
}

export function saveRedeemCode(code) {
  try {
    localStorage.setItem(KEY, String(code ?? ''))
  } catch {
    /* ignore */
  }
}

export function clearRedeemCode() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
