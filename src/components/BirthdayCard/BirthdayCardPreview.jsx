import { formatDate, formatTime } from '../../utils/helpers';
import { T } from '../../utils/translations';

export default function BirthdayCardPreview({ data, lang = 'en' }) {
  const t = T[lang];
  const { guestName, birthdayPerson, age, date, time, venue, venueAddress, hostName, message, photoPreview } = data;

  return (
    <div id="bday-card-print" className="birthday-card">

      {/* Top decoration */}
      <div className="bday-deco-top">🎈 🎉 🎈</div>

      {/* Invitation badge */}
      <div className="bday-invite-badge">{t.bdayInviteBadge}</div>

      {/* Photo */}
      {photoPreview && (
        <div className="bday-photo-frame">
          <img src={photoPreview} alt={birthdayPerson} className="bday-photo" />
        </div>
      )}

      {/* Hero text */}
      <div className="bday-invite-hero">
        <div className="bday-invite-joinus">{t.bdayJoinUs}</div>
        <div className="bday-invite-celebrate">{t.bdayCelebrate}</div>
        <div className="bday-name">{birthdayPerson || 'Dear Friend'}</div>
        {age && <div className="bday-milestone">{t.bdayMilestone(age)}</div>}
        <div className="bday-title">{t.bdayTitle}</div>
      </div>

      <div className="bday-divider">🎂 ✨ 🎂</div>

      {/* Event details box */}
      <div className="bday-event-box">
        {date && (
          <div className="bday-event-row">
            <span className="bday-event-icon">📅</span>
            <span><strong>{t.date}:</strong> {formatDate(date)}</span>
          </div>
        )}
        {time && (
          <div className="bday-event-row">
            <span className="bday-event-icon">⏰</span>
            <span><strong>{t.time}:</strong> {formatTime(time)}</span>
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
        {hostName && (
          <div className="bday-event-row">
            <span className="bday-event-icon">🎀</span>
            <span><strong>{t.bdayHostedBy}:</strong> {hostName}</span>
          </div>
        )}
      </div>

      {/* Invited guest tag */}
      {guestName && (
        <div className="bday-recipient-tag">
          <div className="bday-recipient-label">{t.bdayWishLine}</div>
          <div className="bday-recipient-name">{guestName}</div>
          <div className="bday-recipient-tagline">{t.bdayTagline}</div>
        </div>
      )}

      {/* Custom message */}
      {message && <div className="bday-message">"{message}"</div>}

      <div className="bday-deco-bottom">🎉 🎊 🎁 🎊 🎉</div>
    </div>
  );
}
