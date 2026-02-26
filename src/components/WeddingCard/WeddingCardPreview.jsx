import { formatDate, formatTime } from '../../utils/helpers';
import { T } from '../../utils/translations';

/* ══════════════════════════════════════════════════════════════
   SVG ART — Charming, detailed inline illustrations
   Matching the birthday card quality with filled shapes,
   facial features, clothing details, and rich ornamentation
   ══════════════════════════════════════════════════════════════ */

/* ── Jaimala Couple — Detailed groom & bride exchanging garlands ── */
function JaimalaArt() {
  return (
    <svg viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="wed-jaimala-svg" aria-hidden="true">
      {/* ── Groom ── */}
      <g className="wed-groom-g">
        {/* Face */}
        <circle cx="72" cy="52" r="18" fill="#f5d0a9" />
        <circle cx="72" cy="52" r="18" stroke="#d4a06a" strokeWidth="1" fill="none" />
        {/* Eyes */}
        <ellipse cx="66" cy="50" rx="2.5" ry="3" fill="#3d2b1f" />
        <ellipse cx="78" cy="50" rx="2.5" ry="3" fill="#3d2b1f" />
        <circle cx="67" cy="49" r="0.8" fill="#fff" />
        <circle cx="79" cy="49" r="0.8" fill="#fff" />
        {/* Eyebrows */}
        <path d="M62 46 Q66 43 70 46" stroke="#3d2b1f" strokeWidth="1" fill="none" />
        <path d="M74 46 Q78 43 82 46" stroke="#3d2b1f" strokeWidth="1" fill="none" />
        {/* Nose */}
        <path d="M72 52 Q73 55 71 56" stroke="#c9946a" strokeWidth="0.8" fill="none" />
        {/* Smile */}
        <path d="M66 58 Q72 63 78 58" stroke="#c55" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        {/* Cheeks */}
        <circle cx="62" cy="57" r="3" fill="#f0a0a0" opacity=".3" />
        <circle cx="82" cy="57" r="3" fill="#f0a0a0" opacity=".3" />
        {/* Turban / Pagdi */}
        <path d="M52 44 Q52 26 72 22 Q92 26 92 44" fill="#c9463e" opacity=".85" />
        <path d="M52 44 Q52 30 72 26 Q92 30 92 44" fill="#d4564e" opacity=".6" />
        <path d="M56 42 Q56 32 72 28 Q88 32 88 42" fill="#e86860" opacity=".4" />
        {/* Turban jewel */}
        <circle cx="72" cy="32" r="3.5" fill="#ffd700" />
        <circle cx="72" cy="32" r="2" fill="#fff" opacity=".5" />
        {/* Turban feather */}
        <path d="M72 28 Q76 18 74 10" stroke="#ffd700" strokeWidth="1" fill="none" />
        <ellipse cx="74" cy="12" rx="3" ry="6" fill="#ffd700" opacity=".5" transform="rotate(-10 74 12)" />
        {/* Sehra (veil beads) */}
        {[56, 60, 64, 68, 72, 76, 80, 84, 88].map((x, i) => (
          <circle key={`s${i}`} cx={x} cy={44 + (i % 2 ? 2 : 0)} r="1.5" fill="#ffd700" opacity=".7" />
        ))}
        {/* Neck */}
        <rect x="66" y="68" width="12" height="8" rx="3" fill="#f5d0a9" />
        {/* Sherwani body */}
        <path d="M50 76 Q50 72 60 72 L84 72 Q94 72 94 76 L98 145 Q72 155 46 145 Z" fill="#c9463e" opacity=".8" />
        <path d="M50 76 Q50 72 60 72 L84 72 Q94 72 94 76 L98 145 Q72 155 46 145 Z" stroke="#a03030" strokeWidth="0.8" fill="none" />
        {/* Sherwani buttons */}
        {[85, 95, 105, 115, 125].map(y => (
          <circle key={`b${y}`} cx="72" cy={y} r="1.5" fill="#ffd700" opacity=".8" />
        ))}
        {/* Sherwani collar */}
        <path d="M60 72 L68 82 L72 76 L76 82 L84 72" stroke="#a03030" strokeWidth="0.8" fill="#b83838" opacity=".5" />
        {/* Dupatta / stole */}
        <path d="M50 76 Q42 90 44 120 Q46 135 50 145" stroke="#ffd700" strokeWidth="2" fill="none" opacity=".5" />
        <path d="M94 76 Q100 90 98 120" stroke="#ffd700" strokeWidth="1.5" fill="none" opacity=".3" />
        {/* Left arm holding garland */}
        <path d="M50 82 Q38 90 34 100 Q32 108 40 112" stroke="#f5d0a9" strokeWidth="8" strokeLinecap="round" fill="none" />
        <circle cx="40" cy="114" r="5" fill="#f5d0a9" />
        {/* Right arm offering garland */}
        <path d="M94 82 Q108 92 118 100" stroke="#f5d0a9" strokeWidth="8" strokeLinecap="round" fill="none" />
        <circle cx="120" cy="102" r="5" fill="#f5d0a9" />
        {/* Shoes */}
        <ellipse cx="60" cy="150" rx="11" ry="5" fill="#c9463e" opacity=".7" />
        <ellipse cx="84" cy="150" rx="11" ry="5" fill="#c9463e" opacity=".7" />
        <path d="M50 150 Q55 144 60 150" fill="#b83838" opacity=".5" />
        <path d="M74 150 Q79 144 84 150" fill="#b83838" opacity=".5" />
      </g>

      {/* ── Bride ── */}
      <g className="wed-bride-g">
        {/* Face */}
        <circle cx="148" cy="52" r="18" fill="#f5d0a9" />
        <circle cx="148" cy="52" r="18" stroke="#d4a06a" strokeWidth="1" fill="none" />
        {/* Eyes with lashes */}
        <ellipse cx="142" cy="50" rx="2.5" ry="3" fill="#3d2b1f" />
        <ellipse cx="154" cy="50" rx="2.5" ry="3" fill="#3d2b1f" />
        <circle cx="143" cy="49" r="0.8" fill="#fff" />
        <circle cx="155" cy="49" r="0.8" fill="#fff" />
        <path d="M139 47 Q142 44 145 47" stroke="#3d2b1f" strokeWidth="0.8" fill="none" />
        <path d="M151 47 Q154 44 157 47" stroke="#3d2b1f" strokeWidth="0.8" fill="none" />
        {/* Eyelashes */}
        <path d="M139 48 L137 46" stroke="#3d2b1f" strokeWidth="0.5" />
        <path d="M157 48 L159 46" stroke="#3d2b1f" strokeWidth="0.5" />
        {/* Nose with nosering */}
        <path d="M148 52 Q149 55 147 56" stroke="#c9946a" strokeWidth="0.8" fill="none" />
        <circle cx="146" cy="56" r="1.2" fill="#ffd700" />
        {/* Smile */}
        <path d="M142 58 Q148 63 154 58" stroke="#c55" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        {/* Cheeks */}
        <circle cx="138" cy="57" r="3" fill="#f0a0a0" opacity=".35" />
        <circle cx="158" cy="57" r="3" fill="#f0a0a0" opacity=".35" />
        {/* Bindi */}
        <circle cx="148" cy="42" r="2" fill="#c9463e" />
        {/* Maang tikka (forehead jewelry) */}
        <path d="M148 40 L148 34" stroke="#ffd700" strokeWidth="1" />
        <circle cx="148" cy="33" r="2.5" fill="#ffd700" />
        <circle cx="148" cy="33" r="1.2" fill="#fff" opacity=".5" />
        {/* Hair */}
        <path d="M130 46 Q128 34 136 28 Q144 22 148 22 Q152 22 160 28 Q168 34 166 46" fill="#1a1a2e" opacity=".85" />
        {/* Hair parting */}
        <line x1="148" y1="22" x2="148" y2="36" stroke="#c9463e" strokeWidth="1.5" opacity=".4" />
        {/* Dupatta / veil */}
        <path d="M130 44 Q125 28 135 18 Q148 12 161 18 Q171 28 166 44" fill="#d4564e" opacity=".2" />
        <path d="M128 50 Q122 60 120 80 Q118 100 125 130 Q128 138 132 145" fill="#d4564e" opacity=".15" />
        <path d="M168 50 Q174 60 176 80 Q178 100 175 130 Q172 138 168 145" fill="#d4564e" opacity=".15" />
        {/* Dupatta border */}
        <path d="M128 50 Q122 60 120 80 Q118 100 125 130" stroke="#ffd700" strokeWidth="0.8" fill="none" opacity=".4" />
        <path d="M168 50 Q174 60 176 80 Q178 100 175 130" stroke="#ffd700" strokeWidth="0.8" fill="none" opacity=".4" />
        {/* Earrings (jhumkas) */}
        <circle cx="130" cy="55" r="3" fill="#ffd700" opacity=".7" />
        <circle cx="130" cy="59" r="2" fill="#ffd700" opacity=".5" />
        <circle cx="166" cy="55" r="3" fill="#ffd700" opacity=".7" />
        <circle cx="166" cy="59" r="2" fill="#ffd700" opacity=".5" />
        {/* Neck */}
        <rect x="142" y="68" width="12" height="8" rx="3" fill="#f5d0a9" />
        {/* Necklace */}
        <path d="M138 74 Q148 80 158 74" stroke="#ffd700" strokeWidth="2" fill="none" />
        <path d="M140 76 Q148 82 156 76" stroke="#ffd700" strokeWidth="1.5" fill="none" opacity=".6" />
        {[140, 144, 148, 152, 156].map((x, i) => (
          <circle key={`n${i}`} cx={x} cy={75 + Math.abs(i - 2) * 0.8} r="1.5" fill="#ffd700" opacity=".8" />
        ))}
        {/* Lehenga / Saree */}
        <path d="M126 76 Q126 72 136 72 L160 72 Q170 72 170 76 L178 145 Q148 165 118 145 Z" fill="#d4564e" opacity=".6" />
        <path d="M126 76 Q126 72 136 72 L160 72 Q170 72 170 76 L178 145 Q148 165 118 145 Z" stroke="#a03030" strokeWidth="0.8" fill="none" />
        {/* Lehenga border pattern */}
        <path d="M120 140 Q148 158 176 140" stroke="#ffd700" strokeWidth="2" fill="none" opacity=".5" />
        <path d="M122 136 Q148 152 174 136" stroke="#ffd700" strokeWidth="1" fill="none" opacity=".3" />
        {/* Embroidery dots on lehenga */}
        {[135, 142, 148, 155, 162].map((x, i) => (
          <circle key={`e${i}`} cx={x} cy={110 + (i % 2 ? 3 : 0)} r="1" fill="#ffd700" opacity=".4" />
        ))}
        {[138, 148, 158].map((x, i) => (
          <circle key={`e2${i}`} cx={x} cy={125 + (i % 2 ? 2 : 0)} r="1" fill="#ffd700" opacity=".35" />
        ))}
        {/* Bangles */}
        <circle cx="126" cy="100" r="4" stroke="#ffd700" strokeWidth="1.5" fill="none" opacity=".6" />
        <circle cx="126" cy="106" r="4" stroke="#c9463e" strokeWidth="1.5" fill="none" opacity=".5" />
        <circle cx="170" cy="100" r="4" stroke="#ffd700" strokeWidth="1.5" fill="none" opacity=".6" />
        <circle cx="170" cy="106" r="4" stroke="#c9463e" strokeWidth="1.5" fill="none" opacity=".5" />
        {/* Left arm */}
        <path d="M126 82 Q114 92 104 100" stroke="#f5d0a9" strokeWidth="8" strokeLinecap="round" fill="none" />
        <circle cx="102" cy="102" r="5" fill="#f5d0a9" />
        {/* Right arm */}
        <path d="M170 82 Q180 92 184 104" stroke="#f5d0a9" strokeWidth="8" strokeLinecap="round" fill="none" />
        <circle cx="184" cy="106" r="5" fill="#f5d0a9" />
      </g>

      {/* ── Jaimala / Garland between them ── */}
      <g className="wed-garland-g">
        {/* Garland arc (marigold & rose garland) */}
        <path d="M102 100 Q110 82 120 100" fill="none" stroke="#f0a040" strokeWidth="1" opacity=".6" />
        {/* Left garland (groom giving to bride) */}
        {[102, 106, 110, 114, 118].map((x, i) => (
          <g key={`gl${i}`}>
            <circle cx={x} cy={96 - Math.abs(i - 2) * 3} r="3.5" fill={i % 2 ? '#e8a040' : '#e85050'} opacity=".8" />
            <circle cx={x} cy={96 - Math.abs(i - 2) * 3} r="1.5" fill={i % 2 ? '#f0c060' : '#f08080'} opacity=".6" />
          </g>
        ))}
        {/* Right garland (bride giving to groom) */}
        {[102, 106, 110, 114, 118].map((x, i) => (
          <g key={`gr${i}`}>
            <circle cx={x} cy={108 + Math.abs(i - 2) * 2.5} r="3" fill={i % 2 ? '#e85050' : '#f0a040'} opacity=".7" />
            <circle cx={x} cy={108 + Math.abs(i - 2) * 2.5} r="1.2" fill="#fff" opacity=".3" />
          </g>
        ))}
      </g>

      {/* ── Decorative marigold strings top ── */}
      <g opacity=".4">
        <path d="M0 8 Q55 18 110 8 Q165 -2 220 8" stroke="#f0a040" strokeWidth="1" fill="none" />
        {[20, 50, 80, 110, 140, 170, 200].map((x, i) => (
          <circle key={`mt${i}`} cx={x} cy={8 + (i % 2 ? 4 : -2)} r="3" fill={i % 2 ? '#e8a040' : '#e85050'} opacity=".6" />
        ))}
      </g>

      {/* ── Small hearts ── */}
      {[[30, 90], [190, 85], [110, 170], [15, 140], [205, 135]].map(([x, y], i) => (
        <path key={`h${i}`} d={`M${x} ${y} Q${x} ${y - 4} ${x - 4} ${y - 4} Q${x - 8} ${y - 4} ${x - 8} ${y} Q${x - 8} ${y + 4} ${x} ${y + 8} Q${x + 8} ${y + 4} ${x + 8} ${y} Q${x + 8} ${y - 4} ${x + 4} ${y - 4} Q${x} ${y - 4} ${x} ${y}Z`}
          fill="#e86060" opacity={.15 + i * .05} />
      ))}

      {/* ── Floor / Mandap base ── */}
      <path d="M20 158 Q110 168 200 158" stroke="#c9a84c" strokeWidth="1" fill="none" opacity=".3" />
      <path d="M30 162 Q110 170 190 162" stroke="#c9a84c" strokeWidth="0.5" fill="none" opacity=".2" />
    </svg>
  );
}

