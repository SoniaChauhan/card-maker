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

      case 'sendFeedback': {
        const { senderName, senderEmail, rating, comment } = body;
        const FEEDBACK_EMAIL = 'creativethinker.designhub@gmail.com';
        const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
        await sendMail(
          FEEDBACK_EMAIL,
          `⭐ New Feedback (${rating}/5) — Card Maker`,
          `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;border:1px solid #e0e0e0;border-radius:12px">
            <h2 style="color:#6c47ff;text-align:center">🎴 Card Maker — User Feedback</h2>
            <table style="width:100%;border-collapse:collapse;margin:16px 0">
              <tr><td style="padding:8px 12px;font-weight:bold;color:#555;border-bottom:1px solid #eee">From:</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${senderName || 'Anonymous'}</td></tr>
              <tr><td style="padding:8px 12px;font-weight:bold;color:#555;border-bottom:1px solid #eee">Email:</td><td style="padding:8px 12px;border-bottom:1px solid #eee">${senderEmail || 'Not provided'}</td></tr>
              <tr><td style="padding:8px 12px;font-weight:bold;color:#555;border-bottom:1px solid #eee">Rating:</td><td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:20px;color:#f5a623">${stars} (${rating}/5)</td></tr>
              <tr><td style="padding:8px 12px;font-weight:bold;color:#555;vertical-align:top">Comment:</td><td style="padding:8px 12px">${comment || 'No comment provided'}</td></tr>
            </table>
            <p style="color:#888;font-size:12px;text-align:center">Submitted at ${new Date().toLocaleString()}</p>
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
