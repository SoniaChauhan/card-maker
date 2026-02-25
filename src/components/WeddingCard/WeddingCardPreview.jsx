import { formatDate, formatTime } from '../../utils/helpers';
import { T } from '../../utils/translations';

export default function WeddingCardPreview({ data, lang = 'en' }) {
  const t = T[lang];
  const {
    groomName, brideName, groomFamily, brideFamily,
    weddingDate, weddingTime, weddingVenue, weddingVenueAddress,
    receptionDate, receptionTime, receptionVenue,
    guestName, message, photoPreview, familyMembers,
  } = data;

  return (
    <div id="wedding-card-print" className="wedding-card">

      {/* ═══ TOP ORNAMENT ═══ */}
      <div className="wed-top-garland">
        <span>🌿</span><span>🌺</span><span>🪷</span><span>🌺</span><span>🌿</span>
      </div>

      {/* ═══ AUSPICIOUS HEADER ═══ */}
      <div className="wed-auspicious">
        <div className="wed-om">ॐ</div>
        <div className="wed-shubh">॥ शुभ विवाह ॥</div>
        <div className="wed-ganesh-line">
          <span className="wed-gl-wing">━━━ ✦</span>
          <span className="wed-gl-icon">🙏</span>
          <span className="wed-gl-wing">✦ ━━━</span>
        </div>
      </div>

      {/* ═══ PRAISE COUPLET #1 — Sanskrit shlok ═══ */}
      <div className="wed-praise wed-praise-shlok">
        <div className="wed-praise-text">
          ॥ मांगल्यं तन्तुनानेन मम जीवन हेतुना ।<br />
          कण्ठे बध्नामि सुभगे संजीव शरदः शतम् ॥
        </div>
        <div className="wed-praise-meaning">
          "I tie this sacred thread around your neck, O beautiful one,<br />
          may we live a hundred years together in happiness."
        </div>
      </div>

      {/* ═══ JAIMALA SCENE ═══ */}
      <div className="wed-jaimala-scene">
        <div className="wed-jm-garland-left">💐🌸🌺</div>
        <div className="wed-jm-couple">
          <span className="wed-jm-person">🤵</span>
          <span className="wed-jm-hearts">💕</span>
          <span className="wed-jm-person">👰</span>
        </div>
        <div className="wed-jm-garland-right">🌺🌸💐</div>
      </div>
      <div className="wed-jm-label">✿ Jaimala — Exchange of Garlands ✿</div>

      {/* ═══ INVITATION BLESSING ═══ */}
      <div className="wed-blessing-box">
        <div className="wed-blessing-icon">🙏</div>
        <div className="wed-blessing-text">{t.wedBlessing}</div>
      </div>

      {/* ═══ COUPLE PHOTO ═══ */}
      {photoPreview && (
        <div className="wed-photo-section">
          <div className="wed-photo-garland-top">🌿🌺🌸🌺🌿</div>
          <div className="wed-photo-frame">
            <img src={photoPreview} alt="Couple" className="wed-photo" />
          </div>
          <div className="wed-photo-garland-bottom">🌿🌺🌸🌺🌿</div>
        </div>
      )}

      {/* ═══ FAMILY NAMES ═══ */}
      <div className="wed-family-header">
        <div className="wed-family-block">
          {groomFamily && <div className="wed-family-name">{groomFamily}</div>}
          <div className="wed-family-side">🤵 Groom's Family</div>
        </div>
        <div className="wed-family-separator">🙏</div>
        <div className="wed-family-block">
          {brideFamily && <div className="wed-family-name">{brideFamily}</div>}
          <div className="wed-family-side">👰 Bride's Family</div>
        </div>
      </div>

      {/* ═══ PRAISE COUPLET #2 — Cute love verse ═══ */}
      <div className="wed-praise wed-praise-cute">
        <div className="wed-praise-emoji">🦋✨🌙</div>
        <div className="wed-praise-text wed-praise-cute-text">
          Like the moon awaits the stars,<br />
          our hearts have found their forever home 🏠💕
        </div>
      </div>

      {/* ═══ COUPLE HERO NAMES ═══ */}
      <div className="wed-invite-line">{t.wedTogetherLabel}</div>
      <div className="wed-couple-hero">
        <div className="wed-name wed-groom">{groomName || t.wedGroom}</div>
        <div className="wed-ampersand">
          <span className="wed-amp-line" />
          <div className="wed-amp-center-wrap">
            <span className="wed-amp-icon">🤵</span>
            <span className="wed-amp-heart">❤️</span>
            <span className="wed-amp-icon">👰</span>
          </div>
          <span className="wed-amp-line" />
        </div>
        <div className="wed-name wed-bride">{brideName || t.wedBride}</div>
      </div>

      {/* ═══ CUTE TAGLINE ═══ */}
      <div className="wed-tagline">
        ✨ Two hearts 💕 One soul 🌸 An eternal bond of love ✨
      </div>

      {/* ═══ JAIMALA FLOWER DIVIDER ═══ */}
      <div className="wed-flower-divider">
        <span>🌸</span><span>✿</span><span>🪷</span><span>✿</span><span>🌸</span>
      </div>

      {/* ═══ WEDDING CEREMONY ═══ */}
      <div className="wed-event-card wed-ceremony-card">
        <div className="wed-event-header">
          <span className="wed-event-emoji">🔥</span>
          <span className="wed-event-title">🕉️ {t.wedCeremony}</span>
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
                {weddingVenueAddress && <div className="wed-detail-address">📍 {weddingVenueAddress}</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ RECEPTION (optional) ═══ */}
      {(receptionDate || receptionVenue) && (
        <div className="wed-event-card wed-reception-card">
          <div className="wed-event-header wed-event-header-reception">
            <span className="wed-event-emoji">🥂</span>
            <span className="wed-event-title">🎉 {t.wedReception}</span>
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

      {/* ═══ CUTE PRAISE #3 — childrens' rhyme style ═══ */}
      <div className="wed-praise wed-praise-kids">
        <div className="wed-praise-emoji">👶🎀🧸</div>
        <div className="wed-praise-text wed-praise-kids-text">
          Mama-Papa ki shaadi hai,<br />
          ghar mein aayi khushiyon ki baarat! 🎶🎊<br />
          <span className="wed-kids-sub">Pyaar se saja hai aangan hamara 🌟</span>
        </div>
      </div>

      {/* ═══ GUEST CARD ═══ */}
      {guestName && (
        <div className="wed-guest-card">
          <div className="wed-guest-header">{t.wedInvitedGuest}</div>
          <div className="wed-guest-hero-name">{guestName}</div>
          <div className="wed-guest-sub">{t.wedGuestTagline}</div>
        </div>
      )}

      {/* ═══ CUSTOM MESSAGE ═══ */}
      {message && (
        <div className="wed-custom-msg">
          <span className="wed-msg-quote">"</span>
          {message}
          <span className="wed-msg-quote">"</span>
        </div>
      )}

      {/* ═══ WARM INVITATION APPEAL ═══ */}
      <div className="wed-invite-appeal">
        <div className="wed-appeal-icon">🙏🏻</div>
        <div className="wed-appeal-text">
          With folded hands and hearts full of love,<br />
          we humbly request the honour of your gracious presence.<br />
          Your blessings will make our celebration truly divine. 🙏
        </div>
      </div>

      {/* ═══ FAMILY MEMBERS ═══ */}
      {familyMembers && familyMembers.trim() && (
        <div className="wed-family-members">
          <div className="wed-fm-header">
            <span className="wed-fm-icon">👨‍👩‍👧‍👦</span>
            <span className="wed-fm-title">With Love From Our Family</span>
          </div>
          <div className="wed-fm-list">
            {familyMembers.split('\n').filter(n => n.trim()).map((name, i) => (
              <div key={i} className="wed-fm-name">🌸 {name.trim()}</div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ FOOTER ═══ */}
      <div className="wed-footer">
        <div className="wed-footer-garland">🌿🌺🌸🪷🌸🌺🌿</div>
        <div className="wed-footer-text">{t.wedFooter}</div>
        <div className="wed-footer-sub">❝ Vasudhaiva Kutumbakam — The World is One Family ❞</div>
      </div>

      {/* ═══ BOTTOM ORNAMENT ═══ */}
      <div className="wed-bottom-garland">
        <span>🌿</span><span>🌺</span><span>🪷</span><span>🌺</span><span>🌿</span>
      </div>
    </div>
  );
}
