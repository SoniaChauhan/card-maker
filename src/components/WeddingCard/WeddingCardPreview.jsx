import { formatDate, formatTime } from '../../utils/helpers';
import { T } from '../../utils/translations';

export default function WeddingCardPreview({ data, lang = 'en' }) {
  const t = T[lang];
  const {
    groomName, brideName, groomFamily, brideFamily,
    weddingDate, weddingTime, weddingVenue, weddingVenueAddress,
    receptionDate, receptionTime, receptionVenue,
    guestName, message, photoPreview,
  } = data;

  return (
    <div id="wedding-card-print" className="wedding-card">

      {/* Top decoration */}
      <div className="wedding-deco-top">🌸 ✿ 🌸</div>

      {/* Invitation badge */}
      <div className="wedding-invite-badge">{t.wedInviteBadge}</div>

      {/* Blessing line */}
      <div className="wedding-blessing">{t.wedBlessing}</div>

      {/* Couple photo */}
      {photoPreview && (
        <div className="wedding-photo-frame">
          <img src={photoPreview} alt="Couple" className="wedding-photo" />
        </div>
      )}

      {/* Couple names */}
      <div className="wedding-couple-section">
        <div className="wedding-couple-intro">{t.wedTogetherLabel}</div>
        <div className="wedding-groom-name">{groomName || t.wedGroom}</div>
        {groomFamily && <div className="wedding-families">{groomFamily}</div>}
        <div className="wedding-and">&amp; {t.wedAnd} &amp;</div>
        <div className="wedding-bride-name">{brideName || t.wedBride}</div>
        {brideFamily && <div className="wedding-families">{brideFamily}</div>}
      </div>

      <div className="wedding-divider">— ✦ 💍 ✦ —</div>

      {/* Wedding ceremony details */}
      <div className="wedding-event-box">
        <div className="wedding-event-section-title">💒 {t.wedCeremony}</div>
        {weddingDate && (
          <div className="wedding-event-row">
            <span className="wedding-event-icon">📅</span>
            <span><strong>{t.date}:</strong> {formatDate(weddingDate)}</span>
          </div>
        )}
        {weddingTime && (
          <div className="wedding-event-row">
            <span className="wedding-event-icon">⏰</span>
            <span><strong>{t.time}:</strong> {formatTime(weddingTime)}</span>
          </div>
        )}
        {weddingVenue && (
          <div className="wedding-event-row">
            <span className="wedding-event-icon">📍</span>
            <div>
              <strong>{t.venue}:</strong> {weddingVenue}
              {weddingVenueAddress && <><br /><span style={{ color: '#888', fontSize: '12px' }}>{weddingVenueAddress}</span></>}
            </div>
          </div>
        )}
      </div>

      {/* Reception details (optional) */}
      {(receptionDate || receptionVenue) && (
        <div className="wedding-event-box" style={{ marginTop: 10 }}>
          <div className="wedding-event-section-title">🥂 {t.wedReception}</div>
          {receptionDate && (
            <div className="wedding-event-row">
              <span className="wedding-event-icon">📅</span>
              <span><strong>{t.date}:</strong> {formatDate(receptionDate)}</span>
            </div>
          )}
          {receptionTime && (
            <div className="wedding-event-row">
              <span className="wedding-event-icon">⏰</span>
              <span><strong>{t.time}:</strong> {formatTime(receptionTime)}</span>
            </div>
          )}
          {receptionVenue && (
            <div className="wedding-event-row">
              <span className="wedding-event-icon">📍</span>
              <span><strong>{t.venue}:</strong> {receptionVenue}</span>
            </div>
          )}
        </div>
      )}

      {/* Guest invitation tag */}
      {guestName && (
        <div className="wedding-guest-tag">
          <div className="wedding-guest-label">{t.wedInvitedGuest}</div>
          <div className="wedding-guest-name">{guestName}</div>
          <div className="wedding-guest-tagline">{t.wedGuestTagline}</div>
        </div>
      )}

      {/* Custom message */}
      {message && <div className="wedding-message">"{message}"</div>}

      <div className="wedding-deco-bottom">🌸 ✿ 🌸</div>
      <div className="wedding-footer-text">{t.wedFooter}</div>
    </div>
  );
}
