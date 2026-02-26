/**
 * Notification service — all emails are sent via Firebase Cloud Functions.
 *
 * The Cloud Functions (in /functions/index.js) handle EmailJS server-side
 * so that credentials, OTP codes, and admin email are NEVER visible in
 * the browser's Network tab.
 *
 * Deploy the functions first:
 *   cd functions && npm install
 *   firebase deploy --only functions
 */
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';

/* Callable Cloud Functions */
const sendOTPFn         = httpsCallable(functions, 'sendOTP');
const notifyAdminFn     = httpsCallable(functions, 'notifyAdmin');
const sendNotificationFn = httpsCallable(functions, 'sendNotification');

/**
 * Request OTP — the Cloud Function generates the code, stores it in
 * Firestore, and sends the email. The client NEVER sees the OTP or
 * EmailJS credentials.
 */
export async function requestOTP(email) {
  const result = await sendOTPFn({ email });
  return result.data;
}

/** Notify super-admin about an event (admin email is server-side) */
export async function notifyAdmin(subject, message, senderEmail = '') {
  return notifyAdminFn({ subject, message, senderEmail });
}

/** Notify a user (e.g. subscription approved) */
export async function notifyUser(toEmail, subject, message) {
  return sendNotificationFn({ toEmail, subject, message });
}
