/**
 * Subscription service — Firestore CRUD for card access requests.
 */
import { db } from '../firebase';
import {
  collection, addDoc, query, where, getDocs,
  updateDoc, doc, Timestamp,
} from 'firebase/firestore';

/** Request access to a card.  Returns { exists, status } */
export async function requestSubscription(email, cardId, cardName) {
  const key = email.toLowerCase().trim();
  const q   = query(
    collection(db, 'subscriptions'),
    where('email', '==', key),
    where('cardId', '==', cardId),
  );
  const snap = await getDocs(q);
  if (!snap.empty) {
    return { exists: true, status: snap.docs[0].data().status };
  }

  await addDoc(collection(db, 'subscriptions'), {
    email: key,
    cardId,
    cardName,
    status: 'pending',
    requestedAt: Timestamp.now(),
  });
  return { exists: false, status: 'pending' };
}

/** Get all subscriptions for a user as { [cardId]: status } */
export async function getUserSubscriptions(email) {
  const q    = query(collection(db, 'subscriptions'), where('email', '==', email.toLowerCase().trim()));
  const snap = await getDocs(q);
  const subs = {};
  snap.docs.forEach(d => {
    const data = d.data();
    subs[data.cardId] = data.status;
  });
  return subs;
}

/** Get all pending requests (admin use) */
export async function getPendingRequests() {
  const q    = query(collection(db, 'subscriptions'), where('status', '==', 'pending'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Approve a subscription request */
export async function approveSubscription(docId) {
  await updateDoc(doc(db, 'subscriptions', docId), {
    status: 'approved',
    approvedAt: Timestamp.now(),
  });
}

/** Reject a subscription request */
export async function rejectSubscription(docId) {
  await updateDoc(doc(db, 'subscriptions', docId), {
    status: 'rejected',
    rejectedAt: Timestamp.now(),
  });
}
