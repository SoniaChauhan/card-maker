import { formatDate } from '../../utils/helpers';
import { T } from '../../utils/translations';

export default function BirthdayCardPreview({ data, lang = 'en' }) {
  const t = T[lang];
  const { guestName, birthdayPerson, age, date, venue, venueAddress, message, photoPreview } = data;

  return (
    <div id="bday-card-print" className="birthday-card">
      <div className="bday-deco-top">🌟 ✨ 🌟</div>

      {guestName && (
        <div className="bday-guest-intro">
          {t.to}: <span className="bday-guest-name">{guestName}</span>
        </div>
      )}

      <div className="balloon-row">🎈 🎈 🎈</div>

      {photoPreview && (
        <div className="bday-photo-frame">
          <img src={photoPreview} alt={birthdayPerson} className="bday-photo" />
        </div>
      )}

      <div className="bday-badge">{t.bdayBadge}</div>

      <div className="bday-title">{t.bdayTitle}</div>
      <div className="bday-name">{birthdayPerson || 'Dear Friend'}</div>

      {age && (
        <div style={{ marginBottom: 8 }}>
          <span className="bday-age-badge">{t.bdayTurning(age)}</span>
        </div>
      )}

      <div className="bday-cake">🎂</div>

      <div className="bday-event-box">
        {date && (
          <div className="bday-event-row">
            <span className="bday-event-icon">📅</span>
            <span><strong>{t.date}:</strong> {formatDate(date)}</span>
          </div>
        )}
        {venue && (
          <div className="bday-event-row">
            <span className="bday-event-icon">📍</span>
            <div>
              <strong>{t.venue}:</strong> {venue}
              {venueAddress && <><br /><span style={{ color: '#666', fontSize: '12px' }}>{venueAddress}</span></>}
            </div>
          </div>
        )}
      </div>

      {message && <div className="bday-message">"{message}"</div>}

      <div className="bday-deco-bottom">🎉 🎊 🎁 🎊 🎉</div>
    </div>
  );
}
