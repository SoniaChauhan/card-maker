import { formatDate, formatTime, ordinal } from '../../utils/helpers';

export default function AnniversaryCardPreview({ data }) {
  const { guestName, partner1, partner2, years, date, time, venue, venueAddress, message } = data;

  return (
    <div id="anniv-card-print" className="anniversary-card">
      <div className="anniv-rose-row">🌹 🌹 🌹</div>
      <div className="anniv-rings">💍</div>

      {guestName && (
        <div className="anniv-guest-intro">
          To: <span className="anniv-guest-name">{guestName}</span>
        </div>
      )}

      {years && (
        <div className="anniv-badge">
          🎊 {ordinal(parseInt(years, 10))} Anniversary 🎊
        </div>
      )}

      <div className="anniv-title">Happy Anniversary!</div>

      <div className="anniv-couple">
        {partner1 || 'Partner 1'} &hearts; {partner2 || 'Partner 2'}
      </div>

      <div className="anniv-event-box">
        {date && (
          <div className="anniv-event-row">
            <span className="anniv-event-icon">📅</span>
            <span><strong>Date:</strong> {formatDate(date)}</span>
          </div>
        )}
        {time && (
          <div className="anniv-event-row">
            <span className="anniv-event-icon">⏰</span>
            <span><strong>Time:</strong> {formatTime(time)}</span>
          </div>
        )}
        {venue && (
          <div className="anniv-event-row">
            <span className="anniv-event-icon">📍</span>
            <div>
              <strong>Venue:</strong> {venue}
              {venueAddress && <><br /><span style={{ color: '#888', fontSize: '12px' }}>{venueAddress}</span></>}
            </div>
          </div>
        )}
      </div>

      {message && <div className="anniv-message">"{message}"</div>}

      <div className="anniv-deco-bottom">💕 ❤️ 💕</div>
    </div>
  );
}
