/**
 * Download History service — tracks card downloads via Next.js API + MongoDB.
 */
import { encodePayload } from '../utils/payload';

async function api(body) {
  const res = await fetch('/api/downloads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ _p: encodePayload(body) }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

/** Strip non-serializable / oversized fields before saving snapshot. */
function sanitizeSnapshot(data) {
  const clean = {};
  for (const [k, v] of Object.entries(data || {})) {
    if (v instanceof File) continue;
    if (k === 'photo') continue;
    if (typeof v === 'string' && v.startsWith('data:')) continue;
    if (Array.isArray(v) && v.length > 10) continue;
    clean[k] = v;
  }
  return clean;
}

/** Log a new download event. Returns the doc id. */
export async function logDownload(email, cardType, cardLabel, title, filename, formData = {}) {
  const data = await api({
    action: 'log', email, cardType, cardLabel, title, filename,
    formData: sanitizeSnapshot(formData),
  });
  return data.id;
}

/** Get all downloads for a user, newest first. */
export async function getUserDownloads(email) {
  const data = await api({ action: 'getByUser', email });
  return data.downloads;
}

/** Delete a download history record. */
export async function deleteDownloadRecord(docId) {
  await api({ action: 'delete', docId });
}
