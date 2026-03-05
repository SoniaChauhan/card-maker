'use client';
import { useState, useEffect, useRef } from 'react';
import './LoginScreen.css';
import { useAuth } from '../../contexts/AuthContext';
import {
  generateOTP, storeOTP, verifyOTP,
  signUpUser, signInUser, resetPassword,
  createOrUpdateUser, userExists,
  isAdmin, ADMIN_EMAIL,
} from '../../services/authService';
import { sendOTPEmail, notifyAdmin, sendFeedback } from '../../services/notificationService';
import { isUserBlocked } from '../../services/blockService';
import { maskEmail } from '../../utils/helpers';
import AdminPanel from '../AdminPanel/AdminPanel';
import MyTemplates from '../MyTemplates/MyTemplates';
import DownloadHistory from '../DownloadHistory/DownloadHistory';
import Toast from '../shared/Toast';
import { getActiveFestivals, getAllFestivals, getUpcomingFestivals } from '../../utils/festivalCalendar';

/* Preview components for sample cards */
import WeddingCardPreview from '../WeddingCard/WeddingCardPreview';
import BirthdayCardPreview from '../BirthdayCard/BirthdayCardPreview';
import AnniversaryCardPreview from '../AnniversaryCard/AnniversaryCardPreview';
import BiodataCardPreview from '../BiodataCard/BiodataCardPreview';

/* Sample data for each card type */
const SAMPLE_WEDDING = {
  groomName: 'Rajesh Kumar', brideName: 'Priya Sharma',
  groomFamily: 'Son of Mr. Ramesh Kumar & Mrs. Sunita Kumar',
  brideFamily: 'Daughter of Mr. Vikram Sharma & Mrs. Meena Sharma',
  weddingDate: '2026-04-15', weddingTime: '7:30 PM',
  weddingVenue: 'Royal Palace Banquet Hall', weddingVenueAddress: 'MG Road, New Delhi - 110001',
  receptionDate: '2026-04-16', receptionTime: '8:00 PM', receptionVenue: 'Grand Celebration Hall',
  guestName: 'Dear Guest', message: 'Your gracious presence will make our special day more memorable.',
  familyMembers: '', photo: null, photoPreview: '', customPrograms: [], selectedTemplate: 1, bgColor: '',
};

const SAMPLE_BIRTHDAY = {
  guestName: 'Dear Friends & Family', birthdayPerson: 'Aarav', age: '5',
  date: '2026-03-25', time: '4:00 PM',
  venue: 'Fun Zone Party Hall', venueAddress: 'Sector 18, Noida - 201301',
  hostName: 'Sharma Family', message: 'Join us for a fun-filled celebration!',
  photo: null, photoPreview: '', selectedTemplate: 1, bgColor: '',
};

const SAMPLE_ANNIVERSARY = {
  partner1: 'Anil', partner2: 'Sunita', years: '25',
  date: '2026-05-10', message: 'Celebrating 25 wonderful years of love, laughter, and togetherness. Join us as we renew our vows!',
  photo: null, photoPreview: '', selectedTemplate: 1, bgColor: '',
};

const SAMPLE_BIODATA = {
  fullName: 'Priya Sharma', dob: '1998-06-15', age: '27', height: "5'4\"", weight: '55 kg',
  complexion: 'Fair', bloodGroup: 'B+', religion: 'Hindu', caste: 'Brahmin', subCaste: 'Kanyakubja',
  gotra: 'Kashyap', rashi: 'Virgo', nakshatra: 'Hasta', manglik: 'No',
  education: 'MBA (Finance)', occupation: 'Senior Analyst', employer: 'Deloitte', annualIncome: '₹12 LPA',
  fatherName: 'Mr. Ramesh Sharma', fatherOccupation: 'Retired Bank Manager',
  motherName: 'Mrs. Sunita Sharma', motherOccupation: 'Homemaker',
  siblings: '1 Elder Brother (Married, Software Engineer)', hobbies: 'Reading, Painting, Yoga, Travelling',
  aboutMe: 'A cheerful and family-oriented person with traditional values and modern outlook.',
  contactName: 'Mr. Ramesh Sharma (Father)', contactPhone: '+91 98765 43210',
  contactAddress: 'B-42, Green Park Extension, New Delhi - 110016',
  photo: null, photoPreview: '',
};

/* Template configs for sample preview */
const WEDDING_TEMPLATES = [
  { id: 1, name: 'Classic Gold', accent: '#b8860b' },
  { id: 2, name: 'Gold Ornate', accent: '#c9a84c' },
  { id: 3, name: 'Garden Floral', accent: '#3a7a4a' },
  { id: 4, name: 'Warm Peach', accent: '#c4756a' },
  { id: 5, name: 'Royal Maroon', accent: '#3d0a12' },
  { id: 6, name: 'Divine Love', accent: '#c9976a' },
  { id: 7, name: 'Sacred Border', accent: '#8b6914' },
];

