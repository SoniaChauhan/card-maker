'use client';
import { useState, useEffect, useCallback } from 'react';
import { startPayment, checkUserAccess, sendOTP, verifyOTP, PRICE_NO_WATERMARK, CARD_PRICES } from '../../services/paymentService';

/**
 * BiodataPaymentPopup — Two options: Free (with watermark) or paid (no watermark, 7 days).
 * Supports email OTP verification for guest users.
 * Accepts optional cardType / cardLabel props to reuse for other card types.
 * Price is looked up from CARD_PRICES by cardType (e.g. cardresume → ₹99).
 */
export default function BiodataPaymentPopup({ userEmail, userName, onClose, onPaymentDone, cardType = 'biodata', cardLabel = 'Marriage Biodata' }) {
  const BIODATA_PRICE = CARD_PRICES[cardType] ?? PRICE_NO_WATERMARK;
  const [loading, setLoading] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedTier, setSelectedTier] = useState('premium'); // 'free' or 'premium'
  const [existingAccess, setExistingAccess] = useState(null);

  // Identity input — email only
  const [guestEmail, setGuestEmail] = useState('');

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);

  const isGuest = !userEmail;
  const emailToUse = guestEmail.trim();

  function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

  // The identifier that will be used for payment
  const identifierReady = isGuest
    ? (isValidEmail(emailToUse) && otpVerified)
    : true; // logged-in users don't need OTP

  // Reset OTP state when changing input
  const resetOtp = useCallback(() => {
    setOtpSent(false);
    setOtpValue('');
    setOtpVerified(false);
    setOtpError('');
    setOtpCountdown(0);
    setExistingAccess(null);
  }, []);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const t = setTimeout(() => setOtpCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [otpCountdown]);

  // Check for existing access after OTP is verified (guest) or immediately (logged-in)
  useEffect(() => {
    async function checkAccess() {
      const email = isGuest ? emailToUse : (userEmail || '');

      if (isGuest && !otpVerified) { setExistingAccess(null); return; }
      if (!email) { setExistingAccess(null); return; }

      setCheckingAccess(true);
      try {
        const access = await checkUserAccess(email, cardType);
        setExistingAccess(access);
      } catch (err) {
        console.error('Error checking access:', err);
        setExistingAccess(null);
      }
      setCheckingAccess(false);
    }
    checkAccess();
  }, [emailToUse, otpVerified, isGuest, userEmail]);

  // --- OTP handlers ---
  async function handleSendOtp() {
    setOtpError('');
    if (!isValidEmail(emailToUse)) { setOtpError('Enter a valid email address'); return; }

    setOtpLoading(true);
    try {
      const res = await sendOTP('email', emailToUse);
      if (res.ok) {
        setOtpSent(true);
        setOtpCountdown(30);
      } else {
        setOtpError(res.message || 'Failed to send OTP');
      }
    } catch (err) {
      setOtpError(err.message || 'Failed to send OTP. Try again.');
    }
    setOtpLoading(false);
  }

  async function handleVerifyOtp(codeOverride) {
    setOtpError('');
    const code = codeOverride || otpValue;
    if (!code || code.length < 4) { setOtpError('Enter the OTP'); return; }

    setOtpLoading(true);
    try {
      const res = await verifyOTP('email', emailToUse, code);
      if (res.verified) {
        setOtpVerified(true);
      } else {
        setOtpError(res.error || 'Invalid OTP');
      }
    } catch (err) {
      setOtpError(err.message || 'Verification failed. Try again.');
    }
    setOtpLoading(false);
  }

  // Format expiry date
  function formatExpiry(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  async function handlePay() {
    const email = isGuest ? emailToUse : (userEmail || '');

    // Free tier — download with watermark, no payment or identity needed
    if (selectedTier === 'free') {
      if (onPaymentDone) onPaymentDone({ withWatermark: true, tier: 'free', isFree: true, email, phone: '' });
      return;
    }

    // If user already has active premium or combo access, skip payment entirely
    if (existingAccess?.hasAccess && (existingAccess.tier === 'premium' || existingAccess.tier === 'combo')) {
      if (onPaymentDone) {
        onPaymentDone({
          alreadyPaid: true,
          withWatermark: false,
          tier: existingAccess.tier,
          email: email || existingAccess.email || '',
          phone: '',
          expiresAt: existingAccess.expiresAt,
        });
      }
      return;
    }

    // Guest must verify OTP before paying
    if (isGuest && !otpVerified) {
      setError('Please verify your email address first.');
      return;
    }

    // Must have identifier
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    setError('');

    await startPayment({
      email,
      phone: '',
      cardType,
      cardLabel,
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
            email: email || result.email || '',
            phone: '',
          });
        }
      },
      onError: (err) => {
        setLoading(false);
        setError(err.message || 'Payment failed. Please try again.');
      },
    });
  }

  // CTA label
  const ctaLabel = loading
    ? '⏳ Processing…'
    : selectedTier === 'free'
      ? '⬇️ Download Free (With Watermark)'
      : existingAccess?.hasAccess && (existingAccess.tier === 'premium' || existingAccess.tier === 'combo')
        ? '⬇️ Download Now (No Watermark)'
        : `Pay ₹${BIODATA_PRICE} to Download Now`;

  // CTA disabled?
  const ctaDisabled = loading || checkingAccess || (selectedTier !== 'free' && isGuest && !otpVerified);

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
          <h2 className="bdp-header-title">Your {cardLabel} Is Ready!</h2>
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
          {selectedTier === 'premium' && <div className="bdp-feature bdp-feature--highlight">✓ 7 Days Unlimited Downloads — Edit & Re-download Anytime!</div>}
        </div>

        {/* Identity Section — only for guests on premium tier */}
        {isGuest && selectedTier !== 'free' && (
          <div className="bdp-identity-section">
            <p className="bdp-identity-label">✉️ Enter your email address</p>

            {/* Email Input */}
            <div className="bdp-email-row">
              <input
                type="email"
                className="bdp-email-input"
                placeholder="yourname@email.com"
                value={guestEmail}
                onChange={e => { setGuestEmail(e.target.value); if (otpSent) resetOtp(); if (error) setError(''); }}
                disabled={otpVerified}
              />
            </div>

            {/* OTP Flow */}
            {!otpVerified ? (
              <div className="bdp-otp-section">
                {!otpSent ? (
                  <button
                    type="button"
                    className="bdp-otp-send-btn"
                    onClick={handleSendOtp}
                    disabled={otpLoading || !isValidEmail(emailToUse)}
                  >{otpLoading ? 'Sending…' : 'Send OTP'}</button>
                ) : (
                  <div className="bdp-otp-verify-row">
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      className="bdp-otp-input"
                      placeholder="Enter OTP"
                      maxLength={6}
                      value={otpValue}
                      onChange={e => setOtpValue(e.target.value.replace(/\D/g, ''))}
                    />
                    <button type="button" className="bdp-otp-verify-btn" onClick={() => handleVerifyOtp()} disabled={otpLoading}>
                      {otpLoading ? '…' : 'Verify'}
                    </button>
                    {otpCountdown > 0
                      ? <span className="bdp-otp-timer">Resend in {otpCountdown}s</span>
                      : <button type="button" className="bdp-otp-resend" onClick={handleSendOtp} disabled={otpLoading}>Resend OTP</button>}
                  </div>
                )}
                {otpError && <p className="bdp-otp-error">{otpError}</p>}
              </div>
            ) : (
              <p className="bdp-verified-badge">✅ Verified</p>
            )}

            {checkingAccess && <p className="bdp-checking">Checking for existing access...</p>}
          </div>
        )}

        {/* Trust Note — only show when payment is needed */}
        {selectedTier !== 'free' && !(existingAccess?.hasAccess && existingAccess.tier === 'premium') && (
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
          disabled={ctaDisabled}
        >
          {ctaLabel}
        </button>

        {selectedTier === 'premium' && (
          <p className="bdp-7day-note">🔓 7 Days Unlimited Downloads — Edit & Re-download Anytime!</p>
        )}
      </div>
    </div>
  );
}
