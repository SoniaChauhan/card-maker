/**
 * Payment service — handles Razorpay order creation, checkout, and verification.
 * Supports both email and phone as user identifiers.
 * All server communication uses encoded payloads.
 */
import { encodePayload } from '../utils/payload';

/* ── Pricing Tiers (₹) ── */
export const PRICE_WITH_WATERMARK = 19;    // Download with small watermark (7-day access)
export const PRICE_NO_WATERMARK = 49;      // Download without watermark (7-day access)
export const PRICE_FREE = 0;               // Free with full watermark

/* ── Combo Offer ── */
export const COMBO_PRICE = 69;              // ₹69 for any 2 card types
export const COMBO_CARD_COUNT = 2;          // Pick exactly 2 card types
export const COMBO_DURATION_DAYS = 15;      // 15-day unlimited download
export const COMBO_SAVINGS = (PRICE_NO_WATERMARK * 2) - COMBO_PRICE; // ₹29 saved

/* ── Card pricing (base prices - use PRICE_NO_WATERMARK for full removal) ── */
export const CARD_PRICES = {
  birthday:        PRICE_NO_WATERMARK,
  anniversary:     PRICE_NO_WATERMARK,
  jagrata:         PRICE_NO_WATERMARK,
  biodata:         PRICE_NO_WATERMARK,
  wedding:         PRICE_NO_WATERMARK,
  resume:          PRICE_NO_WATERMARK,
  babyshower:      PRICE_NO_WATERMARK,
  namingceremony:  PRICE_NO_WATERMARK,
  housewarming:    PRICE_NO_WATERMARK,
  graduation:      PRICE_NO_WATERMARK,
  haldi:           PRICE_NO_WATERMARK,
  mehendi:         PRICE_NO_WATERMARK,
  sangeet:         PRICE_NO_WATERMARK,
  reception:       PRICE_NO_WATERMARK,
  savethedate:     PRICE_NO_WATERMARK,
  satyanarayan:    PRICE_NO_WATERMARK,
  garba:           PRICE_NO_WATERMARK,
  visitingcard:    PRICE_NO_WATERMARK,
  businessdocs:    PRICE_NO_WATERMARK,
  thankyou:        PRICE_NO_WATERMARK,
  congratulations: PRICE_NO_WATERMARK,
  goodluck:        PRICE_NO_WATERMARK,
  festivalcards:   PRICE_NO_WATERMARK,
  holicard:        PRICE_NO_WATERMARK,
  whatsappinvites: PRICE_NO_WATERMARK,
  instagramstory:  PRICE_NO_WATERMARK,
  socialevent:     PRICE_NO_WATERMARK,
  holiwishes:      0,   // free
  'holiwishes-en': 0,   // free
  'mothers-en':    0,   // free
  'mothers':       0,   // free
};

/** Card types that are FREE (no watermark, no payment) */
export const FREE_CARDS = new Set([
  'holiwishes', 'holiwishes-en',
]);

/** Card types that get 7-day access after payment */
export const SEVEN_DAY_ACCESS_CARDS = new Set([
  'wedding', 'birthday', 'anniversary', 'biodata',
]);

/** Card types that only have ₹49 option (no ₹19 tier) */
export const NO_SMALL_WATERMARK_CARDS = new Set([
  'biodata',
]);

/** Check if this card type requires payment */
export function requiresPayment(cardType) {
  return !FREE_CARDS.has(cardType);
}

/** Check if card type supports ₹19 small watermark tier */
export function hasSmallWatermarkTier(cardType) {
  return !NO_SMALL_WATERMARK_CARDS.has(cardType);
}

/** Get price for a card type (full price without watermark) */
export function getCardPrice(cardType) {
  return CARD_PRICES[cardType] || PRICE_NO_WATERMARK;
}

/** Get price with watermark */
export function getWatermarkPrice() {
  return PRICE_WITH_WATERMARK;
}

/** Get price without watermark */
export function getNoWatermarkPrice() {
  return PRICE_NO_WATERMARK;
}

/* ── API helpers ── */

async function apiOrders(body) {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ _p: encodePayload(body) }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Order creation failed');
  return data;
}

async function apiPayments(body) {
  const res = await fetch('/api/payments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ _p: encodePayload(body) }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Payment request failed');
  return data;
}

/** Check if user has already paid for this card type (by email or phone) — also checks combo packages */
export async function hasUserPaid(email, cardType, phone = '') {
  if (FREE_CARDS.has(cardType)) return true; // free cards are always "paid"
  const data = await apiPayments({ action: 'check', email: email || '', phone: phone || '', cardType });
  return data.paid;
}

