'use client';
import { useState, useEffect } from 'react';
import './PaymentPopup.css';
import { startPayment, checkUserAccess, PRICE_WITH_WATERMARK, PRICE_NO_WATERMARK } from '../../services/paymentService';

/**
 * PaymentPopup — shows three pricing tiers for card download.
 *
 * Props:
 *   cardType    — e.g. 'birthday', 'wedding'
 *   cardLabel   — Display name, e.g. 'Birthday Invitation'
 *   userEmail   — logged-in user email (may be '' for guests)
 *   userName    — user display name (optional, for Razorpay prefill)
 *   onClose     — close the popup
 *   onPaymentDone — called after successful payment verification (receives { withWatermark: boolean, tier: string })
 */
export default function PaymentPopup({ cardType, cardLabel, userEmail, userName, onClose, onPaymentDone }) {
  const [loading, setLoading] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(false);
  const [error, setError] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [selectedTier, setSelectedTier] = useState('no-watermark'); // 'free', 'watermark', or 'no-watermark'
  const [existingAccess, setExistingAccess] = useState(null); // { hasAccess, tier, expiresAt }

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
        const access = await checkUserAccess(emailToUse, cardType);
        setExistingAccess(access);
      } catch (err) {
        console.error('Error checking access:', err);
        setExistingAccess(null);
      }
      setCheckingAccess(false);
    }
    checkAccess();
  }, [emailToUse, cardType]);

  async function handlePay() {
    // Free tier - just download with watermark, no payment or email required
    if (selectedTier === 'free') {
      if (onPaymentDone) onPaymentDone({ withWatermark: true, tier: 'free', isFree: true, email: emailToUse || '' });
      return;
    }

    if (!emailToUse || !isValidEmail(emailToUse)) {
      setError('Please enter a valid email address to proceed.');
      return;
    }

    setLoading(true);
    setError('');

    const payPrice = selectedTier === 'watermark' ? PRICE_WITH_WATERMARK : PRICE_NO_WATERMARK;
    const withWatermark = selectedTier === 'watermark';
    const tier = withWatermark ? 'watermark' : 'premium';

    await startPayment({
      email: emailToUse,
      cardType,
      cardLabel: withWatermark ? `${cardLabel} (with small watermark)` : cardLabel,
      userName: userName || '',
      amount: payPrice,
      tier: tier,
      onSuccess: (result) => {
        setLoading(false);
        if (onPaymentDone) onPaymentDone({ ...result, withWatermark, tier, email: emailToUse });
      },
      onError: (err) => {
        setLoading(false);
        setError(err.message || 'Payment failed. Please try again.');
      },
    });
  }

  // Format expiry date
  function formatExpiry(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  return (
    <div className="pay-overlay" onClick={onClose}>
      <div className="pay-popup pay-popup-tiers" onClick={e => e.stopPropagation()}>
        <button className="pay-close" onClick={onClose}>✕</button>

        <div className="pay-icon">🎨</div>
        <h3>Download Your {cardLabel}</h3>
        <p className="pay-desc">Choose your preferred download option</p>

        {/* Existing customer message */}
        {existingAccess?.hasAccess && (
          <div className="pay-existing-access">
            <div className="pay-existing-icon">✅</div>
            <div className="pay-existing-info">
              <strong>You already have active access!</strong>
              <p>
                {existingAccess.tier === 'premium' ? 'No watermark' : 'Small watermark'} access
                {existingAccess.expiresAt && ` until ${formatExpiry(existingAccess.expiresAt)}`}
              </p>
            </div>
          </div>
        )}

        {/* Three-tier pricing options */}
        <div className="pay-tiers pay-tiers-three">
          {/* Free Option */}
          <button
            className={`pay-tier-option pay-tier-free ${selectedTier === 'free' ? 'selected' : ''}`}
            onClick={() => setSelectedTier('free')}
            type="button"
          >
            <div className="pay-tier-price">FREE</div>
            <div className="pay-tier-label">With Watermark</div>
            <div className="pay-tier-desc">"CreativeThinkerDesignHub.com" watermark on card</div>
          </button>

          {/* ₹19 Option */}
          <button
            className={`pay-tier-option ${selectedTier === 'watermark' ? 'selected' : ''}`}
            onClick={() => setSelectedTier('watermark')}
            type="button"
          >
            <div className="pay-tier-price">₹{PRICE_WITH_WATERMARK}</div>
            <div className="pay-tier-label">Small Watermark</div>
            <div className="pay-tier-desc">Tiny text at bottom • 7 days access</div>
          </button>

          {/* ₹49 Option */}
          <button
            className={`pay-tier-option pay-tier-premium ${selectedTier === 'no-watermark' ? 'selected' : ''}`}
            onClick={() => setSelectedTier('no-watermark')}
            type="button"
          >
            <div className="pay-tier-badge">RECOMMENDED</div>
            <div className="pay-tier-price">₹{PRICE_NO_WATERMARK}</div>
            <div className="pay-tier-label">No Watermark</div>
            <div className="pay-tier-desc">Clean, professional card • 7 days access</div>
          </button>
        </div>

        {isGuest && selectedTier !== 'free' && (
          <div className="pay-email-section">
            <label className="pay-email-label">📧 Enter your email for payment receipt & download link</label>
            <input
              type="email"
              className="pay-email-input"
              placeholder="your@email.com"
              value={guestEmail}
              onChange={e => { setGuestEmail(e.target.value); if (error) setError(''); }}
              autoFocus
            />
            {checkingAccess && <p className="pay-checking">Checking for existing access...</p>}
          </div>
        )}

        {selectedTier !== 'free' && (
          <p className="pay-trust-note">
            🔒 Secure payment via <strong>Razorpay</strong> — UPI, Wallets, Netbanking, Cards
          </p>
        )}

        {error && (
          <p className="pay-error">{error}</p>
        )}

        <button
          className="pay-btn"
          onClick={handlePay}
          disabled={loading || checkingAccess}
        >
          {loading
            ? '⏳ Processing…'
            : selectedTier === 'free'
              ? '⬇️ Download Free (With Watermark)'
              : selectedTier === 'watermark'
                ? `💳 Pay ₹${PRICE_WITH_WATERMARK} — Download with Small Watermark`
                : `✨ Pay ₹${PRICE_NO_WATERMARK} — Download Clean Card`}
        </button>
      </div>
    </div>
  );
}

