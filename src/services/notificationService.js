/**
 * Notification service — sends emails via client-side @emailjs/browser.
 * Corporate proxy blocks server-side calls to api.emailjs.com,
 * so we use the browser SDK which goes through the browser's trusted certs.
 */
import emailjs from '@emailjs/browser';

const SERVICE_ID         = 'service_sicr4dp';
const OTP_TEMPLATE_ID    = 'template_fil9nef';
const NOTIFY_TEMPLATE_ID = 'template_n3scahd';
const PUBLIC_KEY         = 'veryFjXyXWyfIiXTT';

const ADMIN_EMAIL = 'soniarajvansi9876@gmail.com';
const ADMIN_NAME  = 'Sonia Chauhan';

/** Send OTP to user's email */
export async function sendOTPEmail(toEmail, otp) {
  return emailjs.send(SERVICE_ID, OTP_TEMPLATE_ID, {
    to_email:   toEmail,
    otp_code:   otp,
    from_name:  'Card Maker',
    from_email: 'noreply@cardmaker.app',
    name:       'Card Maker',
    email:      toEmail,
  }, PUBLIC_KEY);
}

/** Notify super-admin about an event */
export async function notifyAdmin(subject, message, senderEmail = '') {
  return emailjs.send(SERVICE_ID, NOTIFY_TEMPLATE_ID, {
    to_email:     ADMIN_EMAIL,
    to_name:      ADMIN_NAME,
    subject,
    message,
    sender_email: senderEmail || '',
    name:         senderEmail || 'Card Maker',
    email:        senderEmail || ADMIN_EMAIL,
  }, PUBLIC_KEY);
}

/** Notify a user (e.g. subscription approved) */
export async function notifyUser(toEmail, subject, message) {
  return emailjs.send(SERVICE_ID, NOTIFY_TEMPLATE_ID, {
    to_email: toEmail,
    to_name:  toEmail,
    subject,
    message,
  }, PUBLIC_KEY);
}
