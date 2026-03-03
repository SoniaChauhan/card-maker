'use client';
import { useState } from 'react';
import './PaymentPopup.css';
import { startPayment, getCardPrice } from '../../services/paymentService';

/**
 * PaymentPopup — shows card pricing info and triggers Razorpay checkout.
 *
 * Props:
 *   cardType    — e.g. 'birthday', 'wedding'
 *   cardLabel   — Display name, e.g. 'Birthday Invitation'
 *   userEmail   — logged-in user email (may be '' for guests)
 *   userName    — user display name (optional, for Razorpay prefill)
 *   onClose     — close the popup
 *   onPaymentDone — called after successful payment verification
 */
export default function PaymentPopup({ cardType, cardLabel, userEmail, userName, onClose, onPaymentDone }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  const price = getCardPrice(cardType);
  const isGuest = !userEmail;
  const emailToUse = userEmail || guestEmail.trim();

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

    await startPayment({
      email: emailToUse,
      cardType,
      cardLabel,
      userName: userName || '',
      onSuccess: (result) => {
        setLoading(false);
        if (onPaymentDone) onPaymentDone(result);
      },
      onError: (err) => {
        setLoading(false);
        setError(err.message || 'Payment failed. Please try again.');
      },
    });
  }

  return (
    <div className="pay-overlay" onClick={onClose}>
      <div className="pay-popup" onClick={e => e.stopPropagation()}>
        <button className="pay-close" onClick={onClose}>✕</button>

        <div className="pay-icon">💎</div>
        <h3>Download {cardLabel}</h3>
        <p className="pay-desc">
          Get a watermark-free, high-quality download of your card.
        </p>

        <div className="pay-price-box">
          <span className="pay-price-label">Price</span>
          <span className="pay-price-amount">₹{price}</span>
        </div>

        {cardType === 'holicard' ? (
          <div className="pay-features">
            <div>🔓 Unlimited downloads for 24 hours</div>
            <div>✅ HD quality — no watermark</div>
            <div>✅ All Holi templates included</div>
            <div>✅ Instant access after payment</div>
            <div>⏰ Access expires 24 hrs after payment</div>
          </div>
        ) : (
          <div className="pay-features">
            <div>✅ HD quality download</div>
            <div>✅ No watermark</div>
            <div>✅ Print ready</div>
            <div>✅ Instant delivery</div>
          </div>
        )}

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
            : cardType === 'holicard'
              ? `🔓 Pay ₹${price} — Unlock 24-hr Access`
              : `💳 Pay ₹${price} & Download`}
        </button>

        {cardType !== 'holicard' && (
          <p className="pay-free-note">
            Or download for free with watermark using the download button below.
          </p>
        )}
      </div>
    </div>
  );
}

