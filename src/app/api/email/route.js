/**
 * Email API route — sends emails via Brevo SMTP (nodemailer).
 * Runs server-side so SMTP credentials stay hidden from the client.
 * POST /api/email  with { action, ...params }
 */
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { decodeRequest } from '@/utils/payload';

// Corporate proxy / self-signed cert workaround
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_NAME  = process.env.ADMIN_NAME;

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

async function sendMail(to, subject, html) {
  const transporter = getTransporter();
  await transporter.sendMail({ from: fromAddress(), to, subject, html });
}

export async function POST(req) {
  try {
    const body = await decodeRequest(req);
    const { action } = body;

    switch (action) {
      case 'sendOTP': {
        const { toEmail, otp } = body;
        await sendMail(
          toEmail,
          'Your Card Maker OTP',
          `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #e0e0e0;border-radius:12px">
            <h2 style="color:#6c47ff;text-align:center">🎴 Card Maker</h2>
            <p>Hello,</p>
            <p>Your one-time password (OTP) is:</p>
            <div style="text-align:center;margin:24px 0">
              <span style="font-size:32px;font-weight:bold;letter-spacing:6px;color:#6c47ff;background:#f3f0ff;padding:12px 24px;border-radius:8px">${otp}</span>
            </div>
            <p style="color:#888;font-size:13px">This OTP expires in 5 minutes. Do not share it with anyone.</p>
          </div>`,
        );
        return NextResponse.json({ ok: true });
      }

      case 'notifyAdmin': {
        const { subject, message, senderEmail } = body;
        await sendMail(
          ADMIN_EMAIL,
          subject || 'Card Maker Notification',
          `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px">
            <h2 style="color:#6c47ff">Admin Notification</h2>
            <p>${message}</p>
            ${senderEmail ? `<p style="color:#888">From: ${senderEmail}</p>` : ''}
          </div>`,
        );
        return NextResponse.json({ ok: true });
      }

      case 'notifyUser': {
        const { toEmail, subject, message } = body;
        await sendMail(
          toEmail,
          subject || 'Card Maker Notification',
          `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px">
            <h2 style="color:#6c47ff">🎴 Card Maker</h2>
            <p>${message}</p>
          </div>`,
        );
        return NextResponse.json({ ok: true });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (err) {
    console.error('Email API error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
