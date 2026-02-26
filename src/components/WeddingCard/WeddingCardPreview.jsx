import { formatDate, formatTime } from '../../utils/helpers';
import { T } from '../../utils/translations';

/* ── SVG art: Jaimala couple illustration (line art style) ── */
function JaimalaArt() {
  return (
    <svg viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="wed-jaimala-svg" aria-hidden="true">
      {/* Groom */}
      <circle cx="38" cy="22" r="10" className="wed-svg-stroke" strokeWidth="1.5" />
      <path d="M38 12 C34 8 28 10 28 16 L28 18 C28 14 34 10 38 12Z" className="wed-svg-fill" opacity=".6" />
      <path d="M38 12 C42 8 48 10 48 16 L48 18 C48 14 42 10 38 12Z" className="wed-svg-fill" opacity=".6" />
      <line x1="38" y1="32" x2="38" y2="60" className="wed-svg-stroke" strokeWidth="1.5" />
      <line x1="38" y1="38" x2="28" y2="52" className="wed-svg-stroke" strokeWidth="1.5" />
      <line x1="38" y1="38" x2="48" y2="48" className="wed-svg-stroke" strokeWidth="1.5" />
      <line x1="38" y1="60" x2="30" y2="80" className="wed-svg-stroke" strokeWidth="1.5" />
      <line x1="38" y1="60" x2="46" y2="80" className="wed-svg-stroke" strokeWidth="1.5" />
      {/* Bride */}
      <circle cx="82" cy="22" r="10" className="wed-svg-stroke" strokeWidth="1.5" />
      <path d="M82 12 C74 6 68 14 70 22 L72 28 C72 20 76 12 82 12Z" className="wed-svg-fill" opacity=".4" />
      <path d="M82 12 C90 6 96 14 94 22 L92 28 C92 20 88 12 82 12Z" className="wed-svg-fill" opacity=".4" />
      <line x1="82" y1="32" x2="82" y2="60" className="wed-svg-stroke" strokeWidth="1.5" />
      <line x1="82" y1="38" x2="72" y2="48" className="wed-svg-stroke" strokeWidth="1.5" />
      <line x1="82" y1="38" x2="92" y2="52" className="wed-svg-stroke" strokeWidth="1.5" />
      <line x1="82" y1="60" x2="74" y2="80" className="wed-svg-stroke" strokeWidth="1.5" />
      <line x1="82" y1="60" x2="90" y2="80" className="wed-svg-stroke" strokeWidth="1.5" />
      {/* Garland between them */}
      <path d="M48 48 Q60 38 72 48" className="wed-svg-stroke" strokeWidth="1.2" strokeDasharray="3 2" />
      <path d="M48 48 Q60 58 72 48" className="wed-svg-stroke" strokeWidth="1.2" strokeDasharray="3 2" />
    </svg>
  );
}

/* ── SVG art: Floral leaf wreath around photo (for theme 3) ── */
function PhotoWreath() {
  return (
    <svg viewBox="0 0 200 200" className="wed-photo-wreath-svg" aria-hidden="true">
      {/* Left branch */}
      <path d="M100 185 Q60 170 40 140 Q25 115 30 85 Q35 60 55 45" fill="none" className="wed-svg-wreath" strokeWidth="2" />
      {[45, 60, 75, 90, 110, 130, 150].map((angle, i) => {
        const t = i / 6;
        const cx = 100 - 55 * Math.sin(t * 2.5) + (i % 2 ? 8 : -8);
        const cy = 185 - t * 140;
        const rot = -30 + i * 8;
        return <ellipse key={`l${i}`} cx={cx} cy={cy} rx="14" ry="6" transform={`rotate(${rot} ${cx} ${cy})`} className="wed-svg-wreath-leaf" opacity={0.4 + i * 0.05} />;
      })}
      {/* Right branch */}
      <path d="M100 185 Q140 170 160 140 Q175 115 170 85 Q165 60 145 45" fill="none" className="wed-svg-wreath" strokeWidth="2" />
      {[45, 60, 75, 90, 110, 130, 150].map((angle, i) => {
        const t = i / 6;
        const cx = 100 + 55 * Math.sin(t * 2.5) + (i % 2 ? -8 : 8);
        const cy = 185 - t * 140;
        const rot = 30 - i * 8;
        return <ellipse key={`r${i}`} cx={cx} cy={cy} rx="14" ry="6" transform={`rotate(${rot} ${cx} ${cy})`} className="wed-svg-wreath-leaf" opacity={0.4 + i * 0.05} />;
      })}
      {/* Small roses */}
      {[[50, 140], [150, 140], [38, 100], [162, 100]].map(([x, y], i) => (
        <g key={`rose${i}`}>
          <circle cx={x} cy={y} r="8" className="wed-svg-wreath-rose" opacity=".35" />
          <circle cx={x} cy={y} r="5" className="wed-svg-wreath-rose" opacity=".5" />
          <circle cx={x} cy={y} r="2.5" className="wed-svg-wreath-rose-c" opacity=".6" />
        </g>
      ))}
    </svg>
  );
}

