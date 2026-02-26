import { useState } from 'react';
import './LoginScreen.css';
import { useAuth } from '../../contexts/AuthContext';
import {
  generateOTP, storeOTP, verifyOTP,
  signUpUser, signInUser, resetPassword,
  createOrUpdateUser, userExists,
} from '../../services/authService';
import { sendOTPEmail, notifyAdmin } from '../../services/notificationService';
import { isUserBlocked } from '../../services/blockService';

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
  const { login } = useAuth();

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
        `Sender: ${user.email}\nName: ${user.name}\nRole: ${user.role}\nLogged in at ${new Date().toLocaleString()}.`,
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
      setInfo(`OTP sent to ${trimmedEmail} — check your inbox.`);
      setMode('signup-otp');
    } catch (err) {
      setError(err?.text || err?.message || 'Failed to send OTP.');
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
        `Sender: ${user.email}\nName: ${user.name}\nRole: ${user.role}\nSigned up at ${new Date().toLocaleString()}.`,
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
      setError(err?.text || err?.message || 'Failed to send OTP.');
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
      setError(err?.text || err?.message || 'Failed to send OTP.');
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
        `Sender: ${user.email}\nRole: ${user.role}\nLogged in via OTP at ${new Date().toLocaleString()}.`,
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
    'signup-otp':       `Enter the 6-digit OTP sent to ${email}`,
    'forgot':           'Enter your email to receive a reset OTP',
    'forgot-otp':       `Enter the OTP sent to ${email}`,
    'forgot-newpw':     'Choose a strong new password',
    'otp-login':        'We\'ll send a one-time code to your email',
    'otp-login-verify': `Enter the OTP sent to ${email}`,
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-icon">✨</div>
        <h2>Card Maker</h2>
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
      </div>
    </div>
  );
}
