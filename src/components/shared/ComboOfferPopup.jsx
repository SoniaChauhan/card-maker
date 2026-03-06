'use client';
import { useState, useEffect, useCallback } from 'react';
import './ComboOfferPopup.css';
import {
  startComboPayment, checkUserAccess, sendOTP, verifyOTP,
  COMBO_PRICE, COMBO_CARD_COUNT, COMBO_SAVINGS, PRICE_NO_WATERMARK,
} from '../../services/paymentService';

/**
 * Available premium card types users can pick from for the combo.
 * Only non-free, non-coming-soon cards are listed.
 */
const COMBO_ELIGIBLE_CARDS = [
  { id: 'birthday',    label: 'Birthday Invitation',           icon: '🎂' },
  { id: 'wedding',     label: 'Wedding Invitation',            icon: '💐' },
  { id: 'anniversary', label: 'Anniversary Greeting',          icon: '💍' },
  { id: 'biodata',     label: 'Marriage Biodata / Profile',    icon: '💒' },
  { id: 'rentcard',    label: 'PG / Rent Card',                icon: '🏠' },
  { id: 'saloncard',   label: 'Salon / Parlour Card',          icon: '💇' },
];

/**
 * ComboOfferPopup — lets user pick 2 card types and pay ₹69 for 15-day access.
 * Email-only OTP verification for guest users.
 *
 * Props:
 *   userEmail   — logged-in user email (may be '' for guests)
 *   userName    — user display name
 *   onClose     — close the popup
 *   onComboDone — called after successful combo payment { comboCards, expiresAt }
 */
