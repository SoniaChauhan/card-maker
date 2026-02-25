import { formatDate, formatTime, ordinal } from '../../utils/helpers';
import { T } from '../../utils/translations';

export default function AnniversaryCardPreview({ data, lang = 'en' }) {
  const t = T[lang];
  const { guestName, partner1, partner2, years, date, time, venue, venueAddress, message } = data;

  return (
    <div id="anniv-card-print" className="anniversary-card">
      <div className="anniv-rose-row">🌹 🌹 🌹</div>
      <div className="anniv-rings">💍</div>

      {guestName && (
        <div className="anniv-guest-intro">
          {t.to}: <span className="anniv-guest-name">{guestName}</span>
        </div>
      )}

      {years && (
        <div className="anniv-badge">
          {t.annivBadge(ordinal(parseInt(years, 10)))}
        </div>
      )}

      <div className="anniv-title">{t.annivTitle}</div>

      <div className="anniv-couple">
        {partner1 || 'Partner 1'} &hearts; {partner2 || 'Partner 2'}
      </div>

      <div className="anniv-event-box">
        {date && (
          <div className="anniv-event-row">
            <span className="anniv-event-icon">📅</span>
            <span><strong>{t.date}:</strong> {formatDate(date)}</span>
          </div>
        )}
        {time && (
          <div className="anniv-event-row">
            <span className="anniv-event-icon">⏰</span>
            <span><strong>{t.time}:</strong> {formatTime(time)}</span>
          </div>
        )}
        {venue && (
          <div className="anniv-event-row">
            <span className="anniv-event-icon">📍</span>
            <div>
              <strong>{t.venue}:</strong> {venue}
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
