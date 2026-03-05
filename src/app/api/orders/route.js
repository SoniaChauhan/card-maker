/**
 * Orders API — create Razorpay orders for card downloads.
 * POST /api/orders  { email, phone, cardType, cardLabel, amount }
 * Supports both email and phone as user identifiers.
 */
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getDb } from '@/lib/mongodb';
import { decodeRequest } from '@/utils/payload';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/** Normalize phone: strip non-digits, keep last 10 digits */
function normalizePhone(phone) {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}

export async function POST(req) {
  try {
    const body = await decodeRequest(req);
    const { email, phone, cardType, cardLabel, amount, comboCards } = body;

    const emailKey = email ? email.toLowerCase().trim() : '';
    const phoneKey = phone ? normalizePhone(phone) : '';

    if ((!emailKey && !phoneKey) || !cardType || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await getDb();
    const conditions = [];
    if (emailKey) conditions.push({ email: emailKey });
    if (phoneKey) conditions.push({ phone: phoneKey });
    const userQuery = conditions.length === 1 ? conditions[0] : { $or: conditions };

    // For combo orders, check if user already has an active combo with same cards
    if (cardType === 'combo' && Array.isArray(comboCards) && comboCards.length === 2) {
      const sorted = [...comboCards].sort();
      const existingCombo = await db.collection('payments').findOne({
        ...userQuery,
        cardType: 'combo',
        comboCards: sorted,
        status: 'verified',
        unlockedUntil: { $gt: new Date() },
      });
      if (existingCombo) {
        return NextResponse.json({ alreadyPaid: true });
      }
    } else {
      // Standard single-card check
      const existing = await db.collection('payments').findOne({
        ...userQuery,
        cardType,
        status: 'verified',
      });
      if (existing) {
        return NextResponse.json({ alreadyPaid: true });
      }
    }

    // Create Razorpay order
    const notes = {
      cardType,
      cardLabel: cardLabel || cardType,
    };
    if (emailKey) notes.email = emailKey;
    if (phoneKey) notes.phone = phoneKey;
    if (cardType === 'combo' && Array.isArray(comboCards)) {
      notes.comboCards = comboCards.join(',');
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `card_${cardType}_${Date.now()}`,
      notes,
    });

    // Save order in MongoDB
    const orderDoc = {
      razorpayOrderId: order.id,
      cardType,
      cardLabel: cardLabel || cardType,
      amount,
      status: 'created',
      createdAt: new Date(),
    };
    if (emailKey) orderDoc.email = emailKey;
    if (phoneKey) orderDoc.phone = phoneKey;
    if (cardType === 'combo' && Array.isArray(comboCards)) {
      orderDoc.comboCards = [...comboCards].sort();
    }

    await db.collection('orders').insertOne(orderDoc);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Orders API error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to create order' },
      { status: 500 },
    );
  }
}
