/**
 * Payments API — verify Razorpay payments & webhook handler.
 *
 * POST /api/payments  { action: 'verify', ... }   — client verification after checkout
 * POST /api/payments  { action: 'webhook', ... }   — Razorpay server webhook (backup)
 * POST /api/payments  { action: 'check', ... }     — check if user paid for a card type
 */
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDb } from '@/lib/mongodb';
import { decodeRequest } from '@/utils/payload';

const RAZORPAY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || RAZORPAY_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';

/** Card types that grant a 24-hour timed unlock after payment */
const TIMED_UNLOCK_CARDS = new Set([]);
const UNLOCK_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

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
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, email, cardType } = body;

        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
          return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
        }

        const valid = verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
        if (!valid) {
          return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
        }

        const key = email.toLowerCase().trim();

        // Build payment record update
        const paymentSet = {
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          status: 'verified',
          verifiedAt: new Date(),
        };

        // For timed-unlock cards, set/refresh the 24-hour window
        if (TIMED_UNLOCK_CARDS.has(cardType)) {
          paymentSet.unlockedUntil = new Date(Date.now() + UNLOCK_DURATION_MS);
        }

        // Update order status
        await db.collection('orders').updateOne(
          { razorpayOrderId },
          { $set: { status: 'paid', razorpayPaymentId, paidAt: new Date() } },
        );

        // Upsert payment record — this is the source of truth for "has user paid"
        await db.collection('payments').updateOne(
          { email: key, cardType },
          {
            $set: paymentSet,
            $setOnInsert: {
              email: key,
              cardType,
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
            },
            $setOnInsert: {
              email: key,
              cardId: cardType,
              requestedAt: new Date(),
            },
          },
          { upsert: true },
        );

        return NextResponse.json({ verified: true });
      }

      /* ── Check if a user has paid for a specific card type ── */
      case 'check': {
        const { email, cardType } = body;
        const key = email.toLowerCase().trim();

        // Super-admin bypasses payment
        if (key === ADMIN_EMAIL.toLowerCase().trim()) {
          return NextResponse.json({ paid: true, unlockedUntil: null });
        }

        if (TIMED_UNLOCK_CARDS.has(cardType)) {
          // For 24-hr unlock cards, first check for active unlock window
          let doc = await db.collection('payments').findOne({
            email: key,
            cardType,
            status: 'verified',
            unlockedUntil: { $gt: new Date() },
          });

          if (doc) {
            return NextResponse.json({
              paid: true,
              unlockedUntil: doc.unlockedUntil?.toISOString() || null,
            });
          }

          // Check for OLD payment without unlockedUntil (paid before 24hr system)
          // Grant them a fresh 24-hour window
          const oldPayment = await db.collection('payments').findOne({
            email: key,
            cardType,
            status: 'verified',
            unlockedUntil: { $exists: false },
          });

          if (oldPayment) {
            const newUnlock = new Date(Date.now() + UNLOCK_DURATION_MS);
            await db.collection('payments').updateOne(
              { _id: oldPayment._id },
              { $set: { unlockedUntil: newUnlock } }
            );
            return NextResponse.json({
              paid: true,
              unlockedUntil: newUnlock.toISOString(),
            });
          }

          // No valid payment found
          return NextResponse.json({ paid: false, unlockedUntil: null });
        }

        // Default: permanent access
        const doc = await db.collection('payments').findOne({
          email: key,
          cardType,
          status: 'verified',
        });
        return NextResponse.json({ paid: !!doc, unlockedUntil: null });
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

      if (email && cardType) {
        // Mark order as paid
        await db.collection('orders').updateOne(
          { razorpayOrderId: orderId },
          { $set: { status: 'paid', razorpayPaymentId: paymentId, paidAt: new Date() } },
        );

        // Build update set — add timed unlock for holi cards
        const webhookSet = {
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          status: 'verified',
          verifiedAt: new Date(),
        };
        if (TIMED_UNLOCK_CARDS.has(cardType)) {
          webhookSet.unlockedUntil = new Date(Date.now() + UNLOCK_DURATION_MS);
        }

        // Upsert payment record
        await db.collection('payments').updateOne(
          { email: email.toLowerCase().trim(), cardType },
          {
            $set: webhookSet,
            $setOnInsert: {
              email: email.toLowerCase().trim(),
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
