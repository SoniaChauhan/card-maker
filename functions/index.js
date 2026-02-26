/**
 * Cloud Functions for Card Maker
 *
 * These functions run server-side so that EmailJS credentials,
 * OTP codes, and admin email are NEVER exposed in the browser's
 * Network tab.
 *
 * Deploy with:
 *   cd functions && npm install
 *   firebase deploy --only functions
 */
const functions = require('firebase-functions');
const admin     = require('firebase-admin');

admin.initializeApp();

/* ================================================================
   EmailJS credentials — server-side only, invisible to the client
   ================================================================ */
const EMAILJS_SERVICE_ID      = 'service_sicr4dp';
const EMAILJS_OTP_TEMPLATE    = 'template_fil9nef';
const EMAILJS_NOTIFY_TEMPLATE = 'template_n3scahd';
const EMAILJS_PUBLIC_KEY      = 'veryFjXyXWyfIiXTT';

/*
 * If EmailJS blocks requests from Cloud Functions, you may need
 * to add your EmailJS private key (Account → API Keys → Private Key).
 * Uncomment the line below and paste your key:
 */
// const EMAILJS_PRIVATE_KEY = 'YOUR_PRIVATE_KEY_HERE';

const ADMIN_EMAIL = 'soniarajvansi9876@gmail.com';
const ADMIN_NAME  = 'Sonia Chauhan';

/* ================================================================
   Helper — send email via EmailJS REST API
   ================================================================ */
async function sendEmailJS(templateId, templateParams) {
  const body = {
    service_id:      EMAILJS_SERVICE_ID,
    template_id:     templateId,
    user_id:         EMAILJS_PUBLIC_KEY,
    template_params: templateParams,
  };

  // Uncomment if you added EMAILJS_PRIVATE_KEY above:
  // body.accessToken = EMAILJS_PRIVATE_KEY;

  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('EmailJS error:', res.status, text);
    throw new functions.https.HttpsError('internal', 'Failed to send email.');
  }
}

/* ================================================================
   sendOTP — generates OTP, stores in Firestore, sends email
   Client only sends: { email }
   ================================================================ */
exports.sendOTP = functions.https.onCall(async (data, context) => {
  const email = (data.email || '').toLowerCase().trim();
  if (!email) {
    throw new functions.https.HttpsError('invalid-argument', 'Email is required.');
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store in Firestore
  const db = admin.firestore();
  await db.collection('otps').add({
    email,
    otp,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    expiresAt: admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + 5 * 60 * 1000)
    ),
    used: false,
  });

  // Send email via EmailJS (server-side — credentials stay hidden)
  await sendEmailJS(EMAILJS_OTP_TEMPLATE, {
    to_email:   email,
    otp_code:   otp,
    from_name:  'Card Maker',
    from_email: 'noreply@cardmaker.app',
    name:       'Card Maker',
    email:      email,
  });

  return { success: true };
});

/* ================================================================
   notifyAdmin — sends an email to the super-admin
   Client sends: { subject, message, senderEmail }
   Admin email is NEVER in the client payload.
   ================================================================ */
exports.notifyAdmin = functions.https.onCall(async (data, context) => {
  const { subject, message, senderEmail } = data;
  if (!subject) {
    throw new functions.https.HttpsError('invalid-argument', 'Subject is required.');
  }

  await sendEmailJS(EMAILJS_NOTIFY_TEMPLATE, {
    to_email:     ADMIN_EMAIL,
    to_name:      ADMIN_NAME,
    subject,
    message:      message || '',
    sender_email: senderEmail || '',
    name:         senderEmail || 'Card Maker',
    email:        senderEmail || ADMIN_EMAIL,
  });

  return { success: true };
});

/* ================================================================
   sendNotification — sends an email to any user
   Client sends: { toEmail, subject, message }
   ================================================================ */
exports.sendNotification = functions.https.onCall(async (data, context) => {
  const { toEmail, subject, message } = data;
  if (!toEmail || !subject) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'toEmail and subject are required.'
    );
  }

  await sendEmailJS(EMAILJS_NOTIFY_TEMPLATE, {
    to_email: toEmail,
    to_name:  toEmail,
    subject,
    message:  message || '',
  });

  return { success: true };
});
