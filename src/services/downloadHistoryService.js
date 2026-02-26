/**
 * Download History service — Firestore CRUD for tracking card downloads.
 *
 * Collection: "downloads"
 * Document shape:
 *   email        – user email (lowercase)
 *   cardType     – card id (birthday, anniversary, wedding, etc.)
 *   cardLabel    – human-readable card label
 *   title        – summary title (e.g. "Rahul & Priya Wedding")
 *   filename     – downloaded filename
 *   formSnapshot – condensed snapshot of key form fields (no base64/files)
 *   downloadedAt – Firestore Timestamp
 */
import { db } from '../firebase';
import {
  collection, addDoc, query, where, getDocs, orderBy,
  deleteDoc, doc, Timestamp,
} from 'firebase/firestore';

const COL = 'downloads';

/** Strip non-serializable / oversized fields before saving snapshot. */
function sanitizeSnapshot(data) {
  const clean = {};
  for (const [k, v] of Object.entries(data)) {
    if (v instanceof File) continue;
    if (k === 'photo') continue;
    if (typeof v === 'string' && v.startsWith('data:')) continue;
    if (Array.isArray(v) && v.length > 10) continue; // skip very large arrays
    clean[k] = v;
  }
  return clean;
}

/** Log a new download event. Returns the doc id. */
export async function logDownload(email, cardType, cardLabel, title, filename, formData = {}) {
  const ref = await addDoc(collection(db, COL), {
    email: email.toLowerCase().trim(),
    cardType,
    cardLabel,
    title: title || `${cardType} card`,
    filename,
    formSnapshot: sanitizeSnapshot(formData),
    downloadedAt: Timestamp.now(),
  });
  return ref.id;
}

/** Get all downloads for a user, newest first. */
export async function getUserDownloads(email) {
  try {
    const q = query(
      collection(db, COL),
      where('email', '==', email.toLowerCase().trim()),
      orderBy('downloadedAt', 'desc'),
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    // Fallback: fetch without orderBy (works before composite index is created)
    console.warn('Downloads orderBy failed — falling back to client sort.', err.message);
    const q = query(
      collection(db, COL),
      where('email', '==', email.toLowerCase().trim()),
    );
    const snap = await getDocs(q);
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    list.sort((a, b) => {
      const ta = a.downloadedAt?.toMillis?.() || 0;
      const tb = b.downloadedAt?.toMillis?.() || 0;
      return tb - ta;
    });
    return list;
  }
}

/** Delete a download history record. */
export async function deleteDownloadRecord(docId) {
  await deleteDoc(doc(db, COL, docId));
}