/* ── Floral leaf wreath around photo (for theme 3) ── */
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
      {/* Detailed roses with petals */}
      {[[50, 140], [150, 140], [38, 100], [162, 100]].map(([x, y], i) => (
        <g key={`rose${i}`}>
          <circle cx={x} cy={y} r="9" fill="#e88090" opacity=".3" />
          <circle cx={x} cy={y} r="6" fill="#d06070" opacity=".45" />
          <circle cx={x} cy={y} r="3.5" fill="#c05060" opacity=".55" />
          <circle cx={x} cy={y} r="1.5" fill="#ffd" opacity=".4" />
          {/* Tiny leaves next to roses */}
          <ellipse cx={x - 8} cy={y + 2} rx="5" ry="2.5" transform={`rotate(-20 ${x - 8} ${y + 2})`} className="wed-svg-wreath-leaf" opacity=".5" />
          <ellipse cx={x + 8} cy={y + 2} rx="5" ry="2.5" transform={`rotate(20 ${x + 8} ${y + 2})`} className="wed-svg-wreath-leaf" opacity=".5" />
        </g>
      ))}
      {/* Top flower buds */}
      {[[55, 65], [145, 65]].map(([x, y], i) => (
        <g key={`bud${i}`}>
          <circle cx={x} cy={y} r="5" fill="#e8a0a0" opacity=".4" />
          <circle cx={x} cy={y} r="2.5" fill="#e07080" opacity=".5" />
        </g>
      ))}
    </svg>
  );
}

