'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { startPayment, checkUserAccess, sendOTP, verifyOTP, PRICE_NO_WATERMARK } from '../../services/paymentService';

const BIODATA_PRICE = PRICE_NO_WATERMARK; // ₹49

/**
 * BiodataPaymentPopup — Two options: Free (with watermark) or ₹49 (no watermark, 7 days).
 * Supports both email and mobile number with OTP verification.
 * Accepts optional cardType / cardLabel props to reuse for other card types.
 */
export default function BiodataPaymentPopup({ userEmail, userName, lookupPhone, onClose, onPaymentDone, cardType = 'biodata', cardLabel = 'Marriage Biodata' }) {
  const [loading, setLoading] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedTier, setSelectedTier] = useState('premium'); // 'free' or 'premium'
  const [existingAccess, setExistingAccess] = useState(null);

  // Identity input — phone only
  const idMethod = 'phone';
  const [guestPhone, setGuestPhone] = useState(lookupPhone || '');

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpVerified, setOtpVerified] = useState(!!lookupPhone); // skip OTP if came from successful lookup
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);
  const otpAbortRef = useRef(null); // for Web OTP API abort

  const isGuest = !userEmail;
  const phoneToUse = guestPhone.replace(/\D/g, '').slice(-10);

  // The identifier that will be used for payment
  const identifierReady = isGuest
    ? (phoneToUse.length === 10 && otpVerified)
    : true; // logged-in users don't need OTP

  // Reset OTP state when switching method or changing input
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
      const email = isGuest ? '' : (userEmail || '');
      const phone = isGuest ? phoneToUse : '';

      if (isGuest && !otpVerified) { setExistingAccess(null); return; }
      if (!email && !phone) { setExistingAccess(null); return; }

      setCheckingAccess(true);
      try {
        const access = await checkUserAccess(email, cardType, phone);
        setExistingAccess(access);
      } catch (err) {
        console.error('Error checking access:', err);
        setExistingAccess(null);
      }
      setCheckingAccess(false);
    }
    checkAccess();
  }, [phoneToUse, otpVerified, isGuest, userEmail]);

  // --- OTP handlers ---
  async function handleSendOtp() {
    setOtpError('');
    if (phoneToUse.length !== 10) { setOtpError('Enter a valid 10-digit mobile number'); return; }

    setOtpLoading(true);
    try {
      const res = await sendOTP('phone', phoneToUse);
      if (res.ok) {
        setOtpSent(true);
        setOtpCountdown(30);
        // Try Web OTP API for auto-read
        tryWebOtpAutoRead();
      } else {
        setOtpError(res.message || 'Failed to send OTP');
      }
    } catch (err) {
      setOtpError(err.message || 'Failed to send OTP. Try again.');
    }
    setOtpLoading(false);
  }

  /** Attempt to auto-read OTP via Web OTP API (Chrome Android) */
  function tryWebOtpAutoRead() {
    if (typeof window === 'undefined' || !('OTPCredential' in window)) return;
    try {
      const ac = new AbortController();
      otpAbortRef.current = ac;
      navigator.credentials.get({ otp: { transport: ['sms'] }, signal: ac.signal })
        .then(otpCred => {
          if (otpCred?.code) {
            setOtpValue(otpCred.code);
            // Auto-verify after filling
            setTimeout(() => { handleVerifyOtp(otpCred.code); }, 200);
          }
        })
        .catch(() => { /* user dismissed or not supported */ });
    } catch (_) { /* Web OTP not available */ }
  }

  // Cleanup Web OTP listener on unmount
  useEffect(() => {
    return () => { if (otpAbortRef.current) otpAbortRef.current.abort(); };
  }, []);

  async function handleVerifyOtp(codeOverride) {
    setOtpError('');
    const code = codeOverride || otpValue;
    if (!code || code.length < 4) { setOtpError('Enter the OTP'); return; }

    setOtpLoading(true);
    try {
      const res = await verifyOTP('phone', phoneToUse, code);
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
    const email = isGuest ? '' : (userEmail || '');
    const phone = isGuest ? phoneToUse : '';

    // Free tier — download with watermark, no payment or identity needed
    if (selectedTier === 'free') {
      if (onPaymentDone) onPaymentDone({ withWatermark: true, tier: 'free', isFree: true, email, phone });
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
          phone: phone || existingAccess.phone || '',
          expiresAt: existingAccess.expiresAt,
        });
      }
      return;
    }

    // Guest must verify OTP before paying
    if (isGuest && !otpVerified) {
      setError('Please verify your mobile number first.');
      return;
    }

    // Must have at least one identifier
    if (!email && !phone) {
      setError('Please enter your mobile number.');
      return;
    }

    setLoading(true);
    setError('');

    await startPayment({
      email,
      phone,
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
            phone: phone || result.phone || '',
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
            <div className="bdp-seven-day-tag">7 Days Unlimited Downloads</div>
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
            <p className="bdp-identity-label">📱 Enter your mobile number</p>

            {/* Phone Input */}
            <div className="bdp-phone-row">
              <span className="bdp-phone-prefix">+91</span>
              <input
                type="tel"
                className="bdp-email-input bdp-phone-input"
                placeholder="10-digit mobile number"
                maxLength={10}
                value={guestPhone}
                onChange={e => { setGuestPhone(e.target.value.replace(/\D/g, '')); if (otpSent) resetOtp(); if (error) setError(''); }}
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
                    disabled={otpLoading || phoneToUse.length !== 10}
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
      </div>
    </div>
  );
}
