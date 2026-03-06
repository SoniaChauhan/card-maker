'use client';
import { useState } from 'react';
import { getUserSavedData } from '../../services/downloadHistoryService';
import './UserLookup.css';

/**
 * UserLookup — asks returning users for their registered email address
 * before showing the form. If previous data is found, offers to pre-fill.
 *
 * @param {string}   cardType   - e.g. 'biodata', 'wedding'
 * @param {Function} onContinue - called with { prefillData: object|null, lookupId: string }
 * @param {Function} onSkip     - called when user chooses to start fresh
 */
export default function UserLookup({ cardType, onContinue, onSkip }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function isValidEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }

  async function handleLookup() {
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!isValidEmail(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await getUserSavedData(email.trim(), '', cardType);
      if (result.found && result.formData) {
        onContinue({ prefillData: result.formData, lookupId: email.trim(), lookupFound: true });
      } else {
        onContinue({ prefillData: null, lookupId: email.trim(), lookupFound: false });
      }
    } catch (err) {
      console.error('Lookup error:', err);
      // Even on error, let user continue with empty form
      onContinue({ prefillData: null, lookupId: email.trim(), lookupFound: false });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="user-lookup-screen">
      <div className="user-lookup-card">
        <div className="user-lookup-icon">👋</div>
        <h2 className="user-lookup-title">Welcome Back!</h2>
        <p className="user-lookup-desc">
          Enter your registered email address to auto-fill your previous details.
        </p>

        <div className="user-lookup-fields">
          <div className="user-lookup-field">
            <label className="user-lookup-label">✉️ Email Address</label>
            <input
              type="email"
              className="user-lookup-input"
              placeholder="e.g. yourname@email.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
            />
          </div>
        </div>

        {error && <p className="user-lookup-error">{error}</p>}

        <div className="user-lookup-actions">
          <button
            className="user-lookup-btn user-lookup-btn-primary"
            onClick={handleLookup}
            disabled={loading || !isValidEmail(email)}
          >
            {loading ? 'Looking up...' : '🔍 Find My Details'}
          </button>

          <button
            className="user-lookup-btn user-lookup-btn-skip"
            onClick={onSkip}
            disabled={loading}
          >
            Start Fresh →
          </button>
        </div>
      </div>
    </div>
  );
}
