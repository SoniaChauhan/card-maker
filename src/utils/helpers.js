/**
 * Returns the ordinal suffix string for a number.
 * e.g. 1 → "1st", 22 → "22nd", 13 → "13th"
 */
export function ordinal(n) {
  const num = parseInt(n, 10);
  if (isNaN(num)) return n;
  const s = ['th', 'st', 'nd', 'rd'];
  const v = num % 100;
  return num + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Formats an ISO date string (YYYY-MM-DD) to a readable Indian locale string.
 * e.g. "2026-03-15" → "Sunday, 15 March 2026"
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const dt = new Date(dateStr + 'T00:00:00');
  return dt.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats a 24-hour time string (HH:MM) to 12-hour AM/PM format.
 * e.g. "20:30" → "8:30 PM"
 */
export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hr = parseInt(h, 10);
  const ampm = hr >= 12 ? 'PM' : 'AM';
  return `${hr % 12 || 12}:${m} ${ampm}`;
}

/**
 * Sanitises a string to be safe for use in a filename.
 */
export function toFilename(str) {
  return str.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
}

/**
 * Masks an email address for display / logs.
 * "sonia@gmail.com" → "so***@gm***.com"
 */
export function maskEmail(email) {
  if (!email || typeof email !== 'string') return '***';
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  const maskedLocal = local.length <= 2
    ? local[0] + '***'
    : local.slice(0, 2) + '***';
  const dotIdx = domain.lastIndexOf('.');
  if (dotIdx <= 0) return `${maskedLocal}@***`;
  const domName = domain.slice(0, dotIdx);
  const ext = domain.slice(dotIdx);
  const maskedDom = domName.length <= 2
    ? domName[0] + '***'
    : domName.slice(0, 2) + '***';
  return `${maskedLocal}@${maskedDom}${ext}`;
}
