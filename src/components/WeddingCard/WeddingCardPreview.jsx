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

      {/* Ornamental top border */}
      <div className="wed-ornament-top">
        <div className="wed-ornament-line" />
        <span className="wed-ornament-icon">🕉️</span>
        <div className="wed-ornament-line" />
      </div>

      {/* Corner mandalas (CSS pseudo-elements) rendered by CSS */}

      {/* Ganesh / auspicious header */}
      <div className="wed-auspicious">
        <span className="wed-ganesh">🙏</span>
        <div className="wed-shubh-label">॥ शुभ विवाह ॥</div>
      </div>

      {/* Decorative floral strip */}
      <div className="wed-floral-strip">
        <span>🌺</span><span>🪷</span><span>🌸</span><span>🪷</span><span>🌺</span>
      </div>

      {/* Invitation message */}
      <div className="wed-invite-msg">
        {t.wedBlessing}
      </div>

      {/* Couple photo with frame */}
      {photoPreview && (
        <div className="wed-photo-section">
          <div className="wed-photo-frame">
            <img src={photoPreview} alt="Couple" className="wed-photo" />
          </div>
        </div>
      )}

      {/* Family names header */}
      <div className="wed-family-header">
        <div className="wed-family-block">
          {groomFamily && <div className="wed-family-name">{groomFamily}</div>}
          <div className="wed-family-side">Groom's Family</div>
        </div>
        <div className="wed-family-separator">🤝</div>
        <div className="wed-family-block">
          {brideFamily && <div className="wed-family-name">{brideFamily}</div>}
          <div className="wed-family-side">Bride's Family</div>
        </div>
      </div>

      <div className="wed-invite-line">{t.wedTogetherLabel}</div>

      {/* Couple names - hero */}
      <div className="wed-couple-hero">
        <div className="wed-name wed-groom">{groomName || t.wedGroom}</div>
        <div className="wed-ampersand">
          <span className="wed-amp-line" />
          <span className="wed-amp-ring">💍</span>
          <span className="wed-amp-line" />
        </div>
        <div className="wed-name wed-bride">{brideName || t.wedBride}</div>
      </div>

      {/* Tagline */}
      <div className="wed-tagline">Two souls, One journey — Forever begins here</div>

      {/* Decorative mandala divider */}
      <div className="wed-mandala-divider">
        <span className="wed-md-wing">✦ ─── ✦</span>
        <span className="wed-md-center">❋</span>
        <span className="wed-md-wing">✦ ─── ✦</span>
      </div>

      {/* Wedding ceremony details */}
      <div className="wed-event-card wed-ceremony-card">
        <div className="wed-event-header">
          <span className="wed-event-emoji">💒</span>
          <span className="wed-event-title">{t.wedCeremony}</span>
        </div>
        <div className="wed-event-details">
          {weddingDate && (
            <div className="wed-detail-row">
              <span className="wed-detail-icon">📅</span>
              <div>
                <div className="wed-detail-label">{t.date}</div>
                <div className="wed-detail-value">{formatDate(weddingDate)}</div>
              </div>
            </div>
          )}
          {weddingTime && (
            <div className="wed-detail-row">
              <span className="wed-detail-icon">🕐</span>
              <div>
                <div className="wed-detail-label">{t.time}</div>
                <div className="wed-detail-value">{formatTime(weddingTime)}</div>
              </div>
            </div>
          )}
          {weddingVenue && (
            <div className="wed-detail-row">
              <span className="wed-detail-icon">🏛️</span>
              <div>
                <div className="wed-detail-label">{t.venue}</div>
                <div className="wed-detail-value">{weddingVenue}</div>
                {weddingVenueAddress && <div className="wed-detail-address">{weddingVenueAddress}</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reception details (optional) */}
      {(receptionDate || receptionVenue) && (
        <div className="wed-event-card wed-reception-card">
          <div className="wed-event-header">
            <span className="wed-event-emoji">🥂</span>
            <span className="wed-event-title">{t.wedReception}</span>
          </div>
          <div className="wed-event-details">
            {receptionDate && (
              <div className="wed-detail-row">
                <span className="wed-detail-icon">📅</span>
                <div>
                  <div className="wed-detail-label">{t.date}</div>
                  <div className="wed-detail-value">{formatDate(receptionDate)}</div>
                </div>
              </div>
            )}
            {receptionTime && (
              <div className="wed-detail-row">
                <span className="wed-detail-icon">🕐</span>
                <div>
                  <div className="wed-detail-label">{t.time}</div>
                  <div className="wed-detail-value">{formatTime(receptionTime)}</div>
                </div>
              </div>
            )}
            {receptionVenue && (
              <div className="wed-detail-row">
                <span className="wed-detail-icon">🏛️</span>
                <div>
                  <div className="wed-detail-label">{t.venue}</div>
                  <div className="wed-detail-value">{receptionVenue}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Guest invitation card */}
      {guestName && (
        <div className="wed-guest-card">
          <div className="wed-guest-header">{t.wedInvitedGuest}</div>
          <div className="wed-guest-hero-name">{guestName}</div>
          <div className="wed-guest-sub">{t.wedGuestTagline}</div>
        </div>
      )}

      {/* Custom message */}
      {message && (
        <div className="wed-custom-msg">
          <span className="wed-msg-quote">"</span>
          {message}
          <span className="wed-msg-quote">"</span>
        </div>
      )}

      {/* Kind RSVP & Invitation message */}
      <div className="wed-invite-appeal">
        <div className="wed-appeal-text">
          Your gracious presence will be our family's greatest blessing.<br />
          We humbly request the honour of your attendance.
        </div>
      </div>

      {/* Footer decoration */}
      <div className="wed-footer">
        <div className="wed-footer-floral">🌺 ✿ 🪷 ✿ 🌺</div>
        <div className="wed-footer-text">{t.wedFooter}</div>
      </div>

      {/* Ornamental bottom border */}
      <div className="wed-ornament-bottom">
        <div className="wed-ornament-line" />
        <span className="wed-ornament-icon">🪷</span>
        <div className="wed-ornament-line" />
      </div>
    </div>
  );
}