export default function ComboOfferPopup({ userEmail, userName, onClose, onComboDone }) {
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Identity — email only (for guests)
  const [guestEmail, setGuestEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);

  const isGuest = !userEmail;
  const emailToUse = guestEmail.trim();
  const identifierReady = isGuest ? (isValidEmail(emailToUse) && otpVerified) : true;

  // Existing access per card
  const [accessMap, setAccessMap] = useState({});

  function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

  // Toggle card selection
  function toggleCard(cardId) {
    setSelected(prev => {
      if (prev.includes(cardId)) return prev.filter(x => x !== cardId);
      if (prev.length >= COMBO_CARD_COUNT) return prev; // max 2
      return [...prev, cardId];
    });
    setError('');
  }

  // OTP countdown
  useEffect(() => {
    if (otpCountdown <= 0) return;
    const t = setTimeout(() => setOtpCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [otpCountdown]);

  // Check existing access for each eligible card
  const checkAllAccess = useCallback(async () => {
    const email = isGuest ? emailToUse : (userEmail || '');
    if (!email) return;
    const map = {};
    await Promise.all(
      COMBO_ELIGIBLE_CARDS.map(async (c) => {
        try {
          const a = await checkUserAccess(email, c.id);
          map[c.id] = a;
        } catch { map[c.id] = null; }
      })
    );
    setAccessMap(map);
  }, [userEmail, emailToUse, isGuest]);

  useEffect(() => {
    if (!isGuest) checkAllAccess();
    else if (otpVerified) checkAllAccess();
  }, [isGuest, otpVerified, checkAllAccess]);

  async function handleSendOTP() {
    setOtpError('');
    if (!isValidEmail(emailToUse)) { setOtpError('Enter a valid email address.'); return; }
    setOtpLoading(true);
    try {
      await sendOTP('email', emailToUse);
      setOtpSent(true);
      setOtpCountdown(30);
    } catch (err) { setOtpError(err.message || 'Failed to send OTP.'); }
    setOtpLoading(false);
  }

  async function handleVerifyOTP(codeOverride) {
    setOtpError('');
    const code = codeOverride || otpValue;
    if (!code || code.length < 4) { setOtpError('Enter the OTP.'); return; }
    setOtpLoading(true);
    try {
      const r = await verifyOTP('email', emailToUse, code);
      if (r.verified) { setOtpVerified(true); setOtpError(''); }
      else setOtpError('Invalid OTP.');
    } catch (err) { setOtpError(err.message || 'OTP verification failed.'); }
    setOtpLoading(false);
  }

  async function handlePay() {
    if (selected.length !== COMBO_CARD_COUNT) {
      setError(`Please select exactly ${COMBO_CARD_COUNT} card types.`);
      return;
    }
    if (isGuest && !otpVerified) {
      setError('Please verify your email address first.');
      return;
    }

    setLoading(true);
    setError('');

    const email = isGuest ? emailToUse : (userEmail || '');

    await startComboPayment({
      email,
      phone: '',
      comboCards: selected,
      userName: userName || '',
      onSuccess: (result) => {
        setLoading(false);
        if (onComboDone) onComboDone({ ...result, comboCards: selected });
      },
      onError: (err) => {
        setLoading(false);
        setError(err.message || 'Payment failed. Try again.');
      },
    });
  }

  function getButtonText() {
    if (loading) return '⏳ Processing…';
    if (selected.length < COMBO_CARD_COUNT) return `Select ${COMBO_CARD_COUNT - selected.length} more card${COMBO_CARD_COUNT - selected.length > 1 ? 's' : ''}`;
    return `💳 Pay ₹${COMBO_PRICE} — Unlock ${selected.length} Cards for 15 Days`;
  }

  return (
    <div className="combo-overlay" onClick={onClose}>
      <div className="combo-popup" onClick={e => e.stopPropagation()}>
        <button className="combo-close" onClick={onClose}>✕</button>

        {/* Header */}
        <div className="combo-header">
          <div className="combo-badge">🔥 COMBO OFFER</div>
          <h2 className="combo-title">
            Pick Any {COMBO_CARD_COUNT} Cards — Just <span className="combo-price-hl">₹{COMBO_PRICE}</span>
          </h2>
          <p className="combo-subtitle">
            Get <strong>15 days unlimited downloads</strong> (no watermark) for both card types
          </p>
          <div className="combo-savings">
            <span className="combo-orig-price">₹{PRICE_NO_WATERMARK * 2}</span>
            <span className="combo-arrow">→</span>
            <span className="combo-new-price">₹{COMBO_PRICE}</span>
            <span className="combo-save-badge">Save ₹{COMBO_SAVINGS}!</span>
          </div>
        </div>

        {/* Card Picker */}
        <div className="combo-picker">
          <p className="combo-picker-label">Choose {COMBO_CARD_COUNT} card types:</p>
          <div className="combo-cards-grid">
            {COMBO_ELIGIBLE_CARDS.map(card => {
              const isSelected = selected.includes(card.id);
              const hasAccess = accessMap[card.id]?.hasAccess;
              const disabled = !isSelected && selected.length >= COMBO_CARD_COUNT;
              return (
                <button
                  key={card.id}
                  className={`combo-card-btn ${isSelected ? 'selected' : ''} ${disabled ? 'disabled' : ''} ${hasAccess ? 'has-access' : ''}`}
                  onClick={() => !disabled && toggleCard(card.id)}
                  type="button"
                  disabled={disabled && !isSelected}
                >
                  <span className="combo-card-icon">{card.icon}</span>
                  <span className="combo-card-label">{card.label}</span>
                  {isSelected && <span className="combo-card-check">✓</span>}
                  {hasAccess && <span className="combo-card-active">Active ✅</span>}
                </button>
              );
            })}
          </div>
          <p className="combo-selected-count">
            {selected.length}/{COMBO_CARD_COUNT} selected
            {selected.length === COMBO_CARD_COUNT && ' ✅'}
          </p>
        </div>

        {/* Identity section for guests */}
        {isGuest && (
          <div className="combo-identity">
            <p className="combo-identity-label">✉️ Verify your email address</p>
            <div className="combo-input-row">
              <input
                type="email"
                className="combo-email-input"
                placeholder="yourname@email.com"
                value={guestEmail}
                onChange={e => { setGuestEmail(e.target.value); setOtpSent(false); setOtpVerified(false); setOtpError(''); }}
                disabled={otpVerified}
              />
              {otpVerified && <span className="combo-verified">✅</span>}
            </div>
            {!otpVerified && (
              <div className="combo-otp-section">
                {!otpSent ? (
                  <button className="combo-otp-btn" onClick={handleSendOTP}
                    disabled={otpLoading || !isValidEmail(emailToUse)} type="button">
                    {otpLoading ? '⏳ Sending…' : 'Send OTP'}
                  </button>
                ) : (
                  <div className="combo-otp-row">
                    <input type="text" inputMode="numeric" autoComplete="one-time-code"
                      className="combo-otp-input" placeholder="Enter OTP" maxLength={6}
                      value={otpValue}
                      onChange={e => { setOtpValue(e.target.value.replace(/\D/g, '')); if (otpError) setOtpError(''); }}
                      autoFocus />
                    <button className="combo-otp-verify" onClick={() => handleVerifyOTP()}
                      disabled={otpLoading || otpValue.length < 4} type="button">
                      {otpLoading ? '⏳' : 'Verify'}
                    </button>
                  </div>
                )}
                {otpSent && otpCountdown > 0 && <p className="combo-otp-timer">Resend in {otpCountdown}s</p>}
                {otpSent && otpCountdown === 0 && <button className="combo-otp-resend" onClick={handleSendOTP} disabled={otpLoading} type="button">Resend OTP</button>}
                {otpError && <p className="combo-otp-error">{otpError}</p>}
              </div>
            )}
          </div>
        )}

        {/* Features */}
        <div className="combo-features">
          <div className="combo-feature"><span>✨</span> No watermark on downloads</div>
          <div className="combo-feature"><span>📅</span> 15 days unlimited access</div>
          <div className="combo-feature"><span>🎨</span> All templates included</div>
          <div className="combo-feature"><span>💾</span> Download as many as you want</div>
        </div>

        {/* Trust */}
        <p className="combo-trust">🔒 Secure payment via <strong>Razorpay</strong> — UPI, Wallets, Net Banking, Cards</p>

        {error && <p className="combo-error">{error}</p>}

        {/* Pay Button */}
        <button
          className="combo-pay-btn"
          onClick={handlePay}
          disabled={loading || selected.length !== COMBO_CARD_COUNT || (isGuest && !otpVerified)}
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );
}
