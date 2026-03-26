import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import qrcodeUrl from '../assets/qrcode.png'
import { REQUIRED_CODE, saveRedeemCode } from '../lib/redeem'

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {() => void} [props.onRedeemed]
 * @param {string} [props.message]
 */
export default function RedeemModal({ open, onClose, onRedeemed, message }) {
  const { showToast } = useToast()
  const [code, setCode] = useState('')

  if (!open) return null

  function handleRedeem() {
    const input = (code || '').trim()
    if (!input) {
      showToast('请输入兑换码')
      return
    }
    if (input !== REQUIRED_CODE) {
      showToast('兑换码不正确')
      return
    }
    saveRedeemCode(input)
    showToast('兑换成功，已解锁权限')
    if (onRedeemed) onRedeemed()
    onClose()
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="redeem-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="redeem-modal-title" className="modal-title">兑换码</h2>
        <p className="redeem-tip">{message || '使用兑换码可解锁更多功能'}</p>
        <div className="redeem-qrcode">
          <img src={qrcodeUrl} alt="公众号二维码" className="redeem-qrcode-img" />
          <div className="redeem-qrcode-caption">关注公众号，免费领取兑换码</div>
        </div>
        <label className="field-label" htmlFor="redeem-input">输入兑换码</label>
        <input
          id="redeem-input"
          className="input"
          type="text"
          placeholder="请输入兑换码"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={handleRedeem}>
            兑换
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            暂时不需要
          </button>
        </div>
      </div>
    </div>
  )
}
