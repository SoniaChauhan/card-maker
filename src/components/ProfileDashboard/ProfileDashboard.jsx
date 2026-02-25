import { useState, useEffect } from 'react';
import './ProfileDashboard.css';
import { useAuth } from '../../contexts/AuthContext';
import { getUserSubscriptions } from '../../services/subscriptionService';
import { notifyAdmin } from '../../services/notificationService';
import SubscriptionPopup from '../SubscriptionPopup/SubscriptionPopup';
import AdminPanel from '../AdminPanel/AdminPanel';

const CARDS = [
  { id: 'birthday',    label: 'Birthday Invitation',  desc: 'Create personalised birthday party invitations.',   icon: '🎂', badge: '🎉 Festive & Fun' },
  { id: 'anniversary', label: 'Anniversary Card',      desc: 'Honour a love story with a romantic card.',         icon: '💍', badge: '❤️ Romantic' },
  { id: 'jagrata',     label: 'Jagrata Invitation',    desc: 'Beautiful divine invitation for Khatushyam Ji.',   icon: '🪔', badge: '🙏 Divine Blessing' },
  { id: 'biodata',     label: 'Marriage Biodata',       desc: 'Traditional Indian marriage biodata with details.', icon: '💍', badge: '🌸 Traditional' },
  { id: 'wedding',     label: 'Wedding Invitation',    desc: 'Royal invitation for your wedding ceremony.',       icon: '💐', badge: '🌸 Royal & Classic' },
  { id: 'resume',      label: 'Resume / CV',            desc: 'Build a professional resume & download PDF.',       icon: '📄', badge: '💼 Professional' },
];

export default function ProfileDashboard({ onSelect }) {
  const { user, logout, isSuperAdmin } = useAuth();
  const [tab, setTab]       = useState('dashboard');
  const [subs, setSubs]     = useState({});
  const [popup, setPopup]   = useState(null);   // card object or null
  const [loading, setLoading] = useState(true);

  /* Fetch user subscriptions on mount */
  useEffect(() => {
    if (!isSuperAdmin && user) {
      getUserSubscriptions(user.email)
        .then(s => { setSubs(s); setLoading(false); })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, isSuperAdmin]);

  /* Refresh subs when popup closes */
  function refreshSubs() {
    if (!isSuperAdmin && user) {
      getUserSubscriptions(user.email).then(setSubs).catch(() => {});
    }
  }

  /* Handle card click */
  function handleCardClick(card) {
    if (isSuperAdmin) {
      /* Admin — direct access */
      onSelect(card.id);
      return;
    }

    const status = subs[card.id];
    if (status === 'approved') {
      onSelect(card.id);
      return;
    }

    /* Notify admin that user tried to click a card */
    notifyAdmin(
      `Card Click Alert — ${card.label}`,
      `User ${user.email} tried to access "${card.label}" card at ${new Date().toLocaleString()}.`
    ).catch(() => {});

    /* Show subscription popup */
    setPopup(card);
  }

  const displayName = user?.name || user?.email || '?';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="profile-dashboard">
      {/* Top bar */}
      <div className="pd-topbar">
        <div className="pd-logo">✨ Card Maker</div>
        <button className="pd-logout" onClick={logout}>🚪 Logout</button>
      </div>

      {/* Tabs */}
      <div className="pd-tabs">
        <button className={`pd-tab ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>👤 Profile</button>
        <button className={`pd-tab ${tab === 'dashboard' ? 'active' : ''}`} onClick={() => setTab('dashboard')}>🏠 Dashboard</button>
        {isSuperAdmin && (
          <button className={`pd-tab ${tab === 'admin' ? 'active' : ''}`} onClick={() => setTab('admin')}>⚙️ Admin</button>
        )}
      </div>

      {/* Profile tab */}
      {tab === 'profile' && (
        <div className="pd-profile-section">
          {/* Hero banner */}
          <div className="pd-profile-hero">
            <div className="pd-profile-hero-bg" />
            <div className="pd-avatar-large">{initial}</div>
          </div>

          {/* Main info card */}
          <div className="pd-profile-card">
            <h3 className="pd-profile-name">
              {isSuperAdmin ? 'Sonia Chauhan' : (user.name || 'Card Maker User')}
            </h3>
            <div className="pd-role-badge">
              {isSuperAdmin ? '⭐ Super Admin' : '👤 Member'}
            </div>

            {/* Info rows */}
            <div className="pd-info-grid">
              <div className="pd-info-item">
                <span className="pd-info-icon">📧</span>
                <div>
                  <div className="pd-info-label">Email</div>
                  <div className="pd-info-value">{user.email}</div>
                </div>
              </div>
              <div className="pd-info-item">
                <span className="pd-info-icon">🛡️</span>
                <div>
                  <div className="pd-info-label">Role</div>
                  <div className="pd-info-value">{isSuperAdmin ? 'Super Admin' : 'User'}</div>
                </div>
              </div>
              <div className="pd-info-item">
                <span className="pd-info-icon">📅</span>
                <div>
                  <div className="pd-info-label">Member Since</div>
                  <div className="pd-info-value">{new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}</div>
                </div>
              </div>
              <div className="pd-info-item">
                <span className="pd-info-icon">🎨</span>
                <div>
                  <div className="pd-info-label">Templates</div>
                  <div className="pd-info-value">{isSuperAdmin ? `${CARDS.length} (All Access)` : `${Object.values(subs).filter(s => s === 'approved').length} Approved`}</div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="pd-profile-msg">
              {isSuperAdmin
                ? '🚀 You have full access to all templates and the admin panel.'
                : '💡 Go to the Dashboard tab to explore and request card templates.'}
            </div>
          </div>
        </div>
      )}

      {/* Dashboard tab */}
      {tab === 'dashboard' && (
        <div className="pd-cards-grid">
          {CARDS.map(card => {
            const status = subs[card.id];
            return (
              <div
                key={card.id}
                className={`pd-card ${card.id}`}
                role="button"
                tabIndex={0}
                onClick={() => handleCardClick(card)}
                onKeyDown={e => e.key === 'Enter' && handleCardClick(card)}
              >
                {/* Lock icon for non-admin users without approval */}
                {!isSuperAdmin && status !== 'approved' && (
                  <span className="pd-card-lock">🔒</span>
                )}

                {/* Status badge */}
                {!isSuperAdmin && status && (
                  <span className={`pd-card-status ${status}`}>{status}</span>
                )}

                <span className="pd-card-icon">{card.icon}</span>
                <h3>{card.label}</h3>
                <p>{card.desc}</p>
                <span className="pd-card-badge">{card.badge}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Admin panel tab */}
      {tab === 'admin' && isSuperAdmin && <AdminPanel />}

      {/* Subscription popup */}
      {popup && (
        <SubscriptionPopup
          card={popup}
          userEmail={user.email}
          existingStatus={subs[popup.id] || null}
          onClose={() => { setPopup(null); refreshSubs(); }}
        />
      )}
    </div>
  );
}
