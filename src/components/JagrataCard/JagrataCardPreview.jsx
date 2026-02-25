import { formatDate, formatTime } from '../../utils/helpers';

export default function JagrataCardPreview({ data }) {
  const { guestName, organizerName, jagrataTitle, purpose, date, startTime, venue, venueAddress, prasad, message } = data;

  return (
    <div id="jagrata-card-print" className="jagrata-card">
      <div className="jagrata-deco-top">🪔 ✨ 🪔 ✨ 🪔</div>
      <div className="jagrata-om">🕉️</div>

      <div className="jagrata-badge">॥ जय श्री श्याम ॥</div>

      {guestName && (
        <div className="jagrata-guest-intro">
          आदरणीय: <span className="jagrata-guest-name">{guestName}</span>
        </div>
      )}

      <div className="jagrata-title">{jagrataTitle || 'Shree Shyam Jagrata'}</div>
      <div className="jagrata-subtitle">Khatu Shyam Ji Ki Jai 🙏</div>

      {organizerName && (
        <div className="jagrata-organizer">
          आयोजक: <span>{organizerName}</span>
        </div>
      )}

      {purpose && (
        <div className="jagrata-purpose-box">
          🙏 उद्देश्य: {purpose}
        </div>
      )}

      <div className="jagrata-event-box">
        {date && (
          <div className="jagrata-event-row">
            <span className="jagrata-event-icon">📅</span>
            <span><strong>दिनांक:</strong> {formatDate(date)}</span>
          </div>
        )}
        {startTime && (
          <div className="jagrata-event-row">
            <span className="jagrata-event-icon">⏰</span>
            <span><strong>समय:</strong> {formatTime(startTime)} से प्रारंभ</span>
          </div>
        )}
        {venue && (
          <div className="jagrata-event-row">
            <span className="jagrata-event-icon">📍</span>
            <div>
              <strong>स्थान:</strong> {venue}
              {venueAddress && <><br /><span style={{ color: '#888', fontSize: '12px' }}>{venueAddress}</span></>}
            </div>
          </div>
        )}
        {prasad && (
          <div className="jagrata-event-row">
            <span className="jagrata-event-icon">🍯</span>
            <span><strong>प्रसाद:</strong> {prasad}</span>
          </div>
        )}
      </div>

      {message && <div className="jagrata-message">"{message}"</div>}

      <div className="jagrata-deco-bottom">🌸 🪔 ॐ 🪔 🌸</div>
      <div className="jagrata-footer-text">Sab ka Beda Paar Karen Baba</div>
    </div>
  );
}
