import { formatDate, formatTime } from '../../utils/helpers';
import { T } from '../../utils/translations';

export default function WeddingCardPreview({ data, lang = 'en', template = 1 }) {
  const t = T[lang];
  const {
    groomName, brideName, groomFamily, brideFamily,
    weddingDate, weddingTime, weddingVenue, weddingVenueAddress,
    receptionDate, receptionTime, receptionVenue,
    guestName, message, photoPreview, familyMembers,
    customPrograms = [],
  } = data;

  const themeClass = `wed-theme-${template}`;
  const hasReception = receptionDate || receptionVenue;
  const validPrograms = customPrograms.filter(p => p.name && p.name.trim());

  return (
    <div id="wedding-card-print" className={`wedding-card ${themeClass}`}>

      {/* ═══ CORNER ORNAMENTS ═══ */}
      <div className="wed-corner wed-corner-tl" />
      <div className="wed-corner wed-corner-tr" />
      <div className="wed-corner wed-corner-bl" />
      <div className="wed-corner wed-corner-br" />

      {/* ═══ TOP ORNAMENTAL BORDER ═══ */}
      <div className="wed-top-border">
        <span className="wed-ornament-line" />
        <span className="wed-ornament-diamond">◆</span>
        <span className="wed-ornament-line" />
      </div>

      {/* ═══ AUSPICIOUS HEADER (full width) ═══ */}
      <div className="wed-auspicious">
        <div className="wed-om">ॐ</div>
        <div className="wed-shubh">॥ शुभ विवाह ॥</div>
        <div className="wed-header-divider">
          <span className="wed-hd-wing" />
          <span className="wed-hd-icon">✦</span>
          <span className="wed-hd-wing" />
        </div>
      </div>

      {/* ═══════════════ LANDSCAPE TWO-COLUMN BODY ═══════════════ */}
      <div className="wed-landscape-body">

        {/* ---- LEFT COLUMN: Couple Info ---- */}
        <div className="wed-col wed-col-left">

          {/* SANSKRIT SHLOK */}
          <div className="wed-shlok">
            <div className="wed-shlok-text">
              ॥ मांगल्यं तन्तुनानेन मम जीवन हेतुना ।<br />
              कण्ठे बध्नामि सुभगे संजीव शरदः शतम् ॥
            </div>
            <div className="wed-shlok-meaning">
              "I tie this sacred thread around your neck, O beautiful one,
              may we live a hundred years together in happiness."
            </div>
          </div>

          {/* JAIMALA SCENE */}
          <div className="wed-jaimala">
            <div className="wed-jm-couple">
              <span className="wed-jm-groom">🤵</span>
              <span className="wed-jm-heart">❤️</span>
              <span className="wed-jm-bride">👰</span>
            </div>
          </div>

          {/* COUPLE PHOTO */}
          {photoPreview && (
            <div className="wed-photo-section">
              <div className="wed-photo-frame">
                <img src={photoPreview} alt="Couple" className="wed-photo" />
              </div>
            </div>
          )}

          {/* COUPLE HERO NAMES */}
          <div className="wed-section-label">{t.wedTogetherLabel}</div>
          <div className="wed-couple-hero">
            <div className="wed-name wed-groom-name">{groomName || t.wedGroom}</div>
            <div className="wed-ampersand">
              <span className="wed-amp-line" />
              <span className="wed-amp-symbol">&amp;</span>
              <span className="wed-amp-line" />
            </div>
            <div className="wed-name wed-bride-name">{brideName || t.wedBride}</div>
          </div>

          {/* TAGLINE */}
          <div className="wed-tagline">
            Two hearts · One soul · An eternal bond of love
          </div>

          {/* FAMILY NAMES */}
          <div className="wed-families">
            <div className="wed-families-row">
              <div className="wed-family-block">
                {groomFamily && <div className="wed-family-name">{groomFamily}</div>}
                <div className="wed-family-label">Groom's Family</div>
              </div>
              <div className="wed-family-sep-v">
                <span className="wed-sep-dot">✦</span>
              </div>
              <div className="wed-family-block">
                {brideFamily && <div className="wed-family-name">{brideFamily}</div>}
                <div className="wed-family-label">Bride's Family</div>
              </div>
            </div>
          </div>

          {/* BLESSING */}
          <div className="wed-blessing">
            <div className="wed-blessing-text">{t.wedBlessing}</div>
          </div>
        </div>

        {/* ---- RIGHT COLUMN: Events & Details ---- */}
        <div className="wed-col wed-col-right">

          {/* WEDDING CEREMONY */}
          <div className="wed-event wed-event-ceremony">
            <div className="wed-event-header">
              <span className="wed-event-title">{t.wedCeremony}</span>
            </div>
            <div className="wed-event-body">
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
                  <span className="wed-detail-icon">📍</span>
                  <div>
                    <div className="wed-detail-label">{t.venue}</div>
                    <div className="wed-detail-value">{weddingVenue}</div>
                    {weddingVenueAddress && <div className="wed-detail-address">{weddingVenueAddress}</div>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RECEPTION */}
          {hasReception && (
            <div className="wed-event wed-event-reception">
              <div className="wed-event-header wed-event-header-alt">
                <span className="wed-event-title">{t.wedReception}</span>
              </div>
              <div className="wed-event-body">
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
                    <span className="wed-detail-icon">📍</span>
                    <div>
                      <div className="wed-detail-label">{t.venue}</div>
                      <div className="wed-detail-value">{receptionVenue}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CUSTOM PROGRAMS / EVENTS */}
          {validPrograms.map((prog, idx) => (
            <div key={idx} className="wed-event wed-event-custom">
              <div className="wed-event-header wed-event-header-custom">
                <span className="wed-event-title">{prog.name}</span>
              </div>
              <div className="wed-event-body">
                {prog.date && (
                  <div className="wed-detail-row">
                    <span className="wed-detail-icon">📅</span>
                    <div>
                      <div className="wed-detail-label">{t.date}</div>
                      <div className="wed-detail-value">{formatDate(prog.date)}</div>
                    </div>
                  </div>
                )}
                {prog.time && (
                  <div className="wed-detail-row">
                    <span className="wed-detail-icon">🕐</span>
                    <div>
                      <div className="wed-detail-label">{t.time}</div>
                      <div className="wed-detail-value">{formatTime(prog.time)}</div>
                    </div>
                  </div>
                )}
                {prog.venue && (
                  <div className="wed-detail-row">
                    <span className="wed-detail-icon">📍</span>
                    <div>
                      <div className="wed-detail-label">{t.venue}</div>
                      <div className="wed-detail-value">{prog.venue}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* GUEST CARD */}
          {guestName && (
            <div className="wed-guest">
              <div className="wed-guest-label">{t.wedInvitedGuest}</div>
              <div className="wed-guest-name">{guestName}</div>
              <div className="wed-guest-tagline">{t.wedGuestTagline}</div>
            </div>
          )}

          {/* CUSTOM MESSAGE */}
          {message && (
            <div className="wed-message">
              <span className="wed-msg-mark">"</span>
              <span className="wed-msg-text">{message}</span>
              <span className="wed-msg-mark">"</span>
            </div>
          )}
        </div>
      </div>
      {/* ═══════════════ END TWO-COLUMN BODY ═══════════════ */}

      {/* ═══ FULL-WIDTH BOTTOM SECTIONS ═══ */}

      {/* INVITATION APPEAL */}
      <div className="wed-appeal">
        <div className="wed-appeal-text">
          With folded hands and hearts full of love,
          we humbly request the honour of your gracious presence.
          Your blessings will make our celebration truly divine.
        </div>
      </div>

      {/* FAMILY MEMBERS */}
      {familyMembers && familyMembers.trim() && (
        <div className="wed-family-members">
          <div className="wed-fm-header">
            <span className="wed-fm-title">With Love From Our Family</span>
          </div>
          <div className="wed-fm-list">
            {familyMembers.split('\n').filter(n => n.trim()).map((name, i) => (
              <div key={i} className="wed-fm-name">
                <span className="wed-fm-bullet">✦</span> {name.trim()}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="wed-footer">
        <div className="wed-footer-ornament">
          <span className="wed-fo-line" />
          <span className="wed-fo-diamond">◆</span>
          <span className="wed-fo-line" />
        </div>
        <div className="wed-footer-text">{t.wedFooter}</div>
        <div className="wed-footer-quote">❝ Vasudhaiva Kutumbakam — The World is One Family ❞</div>
      </div>

      {/* BOTTOM ORNAMENTAL BORDER */}
      <div className="wed-bottom-border">
        <span className="wed-ornament-line" />
        <span className="wed-ornament-diamond">◆</span>
        <span className="wed-ornament-line" />
      </div>
    </div>
  );
}
