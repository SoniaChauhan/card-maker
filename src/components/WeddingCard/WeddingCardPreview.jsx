import { formatDate, formatTime } from '../../utils/helpers';
import { T } from '../../utils/translations';

/* Elegant watercolor-style floral corner — SVG art for cover page */
function FloralCorner() {
  return (
    <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Background leaves */}
      <ellipse cx="350" cy="210" rx="88" ry="20" transform="rotate(-30 350 210)" className="wed-svg-leaf" opacity=".4" />
      <ellipse cx="390" cy="270" rx="72" ry="17" transform="rotate(-55 390 270)" className="wed-svg-leaf" opacity=".35" />
      <ellipse cx="265" cy="50" rx="78" ry="18" transform="rotate(-12 265 50)" className="wed-svg-leaf" opacity=".35" />
      <ellipse cx="55" cy="270" rx="68" ry="16" transform="rotate(20 55 270)" className="wed-svg-leaf-dk" opacity=".3" />
      <ellipse cx="115" cy="335" rx="62" ry="14" transform="rotate(40 115 335)" className="wed-svg-leaf-dk" opacity=".25" />
      <ellipse cx="390" cy="85" rx="58" ry="16" transform="rotate(-42 390 85)" className="wed-svg-leaf" opacity=".35" />
      <ellipse cx="200" cy="350" rx="60" ry="14" transform="rotate(12 200 350)" className="wed-svg-leaf-dk" opacity=".22" />
      <ellipse cx="450" cy="170" rx="48" ry="13" transform="rotate(-62 450 170)" className="wed-svg-leaf" opacity=".3" />

      {/* Rose 1 — large, primary */}
      <circle cx="170" cy="150" r="85" className="wed-svg-petal" opacity=".18" />
      <circle cx="163" cy="142" r="68" className="wed-svg-petal" opacity=".28" />
      <circle cx="175" cy="138" r="55" className="wed-svg-pm" opacity=".33" />
      <circle cx="168" cy="148" r="43" className="wed-svg-pm" opacity=".42" />
      <circle cx="171" cy="143" r="32" className="wed-svg-pi" opacity=".48" />
      <circle cx="169" cy="147" r="22" className="wed-svg-pc" opacity=".52" />
      <circle cx="170" cy="146" r="11" className="wed-svg-pc" opacity=".58" />

      {/* Rose 2 — upper-right */}
      <circle cx="340" cy="105" r="70" className="wed-svg-petal" opacity=".18" />
      <circle cx="335" cy="99" r="56" className="wed-svg-petal" opacity=".28" />
      <circle cx="342" cy="97" r="45" className="wed-svg-pm" opacity=".33" />
      <circle cx="338" cy="103" r="35" className="wed-svg-pm" opacity=".42" />
      <circle cx="340" cy="100" r="25" className="wed-svg-pi" opacity=".48" />
      <circle cx="339" cy="103" r="15" className="wed-svg-pc" opacity=".52" />

      {/* Rose 3 — lower-left */}
      <circle cx="110" cy="270" r="62" className="wed-svg-petal" opacity=".18" />
      <circle cx="106" cy="264" r="50" className="wed-svg-petal" opacity=".28" />
      <circle cx="112" cy="262" r="40" className="wed-svg-pm" opacity=".33" />
      <circle cx="109" cy="268" r="31" className="wed-svg-pm" opacity=".42" />
      <circle cx="110" cy="266" r="22" className="wed-svg-pi" opacity=".48" />
      <circle cx="110" cy="267" r="12" className="wed-svg-pc" opacity=".52" />

      {/* Small buds */}
      <circle cx="435" cy="55" r="30" className="wed-svg-petal" opacity=".2" />
      <circle cx="433" cy="52" r="22" className="wed-svg-pm" opacity=".3" />
      <circle cx="435" cy="53" r="13" className="wed-svg-pc" opacity=".38" />
      <circle cx="50" cy="190" r="34" className="wed-svg-petal" opacity=".18" />
      <circle cx="48" cy="186" r="24" className="wed-svg-pm" opacity=".28" />
      <circle cx="50" cy="188" r="14" className="wed-svg-pc" opacity=".36" />

      {/* Front accent leaves */}
      <ellipse cx="290" cy="230" rx="52" ry="12" transform="rotate(-22 290 230)" className="wed-svg-leaf" opacity=".32" />
      <ellipse cx="155" cy="315" rx="56" ry="13" transform="rotate(28 155 315)" className="wed-svg-leaf-dk" opacity=".28" />
      <ellipse cx="245" cy="160" rx="42" ry="10" transform="rotate(-8 245 160)" className="wed-svg-leaf" opacity=".25" />
      <ellipse cx="468" cy="120" rx="28" ry="9" transform="rotate(-55 468 120)" className="wed-svg-leaf" opacity=".28" />
      <ellipse cx="30" cy="330" rx="30" ry="9" transform="rotate(22 30 330)" className="wed-svg-leaf-dk" opacity=".2" />
    </svg>
  );
}

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

      {/* ═══ COVER PAGE ═══ */}
      <div className="wed-cover-page">
        <div className="wed-cover-floral wed-cover-floral-tl"><FloralCorner /></div>
        <div className="wed-cover-floral wed-cover-floral-br"><FloralCorner /></div>
        <div className="wed-cover-content">
          <h1 className="wed-cover-title">WEDDING</h1>
          <h1 className="wed-cover-title wed-cover-title-sub">INVITATION</h1>
          <div className="wed-cover-divider">
            <span className="wed-cd-line" />
            <span className="wed-cd-diamond">◆</span>
            <span className="wed-cd-line" />
          </div>
          {(groomName || brideName) && (
            <div className="wed-cover-names">
              {groomName || 'Groom'} &amp; {brideName || 'Bride'}
            </div>
          )}
          {weddingDate && (
            <div className="wed-cover-date">{formatDate(weddingDate)}</div>
          )}
        </div>
      </div>
      <div className="wed-page-break" />

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
