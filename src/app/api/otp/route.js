/**
 * OTP API — generate and verify OTPs for email & mobile.
 *
 * POST /api/otp  { action: 'send', channel: 'email'|'phone', target: '...' }
 * POST /api/otp  { action: 'verify', channel: 'email'|'phone', target: '...', otp: '...' }
 *
 * OTPs are stored in MongoDB with a 5-minute TTL.
 * Email OTPs sent via SMTP (Brevo). SMS OTPs sent via Fast2SMS / Msg91 / env-configured provider.
 */
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { getDb } from '@/lib/mongodb';
import { decodeRequest } from '@/utils/payload';

// Corporate proxy / self-signed cert workaround
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const OTP_LENGTH = 6;

/** Generate a random numeric OTP */
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

/** Normalize phone: strip +91, spaces, dashes — keep last 10 digits */
function normalizePhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length > 10 ? digits.slice(-10) : digits;
}

/* ── Email transport ── */
function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
}

const fromAddress = () =>
  `${process.env.SMTP_FROM_NAME || 'Card Maker'} <${process.env.SMTP_FROM_EMAIL}>`;

async function sendEmailOTP(email, otp) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: fromAddress(),
    to: email,
    subject: 'Your Card Maker OTP',
    html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #e0e0e0;border-radius:12px">
      <h2 style="color:#6c47ff;text-align:center">🎴 Card Maker</h2>
      <p>Hello,</p>
      <p>Your one-time password (OTP) is:</p>
      <div style="text-align:center;margin:24px 0">
        <span style="font-size:32px;font-weight:bold;letter-spacing:6px;color:#6c47ff;background:#f3f0ff;padding:12px 24px;border-radius:8px">${otp}</span>
      </div>
      <p style="color:#888;font-size:13px">This OTP expires in 5 minutes. Do not share it with anyone.</p>
    </div>`,
  });
}

/**
 * Send SMS OTP via Fast2SMS (DLT-approved sender).
 * Set FAST2SMS_API_KEY in .env. Falls back gracefully if not configured.
 * Also supports MSG91 if MSG91_AUTH_KEY + MSG91_TEMPLATE_ID are set.
 */
async function sendSmsOTP(phone, otp) {
  const normalizedPhone = normalizePhone(phone);

  // ── Fast2SMS (preferred for India) ──
  if (process.env.FAST2SMS_API_KEY) {
    const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: process.env.FAST2SMS_API_KEY,
      },
      body: JSON.stringify({
        route: 'otp',
        variables_values: otp,
        numbers: normalizedPhone,
        flash: 0,
      }),
    });
    const data = await res.json();
    if (!data.return) {
      console.error('Fast2SMS error:', data);
      throw new Error(data.message?.[0] || 'SMS sending failed');
    }
    return;
  }

  // ── MSG91 ──
  if (process.env.MSG91_AUTH_KEY && process.env.MSG91_TEMPLATE_ID) {
    const res = await fetch('https://control.msg91.com/api/v5/otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authkey: process.env.MSG91_AUTH_KEY,
      },
      body: JSON.stringify({
        template_id: process.env.MSG91_TEMPLATE_ID,
        mobile: `91${normalizedPhone}`,
        otp,
      }),
    });
    const data = await res.json();
    if (data.type !== 'success') {
      console.error('MSG91 error:', data);
      throw new Error('SMS sending failed');
    }
    return;
  }

  // ── No SMS provider configured — log OTP and succeed silently ──
  console.warn(`[OTP] SMS provider not configured. OTP for ${normalizedPhone}: ${otp}`);
}

export async function POST(req) {
  try {
    const body = await decodeRequest(req);
    const { action } = body;
    const db = await getDb();
    const col = db.collection('otps');

    // Ensure TTL index (create once — MongoDB ignores duplicate createIndex calls)
    await col.createIndex({ createdAt: 1 }, { expireAfterSeconds: 300 }).catch(() => {});

    switch (action) {
      /* ── Send OTP ── */
      case 'send': {
        const { channel, target } = body;

        if (!channel || !target) {
          return NextResponse.json({ error: 'Missing channel or target' }, { status: 400 });
        }

        let key;
        if (channel === 'email') {
          key = target.toLowerCase().trim();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(key)) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
          }
        } else if (channel === 'phone') {
          key = normalizePhone(target);
          if (key.length !== 10) {
            return NextResponse.json({ error: 'Invalid mobile number (must be 10 digits)' }, { status: 400 });
          }
        } else {
          return NextResponse.json({ error: 'Invalid channel' }, { status: 400 });
        }

        // Rate-limit: max 5 OTPs per target in the last 10 minutes
        const recentCount = await col.countDocuments({
          channel,
          target: key,
          createdAt: { $gt: new Date(Date.now() - 10 * 60 * 1000) },
        });
        if (recentCount >= 5) {
          return NextResponse.json({ error: 'Too many OTP requests. Please wait a few minutes.' }, { status: 429 });
        }

        const otp = generateOTP();

        // Store OTP
        await col.insertOne({
          channel,
          target: key,
          otp,
          verified: false,
          createdAt: new Date(),
        });

        // Send via appropriate channel
        if (channel === 'email') {
          await sendEmailOTP(key, otp);
        } else {
          await sendSmsOTP(key, otp);
        }

        return NextResponse.json({ ok: true, message: `OTP sent to ${channel === 'email' ? 'your email' : 'your mobile'}` });
      }

      /* ── Verify OTP ── */
      case 'verify': {
        const { channel, target, otp } = body;

        if (!channel || !target || !otp) {
          return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const key = channel === 'email' ? target.toLowerCase().trim() : normalizePhone(target);

        // Find the most recent un-verified OTP for this target
        const doc = await col.findOne(
          {
            channel,
            target: key,
            verified: false,
            createdAt: { $gt: new Date(Date.now() - OTP_EXPIRY_MS) },
          },
          { sort: { createdAt: -1 } },
        );

        if (!doc) {
          return NextResponse.json({ verified: false, error: 'OTP expired or not found. Please request a new one.' }, { status: 400 });
        }

        if (doc.otp !== otp.trim()) {
          return NextResponse.json({ verified: false, error: 'Invalid OTP. Please try again.' }, { status: 400 });
        }

        // Mark as verified
        await col.updateOne({ _id: doc._id }, { $set: { verified: true } });

        return NextResponse.json({ verified: true });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (err) {
    console.error('OTP API error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
