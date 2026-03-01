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
    <div className="login-screen">
      <div className="login-card">
        <div className="login-icon">✨</div>
        <h2>Card Maker</h2>

        {/* ── Project Info (visible on signin & signup) ── */}
        {(mode === 'signin' || mode === 'signup') && (
          <div className="login-about">
            <p className="login-about-aim">
              We are here to fulfil all your online card creation needs — beautifully designed, easy to customize, and free to download!
            </p>
            <div className="login-about-cards">
              <span className="login-about-label">Available Cards:</span>
              <div className="login-about-tags">
                <span className="login-tag ready">🎂 Birthday Card</span>
                <span className="login-tag ready">💍 Wedding Card</span>
                <span className="login-tag ready">💕 Anniversary Card</span>
                <span className="login-tag ready">🪔 Jagrata Card</span>
                <span className="login-tag ready">📄 Biodata Card</span>
                <span className="login-tag ready">📋 Resume Card</span>
              </div>
            </div>
            <p className="login-about-note">
              🚀 This project is in its <strong>initial stage</strong>. We are actively working on more card types — some are ready to use, others are coming soon. Stay tuned!
            </p>
            <p className="login-about-hire">
              💼 <strong>Need a custom design?</strong> You can hire us to create your own personalized, fully customized card tailored to your needs!
            </p>
          </div>
        )}

        <h3 className="login-title">{titles[mode]}</h3>
        <p className="login-subtitle">{subtitles[mode]}</p>

        {error && <div className="login-error">⚠️ {error}</div>}
        {info  && <div className="login-info">✅ {info}</div>}

        {/* ---- SIGN IN ---- */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn}>
            <input className="login-input" type="email" placeholder="Email address"
              value={email} onChange={e => setEmail(e.target.value)} autoFocus />
            <div className="login-pw-wrap">
              <input className="login-input" type={showPw ? 'text' : 'password'} placeholder="Password"
                value={password} onChange={e => setPassword(e.target.value)} />
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
              Don't have an account?{' '}
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
          <form onSubmit={handleSignUp}>
            <input className="login-input" type="text" placeholder="Full Name"
              value={name} onChange={e => setName(e.target.value)} autoFocus />
            <input className="login-input" type="email" placeholder="Email address"
              value={email} onChange={e => setEmail(e.target.value)} />
            <div className="login-pw-wrap">
              <input className="login-input" type={showPw ? 'text' : 'password'} placeholder="Password (min 6 chars)"
                value={password} onChange={e => setPassword(e.target.value)} />
              <button type="button" className="login-pw-toggle" onClick={() => setShowPw(!showPw)}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
            <input className="login-input" type="password" placeholder="Confirm Password"
              value={confirmPw} onChange={e => setConfirmPw(e.target.value)} />
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
          <form onSubmit={handleSignUpOTP}>
            <input className="login-input otp" type="text" maxLength={6} placeholder="Enter 6-digit OTP"
              value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} autoFocus />
            <button className="login-btn" disabled={loading}>
              {loading ? '⏳ Verifying…' : '✅ Verify & Create Account'}
            </button>
            <div className="login-resend">
              Didn't receive it?{' '}
              <button type="button" onClick={handleResend} disabled={loading}>Resend OTP</button>
            </div>
          </form>
        )}

        {/* ---- FORGOT PASSWORD — enter email ---- */}
        {mode === 'forgot' && (
          <form onSubmit={handleForgotSend}>
            <input className="login-input" type="email" placeholder="Email address"
              value={email} onChange={e => setEmail(e.target.value)} autoFocus />
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
          <form onSubmit={handleForgotOTP}>
            <input className="login-input otp" type="text" maxLength={6} placeholder="Enter 6-digit OTP"
              value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} autoFocus />
            <button className="login-btn" disabled={loading}>
              {loading ? '⏳ Verifying…' : '✅ Verify OTP'}
            </button>
            <div className="login-resend">
              Didn't receive it?{' '}
              <button type="button" onClick={handleResend} disabled={loading}>Resend OTP</button>
            </div>
          </form>
        )}

        {/* ---- FORGOT PASSWORD — new password ---- */}
        {mode === 'forgot-newpw' && (
          <form onSubmit={handleNewPassword}>
            <div className="login-pw-wrap">
              <input className="login-input" type={showPw ? 'text' : 'password'} placeholder="New Password (min 6 chars)"
                value={password} onChange={e => setPassword(e.target.value)} autoFocus />
              <button type="button" className="login-pw-toggle" onClick={() => setShowPw(!showPw)}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
            <input className="login-input" type="password" placeholder="Confirm New Password"
              value={confirmPw} onChange={e => setConfirmPw(e.target.value)} />
            <button className="login-btn" disabled={loading}>
              {loading ? '⏳ Resetting…' : '🔒 Reset Password'}
            </button>
          </form>
        )}

        {/* ---- OTP LOGIN — enter email ---- */}
        {mode === 'otp-login' && (
          <form onSubmit={handleOTPLoginSend}>
            <input className="login-input" type="email" placeholder="Email address"
              value={email} onChange={e => setEmail(e.target.value)} autoFocus />
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
          <form onSubmit={handleOTPLoginVerify}>
            <input className="login-input otp" type="text" maxLength={6} placeholder="Enter 6-digit OTP"
              value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} autoFocus />
            <button className="login-btn" disabled={loading}>
              {loading ? '⏳ Verifying…' : '🔐 Verify & Login'}
            </button>
            <div className="login-resend">
              Didn't receive it?{' '}
              <button type="button" onClick={handleResend} disabled={loading}>Resend OTP</button>
            </div>
          </form>
        )}

        {/* ── Contact & Feedback Footer (all modes) ── */}
        <div className="login-contact">
          <div className="login-contact-title">📬 Contact Us / Share Feedback</div>
          <p className="login-contact-desc">Have questions, suggestions, or want to hire us? Reach out anytime:</p>
          <div className="login-contact-links">
            <a href="https://www.linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer" className="login-contact-btn linkedin">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.97 0-1.75-.79-1.75-1.76s.78-1.76 1.75-1.76 1.75.79 1.75 1.76-.78 1.76-1.75 1.76zm13.5 11.27h-3v-5.34c0-3.18-4-2.94-4 0v5.34h-3v-10h3v1.77c1.4-2.59 7-2.78 7 2.48v5.75z"/></svg>
              LinkedIn
            </a>
            <a href="mailto:creativethinker.designhub@gmail.com" className="login-contact-btn email">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20 4h-16c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2zm0 4l-8 5-8-5v-2l8 5 8-5v2z"/></svg>
              Email Us
            </a>
          </div>

          {/* ── Feedback / Review Form ── */}
          <form className="login-feedback-form" onSubmit={handleFeedbackSubmit}>
            <div className="login-feedback-heading">⭐ Rate & Review</div>

            {/* Star Rating */}
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

            <input className="login-input login-fb-input" type="text" placeholder="Your name (optional)"
              value={fbName} onChange={e => setFbName(e.target.value)} />
            <input className="login-input login-fb-input" type="email" placeholder="Your email (optional)"
              value={fbEmail} onChange={e => setFbEmail(e.target.value)} />
            <textarea className="login-input login-fb-textarea" placeholder="Write your feedback or suggestion…"
              rows={3} value={fbComment} onChange={e => setFbComment(e.target.value)} />

            {fbMsg && <div className={`login-fb-msg ${fbMsg.startsWith('✅') ? 'success' : 'warn'}`}>{fbMsg}</div>}

            <button className="login-btn login-fb-btn" disabled={fbSending}>
              {fbSending ? '⏳ Sending…' : '📨 Submit Feedback'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
