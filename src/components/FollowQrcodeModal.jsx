import { Link } from 'react-router-dom'
import qrcodeUrl from '../assets/qrcode.png'

/**
 * 移动端点击「免费领取提示词大全」时展示公众号二维码。
 * @param {{ open: boolean; onClose: () => void }} props
 */
export default function FollowQrcodeModal({ open, onClose }) {
  if (!open) return null

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="follow-qrcode-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="follow-qrcode-title" className="modal-title">
          关注公众号
        </h2>
        <p className="redeem-tip">
          扫码关注后，发送「生图提示词」获取 Nano、即梦等提示词大全
        </p>
        <div className="redeem-qrcode">
          <img
            src={qrcodeUrl}
            alt="公众号二维码"
            className="redeem-qrcode-img"
            width={180}
            height={180}
          />
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}
