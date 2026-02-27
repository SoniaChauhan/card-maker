'use client';
import { useState, useEffect } from 'react';
import './ProfileDashboard.css';
import { useAuth } from '../../contexts/AuthContext';
import AdminPanel from '../AdminPanel/AdminPanel';
import MyTemplates from '../MyTemplates/MyTemplates';
import DownloadHistory from '../DownloadHistory/DownloadHistory';
import SubscriptionPopup from '../SubscriptionPopup/SubscriptionPopup';
import Toast from '../shared/Toast';
import { CATEGORIES } from '../SelectionScreen/SelectionScreen';
import { getUserSubscriptions } from '../../services/subscriptionService';

export default function ProfileDashboard({ onSelect, onEditTemplate }) {
  const { user, logout, isSuperAdmin } = useAuth();
  const [tab, setTab]       = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [toast, setToast]   = useState({ show: false, text: '' });
  const [subs, setSubs]     = useState({});       // { [cardId]: 'pending'|'approved'|'rejected' }
  const [subPopup, setSubPopup] = useState(null); // card object to show popup for

  /* Load user subscriptions on mount */
  useEffect(() => {
    if (user?.email && !isSuperAdmin) {
      getUserSubscriptions(user.email).then(setSubs).catch(() => {});
    }
  }, [user?.email, isSuperAdmin]);

  /* Handle card click — check subscription before allowing access */
  function handleCardClick(card) {
    if (card.comingSoon) {
      setToast({ show: true, text: `🚀 "${card.label}" is coming soon! Stay tuned.` });
      setTimeout(() => setToast({ show: false, text: '' }), 2500);
      return;
    }

    // Superadmin bypasses subscription check
    if (isSuperAdmin) {
      onSelect(card.id);
      return;
    }

    // Check subscription status
    const status = subs[card.id];
    if (status === 'approved') {
      onSelect(card.id);
    } else {
      // Show subscription popup (pending, rejected, or not requested yet)
      setSubPopup(card);
    }
  }

  /* Total available cards count (non-coming-soon) */
  const totalActive = CATEGORIES.flatMap(c => c.cards).filter(c => !c.comingSoon).length;

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
        <button className={`pd-tab ${tab === 'templates' ? 'active' : ''}`} onClick={() => setTab('templates')}>📋 My Templates</button>
        <button className={`pd-tab ${tab === 'downloads' ? 'active' : ''}`} onClick={() => setTab('downloads')}>📥 Downloads</button>
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
                  <div className="pd-info-value">{`${totalActive} Available`}</div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="pd-profile-msg">
              {isSuperAdmin
                ? '🚀 You have full access to all templates and the admin panel.'
                : '💡 Go to the Dashboard tab to explore and create card templates.'}
            </div>
          </div>
        </div>
      )}

      {/* Dashboard tab */}
      {tab === 'dashboard' && (
        <div className="pd-categories-wrapper">
          {CATEGORIES.map(cat => (
            <section key={cat.id} className="pd-category">
              <h2 className="pd-category-title">{cat.title}</h2>
              <div className="pd-cards-grid">
                {cat.cards.map(card => {
                  const subStatus = subs[card.id];
                  const isLocked = !isSuperAdmin && !card.comingSoon && subStatus !== 'approved';
                  return (
                    <div
                      key={card.id}
                      className={`pd-card ${card.id}${card.comingSoon ? ' pd-coming-soon' : ''}${isLocked ? ' pd-locked' : ''}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleCardClick(card)}
                      onKeyDown={e => e.key === 'Enter' && handleCardClick(card)}
                    >
                      {card.comingSoon && <span className="pd-coming-soon-tag">🔒 Coming Soon</span>}
                      {isLocked && !card.comingSoon && (
                        <span className="pd-lock-tag">
                          {subStatus === 'pending' ? '⏳ Pending' : subStatus === 'rejected' ? '❌ Rejected' : '🔒 Request Access'}
                        </span>
                      )}

                      <span className="pd-card-icon">{card.icon}</span>
                      <h3>{card.label}</h3>
                      <p>{card.desc}</p>
                      <span className="pd-card-badge">{card.badge}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Admin panel tab */}
      {tab === 'admin' && isSuperAdmin && <AdminPanel />}

      {/* My Templates tab */}
      {tab === 'templates' && (
        <MyTemplates userEmail={user.email} onEditTemplate={onEditTemplate} />
      )}

      {/* Download History tab */}
      {tab === 'downloads' && (
        <DownloadHistory userEmail={user.email} />
      )}

      <Toast text={toast.text} show={toast.show} />

      {/* ── Subscription Request Popup ── */}
      {subPopup && (
        <SubscriptionPopup
          card={subPopup}
          userEmail={user.email}
          existingStatus={subs[subPopup.id] || null}
          onClose={() => {
            setSubPopup(null);
            // Refresh subs after closing popup
            getUserSubscriptions(user.email).then(setSubs).catch(() => {});
          }}
        />
      )}
    </div>
  );
}