/* ── SVG art: Divine Couple (Radha-Krishna silhouette) ── */
function DivineCoupleArt() {
  return (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="wed-divine-svg" aria-hidden="true">
      {/* Decorative arch */}
      <path d="M30 160 Q30 40 100 20 Q170 40 170 160" className="wed-svg-divine-arch" strokeWidth="2" fill="none" />
      <path d="M38 160 Q38 48 100 28 Q162 48 162 160" className="wed-svg-divine-arch" strokeWidth="0.5" fill="none" opacity=".4" />
      {/* Left figure — Groom */}
      <circle cx="78" cy="62" r="12" className="wed-svg-divine-fill" opacity=".15" />
      <circle cx="78" cy="62" r="12" className="wed-svg-divine-stroke" strokeWidth="1.2" />
      {/* Crown / pagdi */}
      <path d="M68 54 Q72 46 78 44 Q84 46 88 54" className="wed-svg-divine-stroke" strokeWidth="1" />
      <path d="M72 52 Q78 42 84 52" className="wed-svg-divine-fill" opacity=".2" />
      {/* Body */}
      <line x1="78" y1="74" x2="78" y2="110" className="wed-svg-divine-stroke" strokeWidth="1.2" />
      <line x1="78" y1="82" x2="66" y2="96" className="wed-svg-divine-stroke" strokeWidth="1" />
      <path d="M78 82 Q88 88 96 80" className="wed-svg-divine-stroke" strokeWidth="1" />
      <line x1="78" y1="110" x2="70" y2="135" className="wed-svg-divine-stroke" strokeWidth="1.2" />
      <line x1="78" y1="110" x2="86" y2="135" className="wed-svg-divine-stroke" strokeWidth="1.2" />
      {/* Right figure — Bride */}
      <circle cx="122" cy="62" r="12" className="wed-svg-divine-fill" opacity=".15" />
      <circle cx="122" cy="62" r="12" className="wed-svg-divine-stroke" strokeWidth="1.2" />
      {/* Bridal veil / dupatta */}
      <path d="M110 56 Q114 48 122 46 Q130 48 134 56 Q138 62 136 72" className="wed-svg-divine-stroke" strokeWidth="0.8" />
      <path d="M108 58 Q116 44 122 44 Q128 44 136 58" className="wed-svg-divine-fill" opacity=".12" />
      {/* Body */}
      <line x1="122" y1="74" x2="122" y2="110" className="wed-svg-divine-stroke" strokeWidth="1.2" />
      <path d="M122 82 Q112 88 104 80" className="wed-svg-divine-stroke" strokeWidth="1" />
      <line x1="122" y1="82" x2="134" y2="96" className="wed-svg-divine-stroke" strokeWidth="1" />
      {/* Skirt/saree */}
      <path d="M114 110 Q122 115 130 110 L136 140 Q122 148 108 140 Z" className="wed-svg-divine-fill" opacity=".1" />
      <path d="M114 110 Q122 115 130 110 L136 140 Q122 148 108 140 Z" className="wed-svg-divine-stroke" strokeWidth="0.8" />
      {/* Garland / connection between them */}
      <path d="M88 86 Q100 76 112 86" className="wed-svg-divine-accent" strokeWidth="1.5" fill="none" />
      <path d="M88 86 Q100 96 112 86" className="wed-svg-divine-accent" strokeWidth="1.5" fill="none" />
      {/* Small flowers on garland */}
      {[92, 100, 108].map(x => (
        <circle key={x} cx={x} cy={86} r="2.5" className="wed-svg-divine-flower" opacity=".6" />
      ))}
      {/* Decorative dots on arch */}
      {[40, 55, 70, 130, 145, 160].map((x, i) => {
        const y = i < 3 ? 160 - (3 - i) * 28 : 160 - (i - 2) * 28;
        return <circle key={x} cx={x} cy={y} r="2" className="wed-svg-divine-fill" opacity=".25" />;
      })}
      {/* Base / lotus ornament */}
      <path d="M80 150 Q90 142 100 150 Q110 142 120 150" className="wed-svg-divine-accent" strokeWidth="1" fill="none" />
      <path d="M85 155 Q92 148 100 155 Q108 148 115 155" className="wed-svg-divine-accent" strokeWidth="0.8" fill="none" opacity=".5" />
    </svg>
  );
}

