import { forwardRef } from 'react';
import { formatDate, ordinal } from '../../utils/helpers';
import { T } from '../../utils/translations';

/* ═══════════════════════════════════════════════════
   SVG CORNER / FRAME DECORATIONS FOR EACH TEMPLATE
   ═══════════════════════════════════════════════════ */

/* ─── Shared: elegant gold inner border line ─── */
function InnerBorder({ color = '#c9a84c' }) {
  return <div className="anniv-inner-border" style={{ borderColor: color }} />;
}

/* ─── Template 1 – Royal Gold Floral ─── */
function GoldFloralCorner({ flip = '' }) {
  return (
    <svg className={`anniv-corner ${flip}`} viewBox="0 0 130 130" fill="none">
      {/* main vine curves */}
      <path d="M5 5 Q15 5,30 15 Q50 28,55 50 Q58 60,52 65 Q44 55,50 42" stroke="#c9a84c" strokeWidth="1.3" fill="none" />
      <path d="M5 5 Q5 18,15 32 Q28 52,50 58 Q60 60,63 52 Q55 46,42 52" stroke="#c9a84c" strokeWidth="1.3" fill="none" />
      {/* big flower */}
      <g transform="translate(28,28)">
        <circle cx="0" cy="0" r="3.5" fill="#c9a84c" opacity=".7" />
        {[0, 60, 120, 180, 240, 300].map(a => (
          <ellipse key={a} cx={Math.cos(a * Math.PI / 180) * 8} cy={Math.sin(a * Math.PI / 180) * 8}
            rx="5" ry="2.8" fill="#c9a84c" opacity=".4"
            transform={`rotate(${a} ${Math.cos(a * Math.PI / 180) * 8} ${Math.sin(a * Math.PI / 180) * 8})`} />
        ))}
      </g>
      {/* small flowers */}
      {[[55, 20], [20, 58]].map(([fx, fy], fi) => (
        <g key={fi} transform={`translate(${fx},${fy})`}>
          <circle cx="0" cy="0" r="2.5" fill="#c9a84c" opacity=".6" />
          {[0, 72, 144, 216, 288].map(a => (
            <ellipse key={a} cx={Math.cos(a * Math.PI / 180) * 5.5} cy={Math.sin(a * Math.PI / 180) * 5.5}
              rx="3.5" ry="1.8" fill="#c9a84c" opacity=".35"
              transform={`rotate(${a} ${Math.cos(a * Math.PI / 180) * 5.5} ${Math.sin(a * Math.PI / 180) * 5.5})`} />
          ))}
        </g>
      ))}
      {/* leaves */}
      <path d="M68 12 Q78 5 85 14" stroke="#c9a84c" strokeWidth=".8" fill="#c9a84c" opacity=".25" />
      <path d="M12 68 Q5 78 14 85" stroke="#c9a84c" strokeWidth=".8" fill="#c9a84c" opacity=".25" />
      <path d="M75 30 Q82 22 88 32" stroke="#c9a84c" strokeWidth=".8" fill="#c9a84c" opacity=".2" />
      <path d="M30 75 Q22 82 32 88" stroke="#c9a84c" strokeWidth=".8" fill="#c9a84c" opacity=".2" />
      {/* tiny dots */}
      <circle cx="90" cy="8" r="1.5" fill="#c9a84c" opacity=".3" />
      <circle cx="8" cy="90" r="1.5" fill="#c9a84c" opacity=".3" />
    </svg>
  );
}

