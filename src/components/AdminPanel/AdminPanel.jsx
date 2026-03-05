'use client';
import { useState, useEffect } from 'react';
import './AdminPanel.css';
import { blockUser, unblockUser, getBlockedUsers } from '../../services/blockService';
import { getPendingRequests, approveSubscription, rejectSubscription } from '../../services/subscriptionService';
import { notifyAdmin } from '../../services/notificationService';
import { ADMIN_EMAIL, getAllUsers, upgradePlan } from '../../services/authService';
import { encodePayload } from '../../utils/payload';

export default function AdminPanel() {
  const [email, setEmail]         = useState('');
  const [reason, setReason]       = useState('');
  const [blocked, setBlocked]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [blocking, setBlocking]   = useState(false);
  const [unblocking, setUnblocking] = useState(null);
  const [toast, setToast]         = useState('');

  /* ── Access Manager state ── */
  const [amSearchEmail, setAmSearchEmail] = useState('');
  const [amSearchPhone, setAmSearchPhone] = useState('');
  const [amPayments, setAmPayments]       = useState([]);
  const [amSearching, setAmSearching]     = useState(false);
  const [amLinkPhone, setAmLinkPhone]     = useState('');
  const [amLinkEmail, setAmLinkEmail]     = useState('');
  const [amLinkCard, setAmLinkCard]       = useState('');
  const [amLinking, setAmLinking]         = useState(false);
  const [amGrantEmail, setAmGrantEmail]   = useState('');
  const [amGrantPhone, setAmGrantPhone]   = useState('');
  const [amGrantCard, setAmGrantCard]     = useState('biodata');
  const [amGrantTier, setAmGrantTier]     = useState('premium');
  const [amGranting, setAmGranting]       = useState(false);

  /* Subscription requests */
  const [requests, setRequests]     = useState([]);
  const [reqLoading, setReqLoading] = useState(true);
  const [acting, setActing]         = useState(null); // id being approved/rejected

  /* User management */
  const [users, setUsers]           = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [toggling, setToggling]     = useState(null);

  /* Visitor stats */
  const [visitorStats, setVisitorStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  /* Feedbacks */
  const [feedbacks, setFeedbacks]       = useState([]);
  const [fbLoading, setFbLoading]       = useState(true);
  const [fbActing, setFbActing]         = useState(null);

  useEffect(() => {
    loadBlocked();
    loadRequests();
    loadUsers();
    loadVisitorStats();
    loadFeedbacks();
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

  async function loadVisitorStats() {
    setStatsLoading(true);
    try {
      const res = await fetch('/api/visitors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stats' }),
      });
      const data = await res.json();
      if (res.ok) setVisitorStats(data);
    } catch (err) {
      console.error('Failed to load visitor stats:', err);
    } finally { setStatsLoading(false); }
  }

  async function loadFeedbacks() {
    setFbLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'admin-list' }),
      });
      if (res.ok) setFeedbacks(await res.json());
    } catch (err) {
      console.error('Failed to load feedbacks:', err);
    } finally { setFbLoading(false); }
  }

  async function handleToggleFeedback(id, currentApproved) {
    setFbActing(id);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle', id, approved: !currentApproved }),
      });
      showToast(currentApproved ? '🙈 Feedback hidden' : '✅ Feedback visible');
      await loadFeedbacks();
    } catch { showToast('❌ Failed to toggle.'); }
    finally { setFbActing(null); }
  }

  async function handleDeleteFeedback(id) {
    if (!window.confirm('Permanently delete this feedback?')) return;
    setFbActing(id);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      });
      showToast('🗑️ Feedback deleted');
      await loadFeedbacks();
    } catch { showToast('❌ Failed to delete.'); }
    finally { setFbActing(null); }
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

  async function loadUsers() {
    setUsersLoading(true);
    try {
      const list = await getAllUsers(ADMIN_EMAIL);
      setUsers(list);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally { setUsersLoading(false); }
  }

  async function handleTogglePlan(userEmail, currentPlan) {
    const newPlan = currentPlan === 'premium' ? 'free' : 'premium';
    if (!window.confirm(`Change ${userEmail} to "${newPlan}" plan?`)) return;
    setToggling(userEmail);
    try {
      await upgradePlan(userEmail, newPlan, ADMIN_EMAIL);
      showToast(`✅ ${userEmail} is now ${newPlan}`);
      await loadUsers();
    } catch (err) {
      console.error('Plan change failed:', err);
      showToast('❌ Failed to change plan.');
    } finally { setToggling(null); }
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

  /* ── Access Manager helpers ── */
  async function amApiCall(body) {
    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _p: encodePayload(body) }),
    });
    return res.json();
  }

  async function handleAmSearch() {
    if (!amSearchEmail.trim() && !amSearchPhone.trim()) { showToast('⚠️ Enter email or phone to search.'); return; }
    setAmSearching(true);
    try {
      const data = await amApiCall({ action: 'searchPayments', email: amSearchEmail.trim(), phone: amSearchPhone.trim(), adminEmail: ADMIN_EMAIL });
      if (data.error) { showToast('❌ ' + data.error); setAmPayments([]); }
      else { setAmPayments(data.payments || []); if (!data.payments?.length) showToast('No payment records found.'); }
    } catch (err) { showToast('❌ Search failed: ' + err.message); }
    finally { setAmSearching(false); }
  }

  async function handleAmLinkPhone() {
    if (!amLinkEmail.trim() || !amLinkPhone.trim()) { showToast('⚠️ Both email and phone are required.'); return; }
    setAmLinking(true);
    try {
      const data = await amApiCall({ action: 'linkPhone', email: amLinkEmail.trim(), phone: amLinkPhone.trim(), cardType: amLinkCard.trim() || undefined, adminEmail: ADMIN_EMAIL });
      if (data.ok) { showToast('✅ ' + data.message); handleAmSearch(); }
      else showToast('❌ ' + (data.error || 'Failed'));
    } catch (err) { showToast('❌ Link failed: ' + err.message); }
    finally { setAmLinking(false); }
  }

  async function handleAmGrant() {
    if (!amGrantEmail.trim() && !amGrantPhone.trim()) { showToast('⚠️ Provide email or phone.'); return; }
    if (!amGrantCard) { showToast('⚠️ Select a card type.'); return; }
    setAmGranting(true);
    try {
      const data = await amApiCall({ action: 'grantAccess', email: amGrantEmail.trim(), phone: amGrantPhone.trim(), cardType: amGrantCard, tier: amGrantTier, adminEmail: ADMIN_EMAIL });
      if (data.ok) { showToast('✅ ' + data.message); }
      else showToast('❌ ' + (data.error || 'Failed'));
    } catch (err) { showToast('❌ Grant failed: ' + err.message); }
    finally { setAmGranting(false); }
  }

  function formatDate(ts) {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="admin-panel">
      <h2>⚙️ Admin Panel</h2>

      {/* ── Visitor Analytics ── */}
      <div className="admin-block-section">
        <h3 className="admin-section-title">
          📊 Visitor Analytics
          <button className="admin-refresh-sm" onClick={loadVisitorStats} title="Refresh">🔄</button>
        </h3>

        {statsLoading ? (
          <p className="admin-empty">Loading visitor stats…</p>
        ) : !visitorStats ? (
          <p className="admin-empty">No visitor data yet.</p>
        ) : (
          <>
            {/* Summary cards */}
            <div className="visitor-stats-grid">
              <div className="visitor-stat-card">
                <span className="visitor-stat-number">{visitorStats.today.visits}</span>
                <span className="visitor-stat-label">Today Visits</span>
                <span className="visitor-stat-sub">{visitorStats.today.unique} unique</span>
              </div>
              <div className="visitor-stat-card">
                <span className="visitor-stat-number">{visitorStats.week.visits}</span>
                <span className="visitor-stat-label">This Week</span>
                <span className="visitor-stat-sub">{visitorStats.week.unique} unique</span>
              </div>
              <div className="visitor-stat-card">
                <span className="visitor-stat-number">{visitorStats.month.visits}</span>
                <span className="visitor-stat-label">This Month</span>
                <span className="visitor-stat-sub">{visitorStats.month.unique} unique</span>
              </div>
              <div className="visitor-stat-card">
                <span className="visitor-stat-number">{visitorStats.total.visits}</span>
                <span className="visitor-stat-label">All Time</span>
                <span className="visitor-stat-sub">{visitorStats.total.unique} unique</span>
              </div>
            </div>

            {/* Daily bar chart */}
            {visitorStats.dailyStats?.length > 0 && (
              <div className="visitor-daily-chart">
                <h4 className="visitor-chart-title">📈 Last 7 Days</h4>
                <div className="visitor-bars">
                  {visitorStats.dailyStats.map(d => {
                    const maxVisits = Math.max(...visitorStats.dailyStats.map(x => x.visits), 1);
                    const pct = Math.round((d.visits / maxVisits) * 100);
                    const dayLabel = new Date(d.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
                    return (
                      <div className="visitor-bar-col" key={d.date}>
                        <span className="visitor-bar-count">{d.visits}</span>
                        <div className="visitor-bar" style={{ height: `${Math.max(pct, 5)}%` }} title={`${d.visits} visits, ${d.unique} unique`} />
                        <span className="visitor-bar-label">{dayLabel}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Top pages */}
            {visitorStats.topPages?.length > 0 && (
              <div className="visitor-top-pages">
                <h4 className="visitor-chart-title">🔥 Top Pages (30 days)</h4>
                {visitorStats.topPages.map((p, i) => (
                  <div className="visitor-page-row" key={i}>
                    <span className="visitor-page-name">{p.page || '/'}</span>
                    <span className="visitor-page-count">{p.count} visits</span>
                  </div>
                ))}
              </div>
            )}

            {/* Recent visitors */}
            {visitorStats.recentVisitors?.length > 0 && (
              <div className="visitor-recent">
                <h4 className="visitor-chart-title">🕐 Recent Visitors</h4>
                <div className="visitor-recent-list">
                  {visitorStats.recentVisitors.map((v, i) => (
                    <div className="visitor-recent-row" key={i}>
                      <span className="visitor-recent-page">{v.page || '/'}</span>
                      <span className="visitor-recent-ip">🌐 {v.ip}</span>
                      <span className="visitor-recent-info">
                        {v.language} · {v.screenWidth}×{v.screenHeight}
                      </span>
                      <span className="visitor-recent-time">
                        {new Date(v.visitedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

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

      {/* ── User Plan Management ── */}
      <div className="admin-block-section">
        <h3 className="admin-section-title">
          👥 User Plans
          <button className="admin-refresh-sm" onClick={loadUsers} title="Refresh">🔄</button>
        </h3>

        {usersLoading ? (
          <p className="admin-empty">Loading users…</p>
        ) : users.length === 0 ? (
          <p className="admin-empty">No users yet.</p>
        ) : (
          <div className="admin-blocked-list">
            {users.map(u => (
              <div className="admin-req-card" key={u.id}>
                <div className="admin-blocked-info">
                  <span className="admin-blocked-email">📧 {u.email}</span>
                  <span className="admin-req-card-name">{u.name || '—'}</span>
                  <span className="admin-blocked-date">
                    Plan: <strong style={{ color: u.plan === 'premium' ? '#22c55e' : '#f59e0b' }}>{u.plan || 'free'}</strong>
                    {' · '}Joined: {formatDate(u.createdAt)}
                  </span>
                </div>
                <div className="admin-req-actions">
                  {u.email !== ADMIN_EMAIL && (
                    <button
                      className={`admin-btn ${u.plan === 'premium' ? 'admin-btn-reject' : 'admin-btn-approve'}`}
                      onClick={() => handleTogglePlan(u.email, u.plan || 'free')}
                      disabled={toggling === u.email}
                    >
                      {toggling === u.email ? '⏳' : u.plan === 'premium' ? '⬇️ Downgrade' : '⬆️ Upgrade'}
                    </button>
                  )}
                  {u.email === ADMIN_EMAIL && (
                    <span style={{ color: '#888', fontSize: '12px' }}>Admin</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Feedbacks Management ── */}
      <div className="admin-block-section">
        <h3 className="admin-section-title">
          ⭐ User Feedbacks
          <button className="admin-refresh-sm" onClick={loadFeedbacks} title="Refresh">🔄</button>
        </h3>

        {fbLoading ? (
          <p className="admin-empty">Loading feedbacks…</p>
        ) : feedbacks.length === 0 ? (
          <p className="admin-empty">No feedbacks yet.</p>
        ) : (
          <div className="admin-blocked-list">
            {feedbacks.map(fb => (
              <div className={`admin-req-card ${!fb.approved ? 'admin-fb-hidden' : ''}`} key={fb.id}>
                <div className="admin-blocked-info">
                  <span className="admin-blocked-email">👤 {fb.name} — 📧 {fb.email}</span>
                  <span className="admin-req-card-name">
                    {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)} ({fb.rating}/5)
                  </span>
                  <span className="admin-blocked-reason" style={{ color: '#ddd' }}>💬 {fb.comment}</span>
                  <span className="admin-blocked-date">
                    {fb.approved ? '✅ Visible' : '🙈 Hidden'} · {formatDate(fb.createdAt)}
                  </span>
                </div>
                <div className="admin-req-actions">
                  <button
                    className={`admin-btn ${fb.approved ? 'admin-btn-reject' : 'admin-btn-approve'}`}
                    onClick={() => handleToggleFeedback(fb.id, fb.approved)}
                    disabled={fbActing === fb.id}
                  >
                    {fbActing === fb.id ? '⏳' : fb.approved ? '🙈 Hide' : '👁️ Show'}
                  </button>
                  <button
                    className="admin-btn admin-btn-reject"
                    onClick={() => handleDeleteFeedback(fb.id)}
                    disabled={fbActing === fb.id}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Access Manager ── */}
      <div className="admin-block-section">
        <h3 className="admin-section-title">🔑 Access Manager</h3>
        <p className="admin-am-desc">Search, link phone numbers, or grant manual access for users who paid with email.</p>

        {/* Search payments */}
        <div className="admin-am-group">
          <h4 className="admin-am-subtitle">🔍 Search Payment Records</h4>
          <div className="admin-am-row">
            <input className="admin-input" placeholder="Email (e.g. user@email.com)" value={amSearchEmail} onChange={e => setAmSearchEmail(e.target.value)} />
            <input className="admin-input" placeholder="Phone (e.g. 9876543210)" value={amSearchPhone} onChange={e => setAmSearchPhone(e.target.value.replace(/\D/g, ''))} maxLength={10} />
            <button className="admin-btn admin-btn-approve" onClick={handleAmSearch} disabled={amSearching}>
              {amSearching ? '⏳ Searching...' : '🔍 Search'}
            </button>
          </div>
          {amPayments.length > 0 && (
            <div className="admin-am-results">
              <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '12px', margin: '0 0 6px' }}>Found {amPayments.length} record(s)</p>
              <table className="admin-am-table">
                <thead>
                  <tr><th>Source</th><th>Card</th><th>Email</th><th>Phone</th><th>Tier</th><th>Status</th><th>Txn ID</th><th>Expires</th></tr>
                </thead>
                <tbody>
                  {amPayments.map(p => (
                    <tr key={p.id + p.source} className={p.unlockedUntil && new Date(p.unlockedUntil) > new Date() ? 'am-active' : 'am-expired'}>
                      <td><span style={{ background: p.source === 'payments' ? '#4ade80' : p.source === 'orders' ? '#60a5fa' : '#fbbf24', color: '#000', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>{p.source}</span></td>
                      <td>{p.cardType}</td>
                      <td>{p.email || '—'}</td>
                      <td>{p.phone || <span className="am-missing">❌ No phone</span>}</td>
                      <td>{p.tier || '—'}</td>
                      <td>{p.status}</td>
                      <td style={{ fontSize: '10px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.razorpayPaymentId || '—'}</td>
                      <td>{p.unlockedUntil ? new Date(p.unlockedUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Link phone to email */}
        <div className="admin-am-group">
          <h4 className="admin-am-subtitle">🔗 Link Phone to Email</h4>
          <p className="admin-am-hint">Adds a phone number to all payment records of an email. This lets the user access their paid content using their phone number.</p>
          <div className="admin-am-row">
            <input className="admin-input" placeholder="Email *" value={amLinkEmail} onChange={e => setAmLinkEmail(e.target.value)} />
            <input className="admin-input" placeholder="Phone *" value={amLinkPhone} onChange={e => setAmLinkPhone(e.target.value.replace(/\D/g, ''))} maxLength={10} />
            <input className="admin-input" placeholder="Card type (optional)" value={amLinkCard} onChange={e => setAmLinkCard(e.target.value)} />
            <button className="admin-btn admin-btn-approve" onClick={handleAmLinkPhone} disabled={amLinking}>
              {amLinking ? '⏳ Linking...' : '🔗 Link Phone'}
            </button>
          </div>
        </div>

        {/* Grant manual access */}
        <div className="admin-am-group">
          <h4 className="admin-am-subtitle">🎁 Grant Manual Access (7 days)</h4>
          <p className="admin-am-hint">Creates a new payment record for a user — no Razorpay needed.</p>
          <div className="admin-am-row">
            <input className="admin-input" placeholder="Email" value={amGrantEmail} onChange={e => setAmGrantEmail(e.target.value)} />
            <input className="admin-input" placeholder="Phone" value={amGrantPhone} onChange={e => setAmGrantPhone(e.target.value.replace(/\D/g, ''))} maxLength={10} />
            <select className="admin-input" value={amGrantCard} onChange={e => setAmGrantCard(e.target.value)}>
              <option value="biodata">Biodata</option>
              <option value="wedding">Wedding</option>
              <option value="birthday">Birthday</option>
              <option value="anniversary">Anniversary</option>
            </select>
            <select className="admin-input" value={amGrantTier} onChange={e => setAmGrantTier(e.target.value)}>
              <option value="premium">Premium (no watermark)</option>
              <option value="watermark">Watermark</option>
            </select>
            <button className="admin-btn admin-btn-approve" onClick={handleAmGrant} disabled={amGranting}>
              {amGranting ? '⏳ Granting...' : '🎁 Grant Access'}
            </button>
          </div>
        </div>
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
