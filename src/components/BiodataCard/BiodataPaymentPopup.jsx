'use client';
import { useState, useEffect } from 'react';
import { startPayment, checkUserAccess, PRICE_NO_WATERMARK } from '../../services/paymentService';

const BIODATA_PRICE = PRICE_NO_WATERMARK; // ₹49

/**
 * BiodataPaymentPopup — Two options: Free (with watermark) or ₹49 (no watermark, 7 days)
 */
export default function BiodataPaymentPopup({ userEmail, userName, onClose, onPaymentDone }) {
  const [loading, setLoading] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(false);
  const [error, setError] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [selectedTier, setSelectedTier] = useState('premium'); // 'free' or 'premium'
  const [existingAccess, setExistingAccess] = useState(null);

  const isGuest = !userEmail;
  const emailToUse = userEmail || guestEmail.trim();

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Check for existing access when email changes
  useEffect(() => {
    async function checkAccess() {
      if (!emailToUse || !isValidEmail(emailToUse)) {
        setExistingAccess(null);
        return;
      }
      setCheckingAccess(true);
      try {
        const access = await checkUserAccess(emailToUse, 'biodata');
        setExistingAccess(access);
      } catch (err) {
        console.error('Error checking access:', err);
        setExistingAccess(null);
      }
      setCheckingAccess(false);
    }
    checkAccess();
  }, [emailToUse]);

  // Format expiry date
  function formatExpiry(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  async function handlePay() {
    // Free tier - just download with watermark, no payment or email needed
    if (selectedTier === 'free') {
      if (onPaymentDone) onPaymentDone({ withWatermark: true, tier: 'free', isFree: true, email: emailToUse || '' });
      return;
    }

    // Email required only for premium tier
    if (!emailToUse || !isValidEmail(emailToUse)) {
      setError('Please enter a valid email address to proceed.');
      return;
    }

    setLoading(true);
    setError('');

    await startPayment({
      email: emailToUse,
      cardType: 'biodata',
      cardLabel: 'Marriage Biodata',
      userName: userName || '',
      amount: BIODATA_PRICE,
      tier: 'premium',
      onSuccess: (result) => {
        setLoading(false);
        if (onPaymentDone) {
          onPaymentDone({
            ...result,
            withWatermark: false,
            tier: 'premium',
            email: emailToUse,
          });
        }
      },
      onError: (err) => {
        setLoading(false);
        setError(err.message || 'Payment failed. Please try again.');
      },
    });
  }

  return (
    <div className="bdp-overlay" onClick={onClose}>
      <div className="bdp-popup bdp-popup--simple" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bdp-header">
          <div className="bdp-header-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="#fff" strokeWidth="2" fill="none"/>
              <path d="M14 20l4 4 8-8" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="bdp-header-title">Your Biodata Is Ready!</h2>
          <p className="bdp-header-subtitle">Choose your download option</p>
          <button className="bdp-close" onClick={onClose}>✕</button>
        </div>

        {/* Existing customer message */}
        {existingAccess?.hasAccess && (
          <div className="bdp-existing-access">
            <div className="bdp-existing-icon">✅</div>
            <div className="bdp-existing-info">
              <strong>You already have active access!</strong>
              <p>No watermark access until {formatExpiry(existingAccess.expiresAt)}</p>
            </div>
          </div>
        )}

        {/* Two Options */}
        <div className="bdp-options">
          {/* Free Option */}
          <button
            className={`bdp-option ${selectedTier === 'free' ? 'bdp-option--selected' : ''}`}
            onClick={() => { setSelectedTier('free'); setError(''); }}
            type="button"
          >
            <div className="bdp-option-price">FREE</div>
            <div className="bdp-option-label">With Watermark</div>
          </button>

          {/* Premium Option */}
          <button
            className={`bdp-option bdp-option--premium ${selectedTier === 'premium' ? 'bdp-option--selected' : ''}`}
            onClick={() => { setSelectedTier('premium'); setError(''); }}
            type="button"
          >
            <div className="bdp-option-badge">RECOMMENDED</div>
            <div className="bdp-option-price">₹{BIODATA_PRICE}</div>
            <div className="bdp-option-label">No Watermark</div>
          </button>
        </div>

        {/* Features */}
        <div className="bdp-features">
          <div className="bdp-feature">✓ High Resolution Image</div>
          <div className="bdp-feature">✓ Share on WhatsApp, Email</div>
          <div className="bdp-feature">✓ Print Ready Quality</div>
          {selectedTier === 'premium' && <div className="bdp-feature">✓ 7 Days Unlimited Downloads</div>}
        </div>

        {/* Guest Email Input - only for premium */}
        {isGuest && selectedTier !== 'free' && (
          <div className="bdp-email-section">
            <label className="bdp-email-label">📧 Enter your email for payment receipt & download link</label>
            <input
              type="email"
              className="bdp-email-input"
              placeholder="your@email.com"
              value={guestEmail}
              onChange={e => { setGuestEmail(e.target.value); if (error) setError(''); }}
            />
            {checkingAccess && <p className="bdp-checking">Checking for existing access...</p>}
          </div>
        )}

        {/* Trust Note */}
        {selectedTier !== 'free' && (
          <p className="bdp-trust-note">
            🔒 Secure payment via <strong>Razorpay</strong> — UPI, Wallets, Netbanking, Cards
          </p>
        )}

        {/* Error Message */}
        {error && <p className="bdp-error">{error}</p>}

        {/* CTA Button */}
        <button
          className="bdp-cta-btn"
          onClick={handlePay}
          disabled={loading || checkingAccess}
        >
          {loading
            ? '⏳ Processing…'
            : selectedTier === 'free'
              ? '⬇️ Download Free (With Watermark)'
              : `Pay ₹${BIODATA_PRICE} to Download Now`}
        </button>
      </div>
    </div>
  );
}
