import { useState } from 'react';
import './PaymentPopup.css';
import { notifyAdmin } from '../../services/notificationService';
import { ADMIN_NAME } from '../../services/authService';
import { recordPayment } from '../../services/subscriptionService';

/*  Card pricing (₹)  */
const CARD_PRICES = {
  birthday:    49,
  anniversary: 49,
  jagrata:     49,
  biodata:     99,
  wedding:     99,
  resume:      79,
};

/* UPI ID for receiving payments */
const UPI_ID = 'soniarajvansi9876@okaxis';

export default function PaymentPopup({ cardId, cardLabel, userEmail, onClose, onPaymentDone }) {
  const [step, setStep]       = useState('info');   // 'info' | 'pay' | 'done'
  const [txnId, setTxnId]     = useState('');
  const [loading, setLoading] = useState(false);

  const price = CARD_PRICES[cardId] || 49;
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(ADMIN_NAME)}&am=${price}&cu=INR&tn=${encodeURIComponent(`CardMaker-${cardLabel}`)}`;

  async function handleConfirmPayment() {
    if (!txnId.trim()) return;
    setLoading(true);
    try {
      // Record payment in Firestore
      await recordPayment(userEmail, cardId, cardLabel, txnId.trim());

      // Notify admin
      await notifyAdmin(
        `💰 Payment Received — ${cardLabel}`,
        `User: ${userEmail}\nCard: ${cardLabel}\nAmount: ₹${price}\nTransaction ID: ${txnId}\n\nPlease verify the payment and approve the download.`,
        userEmail,
      );
      setStep('done');
      if (onPaymentDone) onPaymentDone(txnId);
    } catch {
      /* silently continue */
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pay-overlay" onClick={onClose}>
      <div className="pay-popup" onClick={e => e.stopPropagation()}>
        <button className="pay-close" onClick={onClose}>✕</button>

        {/* ---- Step 1: Info ---- */}
        {step === 'info' && (
          <>
            <div className="pay-icon">💎</div>
            <h3>Download {cardLabel}</h3>
            <p className="pay-desc">
              Get a watermark-free, high-quality download of your card.
            </p>
            <div className="pay-price-box">
              <span className="pay-price-label">Price</span>
              <span className="pay-price-amount">₹{price}</span>
            </div>
            <div className="pay-features">
              <div>✅ HD quality download</div>
              <div>✅ No watermark</div>
              <div>✅ Print ready</div>
              <div>✅ Instant delivery</div>
            </div>
            <button className="pay-btn" onClick={() => setStep('pay')}>
              💳 Proceed to Pay ₹{price}
            </button>
          </>
        )}

        {/* ---- Step 2: Payment details ---- */}
        {step === 'pay' && (
          <>
            <div className="pay-icon">📱</div>
            <h3>Pay ₹{price}</h3>
            <p className="pay-desc">Scan the QR code or use UPI to pay</p>

            {/* QR Code via external service */}
            <div className="pay-qr-box">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiLink)}`}
                alt="UPI QR Code"
                className="pay-qr-img"
              />
            </div>

            <div className="pay-upi-id">
              <span className="pay-upi-label">UPI ID:</span>
              <span className="pay-upi-value">{UPI_ID}</span>
            </div>

            <div className="pay-divider">or pay via UPI apps</div>

            <a href={upiLink} className="pay-upi-btn" target="_blank" rel="noreferrer">
              📱 Open UPI App
            </a>

            <div className="pay-txn-section">
              <label className="pay-txn-label">After payment, enter your Transaction/UTR ID:</label>
              <input
                className="pay-txn-input"
                type="text"
                placeholder="e.g. 403012345678"
                value={txnId}
                onChange={e => setTxnId(e.target.value)}
              />
              <button
                className="pay-btn confirm"
                onClick={handleConfirmPayment}
                disabled={!txnId.trim() || loading}
              >
                {loading ? '⏳ Confirming…' : '✅ I\'ve Paid — Confirm'}
              </button>
            </div>

            <button className="pay-back-link" onClick={() => setStep('info')}>
              ← Back
            </button>
          </>
        )}

        {/* ---- Step 3: Done ---- */}
        {step === 'done' && (
          <>
            <div className="pay-icon">🎉</div>
            <h3>Payment Submitted!</h3>
            <p className="pay-desc">
              Your transaction ID <strong>{txnId}</strong> has been sent to the admin for verification.
            </p>
            <p className="pay-desc">
              Once verified, your download will be enabled. You'll also receive an email notification.
            </p>
            <button className="pay-btn" onClick={onClose}>
              👍 Got it
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export { CARD_PRICES };
