/**
 * Block API routes — block/unblock users, check blocked status.
 * POST /api/block  with { action, ...params }
 */
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function POST(req) {
  try {
    const body = await req.json();
    const { action } = body;
    const db = await getDb();
    const col = db.collection('blockedUsers');

    switch (action) {
      case 'block': {
        const { email, blockedBy, reason } = body;
        const key = email.toLowerCase().trim();
        await col.updateOne(
          { email: key },
          { $set: { email: key, blockedBy, reason: reason || '', blockedAt: new Date() } },
          { upsert: true },
        );
        return NextResponse.json({ ok: true });
      }

      case 'unblock': {
        const { email } = body;
        await col.deleteOne({ email: email.toLowerCase().trim() });
        return NextResponse.json({ ok: true });
      }

      case 'isBlocked': {
        const { email } = body;
        if (!email) return NextResponse.json({ blocked: false });
        const doc = await col.findOne({ email: email.toLowerCase().trim() });
        return NextResponse.json({ blocked: !!doc });
      }

      case 'getAll': {
        const docs = await col.find({}).toArray();
        const list = docs.map(d => ({ id: d._id.toString(), ...d, _id: undefined }));
        return NextResponse.json({ users: list });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (err) {
    console.error('Block API error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