/** Get active combo packages for a user. Returns array of { comboCards, expiresAt } */
export async function getUserCombos(email, phone = '') {
  const data = await apiPayments({ action: 'getUserCombos', email: email || '', phone: phone || '' });
  return data.combos || [];
}

/**
 * Get detailed payment/unlock status with tier info.
 * Returns { paid: boolean, unlockedUntil: ISO-string|null, tier: 'premium'|'watermark'|null }
 */
export async function getPaymentStatus(email, cardType, phone = '') {
  if (FREE_CARDS.has(cardType)) return { paid: true, unlockedUntil: null, tier: 'premium' };
  const data = await apiPayments({ action: 'check', email: email || '', phone: phone || '', cardType });
  return {
    paid: !!data.paid,
    unlockedUntil: data.unlockedUntil || null,
    tier: data.tier || null,
    accessExpired: data.accessExpired || false,
  };
}

/**
 * Check if user has active access for a specific tier (by email or phone).
 * Returns { hasAccess: boolean, tier: 'premium'|'watermark'|null, expiresAt: ISO-string|null }
 */
export async function checkUserAccess(email, cardType, phone = '') {
  if (FREE_CARDS.has(cardType)) return { hasAccess: true, tier: 'premium', expiresAt: null };
  const data = await apiPayments({ action: 'checkAccess', email: email || '', phone: phone || '', cardType });
  return {
    hasAccess: data.hasAccess || false,
    tier: data.tier || null,
    expiresAt: data.expiresAt || null,
  };
}

/** Create a Razorpay order. Returns { orderId, amount, currency, keyId } */
export async function createOrder(email, cardType, cardLabel, customAmount = null, phone = '') {
  const amount = customAmount !== null ? customAmount : getCardPrice(cardType);
  return apiOrders({ email: email || '', phone: phone || '', cardType, cardLabel, amount });
}

/** Verify payment after Razorpay checkout */
export async function verifyPayment({ razorpayOrderId, razorpayPaymentId, razorpaySignature, email, phone, cardType, tier, comboCards }) {
  return apiPayments({
    action: 'verify',
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    email: email || '',
    phone: phone || '',
    cardType,
    tier,
    ...(comboCards ? { comboCards } : {}),
  });
}

/**
 * Load Razorpay checkout script if not already loaded.
 * Returns a Promise that resolves when the script is ready.
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Full payment flow — creates order, opens Razorpay popup, verifies payment.
 *
 * @param {Object} opts
 * @param {string} opts.email - User email (can be '' if phone is provided)
 * @param {string} [opts.phone] - User phone (can be '' if email is provided)
 * @param {string} opts.cardType - e.g. 'birthday', 'wedding'
 * @param {string} opts.cardLabel - Display name, e.g. 'Birthday Invitation'
 * @param {string} opts.userName - User's name for prefill
 * @param {number} [opts.amount] - Custom amount (overrides card type price)
 * @param {string} [opts.tier] - 'premium' (₹49) or 'watermark' (₹19)
 * @param {Function} opts.onSuccess - Called after successful verification
 * @param {Function} opts.onError - Called on failure
 * @returns {Promise<void>}
 */
export async function startPayment({ email, phone, cardType, cardLabel, userName, amount, tier, onSuccess, onError }) {
  try {
    // Determine tier from amount if not explicitly set
    const paymentTier = tier || (amount === PRICE_WITH_WATERMARK ? 'watermark' : 'premium');

    // 1. Check if already has access for this tier
    const accessStatus = await checkUserAccess(email || '', cardType, phone || '');
    if (accessStatus.hasAccess) {
      // User already has access
      if (accessStatus.tier === 'premium' || (accessStatus.tier === paymentTier)) {
        if (onSuccess) onSuccess({ alreadyPaid: true, tier: accessStatus.tier, expiresAt: accessStatus.expiresAt });
        return;
      }
      // User has watermark tier but is trying to upgrade to premium - allow
    }

    // 2. Load Razorpay script
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      throw new Error('Failed to load Razorpay. Please check your internet connection.');
    }

    // 3. Create order (with custom amount if provided)
    const order = await createOrder(email || '', cardType, cardLabel, amount, phone || '');
    if (order.alreadyPaid) {
      if (onSuccess) onSuccess({ alreadyPaid: true, tier: order.tier, expiresAt: order.expiresAt });
      return;
    }

    // 4. Open Razorpay checkout
    const options = {
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'CardMaker',
      description: paymentTier === 'watermark'
        ? `${cardLabel} — With Small Watermark (7 Days)`
        : `${cardLabel} — No Watermark (7 Days)`,
      order_id: order.orderId,
      prefill: {
        email: email || '',
        name: userName || '',
        contact: phone || '',
      },
      theme: {
        color: '#667eea',
      },
      handler: async function (response) {
        try {
          // 5. Verify payment with tier info
          const result = await verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            email: email || '',
            phone: phone || '',
            cardType,
            tier: paymentTier,
          });
          if (result.verified) {
            if (onSuccess) onSuccess({ paymentId: response.razorpay_payment_id, tier: paymentTier, expiresAt: result.expiresAt });
          } else {
            throw new Error('Payment verification failed');
          }
        } catch (err) {
          if (onError) onError(err);
        }
      },
      modal: {
        ondismiss: function () {
          // User closed the popup without paying
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      if (onError) onError(new Error(response.error?.description || 'Payment failed'));
    });
    rzp.open();
  } catch (err) {
    if (onError) onError(err);
  }
}