/* ── Divine Couple — Detailed Mandap scene with groom & bride ── */
function DivineCoupleArt() {
  return (
    <svg viewBox="0 0 240 210" fill="none" xmlns="http://www.w3.org/2000/svg" className="wed-divine-svg" aria-hidden="true">
      {/* ── Mandap arch ── */}
      <path d="M20 190 Q20 40 120 15 Q220 40 220 190" stroke="#c9a84c" strokeWidth="2.5" fill="none" opacity=".7" />
      <path d="M28 190 Q28 48 120 25 Q212 48 212 190" stroke="#c9a84c" strokeWidth="1" fill="none" opacity=".3" />
      {/* Arch decorative top */}
      <circle cx="120" cy="15" r="6" fill="#c9a84c" opacity=".5" />
      <circle cx="120" cy="15" r="3" fill="#ffd700" opacity=".7" />
      {/* Marigold strings on arch */}
      {[50, 75, 100, 140, 165, 190].map((x, i) => {
        const y = i < 3 ? 185 - (3 - i) * 40 : 185 - (i - 2) * 40;
        return (
          <g key={`ad${i}`}>
            <circle cx={x} cy={y} r="4" fill="#e8a040" opacity=".35" />
            <circle cx={x} cy={y} r="2" fill="#f0c060" opacity=".4" />
          </g>
        );
      })}
      {/* Hanging marigold garlands from arch */}
      {[45, 80, 160, 195].map((x, i) => {
        const top = i < 2 ? 60 + i * 20 : 60 + (3 - i) * 20;
        return (
          <g key={`hg${i}`} opacity=".4">
            {[0, 1, 2, 3].map(j => (
              <circle key={j} cx={x} cy={top + j * 10} r="3" fill={j % 2 ? '#e8a040' : '#e85050'} />
            ))}
          </g>
        );
      })}

      {/* ── Groom (left) — Detailed ── */}
      <g>
        {/* Face */}
        <circle cx="88" cy="72" r="16" fill="#f5d0a9" />
        <circle cx="88" cy="72" r="16" stroke="#d4a06a" strokeWidth="0.8" fill="none" />
        {/* Eyes */}
        <ellipse cx="83" cy="70" rx="2" ry="2.5" fill="#3d2b1f" />
        <ellipse cx="93" cy="70" rx="2" ry="2.5" fill="#3d2b1f" />
        <circle cx="84" cy="69" r="0.7" fill="#fff" />
        <circle cx="94" cy="69" r="0.7" fill="#fff" />
        {/* Eyebrows */}
        <path d="M80 67 Q83 64.5 86 67" stroke="#3d2b1f" strokeWidth="0.8" fill="none" />
        <path d="M90 67 Q93 64.5 96 67" stroke="#3d2b1f" strokeWidth="0.8" fill="none" />
        {/* Smile */}
        <path d="M83 76 Q88 80 93 76" stroke="#c55" strokeWidth="1" fill="none" strokeLinecap="round" />
        {/* Cheeks */}
        <circle cx="79" cy="75" r="2.5" fill="#f0a0a0" opacity=".3" />
        <circle cx="97" cy="75" r="2.5" fill="#f0a0a0" opacity=".3" />
        {/* Turban */}
        <path d="M70 64 Q70 46 88 42 Q106 46 106 64" fill="#c9463e" opacity=".8" />
        <path d="M74 62 Q74 50 88 46 Q102 50 102 62" fill="#d4564e" opacity=".5" />
        {/* Turban jewel */}
        <circle cx="88" cy="50" r="3" fill="#ffd700" />
        <circle cx="88" cy="50" r="1.5" fill="#fff" opacity=".5" />
        {/* Kalgi / feather */}
        <path d="M88 47 Q92 38 90 30" stroke="#ffd700" strokeWidth="0.8" fill="none" />
        <ellipse cx="90" cy="32" rx="2.5" ry="5" fill="#ffd700" opacity=".45" transform="rotate(-10 90 32)" />
        {/* Sehra beads */}
        {[73, 77, 81, 85, 89, 93, 97, 101].map((x, i) => (
          <circle key={`gs${i}`} cx={x} cy={64 + (i % 2 ? 1.5 : 0)} r="1.2" fill="#ffd700" opacity=".6" />
        ))}
        {/* Neck */}
        <rect x="83" y="86" width="10" height="7" rx="3" fill="#f5d0a9" />
        {/* Sherwani */}
        <path d="M68 93 Q68 90 76 90 L100 90 Q108 90 108 93 L112 165 Q88 175 64 165 Z" fill="#c9463e" opacity=".75" />
        <path d="M68 93 Q68 90 76 90 L100 90 Q108 90 108 93 L112 165 Q88 175 64 165 Z" stroke="#a03030" strokeWidth="0.6" fill="none" />
        {/* Buttons */}
        {[102, 110, 118, 126, 134].map(y => (
          <circle key={`gb${y}`} cx="88" cy={y} r="1.2" fill="#ffd700" opacity=".7" />
        ))}
        {/* Collar */}
        <path d="M76 90 L84 98 L88 93 L92 98 L100 90" stroke="#a03030" strokeWidth="0.6" fill="#b83838" opacity=".4" />
        {/* Arms — right arm reaching toward bride */}
        <path d="M108 100 Q118 106 126 108" stroke="#f5d0a9" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="128" cy="109" r="4.5" fill="#f5d0a9" />
        {/* Left arm */}
        <path d="M68 100 Q58 108 54 118" stroke="#f5d0a9" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="53" cy="120" r="4.5" fill="#f5d0a9" />
      </g>

      {/* ── Bride (right) — Detailed ── */}
      <g>
        {/* Face */}
        <circle cx="152" cy="72" r="16" fill="#f5d0a9" />
        <circle cx="152" cy="72" r="16" stroke="#d4a06a" strokeWidth="0.8" fill="none" />
        {/* Eyes */}
        <ellipse cx="147" cy="70" rx="2" ry="2.5" fill="#3d2b1f" />
        <ellipse cx="157" cy="70" rx="2" ry="2.5" fill="#3d2b1f" />
        <circle cx="148" cy="69" r="0.7" fill="#fff" />
        <circle cx="158" cy="69" r="0.7" fill="#fff" />
        {/* Eyebrows */}
        <path d="M144 67 Q147 64.5 150 67" stroke="#3d2b1f" strokeWidth="0.8" fill="none" />
        <path d="M154 67 Q157 64.5 160 67" stroke="#3d2b1f" strokeWidth="0.8" fill="none" />
        {/* Eyelashes */}
        <path d="M144 68 L142.5 66.5" stroke="#3d2b1f" strokeWidth="0.4" />
        <path d="M160 68 L161.5 66.5" stroke="#3d2b1f" strokeWidth="0.4" />
        {/* Nose & nosering */}
        <path d="M152 72 Q153 74 151 75" stroke="#c9946a" strokeWidth="0.6" fill="none" />
        <circle cx="150" cy="75" r="1" fill="#ffd700" />
        {/* Smile */}
        <path d="M147 77 Q152 81 157 77" stroke="#c55" strokeWidth="1" fill="none" strokeLinecap="round" />
        {/* Cheeks */}
        <circle cx="143" cy="76" r="2.5" fill="#f0a0a0" opacity=".35" />
        <circle cx="161" cy="76" r="2.5" fill="#f0a0a0" opacity=".35" />
        {/* Bindi */}
        <circle cx="152" cy="62" r="1.8" fill="#c9463e" />
        {/* Maang tikka */}
        <path d="M152 60 L152 55" stroke="#ffd700" strokeWidth="0.8" />
        <circle cx="152" cy="54" r="2" fill="#ffd700" />
        <circle cx="152" cy="54" r="1" fill="#fff" opacity=".4" />
        {/* Hair */}
        <path d="M136 64 Q134 54 140 48 Q148 42 152 42 Q156 42 164 48 Q170 54 168 64" fill="#1a1a2e" opacity=".8" />
        {/* Hair parting (sindoor) */}
        <line x1="152" y1="42" x2="152" y2="54" stroke="#c9463e" strokeWidth="1.2" opacity=".4" />
        {/* Dupatta veil behind */}
        <path d="M135 62 Q130 48 138 38 Q148 32 162 38 Q170 48 165 62" fill="#d4564e" opacity=".18" />
        <path d="M134 68 Q128 80 126 100 Q124 120 130 150" fill="#d4564e" opacity=".12" />
        <path d="M170 68 Q176 80 178 100 Q180 120 176 150" fill="#d4564e" opacity=".12" />
        {/* Dupatta borders */}
        <path d="M134 68 Q128 80 126 100 Q124 120 130 150" stroke="#ffd700" strokeWidth="0.6" fill="none" opacity=".35" />
        <path d="M170 68 Q176 80 178 100 Q180 120 176 150" stroke="#ffd700" strokeWidth="0.6" fill="none" opacity=".35" />
        {/* Earrings */}
        <circle cx="136" cy="74" r="2.5" fill="#ffd700" opacity=".6" />
        <circle cx="136" cy="77" r="1.5" fill="#ffd700" opacity=".45" />
        <circle cx="168" cy="74" r="2.5" fill="#ffd700" opacity=".6" />
        <circle cx="168" cy="77" r="1.5" fill="#ffd700" opacity=".45" />
        {/* Neck */}
        <rect x="147" y="86" width="10" height="7" rx="3" fill="#f5d0a9" />
        {/* Necklace */}
        <path d="M142 92 Q152 97 162 92" stroke="#ffd700" strokeWidth="1.5" fill="none" />
        {[143, 147, 152, 157, 161].map((x, i) => (
          <circle key={`bn${i}`} cx={x} cy={92.5 + Math.abs(i - 2) * 0.6} r="1.2" fill="#ffd700" opacity=".7" />
        ))}
        {/* Lehenga */}
        <path d="M132 93 Q132 90 140 90 L164 90 Q172 90 172 93 L180 165 Q152 180 124 165 Z" fill="#d4564e" opacity=".55" />
        <path d="M132 93 Q132 90 140 90 L164 90 Q172 90 172 93 L180 165 Q152 180 124 165 Z" stroke="#a03030" strokeWidth="0.6" fill="none" />
        {/* Lehenga border */}
        <path d="M126 160 Q152 176 178 160" stroke="#ffd700" strokeWidth="1.5" fill="none" opacity=".4" />
        <path d="M128 156 Q152 170 176 156" stroke="#ffd700" strokeWidth="0.8" fill="none" opacity=".25" />
        {/* Embroidery */}
        {[140, 148, 156, 164].map((x, i) => (
          <circle key={`be${i}`} cx={x} cy={125 + (i % 2 ? 2 : 0)} r="0.8" fill="#ffd700" opacity=".35" />
        ))}
        {/* Arms — left arm reaching toward groom */}
        <path d="M132 100 Q122 106 116 108" stroke="#f5d0a9" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="114" cy="109" r="4.5" fill="#f5d0a9" />
        {/* Right arm */}
        <path d="M172 100 Q182 108 186 118" stroke="#f5d0a9" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="187" cy="120" r="4.5" fill="#f5d0a9" />
        {/* Bangles */}
        <circle cx="132" cy="108" r="3" stroke="#ffd700" strokeWidth="1" fill="none" opacity=".5" />
        <circle cx="132" cy="113" r="3" stroke="#c9463e" strokeWidth="1" fill="none" opacity=".4" />
      </g>

      {/* ── Garland between couple ── */}
      <g>
        <path d="M114 108 Q120 98 128 108" fill="none" stroke="#e8a040" strokeWidth="0.8" opacity=".5" />
        {[114, 118, 122, 126].map((x, i) => (
          <g key={`dg${i}`}>
            <circle cx={x + 1} cy={104 - Math.abs(i - 1.5) * 2} r="3" fill={i % 2 ? '#e8a040' : '#e85050'} opacity=".7" />
            <circle cx={x + 1} cy={104 - Math.abs(i - 1.5) * 2} r="1.2" fill="#fff" opacity=".3" />
          </g>
        ))}
        {[114, 118, 122, 126].map((x, i) => (
          <circle key={`dg2${i}`} cx={x + 1} cy={112 + Math.abs(i - 1.5) * 1.5} r="2.5" fill={i % 2 ? '#e85050' : '#f0a040'} opacity=".6" />
        ))}
      </g>

      {/* ── Sacred fire (Agni) between them ── */}
      <g transform="translate(110, 148)">
        {/* Fire base / havan kund */}
        <rect x="0" y="16" width="20" height="6" rx="2" fill="#8B6914" opacity=".6" />
        <rect x="2" y="14" width="16" height="4" rx="1" fill="#a07828" opacity=".5" />
        {/* Flames */}
        <path d="M10 16 Q6 8 8 2 Q10 -4 10 -2 Q10 -4 12 2 Q14 8 10 16" fill="#f0a040" opacity=".7" />
        <path d="M10 14 Q7 8 9 4 Q10 0 11 4 Q13 8 10 14" fill="#f0c060" opacity=".6" />
        <path d="M10 12 Q8 8 10 6 Q12 8 10 12" fill="#ffe080" opacity=".8" />
        {/* Sparks */}
        <circle cx="6" cy="6" r="1" fill="#f0c060" opacity=".5" />
        <circle cx="14" cy="4" r="0.8" fill="#ffd700" opacity=".5" />
        <circle cx="4" cy="10" r="0.6" fill="#f0a040" opacity=".4" />
      </g>

      {/* ── Small decorative flowers scattered ── */}
      {[[35, 130], [205, 125], [40, 80], [200, 85]].map(([x, y], i) => (
        <g key={`df${i}`} opacity=".3">
          <circle cx={x} cy={y} r="4" fill="#e8a090" />
          <circle cx={x} cy={y} r="2" fill="#e07060" />
          <circle cx={x} cy={y} r="0.8" fill="#ffd" />
        </g>
      ))}

      {/* ── Lotus base ── */}
      <g transform="translate(120, 188)" opacity=".5">
        {[-20, -12, -4, 4, 12, 20].map((dx, i) => (
          <ellipse key={`lp${i}`} cx={dx} cy={0} rx="6" ry="10" fill="#e8a090" opacity={.2 + Math.abs(3 - i) * .05}
            transform={`rotate(${(i - 2.5) * 15} ${dx} 0)`} />
        ))}
        <ellipse cx="0" cy="2" rx="4" ry="3" fill="#c9a84c" opacity=".4" />
      </g>
    </svg>
  );
}

