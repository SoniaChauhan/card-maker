import { formatDate } from '../../utils/helpers';

export default function BirthdayCardPreview({ data }) {
  const { guestName, birthdayPerson, age, date, venue, venueAddress, message } = data;

  return (
    <div id="bday-card-print" className="birthday-card">
      <div className="bday-deco-top">🌟 ✨ 🌟</div>

      {guestName && (
        <div className="bday-guest-intro">
          To: <span className="bday-guest-name">{guestName}</span>
        </div>
      )}

      <div className="balloon-row">🎈 🎈 🎈</div>

      <div className="bday-badge">🎊 Birthday Celebration 🎊</div>

      <div className="bday-title">Happy Birthday!</div>
      <div className="bday-name">{birthdayPerson || 'Dear Friend'}</div>

      {age && (
        <div style={{ marginBottom: 8 }}>
          <span className="bday-age-badge">🎂 Turning {age}! 🎂</span>
        </div>
      )}

      <div className="bday-cake">🎂</div>

      <div className="bday-event-box">
        {date && (
          <div className="bday-event-row">
            <span className="bday-event-icon">📅</span>
            <span><strong>Date:</strong> {formatDate(date)}</span>
          </div>
        )}
        {venue && (
          <div className="bday-event-row">
            <span className="bday-event-icon">📍</span>
            <div>
              <strong>Venue:</strong> {venue}
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
