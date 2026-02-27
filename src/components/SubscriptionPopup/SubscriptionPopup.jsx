'use client';
import { useState } from 'react';
import './SubscriptionPopup.css';
import { requestSubscription } from '../../services/subscriptionService';
import { notifyAdmin } from '../../services/notificationService';
import { ADMIN_NAME } from '../../services/authService';

export default function SubscriptionPopup({ card, userEmail, existingStatus, onClose }) {
  const [status, setStatus]   = useState(existingStatus);  // null | 'pending' | 'approved' | 'rejected'
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  async function handleRequest() {
    setLoading(true);
    try {
      const res = await requestSubscription(userEmail, card.id, card.label);
      setStatus(res.status);
      setDone(true);

      /* Notify admin */
      await notifyAdmin(
        `🔔 Subscription Request — ${card.label}`,
        `Sender: ${userEmail}\n\nThis user is requesting access to the "${card.label}" template.\n\nPlease log in to the Admin Panel to approve or reject.`,
        userEmail
      ).catch(() => {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="sub-overlay" onClick={onClose}>
      <div className="sub-popup" onClick={e => e.stopPropagation()}>
        <button className="sub-close" onClick={onClose}>✕</button>

        <div className="sub-card-icon">{card.icon}</div>
        <h3>{card.label}</h3>

        {/* Admin info box */}
        <div className="sub-admin-info">
          <div className="sub-admin-label">Template Owner</div>
          <div className="sub-admin-name">{ADMIN_NAME}</div>
        </div>

        {/* Status-based content */}
        {status === 'pending' && !done && (
          <div className="sub-status pending">
            ⏳ Your request is pending approval.
          </div>
        )}

        {status === 'rejected' && (
          <div className="sub-status rejected">
            ❌ Your request was rejected. Please contact the admin.
          </div>
        )}

        {done && status === 'pending' && (
          <p className="sub-description">
            ✅ Request sent! {ADMIN_NAME} will review your request and you'll be notified once approved.
          </p>
        )}

        {!status && !done && (
          <>
            <button
              className="sub-request-btn"
              onClick={handleRequest}
              disabled={loading}
            >
              {loading ? '⏳ Requesting…' : '📩 Request Subscription'}
            </button>
            <p className="sub-description">
              This template requires approval. Click above to send a request to the admin.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