const BIRTHDAY_TEMPLATES = [
  { id: 1, name: 'Space Adventure', accent: '#2c3e6b' },
  { id: 2, name: 'Pastel Balloons', accent: '#c4937f' },
  { id: 3, name: 'Cute Stars', accent: '#c67a5c' },
  { id: 4, name: 'Party Confetti', accent: '#d98a4b' },
  { id: 5, name: 'Sunshine Floral', accent: '#b87f7f' },
  { id: 6, name: 'Animal Friends', accent: '#9e7b5a' },
];

const ANNIVERSARY_TEMPLATES = [
  { id: 1, name: 'Royal Gold Floral', accent: '#c9a84c' },
  { id: 2, name: 'Rose Gold Romance', accent: '#d4a373' },
  { id: 3, name: 'Emerald Laurels', accent: '#5a8a4a' },
  { id: 4, name: 'Mandala Rings', accent: '#d4af37' },
  { id: 5, name: 'Vintage Frame', accent: '#b8860b' },
  { id: 6, name: 'Minimal Swirl', accent: '#c9a84c' },
];

const BIODATA_TEMPLATES = [
  { id: 1, name: 'Classic Gold', accent: '#d4af37' },
  { id: 2, name: 'Royal Blue', accent: '#1a3a5c' },
  { id: 3, name: 'Elegant Green', accent: '#2d5a3d' },
  { id: 4, name: 'Pink Blossom', accent: '#d4748a' },
  { id: 5, name: 'Modern Minimal', accent: '#4a4a4a' },
  { id: 6, name: 'Royal Purple', accent: '#5c3a6e' },
];

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

