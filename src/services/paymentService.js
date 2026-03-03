/**
 * Payment service — handles Razorpay order creation, checkout, and verification.
 * All server communication uses encoded payloads.
 */
import { encodePayload } from '../utils/payload';

/* ── Card pricing (₹) ── */
export const CARD_PRICES = {
  birthday:        49,
  anniversary:     49,
  jagrata:         49,
  biodata:         99,
  wedding:         49,
  resume:          79,
  babyshower:      49,
  namingceremony:  49,
  housewarming:    49,
  graduation:      49,
  haldi:           49,
  mehendi:         49,
  sangeet:         49,
  reception:       49,
  savethedate:     49,
  satyanarayan:    49,
  garba:           49,
  visitingcard:    49,
  businessdocs:    79,
  thankyou:        29,
  congratulations: 29,
  goodluck:        29,
  festivalcards:   49,
  holicard:        49,
  whatsappinvites: 29,
  instagramstory:  29,
  socialevent:     29,
  holiwishes:      0,   // free
  'holiwishes-en': 0,   // free
};

/** Card types that are FREE (no watermark, no payment) */
export const FREE_CARDS = new Set([
  'holiwishes', 'holiwishes-en',
]);

/** Check if this card type requires payment */
export function requiresPayment(cardType) {
  return !FREE_CARDS.has(cardType);
}

/** Get price for a card type */
export function getCardPrice(cardType) {
  return CARD_PRICES[cardType] || 49;
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

/** Create a Razorpay order. Returns { orderId, amount, currency, keyId } */
export async function createOrder(email, cardType, cardLabel) {
  const amount = getCardPrice(cardType);
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
 * @param {Function} opts.onSuccess - Called after successful verification
 * @param {Function} opts.onError - Called on failure
 * @returns {Promise<void>}
 */
export async function startPayment({ email, cardType, cardLabel, userName, onSuccess, onError }) {
  try {
    // 1. Check if already paid
    const alreadyPaid = await hasUserPaid(email, cardType);
    if (alreadyPaid) {
      if (onSuccess) onSuccess({ alreadyPaid: true });
      return;
    }

    // 2. Load Razorpay script
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      throw new Error('Failed to load Razorpay. Please check your internet connection.');
    }

    // 3. Create order
    const order = await createOrder(email, cardType, cardLabel);
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
