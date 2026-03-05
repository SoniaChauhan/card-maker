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
    const { email, phone, cardType, cardLabel, amount } = body;

    const emailKey = email ? email.toLowerCase().trim() : '';
    const phoneKey = phone ? normalizePhone(phone) : '';

    if ((!emailKey && !phoneKey) || !cardType || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already has a verified payment for this card type
    const db = await getDb();
    const conditions = [];
    if (emailKey) conditions.push({ email: emailKey });
    if (phoneKey) conditions.push({ phone: phoneKey });
    const userQuery = conditions.length === 1 ? conditions[0] : { $or: conditions };

    const existing = await db.collection('payments').findOne({
      ...userQuery,
      cardType,
      status: 'verified',
    });
    if (existing) {
      return NextResponse.json({ alreadyPaid: true });
    }

    // Create Razorpay order
    const notes = {
      cardType,
      cardLabel: cardLabel || cardType,
    };
    if (emailKey) notes.email = emailKey;
    if (phoneKey) notes.phone = phoneKey;

    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects paise
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
