import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const DB = process.env.NODE_ENV === 'development' ? 'card-maker-dev' : 'card-maker';
const COL = 'feedbacks';

/** Support multiple admin emails (comma-separated in env var) */
const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAIL || '').split(',').map(e => e.toLowerCase().trim()).filter(Boolean)
);
function isAdminEmail(email) {
  return !!email && ADMIN_EMAILS.has(email.toLowerCase().trim());
}

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
          email: f.email,
          rating: f.rating,
          comment: f.comment,
          replies: f.replies || [],
          createdAt: f.createdAt,
        })));
      }

      /* ── Get all feedbacks (admin) ── */
      case 'admin-list': {
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
          replies: f.replies || [],
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

      /* ── Update feedback (user — must match email) ── */
      case 'update': {
        const { id: updId, email: updEmail, rating: updRating, comment: updComment } = body;
        if (!updId || !updEmail) return NextResponse.json({ error: 'Missing id or email' }, { status: 400 });
        const { ObjectId: UpdOId } = await import('mongodb');
        const doc = await col.findOne({ _id: new UpdOId(updId) });
        if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        if (doc.email !== updEmail.trim().toLowerCase()) {
          return NextResponse.json({ error: 'Not authorised' }, { status: 403 });
        }
        const updates = {};
        if (updRating) updates.rating = Number(updRating);
        if (updComment) updates.comment = updComment.trim();
        await col.updateOne({ _id: new UpdOId(updId) }, { $set: updates });
        return NextResponse.json({ ok: true });
      }

      /* ── Delete feedback (owner must match email, or admin can delete any) ── */
      case 'delete': {
        const { id: delId, email: delEmail, adminEmail } = body;
        if (!delId) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        const { ObjectId: OId } = await import('mongodb');

        // Admin can delete any feedback
        if (isAdminEmail(adminEmail)) {
          await col.deleteOne({ _id: new OId(delId) });
          return NextResponse.json({ ok: true });
        }

        // Regular user — must provide email and it must match
        if (!delEmail) {
          return NextResponse.json({ error: 'Email required to delete' }, { status: 400 });
        }
        const doc = await col.findOne({ _id: new OId(delId) });
        if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        if (doc.email !== delEmail.trim().toLowerCase()) {
          return NextResponse.json({ error: 'Not authorised' }, { status: 403 });
        }
        await col.deleteOne({ _id: new OId(delId) });
        return NextResponse.json({ ok: true });
      }

      /* ── Add reply to a feedback ── */
      case 'reply': {
        const { id: replyId, replyName, replyEmail, replyComment } = body;
        if (!replyId || !replyName || !replyComment) {
          return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }
        const { ObjectId: RId } = await import('mongodb');
        await col.updateOne(
          { _id: new RId(replyId) },
          { $push: { replies: { name: replyName.trim(), email: (replyEmail || '').trim().toLowerCase(), comment: replyComment.trim(), createdAt: new Date() } } },
        );
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
