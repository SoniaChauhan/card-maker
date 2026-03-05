'use client';
import { useState } from 'react';
import { getUserSavedData } from '../../services/downloadHistoryService';
import './UserLookup.css';

/**
 * UserLookup — asks returning users for their registered mobile number
 * before showing the form. If previous data is found, offers to pre-fill.
 *
 * @param {string}   cardType   - e.g. 'biodata', 'wedding'
 * @param {Function} onContinue - called with { prefillData: object|null, lookupId: string }
 * @param {Function} onSkip     - called when user chooses to start fresh
 */
export default function UserLookup({ cardType, onContinue, onSkip }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLookup() {
    if (!phone.trim()) {
      setError('Please enter your mobile number');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await getUserSavedData('', phone.trim(), cardType);
      if (result.found && result.formData) {
        onContinue({ prefillData: result.formData, lookupId: phone.trim() });
      } else {
        onContinue({ prefillData: null, lookupId: phone.trim() });
      }
    } catch (err) {
      console.error('Lookup error:', err);
      // Even on error, let user continue with empty form
      onContinue({ prefillData: null, lookupId: phone.trim() });
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
          Enter your registered mobile number to auto-fill your previous details.
        </p>

        <div className="user-lookup-fields">
          <div className="user-lookup-field">
            <label className="user-lookup-label">📱 Mobile Number</label>
            <input
              type="tel"
              className="user-lookup-input"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setError(''); }}
              maxLength={10}
            />
          </div>
        </div>

        {error && <p className="user-lookup-error">{error}</p>}

        <div className="user-lookup-actions">
          <button
            className="user-lookup-btn user-lookup-btn-primary"
            onClick={handleLookup}
            disabled={loading || phone.length < 10}
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
