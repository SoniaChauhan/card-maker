import { formatDate, formatTime } from '../../utils/helpers';
import { T } from '../../utils/translations';
import { RELIGION_CONFIG } from '../../utils/religionConfig';

export default function JagrataCardPreview({ data, lang = 'hi' }) {
  const t = T[lang];
  const { guestName, organizerName, jagrataTitle, purpose, date, startTime, venue, venueAddress, prasad, message, religion = 'hindu' } = data;
  const rc = RELIGION_CONFIG[religion] || RELIGION_CONFIG.hindu;

  return (
    <div id="jagrata-card-print" className="jagrata-card">
      <div className="jagrata-deco-top">{rc.decoTop}</div>
      <div className="jagrata-om" style={{ color: rc.accentColor }}>{rc.mainIcon}</div>

      <div className="jagrata-badge">{t.jagBadge}</div>

      {guestName && (
        <div className="jagrata-guest-intro">
          {t.jagGuest}: <span className="jagrata-guest-name">{guestName}</span>
        </div>
      )}

      <div className="jagrata-title">{jagrataTitle || 'Shree Shyam Jagrata'}</div>
      <div className="jagrata-subtitle">{t.jagSubtitle}</div>

      {organizerName && (
        <div className="jagrata-organizer">
          {t.jagOrg}: <span>{organizerName}</span>
        </div>
      )}

      {purpose && (
        <div className="jagrata-purpose-box">
          {t.jagPurpose}: {purpose}
        </div>
      )}

      <div className="jagrata-event-box">
        {date && (
          <div className="jagrata-event-row">
            <span className="jagrata-event-icon">📅</span>
            <span><strong>{t.date}:</strong> {formatDate(date)}</span>
          </div>
        )}
        {startTime && (
          <div className="jagrata-event-row">
            <span className="jagrata-event-icon">⏰</span>
            <span><strong>{t.time}:</strong> {formatTime(startTime)} {t.jagStart}</span>
          </div>
        )}
        {venue && (
          <div className="jagrata-event-row">
            <span className="jagrata-event-icon">📍</span>
            <div>
              <strong>{t.venue}:</strong> {venue}
              {venueAddress && <><br /><span style={{ color: '#888', fontSize: '12px' }}>{venueAddress}</span></>}
            </div>
          </div>
        )}
        {prasad && (
          <div className="jagrata-event-row">
            <span className="jagrata-event-icon">{rc.prasadIcon}</span>
            <span><strong>{t.jagPrasad}:</strong> {prasad}</span>
          </div>
        )}
      </div>

      {message && <div className="jagrata-message">"{message}"</div>}

      <div className="jagrata-deco-bottom">{rc.decoBottom}</div>
      <div className="jagrata-footer-text">{t.jagFooter}</div>
    </div>
  );
}
