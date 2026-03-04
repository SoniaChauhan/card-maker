'use client';
import { useState } from 'react';
import { startPayment } from '../../services/paymentService';

/* ── Biodata Pricing Tiers ── */
const BIODATA_TIERS = [
  {
    id: 'word',
    name: 'Word Format',
    badge: 'Recommended',
    badgeColor: '#22c55e',
    price: 99,
    originalPrice: 160,
    highlight: 'BEST VALUE',
    tags: ['Word', '+ PDF', '+ Image'],
    description: 'Unlimited Downloads & Edits (Word, PDF, Image)',
    icon: '/icons/word-pdf-icon.svg',
    formats: ['word', 'pdf', 'image'],
  },
  {
    id: 'editable',
    name: 'Editable',
    badge: 'Popular',
    badgeColor: '#eab308',
    price: 59,
    originalPrice: 90,
    subtitle: 'Image + PDF',
    description: 'Edit Image and PDF after payment',
    icon: '/icons/pdf-icon.svg',
    formats: ['pdf', 'image'],
  },
  {
    id: 'image',
    name: 'Image Only',
    price: 39,
    originalPrice: 49,
    subtitle: 'Non-Editable Image',
    description: 'Digital sharing, no edits after payment',
    icon: '/icons/img-icon.svg',
    formats: ['image'],
  },
];

/**
 * BiodataPaymentPopup — Shows 3 pricing tiers for biodata download:
 * Word Format, Editable (PDF+Image), Image Only
 */
export default function BiodataPaymentPopup({ userEmail, userName, onClose, onPaymentDone }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [selectedTier, setSelectedTier] = useState('word');

  const isGuest = !userEmail;
  const emailToUse = userEmail || guestEmail.trim();
  const currentTier = BIODATA_TIERS.find(t => t.id === selectedTier) || BIODATA_TIERS[0];

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
      cardType: 'biodata',
      cardLabel: `Marriage Biodata (${currentTier.name})`,
      userName: userName || '',
      amount: currentTier.price,
      onSuccess: (result) => {
        setLoading(false);
        if (onPaymentDone) {
          onPaymentDone({
            ...result,
            tier: currentTier.id,
            formats: currentTier.formats,
            withWatermark: false, // Biodata doesn't use watermark after payment
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
      <div className="bdp-popup" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bdp-header">
          <div className="bdp-header-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="#fff" strokeWidth="2" fill="none"/>
              <text x="20" y="26" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="bold">✓</text>
            </svg>
          </div>
          <h2 className="bdp-header-title">Your Biodata Is Ready!</h2>
          <p className="bdp-header-subtitle">Everything Is Set - Proceed to Get Your Biodata Now.</p>
          <button className="bdp-close" onClick={onClose}>✕</button>
        </div>

        {/* Pricing Options */}
        <div className="bdp-options">
          {BIODATA_TIERS.map(tier => (
            <div
              key={tier.id}
              className={`bdp-option ${selectedTier === tier.id ? 'bdp-option--selected' : ''}`}
              onClick={() => setSelectedTier(tier.id)}
            >
              {tier.badge && (
                <span className="bdp-badge" style={{ background: tier.badgeColor }}>
                  {tier.badge}
                </span>
              )}

              <div className="bdp-option-left">
                <div className="bdp-option-icon">
                  {tier.id === 'word' && (
                    <div className="bdp-icon-stack">
                      <span className="bdp-icon-pdf">PDF</span>
                      <span className="bdp-icon-img">IMG</span>
                      <span className="bdp-icon-word">W</span>
                    </div>
                  )}
                  {tier.id === 'editable' && (
                    <div className="bdp-icon-stack">
                      <span className="bdp-icon-pdf">PDF</span>
                      <span className="bdp-icon-img">IMG</span>
                    </div>
                  )}
                  {tier.id === 'image' && (
                    <div className="bdp-icon-single">
                      <span className="bdp-icon-img-only">IMG</span>
                    </div>
                  )}
                </div>

                <div className="bdp-option-info">
                  <div className="bdp-option-name">
                    {tier.name}
                    {tier.highlight && <span className="bdp-highlight">👑 {tier.highlight} 👑</span>}
                  </div>
                  {tier.tags && (
                    <div className="bdp-tags">
                      {tier.tags.map((tag, i) => (
                        <span key={i} className="bdp-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                  {tier.subtitle && <div className="bdp-option-subtitle">{tier.subtitle}</div>}
                  <div className="bdp-option-desc">{tier.description}</div>
                </div>
              </div>

              <div className="bdp-option-right">
                <span className="bdp-original-price">₹{tier.originalPrice}</span>
                <span className="bdp-price">₹{tier.price}</span>
                {tier.id === 'word' && <span className="bdp-offer-tag">Offer!</span>}
              </div>

              {selectedTier === tier.id && (
                <div className="bdp-check">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="11" fill="#22c55e"/>
                    <path d="M7 12l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Guest Email Input */}
        {isGuest && (
          <div className="bdp-email-section">
            <label className="bdp-email-label">📧 Enter your email for payment receipt</label>
            <input
              type="email"
              className="bdp-email-input"
              placeholder="your@email.com"
              value={guestEmail}
              onChange={e => { setGuestEmail(e.target.value); if (error) setError(''); }}
            />
          </div>
        )}

        {/* Trust Note */}
        <p className="bdp-trust-note">
          🔒 Secure payment via <strong>Razorpay</strong> — UPI, Wallets, Netbanking, Cards
        </p>

        {/* Error Message */}
        {error && <p className="bdp-error">{error}</p>}

        {/* CTA Button */}
        <button
          className="bdp-cta-btn"
          onClick={handlePay}
          disabled={loading}
        >
          {loading ? '⏳ Processing…' : `Pay ₹${currentTier.price} to Download Now`}
        </button>
      </div>
    </div>
  );
}
