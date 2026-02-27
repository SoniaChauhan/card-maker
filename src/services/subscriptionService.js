/**
 * Subscription service — card access requests via Next.js API + MongoDB.
 */

async function api(body) {
  const res = await fetch('/api/subscriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

/** Request access to a card.  Returns { exists, status } */
export async function requestSubscription(email, cardId, cardName) {
  return api({ action: 'request', email, cardId, cardName });
}

/** Get all subscriptions for a user as { [cardId]: status } */
export async function getUserSubscriptions(email) {
  const data = await api({ action: 'getUserSubs', email });
  return data.subs;
}

/** Get all pending requests (admin use) */
export async function getPendingRequests() {
  const data = await api({ action: 'getPending' });
  return data.requests;
}

/** Approve a subscription request */
export async function approveSubscription(docId) {
  await api({ action: 'approve', docId });
}

/** Reject a subscription request */
export async function rejectSubscription(docId) {
  await api({ action: 'reject', docId });
}

/** Check if user has a paid/approved download for a card. */
export async function hasUserPaid(email, cardId) {
  const data = await api({ action: 'hasUserPaid', email, cardId });
  return data.paid;
}

/** Record a payment submission for admin review */
export async function recordPayment(email, cardId, cardName, txnId) {
  await api({ action: 'recordPayment', email, cardId, cardName, txnId });
}
