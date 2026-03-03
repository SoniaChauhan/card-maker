'use client';
import { useState, useEffect } from 'react';
import './LoginScreen.css';
import { useAuth } from '../../contexts/AuthContext';
import {
  generateOTP, storeOTP, verifyOTP,
  signUpUser, signInUser, resetPassword,
  createOrUpdateUser, userExists,
} from '../../services/authService';
import { sendOTPEmail, notifyAdmin, sendFeedback } from '../../services/notificationService';
import { isUserBlocked } from '../../services/blockService';
import { maskEmail } from '../../utils/helpers';
import AdminPanel from '../AdminPanel/AdminPanel';
import MyTemplates from '../MyTemplates/MyTemplates';
import DownloadHistory from '../DownloadHistory/DownloadHistory';
import Toast from '../shared/Toast';

/*
  Modes:
    signin          – Email + Password (default)
    signup          – Name + Email + Password → OTP verify
    signup-otp      – Enter OTP after signup
    forgot          – Enter email to get reset OTP
    forgot-otp      – Enter OTP for reset
    forgot-newpw    – Set new password
    otp-login       – Login via OTP (no password)
    otp-login-verify – Verify OTP for passwordless login
*/

export default function LoginScreen({ onSelect, onEditTemplate }) {
  const { user, login, loginAsGuest, logout, isGuest, isFreePlan, isSuperAdmin } = useAuth();

  const [mode, setMode]           = useState('signin');
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [otp, setOtp]             = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [info, setInfo]           = useState('');

  /* Account panel overlay */
  const [accountTab, setAccountTab] = useState(null); // null | 'profile' | 'templates' | 'downloads' | 'admin'
  const [toast, setToast]           = useState({ show: false, text: '' });
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  function openAuthPopup(m = 'signin') { switchMode(m); setShowAuthPopup(true); }
  function closeAuthPopup() { setShowAuthPopup(false); resetForm(); }

  /* Feedback state */
  const [fbName, setFbName]       = useState('');
  const [fbEmail, setFbEmail]     = useState('');
  const [fbRating, setFbRating]   = useState(0);
  const [fbHover, setFbHover]     = useState(0);
  const [fbComment, setFbComment] = useState('');
  const [fbSending, setFbSending] = useState(false);
  const [fbMsg, setFbMsg]         = useState('');
  const [reviews, setReviews]     = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  /* Load public reviews on mount */
  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'list' }),
        });
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch { /* silently ignore */ }
      finally { setReviewsLoading(false); }
    }
    loadReviews();
  }, []);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = email.trim().toLowerCase();

  function resetForm() {
    setName(''); setEmail(''); setPassword(''); setConfirmPw('');
    setOtp(''); setError(''); setInfo(''); setShowPw(false);
  }

  function switchMode(m) {
    resetForm();
    setMode(m);
  }

  /* ========== SIGN IN (email + password) ========== */
  async function handleSignIn(e) {
    e.preventDefault();
    setError(''); setInfo('');
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) { setError('Enter a valid email.'); return; }
    if (!password) { setError('Enter your password.'); return; }

    setLoading(true);
    try {
      try {
        if (await isUserBlocked(trimmedEmail)) {
          setError('Your account has been blocked. Contact the admin for assistance.');
          setLoading(false);
          return;
        }
      } catch (_) { /* block-check failed — allow login */ }
      const user = await signInUser(trimmedEmail, password);
      login(user);
      setShowAuthPopup(false);
      notifyAdmin('🔑 User Login — Card Maker',
        `Sender: ${maskEmail(user.email)}\nName: ${user.name}\nRole: ${user.role}\nLogged in at ${new Date().toLocaleString()}.`,
        user.email
      ).catch(() => {});
    } catch (err) {
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('permission')) {
        setError('Server configuration error. Please contact the admin.');
      } else {
        setError(msg || 'Sign-in failed.');
      }
    } finally { setLoading(false); }
  }

  /* ========== SIGN UP step 1 — collect info & send OTP ========== */
  async function handleSignUp(e) {
    e.preventDefault();
    setError(''); setInfo('');
    if (!name.trim()) { setError('Enter your name.'); setName(''); setEmail(''); setPassword(''); setConfirmPw(''); return; }
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) { setError('Enter a valid email.'); setPassword(''); setConfirmPw(''); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); setPassword(''); setConfirmPw(''); return; }
    if (password !== confirmPw) { setError('Passwords do not match.'); setPassword(''); setConfirmPw(''); return; }

    setLoading(true);
    try {
      const exists = await userExists(trimmedEmail);
      if (exists) { setError('Account already exists. Please sign in.'); setLoading(false); return; }

      const code = generateOTP();
      await storeOTP(trimmedEmail, code);
      await sendOTPEmail(trimmedEmail, code);
      setInfo(`OTP sent to ${trimmedEmail} — check your inbox.`);
      setMode('signup-otp');
    } catch (err) {
      console.error('OTP send error:', err);
      const msg = err?.text || err?.message || '';
      setError(msg || 'Failed to send OTP. Please try again.');
    } finally { setLoading(false); }
  }

  /* ========== SIGN UP step 2 — verify OTP & create account ========== */
  async function handleSignUpOTP(e) {
    e.preventDefault();
    setError(''); setInfo('');
    if (otp.length !== 6) { setError('Enter the 6-digit OTP.'); return; }

    setLoading(true);
    try {
      const valid = await verifyOTP(trimmedEmail, otp);
      if (!valid) { setError('Invalid or expired OTP.'); setLoading(false); return; }

      try {
        if (await isUserBlocked(trimmedEmail)) {
          setError('This email has been blocked. Contact the admin for assistance.');
          setLoading(false);
          return;
        }
      } catch (_) { /* block-check failed — allow sign-up */ }
      const user = await signUpUser(name, trimmedEmail, password);
      login(user);
      setShowAuthPopup(false);
      notifyAdmin('🆕 New Sign-Up — Card Maker',
        `Sender: ${maskEmail(user.email)}\nName: ${user.name}\nRole: ${user.role}\nSigned up at ${new Date().toLocaleString()}.`,
        user.email
      ).catch(() => {});
    } catch (err) {
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('permission')) {
        setError('Server configuration error. Please contact the admin.');
      } else {
        setError(msg || 'Sign-up failed.');
      }
    } finally { setLoading(false); }
  }

  /* ========== FORGOT PASSWORD step 1 — send OTP ========== */
  async function handleForgotSend(e) {
    e.preventDefault();
    setError(''); setInfo('');
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) { setError('Enter a valid email.'); return; }

    setLoading(true);
    try {
      const exists = await userExists(trimmedEmail);
      if (!exists) { setError('No account found with this email.'); setLoading(false); return; }

      const code = generateOTP();
      await storeOTP(trimmedEmail, code);
      await sendOTPEmail(trimmedEmail, code);
      setInfo(`OTP sent to ${trimmedEmail}`);
      setMode('forgot-otp');
    } catch (err) {
      console.error('OTP send error:', err);
      const msg = err?.text || err?.message || '';
      setError(msg || 'Failed to send OTP. Please try again.');
    } finally { setLoading(false); }
  }

  /* ========== FORGOT PASSWORD step 2 — verify OTP ========== */
  async function handleForgotOTP(e) {
    e.preventDefault();
    setError(''); setInfo('');
    if (otp.length !== 6) { setError('Enter the 6-digit OTP.'); return; }

    setLoading(true);
    try {
      const valid = await verifyOTP(trimmedEmail, otp);
      if (!valid) { setError('Invalid or expired OTP.'); setLoading(false); return; }
      setInfo('OTP verified! Set your new password.');
      setOtp('');
      setMode('forgot-newpw');
    } catch (err) {
      setError('Verification failed.');
    } finally { setLoading(false); }
  }

  /* ========== FORGOT PASSWORD step 3 — set new password ========== */
  async function handleNewPassword(e) {
    e.preventDefault();
    setError(''); setInfo('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPw) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      await resetPassword(trimmedEmail, password);
      setInfo('Password reset successfully! Please sign in.');
      setPassword(''); setConfirmPw('');
      setTimeout(() => switchMode('signin'), 1500);
    } catch (err) {
      setError(err.message || 'Reset failed.');
    } finally { setLoading(false); }
  }

  /* ========== OTP LOGIN step 1 — send OTP ========== */
  async function handleOTPLoginSend(e) {
    e.preventDefault();
    setError(''); setInfo('');
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) { setError('Enter a valid email.'); return; }

    setLoading(true);
    try {
      const code = generateOTP();
      await storeOTP(trimmedEmail, code);
      await sendOTPEmail(trimmedEmail, code);
      setInfo(`OTP sent to ${trimmedEmail}`);
      setMode('otp-login-verify');
    } catch (err) {
      console.error('OTP send error:', err);
      const msg = err?.text || err?.message || '';
      setError(msg || 'Failed to send OTP. Please try again.');
    } finally { setLoading(false); }
  }

  /* ========== OTP LOGIN step 2 — verify ========== */
  async function handleOTPLoginVerify(e) {
    e.preventDefault();
    setError(''); setInfo('');
    if (otp.length !== 6) { setError('Enter the 6-digit OTP.'); return; }

    setLoading(true);
    try {
      const valid = await verifyOTP(trimmedEmail, otp);
      if (!valid) { setError('Invalid or expired OTP.'); setLoading(false); return; }

      try {
        if (await isUserBlocked(trimmedEmail)) {
          setError('Your account has been blocked. Contact the admin for assistance.');
          setLoading(false);
          return;
        }
      } catch (_) { /* block-check failed — allow login */ }
      const user = await createOrUpdateUser(trimmedEmail);
      login(user);
      setShowAuthPopup(false);
      notifyAdmin('🔑 OTP Login — Card Maker',
        `Sender: ${maskEmail(user.email)}\nRole: ${user.role}\nLogged in via OTP at ${new Date().toLocaleString()}.`,
        user.email
      ).catch(() => {});
    } catch (err) {
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('permission')) {
        setError('Server configuration error. Please contact the admin.');
      } else {
        setError(msg || 'Verification failed.');
      }
    } finally { setLoading(false); }
  }

  /* ========== Resend OTP (reusable) ========== */
  async function handleResend() {
    setError(''); setInfo('');
    setLoading(true);
    try {
      const code = generateOTP();
      await storeOTP(trimmedEmail, code);
      await sendOTPEmail(trimmedEmail, code);
      setInfo('New OTP sent!');
    } catch {
      setError('Failed to resend OTP.');
    } finally { setLoading(false); }
  }

  /* ========== SUBMIT FEEDBACK ========== */
  async function handleFeedbackSubmit(e) {
    e.preventDefault();
    setFbMsg('');
    if (!fbName.trim()) { setFbMsg('⚠️ Please enter your name.'); return; }
    if (!fbEmail.trim()) { setFbMsg('⚠️ Please enter your email.'); return; }
    if (!emailRegex.test(fbEmail.trim().toLowerCase())) { setFbMsg('⚠️ Please enter a valid email address.'); return; }
    const domain = fbEmail.trim().split('@')[1]?.toLowerCase();
    const blockedDomains = ['test.com', 'fake.com', 'example.com', 'temp.com', 'xxx.com'];
    if (!domain || domain.split('.').length < 2 || domain.split('.').pop().length < 2 || blockedDomains.includes(domain)) {
      setFbMsg('⚠️ Please use a valid email with a real domain (e.g. gmail.com, yahoo.com).'); return;
    }
    if (!fbRating) { setFbMsg('⚠️ Please select a star rating.'); return; }
    if (!fbComment.trim()) { setFbMsg('⚠️ Please write a comment.'); return; }
    setFbSending(true);
    try {
      // Save to MongoDB
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save', name: fbName.trim(), email: fbEmail.trim(), rating: fbRating, comment: fbComment.trim() }),
      });
      // Also send email notification
      await sendFeedback(fbName.trim(), fbEmail.trim(), fbRating, fbComment.trim());
      setFbMsg('✅ Thank you for your feedback!');
      // Add to displayed reviews instantly
      setReviews(prev => [{ id: Date.now().toString(), name: fbName.trim(), rating: fbRating, comment: fbComment.trim(), createdAt: new Date().toISOString() }, ...prev]);
      setFbName(''); setFbEmail(''); setFbRating(0); setFbComment('');
    } catch {
      setFbMsg('⚠️ Failed to send. Please try again.');
    } finally { setFbSending(false); }
  }

  /* ========== RENDER ========== */
  const titles = {
    'signin':           'Welcome Back',
    'signup':           'Create Account',
    'signup-otp':       'Verify Email',
    'forgot':           'Forgot Password',
    'forgot-otp':       'Verify OTP',
    'forgot-newpw':     'New Password',
    'otp-login':        'Login with OTP',
    'otp-login-verify': 'Verify OTP',
  };

  const subtitles = {
    'signin':           'Sign in with your email & password',
    'signup':           'Fill in your details to get started',
    'signup-otp':       `Enter the 6-digit OTP sent to ${maskEmail(email)}`,
    'forgot':           'Enter your email to receive a reset OTP',
    'forgot-otp':       `Enter the OTP sent to ${maskEmail(email)}`,
    'forgot-newpw':     'Choose a strong new password',
    'otp-login':        'We\'ll send a one-time code to your email',
    'otp-login-verify': `Enter the OTP sent to ${maskEmail(email)}`,
  };

  /* ═══ CARD CATEGORIES ═══ */
  const PREMIUM_CARDS = [
    { id: 'holicard',      icon: '🌈', name: 'Holi Celebration Card',        desc: 'Vibrant & colorful Holi greeting card with splashes & festive typography.',   grad: 'linear-gradient(135deg, #ff6f91, #ffc75f)', price: '₹49' },
    { id: 'birthday',      icon: '🎂', name: 'Birthday Invite Designer',      desc: 'Create personalised and stylish birthday party invitations with ease.',   grad: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', price: '₹49' },
    { id: 'wedding',       icon: '💐', name: 'Wedding Invite Designer',       desc: 'Create royal and classic wedding invitations with beautiful themes.',      grad: 'linear-gradient(135deg, #f7971e, #ffd200)', price: '₹49' },
    { id: 'anniversary',   icon: '💍', name: 'Anniversary Greeting Designer', desc: 'Craft elegant anniversary greetings to celebrate love and togetherness.', grad: 'linear-gradient(135deg, #ee5a6f, #f0c27f)', price: '₹49' },
    { id: 'festivalcards', icon: '🎆', name: 'Festival Cards',               desc: 'Create festive cards for Diwali, Lohri, Navratri, Eid, Christmas and more.', grad: 'linear-gradient(135deg, #fdcb6e, #e17055)', price: '₹49' },
  ];

  const FREE_CARDS = [
    { id: 'holiwishes',    icon: '🌈', name: 'Holi Wishes — Hindi',   lang: 'हिन्दी', langClass: 'lp-lang-hi', desc: 'रंगों भरी होली शायरी — चुनें, रंग बदलें और डाउनलोड करें!', grad: 'linear-gradient(135deg, #ff6f91, #ffc75f)' },
    { id: 'holiwishes-en', icon: '🌈', name: 'Holi Wishes — English', lang: 'English', langClass: 'lp-lang-en', desc: 'Beautiful English Holi messages — pick, customize colors & download!',  grad: 'linear-gradient(135deg, #a29bfe, #ffc75f)' },
    { id: 'motivational',  icon: '💪', name: 'Motivational Quotes',   lang: 'हिन्दी', langClass: 'lp-lang-hi', desc: 'प्रेरणादायक विचार — थीम चुनें, कस्टमाइज़ करें और डाउनलोड करें!', grad: 'linear-gradient(135deg, #0f0c29, #302b63)' },
    { id: 'motivational-en', icon: '💪', name: 'Motivational Quotes',  lang: 'English', langClass: 'lp-lang-en', desc: 'Inspiring English quotes — pick a theme, customize & download free!', grad: 'linear-gradient(135deg, #134e5e, #71b280)' },
    { id: 'fathers',          icon: '👨‍👧', name: 'Father\'s Quotes',       lang: 'हिन्दी', langClass: 'lp-lang-hi', desc: 'पिता के प्यार को शब्दों में — थीम चुनें और फ्री डाउनलोड करें!', grad: 'linear-gradient(135deg, #2d3436, #636e72)' },
    { id: 'fathers-en',       icon: '👨‍👧', name: 'Father\'s Quotes',       lang: 'English', langClass: 'lp-lang-en', desc: 'Heartfelt father\'s quotes — pick a theme, customize & download free!', grad: 'linear-gradient(135deg, #0c3483, #a2b6df)' },
  ];



  /* ========== CARD CLICK — works for both logged-in and guest ========== */
  function handleCardClick(cardId) {
    if (!user) {
      loginAsGuest();
    }
    if (onSelect) onSelect(cardId);
  }

  function handleComingSoon(cardName) {
    setToast({ show: true, text: `🚀 "${cardName}" is coming soon! Stay tuned.` });
    setTimeout(() => setToast({ show: false, text: '' }), 2500);
  }

  const comingSoonCards = [
    /* Moved here — not ready yet */
    { icon: '🪔', name: 'Jagrata Invite',      desc: 'Design serene and devotional invitations for Jagrata gatherings.',       grad: 'linear-gradient(135deg, #f7971e, #ffd200)' },
    { icon: '📄', name: 'Resume Builder',      desc: 'Design a polished resume and download it instantly in PDF format.',      grad: 'linear-gradient(135deg, #38b2ac, #319795)' },
    { icon: '💍', name: 'Marriage Profile',     desc: 'Build a traditional and detailed marriage biodata with a clean layout.', grad: 'linear-gradient(135deg, #ee5a6f, #f0c27f)' },
    /* Spiritual & Religious */
    { icon: '🙏', name: 'Satyanarayan Katha', desc: 'Create sacred invitations for Satyanarayan Katha pooja.',             grad: 'linear-gradient(135deg, #f7971e, #ffd200)' },
    { icon: '💃', name: 'Garba / Navratri',   desc: 'Colourful Garba and Navratri celebration invitation cards.',           grad: 'linear-gradient(135deg, #ee5a6f, #f0c27f)' },
    /* Wedding Functions */
    { icon: '💛', name: 'Haldi',              desc: 'Bright and cheerful Haldi ceremony invitation cards.',                 grad: 'linear-gradient(135deg, #f9d423, #f7971e)' },
    { icon: '🌿', name: 'Mehendi',            desc: 'Beautiful Mehendi night invitation with intricate design vibes.',      grad: 'linear-gradient(135deg, #38b2ac, #69f0ae)' },
    { icon: '🎶', name: 'Sangeet',            desc: 'Create fun and musical Sangeet night invitation cards.',              grad: 'linear-gradient(135deg, #667eea, #764ba2)' },
    { icon: '🥂', name: 'Reception',          desc: 'Design elegant reception party invitations for the big day.',         grad: 'linear-gradient(135deg, #c471f5, #fa71cd)' },
    { icon: '📅', name: 'Save the Date',      desc: 'Send gorgeous Save the Date cards to your loved ones.',               grad: 'linear-gradient(135deg, #ee5a6f, #f0c27f)' },
    /* Family & Life Events */
    { icon: '🍼', name: 'Baby Shower',        desc: 'Design adorable invitations for a joyful baby shower celebration.',   grad: 'linear-gradient(135deg, #fda085, #f6d365)' },
    { icon: '🪷', name: 'Naming Ceremony',    desc: 'Create elegant naming ceremony invitations with cultural themes.',    grad: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' },
    { icon: '🏠', name: 'Housewarming',       desc: 'Welcome guests to your new home with a warm invitation card.',        grad: 'linear-gradient(135deg, #f7971e, #ffd200)' },
    { icon: '🎓', name: 'Graduation / Farewell', desc: 'Celebrate academic milestones with stylish graduation invitations.', grad: 'linear-gradient(135deg, #667eea, #764ba2)' },
    /* Professional & Documents */
    { icon: '🪪', name: 'Visiting Card',      desc: 'Design sleek and modern visiting cards for professionals.',           grad: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
    { icon: '📋', name: 'Business Docs',      desc: 'Create professional business documents and letterheads.',             grad: 'linear-gradient(135deg, #667eea, #764ba2)' },
    /* Greeting Cards */
    { icon: '🙏', name: 'Thank You',          desc: 'Express gratitude with elegant and heartfelt thank you cards.',       grad: 'linear-gradient(135deg, #fda085, #f6d365)' },
    { icon: '🎊', name: 'Congratulations',    desc: 'Celebrate achievements with vibrant congratulations cards.',          grad: 'linear-gradient(135deg, #f857a6, #ff5858)' },
    { icon: '🍀', name: 'Good Luck',          desc: 'Send warm good luck wishes with charming card designs.',              grad: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
    /* Social Media */
    { icon: '💬', name: 'WhatsApp Invites',   desc: 'Create WhatsApp-optimised invitation cards ready to share.',          grad: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
    { icon: '📸', name: 'Instagram Story Templates', desc: 'Design eye-catching Instagram story templates for events.',    grad: 'linear-gradient(135deg, #c471f5, #fa71cd)' },
    { icon: '🌐', name: 'Social Event Cards', desc: 'Create shareable event cards for social media platforms.',            grad: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
  ];

  const displayName = user?.name || user?.email?.split('@')[0] || '';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="login-page">

      {/* ═══════ TOPBAR — always visible ═══════ */}
      <div className="lp-topbar">
        <div className="lp-topbar-logo">✨ Card Maker</div>
        <div className="lp-topbar-actions">
          {user && !isGuest && (
            <>
              <button className={`lp-topbar-btn ${accountTab === 'profile' ? 'active' : ''}`} onClick={() => setAccountTab(accountTab === 'profile' ? null : 'profile')}>👤 Profile</button>
              <button className={`lp-topbar-btn ${accountTab === 'templates' ? 'active' : ''}`} onClick={() => setAccountTab(accountTab === 'templates' ? null : 'templates')}>📋 Templates</button>
              <button className={`lp-topbar-btn ${accountTab === 'downloads' ? 'active' : ''}`} onClick={() => setAccountTab(accountTab === 'downloads' ? null : 'downloads')}>📥 Downloads</button>
              {isSuperAdmin && (
                <button className={`lp-topbar-btn ${accountTab === 'admin' ? 'active' : ''}`} onClick={() => setAccountTab(accountTab === 'admin' ? null : 'admin')}>⚙️ Admin</button>
              )}
            </>
          )}
          {(!user || isGuest) && (
            <>
              <button className="lp-topbar-btn" onClick={() => openAuthPopup('signin')}>🔐 Sign In</button>
              <button className="lp-topbar-btn signup" onClick={() => openAuthPopup('signup')}>📝 Sign Up</button>
            </>
          )}
          {user && (
            <button className="lp-topbar-btn logout" onClick={() => { setAccountTab(null); closeAuthPopup(); switchMode('signin'); logout(); }}>🚪 Logout</button>
          )}
        </div>
      </div>

      {/* ═══════ ACCOUNT PANEL OVERLAY ═══════ */}
      {user && accountTab && (
        <div className="lp-account-overlay" onClick={() => setAccountTab(null)}>
          <div className="lp-account-panel" onClick={e => e.stopPropagation()}>
            <button className="lp-account-close" onClick={() => setAccountTab(null)}>✕</button>

            {accountTab === 'profile' && (
              <div className="lp-account-content">
                <div className="lp-profile-avatar">{initial}</div>
                <h3 className="lp-profile-name">{user.name || 'Card Maker User'}</h3>
                <span className="lp-profile-badge">{isSuperAdmin ? '⭐ Super Admin' : isFreePlan ? '🆓 Free Plan' : '💎 Premium'}</span>
                <div className="lp-profile-info">
                  <div className="lp-profile-row"><span>📧</span> {maskEmail(user.email)}</div>
                  <div className="lp-profile-row"><span>🛡️</span> {isSuperAdmin ? 'Super Admin' : isFreePlan ? 'Free' : 'Premium'}</div>
                  <div className="lp-profile-row"><span>📅</span> Member since {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}</div>
                </div>
              </div>
            )}

            {accountTab === 'templates' && (
              <MyTemplates userEmail={user.email} onEditTemplate={onEditTemplate} />
            )}

            {accountTab === 'downloads' && (
              <DownloadHistory userEmail={user.email} />
            )}

            {accountTab === 'admin' && isSuperAdmin && <AdminPanel />}
          </div>
        </div>
      )}

      {/* ═══════ HERO SECTION ═══════ */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          {user ? (
            <>
              <h1 className="lp-hero-title">
                Welcome back, <span className="lp-accent">{displayName}</span>!
              </h1>
              <p className="lp-hero-sub">
                Click any card below to start designing. {isGuest ? 'Sign up to unlock all features!' : 'Your premium templates are ready.'}
              </p>
            </>
          ) : (
            <>
              <h1 className="lp-hero-title">
                Create Beautiful Cards <span className="lp-accent">in Minutes</span> — Free &amp; Premium Templates
              </h1>
              <p className="lp-hero-sub">
                Design stunning invitation cards &amp; greeting cards online. Free templates for birthdays, weddings, festivals like Holi &amp; Diwali. Customizable designs, instant download!
              </p>
            </>
          )}
          <div className="lp-hero-stats">
            <div className="lp-stat"><span className="lp-stat-num">23+</span><span className="lp-stat-label">Card Types</span></div>
            <div className="lp-stat-divider" />
            <div className="lp-stat"><span className="lp-stat-num">50+</span><span className="lp-stat-label">Templates Planned</span></div>
            <div className="lp-stat-divider" />
            <div className="lp-stat"><span className="lp-stat-num">5</span><span className="lp-stat-label">Languages</span></div>
          </div>
        </div>
      </section>

      {/* ═══════ FREE CARDS ═══════ */}
      <section className="lp-showcase lp-free-section">
        <div className="lp-section-header">
          <h2 className="lp-section-title">🎁 Free Instant Cards</h2>
          <span className="lp-section-free-tag">100% FREE</span>
        </div>
        <p className="lp-section-sub">No form needed — just pick, customize colors &amp; download instantly!</p>
        <div className="lp-showcase-grid lp-free-grid">
          {FREE_CARDS.map(c => (
            <button key={c.id} className="lp-showcase-card lp-free-card" style={{ background: c.grad }} type="button" onClick={() => handleCardClick(c.id)}>
              <span className="lp-free-badge">FREE</span>
              {c.lang && <span className={`lp-lang-badge ${c.langClass || ''}`}>{c.lang}</span>}
              <span className="lp-showcase-icon">{c.icon}</span>
              <h3 className="lp-showcase-name">{c.name}</h3>
              <p className="lp-showcase-desc">{c.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ═══════ PREMIUM CARDS ═══════ */}
      <section className="lp-showcase">
        <div className="lp-section-header">
          <h2 className="lp-section-title">✨ Premium Card Designers</h2>
          <span className="lp-section-price">Starting from ₹49</span>
        </div>
        <p className="lp-section-sub">Beautiful cards that need your details — fill the form, preview &amp; download</p>
        <div className="lp-showcase-grid">
          {PREMIUM_CARDS.map(c => (
            <button key={c.id} className="lp-showcase-card lp-premium-card" style={{ background: c.grad }} type="button" onClick={() => handleCardClick(c.id)}>
              <span className="lp-price-badge">{c.price}</span>
              <span className="lp-showcase-icon">{c.icon}</span>
              <h3 className="lp-showcase-name">{c.name}</h3>
              <p className="lp-showcase-desc">{c.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="lp-how-it-works">
        <h2 className="lp-section-title">📋 How It Works</h2>
        <p className="lp-section-sub">Create stunning cards in 4 simple steps</p>
        <div className="lp-steps-grid">
          <div className="lp-step">
            <span className="lp-step-num">1</span>
            <h3>Choose a Template</h3>
            <p>Browse our collection of 50+ professionally designed templates for every occasion.</p>
          </div>
          <div className="lp-step">
            <span className="lp-step-num">2</span>
            <h3>Customize Your Card</h3>
            <p>Add your text, photos, choose colors and fonts. Live preview as you type!</p>
          </div>
          <div className="lp-step">
            <span className="lp-step-num">3</span>
            <h3>Preview Your Design</h3>
            <p>See exactly how your card looks before downloading. Make any final adjustments.</p>
          </div>
          <div className="lp-step">
            <span className="lp-step-num">4</span>
            <h3>Download Instantly</h3>
            <p>Download your card as high-quality PNG or PDF. Share via WhatsApp, print, or email!</p>
          </div>
        </div>
      </section>

      {/* ═══════ WHY CARD MAKER ═══════ */}
      <section className="lp-proof">
        <h2 className="lp-section-title">Why Choose Card Maker?</h2>
        <p className="lp-section-sub">Made for everyone — from first‑time users to designers</p>
        <p className="lp-brand-line">Card Maker is a product of <strong>Creative Thinker Design Hub</strong>.</p>
        <div className="lp-highlights">
          <div className="lp-highlight">
            <span className="lp-highlight-icon">⚡</span>
            <h3>Ready in Minutes</h3>
            <p>Pick a template, fill in your details, and download — no design skills needed.</p>
          </div>
          <div className="lp-highlight">
            <span className="lp-highlight-icon">🎨</span>
            <h3>Beautiful Templates</h3>
            <p>Professionally designed for weddings, birthdays, anniversaries &amp; more.</p>
          </div>
          <div className="lp-highlight">
            <span className="lp-highlight-icon">📱</span>
            <h3>Works Everywhere</h3>
            <p>Desktop, tablet, or phone — create and share cards from any device.</p>
          </div>
          <div className="lp-highlight">
            <span className="lp-highlight-icon">🌐</span>
            <h3>Multi-Language</h3>
            <p>Create cards in Hindi, English, Punjabi, Gujarati &amp; more languages.</p>
          </div>
        </div>
      </section>

      {/* ═══════ AUTH POPUP MODAL ═══════ */}
      {showAuthPopup && (
        <div className="lp-auth-overlay" onClick={closeAuthPopup}>
          <div className="lp-auth-popup" onClick={e => e.stopPropagation()}>
            <button className="lp-auth-popup-close" onClick={closeAuthPopup}>✕</button>

            <div className="login-card">
              <h3 className="login-title">{titles[mode]}</h3>
              <p className="login-subtitle">{subtitles[mode]}</p>

              {error && <div className="login-error">⚠️ {error}</div>}
              {info  && <div className="login-info">✅ {info}</div>}

              {/* ---- SIGN IN ---- */}
              {mode === 'signin' && (
                <form onSubmit={handleSignIn} autoComplete="off">
                  <input className="login-input" type="email" placeholder="Email address"
                    value={email} onChange={e => setEmail(e.target.value)} autoComplete="off" autoFocus />
                  <div className="login-pw-wrap">
                    <input className="login-input" type={showPw ? 'text' : 'password'} placeholder="Password"
                      value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
                    <button type="button" className="login-pw-toggle" onClick={() => setShowPw(!showPw)}>
                      {showPw ? '🙈' : '👁️'}
                    </button>
                  </div>
                  <button className="login-btn" disabled={loading}>
                    {loading ? '⏳ Signing in…' : '🔐 Sign In'}
                  </button>
                  <div className="login-links">
                    <button type="button" onClick={() => switchMode('forgot')}>Forgot password?</button>
                    <button type="button" onClick={() => switchMode('otp-login')}>Login with OTP</button>
                  </div>
                  <div className="login-switch">
                    Don&apos;t have an account?{' '}
                    <button type="button" onClick={() => switchMode('signup')}>Sign Up</button>
                  </div>
                  <div className="login-guest-divider"><span>or</span></div>
                  <button type="button" className="login-guest-btn" onClick={() => { closeAuthPopup(); loginAsGuest(); }}>
                    👤 Continue as Guest
                  </button>
                </form>
              )}

              {/* ---- SIGN UP ---- */}
              {mode === 'signup' && (
                <form onSubmit={handleSignUp} autoComplete="off">
                  <input className="login-input" type="text" placeholder="Full Name"
                    value={name} onChange={e => setName(e.target.value)} autoComplete="off" autoFocus />
                  <input className="login-input" type="email" placeholder="Email address"
                    value={email} onChange={e => setEmail(e.target.value)} autoComplete="off" />
                  <div className="login-pw-wrap">
                    <input className="login-input" type={showPw ? 'text' : 'password'} placeholder="Password (min 6 chars)"
                      value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" />
                    <button type="button" className="login-pw-toggle" onClick={() => setShowPw(!showPw)}>
                      {showPw ? '🙈' : '👁️'}
                    </button>
                  </div>
                  <input className="login-input" type="password" placeholder="Confirm Password"
                    value={confirmPw} onChange={e => setConfirmPw(e.target.value)} autoComplete="new-password" />
                  <button className="login-btn signup" disabled={loading}>
                    {loading ? '⏳ Sending OTP…' : '📩 Sign Up'}
                  </button>
                  <div className="login-switch">
                    Already have an account?{' '}
                    <button type="button" onClick={() => switchMode('signin')}>Sign In</button>
                  </div>
                  <div className="login-guest-divider"><span>or</span></div>
                  <button type="button" className="login-guest-btn" onClick={() => { closeAuthPopup(); loginAsGuest(); }}>
                    👤 Continue as Guest
                  </button>
                </form>
              )}

              {/* ---- SIGN UP OTP VERIFY ---- */}
              {mode === 'signup-otp' && (
                <form onSubmit={handleSignUpOTP} autoComplete="off">
                  <input className="login-input otp" type="text" maxLength={6} placeholder="Enter 6-digit OTP"
                    value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} autoComplete="off" autoFocus />
                  <button className="login-btn" disabled={loading}>
                    {loading ? '⏳ Verifying…' : '✅ Verify & Create Account'}
                  </button>
                  <div className="login-resend">
                    Didn&apos;t receive it?{' '}
                    <button type="button" onClick={handleResend} disabled={loading}>Resend OTP</button>
                  </div>
                </form>
              )}

              {/* ---- FORGOT PASSWORD — enter email ---- */}
              {mode === 'forgot' && (
                <form onSubmit={handleForgotSend} autoComplete="off">
                  <input className="login-input" type="email" placeholder="Email address"
                    value={email} onChange={e => setEmail(e.target.value)} autoComplete="off" autoFocus />
                  <button className="login-btn" disabled={loading}>
                    {loading ? '⏳ Sending…' : '📩 Send Reset OTP'}
                  </button>
                  <div className="login-switch">
                    <button type="button" onClick={() => switchMode('signin')}>← Back to Sign In</button>
                  </div>
                </form>
              )}

              {/* ---- FORGOT PASSWORD — verify OTP ---- */}
              {mode === 'forgot-otp' && (
                <form onSubmit={handleForgotOTP} autoComplete="off">
                  <input className="login-input otp" type="text" maxLength={6} placeholder="Enter 6-digit OTP"
                    value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} autoComplete="off" autoFocus />
                  <button className="login-btn" disabled={loading}>
                    {loading ? '⏳ Verifying…' : '✅ Verify OTP'}
                  </button>
                  <div className="login-resend">
                    Didn&apos;t receive it?{' '}
                    <button type="button" onClick={handleResend} disabled={loading}>Resend OTP</button>
                  </div>
                </form>
              )}

              {/* ---- FORGOT PASSWORD — new password ---- */}
              {mode === 'forgot-newpw' && (
                <form onSubmit={handleNewPassword} autoComplete="off">
                  <div className="login-pw-wrap">
                    <input className="login-input" type={showPw ? 'text' : 'password'} placeholder="New Password (min 6 chars)"
                      value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" autoFocus />
                    <button type="button" className="login-pw-toggle" onClick={() => setShowPw(!showPw)}>
                      {showPw ? '🙈' : '👁️'}
                    </button>
                  </div>
                  <input className="login-input" type="password" placeholder="Confirm New Password"
                    value={confirmPw} onChange={e => setConfirmPw(e.target.value)} autoComplete="new-password" />
                  <button className="login-btn" disabled={loading}>
                    {loading ? '⏳ Resetting…' : '🔒 Reset Password'}
                  </button>
                </form>
              )}

              {/* ---- OTP LOGIN — enter email ---- */}
              {mode === 'otp-login' && (
                <form onSubmit={handleOTPLoginSend} autoComplete="off">
                  <input className="login-input" type="email" placeholder="Email address"
                    value={email} onChange={e => setEmail(e.target.value)} autoComplete="off" autoFocus />
                  <button className="login-btn" disabled={loading}>
                    {loading ? '⏳ Sending…' : '📩 Send OTP'}
                  </button>
                  <div className="login-switch">
                    <button type="button" onClick={() => switchMode('signin')}>← Back to Sign In</button>
                  </div>
                </form>
              )}

              {/* ---- OTP LOGIN — verify ---- */}
              {mode === 'otp-login-verify' && (
                <form onSubmit={handleOTPLoginVerify} autoComplete="off">
                  <input className="login-input otp" type="text" maxLength={6} placeholder="Enter 6-digit OTP"
                    value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} autoComplete="off" autoFocus />
                  <button className="login-btn" disabled={loading}>
                    {loading ? '⏳ Verifying…' : '🔐 Verify & Login'}
                  </button>
                  <div className="login-resend">
                    Didn&apos;t receive it?{' '}
                    <button type="button" onClick={handleResend} disabled={loading}>Resend OTP</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════ FEATURES + FEEDBACK SECTION ═══════ */}
      <section className="lp-extras">
        <div className="lp-extras-grid">
          {/* Features card */}
          <div className="lp-col-card">
            <h4 className="lp-subheading">✅ Why Card Maker?</h4>
            <ul className="lp-features">
              <li>Multiple premium templates per card type</li>
              <li>Live preview while editing</li>
              <li>High-quality PNG/PDF downloads</li>
              <li>Multi-language support</li>
              <li>Works on all devices — desktop, tablet, mobile</li>
            </ul>
            <div className="lp-hire" style={{ marginTop: 14 }}>
              <h4 className="lp-subheading">💼 Need a Custom Design?</h4>
              <p className="lp-text">
                Hire us to create your own personalized, fully customized card tailored to your needs!
              </p>
              <p className="lp-text lp-brand-subtle">Custom designs are created by <strong>Creative Thinker Design Hub</strong>.</p>
            </div>
          </div>

          {/* Rate & Review */}
          <div className="lp-feedback-section">
            <h4 className="lp-subheading">⭐ Rate &amp; Review</h4>
            <p className="lp-fb-tagline">
              💬 Your feedback matters! Help us improve by sharing your thoughts.
              Rate your experience and leave a comment — every review helps us serve you better.
            </p>
            <p className="lp-fb-signup-note">
              📝 <strong>Sign up</strong> to share your feedback. We value genuine reviews from our community!
            </p>
            <form className="lp-feedback-form" onSubmit={handleFeedbackSubmit}>
              <div className="login-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={`login-star ${star <= (fbHover || fbRating) ? 'filled' : ''}`}
                    onClick={() => setFbRating(star)}
                    onMouseEnter={() => setFbHover(star)}
                    onMouseLeave={() => setFbHover(0)}
                    aria-label={`${star} star`}
                  >★</button>
                ))}
                {fbRating > 0 && <span className="login-star-label">{fbRating}/5</span>}
              </div>
              <div className="lp-fb-row">
                <input className="lp-fb-input" type="text" placeholder="Your name *"
                  value={fbName} onChange={e => setFbName(e.target.value)} autoComplete="off" required />
                <input className="lp-fb-input" type="email" placeholder="Your email *"
                  value={fbEmail} onChange={e => setFbEmail(e.target.value)} autoComplete="off" required />
              </div>
              <textarea className="lp-fb-textarea" placeholder="Write your feedback…"
                rows={3} value={fbComment} onChange={e => setFbComment(e.target.value)} autoComplete="off" />
              <button className="login-btn lp-fb-btn" disabled={fbSending}>
                {fbSending ? '⏳ Sending…' : '📨 Submit Review'}
              </button>
              {fbMsg && <div className={`login-fb-msg ${fbMsg.startsWith('✅') ? 'success' : 'warn'}`}>{fbMsg}</div>}
            </form>
          </div>
        </div>
      </section>

      {/* ═══════ USER REVIEWS DISPLAY ═══════ */}
      <section className="lp-reviews-section">
        <h2 className="lp-section-title">💬 What Our Users Say</h2>
        <p className="lp-section-sub">Real feedback from real users</p>
        {reviewsLoading ? (
          <p className="lp-reviews-loading">Loading reviews…</p>
        ) : reviews.length === 0 ? (
          <p className="lp-reviews-empty">No reviews yet. Be the first to share your feedback! ⭐</p>
        ) : (
          <div className="lp-reviews-grid">
            {reviews.map(r => (
              <div className="lp-review-card" key={r.id}>
                <div className="lp-review-header">
                  <div className="lp-review-avatar">{r.name?.charAt(0)?.toUpperCase() || '?'}</div>
                  <div>
                    <div className="lp-review-name">{r.name}</div>
                    <div className="lp-review-stars">
                      {[1, 2, 3, 4, 5].map(s => (
                        <span key={s} className={`lp-review-star ${s <= r.rating ? 'filled' : ''}`}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="lp-review-comment">{r.comment}</p>
                <span className="lp-review-date">
                  {new Date(r.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ═══════ ABOUT CARD MAKER ═══════ */}
      <section className="lp-about">
        <h2 className="lp-section-title">📖 About Card Maker</h2>
        <div className="lp-about-content">
          <p>
            <strong>Card Maker</strong> helps you design birthday invitations, wedding cards, anniversary greetings,
            festival greeting cards, and professional documents like resumes and marriage biodata — all online.
            With 50+ ready-made templates in <strong>Hindi, English, Punjabi, and Gujarati</strong>, anyone can
            create and download beautiful cards instantly.
          </p>
          <p>
            Whether you need a free Holi wishes card or a premium wedding invitation, Card Maker has you covered.
            Our easy-to-use editor lets you customize text, colors, photos, and fonts with a live preview.
            Download in high-quality PNG or PDF format — ready to print or share on WhatsApp!
          </p>
          <p>
            Built by <strong>Creative Thinker Design Hub</strong> in India, Card Maker is trusted by thousands
            of users for creating professional-quality cards without any design skills.
          </p>
        </div>
      </section>

      {/* ═══════ FAQ SECTION ═══════ */}
      <section className="lp-faq">
        <h2 className="lp-section-title">❓ Frequently Asked Questions</h2>
        <p className="lp-section-sub">Quick answers about Card Maker</p>
        <div className="lp-faq-list">
          <details className="lp-faq-item">
            <summary>How can I create a card online?</summary>
            <p>Simply visit Card Maker, choose a template (birthday, wedding, anniversary, etc.), customize it with your text and photos, preview, and download instantly. No software installation needed!</p>
          </details>
          <details className="lp-faq-item">
            <summary>Is Card Maker free to use?</summary>
            <p>Yes! Holi wishes cards (Hindi &amp; English) and Motivational Quotes cards are 100% free — no sign-up required. Premium card designers like birthday, wedding, anniversary, and festival cards are available at affordable prices starting from ₹49.</p>
          </details>
          <details className="lp-faq-item">
            <summary>Do I need to sign up to download cards?</summary>
            <p>No! Free cards like Holi wishes can be downloaded without signing up. For premium cards, you can use them as a guest or create an account to save your templates and download history.</p>
          </details>
          <details className="lp-faq-item">
            <summary>Do you support Hindi and English templates?</summary>
            <p>Yes! Card Maker supports multiple languages including Hindi, English, Punjabi, and Gujarati. Holi wishes are available in both Hindi (50+ shayaris) and English (47 messages).</p>
          </details>
          <details className="lp-faq-item">
            <summary>What types of cards can I create?</summary>
            <p>You can create Birthday Invitations, Wedding Cards, Anniversary Greetings, Holi Wishes, Festival Cards, Marriage Biodata, Professional Resumes, Jagrata Invitations, and many more. New card types are added regularly!</p>
          </details>
          <details className="lp-faq-item">
            <summary>Can I download cards as PDF?</summary>
            <p>Yes! Resumes and biodata can be downloaded as PDF files. Invitation cards and greeting cards are downloaded as high-quality PNG images that are perfect for printing and sharing.</p>
          </details>
          <details className="lp-faq-item">
            <summary>Is Card Maker available on mobile?</summary>
            <p>Absolutely! Card Maker works on all devices — desktop, tablet, and mobile phones. The interface is fully responsive and optimised for touch screens.</p>
          </details>
        </div>
      </section>

      {/* ═══════ COMING SOON ═══════ */}
      <section className="lp-coming-section">
        <h2 className="lp-section-title">🚀 Coming Soon</h2>
        <p className="lp-section-sub">{comingSoonCards.length} more card types on the way!</p>
        <div className="lp-coming-grid">
          {comingSoonCards.map(c => (
            <div key={c.name} className="lp-coming-card" style={{ background: c.grad }} onClick={() => handleComingSoon(c.name)} role="button" tabIndex={0}>
              <span className="lp-showcase-icon">{c.icon}</span>
              <h3 className="lp-showcase-name">{c.name}</h3>
              <span className="lp-coming-badge">Coming Soon</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="lp-footer">
        <p className="lp-footer-love">Made with ❤️ by <strong>Creative Thinker Design Hub</strong></p>
        <div className="lp-footer-nav">
          <a href="https://mail.google.com/mail/?view=cm&to=creativethinker.designhub@gmail.com&su=Inquiry%20-%20Card%20Maker" target="_blank" rel="noopener noreferrer" className="lp-footer-link">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M20 4h-16c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2zm0 4l-8 5-8-5v-2l8 5 8-5v2z"/></svg>
            Email Us
          </a>
          <span className="lp-footer-dot">·</span>
          <span className="lp-footer-link disabled" title="Coming soon">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76zm13.5 11.27h-3v-5.34c0-3.18-4-2.94-4 0v5.34h-3v-10h3v1.77c1.4-2.59 7-2.78 7 2.48v5.75z"/></svg>
            LinkedIn
          </span>
        </div>
        <p className="lp-footer-copy">© 2026 Creative Thinker Design Hub. All Rights Reserved.</p>
      </footer>

      <Toast text={toast.text} show={toast.show} />
    </div>
  );
}
