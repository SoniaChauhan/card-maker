/**
 * Auth service — custom OTP flow using Firestore + EmailJS.
 */
import { db } from '../firebase';
import {
  collection, addDoc, query, where, getDocs,
  updateDoc, doc, setDoc, getDoc, Timestamp,
} from 'firebase/firestore';

export const ADMIN_EMAIL = 'sonirajvansi9876@gmail.com';
export const ADMIN_NAME  = 'Sonia Chauhan';

/* ---- OTP helpers ---- */
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function storeOTP(email, otp) {
  await addDoc(collection(db, 'otps'), {
    email: email.toLowerCase().trim(),
    otp,
    createdAt: Timestamp.now(),
    expiresAt: Timestamp.fromDate(new Date(Date.now() + 5 * 60 * 1000)),
    used: false,
  });
}

export async function verifyOTP(email, otp) {
  const q = query(
    collection(db, 'otps'),
    where('email', '==', email.toLowerCase().trim()),
    where('otp', '==', otp),
    where('used', '==', false),
  );
  const snap = await getDocs(q);
  if (snap.empty) return false;

  const otpDoc = snap.docs[0];
  const data   = otpDoc.data();
  if (data.expiresAt.toDate() < new Date()) return false;

  await updateDoc(doc(db, 'otps', otpDoc.id), { used: true });
  return true;
}

/* ---- User helpers ---- */
export async function createOrUpdateUser(email) {
  const key     = email.toLowerCase().trim();
  const userRef = doc(db, 'users', key);
  const snap    = await getDoc(userRef);
  const role    = key === ADMIN_EMAIL ? 'superadmin' : 'user';

  if (!snap.exists()) {
    await setDoc(userRef, { email: key, role, createdAt: Timestamp.now(), lastLogin: Timestamp.now() });
  } else {
    await updateDoc(userRef, { lastLogin: Timestamp.now() });
  }
  return { email: key, role };
}

export function isAdmin(email) {
  return email?.toLowerCase().trim() === ADMIN_EMAIL;
}

/* ---- Session helpers (localStorage) ---- */
const SESSION_KEY = 'cardmaker_user';

export function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
  catch { return null; }
}

export function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