function GoldSideVine({ side }) {
  const isLeft = side === 'left';
  return (
    <svg className={`anniv-side-vine ${isLeft ? 'anniv-side-vine-l' : 'anniv-side-vine-r'}`} viewBox="0 0 24 280" fill="none">
      {[30, 70, 120, 170, 220].map(y => (
        <g key={y}>
          <path d={isLeft
            ? `M12 ${y} Q4 ${y - 8} 8 ${y - 18}`
            : `M12 ${y} Q20 ${y - 8} 16 ${y - 18}`}
            stroke="#c9a84c" strokeWidth="1" fill="none" />
          <ellipse
            cx={isLeft ? 6 : 18} cy={y - 16} rx="5" ry="2.5"
            fill="#c9a84c" opacity=".3"
            transform={`rotate(${isLeft ? -30 : 30} ${isLeft ? 6 : 18} ${y - 16})`} />
        </g>
      ))}
      <line x1="12" y1="10" x2="12" y2="270" stroke="#c9a84c" strokeWidth=".5" opacity=".15" />
    </svg>
  );
}

/* ─── Template 2 – Rose Gold Hearts ─── */
function RoseGoldDecor() {
  return (
    <>
      <svg className="anniv-top-strip" viewBox="0 0 420 55" fill="none">
        <path d="M80 28 Q130 5 180 28 Q230 50 280 28 Q330 5 380 28" stroke="#d4a373" strokeWidth="1.2" fill="none" opacity=".4" />
        {[80, 150, 210, 280, 350].map((x, i) => (
          <path key={i} d={`M${x} 20 C${x} 13,${x - 7} 9,${x - 7} 16 C${x - 7} 22,${x} 28,${x} 28 C${x} 28,${x + 7} 22,${x + 7} 16 C${x + 7} 9,${x} 13,${x} 20`}
            fill="#d4a373" opacity={0.25 + i * 0.04} />
        ))}
      </svg>
    </>
  );
}

/* ─── Template 3 – Green Laurels ─── */
function LaurelDecor() {
  return (
    <>
      <svg className="anniv-top-strip" viewBox="0 0 420 50" fill="none">
        <g transform="translate(135,28)">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <ellipse key={i} cx={-i * 10} cy={-i * 3.5} rx="8" ry="4"
              fill="#5a8a4a" opacity=".55"
              transform={`rotate(${-25 - i * 8} ${-i * 10} ${-i * 3.5})`} />
          ))}
        </g>
        <g transform="translate(285,28)">
          {[0, 1, 2, 3, 4, 5].map(i => (
            <ellipse key={i} cx={i * 10} cy={-i * 3.5} rx="8" ry="4"
              fill="#5a8a4a" opacity=".55"
              transform={`rotate(${25 + i * 8} ${i * 10} ${-i * 3.5})`} />
          ))}
        </g>
        <circle cx="210" cy="10" r="5" fill="none" stroke="#b8860b" strokeWidth="1.5" />
        <circle cx="210" cy="10" r="2" fill="#b8860b" opacity=".6" />
      </svg>
    </>
  );
}

/* ─── Template 4 – Mandala Rings ─── */
function MandalaDecor() {
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <svg className="anniv-top-strip" viewBox="0 0 420 70" fill="none">
      <g transform="translate(210,35)">
        <circle cx="0" cy="0" r="24" stroke="#d4af37" strokeWidth="1" fill="none" opacity=".35" />
        <circle cx="0" cy="0" r="17" stroke="#d4af37" strokeWidth=".7" fill="none" opacity=".25" />
        {petals.map(a => (
          <ellipse key={a}
            cx={Math.cos(a * Math.PI / 180) * 28} cy={Math.sin(a * Math.PI / 180) * 28}
            rx="5.5" ry="2.5" fill="#d4af37" opacity=".3"
            transform={`rotate(${a} ${Math.cos(a * Math.PI / 180) * 28} ${Math.sin(a * Math.PI / 180) * 28})`} />
        ))}
      </g>
    </svg>
  );
}

