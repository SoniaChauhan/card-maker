/**
 * Orders API — create Razorpay orders for card downloads.
 * POST /api/orders  { email, cardType, cardLabel, amount }
 */
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getDb } from '@/lib/mongodb';
import { decodeRequest } from '@/utils/payload';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
  try {
    const body = await decodeRequest(req);
    const { email, cardType, cardLabel, amount } = body;

    if (!email || !cardType || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already has a verified payment for this card type
    const db = await getDb();
    const existing = await db.collection('payments').findOne({
      email: email.toLowerCase().trim(),
      cardType,
      status: 'verified',
    });
    if (existing) {
      return NextResponse.json({ alreadyPaid: true });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects paise
      currency: 'INR',
      receipt: `card_${cardType}_${Date.now()}`,
      notes: {
        email: email.toLowerCase().trim(),
        cardType,
        cardLabel: cardLabel || cardType,
      },
    });

    // Save order in MongoDB
    await db.collection('orders').insertOne({
      razorpayOrderId: order.id,
      email: email.toLowerCase().trim(),
      cardType,
      cardLabel: cardLabel || cardType,
      amount,
      status: 'created',
      createdAt: new Date(),
    });

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