/* ── Leaf Ornament Divider (enhanced with flowers) ── */
function LeafDivider() {
  return (
    <svg viewBox="0 0 200 24" className="wed-leaf-divider-svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <line x1="16" y1="12" x2="78" y2="12" className="wed-svg-orn-stem" strokeWidth="0.8" />
      <line x1="122" y1="12" x2="184" y2="12" className="wed-svg-orn-stem" strokeWidth="0.8" />
      {/* Center flower */}
      <circle cx="100" cy="12" r="5" fill="#e8a090" opacity=".5" />
      <circle cx="100" cy="12" r="3" fill="#d07060" opacity=".6" />
      <circle cx="100" cy="12" r="1.2" fill="#ffd" opacity=".5" />
      {/* Left leaves with veins */}
      {[30, 48, 66].map((x, i) => (
        <g key={`ll${i}`}>
          <ellipse cx={x} cy={i % 2 ? 6 : 18} rx="11" ry="4.5"
            transform={`rotate(${i % 2 ? -30 : 30} ${x} ${i % 2 ? 6 : 18})`}
            className="wed-svg-orn-leaf" opacity={.35 + i * .1} />
          {/* Leaf vein */}
          <line x1={x - 5} y1={i % 2 ? 6 : 18} x2={x + 5} y2={i % 2 ? 6 : 18}
            stroke="#fff" strokeWidth="0.3" opacity=".3"
            transform={`rotate(${i % 2 ? -30 : 30} ${x} ${i % 2 ? 6 : 18})`} />
        </g>
      ))}
      {/* Right leaves with veins */}
      {[134, 152, 170].map((x, i) => (
        <g key={`rl${i}`}>
          <ellipse cx={x} cy={i % 2 ? 6 : 18} rx="11" ry="4.5"
            transform={`rotate(${i % 2 ? 30 : -30} ${x} ${i % 2 ? 6 : 18})`}
            className="wed-svg-orn-leaf" opacity={.35 + i * .1} />
          <line x1={x - 5} y1={i % 2 ? 6 : 18} x2={x + 5} y2={i % 2 ? 6 : 18}
            stroke="#fff" strokeWidth="0.3" opacity=".3"
            transform={`rotate(${i % 2 ? 30 : -30} ${x} ${i % 2 ? 6 : 18})`} />
        </g>
      ))}
      {/* Tiny buds */}
      <circle cx="82" cy="10" r="2" fill="#e8a090" opacity=".35" />
      <circle cx="118" cy="10" r="2" fill="#e8a090" opacity=".35" />
    </svg>
  );
}