/* ─── Template 5 – Vintage Double Frame ─── */
function VintageFrameDecor() {
  return (
    <div className="anniv-vintage-frame-wrap">
      <svg className="anniv-vintage-svg" viewBox="0 0 420 640" fill="none" preserveAspectRatio="none">
        <rect x="10" y="10" width="400" height="620" rx="3" stroke="#b8860b" strokeWidth="1.5" fill="none" opacity=".45" />
        <rect x="17" y="17" width="386" height="606" rx="2" stroke="#b8860b" strokeWidth=".6" fill="none" opacity=".25" />
        {/* corner ornaments */}
        {[[22, 22, 0], [398, 22, 90], [398, 618, 180], [22, 618, 270]].map(([cx, cy, r], i) => (
          <g key={i} transform={`translate(${cx},${cy}) rotate(${r})`}>
            <path d="M0 0 C12 0 16 4 16 16" stroke="#b8860b" strokeWidth="1.1" fill="none" />
            <path d="M0 0 C0 12 4 16 16 16" stroke="#b8860b" strokeWidth="1.1" fill="none" />
            <circle cx="8" cy="8" r="2.5" fill="#b8860b" opacity=".45" />
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ─── Template 6 – Minimal Swirl ─── */
function SwirlDecor() {
  return (
    <>
      <svg className="anniv-top-strip" viewBox="0 0 420 45" fill="none">
        <path d="M130 22 C155 8,175 8,210 22 C245 36,265 36,290 22" stroke="#c9a84c" strokeWidth="1.4" fill="none" opacity=".55" />
        <path d="M118 25 C123 32,128 28,130 22" stroke="#c9a84c" strokeWidth="1" fill="none" opacity=".35" />
        <path d="M302 19 C297 12,292 16,290 22" stroke="#c9a84c" strokeWidth="1" fill="none" opacity=".35" />
        <circle cx="210" cy="22" r="2.5" fill="#c9a84c" opacity=".45" />
      </svg>
    </>
  );
}


/* ═══════════════════════════════════════════════════
   MAIN PREVIEW COMPONENT
   ═══════════════════════════════════════════════════ */
const AnniversaryCardPreview = forwardRef(function AnniversaryCardPreview(
  { data, lang = 'en', template = 1, bgColor },
  ref
) {
  const t = T[lang] || T.en;
  const tpl = template || 1;
  const themeClass = `anniv-theme-${tpl}`;
  const customBg = bgColor ? { background: bgColor } : {};

  const { partner1, partner2, years, date, message, photoPreview } = data;

  return (
    <div id="anniv-card-print" className={`anniv-card ${themeClass}`} ref={ref} style={customBg}>

      {/* Template-specific top decorations */}
      {tpl === 1 && (
        <>
          <GoldFloralCorner flip="anniv-flip-none" />
          <GoldFloralCorner flip="anniv-flip-h" />
          <GoldFloralCorner flip="anniv-flip-v" />
          <GoldFloralCorner flip="anniv-flip-hv" />
          <GoldSideVine side="left" />
          <GoldSideVine side="right" />
          <InnerBorder />
        </>
      )}
      {tpl === 2 && <RoseGoldDecor />}
      {tpl === 3 && <LaurelDecor />}
      {tpl === 4 && <MandalaDecor />}
      {tpl === 5 && <VintageFrameDecor />}
      {tpl === 6 && <SwirlDecor />}

      {/* ─── Card Content ─── */}
      <div className="anniv-content">
        {/* Title */}
        <h1 className="anniv-title-main">
          {t.annivTitle || 'Happy Anniversary!'}
        </h1>

        {/* Couple names */}
        <p className="anniv-couple-names">
          {partner1 || 'Partner 1'} <span className="anniv-amp">&amp;</span> {partner2 || 'Partner 2'}
        </p>

        {/* Years badge */}
        {years && (
          <div className="anniv-years-badge">
            {t.annivBadge ? t.annivBadge(ordinal(parseInt(years, 10))) : `${years} Years`}
          </div>
        )}

        {/* Message / Blessing */}
        {message && <p className="anniv-message-text">&ldquo;{message}&rdquo;</p>}

        {/* Date */}
        {date && <p className="anniv-date-line">{formatDate(date, lang)}</p>}

        {/* Photo */}
        {photoPreview && (
          <div className="anniv-photo-wrap">
            <div className="anniv-photo-frame">
              <img src={photoPreview} alt={`${partner1} & ${partner2}`} className="anniv-photo-img" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom decorations for all templates */}
      {tpl === 1 && (
        <svg className="anniv-bot-strip" viewBox="0 0 420 40" fill="none" style={{ marginTop: 'auto' }}>
          <path d="M80 20 Q130 5 180 20 Q230 35 280 20 Q330 5 380 20" stroke="#c9a84c" strokeWidth="1" fill="none" opacity=".3" />
          <circle cx="130" cy="18" r="2" fill="#c9a84c" opacity=".3" />
          <circle cx="210" cy="22" r="2.5" fill="#c9a84c" opacity=".35" />
          <circle cx="290" cy="18" r="2" fill="#c9a84c" opacity=".3" />
        </svg>
      )}
      {tpl === 2 && (
        <svg className="anniv-bot-strip" viewBox="0 0 420 35" fill="none">
          {[100, 170, 250, 320].map((x, i) => (
            <path key={i} d={`M${x} 16 C${x} 11,${x - 5} 8,${x - 5} 13 C${x - 5} 18,${x} 22,${x} 22 C${x} 22,${x + 5} 18,${x + 5} 13 C${x + 5} 8,${x} 11,${x} 16`}
              fill="#d4a373" opacity={0.2 + i * 0.04} />
          ))}
          <line x1="40" y1="18" x2="380" y2="18" stroke="#d4a373" strokeWidth=".4" opacity=".25" />
        </svg>
      )}
      {tpl === 3 && (
        <svg className="anniv-bot-strip" viewBox="0 0 420 35" fill="none">
          <g transform="translate(150,18)">
            {[0, 1, 2, 3].map(i => (
              <ellipse key={i} cx={-i * 9} cy={i * 3} rx="7" ry="3.5"
                fill="#5a8a4a" opacity=".45"
                transform={`rotate(${25 + i * 8} ${-i * 9} ${i * 3})`} />
            ))}
          </g>
          <g transform="translate(270,18)">
            {[0, 1, 2, 3].map(i => (
              <ellipse key={i} cx={i * 9} cy={i * 3} rx="7" ry="3.5"
                fill="#5a8a4a" opacity=".45"
                transform={`rotate(${-25 - i * 8} ${i * 9} ${i * 3})`} />
            ))}
          </g>
        </svg>
      )}
      {tpl === 4 && (
        <svg className="anniv-bot-strip" viewBox="0 0 420 40" fill="none">
          <g transform="translate(210,20)">
            <circle cx="0" cy="0" r="14" stroke="#d4af37" strokeWidth=".7" fill="none" opacity=".25" />
            {Array.from({ length: 8 }, (_, i) => i * 45).map(a => (
              <ellipse key={a}
                cx={Math.cos(a * Math.PI / 180) * 18} cy={Math.sin(a * Math.PI / 180) * 18}
                rx="4" ry="2" fill="#d4af37" opacity=".2"
                transform={`rotate(${a} ${Math.cos(a * Math.PI / 180) * 18} ${Math.sin(a * Math.PI / 180) * 18})`} />
            ))}
          </g>
        </svg>
      )}
      {tpl === 6 && (
        <svg className="anniv-bot-strip" viewBox="0 0 420 30" fill="none">
          <path d="M155 15 C180 4,240 4,265 15" stroke="#c9a84c" strokeWidth="1" fill="none" opacity=".4" />
          <circle cx="210" cy="7" r="1.8" fill="#c9a84c" opacity=".35" />
          <line x1="60" y1="15" x2="145" y2="15" stroke="#c9a84c" strokeWidth=".4" opacity=".25" />
          <line x1="275" y1="15" x2="360" y2="15" stroke="#c9a84c" strokeWidth=".4" opacity=".25" />
        </svg>
      )}
    </div>
  );
});

export default AnniversaryCardPreview;
