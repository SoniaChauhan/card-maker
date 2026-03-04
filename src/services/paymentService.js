/**
 * Payment service — handles Razorpay order creation, checkout, and verification.
 * All server communication uses encoded payloads.
 */
import { encodePayload } from '../utils/payload';

/* ── Pricing Tiers (₹) ── */
export const PRICE_WITH_WATERMARK = 19;    // Download with small watermark
export const PRICE_NO_WATERMARK = 49;      // Download without watermark

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

/** Card types that unlock for 24 hours after one payment */
export const TIMED_UNLOCK_CARDS = new Set([]);

/** Check if this card type requires payment */
export function requiresPayment(cardType) {
  return !FREE_CARDS.has(cardType);
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

/** Check if user has already paid for this card type */
export async function hasUserPaid(email, cardType) {
  if (FREE_CARDS.has(cardType)) return true; // free cards are always "paid"
  const data = await apiPayments({ action: 'check', email, cardType });
  return data.paid;
}

/**
 * Get detailed payment/unlock status.
 * Returns { paid: boolean, unlockedUntil: ISO-string|null }
 * For 24-hr unlock cards, `paid` is false once the window expires.
 */
export async function getPaymentStatus(email, cardType) {
  if (FREE_CARDS.has(cardType)) return { paid: true, unlockedUntil: null };
  const data = await apiPayments({ action: 'check', email, cardType });
  return { paid: !!data.paid, unlockedUntil: data.unlockedUntil || null };
}

/** Create a Razorpay order. Returns { orderId, amount, currency, keyId } */
export async function createOrder(email, cardType, cardLabel, customAmount = null) {
  const amount = customAmount !== null ? customAmount : getCardPrice(cardType);
  return apiOrders({ email, cardType, cardLabel, amount });
}

/** Verify payment after Razorpay checkout */
export async function verifyPayment({ razorpayOrderId, razorpayPaymentId, razorpaySignature, email, cardType }) {
  return apiPayments({
    action: 'verify',
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    email,
    cardType,
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
 * @param {string} opts.email - User email
 * @param {string} opts.cardType - e.g. 'birthday', 'wedding'
 * @param {string} opts.cardLabel - Display name, e.g. 'Birthday Invitation'
 * @param {string} opts.userName - User's name for prefill
 * @param {number} [opts.amount] - Custom amount (overrides card type price)
 * @param {Function} opts.onSuccess - Called after successful verification
 * @param {Function} opts.onError - Called on failure
 * @returns {Promise<void>}
 */
export async function startPayment({ email, cardType, cardLabel, userName, amount, onSuccess, onError }) {
  try {
    // 1. Check if already paid (skip for watermark tier - let them pay for upgrade)
    if (!amount || amount >= PRICE_NO_WATERMARK) {
      const alreadyPaid = await hasUserPaid(email, cardType);
      if (alreadyPaid) {
        if (onSuccess) onSuccess({ alreadyPaid: true });
        return;
      }
    }

    // 2. Load Razorpay script
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      throw new Error('Failed to load Razorpay. Please check your internet connection.');
    }

    // 3. Create order (with custom amount if provided)
    const order = await createOrder(email, cardType, cardLabel, amount);
    if (order.alreadyPaid) {
      if (onSuccess) onSuccess({ alreadyPaid: true });
      return;
    }

    // 4. Open Razorpay checkout
    const options = {
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'CardMaker',
      description: `${cardLabel} — Watermark-free Download`,
      order_id: order.orderId,
      prefill: {
        email,
        name: userName || '',
      },
      theme: {
        color: '#667eea',
      },
      handler: async function (response) {
        try {
          // 5. Verify payment
          const result = await verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            email,
            cardType,
          });
          if (result.verified) {
            if (onSuccess) onSuccess({ paymentId: response.razorpay_payment_id });
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
