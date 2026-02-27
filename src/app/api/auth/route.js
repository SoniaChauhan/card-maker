/**
 * Auth API routes — handles signup, signin, OTP, password reset.
 * POST /api/auth  with { action, ...params }
 */
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { decodeRequest } from '@/utils/payload';

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').toLowerCase().trim();

/* Simple SHA-256 hash (matches the client-side approach) */
async function hashPassword(pw) {
  const { createHash } = await import('crypto');
  return createHash('sha256').update(pw).digest('hex');
}

export async function POST(req) {
  try {
    const body = await decodeRequest(req);
    const { action } = body;
    const db = await getDb();

    switch (action) {
      case 'storeOTP': {
        const { email, otp } = body;
        await db.collection('otps').insertOne({
          email: email.toLowerCase().trim(),
          otp,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
          used: false,
        });
        return NextResponse.json({ ok: true });
      }

      case 'verifyOTP': {
        const { email, otp } = body;
        const key = email.toLowerCase().trim();
        const otpDoc = await db.collection('otps').findOne({
          email: key,
          otp,
          used: false,
        });
        if (!otpDoc) return NextResponse.json({ valid: false });
        if (new Date(otpDoc.expiresAt) < new Date()) return NextResponse.json({ valid: false });
        await db.collection('otps').updateOne({ _id: otpDoc._id }, { $set: { used: true } });
        return NextResponse.json({ valid: true });
      }

      case 'userExists': {
        const { email } = body;
        const key = email.toLowerCase().trim();
        const user = await db.collection('users').findOne({ email: key });
        return NextResponse.json({ exists: !!user });
      }

      case 'signUp': {
        const { name, email, password } = body;
        const key = email.toLowerCase().trim();
        const existing = await db.collection('users').findOne({ email: key });
        if (existing) return NextResponse.json({ error: 'Account already exists. Please sign in.' }, { status: 409 });

        const role = key === ADMIN_EMAIL ? 'superadmin' : 'user';
        const hashed = await hashPassword(password);

        await db.collection('users').insertOne({
          email: key,
          name: name.trim(),
          password: hashed,
          role,
          createdAt: new Date(),
          lastLogin: new Date(),
        });
        return NextResponse.json({ email: key, name: name.trim(), role });
      }

      case 'signIn': {
        const { email, password } = body;
        const key = email.toLowerCase().trim();
        const user = await db.collection('users').findOne({ email: key });
        if (!user) return NextResponse.json({ error: 'Account not found. Please sign up first.' }, { status: 404 });

        const hashed = await hashPassword(password);
        if (user.password !== hashed) return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });

        await db.collection('users').updateOne({ email: key }, { $set: { lastLogin: new Date() } });
        return NextResponse.json({ email: key, name: user.name || key, role: user.role || 'user' });
      }

      case 'resetPassword': {
        const { email, newPassword } = body;
        const key = email.toLowerCase().trim();
        const user = await db.collection('users').findOne({ email: key });
        if (!user) return NextResponse.json({ error: 'Account not found.' }, { status: 404 });

        const hashed = await hashPassword(newPassword);
        await db.collection('users').updateOne({ email: key }, { $set: { password: hashed } });
        return NextResponse.json({ ok: true });
      }

      case 'createOrUpdateUser': {
        const { email } = body;
        const key = email.toLowerCase().trim();
        const role = key === ADMIN_EMAIL ? 'superadmin' : 'user';
        const existing = await db.collection('users').findOne({ email: key });

        if (!existing) {
          await db.collection('users').insertOne({
            email: key, name: '', role, createdAt: new Date(), lastLogin: new Date(),
          });
          return NextResponse.json({ email: key, name: '', role });
        } else {
          await db.collection('users').updateOne({ email: key }, { $set: { lastLogin: new Date() } });
          return NextResponse.json({ email: key, name: existing.name || '', role: existing.role || role });
        }
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (err) {
    console.error('Auth API error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
