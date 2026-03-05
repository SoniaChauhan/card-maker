/**
 * Payments API — verify Razorpay payments & webhook handler.
 *
 * POST /api/payments  { action: 'verify', ... }   — client verification after checkout
 * POST /api/payments  { action: 'webhook', ... }   — Razorpay server webhook (backup)
 * POST /api/payments  { action: 'check', ... }     — check if user paid for a card type
 * POST /api/payments  { action: 'checkAccess', ... } — check if user has active access
 *
 * Supports both email and phone as user identifiers.
 */
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDb } from '@/lib/mongodb';
import { decodeRequest } from '@/utils/payload';

const RAZORPAY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || RAZORPAY_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';

/** Card types that grant 7-day timed unlock after payment */
const SEVEN_DAY_ACCESS_CARDS = new Set(['wedding', 'birthday', 'anniversary', 'biodata']);
const UNLOCK_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/** Normalize phone: strip non-digits, keep last 10 digits */
function normalizePhone(phone) {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}

/**
 * Build a MongoDB query filter to find a payment record by email or phone.
 * Supports looking up by either identifier so mobile-only users work.
 */
function userFilter(email, phone) {
  const conditions = [];
  if (email) conditions.push({ email });
  if (phone) conditions.push({ phone });
  if (conditions.length === 0) return null;
  return conditions.length === 1 ? conditions[0] : { $or: conditions };
}

/**
 * Verify Razorpay payment signature.
 * Razorpay signs: orderId + '|' + paymentId using the key_secret.
 */
function verifySignature(orderId, paymentId, signature) {
  const body = orderId + '|' + paymentId;
  const expected = crypto
    .createHmac('sha256', RAZORPAY_SECRET)
    .update(body)
    .digest('hex');
  return expected === signature;
}

/**
 * Recovery helper — checks the orders collection for a paid order that
 * never got a corresponding payment record (e.g. due to a previous bug).
 * If found, creates the payment record and returns the recovered doc info.
 * Returns null if nothing to recover.
 */
async function recoverPaymentFromOrder(db, email, phone, cardType) {
  try {
    const filter = userFilter(email, phone);
    if (!filter) return null;
    const paidOrder = await db.collection('orders').findOne({
      ...filter,
      cardType,
      status: 'paid',
    });
    if (!paidOrder) return null;

    // Order exists and is paid — create the missing payment record
    const tier = 'premium'; // default to premium for recovered payments
    const expiresAt = new Date(
      Math.max(
        Date.now(),
        (paidOrder.paidAt ? paidOrder.paidAt.getTime() : Date.now()) + UNLOCK_DURATION_MS,
      ),
    );

    // Build the upsert filter — use whichever identifier we have
    const upsertFilter = { cardType, tier };
    if (email) upsertFilter.email = email;
    else if (phone) upsertFilter.phone = phone;

    await db.collection('payments').updateOne(
      upsertFilter,
      {
        $set: {
          razorpayOrderId: paidOrder.razorpayOrderId,
          razorpayPaymentId: paidOrder.razorpayPaymentId || 'recovered',
          status: 'verified',
          verifiedAt: new Date(),
          tier,
          ...(email ? { email } : {}),
          ...(phone ? { phone } : {}),
          ...(SEVEN_DAY_ACCESS_CARDS.has(cardType) ? { unlockedUntil: expiresAt } : {}),
        },
        $setOnInsert: {
          cardType,
          createdAt: paidOrder.createdAt || new Date(),
        },
      },
      { upsert: true },
    );

    // Also update subscriptions for backward compat
    const subFilter = { cardId: cardType };
    if (email) subFilter.email = email;
    else if (phone) subFilter.phone = phone;

    await db.collection('subscriptions').updateOne(
      subFilter,
      {
        $set: {
          status: 'approved',
          txnId: paidOrder.razorpayPaymentId || 'recovered',
          approvedAt: new Date(),
          tier,
          expiresAt: SEVEN_DAY_ACCESS_CARDS.has(cardType) ? expiresAt : null,
          ...(email ? { email } : {}),
          ...(phone ? { phone } : {}),
        },
        $setOnInsert: {
          cardId: cardType,
          requestedAt: new Date(),
        },
      },
      { upsert: true },
    );

    return { tier, unlockedUntil: expiresAt };
  } catch (err) {
    console.error('Payment recovery error:', err);
    return null;
  }
}

