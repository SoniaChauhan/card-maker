/**
 * Auth service — Email/Password + OTP flow using Firestore + EmailJS.
 */
import { db } from '../firebase';
import {
  collection, addDoc, query, where, getDocs,
  updateDoc, doc, setDoc, getDoc, Timestamp,
} from 'firebase/firestore';

export const ADMIN_EMAIL = 'soniarajvansi9876@gmail.com';
export const ADMIN_NAME  = 'Sonia Chauhan';

/* ========== Simple hash (NOT crypto-grade, fine for demo) ========== */
async function hashPassword(pw) {
  const enc = new TextEncoder().encode(pw);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ========== OTP helpers ========== */
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

/* ========== User helpers ========== */

/** Check if a user already exists in Firestore */
export async function userExists(email) {
  const key     = email.toLowerCase().trim();
  const userRef = doc(db, 'users', key);
  const snap    = await getDoc(userRef);
  return snap.exists();
}

/** Sign Up — create new user with name + email + hashed password */
export async function signUpUser(name, email, password) {
  const key     = email.toLowerCase().trim();
  const userRef = doc(db, 'users', key);
  const snap    = await getDoc(userRef);

  if (snap.exists()) throw new Error('Account already exists. Please sign in.');

  const role = key === ADMIN_EMAIL ? 'superadmin' : 'user';
  const hashed = await hashPassword(password);

  await setDoc(userRef, {
    email: key,
    name: name.trim(),
    password: hashed,
    role,
    createdAt: Timestamp.now(),
    lastLogin: Timestamp.now(),
  });

  return { email: key, name: name.trim(), role };
}

/** Sign In with email + password */
export async function signInUser(email, password) {
  const key     = email.toLowerCase().trim();
  const userRef = doc(db, 'users', key);
  const snap    = await getDoc(userRef);

  if (!snap.exists()) throw new Error('Account not found. Please sign up first.');

  const data   = snap.data();
  const hashed = await hashPassword(password);

  if (data.password !== hashed) throw new Error('Incorrect password.');

  await updateDoc(userRef, { lastLogin: Timestamp.now() });
  return { email: key, name: data.name || key, role: data.role || 'user' };
}

/** Update password (after OTP verification) */
export async function resetPassword(email, newPassword) {
  const key     = email.toLowerCase().trim();
  const userRef = doc(db, 'users', key);
  const snap    = await getDoc(userRef);

  if (!snap.exists()) throw new Error('Account not found.');

  const hashed = await hashPassword(newPassword);
  await updateDoc(userRef, { password: hashed });
}

/** Create or update user (used for OTP-only login) */
export async function createOrUpdateUser(email) {
  const key     = email.toLowerCase().trim();
  const userRef = doc(db, 'users', key);
  const snap    = await getDoc(userRef);
  const role    = key === ADMIN_EMAIL ? 'superadmin' : 'user';

  if (!snap.exists()) {
    await setDoc(userRef, { email: key, name: '', role, createdAt: Timestamp.now(), lastLogin: Timestamp.now() });
  } else {
    await updateDoc(userRef, { lastLogin: Timestamp.now() });
  }
  const data = snap.exists() ? snap.data() : {};
  return { email: key, name: data.name || '', role };
}

export function isAdmin(email) {
  return email?.toLowerCase().trim() === ADMIN_EMAIL;
}

/* ========== Session helpers (localStorage) ========== */
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
