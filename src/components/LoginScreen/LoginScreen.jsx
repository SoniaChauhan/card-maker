'use client';
import { useState } from 'react';
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

export default function LoginScreen() {
  const { login, loginAsGuest } = useAuth();

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

  /* Feedback state */
  const [fbName, setFbName]       = useState('');
  const [fbEmail, setFbEmail]     = useState('');
  const [fbRating, setFbRating]   = useState(0);
  const [fbHover, setFbHover]     = useState(0);
  const [fbComment, setFbComment] = useState('');
  const [fbSending, setFbSending] = useState(false);
  const [fbMsg, setFbMsg]         = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedEmail = email.trim().toLowerCase();

  function resetForm() {
    setName(''); setPassword(''); setConfirmPw('');
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
    if (!name.trim()) { setError('Enter your name.'); return; }
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) { setError('Enter a valid email.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPw) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const exists = await userExists(trimmedEmail);
      if (exists) { setError('Account already exists. Please sign in.'); setLoading(false); return; }

      const code = generateOTP();
      await storeOTP(trimmedEmail, code);
      await sendOTPEmail(trimmedEmail, code);
      setInfo(`OTP sent to ${maskEmail(trimmedEmail)} — check your inbox.`);
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
      setInfo(`OTP sent to ${maskEmail(trimmedEmail)}`);
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
      setInfo(`OTP sent to ${maskEmail(trimmedEmail)}`);
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
    if (!fbRating) { setFbMsg('⚠️ Please select a star rating.'); return; }
    if (!fbComment.trim()) { setFbMsg('⚠️ Please write a comment.'); return; }
    setFbSending(true);
    try {
      await sendFeedback(fbName.trim(), fbEmail.trim(), fbRating, fbComment.trim());
      setFbMsg('✅ Thank you for your feedback!');
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

  return (
    <div className="login-page">
      {/* ═══════ TWO-COLUMN MAIN AREA ═══════ */}
      <div className="login-main">

        {/* ──── LEFT: Auth Form ──── */}
        <div className="login-left">
          <div className="login-card">
            <div className="login-icon">✨</div>
            <h2>Card Maker</h2>
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
                <button type="button" className="login-guest-btn" onClick={loginAsGuest}>
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
                <button type="button" className="login-guest-btn" onClick={loginAsGuest}>
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

        {/* ──── RIGHT: Dashboard Info + Feedback ──── */}
        <div className="login-right">
          <div className="login-info-panel">

            {/* ── Two-column cards grid ── */}
            <div className="lp-two-col">
              {/* Card 1 — About + Cards */}
              <div className="lp-col-card">
                <h3 className="lp-heading">🎨 About Card Maker</h3>
                <p className="lp-text">
                  We fulfil all your online card creation needs — beautifully designed,
                  easy to customize, and free to download!
                </p>
                <h4 className="lp-subheading" style={{ marginTop: 14 }}>📌 Available Cards</h4>
                <div className="lp-card-grid">
                  <div className="lp-card-item">🎂 Birthday</div>
                  <div className="lp-card-item">💍 Wedding</div>
                  <div className="lp-card-item">💕 Anniversary</div>
                  <div className="lp-card-item">🪔 Jagrata</div>
                  <div className="lp-card-item">📄 Biodata</div>
                  <div className="lp-card-item">📋 Resume</div>
                </div>
                <div className="lp-status" style={{ marginTop: 14 }}>
                  🚀 <strong>Initial stage</strong> — more cards coming soon!
                </div>
              </div>

              {/* Card 2 — Features + Hire */}
              <div className="lp-col-card">
                <h4 className="lp-subheading">✅ Features</h4>
                <ul className="lp-features">
                  <li>Multiple premium templates per card type</li>
                  <li>Live preview while editing</li>
                  <li>High-quality PNG/PDF downloads</li>
                  <li>Multi-language support</li>
                  <li>Guest mode — no sign-up required</li>
                </ul>
                <div className="lp-hire" style={{ marginTop: 14 }}>
                  <h4 className="lp-subheading">💼 Need a Custom Design?</h4>
                  <p className="lp-text">
                    Hire us to create your own personalized, fully customized card tailored to your needs!
                  </p>
                </div>
              </div>
            </div>

            {/* ── Rate & Review — full-width bottom row ── */}
            <div className="lp-feedback-section lp-full-row">
              <h4 className="lp-subheading">⭐ Rate &amp; Review</h4>
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
                  <input className="lp-fb-input" type="text" placeholder="Your name (optional)"
                    value={fbName} onChange={e => setFbName(e.target.value)} autoComplete="off" />
                  <input className="lp-fb-input" type="email" placeholder="Your email (optional)"
                    value={fbEmail} onChange={e => setFbEmail(e.target.value)} autoComplete="off" />
                  <textarea className="lp-fb-textarea" placeholder="Write your feedback…"
                    rows={2} value={fbComment} onChange={e => setFbComment(e.target.value)} autoComplete="off" />
                  <button className="login-btn lp-fb-btn" disabled={fbSending}>
                    {fbSending ? '⏳ Sending…' : '📨 Submit'}
                  </button>
                </div>
                {fbMsg && <div className={`login-fb-msg ${fbMsg.startsWith('✅') ? 'success' : 'warn'}`}>{fbMsg}</div>}
              </form>
            </div>

          </div>
        </div>
      </div>

      {/* ═══════ BOTTOM CONTACT FOOTER ═══════ */}
      <footer className="login-footer">
        <span className="login-footer-label">📬 Contact Us</span>
        <div className="login-footer-links">
          <span className="login-footer-btn linkedin disabled" title="Coming soon">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76zm13.5 11.27h-3v-5.34c0-3.18-4-2.94-4 0v5.34h-3v-10h3v1.77c1.4-2.59 7-2.78 7 2.48v5.75z"/></svg>
            LinkedIn
          </span>
          <a href="mailto:creativethinker.designhub@gmail.com" className="login-footer-btn email">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M20 4h-16c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2zm0 4l-8 5-8-5v-2l8 5 8-5v2z"/></svg>
            Email Us
          </a>
        </div>
        <span className="login-footer-copy">© 2026 Card Maker · Creative Thinker Design Hub</span>
      </footer>
    </div>
  );
}
