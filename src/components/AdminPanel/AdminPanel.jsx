import { useState, useEffect } from 'react';
import './AdminPanel.css';
import { blockUser, unblockUser, getBlockedUsers } from '../../services/blockService';
import { getPendingRequests, approveSubscription, rejectSubscription } from '../../services/subscriptionService';
import { notifyAdmin } from '../../services/notificationService';
import { ADMIN_EMAIL } from '../../services/authService';

export default function AdminPanel() {
  const [email, setEmail]         = useState('');
  const [reason, setReason]       = useState('');
  const [blocked, setBlocked]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [blocking, setBlocking]   = useState(false);
  const [unblocking, setUnblocking] = useState(null);
  const [toast, setToast]         = useState('');

  /* Subscription requests */
  const [requests, setRequests]     = useState([]);
  const [reqLoading, setReqLoading] = useState(true);
  const [acting, setActing]         = useState(null); // id being approved/rejected

  useEffect(() => {
    loadBlocked();
    loadRequests();
  }, []);

  async function loadBlocked() {
    setLoading(true);
    try {
      const list = await getBlockedUsers();
      setBlocked(list);
    } catch (err) {
      console.error('Failed to load blocked users:', err);
    } finally { setLoading(false); }
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  async function loadRequests() {
    setReqLoading(true);
    try {
      const list = await getPendingRequests();
      setRequests(list);
    } catch (err) {
      console.error('Failed to load requests:', err);
    } finally { setReqLoading(false); }
  }

  async function handleApprove(req) {
    setActing(req.id);
    try {
      await approveSubscription(req.id);
      showToast(`✅ Approved "${req.cardName}" for ${req.email}`);
      await loadRequests();
    } catch (err) {
      console.error('Approve failed:', err);
      showToast('❌ Failed to approve.');
    } finally { setActing(null); }
  }

  async function handleReject(req) {
    if (!window.confirm(`Reject "${req.cardName}" request from ${req.email}?`)) return;
    setActing(req.id);
    try {
      await rejectSubscription(req.id);
      showToast(`❌ Rejected "${req.cardName}" for ${req.email}`);
      await loadRequests();
    } catch (err) {
      console.error('Reject failed:', err);
      showToast('❌ Failed to reject.');
    } finally { setActing(null); }
  }

  async function handleBlock(e) {
    e.preventDefault();
    const target = email.trim().toLowerCase();
    if (!target) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target)) { showToast('⚠️ Enter a valid email.'); return; }
    if (target === ADMIN_EMAIL) { showToast('⚠️ Cannot block superadmin.'); return; }
    if (blocked.some(b => b.email === target)) { showToast('⚠️ Already blocked.'); return; }

    setBlocking(true);
    try {
      await blockUser(target, ADMIN_EMAIL, reason.trim());
      showToast('🚫 User blocked.');
      setEmail('');
      setReason('');
      await loadBlocked();
    } catch (err) {
      console.error('Block failed:', err);
      showToast('❌ Failed to block user.');
    } finally { setBlocking(false); }
  }

  async function handleUnblock(userEmail) {
    if (!window.confirm(`Unblock ${userEmail}?`)) return;
    setUnblocking(userEmail);
    try {
      await unblockUser(userEmail);
      showToast('✅ User unblocked.');
      await loadBlocked();
    } catch (err) {
      console.error('Unblock failed:', err);
      showToast('❌ Failed to unblock user.');
    } finally { setUnblocking(null); }
  }

  function formatDate(ts) {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="admin-panel">
      <h2>⚙️ Admin Panel</h2>

      {/* ── Subscription Requests ── */}
      <div className="admin-block-section">
        <h3 className="admin-section-title">
          📩 Subscription Requests
          <button className="admin-refresh-sm" onClick={loadRequests} title="Refresh">🔄</button>
        </h3>

        {reqLoading ? (
          <p className="admin-empty">Loading requests…</p>
        ) : requests.length === 0 ? (
          <p className="admin-empty">No pending requests. 🎉</p>
        ) : (
          <div className="admin-blocked-list">
            {requests.map(req => (
              <div className="admin-req-card" key={req.id}>
                <div className="admin-blocked-info">
                  <span className="admin-blocked-email">📧 {req.email}</span>
                  <span className="admin-req-card-name">🎨 {req.cardName}</span>
                  <span className="admin-blocked-date">Requested: {formatDate(req.requestedAt)}</span>
                </div>
                <div className="admin-req-actions">
                  <button
                    className="admin-btn admin-btn-approve"
                    onClick={() => handleApprove(req)}
                    disabled={acting === req.id}
                  >
                    {acting === req.id ? '⏳' : '✅'} Approve
                  </button>
                  <button
                    className="admin-btn admin-btn-reject"
                    onClick={() => handleReject(req)}
                    disabled={acting === req.id}
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Block User Form ── */}
      <div className="admin-block-section">
        <h3 className="admin-section-title">🚫 Block a User</h3>
        <form className="admin-block-form" onSubmit={handleBlock}>
          <input
            type="email"
            className="admin-input"
            placeholder="Enter user email to block…"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            className="admin-input admin-input-reason"
            placeholder="Reason (optional)"
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
          <button type="submit" className="admin-btn admin-btn-block" disabled={blocking}>
            {blocking ? '⏳ Blocking…' : '🚫 Block User'}
          </button>
        </form>
      </div>

      {/* ── Blocked Users List ── */}
      <div className="admin-block-section">
        <h3 className="admin-section-title">
          📋 Blocked Users
          <button className="admin-refresh-sm" onClick={loadBlocked} title="Refresh">🔄</button>
        </h3>

        {loading ? (
          <p className="admin-empty">Loading…</p>
        ) : blocked.length === 0 ? (
          <p className="admin-empty">No blocked users. 🎉</p>
        ) : (
          <div className="admin-blocked-list">
            {blocked.map(b => (
              <div className="admin-blocked-card" key={b.id}>
                <div className="admin-blocked-info">
                  <span className="admin-blocked-email">📧 {b.email}</span>
                  {b.reason && <span className="admin-blocked-reason">Reason: {b.reason}</span>}
                  <span className="admin-blocked-date">Blocked: {formatDate(b.blockedAt)}</span>
                </div>
                <button
                  className="admin-btn admin-btn-unblock"
                  onClick={() => handleUnblock(b.email)}
                  disabled={unblocking === b.email}
                >
                  {unblocking === b.email ? '⏳' : '✅'} Unblock
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  );
}
