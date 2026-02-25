/**
 * Notification service — sends emails via EmailJS.
 *
 * ⚠️  SETUP REQUIRED — Replace the placeholder values below.
 *
 *  1. Go to https://www.emailjs.com/ and create a free account
 *  2. Connect your Gmail service (Email Services → Add → Gmail)
 *  3. Create two email templates:
 *
 *     Template 1 — "OTP" (id: template_otp)
 *       Subject: Your Card Maker Login OTP
 *       Body:    Hello! Your one-time login code is: {{otp_code}}
 *                Valid for 5 minutes. Do not share it with anyone.
 *       To:      {{to_email}}
 *
 *     Template 2 — "Notification" (id: template_notify)
 *       Subject: {{subject}}
 *       Body:    {{message}}
 *       To:      {{to_email}}
 *
 *  4. Copy your Service ID, Template IDs, and Public Key below
 */
import emailjs from '@emailjs/browser';

const SERVICE_ID        = import.meta.env.VITE_EMAILJS_SERVICE_ID     || 'YOUR_EMAILJS_SERVICE_ID';
const OTP_TEMPLATE_ID   = import.meta.env.VITE_EMAILJS_OTP_TEMPLATE   || 'YOUR_OTP_TEMPLATE_ID';
const NOTIFY_TEMPLATE_ID= import.meta.env.VITE_EMAILJS_NOTIFY_TEMPLATE|| 'YOUR_NOTIFY_TEMPLATE_ID';
const PUBLIC_KEY        = import.meta.env.VITE_EMAILJS_PUBLIC_KEY     || 'YOUR_EMAILJS_PUBLIC_KEY';

import { ADMIN_EMAIL, ADMIN_NAME } from './authService';

/** Send OTP to user's email */
export async function sendOTPEmail(toEmail, otp) {
  return emailjs.send(SERVICE_ID, OTP_TEMPLATE_ID, {
    to_email: toEmail,
    otp_code: otp,
  }, PUBLIC_KEY);
}

/** Notify super-admin about an event */
export async function notifyAdmin(subject, message) {
  return emailjs.send(SERVICE_ID, NOTIFY_TEMPLATE_ID, {
    to_email: ADMIN_EMAIL,
    to_name:  ADMIN_NAME,
    subject,
    message,
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
