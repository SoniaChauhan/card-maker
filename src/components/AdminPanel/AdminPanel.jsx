import { useState, useEffect } from 'react';
import './AdminPanel.css';
import {
  getPendingRequests,
  approveSubscription,
  rejectSubscription,
} from '../../services/subscriptionService';
import { notifyUser } from '../../services/notificationService';

export default function AdminPanel() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [acting, setActing]     = useState(null); // docId being acted on

  async function fetchRequests() {
    setLoading(true);
    try {
      const data = await getPendingRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchRequests(); }, []);

  async function handleApprove(req) {
    setActing(req.id);
    try {
      await approveSubscription(req.id);
      /* Notify user */
      await notifyUser(
        req.email,
        `✅ Subscription Approved — ${req.cardName}`,
        `Great news! Your request for the "${req.cardName}" template has been approved by Sonia Chauhan. You can now access it from your dashboard.`
      ).catch(() => {});
      fetchRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setActing(null);
    }
  }

  async function handleReject(req) {
    setActing(req.id);
    try {
      await rejectSubscription(req.id);
      await notifyUser(
        req.email,
        `❌ Subscription Rejected — ${req.cardName}`,
        `Your request for the "${req.cardName}" template has been rejected. Please contact the admin for more details.`
      ).catch(() => {});
      fetchRequests();
    } catch (err) {
      console.error(err);
    } finally {
      setActing(null);
    }
  }

  return (
    <div className="admin-panel">
      <h2>⚙️ Pending Subscription Requests</h2>
      <button className="admin-refresh" onClick={fetchRequests} disabled={loading}>
        {loading ? '⏳ Loading…' : '🔄 Refresh'}
      </button>

      {!loading && requests.length === 0 && (
        <p className="admin-empty">No pending requests. 🎉</p>
      )}

      {requests.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Card</th>
              <th>Requested</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id}>
                <td>{req.email}</td>
                <td>{req.cardName}</td>
                <td>{req.requestedAt?.toDate?.()?.toLocaleDateString?.() || '—'}</td>
                <td>
                  <button
                    className="admin-btn approve"
                    onClick={() => handleApprove(req)}
                    disabled={acting === req.id}
                  >
                    ✅ Approve
                  </button>
                  <button
                    className="admin-btn reject"
                    onClick={() => handleReject(req)}
                    disabled={acting === req.id}
                  >
                    ❌ Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
