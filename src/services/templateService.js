/**
 * Template service — Firestore CRUD for user-saved card templates.
 *
 * Collection: "templates"
 * Document shape:
 *   email       – user email (lowercase)
 *   cardType    – card id (birthday, anniversary, etc.)
 *   templateName– friendly label chosen by the user
 *   formData    – JSON object of all form fields (excl. File objects)
 *   createdAt   – Firestore Timestamp
 *   updatedAt   – Firestore Timestamp
 */
import { db } from '../firebase';
import {
  collection, addDoc, query, where, getDocs, orderBy,
  updateDoc, deleteDoc, doc, Timestamp,
} from 'firebase/firestore';

const COL = 'templates';

/** Strip non-serializable / oversized fields before saving to Firestore. */
function sanitizeFormData(data) {
  const clean = {};
  for (const [k, v] of Object.entries(data)) {
    if (v instanceof File) continue;                          // skip File objects
    if (k === 'photo') continue;                              // skip File reference
    if (typeof v === 'string' && v.startsWith('data:')) continue; // skip base64 data URLs (photoPreview etc.)
    clean[k] = v;
  }
  return clean;
}

/** Save a new template. Returns the new doc id. */
export async function saveTemplate(email, cardType, templateName, formData) {
  const ref = await addDoc(collection(db, COL), {
    email: email.toLowerCase().trim(),
    cardType,
    templateName: templateName.trim() || `${cardType} template`,
    formData: sanitizeFormData(formData),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return ref.id;
}

/** Get all templates for a user, newest first. */
export async function getUserTemplates(email) {
  try {
    // Composite index (email + updatedAt) required — Firestore console will
    // show a direct link to create it when the query first runs.
    const q = query(
      collection(db, COL),
      where('email', '==', email.toLowerCase().trim()),
      orderBy('updatedAt', 'desc'),
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    // Fallback: fetch without orderBy (works before index is created)
    console.warn('Templates orderBy failed — falling back to client sort.', err.message);
    const q = query(
      collection(db, COL),
      where('email', '==', email.toLowerCase().trim()),
    );
    const snap = await getDocs(q);
    const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    list.sort((a, b) => {
      const ta = a.updatedAt?.toMillis?.() || 0;
      const tb = b.updatedAt?.toMillis?.() || 0;
      return tb - ta;
    });
    return list;
  }
}

/** Update an existing template's form data (and name). */
export async function updateTemplate(docId, templateName, formData) {
  const ref = doc(db, COL, docId);
  await updateDoc(ref, {
    templateName: templateName.trim(),
    formData: sanitizeFormData(formData),
    updatedAt: Timestamp.now(),
  });
}

/** Delete a template by doc id. */
export async function deleteTemplate(docId) {
  await deleteDoc(doc(db, COL, docId));
}
