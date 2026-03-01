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
import { sendFeedback, sendOTPEmail } from '../../services/notificationService';
import {
  generateOTP, storeOTP, verifyOTP,
  signUpUser, userExists,
} from '../../services/authService';

export default function ProfileDashboard({ onSelect, onEditTemplate }) {
  const { user, logout, login, isSuperAdmin, isGuest, isFreePlan } = useAuth();
  const [tab, setTab]       = useState('dashboard');
  const [toast, setToast]   = useState({ show: false, text: '' });

  /* Feedback state */
  const [fbRating, setFbRating]   = useState(0);
  const [fbHover, setFbHover]     = useState(0);
  const [fbComment, setFbComment] = useState('');
  const [fbSending, setFbSending] = useState(false);
  const [fbMsg, setFbMsg]         = useState('');

  /* Signup popup state */
  const [showSignup, setShowSignup]   = useState(false);
  const [suMode, setSuMode]           = useState('form'); // 'form' | 'otp'
  const [suName, setSuName]           = useState('');
  const [suEmail, setSuEmail]         = useState('');
  const [suPassword, setSuPassword]   = useState('');
  const [suConfirmPw, setSuConfirmPw] = useState('');
  const [suOtp, setSuOtp]             = useState('');
  const [suShowPw, setSuShowPw]       = useState(false);
  const [suLoading, setSuLoading]     = useState(false);
  const [suError, setSuError]         = useState('');
  const [suInfo, setSuInfo]           = useState('');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function openSignup() {
    setSuMode('form'); setSuName(''); setSuEmail(''); setSuPassword('');
    setSuConfirmPw(''); setSuOtp(''); setSuError(''); setSuInfo(''); setSuShowPw(false);
    setShowSignup(true);
  }
  function closeSignup() { setShowSignup(false); }

  /* Signup step 1 — collect info & send OTP */
  async function handleSuSubmit(e) {
    e.preventDefault();
    setSuError(''); setSuInfo('');
    const trimmed = suEmail.trim().toLowerCase();
    if (!suName.trim()) { setSuError('Enter your name.'); return; }
    if (!trimmed || !emailRegex.test(trimmed)) { setSuError('Enter a valid email.'); return; }
    if (suPassword.length < 6) { setSuError('Password must be at least 6 characters.'); return; }
    if (suPassword !== suConfirmPw) { setSuError('Passwords do not match.'); return; }
    setSuLoading(true);
    try {
      const exists = await userExists(trimmed);
      if (exists) { setSuError('Account already exists. Please sign in.'); setSuLoading(false); return; }
      const code = generateOTP();
      await storeOTP(trimmed, code);
      await sendOTPEmail(trimmed, code);
      setSuInfo(`OTP sent to ${maskEmail(trimmed)} — check your inbox.`);
      setSuMode('otp');
    } catch (err) {
      setSuError(err?.message || 'Failed to send OTP.');
    } finally { setSuLoading(false); }
  }

  /* Signup step 2 — verify OTP & create account */
  async function handleSuOtp(e) {
    e.preventDefault();
    setSuError(''); setSuInfo('');
    if (suOtp.length !== 6) { setSuError('Enter the 6-digit OTP.'); return; }
    setSuLoading(true);
    try {
      const trimmed = suEmail.trim().toLowerCase();
      const valid = await verifyOTP(trimmed, suOtp);
      if (!valid) { setSuError('Invalid or expired OTP.'); setSuLoading(false); return; }
      const newUser = await signUpUser(suName, trimmed, suPassword);
      login(newUser);
      setShowSignup(false);
      setToast({ show: true, text: '🎉 Account created! All features are now unlocked.' });
      setTimeout(() => setToast({ show: false, text: '' }), 3500);
    } catch (err) {
      setSuError(err?.message || 'Sign-up failed.');
    } finally { setSuLoading(false); }
  }

  /* Resend OTP */
  async function handleSuResend() {
    setSuError(''); setSuInfo('');
    setSuLoading(true);
    try {
      const trimmed = suEmail.trim().toLowerCase();
      const code = generateOTP();
      await storeOTP(trimmed, code);
      await sendOTPEmail(trimmed, code);
      setSuInfo('New OTP sent!');
    } catch { setSuError('Failed to resend OTP.'); }
    finally { setSuLoading(false); }
  }

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
        <div className="pd-topbar-actions">
          {isGuest && (
            <button className="pd-signup-btn" onClick={openSignup}>📝 Sign Up</button>
          )}
          {!isGuest && <button className="pd-logout" onClick={logout}>🚪 Logout</button>}
        </div>
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
          {isGuest && (
            <div className="pd-guest-banner">
              👤 You are browsing as a <strong>Guest</strong>. 
              <button className="pd-guest-signup-link" onClick={openSignup}>Sign up now</button> to unlock all features!
            </div>
          )}
          {isFreePlan && !isGuest && (
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
              autoComplete="off"
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

      {/* Signup popup for guests */}
      {showSignup && (
        <div className="pd-signup-overlay" onClick={closeSignup}>
          <div className="pd-signup-popup" onClick={e => e.stopPropagation()}>
            <button className="pd-signup-close" onClick={closeSignup}>✕</button>
            <div className="pd-signup-icon">✨</div>
            <h2 className="pd-signup-title">{suMode === 'form' ? 'Create Account' : 'Verify Email'}</h2>
            <p className="pd-signup-subtitle">
              {suMode === 'form'
                ? 'Fill in your details to get started'
                : `Enter the 6-digit OTP sent to ${maskEmail(suEmail)}`}
            </p>

            {suError && <div className="pd-signup-error">⚠️ {suError}</div>}
            {suInfo && <div className="pd-signup-info">✅ {suInfo}</div>}

            {suMode === 'form' && (
              <form onSubmit={handleSuSubmit} autoComplete="off">
                <input className="pd-signup-input" type="text" placeholder="Full Name"
                  value={suName} onChange={e => setSuName(e.target.value)} autoComplete="off" autoFocus />
                <input className="pd-signup-input" type="email" placeholder="Email address"
                  value={suEmail} onChange={e => setSuEmail(e.target.value)} autoComplete="off" />
                <div className="pd-signup-pw-wrap">
                  <input className="pd-signup-input" type={suShowPw ? 'text' : 'password'} placeholder="Password (min 6 chars)"
                    value={suPassword} onChange={e => setSuPassword(e.target.value)} autoComplete="new-password" />
                  <button type="button" className="pd-signup-pw-toggle" onClick={() => setSuShowPw(!suShowPw)}>
                    {suShowPw ? '🙈' : '👁️'}
                  </button>
                </div>
                <input className="pd-signup-input" type="password" placeholder="Confirm Password"
                  value={suConfirmPw} onChange={e => setSuConfirmPw(e.target.value)} autoComplete="new-password" />
                <button className="pd-signup-submit" disabled={suLoading}>
                  {suLoading ? '⏳ Sending OTP…' : '📩 Sign Up'}
                </button>
              </form>
            )}

            {suMode === 'otp' && (
              <form onSubmit={handleSuOtp} autoComplete="off">
                <input className="pd-signup-input otp" type="text" maxLength={6} placeholder="Enter 6-digit OTP"
                  value={suOtp} onChange={e => setSuOtp(e.target.value.replace(/\D/g, ''))} autoComplete="off" autoFocus />
                <button className="pd-signup-submit" disabled={suLoading}>
                  {suLoading ? '⏳ Verifying…' : '✅ Verify & Create Account'}
                </button>
                <div className="pd-signup-resend">
                  Didn&apos;t receive it?{' '}
                  <button type="button" onClick={handleSuResend} disabled={suLoading}>Resend OTP</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Toast text={toast.text} show={toast.show} />
    </div>
  );
}