/* ── SVG art: Leaf Ornament Divider (for centered layout) ── */
function LeafDivider() {
  return (
    <svg viewBox="0 0 200 20" className="wed-leaf-divider-svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <line x1="20" y1="10" x2="80" y2="10" className="wed-svg-orn-stem" strokeWidth="0.8" />
      <line x1="120" y1="10" x2="180" y2="10" className="wed-svg-orn-stem" strokeWidth="0.8" />
      <circle cx="100" cy="10" r="3" className="wed-svg-orn-center" opacity=".6" />
      {/* Left leaves */}
      {[35, 50, 65].map((x, i) => (
        <ellipse key={`l${i}`} cx={x} cy={i % 2 ? 6 : 14} rx="10" ry="4"
          transform={`rotate(${i % 2 ? -30 : 30} ${x} ${i % 2 ? 6 : 14})`}
          className="wed-svg-orn-leaf" opacity={.3 + i * .1} />
      ))}
      {/* Right leaves */}
      {[135, 150, 165].map((x, i) => (
        <ellipse key={`r${i}`} cx={x} cy={i % 2 ? 6 : 14} rx="10" ry="4"
          transform={`rotate(${i % 2 ? 30 : -30} ${x} ${i % 2 ? 6 : 14})`}
          className="wed-svg-orn-leaf" opacity={.3 + i * .1} />
      ))}
    </svg>
  );
}

/* ── SVG art: Bottom floral ornament border ── */
function BottomOrnament() {
  return (
    <svg viewBox="0 0 500 60" className="wed-bottom-ornament-svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {/* Center symbol */}
      <circle cx="250" cy="16" r="8" className="wed-svg-orn-center" opacity=".7" />
      <circle cx="250" cy="16" r="4" className="wed-svg-orn-center" opacity=".9" />
      {/* Left vine */}
      <path d="M242 16 Q200 10 160 20 Q120 28 80 22 Q50 18 20 24" fill="none" className="wed-svg-orn-stem" strokeWidth="1.5" />
      {[200, 170, 140, 110, 80, 55].map((x, i) => (
        <g key={`lb${i}`}>
          <ellipse cx={x} cy={i % 2 ? 12 : 28} rx="12" ry="5" transform={`rotate(${i % 2 ? -25 : 25} ${x} ${i % 2 ? 12 : 28})`} className="wed-svg-orn-leaf" opacity={.45 + i * .04} />
          <ellipse cx={x - 8} cy={i % 2 ? 16 : 24} rx="10" ry="4" transform={`rotate(${i % 2 ? -40 : 40} ${x - 8} ${i % 2 ? 16 : 24})`} className="wed-svg-orn-leaf" opacity={.35 + i * .03} />
        </g>
      ))}
      {/* Right vine */}
      <path d="M258 16 Q300 10 340 20 Q380 28 420 22 Q450 18 480 24" fill="none" className="wed-svg-orn-stem" strokeWidth="1.5" />
      {[300, 330, 360, 390, 420, 445].map((x, i) => (
        <g key={`rb${i}`}>
          <ellipse cx={x} cy={i % 2 ? 12 : 28} rx="12" ry="5" transform={`rotate(${i % 2 ? 25 : -25} ${x} ${i % 2 ? 12 : 28})`} className="wed-svg-orn-leaf" opacity={.45 + i * .04} />
          <ellipse cx={x + 8} cy={i % 2 ? 16 : 24} rx="10" ry="4" transform={`rotate(${i % 2 ? 40 : -40} ${x + 8} ${i % 2 ? 16 : 24})`} className="wed-svg-orn-leaf" opacity={.35 + i * .03} />
        </g>
      ))}
    </svg>
  );
}

