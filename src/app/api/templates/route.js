/**
 * Templates API routes — save, get, update, delete card templates.
 * POST /api/templates  with { action, ...params }
 */
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';
import { decodeRequest } from '@/utils/payload';

/** Strip non-serializable / oversized fields before saving. */
function sanitizeFormData(data) {
  const clean = {};
  for (const [k, v] of Object.entries(data || {})) {
    if (typeof v === 'object' && v !== null && v.constructor?.name === 'File') continue;
    if (k === 'photo') continue;
    if (typeof v === 'string' && v.startsWith('data:')) continue;
    clean[k] = v;
  }
  return clean;
}

export async function POST(req) {
  try {
    const body = await decodeRequest(req);
    const { action } = body;
    const db = await getDb();
    const col = db.collection('templates');

    switch (action) {
      case 'save': {
        const { email, cardType, templateName, formData } = body;
        const result = await col.insertOne({
          email: email.toLowerCase().trim(),
          cardType,
          templateName: (templateName || '').trim() || `${cardType} template`,
          formData: sanitizeFormData(formData),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return NextResponse.json({ id: result.insertedId.toString() });
      }

      case 'getByUser': {
        const { email } = body;
        const docs = await col
          .find({ email: email.toLowerCase().trim() })
          .sort({ updatedAt: -1 })
          .toArray();
        const list = docs.map(d => ({
          id: d._id.toString(),
          ...d,
          _id: undefined,
          createdAt: d.createdAt?.toISOString?.() || d.createdAt,
          updatedAt: d.updatedAt?.toISOString?.() || d.updatedAt,
        }));
        return NextResponse.json({ templates: list });
      }

      case 'update': {
        const { docId, templateName, formData } = body;
        await col.updateOne(
          { _id: new ObjectId(docId) },
          { $set: {
            templateName: (templateName || '').trim(),
            formData: sanitizeFormData(formData),
            updatedAt: new Date(),
          } },
        );
        return NextResponse.json({ ok: true });
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
    console.error('Templates API error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
