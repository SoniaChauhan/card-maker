/**
 * Notification service — sends emails via Next.js API route (server-side EmailJS).
 * Credentials stay hidden from the browser.
 */

async function api(body) {
  const res = await fetch('/api/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send email');
  return data;
}

/** Send OTP to user's email */
export async function sendOTPEmail(toEmail, otp) {
  return api({ action: 'sendOTP', toEmail, otp });
}

/** Notify super-admin about an event */
export async function notifyAdmin(subject, message, senderEmail = '') {
  return api({ action: 'notifyAdmin', subject, message, senderEmail });
}

/** Notify a user (e.g. subscription approved) */
export async function notifyUser(toEmail, subject, message) {
  return api({ action: 'notifyUser', toEmail, subject, message });
}
