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
 *   userEmail   — logged-in user email
 *   userName    — user display name (optional, for Razorpay prefill)
 *   onClose     — close the popup
 *   onPaymentDone — called after successful payment verification
 */
export default function PaymentPopup({ cardType, cardLabel, userEmail, userName, onClose, onPaymentDone }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const price = getCardPrice(cardType);

  async function handlePay() {
    setLoading(true);
    setError('');

    await startPayment({
      email: userEmail,
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

        <div className="pay-features">
          <div>✅ HD quality download</div>
          <div>✅ No watermark</div>
          <div>✅ Print ready</div>
          <div>✅ Instant delivery</div>
        </div>

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
          {loading ? '⏳ Processing…' : `💳 Pay ₹${price} & Download`}
        </button>

        <p className="pay-free-note">
          Or download for free with watermark using the download button below.
        </p>
      </div>
    </div>
  );
}

