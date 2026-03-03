import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB = 'card-maker';
const COL = 'feedbacks';

export async function POST(req) {
  try {
    const body = await req.json();
    const { action } = body;
    const client = await clientPromise;
    const col = client.db(DB).collection(COL);

    switch (action) {
      /* ── Save new feedback ── */
      case 'save': {
        const { name, email, rating, comment } = body;
        if (!name || !email || !rating || !comment) {
          return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }
        await col.insertOne({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          rating: Number(rating),
          comment: comment.trim(),
          approved: true, // auto-approve; admin can hide later
          createdAt: new Date(),
        });
        return NextResponse.json({ ok: true });
      }

      /* ── Get approved feedbacks (public) ── */
      case 'list': {
        const feedbacks = await col
          .find({ approved: true })
          .sort({ createdAt: -1 })
          .limit(50)
          .toArray();
        return NextResponse.json(feedbacks.map(f => ({
          id: f._id.toString(),
          name: f.name,
          rating: f.rating,
          comment: f.comment,
          createdAt: f.createdAt,
        })));
      }

      /* ── Get all feedbacks (admin) ── */
      case 'admin-list': {
        const all = await col
          .sort({ createdAt: -1 })
          .toArray ? undefined : undefined;
        // proper query
        const feedbacks = await col
          .find({})
          .sort({ createdAt: -1 })
          .limit(100)
          .toArray();
        return NextResponse.json(feedbacks.map(f => ({
          id: f._id.toString(),
          name: f.name,
          email: f.email,
          rating: f.rating,
          comment: f.comment,
          approved: f.approved,
          createdAt: f.createdAt,
        })));
      }

      /* ── Toggle visibility (admin) ── */
      case 'toggle': {
        const { id, approved } = body;
        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        const { ObjectId } = await import('mongodb');
        await col.updateOne(
          { _id: new ObjectId(id) },
          { $set: { approved: !!approved } },
        );
        return NextResponse.json({ ok: true });
      }

      /* ── Delete feedback (admin) ── */
      case 'delete': {
        const { id: delId } = body;
        if (!delId) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        const { ObjectId: OId } = await import('mongodb');
        await col.deleteOne({ _id: new OId(delId) });
        return NextResponse.json({ ok: true });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (err) {
    console.error('Feedback API error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
