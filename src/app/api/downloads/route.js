/**
 * Downloads API routes — log and retrieve download history.
 * POST /api/downloads  with { action, ...params }
 */
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';

/** Strip non-serializable / oversized fields before saving snapshot. */
function sanitizeSnapshot(data) {
  const clean = {};
  for (const [k, v] of Object.entries(data || {})) {
    if (typeof v === 'object' && v !== null && v.constructor?.name === 'File') continue;
    if (k === 'photo') continue;
    if (typeof v === 'string' && v.startsWith('data:')) continue;
    if (Array.isArray(v) && v.length > 10) continue;
    clean[k] = v;
  }
  return clean;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action } = body;
    const db = await getDb();
    const col = db.collection('downloads');

    switch (action) {
      case 'log': {
        const { email, cardType, cardLabel, title, filename, formData } = body;
        const result = await col.insertOne({
          email: email.toLowerCase().trim(),
          cardType,
          cardLabel,
          title: title || `${cardType} card`,
          filename,
          formSnapshot: sanitizeSnapshot(formData),
          downloadedAt: new Date(),
        });
        return NextResponse.json({ id: result.insertedId.toString() });
      }

      case 'getByUser': {
        const { email } = body;
        const docs = await col
          .find({ email: email.toLowerCase().trim() })
          .sort({ downloadedAt: -1 })
          .toArray();
        const list = docs.map(d => ({
          id: d._id.toString(),
          ...d,
          _id: undefined,
          downloadedAt: d.downloadedAt?.toISOString?.() || d.downloadedAt,
        }));
        return NextResponse.json({ downloads: list });
      }

      case 'delete': {
        const { docId } = body;
        await col.deleteOne({ _id: new ObjectId(docId) });
        return NextResponse.json({ ok: true });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (err) {
    console.error('Downloads API error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
