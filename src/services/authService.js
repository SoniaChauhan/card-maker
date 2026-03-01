/**
 * Auth service — Email/Password + OTP flow via Next.js API routes + MongoDB.
 */
import { encodePayload } from '../utils/payload';

export const ADMIN_EMAIL = 'creativethinker.designhub@gmail.com';
export const ADMIN_NAME  = 'Sonia Chauhan';

async function api(body) {
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ _p: encodePayload(body) }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

/* ========== OTP helpers ========== */
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function storeOTP(email, otp) {
  await api({ action: 'storeOTP', email, otp });
}

export async function verifyOTP(email, otp) {
  const data = await api({ action: 'verifyOTP', email, otp });
  return data.valid;
}

/* ========== User helpers ========== */

export async function userExists(email) {
  const data = await api({ action: 'userExists', email });
  return data.exists;
}

export async function signUpUser(name, email, password) {
  return api({ action: 'signUp', name, email, password });
}

export async function signInUser(email, password) {
  return api({ action: 'signIn', email, password });
}

export async function resetPassword(email, newPassword) {
  await api({ action: 'resetPassword', email, newPassword });
}

export async function createOrUpdateUser(email) {
  return api({ action: 'createOrUpdateUser', email });
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
