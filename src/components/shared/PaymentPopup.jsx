'use client';
import { useState } from 'react';
import './PaymentPopup.css';
import { startPayment, getCardPrice, PRICE_WITH_WATERMARK, PRICE_NO_WATERMARK } from '../../services/paymentService';

/**
 * PaymentPopup — shows two pricing tiers for card download.
 *
 * Props:
 *   cardType    — e.g. 'birthday', 'wedding'
 *   cardLabel   — Display name, e.g. 'Birthday Invitation'
 *   userEmail   — logged-in user email (may be '' for guests)
 *   userName    — user display name (optional, for Razorpay prefill)
 *   onClose     — close the popup
 *   onPaymentDone — called after successful payment verification (receives { withWatermark: boolean })
 */
export default function PaymentPopup({ cardType, cardLabel, userEmail, userName, onClose, onPaymentDone }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [selectedTier, setSelectedTier] = useState('no-watermark'); // 'watermark' or 'no-watermark'

  const isGuest = !userEmail;
  const emailToUse = userEmail || guestEmail.trim();
  const isHoliCard = cardType === 'holicard';

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handlePay() {
    if (!emailToUse || !isValidEmail(emailToUse)) {
      setError('Please enter a valid email address to proceed.');
      return;
    }

    setLoading(true);
    setError('');

    const payPrice = selectedTier === 'watermark' ? PRICE_WITH_WATERMARK : PRICE_NO_WATERMARK;
    const withWatermark = selectedTier === 'watermark';

    await startPayment({
      email: emailToUse,
      cardType,
      cardLabel: withWatermark ? `${cardLabel} (with watermark)` : cardLabel,
      userName: userName || '',
      amount: payPrice,
      onSuccess: (result) => {
        setLoading(false);
        if (onPaymentDone) onPaymentDone({ ...result, withWatermark });
      },
      onError: (err) => {
        setLoading(false);
        setError(err.message || 'Payment failed. Please try again.');
      },
    });
  }

  return (
    <div className="pay-overlay" onClick={onClose}>
      <div className="pay-popup pay-popup-tiers" onClick={e => e.stopPropagation()}>
        <button className="pay-close" onClick={onClose}>✕</button>

        <div className="pay-icon">🎨</div>
        <h3>Download Your {cardLabel}</h3>
        <p className="pay-desc">Choose your preferred download option</p>

        {/* Two-tier pricing options */}
        <div className="pay-tiers">
          <button
            className={`pay-tier-option ${selectedTier === 'watermark' ? 'selected' : ''}`}
            onClick={() => setSelectedTier('watermark')}
            type="button"
          >
            <div className="pay-tier-price">₹{PRICE_WITH_WATERMARK}</div>
            <div className="pay-tier-label">With Watermark</div>
            <div className="pay-tier-desc">Small "CreativeThinkerDesignHub.com" text at bottom</div>
          </button>

          <button
            className={`pay-tier-option pay-tier-premium ${selectedTier === 'no-watermark' ? 'selected' : ''}`}
            onClick={() => setSelectedTier('no-watermark')}
            type="button"
          >
            <div className="pay-tier-badge">RECOMMENDED</div>
            <div className="pay-tier-price">₹{PRICE_NO_WATERMARK}</div>
            <div className="pay-tier-label">No Watermark</div>
            <div className="pay-tier-desc">Clean, professional card — print ready!</div>
          </button>
        </div>

        {isGuest && (
          <div className="pay-email-section">
            <label className="pay-email-label">📧 Enter your email for payment receipt</label>
            <input
              type="email"
              className="pay-email-input"
              placeholder="your@email.com"
              value={guestEmail}
              onChange={e => { setGuestEmail(e.target.value); if (error) setError(''); }}
              autoFocus
            />
          </div>
        )}

        <p className="pay-trust-note">
          🔒 Secure payment via <strong>Razorpay</strong> — UPI, Wallets, Netbanking, Cards
        </p>

        {error && (
          <p className="pay-error">{error}</p>
        )}

        <button
          className="pay-btn"
          onClick={handlePay}
          disabled={loading}
        >
          {loading
            ? '⏳ Processing…'
            : selectedTier === 'watermark'
              ? `💳 Pay ₹${PRICE_WITH_WATERMARK} — Download with Watermark`
              : `✨ Pay ₹${PRICE_NO_WATERMARK} — Download Clean Card`}
        </button>
      </div>
    </div>
  );
}

