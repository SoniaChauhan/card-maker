/**
 * Block Service — Superadmin can block / unblock users.
 * Uses Firestore collection "blockedUsers" (doc id = email).
 */
import { db } from '../firebase';
import {
  doc, setDoc, deleteDoc, getDoc, getDocs,
  collection, Timestamp,
} from 'firebase/firestore';

const COL = 'blockedUsers';

/** Block a user by email */
export async function blockUser(email, blockedBy, reason = '') {
  const key = email.toLowerCase().trim();
  await setDoc(doc(db, COL, key), {
    email: key,
    blockedBy,
    reason,
    blockedAt: Timestamp.now(),
  });
}

/** Unblock a user by email */
export async function unblockUser(email) {
  const key = email.toLowerCase().trim();
  await deleteDoc(doc(db, COL, key));
}

/** Check if a user is blocked (returns true/false) */
export async function isUserBlocked(email) {
  if (!email) return false;
  const key = email.toLowerCase().trim();
  const snap = await getDoc(doc(db, COL, key));
  return snap.exists();
}

/** Get all blocked users (for admin panel) */
export async function getBlockedUsers() {
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
