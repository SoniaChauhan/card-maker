/**
 * Subscriptions API routes — request, approve, reject, check payment.
 * POST /api/subscriptions  with { action, ...params }
 */
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'soniarajvansi9876@gmail.com';

export async function POST(req) {
  try {
    const body = await req.json();
    const { action } = body;
    const db = await getDb();
    const col = db.collection('subscriptions');

    switch (action) {
      case 'request': {
        const { email, cardId, cardName } = body;
        const key = email.toLowerCase().trim();
        const existing = await col.findOne({ email: key, cardId });
        if (existing) {
          return NextResponse.json({ exists: true, status: existing.status });
        }
        await col.insertOne({
          email: key, cardId, cardName,
          status: 'pending',
          requestedAt: new Date(),
        });
        return NextResponse.json({ exists: false, status: 'pending' });
      }

      case 'getUserSubs': {
        const { email } = body;
        const docs = await col.find({ email: email.toLowerCase().trim() }).toArray();
        const subs = {};
        docs.forEach(d => { subs[d.cardId] = d.status; });
        return NextResponse.json({ subs });
      }

      case 'getPending': {
        const docs = await col.find({ status: 'pending' }).toArray();
        const list = docs.map(d => ({ id: d._id.toString(), ...d, _id: undefined }));
        return NextResponse.json({ requests: list });
      }

      case 'approve': {
        const { docId } = body;
        await col.updateOne(
          { _id: new ObjectId(docId) },
          { $set: { status: 'approved', approvedAt: new Date() } },
        );
        return NextResponse.json({ ok: true });
      }

      case 'reject': {
        const { docId } = body;
        await col.updateOne(
          { _id: new ObjectId(docId) },
          { $set: { status: 'rejected', rejectedAt: new Date() } },
        );
        return NextResponse.json({ ok: true });
      }

      case 'hasUserPaid': {
        const { email, cardId } = body;
        const key = email.toLowerCase().trim();
        // Super-admin bypasses payment
        if (key === ADMIN_EMAIL) return NextResponse.json({ paid: true });
        const doc = await col.findOne({ email: key, cardId, status: 'approved' });
        return NextResponse.json({ paid: !!doc });
      }

      case 'recordPayment': {
        const { email, cardId, cardName, txnId } = body;
        const key = email.toLowerCase().trim();
        const existing = await col.findOne({ email: key, cardId });
        if (existing) {
          await col.updateOne(
            { _id: existing._id },
            { $set: { txnId, status: 'payment_pending', paidAt: new Date() } },
          );
        } else {
          await col.insertOne({
            email: key, cardId, cardName, txnId,
            status: 'payment_pending',
            requestedAt: new Date(),
            paidAt: new Date(),
          });
        }
        return NextResponse.json({ ok: true });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (err) {
    console.error('Subscriptions API error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