/**
 * Full COMBO payment flow — creates order for 2 card types, opens Razorpay, verifies.
 *
 * @param {Object} opts
 * @param {string} opts.email
 * @param {string} [opts.phone]
 * @param {string[]} opts.comboCards - Array of exactly 2 card type IDs
 * @param {string} opts.userName
 * @param {Function} opts.onSuccess
 * @param {Function} opts.onError
 */
export async function startComboPayment({ email, phone, comboCards, userName, onSuccess, onError }) {
  try {
    if (!comboCards || comboCards.length !== COMBO_CARD_COUNT) {
      throw new Error(`Please select exactly ${COMBO_CARD_COUNT} card types.`);
    }

    // Load Razorpay script
    const loaded = await loadRazorpayScript();
    if (!loaded) throw new Error('Failed to load Razorpay. Please check your internet connection.');

    // Create combo order
    const comboLabel = comboCards.join(' + ');
    const order = await apiOrders({
      email: email || '', phone: phone || '',
      cardType: 'combo',
      cardLabel: `Combo: ${comboLabel}`,
      amount: COMBO_PRICE,
      comboCards,
    });
    if (order.alreadyPaid) {
      if (onSuccess) onSuccess({ alreadyPaid: true, comboCards });
      return;
    }

    // Open Razorpay checkout
    const options = {
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'CardMaker',
      description: `Combo Pack — ${comboLabel} — 15 Days Unlimited`,
      order_id: order.orderId,
      prefill: { email: email || '', name: userName || '', contact: phone || '' },
      theme: { color: '#f97316' },
      handler: async function (response) {
        try {
          const result = await verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            email: email || '', phone: phone || '',
            cardType: 'combo',
            tier: 'combo',
            comboCards,
          });
          if (result.verified) {
            if (onSuccess) onSuccess({ paymentId: response.razorpay_payment_id, comboCards, expiresAt: result.expiresAt });
          } else {
            throw new Error('Payment verification failed');
          }
        } catch (err) {
          if (onError) onError(err);
        }
      },
      modal: { ondismiss: function () {} },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) {
      if (onError) onError(new Error(response.error?.description || 'Payment failed'));
    });
    rzp.open();
  } catch (err) {
    if (onError) onError(err);
  }
}

/**
 * Send download link to user's email after successful download.
 * @param {Object} opts
 * @param {string} opts.email - User email
 * @param {string} opts.cardType - Card type (wedding, birthday, etc.)
 * @param {string} opts.cardLabel - Display name
 * @param {string} opts.downloadId - Download history ID for the link
 */
export async function sendDownloadEmail({ email, cardType, cardLabel, downloadId }) {
  try {
    const res = await fetch('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _p: encodePayload({
          action: 'sendDownloadLink',
          toEmail: email,
          cardType,
          cardLabel,
          downloadId,
        }),
      }),
    });
    const data = await res.json();
    return data.ok || false;
  } catch (err) {
    console.error('Failed to send download email:', err);
    return false;
  }
}

/* ── OTP helpers ── */

async function apiOtp(body) {
  const res = await fetch('/api/otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ _p: encodePayload(body) }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'OTP request failed');
  return data;
}

/** Send OTP to email or phone. channel = 'email' | 'phone' */
export async function sendOTP(channel, target) {
  return apiOtp({ action: 'send', channel, target });
}

/** Verify OTP. Returns { verified: boolean } */
export async function verifyOTP(channel, target, otp) {
  return apiOtp({ action: 'verify', channel, target, otp });
}