export default function WeddingCardPreview({ data, lang = 'en', template = 1, bgColor }) {
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
  const customBg = bgColor ? { background: bgColor } : {};
  const isCentered = template === 6 || template === 7;

  /* ── Centered layout for templates 6 & 7 ── */
  if (isCentered) {
    return (
      <div id="wedding-card-print" className={`wedding-card wed-centered ${themeClass}`} style={customBg}>
        <div className="wed-inner-frame" />

        {/* ── Divine couple art ── */}
        <div className="wed-divine-section">
          <DivineCoupleArt />
        </div>

        {/* ── Couple avatars ── */}
        <div className="wed-avatars">
          <span className="wed-avatar-icon">🤵</span>
          <span className="wed-avatar-icon">👰</span>
        </div>

        {/* ── Couple names ── */}
        <div className="wed-couple-center">
          <div className="wed-name-center">{groomName || 'Groom'}</div>
          <div className="wed-amp-center">&amp;</div>
          <div className="wed-name-center">{brideName || 'Bride'}</div>
        </div>

        {/* ── Tagline ── */}
        <div className="wed-tagline">Two hearts, one soul</div>

        {/* ── Couple Photo ── */}
        {photoPreview && (
          <div className="wed-photo-wrap wed-photo-center">
            <div className="wed-photo-frame">
              <img src={photoPreview} alt="Couple" className="wed-photo" />
            </div>
          </div>
        )}

        {/* ── Leaf divider ── */}
        <div className="wed-leaf-divider">
          <LeafDivider />
        </div>

        {/* ── Split info section ── */}
        <div className="wed-split-info">
          {/* Left — Family info */}
          <div className="wed-split-left">
            <div className="wed-split-heading">WITH GREAT JOY</div>
            <div className="wed-split-sub">WE INVITE YOU TO<br/>THE WEDDING OF</div>
            <div className="wed-split-family">{groomFamily || "THE GROOM'S FAMILY"}</div>
            <div className="wed-split-family">{brideFamily || "THE BRIDE'S FAMILY"}</div>
          </div>

          <div className="wed-split-divider" />

          {/* Right — Ceremony details */}
          <div className="wed-split-right">
            <div className="wed-event-section">
              <h3 className="wed-event-heading">WEDDING CEREMONY</h3>
              <div className="wed-event-details">
                {weddingDate && <div className="wed-detail">{formatDate(weddingDate)}</div>}
                {weddingTime && <div className="wed-detail">{formatTime(weddingTime)}</div>}
                {weddingVenue && <div className="wed-detail">{weddingVenue}</div>}
                {weddingVenueAddress && <div className="wed-detail wed-detail-sub">{weddingVenueAddress}</div>}
              </div>
            </div>

            {hasReception && (
              <div className="wed-event-section">
                <h3 className="wed-event-heading">RECEPTION</h3>
                <div className="wed-event-details">
                  {receptionDate && <div className="wed-detail">{formatDate(receptionDate)}</div>}
                  {receptionTime && <div className="wed-detail">{formatTime(receptionTime)}</div>}
                  {receptionVenue && <div className="wed-detail">{receptionVenue}</div>}
                </div>
              </div>
            )}

            {validPrograms.length > 0 && (
              <div className="wed-event-section">
                <div className="wed-programs-list">
                  {validPrograms.map((prog, idx) => (
                    <h3 key={idx} className="wed-program-name">{prog.name}</h3>
                  ))}
                </div>
                {validPrograms.some(p => p.date || p.time || p.venue) && (
                  <div className="wed-event-details wed-programs-details">
                    {validPrograms.map((prog, idx) => (
                      (prog.date || prog.time || prog.venue) && (
                        <div key={idx} className="wed-prog-detail-row">
                          <span className="wed-prog-detail-label">{prog.name}:</span>
                          {prog.date && <span>{formatDate(prog.date)}</span>}
                          {prog.time && <span>, {formatTime(prog.time)}</span>}
                          {prog.venue && <span> — {prog.venue}</span>}
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── With Love / Family Members ── */}
        {familyMembers && familyMembers.trim() && (
          <div className="wed-with-love wed-with-love-center">
            <div className="wed-wl-label">With love,</div>
            <div className="wed-wl-names">
              {familyMembers.split('\n').filter(n => n.trim()).map((name, i) => (
                <div key={i} className="wed-wl-name">{name.trim()}</div>
              ))}
            </div>
          </div>
        )}

        {/* ── Custom Message ── */}
        {message && (
          <div className="wed-message wed-message-center">
            <em>{message}</em>
          </div>
        )}

        {/* ── Bottom ornament ── */}
        <div className="wed-bottom-ornament">
          <BottomOrnament />
        </div>
      </div>
    );
  }

  /* ── Original two-column layout for templates 1–5 ── */
  return (
    <div id="wedding-card-print" className={`wedding-card ${themeClass}`} style={customBg}>

      {/* ══ Inner border frame ══ */}
      <div className="wed-inner-frame" />

      {/* ══ TWO-COLUMN BODY ══ */}
      <div className="wed-body">

        {/* ────── LEFT COLUMN ────── */}
        <div className="wed-col wed-col-left">

          {/* Sanskrit Shlok */}
          <div className="wed-shlok">
            तेनु सुपती प्राप्त
          </div>

          {/* Jaimala illustration */}
          <div className="wed-jaimala">
            <JaimalaArt />
          </div>

          {/* Couple Photo */}
          {photoPreview && (
            <div className="wed-photo-wrap">
              {template === 3 && <PhotoWreath />}
              <div className="wed-photo-frame">
                <img src={photoPreview} alt="Couple" className="wed-photo" />
              </div>
            </div>
          )}

          {/* Couple Names */}
          <div className="wed-couple">
            <div className="wed-name wed-groom-name">{groomName || 'Groom'}</div>
            <div className="wed-amp">&amp;</div>
            <div className="wed-name wed-bride-name">{brideName || 'Bride'}</div>
          </div>

          {/* Together line */}
          <div className="wed-together">TOGETHER WITH THEIR FAMILIES</div>

          {/* Family Names */}
          <div className="wed-families">
            <span className="wed-family-name">{groomFamily || 'THE GROOM\'S FAMILY'}</span>
            <span className="wed-family-sep">⠀⠀</span>
            <span className="wed-family-name">{brideFamily || 'THE BRIDE\'S FAMILY'}</span>
          </div>

          {/* Blessing */}
          <div className="wed-blessing">
            <em>Please bless the couple<br />with your presence.</em>
          </div>
        </div>

        {/* ────── DIVIDER ────── */}
        <div className="wed-divider-line" />

        {/* ────── RIGHT COLUMN ────── */}
        <div className="wed-col wed-col-right">

          {/* WEDDING CEREMONY */}
          <div className="wed-event-section">
            <h3 className="wed-event-heading">WEDDING<br />CEREMONY</h3>
            <div className="wed-event-details">
              {weddingDate && <div className="wed-detail">{formatDate(weddingDate)}</div>}
              {weddingTime && <div className="wed-detail">{formatTime(weddingTime)}</div>}
              {weddingVenue && <div className="wed-detail">{weddingVenue}</div>}
              {weddingVenueAddress && <div className="wed-detail wed-detail-sub">{weddingVenueAddress}</div>}
            </div>
          </div>

          {/* RECEPTION */}
          {hasReception && (
            <div className="wed-event-section">
              <h3 className="wed-event-heading">RECEPTION</h3>
              <div className="wed-event-details">
                {receptionDate && <div className="wed-detail">{formatDate(receptionDate)}</div>}
                {receptionTime && <div className="wed-detail">{formatTime(receptionTime)}</div>}
                {receptionVenue && <div className="wed-detail">{receptionVenue}</div>}
              </div>
            </div>
          )}

          {/* CUSTOM PROGRAMS (Mehendi, Haldi, Sangeet etc.) */}
          {validPrograms.length > 0 && (
            <div className="wed-event-section">
              <div className="wed-programs-list">
                {validPrograms.map((prog, idx) => (
                  <h3 key={idx} className="wed-program-name">{prog.name}</h3>
                ))}
              </div>
              {validPrograms.some(p => p.date || p.time || p.venue) && (
                <div className="wed-event-details wed-programs-details">
                  {validPrograms.map((prog, idx) => (
                    (prog.date || prog.time || prog.venue) && (
                      <div key={idx} className="wed-prog-detail-row">
                        <span className="wed-prog-detail-label">{prog.name}:</span>
                        {prog.date && <span>{formatDate(prog.date)}</span>}
                        {prog.time && <span>, {formatTime(prog.time)}</span>}
                        {prog.venue && <span> — {prog.venue}</span>}
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Guest Invitation */}
          {guestName && (
            <div className="wed-guest-section">
              <div className="wed-guest-invite">
                Be our guest for<br />
                a joyous celebration.<br />
                Dine &amp; dance following<br />
                our wedding vows.
              </div>
            </div>
          )}

          {/* With Love / Family Members */}
          {familyMembers && familyMembers.trim() && (
            <div className="wed-with-love">
              <div className="wed-wl-label">With love,</div>
              <div className="wed-wl-names">
                {familyMembers.split('\n').filter(n => n.trim()).map((name, i) => (
                  <div key={i} className="wed-wl-name">{name.trim()}</div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Message */}
          {message && (
            <div className="wed-message">
              <em>{message}</em>
            </div>
          )}
        </div>
      </div>

      {/* ══ BOTTOM ORNAMENT ══ */}
      <div className="wed-bottom-ornament">
        <BottomOrnament />
      </div>
    </div>
  );
}
