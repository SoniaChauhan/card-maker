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

/** Support multiple admin emails (comma-separated in env var) */
const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAIL || '').split(',').map(e => e.toLowerCase().trim()).filter(Boolean)
);
function isAdminEmail(email) {
  return !!email && ADMIN_EMAILS.has(email.toLowerCase().trim());
}

/** All paid cards now get 7-day timed unlock after payment */
// (Previously only a whitelist — now every non-free card is 7-day)
const UNLOCK_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/** Combo offer — 15-day access for 2 card types */
const COMBO_UNLOCK_DURATION_MS = 15 * 24 * 60 * 60 * 1000; // 15 days

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
          unlockedUntil: expiresAt,
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
          expiresAt: expiresAt,
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
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, email, phone, cardType, tier, comboCards } = body;

        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
          return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
        }

        const valid = verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
        if (!valid) {
          return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
        }

        const emailKey = email ? email.toLowerCase().trim() : '';
        const phoneKey = phone ? normalizePhone(phone) : '';

        // ── COMBO payment ──
        if (cardType === 'combo' && Array.isArray(comboCards) && comboCards.length === 2) {
          const sortedCombo = [...comboCards].sort();
          const comboExpiry = new Date(Date.now() + COMBO_UNLOCK_DURATION_MS);

          const comboSet = {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            status: 'verified',
            verifiedAt: new Date(),
            tier: 'combo',
            comboCards: sortedCombo,
            unlockedUntil: comboExpiry,
          };
          if (emailKey) comboSet.email = emailKey;
          if (phoneKey) comboSet.phone = phoneKey;

          // Update order status
          await db.collection('orders').updateOne(
            { razorpayOrderId },
            { $set: { status: 'paid', razorpayPaymentId, paidAt: new Date() } },
          );

          // Upsert combo payment record
          const comboFilter = { cardType: 'combo', comboCards: sortedCombo };
          if (emailKey) comboFilter.email = emailKey;
          else if (phoneKey) comboFilter.phone = phoneKey;

          await db.collection('payments').updateOne(
            comboFilter,
            {
              $set: comboSet,
              $setOnInsert: { cardType: 'combo', createdAt: new Date() },
            },
            { upsert: true },
          );

          return NextResponse.json({ verified: true, expiresAt: comboExpiry.toISOString(), comboCards: sortedCombo });
        }

        // ── Standard (non-combo) payment ──
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

        // All paid cards get 7-day unlimited download window
        paymentSet.unlockedUntil = expiresAt;

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
              expiresAt: expiresAt,
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
        if (isAdminEmail(emailKey)) {
          return NextResponse.json({ paid: true, unlockedUntil: null, tier: 'premium' });
        }

        // ── Check for active COMBO package that includes this card type ──
        const comboDoc = await db.collection('payments').findOne({
          ...uf,
          cardType: 'combo',
          comboCards: cardType,
          status: 'verified',
          unlockedUntil: { $gt: new Date() },
        });
        if (comboDoc) {
          return NextResponse.json({
            paid: true,
            unlockedUntil: comboDoc.unlockedUntil?.toISOString() || null,
            tier: 'combo',
            comboCards: comboDoc.comboCards,
          });
        }

        // All paid cards — check for active 7-day unlock window
        // Check premium tier first (₹49)
        {
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
        if (isAdminEmail(emailKey)) {
          return NextResponse.json({ hasAccess: true, tier: 'premium', expiresAt: null });
        }

        // ── Check for active COMBO package that includes this card type ──
        const comboAccessDoc = await db.collection('payments').findOne({
          ...uf,
          cardType: 'combo',
          comboCards: cardType,
          status: 'verified',
          unlockedUntil: { $gt: new Date() },
        });
        if (comboAccessDoc) {
          return NextResponse.json({
            hasAccess: true,
            tier: 'combo',
            expiresAt: comboAccessDoc.unlockedUntil?.toISOString() || null,
            comboCards: comboAccessDoc.comboCards,
          });
        }

        // All paid cards — check for active 7-day unlock window
        {
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
      }

      /* ── Admin: Link a phone number to existing email-based payment records ── */
      case 'linkPhone': {
        const { email, phone, cardType, adminEmail } = body;
        const emailKey = email ? email.toLowerCase().trim() : '';
        const phoneKey = phone ? normalizePhone(phone) : '';

        if (!emailKey || !phoneKey) {
          return NextResponse.json({ error: 'Both email and phone are required' }, { status: 400 });
        }
        // Only super-admin can link
        if (!isAdminEmail(adminEmail)) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const filter = { email: emailKey };
        if (cardType) filter.cardType = cardType;

        const result = await db.collection('payments').updateMany(
          filter,
          { $set: { phone: phoneKey } },
        );

        // Also update subscriptions
        const subFilter = { email: emailKey };
        if (cardType) subFilter.cardId = cardType;
        await db.collection('subscriptions').updateMany(subFilter, { $set: { phone: phoneKey } });

        // Also update orders
        const orderFilter = { email: emailKey };
        if (cardType) orderFilter.cardType = cardType;
        await db.collection('orders').updateMany(orderFilter, { $set: { phone: phoneKey } });

        return NextResponse.json({
          ok: true,
          matched: result.matchedCount,
          modified: result.modifiedCount,
          message: `Linked phone ${phoneKey} to ${emailKey} — ${result.modifiedCount} payment(s) updated`,
        });
      }

      /* ── Admin: Search payment records by email or phone ── */
      case 'searchPayments': {
        const { email, phone, adminEmail } = body;
        const emailKey = email ? email.toLowerCase().trim() : '';
        const phoneKey = phone ? normalizePhone(phone) : '';

        if (!isAdminEmail(adminEmail)) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        if (!emailKey && !phoneKey) {
          return NextResponse.json({ error: 'Provide email or phone' }, { status: 400 });
        }

        // Build flexible filter — exact match + regex fallback for email
        const conditions = [];
        if (emailKey) {
          conditions.push({ email: emailKey });
          conditions.push({ email: { $regex: emailKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } });
        }
        if (phoneKey) {
          conditions.push({ phone: phoneKey });
          // Also try matching last 10 digits at end of phone field
          conditions.push({ phone: { $regex: phoneKey.slice(-10) + '$' } });
        }
        const searchFilter = { $or: conditions };

        // Search across ALL three collections
        const [payments, orders, subscriptions] = await Promise.all([
          db.collection('payments').find(searchFilter).sort({ verifiedAt: -1 }).limit(50).toArray(),
          db.collection('orders').find(searchFilter).sort({ createdAt: -1 }).limit(50).toArray(),
          db.collection('subscriptions').find(searchFilter).sort({ approvedAt: -1 }).limit(50).toArray(),
        ]);

        const toDate = (v) => v instanceof Date ? v.toISOString() : v ? String(v) : null;

        const mapped = [
          ...payments.map(p => ({
            id: p._id.toString(), source: 'payments',
            email: p.email || '', phone: p.phone || '',
            cardType: p.cardType || '', tier: p.tier || '',
            status: p.status || '',
            unlockedUntil: toDate(p.unlockedUntil),
            verifiedAt: toDate(p.verifiedAt),
            createdAt: toDate(p.createdAt),
            razorpayPaymentId: p.razorpayPaymentId || '',
          })),
          ...orders.map(o => ({
            id: o._id.toString(), source: 'orders',
            email: o.email || '', phone: o.phone || '',
            cardType: o.cardType || '', tier: o.tier || '',
            status: o.status || '',
            unlockedUntil: null,
            verifiedAt: toDate(o.paidAt),
            createdAt: toDate(o.createdAt),
            razorpayPaymentId: o.razorpayPaymentId || o.razorpayOrderId || '',
          })),
          ...subscriptions.map(s => ({
            id: s._id.toString(), source: 'subscriptions',
            email: s.email || '', phone: s.phone || '',
            cardType: s.cardId || s.cardType || '', tier: s.tier || '',
            status: s.status || '',
            unlockedUntil: toDate(s.expiresAt),
            verifiedAt: toDate(s.approvedAt),
            createdAt: toDate(s.requestedAt || s.createdAt),
            razorpayPaymentId: s.txnId || '',
          })),
        ];

        return NextResponse.json({ payments: mapped });
      }

      /* ── Admin: Manually grant access to a user by email or phone ── */
      case 'grantAccess': {
        const { email, phone, cardType, tier, adminEmail } = body;
        const emailKey = email ? email.toLowerCase().trim() : '';
        const phoneKey = phone ? normalizePhone(phone) : '';

        if (!isAdminEmail(adminEmail)) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }
        if (!cardType) {
          return NextResponse.json({ error: 'cardType is required' }, { status: 400 });
        }
        if (!emailKey && !phoneKey) {
          return NextResponse.json({ error: 'Provide email or phone' }, { status: 400 });
        }

        const grantTier = tier || 'premium';
        const expiresAt = new Date(Date.now() + UNLOCK_DURATION_MS);

        const paymentSet = {
          status: 'verified',
          verifiedAt: new Date(),
          tier: grantTier,
          razorpayPaymentId: 'admin-granted',
          razorpayOrderId: 'admin-granted',
        };
        if (emailKey) paymentSet.email = emailKey;
        if (phoneKey) paymentSet.phone = phoneKey;
        paymentSet.unlockedUntil = expiresAt;

        const upsertFilter = { cardType, tier: grantTier };
        if (emailKey) upsertFilter.email = emailKey;
        else if (phoneKey) upsertFilter.phone = phoneKey;

        await db.collection('payments').updateOne(
          upsertFilter,
          {
            $set: paymentSet,
            $setOnInsert: { cardType, createdAt: new Date() },
          },
          { upsert: true },
        );

        return NextResponse.json({
          ok: true,
          message: `Granted ${grantTier} access for ${cardType} to ${emailKey || phoneKey} until ${expiresAt.toISOString()}`,
          expiresAt: expiresAt.toISOString(),
        });
      }

      /* ── Get active combo packages for a user ── */
      case 'getUserCombos': {
        const { email, phone } = body;
        const emailKey = email ? email.toLowerCase().trim() : '';
        const phoneKey = phone ? normalizePhone(phone) : '';
        const uf = userFilter(emailKey, phoneKey);
        if (!uf) return NextResponse.json({ combos: [] });

        const docs = await db.collection('payments').find({
          ...uf,
          cardType: 'combo',
          status: 'verified',
          unlockedUntil: { $gt: new Date() },
        }).toArray();

        const combos = docs.map(d => ({
          comboCards: d.comboCards || [],
          expiresAt: d.unlockedUntil?.toISOString() || null,
          tier: 'combo',
        }));

        return NextResponse.json({ combos });
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

        // ── COMBO webhook ──
        if (cardType === 'combo' && payment.notes?.comboCards) {
          const comboCards = payment.notes.comboCards.split(',').sort();
          const comboExpiry = new Date(Date.now() + COMBO_UNLOCK_DURATION_MS);
          const comboFilter = { cardType: 'combo', comboCards };
          if (email) comboFilter.email = email;
          else if (phone) comboFilter.phone = phone;
          const comboWebhookSet = {
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
            status: 'verified',
            verifiedAt: new Date(),
            tier: 'combo',
            comboCards,
            unlockedUntil: comboExpiry,
          };
          if (email) comboWebhookSet.email = email;
          if (phone) comboWebhookSet.phone = phone;
          await db.collection('payments').updateOne(
            comboFilter,
            { $set: comboWebhookSet, $setOnInsert: { cardType: 'combo', createdAt: new Date() } },
            { upsert: true },
          );
        } else {
          // ── Standard webhook ──
          const webhookSet = {
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
            status: 'verified',
            verifiedAt: new Date(),
            tier,
          };
          if (email) webhookSet.email = email;
          if (phone) webhookSet.phone = phone;
          webhookSet.unlockedUntil = new Date(Date.now() + UNLOCK_DURATION_MS);

          const upsertFilter = { cardType, tier };
          if (email) upsertFilter.email = email;
          else if (phone) upsertFilter.phone = phone;

          await db.collection('payments').updateOne(
            upsertFilter,
            {
              $set: webhookSet,
              $setOnInsert: { cardType, createdAt: new Date() },
            },
            { upsert: true },
          );
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
