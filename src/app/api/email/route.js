/**
 * Email API route — sends OTP and notification emails via EmailJS REST API.
 * Runs server-side so credentials stay hidden from the client.
 * POST /api/email  with { action, ...params }
 */
import { NextResponse } from 'next/server';
import https from 'https';

// Corporate proxy / self-signed cert workaround for dev
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const SERVICE_ID   = process.env.EMAILJS_SERVICE_ID;
const OTP_TPL      = process.env.EMAILJS_OTP_TEMPLATE_ID;
const NOTIFY_TPL   = process.env.EMAILJS_NOTIFY_TEMPLATE_ID;
const PUBLIC_KEY   = process.env.EMAILJS_PUBLIC_KEY;
const ADMIN_EMAIL  = process.env.ADMIN_EMAIL;
const ADMIN_NAME   = process.env.ADMIN_NAME;

async function sendEmailJS(templateId, templateParams) {
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id:      SERVICE_ID,
      template_id:     templateId,
      user_id:         PUBLIC_KEY,
      template_params: templateParams,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error('EmailJS error:', res.status, text);
    throw new Error('Failed to send email');
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'sendOTP': {
        const { toEmail, otp } = body;
        await sendEmailJS(OTP_TPL, {
          to_email:   toEmail,
          otp_code:   otp,
          from_name:  'Card Maker',
          from_email: 'noreply@cardmaker.app',
          name:       'Card Maker',
          email:      toEmail,
        });
        return NextResponse.json({ ok: true });
      }

      case 'notifyAdmin': {
        const { subject, message, senderEmail } = body;
        await sendEmailJS(NOTIFY_TPL, {
          to_email:     ADMIN_EMAIL,
          to_name:      ADMIN_NAME,
          subject,
          message,
          sender_email: senderEmail || '',
          name:         senderEmail || 'Card Maker',
          email:        senderEmail || ADMIN_EMAIL,
        });
        return NextResponse.json({ ok: true });
      }

      case 'notifyUser': {
        const { toEmail, subject, message } = body;
        await sendEmailJS(NOTIFY_TPL, {
          to_email: toEmail,
          to_name:  toEmail,
          subject,
          message,
        });
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
