import { useState } from 'react';
import PaymentPopup from './PaymentPopup';
import { CARD_PRICES } from './PaymentPopup';

/**
 * CardActions — row of buttons shown beneath a card preview.
 * When `locked` is true, download shows a payment popup instead.
 */
export default function CardActions({
  onEdit, onBack, onDownload, downloading, dlBtnStyle = {}, dlLabel,
  locked = false, cardId, cardLabel, userEmail, isSuperAdmin,
  onPaymentDone,
}) {
  const [showPay, setShowPay] = useState(false);

  function handleDownloadClick() {
    if (locked && !isSuperAdmin) {
      setShowPay(true);
      return;
    }
    onDownload();
  }

  const price = CARD_PRICES[cardId] || 49;

  return (
    <>
      <div className="card-actions">
        <button className="btn-back-card" onClick={onEdit}>✏️ Edit Details</button>
        <button className="btn-back-card outline" onClick={onBack}>🏠 Choose Another</button>

        {locked && !isSuperAdmin && (
          <div className="download-locked-badge">
            🔒 Download requires payment (₹{price})
          </div>
        )}

        <button
          className="btn-download"
          onClick={handleDownloadClick}
          disabled={downloading}
          style={dlBtnStyle}
        >
          {downloading
            ? '⏳ Saving…'
            : (locked && !isSuperAdmin)
              ? `💳 Pay ₹${price} & Download`
              : (dlLabel || '⬇️ Download Card')}
        </button>
      </div>

      {showPay && (
        <PaymentPopup
          cardId={cardId}
          cardLabel={cardLabel}
          userEmail={userEmail}
          onClose={() => setShowPay(false)}
          onPaymentDone={(txnId) => {
            if (onPaymentDone) onPaymentDone(txnId);
          }}
        />
      )}
    </>
  );
}
