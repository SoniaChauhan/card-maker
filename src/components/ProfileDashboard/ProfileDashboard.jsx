'use client';
import { useState } from 'react';
import './ProfileDashboard.css';
import { useAuth } from '../../contexts/AuthContext';
import AdminPanel from '../AdminPanel/AdminPanel';
import MyTemplates from '../MyTemplates/MyTemplates';
import DownloadHistory from '../DownloadHistory/DownloadHistory';
import Toast from '../shared/Toast';
import { CATEGORIES } from '../SelectionScreen/SelectionScreen';
import { maskEmail } from '../../utils/helpers';
import { sendFeedback } from '../../services/notificationService';

export default function ProfileDashboard({ onSelect, onEditTemplate }) {
  const { user, logout, isSuperAdmin, isGuest, isFreePlan } = useAuth();
  const [tab, setTab]       = useState('dashboard');
  const [toast, setToast]   = useState({ show: false, text: '' });

  /* Feedback state */
  const [fbRating, setFbRating]   = useState(0);
  const [fbHover, setFbHover]     = useState(0);
  const [fbComment, setFbComment] = useState('');
  const [fbSending, setFbSending] = useState(false);
  const [fbMsg, setFbMsg]         = useState('');

  /* Handle card click — directly open the card */
  function handleCardClick(card) {
    if (card.comingSoon) {
      setToast({ show: true, text: `🚀 "${card.label}" is coming soon! Stay tuned.` });
      setTimeout(() => setToast({ show: false, text: '' }), 2500);
      return;
    }
    if (isFreePlan) {
      setToast({ show: true, text: '🔒 Upgrade to Premium to create cards. Contact admin for access.' });
      setTimeout(() => setToast({ show: false, text: '' }), 3000);
      return;
    }
    onSelect(card.id);
  }

  /* Handle feedback submit */
  async function handleFeedbackSubmit(e) {
    e.preventDefault();
    setFbMsg('');
    if (!fbRating) { setFbMsg('⚠️ Please select a star rating.'); return; }
    if (!fbComment.trim()) { setFbMsg('⚠️ Please write a comment.'); return; }
    setFbSending(true);
    try {
      await sendFeedback(user.name || '', user.email || '', fbRating, fbComment.trim());
      setFbMsg('✅ Thank you for your feedback!');
      setFbRating(0); setFbComment('');
    } catch {
      setFbMsg('⚠️ Failed to send. Please try again.');
    } finally { setFbSending(false); }
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
        {!isGuest && <button className="pd-logout" onClick={logout}>🚪 Logout</button>}
      </div>

      {/* Tabs */}
      <div className="pd-tabs">
        {!isGuest && (
          <button className={`pd-tab ${tab === 'profile' ? 'active' : ''}`} onClick={() => setTab('profile')}>👤 Profile</button>
        )}
        <button className={`pd-tab ${tab === 'dashboard' ? 'active' : ''}`} onClick={() => setTab('dashboard')}>🏠 Dashboard</button>
        {!isGuest && (
          <button className={`pd-tab ${tab === 'feedback' ? 'active' : ''}`} onClick={() => setTab('feedback')}>⭐ Feedback</button>
        )}
        {!isGuest && !isFreePlan && (
          <>
            <button className={`pd-tab ${tab === 'templates' ? 'active' : ''}`} onClick={() => setTab('templates')}>📋 My Templates</button>
            <button className={`pd-tab ${tab === 'downloads' ? 'active' : ''}`} onClick={() => setTab('downloads')}>📥 Downloads</button>
          </>
        )}
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
              {isSuperAdmin ? '⭐ Super Admin' : isFreePlan ? '🆓 Free Plan' : '💎 Premium'}
            </div>

            {/* Info rows */}
            <div className="pd-info-grid">
              <div className="pd-info-item">
                <span className="pd-info-icon">📧</span>
                <div>
                  <div className="pd-info-label">Email</div>
                  <div className="pd-info-value">{maskEmail(user.email)}</div>
                </div>
              </div>
              <div className="pd-info-item">
                <span className="pd-info-icon">🛡️</span>
                <div>
                  <div className="pd-info-label">Role</div>
                  <div className="pd-info-value">{isSuperAdmin ? 'Super Admin' : isFreePlan ? 'Free' : 'Premium'}</div>
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
                : isFreePlan
                ? '🔒 You are on the Free plan. You can submit feedback & reviews. Contact admin to upgrade to Premium for card creation.'
                : '💡 Go to the Dashboard tab to explore and create card templates.'}
            </div>
          </div>
        </div>
      )}

      {/* Dashboard tab */}
      {tab === 'dashboard' && (
        <div className="pd-categories-wrapper">
          {isFreePlan && (
            <div className="pd-free-banner">
              🔒 You are on the <strong>Free</strong> plan. Only Feedback &amp; Review is available. Contact admin to upgrade to Premium.
            </div>
          )}
          {CATEGORIES.map(cat => (
            <section key={cat.id} className="pd-category">
              <h2 className="pd-category-title">{cat.title}</h2>
              <div className="pd-cards-grid">
                {cat.cards.map(card => (
                  <div
                    key={card.id}
                    className={`pd-card ${card.id}${card.comingSoon ? ' pd-coming-soon' : ''}${isFreePlan && !card.comingSoon ? ' pd-locked' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleCardClick(card)}
                    onKeyDown={e => e.key === 'Enter' && handleCardClick(card)}
                  >
                    {card.comingSoon && <span className="pd-coming-soon-tag">🔒 Coming Soon</span>}
                    {isFreePlan && !card.comingSoon && <span className="pd-locked-tag">🔒 Premium</span>}
                    <span className="pd-card-icon">{card.icon}</span>
                    <h3>{card.label}</h3>
                    <p>{card.desc}</p>
                    <span className="pd-card-badge">{card.badge}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Admin panel tab */}
      {tab === 'admin' && isSuperAdmin && <AdminPanel />}

      {/* Feedback tab */}
      {tab === 'feedback' && !isGuest && (
        <div className="pd-feedback-section">
          <h2>⭐ Rate & Review</h2>
          <p className="pd-feedback-desc">We'd love to hear your thoughts! Your feedback helps us improve.</p>
          <form className="pd-feedback-form" onSubmit={handleFeedbackSubmit}>
            <div className="pd-fb-stars">
              {[1, 2, 3, 4, 5].map(s => (
                <span
                  key={s}
                  className={`pd-star ${s <= (fbHover || fbRating) ? 'active' : ''}`}
                  onClick={() => setFbRating(s)}
                  onMouseEnter={() => setFbHover(s)}
                  onMouseLeave={() => setFbHover(0)}
                >★</span>
              ))}
              {fbRating > 0 && <span className="pd-rating-label">{fbRating}/5</span>}
            </div>
            <textarea
              className="pd-fb-textarea"
              placeholder="Write your review or feedback..."
              value={fbComment}
              onChange={e => setFbComment(e.target.value)}
              rows={4}
            />
            <button type="submit" className="pd-fb-submit" disabled={fbSending}>
              {fbSending ? '⏳ Sending…' : '📩 Submit Feedback'}
            </button>
            {fbMsg && <p className={`pd-fb-msg ${fbMsg.startsWith('✅') ? 'success' : 'error'}`}>{fbMsg}</p>}
          </form>
        </div>
      )}

      {/* My Templates tab */}
      {tab === 'templates' && !isGuest && !isFreePlan && (
        <MyTemplates userEmail={user.email} onEditTemplate={onEditTemplate} />
      )}

      {/* Download History tab */}
      {tab === 'downloads' && !isGuest && !isFreePlan && (
        <DownloadHistory userEmail={user.email} />
      )}

      <Toast text={toast.text} show={toast.show} />
    </div>
  );
}