export default function LoginScreen({ onSelect, onEditTemplate, onOpenCombo, onOpenCalendar, onOpenFreeCards }) {
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

  /* Hidden admin login trigger — triple-click logo */
  const logoClickRef = useRef({ count: 0, timer: null });

  /* Sample preview modal state */
  const [samplePreview, setSamplePreview] = useState(null); // null | 'wedding' | 'birthday' | 'anniversary' | 'biodata'
  const [fullPreviewTpl, setFullPreviewTpl] = useState(null); // { type: 'wedding', id: 1 } for full card preview

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
  const [submittedEmail, setSubmittedEmail] = useState('');

  /* Edit / Delete / Reply state */
  const [editId, setEditId]                 = useState(null);
  const [editRating, setEditRating]         = useState(0);
  const [editHover, setEditHover]           = useState(0);
  const [editComment, setEditComment]       = useState('');
  const [editSaving, setEditSaving]         = useState(false);
  const [replyToId, setReplyToId]           = useState(null);
  const [replyComment, setReplyComment]     = useState('');
  const [replyName, setReplyName]           = useState('');
  const [replySending, setReplySending]     = useState(false);

  /* Subscriber notification state */
  const [subEmail, setSubEmail]   = useState('');
  const [subPhone, setSubPhone]   = useState('');
  const [subName, setSubName]     = useState('');
  const [subSending, setSubSending] = useState(false);
  const [subMsg, setSubMsg]       = useState('');
  const [showSubscribePopup, setShowSubscribePopup] = useState(true);

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
      setTimeout(() => setFbMsg(''), 4000);
      setSubmittedEmail(fbEmail.trim().toLowerCase());
      // Add to displayed reviews instantly
      setReviews(prev => [{ id: Date.now().toString(), name: fbName.trim(), email: fbEmail.trim().toLowerCase(), rating: fbRating, comment: fbComment.trim(), createdAt: new Date().toISOString(), replies: [] }, ...prev]);
      setFbName(''); setFbEmail(''); setFbRating(0); setFbComment('');
    } catch {
      setFbMsg('⚠️ Failed to send. Please try again.');
      setTimeout(() => setFbMsg(''), 4000);
    } finally { setFbSending(false); }
  }

  /* ========== EDIT FEEDBACK ========== */
  function startEdit(r) {
    setEditId(r.id);
    setEditRating(r.rating);
    setEditComment(r.comment);
  }
  function cancelEdit() { setEditId(null); setEditRating(0); setEditComment(''); setEditHover(0); }

  async function saveEdit(reviewId, ownerEmail) {
    if (!editComment.trim() || !editRating) return;
    setEditSaving(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', id: reviewId, email: ownerEmail, rating: editRating, comment: editComment.trim() }),
      });
      if (res.ok) {
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, rating: editRating, comment: editComment.trim() } : r));
        cancelEdit();
      }
    } catch { /* ignore */ }
    finally { setEditSaving(false); }
  }

  /* ========== DELETE FEEDBACK ========== */
  async function deleteFeedback(reviewId, ownerEmail) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    const userEmail = (fbEmail || submittedEmail || '').trim().toLowerCase();
    const userIsAdmin = isAdmin(userEmail);
    try {
      const payload = { action: 'delete', id: reviewId };
      if (userIsAdmin) {
        payload.adminEmail = userEmail;
      } else {
        payload.email = ownerEmail || userEmail;
      }
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== reviewId));
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Failed to delete.');
      }
    } catch { /* ignore */ }
  }

  /* ========== REPLY TO FEEDBACK ========== */
  function openReply(id) { setReplyToId(id); setReplyComment(''); setReplyName(''); }
  function cancelReply() { setReplyToId(null); setReplyComment(''); setReplyName(''); }

  async function submitReply(reviewId) {
    if (!replyComment.trim() || !replyName.trim()) return;
    setReplySending(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reply', id: reviewId, replyName: replyName.trim(), replyEmail: fbEmail || '', replyComment: replyComment.trim() }),
      });
      if (res.ok) {
        const newReply = { name: replyName.trim(), comment: replyComment.trim(), createdAt: new Date().toISOString() };
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, replies: [...(r.replies || []), newReply] } : r));
        cancelReply();
      }
    } catch { /* ignore */ }
    finally { setReplySending(false); }
  }

  /* ========== SUBSCRIBE FOR NOTIFICATIONS ========== */
  async function handleSubscribe(e) {
    e.preventDefault();
    if (!subEmail.trim() && !subPhone.trim()) { setSubMsg('⚠️ Please enter email or phone.'); return; }
    setSubSending(true);
    setSubMsg('');
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'subscribe', email: subEmail.trim(), phone: subPhone.trim(), name: subName.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubMsg('✅ Subscribed! You\'ll get notified about new cards & festivals.');
        setSubEmail('');
        setSubPhone('');
        setSubName('');
      } else {
        setSubMsg('❌ ' + (data.error || 'Failed'));
      }
    } catch { setSubMsg('❌ Something went wrong.'); }
    finally { setSubSending(false); }
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
    { id: 'birthday',      icon: '🎂', name: 'Birthday Invite Designer',      desc: 'Create personalised and stylish birthday party invitations with ease.',   grad: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', price: '₹19/₹49' },
    { id: 'wedding',       icon: '💐', name: 'Wedding Invite Designer',       desc: 'Create royal and classic wedding invitations with beautiful themes.',      grad: 'linear-gradient(135deg, #f7971e, #ffd200)', price: '₹19/₹49' },
    { id: 'anniversary',   icon: '💍', name: 'Anniversary Greeting Designer', desc: 'Craft elegant anniversary greetings to celebrate love and togetherness.', grad: 'linear-gradient(135deg, #ee5a6f, #f0c27b)', price: '₹19/₹49' },
    { id: 'biodata',       icon: '💒', name: 'Marriage Profile Designer',     desc: 'Build a traditional and detailed marriage biodata with a clean layout.',   grad: 'linear-gradient(135deg, #d4af37, #c0392b)', price: '₹49' },
  ];

  /* Festival calendar — auto-detect active festivals */
  const activeFestivals = getActiveFestivals();
  const upcomingFestivals = getUpcomingFestivals();
  const allFestivals = getAllFestivals();
  const [showOccasionalCards, setShowOccasionalCards] = useState(false);

  const FREE_CARDS_HINDI = [
    { id: 'motivational',  icon: '💪', name: 'प्रेरणादायक विचार',      desc: 'प्रेरणादायक विचार — थीम चुनें, कस्टमाइज़ करें और डाउनलोड करें!', grad: 'linear-gradient(135deg, #0f0c29, #302b63)' },
    { id: 'fathers',       icon: '👨‍👧', name: 'पिता पर सुविचार',        desc: 'पिता के प्यार को शब्दों में — थीम चुनें और फ्री डाउनलोड करें!', grad: 'linear-gradient(135deg, #2d3436, #636e72)' },
    { id: 'mothers',       icon: '💐', name: 'माँ पर सुविचार',         desc: 'माँ के प्यार को शब्दों में — थीम चुनें और फ्री डाउनलोड करें!', grad: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)' },
  ];

  const FREE_CARDS_ENGLISH = [
    { id: 'motivational-en', icon: '💪', name: 'Motivational Quotes',  desc: 'Inspiring English quotes — pick a theme, customize & download free!', grad: 'linear-gradient(135deg, #134e5e, #71b280)' },
    { id: 'fathers-en',      icon: '👨‍👧', name: 'Father\'s Quotes',     desc: 'Heartfelt father\'s quotes — pick a theme, customize & download free!', grad: 'linear-gradient(135deg, #0c3483, #a2b6df)' },
    { id: 'mothers-en',      icon: '💐', name: 'Mother\'s Quotes',     desc: 'Beautiful quotes celebrating a mother\'s love — customize & download free!', grad: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)' },
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
        <div className="lp-topbar-logo" onClick={() => {
          const ref = logoClickRef.current;
          ref.count += 1;
          clearTimeout(ref.timer);
          if (ref.count >= 3) { ref.count = 0; openAuthPopup('otp-login'); }
          else { ref.timer = setTimeout(() => { ref.count = 0; }, 600); }
        }}>✨ Card Maker</div>
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
          {/* Sign In/Sign Up removed - all users are guests */}
        </div>
      </div>

      {/* ═══════ SUBSCRIBE POPUP ═══════ */}
      {showSubscribePopup && (
        <div className="lp-subscribe-overlay" onClick={() => setShowSubscribePopup(false)}>
          <div className="lp-subscribe-popup" onClick={e => e.stopPropagation()}>
            <button className="lp-subscribe-close" onClick={() => setShowSubscribePopup(false)} aria-label="Close">✕</button>
            <div className="lp-subscribe-icon">🔔</div>
            <h2 className="lp-subscribe-title">Never Miss a New Card!</h2>
            <p className="lp-subscribe-desc">
              Subscribe to get notified when we add new card templates, festival offers, and exclusive deals — straight to your inbox.
            </p>
            <form className="lp-subscribe-form" onSubmit={handleSubscribe}>
              <div className="lp-subscribe-row">
                <input className="lp-subscribe-input" type="text" placeholder="Your name" value={subName} onChange={e => setSubName(e.target.value)} autoComplete="off" />
                <input className="lp-subscribe-input" type="email" placeholder="Email address *" value={subEmail} onChange={e => setSubEmail(e.target.value)} autoComplete="off" />
                <input className="lp-subscribe-input" type="tel" placeholder="WhatsApp / Phone" value={subPhone} onChange={e => setSubPhone(e.target.value)} autoComplete="off" />
              </div>
              <button className="lp-subscribe-btn" type="submit" disabled={subSending}>
                {subSending ? '⏳ Subscribing…' : '🔔 Subscribe Now — It\'s Free!'}
              </button>
              {subMsg && <p className={`lp-subscribe-msg ${subMsg.startsWith('✅') ? 'success' : 'warn'}`}>{subMsg}</p>}
            </form>
            <p className="lp-subscribe-privacy">
              📱 We&apos;ll notify you via <strong>Email</strong> &amp; <strong>WhatsApp</strong>. No spam, ever.
            </p>
          </div>
        </div>
      )}

      {/* ═══════ ACCOUNT PANEL OVERLAY ═══════ */}
      {user && accountTab && (
        <div className="lp-account-overlay" onClick={() => setAccountTab(null)}>
          <div className={`lp-account-panel${accountTab === 'admin' ? ' lp-account-panel--wide' : ''}`} onClick={e => e.stopPropagation()}>
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
          <h1 className="lp-hero-title">
            Create Beautiful Cards <span className="lp-accent">in Minutes</span>
          </h1>
          <p className="lp-hero-sub">
            See how your invitation cards will look! Click below to preview sample templates with pre-filled data.
          </p>

          {/* Sample Preview Buttons */}
          <div className="lp-sample-buttons">
            <button className="lp-sample-btn lp-sample-btn--wedding" onClick={() => setSamplePreview('wedding')}>
              <span className="lp-sample-icon">💐</span>
              <span className="lp-sample-label">Wedding Samples</span>
            </button>
            <button className="lp-sample-btn lp-sample-btn--birthday" onClick={() => setSamplePreview('birthday')}>
              <span className="lp-sample-icon">🎂</span>
              <span className="lp-sample-label">Birthday Samples</span>
            </button>
            <button className="lp-sample-btn lp-sample-btn--anniversary" onClick={() => setSamplePreview('anniversary')}>
              <span className="lp-sample-icon">💍</span>
              <span className="lp-sample-label">Anniversary Samples</span>
            </button>
            <button className="lp-sample-btn lp-sample-btn--biodata" onClick={() => setSamplePreview('biodata')}>
              <span className="lp-sample-icon">💒</span>
              <span className="lp-sample-label">Biodata Samples</span>
            </button>
          </div>

          <div className="lp-hero-stats">
            <div className="lp-stat"><span className="lp-stat-num">23+</span><span className="lp-stat-label">Card Types</span></div>
            <div className="lp-stat-divider" />
            <div className="lp-stat"><span className="lp-stat-num">50+</span><span className="lp-stat-label">Templates Planned</span></div>
            <div className="lp-stat-divider" />
            <div className="lp-stat"><span className="lp-stat-num">5</span><span className="lp-stat-label">Languages</span></div>
          </div>
        </div>
      </section>

      {/* ═══════ ACTIVE FESTIVAL SPECIAL OFFERS (auto-detected) ═══════ */}
      {activeFestivals.map(f => (
        <section key={f.key} className="lp-offer-banner" style={{ background: f.grad }}>
          <div className="lp-offer-inner">
            <div className="lp-offer-badge">🔥 SPECIAL OFFER</div>
            <h2 className="lp-offer-title">{f.offerTitle}</h2>
            <p className="lp-offer-desc" dangerouslySetInnerHTML={{ __html: f.offerDesc }} />
            <div className="lp-offer-features">
              {f.features.map(feat => <span key={feat} className="lp-offer-feature">✅ {feat}</span>)}
            </div>
            <button className="lp-offer-cta" type="button" onClick={() => handleCardClick(f.offerCard)}>
              {f.offerCta}
            </button>
          </div>
        </section>
      ))}

      {/* ═══════ ACTIVE FESTIVAL FREE CARDS (if any) ═══════ */}
      {activeFestivals.filter(f => f.freeCards.length > 0).map(f => (
        <section key={f.key + '-free'} className="lp-showcase lp-holi-section">
          <div className="lp-section-header">
            <h2 className="lp-section-title">{f.icon} {f.name} Special — Free Cards & Videos</h2>
            <span className="lp-section-free-tag">100% FREE</span>
          </div>
          <p className="lp-section-sub">Download & share {f.name} greetings instantly!</p>
          <div className="lp-showcase-grid lp-free-grid">
            {f.freeCards.map(c => (
              <button key={c.id} className="lp-showcase-card lp-free-card lp-holi-card" style={{ background: c.grad }} type="button" onClick={() => handleCardClick(c.id)}>
                <span className="lp-free-badge">FREE</span>
                <span className="lp-showcase-icon">{c.icon}</span>
                <h3 className="lp-showcase-name">{c.name}</h3>
                <p className="lp-showcase-desc">{c.desc}</p>
              </button>
            ))}
          </div>
        </section>
      ))}

      {/* ═══════ UPCOMING FESTIVALS PREVIEW ═══════ */}
      {upcomingFestivals.length > 0 && !activeFestivals.length && (
        <section className="lp-upcoming-section">
          <h2 className="lp-section-title">📅 Upcoming Festivals</h2>
          <p className="lp-section-sub">Special offers coming soon for these festivals!</p>
          <div className="lp-upcoming-grid">
            {upcomingFestivals.slice(0, 4).map(f => (
              <div key={f.key} className="lp-upcoming-card" style={{ background: f.grad }}>
                <span className="lp-showcase-icon">{f.icon}</span>
                <h3 className="lp-showcase-name">{f.name}</h3>
                <span className="lp-upcoming-date">Starts {new Date(f.nextStart + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══════ FESTIVAL CALENDAR BUTTON ═══════ */}
      <section className="lp-calendar-section">
        <h2 className="lp-section-title">🗓️ Festival Calendar</h2>
        <p className="lp-section-sub">Plan ahead! Explore all Indian festivals month‑wise and create cards for each celebration.</p>
        <button className="lp-calendar-btn" onClick={onOpenCalendar}>
          🗓️ Open Festival Calendar
        </button>
      </section>

      {/* ═══════ FREE CARDS BUTTON ═══════ */}
      <section className="lp-showcase lp-free-section">
        <div className="lp-section-header">
          <h2 className="lp-section-title">🎁 Free Instant Cards</h2>
          <span className="lp-section-free-tag">100% FREE</span>
        </div>
        <p className="lp-section-sub">No form needed — just pick, customize colors &amp; download instantly!</p>
        <button className="lp-free-cards-btn" onClick={onOpenFreeCards}>
          🎁 Browse Free Cards
        </button>
      </section>

      {/* ═══════ COMBO OFFER BANNER ═══════ */}
      <section className="lp-combo-banner-section">
        <div className="lp-combo-banner" onClick={onOpenCombo} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onOpenCombo?.()}>
          <div className="lp-combo-fire">🔥</div>
          <div className="lp-combo-content">
            <div className="lp-combo-tag">COMBO OFFER</div>
            <h3 className="lp-combo-title">Pick Any 2 Premium Cards — Just ₹69</h3>
            <p className="lp-combo-desc">15 days unlimited download • No watermark • Save ₹29!</p>
          </div>
          <div className="lp-combo-arrow">→</div>
        </div>
      </section>

      {/* ═══════ PREMIUM CARDS ═══════ */}
      <section className="lp-showcase">
        <div className="lp-section-header">
          <h2 className="lp-section-title">✨ Premium Card Designers</h2>
          <span className="lp-section-price">Starting from ₹19</span>
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

      {/* ═══════ NEED A CUSTOM DESIGN ═══════ */}
      <section className="lp-custom-design-section">
        <h2 className="lp-section-title">🎨 Need a Custom Design?</h2>
        <div className="lp-custom-design">
          <p className="lp-text">
            Looking for a card that is fully personalized and tailored to your exact theme, event, or business branding?
            We offer custom card design services created exclusively by Creative Thinker Design Hub.
          </p>
          <p className="lp-text">📩 Email us your requirements at: <strong>creativethinker.designhub@gmail.com</strong></p>
          <p className="lp-text lp-brand-subtle">Our team will create a unique, high-quality design specifically for you.</p>
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
            <h4 className="lp-subheading">🌟 Why Choose Our Card Maker?</h4>
            <ul className="lp-features">
              <li><strong>✓ Premium Templates for Every Card Type</strong> — Access a wide collection of professionally designed templates for invitations, festival greetings, announcements, business flyers, and more—each crafted to help your card look stunning and professional.</li>
              <li><strong>✓ Real‑Time Editing with Live Preview</strong> — Customize your card easily with instant live preview. Change colors, text, images, and layout while seeing updates in real time.</li>
              <li><strong>✓ High‑Resolution PNG &amp; PDF Downloads</strong> — Download print‑ready, high‑quality PNG and PDF files ideal for sharing on WhatsApp, Instagram, Facebook, or printing.</li>
              <li><strong>✓ Multi‑Language Support</strong> — Design your cards in multiple languages to suit your personal, cultural, or business needs.</li>
              <li><strong>✓ Works Smoothly on All Devices</strong> — Create beautiful cards from your desktop, tablet, or mobile. Our platform is fully responsive and optimized for every screen size.</li>
            </ul>
          </div>

          {/* Rate & Review */}
          <div className="lp-feedback-section">
            <h4 className="lp-subheading">⭐ Rate &amp; Review</h4>
            <p className="lp-fb-tagline">
              💬 Your feedback matters! Help us improve by sharing your thoughts.
              Rate your experience and leave a comment — every review helps us serve you better.
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

            {/* Real user reviews displayed inside this section */}
            <div className="lp-inline-reviews">
              <h5 className="lp-inline-reviews-title">💬 What Our Users Say</h5>
              {reviewsLoading ? (
                <p className="lp-reviews-loading">Loading reviews…</p>
              ) : reviews.length === 0 ? (
                <p className="lp-reviews-empty">No reviews yet. Be the first to share your feedback! ⭐</p>
              ) : (
                <div className="lp-inline-reviews-list">
                  {reviews.map(r => {
                    const ownerCheck = (fbEmail || submittedEmail || '').trim().toLowerCase();
                    const isOwner = ownerCheck && r.email && ownerCheck === r.email.trim().toLowerCase();
                    const isUserAdmin = isAdmin(ownerCheck);
                    const isEditing = editId === r.id;
                    const isReplying = replyToId === r.id;
                    return (
                      <div className="lp-review-card" key={r.id}>
                        <div className="lp-review-header">
                          <div className="lp-review-avatar">{r.name?.charAt(0)?.toUpperCase() || '?'}</div>
                          <div>
                            <div className="lp-review-name">{r.name}</div>
                            {!isEditing && (
                              <div className="lp-review-stars">
                                {[1, 2, 3, 4, 5].map(s => (
                                  <span key={s} className={`lp-review-star ${s <= r.rating ? 'filled' : ''}`}>★</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className="lp-review-date" style={{ marginLeft: 'auto' }}>
                            {new Date(r.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>

                        {/* Normal view */}
                        {!isEditing && r.comment && <p className="lp-review-comment">{r.comment}</p>}

                        {/* Edit mode */}
                        {isEditing && (
                          <div className="lp-review-edit-form">
                            <div className="login-stars" style={{ marginBottom: 8 }}>
                              {[1, 2, 3, 4, 5].map(s => (
                                <button key={s} type="button"
                                  className={`login-star ${s <= (editHover || editRating) ? 'filled' : ''}`}
                                  onClick={() => setEditRating(s)}
                                  onMouseEnter={() => setEditHover(s)}
                                  onMouseLeave={() => setEditHover(0)}
                                >★</button>
                              ))}
                            </div>
                            <textarea className="lp-fb-textarea" rows={2} value={editComment}
                              onChange={e => setEditComment(e.target.value)} />
                            <div className="lp-review-edit-actions">
                              <button className="lp-review-btn save" onClick={() => saveEdit(r.id, r.email)} disabled={editSaving}>
                                {editSaving ? '⏳' : '💾'} Save
                              </button>
                              <button className="lp-review-btn cancel" onClick={cancelEdit}>✕ Cancel</button>
                            </div>
                          </div>
                        )}

                        {/* Action buttons — owner: edit+delete, admin: delete, others: reply only */}
                        {!isEditing && (
                          <div className="lp-review-actions">
                            {isOwner && (
                              <button className="lp-review-btn edit" onClick={() => startEdit(r)}>✏️ Edit</button>
                            )}
                            {(isOwner || isUserAdmin) && (
                              <button className="lp-review-btn delete" onClick={() => deleteFeedback(r.id, r.email)}>🗑️ Delete</button>
                            )}
                            {!isOwner && (
                              <button className="lp-review-btn reply" onClick={() => openReply(r.id)}>💬 Reply</button>
                            )}
                          </div>
                        )}

                        {/* Replies list */}
                        {r.replies && r.replies.length > 0 && (
                          <div className="lp-review-replies">
                            {r.replies.map((rp, ri) => (
                              <div key={ri} className="lp-reply-item">
                                <div className="lp-reply-header">
                                  <span className="lp-reply-avatar">{rp.name?.charAt(0)?.toUpperCase() || '?'}</span>
                                  <span className="lp-reply-name">{rp.name}</span>
                                  <span className="lp-reply-date">
                                    {new Date(rp.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                  </span>
                                </div>
                                <p className="lp-reply-comment">{rp.comment}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply form */}
                        {isReplying && (
                          <div className="lp-reply-form">
                            <input className="lp-fb-input" type="text" placeholder="Your name *"
                              value={replyName} onChange={e => setReplyName(e.target.value)} />
                            <textarea className="lp-fb-textarea" rows={2} placeholder="Write a reply…"
                              value={replyComment} onChange={e => setReplyComment(e.target.value)} />
                            <div className="lp-review-edit-actions">
                              <button className="lp-review-btn save" onClick={() => submitReply(r.id)} disabled={replySending}>
                                {replySending ? '⏳' : '📨'} Reply
                              </button>
                              <button className="lp-review-btn cancel" onClick={cancelReply}>✕ Cancel</button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ ABOUT CARD MAKER ═══════ */}
      <section className="lp-about">
        <h2 className="lp-section-title">📖 About Card Maker</h2>
        <div className="lp-about-content">
          <p>
            <strong>Card Maker</strong> is a simple and intuitive online tool that helps you create birthday invitations,
            wedding cards, anniversary greetings, festival greeting cards, motivational quote cards, and professional
            documents like resumes and marriage biodata — all in one place. With a growing library of ready‑to‑use
            templates in <strong>Hindi, English, Punjabi, and Gujarati</strong>, it&apos;s easy for anyone to design and
            download beautiful cards quickly.
          </p>
          <p>
            Our editor lets you customize text, colors, fonts, and images with a smooth live preview experience.
            Once your design is ready, you can download it instantly in high‑quality PNG or PDF format, perfect for
            printing or sharing on WhatsApp, Instagram, or email.
          </p>
          <p>
            Developed by <strong>Creative Thinker Design Hub</strong>, Card Maker focuses on making design accessible
            to everyone — from students and families to small business owners and event planners. Whether it&apos;s a festive
            greeting or a professional document, Card Maker helps you create polished, visually appealing cards without
            needing any design skills.
          </p>
        </div>
      </section>

      {/* ═══════ OCCASIONAL / FESTIVAL CARDS TOGGLE ═══════ */}
      <section className="lp-occasional-section">
        <button
          className={`lp-occasional-toggle ${showOccasionalCards ? 'active' : ''}`}
          type="button"
          onClick={() => setShowOccasionalCards(prev => !prev)}
        >
          <span className="lp-occasional-icon">🎉</span>
          <span className="lp-occasional-text">
            {showOccasionalCards ? 'Hide' : 'Show'} Festival & Occasional Cards
          </span>
          <span className={`lp-occasional-arrow ${showOccasionalCards ? 'open' : ''}`}>▼</span>
        </button>

        {showOccasionalCards && (
          <div className="lp-occasional-content">
            <p className="lp-section-sub">Browse all seasonal & festival cards — Holi, Diwali, Eid, Christmas & more!</p>
            <div className="lp-occasional-grid">
              {allFestivals.map(f => {
                const isActive = activeFestivals.some(af => af.key === f.key);
                return (
                  <button
                    key={f.key}
                    className={`lp-occasional-card ${isActive ? 'lp-occasional-card--active' : ''}`}
                    style={{ background: f.grad }}
                    type="button"
                    onClick={() => handleCardClick(f.offerCard)}
                  >
                    {isActive && <span className="lp-occasional-live">🔴 LIVE</span>}
                    <span className="lp-showcase-icon">{f.icon}</span>
                    <h3 className="lp-showcase-name">{f.name}</h3>
                    {f.nameHindi && <p className="lp-occasional-hindi">{f.nameHindi}</p>}
                    <span className="lp-occasional-price">{f.offerPrice}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
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

      {/* ═══════ SAMPLE PREVIEW MODAL ═══════ */}
      {samplePreview && (
        <div className="lp-sample-overlay" onClick={() => setSamplePreview(null)}>
          <div className="lp-sample-modal" onClick={e => e.stopPropagation()}>
            <button className="lp-sample-close" onClick={() => setSamplePreview(null)}>✕</button>
            
            <div className="lp-sample-header">
              <h2 className="lp-sample-title">
                {samplePreview === 'wedding' && '💐 Wedding Invitation Templates'}
                {samplePreview === 'birthday' && '🎂 Birthday Invitation Templates'}
                {samplePreview === 'anniversary' && '💍 Anniversary Card Templates'}
                {samplePreview === 'biodata' && '💒 Marriage Biodata Templates'}
              </h2>
              <p className="lp-sample-subtitle">Preview all design options with sample data</p>
            </div>

            <div className="lp-sample-grid">
              {samplePreview === 'wedding' && WEDDING_TEMPLATES.map(tpl => (
                <div key={tpl.id} className="lp-sample-card">
                  <div className="lp-sample-preview" style={{ borderColor: tpl.accent }}>
                    <div className="lp-sample-preview-inner lp-sample-preview--wedding">
                      <WeddingCardPreview data={{ ...SAMPLE_WEDDING, selectedTemplate: tpl.id }} lang="en" template={tpl.id} />
                    </div>
                    <button className="lp-sample-preview-btn" onClick={() => setFullPreviewTpl({ type: 'wedding', id: tpl.id, name: tpl.name })}>
                      👁️ Preview
                    </button>
                  </div>
                  <span className="lp-sample-name" style={{ color: tpl.accent }}>{tpl.name}</span>
                </div>
              ))}

              {samplePreview === 'birthday' && BIRTHDAY_TEMPLATES.map(tpl => (
                <div key={tpl.id} className="lp-sample-card">
                  <div className="lp-sample-preview" style={{ borderColor: tpl.accent }}>
                    <div className="lp-sample-preview-inner lp-sample-preview--birthday">
                      <BirthdayCardPreview data={{ ...SAMPLE_BIRTHDAY, selectedTemplate: tpl.id }} lang="en" template={tpl.id} />
                    </div>
                    <button className="lp-sample-preview-btn" onClick={() => setFullPreviewTpl({ type: 'birthday', id: tpl.id, name: tpl.name })}>
                      👁️ Preview
                    </button>
                  </div>
                  <span className="lp-sample-name" style={{ color: tpl.accent }}>{tpl.name}</span>
                </div>
              ))}

              {samplePreview === 'anniversary' && ANNIVERSARY_TEMPLATES.map(tpl => (
                <div key={tpl.id} className="lp-sample-card">
                  <div className="lp-sample-preview" style={{ borderColor: tpl.accent }}>
                    <div className="lp-sample-preview-inner lp-sample-preview--anniversary">
                      <AnniversaryCardPreview data={{ ...SAMPLE_ANNIVERSARY, selectedTemplate: tpl.id }} lang="en" template={tpl.id} />
                    </div>
                    <button className="lp-sample-preview-btn" onClick={() => setFullPreviewTpl({ type: 'anniversary', id: tpl.id, name: tpl.name })}>
                      👁️ Preview
                    </button>
                  </div>
                  <span className="lp-sample-name" style={{ color: tpl.accent }}>{tpl.name}</span>
                </div>
              ))}

              {samplePreview === 'biodata' && BIODATA_TEMPLATES.map(tpl => (
                <div key={tpl.id} className="lp-sample-card">
                  <div className="lp-sample-preview" style={{ borderColor: tpl.accent }}>
                    <div className="lp-sample-preview-inner lp-sample-preview--biodata">
                      <BiodataCardPreview data={SAMPLE_BIODATA} lang="hi" template={tpl.id} community="hindi" />
                    </div>
                    <button className="lp-sample-preview-btn" onClick={() => setFullPreviewTpl({ type: 'biodata', id: tpl.id, name: tpl.name })}>
                      👁️ Preview
                    </button>
                  </div>
                  <span className="lp-sample-name" style={{ color: tpl.accent }}>{tpl.name}</span>
                </div>
              ))}
            </div>

            {/* Full Preview Overlay */}
            {fullPreviewTpl && (
              <div className="lp-fullpreview-overlay" onClick={() => setFullPreviewTpl(null)}>
                <div className="lp-fullpreview-wrap" onClick={e => e.stopPropagation()}>
                  <button className="lp-fullpreview-close" onClick={() => setFullPreviewTpl(null)}>✕</button>
                  <h3 className="lp-fullpreview-title">{fullPreviewTpl.name}</h3>
                  <div className="lp-fullpreview-card">
                    {fullPreviewTpl.type === 'wedding' && (
                      <WeddingCardPreview data={{ ...SAMPLE_WEDDING, selectedTemplate: fullPreviewTpl.id }} lang="en" template={fullPreviewTpl.id} />
                    )}
                    {fullPreviewTpl.type === 'birthday' && (
                      <BirthdayCardPreview data={{ ...SAMPLE_BIRTHDAY, selectedTemplate: fullPreviewTpl.id }} lang="en" template={fullPreviewTpl.id} />
                    )}
                    {fullPreviewTpl.type === 'anniversary' && (
                      <AnniversaryCardPreview data={{ ...SAMPLE_ANNIVERSARY, selectedTemplate: fullPreviewTpl.id }} lang="en" template={fullPreviewTpl.id} />
                    )}
                    {fullPreviewTpl.type === 'biodata' && (
                      <BiodataCardPreview data={SAMPLE_BIODATA} lang="hi" template={fullPreviewTpl.id} community="hindi" />
                    )}
                  </div>
                  <button className="lp-fullpreview-back" onClick={() => setFullPreviewTpl(null)}>
                    ← Back to Templates
                  </button>
                </div>
              </div>
            )}

            <div className="lp-sample-actions">
              <button className="lp-sample-cta" onClick={() => { setSamplePreview(null); handleCardClick(samplePreview); }}>
                🎨 Create Your Own {samplePreview.charAt(0).toUpperCase() + samplePreview.slice(1)} Card
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast text={toast.text} show={toast.show} />
    </div>
  );
}
