/**
 * Block Service — Superadmin can block / unblock users.
 * Uses Next.js API route /api/block backed by MongoDB.
 */
import { encodePayload } from '../utils/payload';

async function api(body) {
  const res = await fetch('/api/block', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ _p: encodePayload(body) }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

/** Block a user by email */
export async function blockUser(email, blockedBy, reason = '') {
  await api({ action: 'block', email, blockedBy, reason });
}

/** Unblock a user by email */
export async function unblockUser(email) {
  await api({ action: 'unblock', email });
}

/** Check if a user is blocked (returns true/false) */
export async function isUserBlocked(email) {
  if (!email) return false;
  const data = await api({ action: 'isBlocked', email });
  return data.blocked;
}

/** Get all blocked users (for admin panel) */
export async function getBlockedUsers() {
  const data = await api({ action: 'getAll' });
  return data.users;
}
