import { useState } from 'react';
import './LoginScreen.css';
import { useAuth } from '../../contexts/AuthContext';
import { generateOTP, storeOTP, verifyOTP, createOrUpdateUser } from '../../services/authService';
import { sendOTPEmail, notifyAdmin } from '../../services/notificationService';

export default function LoginScreen() {
  const { login } = useAuth();

  const [step, setStep]       = useState('email');   // 'email' | 'otp'
  const [email, setEmail]     = useState('');
  const [otp, setOtp]         = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [info, setInfo]       = useState('');

  /* ---- Step 1: send OTP ---- */
  async function handleSendOTP(e) {
    e.preventDefault();
    setError('');
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const code = generateOTP();
      await storeOTP(trimmed, code);
      await sendOTPEmail(trimmed, code);
      setInfo(`OTP sent to ${trimmed} — check your inbox.`);
      setStep('otp');
    } catch (err) {
      console.error(err);
      setError('Error: ' + (err?.text || err?.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  }

  /* ---- Step 2: verify OTP ---- */
  async function handleVerifyOTP(e) {
    e.preventDefault();
    setError('');
    if (otp.length !== 6) {
      setError('OTP must be 6 digits.');
      return;
    }

    setLoading(true);
    try {
      const valid = await verifyOTP(email.trim().toLowerCase(), otp);
      if (!valid) {
        setError('Invalid or expired OTP. Please try again.');
        setLoading(false);
        return;
      }

      const user = await createOrUpdateUser(email);
      login(user);

      /* notify admin about new login */
      notifyAdmin(
        '🔑 New User Login — Card Maker',
        `Sender: ${user.email}\nRole: ${user.role}\n\nThis user has logged in at ${new Date().toLocaleString()} and is requesting access to the dashboard.`,
        user.email
      ).catch(() => {});  // fire-and-forget
    } catch (err) {
      console.error(err);
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  /* ---- Resend OTP ---- */
  async function handleResend() {
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const code = generateOTP();
      await storeOTP(email.trim().toLowerCase(), code);
      await sendOTPEmail(email.trim().toLowerCase(), code);
      setInfo('New OTP sent!');
    } catch {
      setError('Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-icon">✨</div>
        <h2>Card Maker</h2>
        <p>
          {step === 'email'
            ? 'Enter your email to sign up / log in.'
            : `Enter the 6-digit OTP sent to ${email}`}
        </p>

        {error && <div className="login-error">{error}</div>}
        {info  && <div className="login-info">{info}</div>}

        {step === 'email' ? (
          <form onSubmit={handleSendOTP}>
            <input
              className="login-input"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
            />
            <button className="login-btn" disabled={loading}>
              {loading ? '⏳ Sending OTP…' : '📩 Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <input
              className="login-input"
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
              autoFocus
            />
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
