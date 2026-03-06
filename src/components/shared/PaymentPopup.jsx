'use client';
import { useState, useEffect, useCallback } from 'react';
import './PaymentPopup.css';
import { startPayment, checkUserAccess, sendOTP, verifyOTP, PRICE_WITH_WATERMARK, PRICE_NO_WATERMARK } from '../../services/paymentService';

/**
 * PaymentPopup — shows pricing tiers for card download.
 * Supports email OTP verification for guest users.
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
  const [checkingAccess, setCheckingAccess] = useState(false);
  const [error, setError] = useState('');
  const [selectedTier, setSelectedTier] = useState('no-watermark'); // 'free', 'watermark', 'no-watermark'
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
  const emailToUse = guestEmail.trim().toLowerCase();

  // The identifier that will be used for payment
  const identifierReady = isGuest
    ? (isValidEmail(emailToUse) && otpVerified)
    : true; // logged-in users don't need OTP

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // OTP countdown timer
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const timer = setTimeout(() => setOtpCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  // Check for existing access when identifier changes (after OTP verified)
  const checkAccess = useCallback(async () => {
    const email = isGuest ? emailToUse : (userEmail || '');
    if (!email) { setExistingAccess(null); return; }
    if (isGuest && !isValidEmail(email)) { setExistingAccess(null); return; }

    setCheckingAccess(true);
    try {
      const access = await checkUserAccess(email, cardType);
      setExistingAccess(access);
    } catch {
      setExistingAccess(null);
    }
    setCheckingAccess(false);
  }, [userEmail, emailToUse, isGuest, cardType]);

  // Check access for logged-in users immediately, or after OTP verified for guests
  useEffect(() => {
    if (!isGuest) {
      checkAccess();
    } else if (otpVerified) {
      checkAccess();
    }
  }, [isGuest, otpVerified, checkAccess]);

  // Reset OTP state
  function resetOtp() {
    setOtpSent(false);
    setOtpValue('');
    setOtpVerified(false);
    setOtpError('');
    setError('');
    setExistingAccess(null);
  }

  async function handleSendOTP() {
    setOtpError('');
    if (!isValidEmail(emailToUse)) {
      setOtpError('Please enter a valid email address.');
      return;
    }

    setOtpLoading(true);
    try {
      await sendOTP('email', emailToUse);
      setOtpSent(true);
      setOtpCountdown(30);
    } catch (err) {
      setOtpError(err.message || 'Failed to send OTP. Try again.');
    }
    setOtpLoading(false);
  }

  async function handleVerifyOTP(codeOverride) {
    setOtpError('');
    const code = codeOverride || otpValue;
    if (!code || code.length < 4) {
      setOtpError('Please enter the OTP.');
      return;
    }

    setOtpLoading(true);
    try {
      const result = await verifyOTP('email', emailToUse, code);
      if (result.verified) {
        setOtpVerified(true);
        setOtpError('');
      } else {
        setOtpError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setOtpError(err.message || 'OTP verification failed.');
    }
    setOtpLoading(false);
  }
  // Whether the Send OTP button should be enabled
  const canSendOtp = isValidEmail(emailToUse);

  async function handlePay() {
    const email = isGuest ? emailToUse : (userEmail || '');
    const phone = '';

    // Free tier — just download with watermark, no payment or identity needed
    if (selectedTier === 'free') {
      if (onPaymentDone) onPaymentDone({ withWatermark: true, tier: 'free', isFree: true, email, phone });
      return;
    }

    // If user already has active access, skip payment
    if (existingAccess?.hasAccess) {
      const matchesTier = existingAccess.tier === 'premium' || existingAccess.tier === 'combo' ||
        existingAccess.tier === (selectedTier === 'watermark' ? 'watermark' : 'premium');
      if (matchesTier) {
        if (onPaymentDone) onPaymentDone({
          alreadyPaid: true,
          withWatermark: false,
          tier: existingAccess.tier,
          email,
          phone,
          expiresAt: existingAccess.expiresAt,
        });
        return;
      }
    }

    // Guest needs OTP verification first
    if (isGuest && !otpVerified) {
      setError('Please verify your email with OTP first.');
      return;
    }

    // Validate identifier
    if (isGuest && !isValidEmail(emailToUse)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    const payPrice = selectedTier === 'watermark' ? PRICE_WITH_WATERMARK : PRICE_NO_WATERMARK;
    const withWatermark = selectedTier === 'watermark';
    const tier = withWatermark ? 'watermark' : 'premium';

    await startPayment({
      email: email || '',
      phone: phone || '',
      cardType,
      cardLabel: withWatermark ? `${cardLabel} (with small watermark)` : cardLabel,
      userName: userName || '',
      amount: payPrice,
      tier,
      onSuccess: (result) => {
        setLoading(false);
        if (onPaymentDone) onPaymentDone({ ...result, withWatermark, tier, email: email || '', phone: phone || '' });
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

  // Button text
  function getButtonText() {
    if (loading) return '⏳ Processing…';
    if (selectedTier === 'free') return '⬇️ Download Free (With Watermark)';
    if (existingAccess?.hasAccess) {
      const matchesTier = existingAccess.tier === 'premium' || existingAccess.tier === 'combo' ||
        existingAccess.tier === (selectedTier === 'watermark' ? 'watermark' : 'premium');
      if (matchesTier) return '⬇️ Download Now';
    }
    if (selectedTier === 'watermark') return `💳 Pay ₹${PRICE_WITH_WATERMARK} — Download with Small Watermark`;
    return `✨ Pay ₹${PRICE_NO_WATERMARK} — Download Clean Card`;
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
                {existingAccess.tier === 'combo' ? 'Combo Pack — No watermark' : existingAccess.tier === 'premium' ? 'No watermark' : 'Small watermark'} access
                {existingAccess.expiresAt && ` until ${formatExpiry(existingAccess.expiresAt)}`}
              </p>
            </div>
          </div>
        )}

        {/* Three-tier pricing options */}
        <div className="pay-tiers pay-tiers-three">
          <button
            className={`pay-tier-option pay-tier-free ${selectedTier === 'free' ? 'selected' : ''}`}
            onClick={() => setSelectedTier('free')}
            type="button"
          >
            <div className="pay-tier-price">FREE</div>
            <div className="pay-tier-label">With Watermark</div>
            <div className="pay-tier-desc">&ldquo;CreativeThinkerDesignHub.com&rdquo; watermark on card</div>
          </button>

          <button
            className={`pay-tier-option ${selectedTier === 'watermark' ? 'selected' : ''}`}
            onClick={() => setSelectedTier('watermark')}
            type="button"
          >
            <div className="pay-tier-price">₹{PRICE_WITH_WATERMARK}</div>
            <div className="pay-tier-label">Small Watermark</div>
            <div className="pay-tier-desc">Tiny text at bottom</div>
          </button>

          <button
            className={`pay-tier-option pay-tier-premium ${selectedTier === 'no-watermark' ? 'selected' : ''}`}
            onClick={() => setSelectedTier('no-watermark')}
            type="button"
          >
            <div className="pay-tier-badge">RECOMMENDED</div>
            <div className="pay-tier-price">₹{PRICE_NO_WATERMARK}</div>
            <div className="pay-tier-label">No Watermark</div>
            <div className="pay-tier-desc">Clean, professional card</div>
          </button>
        </div>

        {/* Identity input — only for guests and paid-only tiers */}
        {isGuest && selectedTier !== 'free' && (
          <div className="pay-identity-section">
            <p className="pay-identity-label">✉️ Enter your email address</p>

            {/* Email Input */}
            <div className="pay-input-row">
              <input
                type="email"
                className="pay-identity-input pay-identity-input--email"
                placeholder="your@email.com"
                value={guestEmail}
                onChange={e => { setGuestEmail(e.target.value); setOtpSent(false); setOtpVerified(false); setOtpError(''); if (error) setError(''); }}
                disabled={otpVerified}
              />
              {otpVerified && <span className="pay-verified-badge">✅ Verified</span>}
            </div>

            {/* OTP section */}
            {!otpVerified && (
              <div className="pay-otp-section">
                {!otpSent ? (
                  <button
                    className="pay-otp-send-btn"
                    onClick={handleSendOTP}
                    disabled={otpLoading || !canSendOtp}
                    type="button"
                  >
                    {otpLoading ? '⏳ Sending...' : 'Send OTP to Email'}
                  </button>
                ) : (
                  <div className="pay-otp-verify-row">
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      className="pay-otp-input"
                      placeholder="Enter OTP"
                      maxLength={6}
                      value={otpValue}
                      onChange={e => { setOtpValue(e.target.value.replace(/\D/g, '')); if (otpError) setOtpError(''); }}
                      autoFocus
                    />
                    <button
                      className="pay-otp-verify-btn"
                      onClick={() => handleVerifyOTP()}
                      disabled={otpLoading || otpValue.length < 4}
                      type="button"
                    >
                      {otpLoading ? '⏳' : 'Verify'}
                    </button>
                  </div>
                )}

                {otpSent && otpCountdown > 0 && (
                  <p className="pay-otp-timer">Resend OTP in {otpCountdown}s</p>
                )}
                {otpSent && otpCountdown === 0 && (
                  <button className="pay-otp-resend" onClick={handleSendOTP} disabled={otpLoading} type="button">
                    Resend OTP
                  </button>
                )}

                {otpError && <p className="pay-otp-error">{otpError}</p>}
              </div>
            )}

            {checkingAccess && <p className="pay-checking">Checking for existing access...</p>}
          </div>
        )}

        {/* Trust Note — hide when user already has access */}
        {selectedTier !== 'free' && !(existingAccess?.hasAccess) && (
          <p className="pay-trust-note">
            🔒 Secure payment via <strong>Razorpay</strong> — UPI, Wallets, Netbanking, Cards
          </p>
        )}

        {error && <p className="pay-error">{error}</p>}

        <button
          className="pay-btn"
          onClick={handlePay}
          disabled={loading || checkingAccess || (isGuest && selectedTier !== 'free' && !otpVerified && !existingAccess?.hasAccess)}
        >
          {getButtonText()}
        </button>

        {selectedTier !== 'free' && (
          <p className="pay-7day-note">🔓 7 Days Unlimited Downloads — Edit &amp; Re-download Anytime!</p>
        )}
      </div>
    </div>
  );
}