/* ── Bottom floral ornament border (enhanced with roses & marigolds) ── */
function BottomOrnament() {
  return (
    <svg viewBox="0 0 500 65" className="wed-bottom-ornament-svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {/* Center rose */}
      <circle cx="250" cy="18" r="10" fill="#e8a090" opacity=".4" />
      <circle cx="250" cy="18" r="7" fill="#d07060" opacity=".5" />
      <circle cx="250" cy="18" r="4" fill="#c05050" opacity=".6" />
      <circle cx="250" cy="18" r="1.5" fill="#ffd" opacity=".5" />
      {/* Center rose leaves */}
      <ellipse cx="238" cy="22" rx="8" ry="3" transform="rotate(-20 238 22)" className="wed-svg-orn-leaf" opacity=".5" />
      <ellipse cx="262" cy="22" rx="8" ry="3" transform="rotate(20 262 22)" className="wed-svg-orn-leaf" opacity=".5" />
      {/* Left vine */}
      <path d="M240 20 Q200 12 160 22 Q120 30 80 24 Q50 20 20 26" fill="none" className="wed-svg-orn-stem" strokeWidth="1.5" />
      {[200, 170, 140, 110, 80, 55].map((x, i) => (
        <g key={`lb${i}`}>
          <ellipse cx={x} cy={i % 2 ? 14 : 30} rx="12" ry="5" transform={`rotate(${i % 2 ? -25 : 25} ${x} ${i % 2 ? 14 : 30})`} className="wed-svg-orn-leaf" opacity={.45 + i * .04} />
          <ellipse cx={x - 8} cy={i % 2 ? 18 : 26} rx="10" ry="4" transform={`rotate(${i % 2 ? -40 : 40} ${x - 8} ${i % 2 ? 18 : 26})`} className="wed-svg-orn-leaf" opacity={.35 + i * .03} />
          {/* Small flowers along vine */}
          {i % 2 === 0 && (
            <g>
              <circle cx={x + 4} cy={i % 2 ? 10 : 34} r="4" fill="#e8a090" opacity=".3" />
              <circle cx={x + 4} cy={i % 2 ? 10 : 34} r="2" fill="#d07060" opacity=".35" />
            </g>
          )}
        </g>
      ))}
      {/* Right vine */}
      <path d="M260 20 Q300 12 340 22 Q380 30 420 24 Q450 20 480 26" fill="none" className="wed-svg-orn-stem" strokeWidth="1.5" />
      {[300, 330, 360, 390, 420, 445].map((x, i) => (
        <g key={`rb${i}`}>
          <ellipse cx={x} cy={i % 2 ? 14 : 30} rx="12" ry="5" transform={`rotate(${i % 2 ? 25 : -25} ${x} ${i % 2 ? 14 : 30})`} className="wed-svg-orn-leaf" opacity={.45 + i * .04} />
          <ellipse cx={x + 8} cy={i % 2 ? 18 : 26} rx="10" ry="4" transform={`rotate(${i % 2 ? 40 : -40} ${x + 8} ${i % 2 ? 18 : 26})`} className="wed-svg-orn-leaf" opacity={.35 + i * .03} />
          {i % 2 === 0 && (
            <g>
              <circle cx={x - 4} cy={i % 2 ? 10 : 34} r="4" fill="#e8a090" opacity=".3" />
              <circle cx={x - 4} cy={i % 2 ? 10 : 34} r="2" fill="#d07060" opacity=".35" />
            </g>
          )}
        </g>
      ))}
      {/* Hanging marigold beads at the very bottom */}
      <g opacity=".25">
        {[60, 120, 180, 250, 320, 380, 440].map((x, i) => (
          <g key={`mg${i}`}>
            <circle cx={x} cy={48} r="3" fill="#e8a040" />
            <circle cx={x} cy={56} r="2.5" fill="#f0c060" />
            <circle cx={x} cy={62} r="2" fill="#e8a040" />
          </g>
        ))}
      </g>
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
