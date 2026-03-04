/**
 * Payments API — verify Razorpay payments & webhook handler.
 *
 * POST /api/payments  { action: 'verify', ... }   — client verification after checkout
 * POST /api/payments  { action: 'webhook', ... }   — Razorpay server webhook (backup)
 * POST /api/payments  { action: 'check', ... }     — check if user paid for a card type
 * POST /api/payments  { action: 'checkAccess', ... } — check if user has active access
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
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, email, cardType, tier } = body;

        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
          return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
        }

        const valid = verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
        if (!valid) {
          return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
        }

        const key = email.toLowerCase().trim();
        const paymentTier = tier || 'premium'; // 'premium' = ₹49, 'watermark' = ₹19
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

        // Set/refresh the 7-day window for these card types
        if (SEVEN_DAY_ACCESS_CARDS.has(cardType)) {
          paymentSet.unlockedUntil = expiresAt;
        }

        // Update order status
        await db.collection('orders').updateOne(
          { razorpayOrderId },
          { $set: { status: 'paid', razorpayPaymentId, paidAt: new Date() } },
        );

        // Upsert payment record — this is the source of truth for "has user paid"
        // Use tier + cardType as unique key so user can have both tiers
        await db.collection('payments').updateOne(
          { email: key, cardType, tier: paymentTier },
          {
            $set: paymentSet,
            $setOnInsert: {
              email: key,
              cardType,
              tier: paymentTier,
              createdAt: new Date(),
            },
          },
          { upsert: true },
        );

        // Also update legacy subscriptions collection for backward compat
        await db.collection('subscriptions').updateOne(
          { email: key, cardId: cardType },
          {
            $set: {
              status: 'approved',
              txnId: razorpayPaymentId,
              approvedAt: new Date(),
              tier: paymentTier,
              expiresAt: SEVEN_DAY_ACCESS_CARDS.has(cardType) ? expiresAt : null,
            },
            $setOnInsert: {
              email: key,
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
        const { email, cardType } = body;
        const key = email.toLowerCase().trim();

        // Super-admin bypasses payment
        if (key === ADMIN_EMAIL.toLowerCase().trim()) {
          return NextResponse.json({ paid: true, unlockedUntil: null, tier: 'premium' });
        }

        if (SEVEN_DAY_ACCESS_CARDS.has(cardType)) {
          // For 7-day unlock cards, check for active unlock window
          // First check for premium tier (₹49)
          let doc = await db.collection('payments').findOne({
            email: key,
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

          // Check for watermark tier (₹19)
          doc = await db.collection('payments').findOne({
            email: key,
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
          // Grant them a fresh 7-day premium window
          const oldPayment = await db.collection('payments').findOne({
            email: key,
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

          // No valid payment found - check if expired
          const expiredPayment = await db.collection('payments').findOne({
            email: key,
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

          return NextResponse.json({ paid: false, unlockedUntil: null, tier: null });
        }

        // Default: permanent access (non-7-day cards)
        const doc = await db.collection('payments').findOne({
          email: key,
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
        const { email, cardType } = body;
        if (!email || !cardType) {
          return NextResponse.json({ hasAccess: false, tier: null, expiresAt: null });
        }
        const key = email.toLowerCase().trim();

        // Super-admin bypasses payment
        if (key === ADMIN_EMAIL.toLowerCase().trim()) {
          return NextResponse.json({ hasAccess: true, tier: 'premium', expiresAt: null });
        }

        if (SEVEN_DAY_ACCESS_CARDS.has(cardType)) {
          // Check premium tier first
          let doc = await db.collection('payments').findOne({
            email: key,
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
            email: key,
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
            email: key,
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

          return NextResponse.json({ hasAccess: false, tier: null, expiresAt: null });
        }

        // Non-7-day cards: check for any verified payment
        const doc = await db.collection('payments').findOne({
          email: key,
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
      const email = payment.notes?.email;
      const cardType = payment.notes?.cardType;
      const tier = payment.notes?.tier || 'premium';

      if (email && cardType) {
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
          tier: tier,
        };
        if (SEVEN_DAY_ACCESS_CARDS.has(cardType)) {
          webhookSet.unlockedUntil = new Date(Date.now() + UNLOCK_DURATION_MS);
        }

        // Upsert payment record with tier
        await db.collection('payments').updateOne(
          { email: email.toLowerCase().trim(), cardType, tier },
          {
            $set: webhookSet,
            $setOnInsert: {
              email: email.toLowerCase().trim(),
              cardType,
              tier,
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