export async function POST(req) {
  try {
    // Check if this is a Razorpay webhook (raw body, special header)
    const webhookSig = req.headers.get('x-razorpay-signature');
    if (webhookSig) {
      return handleWebhook(req, webhookSig);
    }

    const body = await decodeRequest(req);
    const { action } = body;
    const db = await getDb();

    switch (action) {
      /* ── Verify payment after Razorpay checkout ── */
      case 'verify': {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, email, phone, cardType, tier } = body;

        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
          return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
        }

        const valid = verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
        if (!valid) {
          return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
        }

        const emailKey = email ? email.toLowerCase().trim() : '';
        const phoneKey = phone ? normalizePhone(phone) : '';
        const paymentTier = tier || 'premium';
        const expiresAt = new Date(Date.now() + UNLOCK_DURATION_MS);

        // Build payment record update
        const paymentSet = {
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          status: 'verified',
          verifiedAt: new Date(),
          tier: paymentTier,
        };
        if (emailKey) paymentSet.email = emailKey;
        if (phoneKey) paymentSet.phone = phoneKey;

        // Set/refresh the 7-day window for these card types
        if (SEVEN_DAY_ACCESS_CARDS.has(cardType)) {
          paymentSet.unlockedUntil = expiresAt;
        }

        // Update order status
        await db.collection('orders').updateOne(
          { razorpayOrderId },
          { $set: { status: 'paid', razorpayPaymentId, paidAt: new Date() } },
        );

        // Build the upsert filter — use email if available, else phone
        const upsertFilter = { cardType, tier: paymentTier };
        if (emailKey) upsertFilter.email = emailKey;
        else if (phoneKey) upsertFilter.phone = phoneKey;

        // Upsert payment record — source of truth for "has user paid"
        // NOTE: Do NOT put tier/email/phone in $setOnInsert when they're already in $set
        await db.collection('payments').updateOne(
          upsertFilter,
          {
            $set: paymentSet,
            $setOnInsert: {
              cardType,
              createdAt: new Date(),
            },
          },
          { upsert: true },
        );

        // Also update legacy subscriptions collection for backward compat
        const subFilter = { cardId: cardType };
        if (emailKey) subFilter.email = emailKey;
        else if (phoneKey) subFilter.phone = phoneKey;

        await db.collection('subscriptions').updateOne(
          subFilter,
          {
            $set: {
              status: 'approved',
              txnId: razorpayPaymentId,
              approvedAt: new Date(),
              tier: paymentTier,
              expiresAt: SEVEN_DAY_ACCESS_CARDS.has(cardType) ? expiresAt : null,
              ...(emailKey ? { email: emailKey } : {}),
              ...(phoneKey ? { phone: phoneKey } : {}),
            },
            $setOnInsert: {
              cardId: cardType,
              requestedAt: new Date(),
            },
          },
          { upsert: true },
        );

        return NextResponse.json({ verified: true, expiresAt: expiresAt.toISOString() });
      }

      /* ── Check if a user has paid for a specific card type ── */
      case 'check': {
        const { email, phone, cardType } = body;
        const emailKey = email ? email.toLowerCase().trim() : '';
        const phoneKey = phone ? normalizePhone(phone) : '';
        const uf = userFilter(emailKey, phoneKey);

        if (!uf || !cardType) {
          return NextResponse.json({ paid: false, unlockedUntil: null, tier: null });
        }

        // Super-admin bypasses payment
        if (emailKey && emailKey === ADMIN_EMAIL.toLowerCase().trim()) {
          return NextResponse.json({ paid: true, unlockedUntil: null, tier: 'premium' });
        }

        if (SEVEN_DAY_ACCESS_CARDS.has(cardType)) {
          // For 7-day unlock cards, check for active unlock window
          // Check premium tier first (₹49)
          let doc = await db.collection('payments').findOne({
            ...uf,
            cardType,
            status: 'verified',
            tier: 'premium',
            unlockedUntil: { $gt: new Date() },
          });

          if (doc) {
            return NextResponse.json({
              paid: true,
              unlockedUntil: doc.unlockedUntil?.toISOString() || null,
              tier: 'premium',
            });
          }

          // Check watermark tier (₹19)
          doc = await db.collection('payments').findOne({
            ...uf,
            cardType,
            status: 'verified',
            tier: 'watermark',
            unlockedUntil: { $gt: new Date() },
          });

          if (doc) {
            return NextResponse.json({
              paid: true,
              unlockedUntil: doc.unlockedUntil?.toISOString() || null,
              tier: 'watermark',
            });
          }

          // Check for OLD payment without tier or unlockedUntil (paid before new system)
          const oldPayment = await db.collection('payments').findOne({
            ...uf,
            cardType,
            status: 'verified',
            $or: [
              { tier: { $exists: false } },
              { unlockedUntil: { $exists: false } },
            ],
          });

          if (oldPayment) {
            const newUnlock = new Date(Date.now() + UNLOCK_DURATION_MS);
            await db.collection('payments').updateOne(
              { _id: oldPayment._id },
              { $set: { unlockedUntil: newUnlock, tier: 'premium' } }
            );
            return NextResponse.json({
              paid: true,
              unlockedUntil: newUnlock.toISOString(),
              tier: 'premium',
            });
          }

          // No valid payment found — check if expired
          const expiredPayment = await db.collection('payments').findOne({
            ...uf,
            cardType,
            status: 'verified',
          });

          if (expiredPayment) {
            return NextResponse.json({
              paid: false,
              unlockedUntil: null,
              tier: null,
              accessExpired: true,
            });
          }

          // Last resort: recover from paid orders that never got a payment record
          const recovered = await recoverPaymentFromOrder(db, emailKey, phoneKey, cardType);
          if (recovered) {
            return NextResponse.json({
              paid: true,
              unlockedUntil: recovered.unlockedUntil?.toISOString() || null,
              tier: recovered.tier || 'premium',
            });
          }

          return NextResponse.json({ paid: false, unlockedUntil: null, tier: null });
        }

        // Default: permanent access (non-7-day cards)
        const doc = await db.collection('payments').findOne({
          ...uf,
          cardType,
          status: 'verified',
        });
        return NextResponse.json({
          paid: !!doc,
          unlockedUntil: null,
          tier: doc?.tier || (doc ? 'premium' : null),
        });
      }

      /* ── Check if user has active access for a card type ── */
      case 'checkAccess': {
        const { email, phone, cardType } = body;
        const emailKey = email ? email.toLowerCase().trim() : '';
        const phoneKey = phone ? normalizePhone(phone) : '';
        const uf = userFilter(emailKey, phoneKey);

        if (!uf || !cardType) {
          return NextResponse.json({ hasAccess: false, tier: null, expiresAt: null });
        }

        // Super-admin bypasses payment
        if (emailKey && emailKey === ADMIN_EMAIL.toLowerCase().trim()) {
          return NextResponse.json({ hasAccess: true, tier: 'premium', expiresAt: null });
        }

        if (SEVEN_DAY_ACCESS_CARDS.has(cardType)) {
          // Check premium tier first
          let doc = await db.collection('payments').findOne({
            ...uf,
            cardType,
            status: 'verified',
            tier: 'premium',
            unlockedUntil: { $gt: new Date() },
          });

          if (doc) {
            return NextResponse.json({
              hasAccess: true,
              tier: 'premium',
              expiresAt: doc.unlockedUntil?.toISOString() || null,
            });
          }

          // Check watermark tier
          doc = await db.collection('payments').findOne({
            ...uf,
            cardType,
            status: 'verified',
            tier: 'watermark',
            unlockedUntil: { $gt: new Date() },
          });

          if (doc) {
            return NextResponse.json({
              hasAccess: true,
              tier: 'watermark',
              expiresAt: doc.unlockedUntil?.toISOString() || null,
            });
          }

          // Check for old payments without proper tier/expiry
          const oldPayment = await db.collection('payments').findOne({
            ...uf,
            cardType,
            status: 'verified',
            $or: [
              { tier: { $exists: false } },
              { unlockedUntil: { $exists: false } },
            ],
          });

          if (oldPayment) {
            const newUnlock = new Date(Date.now() + UNLOCK_DURATION_MS);
            await db.collection('payments').updateOne(
              { _id: oldPayment._id },
              { $set: { unlockedUntil: newUnlock, tier: 'premium' } }
            );
            return NextResponse.json({
              hasAccess: true,
              tier: 'premium',
              expiresAt: newUnlock.toISOString(),
            });
          }

          // Last resort: recover from paid orders
          const recovered = await recoverPaymentFromOrder(db, emailKey, phoneKey, cardType);
          if (recovered) {
            return NextResponse.json({
              hasAccess: true,
              tier: recovered.tier || 'premium',
              expiresAt: recovered.unlockedUntil?.toISOString() || null,
            });
          }

          return NextResponse.json({ hasAccess: false, tier: null, expiresAt: null });
        }

        // Non-7-day cards: check for any verified payment
        const doc = await db.collection('payments').findOne({
          ...uf,
          cardType,
          status: 'verified',
        });

        return NextResponse.json({
          hasAccess: !!doc,
          tier: doc?.tier || (doc ? 'premium' : null),
          expiresAt: null,
        });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (err) {
    console.error('Payments API error:', err);
    return NextResponse.json(
      { error: err.message || 'Payment processing failed' },
      { status: 500 },
    );
  }
}

/**
 * Handle Razorpay webhook events — backup verification.
 * Razorpay sends payment.captured, payment.failed, etc.
 */
async function handleWebhook(req, signature) {
  try {
    const rawBody = await req.text();

    // Verify webhook signature
    const expected = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    if (expected !== signature) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const db = await getDb();

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;
      const email = payment.notes?.email ? payment.notes.email.toLowerCase().trim() : '';
      const phone = payment.notes?.phone ? normalizePhone(payment.notes.phone) : '';
      const cardType = payment.notes?.cardType;
      const tier = payment.notes?.tier || 'premium';

      if ((email || phone) && cardType) {
        // Mark order as paid
        await db.collection('orders').updateOne(
          { razorpayOrderId: orderId },
          { $set: { status: 'paid', razorpayPaymentId: paymentId, paidAt: new Date() } },
        );

        // Build update set — add 7-day unlock for applicable cards
        const webhookSet = {
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          status: 'verified',
          verifiedAt: new Date(),
          tier,
        };
        if (email) webhookSet.email = email;
        if (phone) webhookSet.phone = phone;
        if (SEVEN_DAY_ACCESS_CARDS.has(cardType)) {
          webhookSet.unlockedUntil = new Date(Date.now() + UNLOCK_DURATION_MS);
        }

        // Build upsert filter — email if available, else phone
        const upsertFilter = { cardType, tier };
        if (email) upsertFilter.email = email;
        else if (phone) upsertFilter.phone = phone;

        // Upsert payment record with tier
        // NOTE: Do NOT put tier/email/phone in $setOnInsert — they're in $set
        await db.collection('payments').updateOne(
          upsertFilter,
          {
            $set: webhookSet,
            $setOnInsert: {
              cardType,
              createdAt: new Date(),
            },
          },
          { upsert: true },
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
