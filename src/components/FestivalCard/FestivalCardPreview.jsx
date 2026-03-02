/* ══════════════════════════════════════════════════════════════
   Festival Card Preview — Unique themed design per festival
   ══════════════════════════════════════════════════════════════ */

/* ── Holi Template Configs (6 templates) ── */
const HOLI_TEMPLATES = {
  1: {
    gradient: 'linear-gradient(135deg, #ff6f91 0%, #ff9671 30%, #ffc75f 60%, #d65db1 100%)',
    image: '/holi-radha-krishna.png',
    layout: 'classic',       // center image between heading & subtext
    borderColor: '#ff6f91',
    frameColor: 'rgba(255,111,145,0.25)',
  },
  2: {
    gradient: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 40%, #fd79a8 100%)',
    image: '/holi-radha-krishna1.png',
    layout: 'banner-top',    // full-width image at top, text below
    borderColor: '#6c5ce7',
    frameColor: 'rgba(108,92,231,0.25)',
  },
  3: {
    gradient: 'linear-gradient(135deg, #ffc75f 0%, #ff9671 40%, #ff6f91 100%)',
    image: '/holi-radha-krishna2.png',
    layout: 'side-accent',   // circular image floated to side with text wrap
    borderColor: '#ff9671',
    frameColor: 'rgba(255,150,113,0.25)',
  },
  4: {
    gradient: 'linear-gradient(135deg, #00b894 0%, #55efc4 40%, #ffeaa7 100%)',
    image: '/holi-radha-krishna3.png',
    layout: 'hero',          // large background hero image with overlay text
    borderColor: '#00b894',
    frameColor: 'rgba(0,184,148,0.25)',
  },
  5: {
    gradient: 'linear-gradient(135deg, #fd79a8 0%, #e84393 40%, #a29bfe 100%)',
    image: '/holi-radha-krishna4.png',
    layout: 'split',         // left image, right text (vertical on mobile)
    borderColor: '#e84393',
    frameColor: 'rgba(232,67,147,0.25)',
  },
  6: {
    gradient: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 40%, #6c5ce7 100%)',
    image: '/holi-radha-krishna5.png',
    layout: 'framed',        // image in ornate frame at bottom
    borderColor: '#0984e3',
    frameColor: 'rgba(9,132,227,0.25)',
  },
};

/* ── Theme configs ── */
const THEME = {
  holi: {
    gradient: 'linear-gradient(135deg, #ff6f91 0%, #ff9671 30%, #ffc75f 60%, #d65db1 100%)',
    heading: 'Happy Holi!',
    subtext: 'May your life be filled with colors of joy & love',
    emoji: '🌈',
    borderColor: '#ff6f91',
  },
  diwali: {
    gradient: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b69 40%, #ff8c00 100%)',
    heading: 'शुभ दीपावली',
    subtext: 'May the festival of lights illuminate your life with joy & prosperity',
    emoji: '🪔',
    borderColor: '#ffd700',
    dark: true,
  },
  lohri: {
    gradient: 'linear-gradient(135deg, #ff6b35 0%, #f7c948 50%, #d63031 100%)',
    heading: 'Happy Lohri!',
    subtext: 'May the warmth of bonfire fill your life with happiness',
    emoji: '🔥',
    borderColor: '#ff6b35',
  },
  navratri: {
    gradient: 'linear-gradient(135deg, #e74c3c 0%, #f39c12 30%, #27ae60 60%, #2980b9 100%)',
    heading: 'शुभ नवरात्रि',
    subtext: 'May Maa Durga bless you with strength and happiness',
    emoji: '✨',
    borderColor: '#e74c3c',
  },
  eid: {
    gradient: 'linear-gradient(135deg, #0a3d62 0%, #1e6f5c 50%, #289672 100%)',
    heading: 'Eid Mubarak!',
    subtext: 'May this blessed occasion bring peace, happiness and prosperity',
    emoji: '🌙',
    borderColor: '#ffd700',
    dark: true,
  },
  christmas: {
    gradient: 'linear-gradient(135deg, #1a472a 0%, #2d6a4f 40%, #c0392b 100%)',
    heading: 'Merry Christmas!',
    subtext: 'Wishing you joy, peace and love this holiday season',
    emoji: '🎄',
    borderColor: '#c0392b',
    dark: true,
  },
  rakhi: {
    gradient: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 40%, #e91e63 100%)',
    heading: 'Happy Raksha Bandhan!',
    subtext: 'Celebrating the beautiful bond of love between siblings',
    emoji: '🎎',
    borderColor: '#e91e63',
  },
  mothersday: {
    gradient: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 40%, #ec407a 100%)',
    heading: "Happy Mother's Day!",
    subtext: 'To the most wonderful woman — thank you for everything',
    emoji: '💐',
    borderColor: '#ec407a',
  },
  fathersday: {
    gradient: 'linear-gradient(135deg, #1a237e 0%, #283593 40%, #42a5f5 100%)',
    heading: "Happy Father's Day!",
    subtext: "Dad, you're my hero — today and every day",
    emoji: '👔',
    borderColor: '#42a5f5',
    dark: true,
  },
  newyear: {
    gradient: 'linear-gradient(135deg, #0d1b2a 0%, #1b2838 40%, #ffd700 100%)',
    heading: 'Happy New Year!',
    subtext: 'Wishing you a year filled with new hopes, joy & new beginnings',
    emoji: '🎉',
    borderColor: '#ffd700',
    dark: true,
  },
};

/* ── SVG Decorations per festival ── */
function HoliDecor() {
  return (
    <svg viewBox="0 0 300 120" className="fest-decor-svg" aria-hidden="true">
      {/* Color splashes */}
      <circle cx="40" cy="30" r="25" fill="#ff6f91" opacity=".6" />
      <circle cx="80" cy="60" r="20" fill="#ffc75f" opacity=".5" />
      <circle cx="150" cy="25" r="30" fill="#a29bfe" opacity=".5" />
      <circle cx="220" cy="50" r="22" fill="#55efc4" opacity=".5" />
      <circle cx="260" cy="20" r="18" fill="#fd79a8" opacity=".6" />
      <circle cx="120" cy="80" r="15" fill="#74b9ff" opacity=".5" />
      <circle cx="200" cy="90" r="12" fill="#e17055" opacity=".5" />
      {/* Gulaal puffs */}
      <circle cx="60" cy="90" r="8" fill="#ff6b6b" opacity=".3" />
      <circle cx="180" cy="40" r="10" fill="#fdcb6e" opacity=".3" />
      {/* Pichkari */}
      <rect x="240" y="75" width="40" height="8" rx="4" fill="#6c5ce7" opacity=".7" />
      <rect x="275" y="70" width="6" height="18" rx="3" fill="#6c5ce7" opacity=".7" />
    </svg>
  );
}

function DiwaliDecor() {
  return (
    <svg viewBox="0 0 300 120" className="fest-decor-svg" aria-hidden="true">
      {/* Diyas */}
      {[40, 100, 160, 220, 270].map((x, i) => (
        <g key={i}>
          <ellipse cx={x} cy={90} rx="16" ry="8" fill="#d4a017" opacity=".8" />
          <ellipse cx={x} cy={85} rx="10" ry="5" fill="#f39c12" opacity=".6" />
          {/* Flame */}
          <ellipse cx={x} cy={72} rx="4" ry="8" fill="#ff6b35" opacity=".9" />
          <ellipse cx={x} cy={70} rx="2" ry="5" fill="#ffd700" opacity=".8" />
        </g>
      ))}
      {/* Stars */}
      {[60, 130, 200, 250].map((x, i) => (
        <circle key={`s${i}`} cx={x} cy={20 + i * 8} r={2 + i} fill="#ffd700" opacity={0.4 + i * 0.1} />
      ))}
      {/* Rangoli dots */}
      {[80, 150, 240].map((x, i) => (
        <g key={`r${i}`}>
          <circle cx={x} cy={50} r="3" fill="#e74c3c" opacity=".5" />
          <circle cx={x - 6} cy={56} r="2" fill="#f1c40f" opacity=".5" />
          <circle cx={x + 6} cy={56} r="2" fill="#2ecc71" opacity=".5" />
        </g>
      ))}
    </svg>
  );
}

function LohriDecor() {
  return (
    <svg viewBox="0 0 300 120" className="fest-decor-svg" aria-hidden="true">
      {/* Bonfire */}
      <polygon points="110,100 150,30 190,100" fill="#ff6b35" opacity=".7" />
      <polygon points="120,100 150,45 180,100" fill="#f7c948" opacity=".6" />
      <polygon points="130,100 150,55 170,100" fill="#ffd700" opacity=".5" />
      {/* Logs */}
      <rect x="100" y="98" width="100" height="10" rx="5" fill="#8B4513" opacity=".7" />
      <rect x="115" y="105" width="70" height="8" rx="4" fill="#6B3410" opacity=".6" />
      {/* Sparks */}
      {[120, 140, 150, 160, 175].map((x, i) => (
        <circle key={i} cx={x} cy={15 + i * 5} r={1.5} fill="#ffd700" opacity={0.5 + i * 0.1} />
      ))}
      {/* Peanuts & popcorn */}
      <ellipse cx="50" cy="80" rx="6" ry="4" fill="#d4a76a" opacity=".6" transform="rotate(-20 50 80)" />
      <ellipse cx="250" cy="70" rx="5" ry="3" fill="#d4a76a" opacity=".6" transform="rotate(15 250 70)" />
      <circle cx="60" cy="50" r="4" fill="#fff" opacity=".5" />
      <circle cx="240" cy="45" r="3" fill="#fff" opacity=".5" />
    </svg>
  );
}

function NavratriDecor() {
  return (
    <svg viewBox="0 0 300 120" className="fest-decor-svg" aria-hidden="true">
      {/* Dandiya sticks */}
      <line x1="30" y1="100" x2="80" y2="20" stroke="#e74c3c" strokeWidth="4" strokeLinecap="round" />
      <line x1="80" y1="100" x2="30" y2="20" stroke="#f39c12" strokeWidth="4" strokeLinecap="round" />
      <line x1="220" y1="100" x2="270" y2="20" stroke="#27ae60" strokeWidth="4" strokeLinecap="round" />
      <line x1="270" y1="100" x2="220" y2="20" stroke="#e74c3c" strokeWidth="4" strokeLinecap="round" />
      {/* Garba dancer silhouette hint */}
      <circle cx="150" cy="40" r="12" fill="#e74c3c" opacity=".3" />
      <path d="M140 55 Q150 80 160 55" fill="#f39c12" opacity=".3" />
      <path d="M135 55 L150 90 L165 55" fill="#27ae60" opacity=".2" />
      {/* Bells */}
      {[100, 200].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={25} r="8" fill="#ffd700" opacity=".5" />
          <circle cx={x} cy={35} r="2" fill="#ffd700" opacity=".7" />
        </g>
      ))}
    </svg>
  );
}

function EidDecor() {
  return (
    <svg viewBox="0 0 300 120" className="fest-decor-svg" aria-hidden="true">
      {/* Crescent moon */}
      <circle cx="150" cy="40" r="25" fill="#ffd700" opacity=".7" />
      <circle cx="160" cy="35" r="22" fill="#0a3d62" />
      {/* Stars */}
      {[[80, 20], [120, 55], [200, 30], [240, 60], [60, 70], [270, 45]].map(([x, y], i) => (
        <polygon key={i} points={`${x},${y - 5} ${x + 2},${y - 1} ${x + 5},${y - 1} ${x + 2.5},${y + 2} ${x + 3.5},${y + 6} ${x},${y + 3} ${x - 3.5},${y + 6} ${x - 2.5},${y + 2} ${x - 5},${y - 1} ${x - 2},${y - 1}`}
          fill="#ffd700" opacity={0.4 + i * 0.08} />
      ))}
      {/* Lanterns */}
      {[40, 260].map((x, i) => (
        <g key={i}>
          <rect x={x - 6} y={60} width="12" height="20" rx="3" fill="#ffd700" opacity=".4" />
          <line x1={x} y1={55} x2={x} y2={60} stroke="#ffd700" strokeWidth="1" opacity=".5" />
          <circle cx={x} cy={70} r="2" fill="#fff" opacity=".5" />
        </g>
      ))}
      {/* Mosque dome silhouette */}
      <path d="M110 110 Q110 85 130 80 Q150 75 170 80 Q190 85 190 110" fill="#1e6f5c" opacity=".3" />
      <rect x="105" y="108" width="90" height="5" rx="2" fill="#1e6f5c" opacity=".2" />
    </svg>
  );
}

function ChristmasDecor() {
  return (
    <svg viewBox="0 0 300 120" className="fest-decor-svg" aria-hidden="true">
      {/* Christmas tree */}
      <polygon points="150,10 120,50 130,50 100,85 110,85 85,110 215,110 190,85 200,85 170,50 180,50" fill="#2d6a4f" opacity=".7" />
      <rect x="140" y="110" width="20" height="10" rx="2" fill="#8B4513" opacity=".7" />
      {/* Star on top */}
      <polygon points="150,5 152,12 160,12 154,17 156,24 150,20 144,24 146,17 140,12 148,12" fill="#ffd700" opacity=".9" />
      {/* Ornaments */}
      {[[130, 55], [165, 60], [115, 80], [180, 85], [145, 95], [160, 75]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill={['#e74c3c', '#3498db', '#f1c40f', '#e74c3c', '#2ecc71', '#f1c40f'][i]} opacity=".8" />
      ))}
      {/* Snowflakes */}
      {[[30, 25], [70, 50], [240, 30], [270, 65], [50, 90]].map(([x, y], i) => (
        <g key={`sf${i}`} opacity={0.3 + i * 0.1}>
          <line x1={x - 5} y1={y} x2={x + 5} y2={y} stroke="#fff" strokeWidth="1" />
          <line x1={x} y1={y - 5} x2={x} y2={y + 5} stroke="#fff" strokeWidth="1" />
          <line x1={x - 3} y1={y - 3} x2={x + 3} y2={y + 3} stroke="#fff" strokeWidth="0.8" />
          <line x1={x + 3} y1={y - 3} x2={x - 3} y2={y + 3} stroke="#fff" strokeWidth="0.8" />
        </g>
      ))}
    </svg>
  );
}

function RakhiDecor() {
  return (
    <svg viewBox="0 0 300 120" className="fest-decor-svg" aria-hidden="true">
      {/* Rakhi thread */}
      <path d="M20 60 Q80 30 150 60 Q220 90 280 60" stroke="#e91e63" strokeWidth="3" fill="none" opacity=".6" />
      <path d="M20 60 Q80 30 150 60 Q220 90 280 60" stroke="#ffd700" strokeWidth="1.5" fill="none" opacity=".3" strokeDasharray="4 4" />
      {/* Central rakhi */}
      <circle cx="150" cy="60" r="18" fill="#e91e63" opacity=".3" />
      <circle cx="150" cy="60" r="12" fill="#ffd700" opacity=".5" />
      <circle cx="150" cy="60" r="7" fill="#e91e63" opacity=".6" />
      <circle cx="150" cy="60" r="3" fill="#ffd700" opacity=".8" />
      {/* Petals */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = deg * Math.PI / 180;
        const x = 150 + 15 * Math.cos(rad);
        const y = 60 + 15 * Math.sin(rad);
        return <circle key={i} cx={x} cy={y} r="3" fill={i % 2 ? '#ffd700' : '#e91e63'} opacity=".4" />;
      })}
      {/* Small decorative dots on thread */}
      {[60, 100, 200, 240].map((x, i) => (
        <circle key={`d${i}`} cx={x} cy={60 - 10 * Math.sin(x / 30)} r="3" fill="#ffd700" opacity=".5" />
      ))}
    </svg>
  );
}

function MothersDayDecor() {
  return (
    <svg viewBox="0 0 300 120" className="fest-decor-svg" aria-hidden="true">
      {/* Large flower/rose */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = deg * Math.PI / 180;
        const x = 150 + 20 * Math.cos(rad);
        const y = 50 + 20 * Math.sin(rad);
        return <ellipse key={i} cx={x} cy={y} rx="12" ry="8" fill="#ec407a" opacity=".35" transform={`rotate(${deg} ${x} ${y})`} />;
      })}
      <circle cx="150" cy="50" r="10" fill="#ec407a" opacity=".5" />
      <circle cx="150" cy="50" r="5" fill="#ffd700" opacity=".6" />
      {/* Leaves */}
      <ellipse cx="115" cy="70" rx="15" ry="7" fill="#4caf50" opacity=".3" transform="rotate(-30 115 70)" />
      <ellipse cx="185" cy="70" rx="15" ry="7" fill="#4caf50" opacity=".3" transform="rotate(30 185 70)" />
      {/* Small flowers */}
      {[[50, 40], [250, 35], [70, 90], [230, 85]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="6" fill="#f8bbd0" opacity=".4" />
          <circle cx={x} cy={y} r="3" fill="#ec407a" opacity=".4" />
        </g>
      ))}
      {/* Hearts */}
      {[[40, 60], [260, 55]].map(([x, y], i) => (
        <path key={`h${i}`} d={`M${x} ${y} Q${x} ${y - 4} ${x - 4} ${y - 4} Q${x - 8} ${y - 4} ${x - 8} ${y} Q${x - 8} ${y + 4} ${x} ${y + 8} Q${x + 8} ${y + 4} ${x + 8} ${y} Q${x + 8} ${y - 4} ${x + 4} ${y - 4} Q${x} ${y - 4} ${x} ${y}Z`}
          fill="#ec407a" opacity=".3" />
      ))}
    </svg>
  );
}

function FathersDayDecor() {
  return (
    <svg viewBox="0 0 300 120" className="fest-decor-svg" aria-hidden="true">
      {/* Tie */}
      <polygon points="145,15 155,15 158,35 152,55 148,55 142,35" fill="#42a5f5" opacity=".6" />
      <rect x="143" y="10" width="14" height="8" rx="2" fill="#42a5f5" opacity=".7" />
      {/* Mustache */}
      <path d="M100 75 Q115 60 130 75 Q145 85 150 75 Q155 85 170 75 Q185 60 200 75" stroke="#333" strokeWidth="3" fill="none" opacity=".3" />
      {/* Trophy */}
      <rect x="50" y="60" width="30" height="25" rx="3" fill="#ffd700" opacity=".4" />
      <rect x="57" y="85" width="16" height="5" rx="2" fill="#ffd700" opacity=".3" />
      <rect x="52" y="90" width="26" height="4" rx="2" fill="#ffd700" opacity=".3" />
      <path d="M50 65 Q40 70 42 80 Q48 75 50 72" fill="#ffd700" opacity=".3" />
      <path d="M80 65 Q90 70 88 80 Q82 75 80 72" fill="#ffd700" opacity=".3" />
      {/* Stars */}
      {[[230, 30], [260, 70], [240, 100]].map(([x, y], i) => (
        <polygon key={i} points={`${x},${y - 5} ${x + 2},${y - 1} ${x + 5},${y - 1} ${x + 2.5},${y + 2} ${x + 3.5},${y + 6} ${x},${y + 3} ${x - 3.5},${y + 6} ${x - 2.5},${y + 2} ${x - 5},${y - 1} ${x - 2},${y - 1}`}
          fill="#ffd700" opacity={0.4 + i * 0.1} />
      ))}
    </svg>
  );
}

function NewYearDecor() {
  return (
    <svg viewBox="0 0 300 120" className="fest-decor-svg" aria-hidden="true">
      {/* Fireworks burst 1 */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
        const rad = deg * Math.PI / 180;
        const x1 = 80 + 10 * Math.cos(rad);
        const y1 = 40 + 10 * Math.sin(rad);
        const x2 = 80 + 25 * Math.cos(rad);
        const y2 = 40 + 25 * Math.sin(rad);
        return <line key={`f1${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={['#ff6b6b', '#ffd700', '#74b9ff', '#55efc4'][i % 4]} strokeWidth="1.5" opacity=".6" />;
      })}
      {/* Fireworks burst 2 */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = deg * Math.PI / 180;
        const x1 = 220 + 8 * Math.cos(rad);
        const y1 = 35 + 8 * Math.sin(rad);
        const x2 = 220 + 22 * Math.cos(rad);
        const y2 = 35 + 22 * Math.sin(rad);
        return <line key={`f2${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={['#ffd700', '#ff6b6b', '#a29bfe', '#fdcb6e'][i % 4]} strokeWidth="1.5" opacity=".6" />;
      })}
      {/* Champagne glasses */}
      <polygon points="130,110 140,70 145,70 135,110" fill="#ffd700" opacity=".3" />
      <polygon points="170,110 160,70 155,70 165,110" fill="#ffd700" opacity=".3" />
      <ellipse cx="142" cy="68" rx="10" ry="6" fill="#ffd700" opacity=".2" />
      <ellipse cx="158" cy="68" rx="10" ry="6" fill="#ffd700" opacity=".2" />
      {/* Sparkle dots */}
      {[[50, 80], [110, 20], [190, 25], [260, 80], [150, 10]].map(([x, y], i) => (
        <circle key={`sp${i}`} cx={x} cy={y} r={1.5 + i * 0.3} fill="#ffd700" opacity={0.4 + i * 0.1} />
      ))}
    </svg>
  );
}

const DECOR_MAP = {
  holi: HoliDecor,
  diwali: DiwaliDecor,
  lohri: LohriDecor,
  navratri: NavratriDecor,
  eid: EidDecor,
  christmas: ChristmasDecor,
  rakhi: RakhiDecor,
  mothersday: MothersDayDecor,
  fathersday: FathersDayDecor,
  newyear: NewYearDecor,
};

/* ── Main Preview ── */
export default function FestivalCardPreview({ data, lang = 'en', bgColor }) {
  const { festival, senderName, recipientName, customGreeting, message, photoPreview } = data;
  const theme = THEME[festival] || THEME.holi;
  const DecorComponent = DECOR_MAP[festival] || HoliDecor;
  const isDark = theme.dark;

  /* Holi uses template-based layouts */
  if (festival === 'holi') {
    const tplId = data.selectedTemplate || 1;
    const tpl = HOLI_TEMPLATES[tplId] || HOLI_TEMPLATES[1];
    return (
      <HoliTemplateCard
        tpl={tpl}
        tplId={tplId}
        theme={theme}
        data={data}
        bgColor={bgColor}
        DecorComponent={DecorComponent}
      />
    );
  }

  const cardStyle = {
    background: bgColor || theme.gradient,
    color: isDark ? '#fff' : '#333',
  };

  return (
    <div className={`fest-card fest-card--${festival} ${isDark ? 'fest-card--dark' : ''}`} style={cardStyle}>

      {/* Inner border */}
      <div className="fest-inner-frame" style={{ borderColor: theme.borderColor + '44' }} />

      {/* Top decoration */}
      <div className="fest-decor-top">
        <DecorComponent />
      </div>

      {/* Main emoji */}
      <div className="fest-main-emoji">{theme.emoji}</div>

      {/* Heading */}
      <h1 className="fest-heading">{customGreeting || theme.heading}</h1>

      {/* Subtext */}
      <p className="fest-subtext">{theme.subtext}</p>

      {/* Recipient */}
      {recipientName && (
        <div className="fest-recipient">
          Dear <span className="fest-recipient-name">{recipientName}</span>,
        </div>
      )}

      {/* Message */}
      {message && <p className="fest-message">{message}</p>}

      {/* Photo */}
      {photoPreview && (
        <div className="fest-photo-wrap">
          <img src={photoPreview} alt="Festival greeting card design - Diwali Holi Eid Christmas card maker" className="fest-photo" loading="lazy" />
        </div>
      )}

      {/* Sender */}
      {senderName && (
        <div className="fest-sender">
          <span className="fest-from-label">With love,</span>
          <span className="fest-sender-name">{senderName}</span>
        </div>
      )}

      {/* Bottom decoration (mirrored) */}
      <div className="fest-decor-bottom">
        <DecorComponent />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Holi Template Card — 6 unique layouts
   ══════════════════════════════════════════════════════════════ */
function HoliTemplateCard({ tpl, tplId, theme, data, bgColor, DecorComponent }) {
  const { senderName, recipientName, customGreeting, message, photoPreview } = data;
  const heading = customGreeting || theme.heading;
  const subtext = theme.subtext;

  const baseStyle = {
    background: bgColor || tpl.gradient,
    color: '#333',
  };

  /* ── Template 1: Classic (center image between heading & subtext) ── */
  if (tplId === 1) {
    return (
      <div className="fest-card fest-card--holi holi-tpl holi-tpl--1" style={baseStyle}>
        <div className="fest-inner-frame" style={{ borderColor: tpl.frameColor }} />
        <div className="fest-decor-top"><DecorComponent /></div>
        <div className="fest-main-emoji">🌈</div>
        <h1 className="fest-heading">{heading}</h1>
        <div className="holi-tpl1-img-wrap">
          <img src={tpl.image} alt="Radha Krishna playing Holi" className="holi-tpl1-img" />
        </div>
        <p className="fest-subtext">{subtext}</p>
        {recipientName && <div className="fest-recipient">Dear <span className="fest-recipient-name">{recipientName}</span>,</div>}
        {message && <p className="fest-message">{message}</p>}
        {photoPreview && <div className="fest-photo-wrap"><img src={photoPreview} alt="Photo" className="fest-photo" loading="lazy" /></div>}
        {senderName && <div className="fest-sender"><span className="fest-from-label">With love,</span><span className="fest-sender-name">{senderName}</span></div>}
        <div className="fest-decor-bottom"><DecorComponent /></div>
      </div>
    );
  }

  /* ── Template 2: Banner Top (full-width image at top) ── */
  if (tplId === 2) {
    return (
      <div className="fest-card fest-card--holi holi-tpl holi-tpl--2" style={baseStyle}>
        <div className="fest-inner-frame" style={{ borderColor: tpl.frameColor }} />
        <div className="holi-tpl2-banner">
          <img src={tpl.image} alt="Radha Krishna Holi" className="holi-tpl2-banner-img" />
          <div className="holi-tpl2-banner-overlay">
            <div className="fest-main-emoji">🌈</div>
            <h1 className="fest-heading" style={{ color: '#fff', textShadow: '0 2px 12px rgba(0,0,0,.5)' }}>{heading}</h1>
          </div>
        </div>
        <div className="holi-tpl2-body">
          <p className="fest-subtext">{subtext}</p>
          {recipientName && <div className="fest-recipient">Dear <span className="fest-recipient-name">{recipientName}</span>,</div>}
          {message && <p className="fest-message">{message}</p>}
          {photoPreview && <div className="fest-photo-wrap"><img src={photoPreview} alt="Photo" className="fest-photo" loading="lazy" /></div>}
          {senderName && <div className="fest-sender"><span className="fest-from-label">With love,</span><span className="fest-sender-name">{senderName}</span></div>}
        </div>
        <div className="fest-decor-bottom"><DecorComponent /></div>
      </div>
    );
  }

  /* ── Template 3: Side Accent (circular image with text beside it) ── */
  if (tplId === 3) {
    return (
      <div className="fest-card fest-card--holi holi-tpl holi-tpl--3" style={baseStyle}>
        <div className="fest-inner-frame" style={{ borderColor: tpl.frameColor }} />
        <div className="fest-decor-top"><DecorComponent /></div>
        <div className="fest-main-emoji">🌈</div>
        <h1 className="fest-heading">{heading}</h1>
        <div className="holi-tpl3-row">
          <div className="holi-tpl3-img-wrap">
            <img src={tpl.image} alt="Radha Krishna Holi" className="holi-tpl3-img" />
          </div>
          <div className="holi-tpl3-text">
            <p className="fest-subtext" style={{ margin: 0 }}>{subtext}</p>
            {recipientName && <div className="fest-recipient" style={{ marginTop: 8 }}>Dear <span className="fest-recipient-name">{recipientName}</span>,</div>}
          </div>
        </div>
        {message && <p className="fest-message">{message}</p>}
        {photoPreview && <div className="fest-photo-wrap"><img src={photoPreview} alt="Photo" className="fest-photo" loading="lazy" /></div>}
        {senderName && <div className="fest-sender"><span className="fest-from-label">With love,</span><span className="fest-sender-name">{senderName}</span></div>}
        <div className="fest-decor-bottom"><DecorComponent /></div>
      </div>
    );
  }

  /* ── Template 4: Hero (large bg image with overlay) ── */
  if (tplId === 4) {
    return (
      <div className="fest-card fest-card--holi holi-tpl holi-tpl--4" style={{ ...baseStyle, padding: 0, overflow: 'hidden' }}>
        <div className="holi-tpl4-hero" style={{ backgroundImage: `url(${tpl.image})` }}>
          <div className="holi-tpl4-overlay">
            <div className="fest-main-emoji" style={{ fontSize: '3.5rem' }}>🌈</div>
            <h1 className="fest-heading" style={{ color: '#fff', textShadow: '0 3px 16px rgba(0,0,0,.6)', fontSize: '1.85rem' }}>{heading}</h1>
            <p className="fest-subtext" style={{ color: 'rgba(255,255,255,.9)' }}>{subtext}</p>
          </div>
        </div>
        <div className="holi-tpl4-content">
          {recipientName && <div className="fest-recipient">Dear <span className="fest-recipient-name">{recipientName}</span>,</div>}
          {message && <p className="fest-message">{message}</p>}
          {photoPreview && <div className="fest-photo-wrap"><img src={photoPreview} alt="Photo" className="fest-photo" loading="lazy" /></div>}
          {senderName && <div className="fest-sender"><span className="fest-from-label">With love,</span><span className="fest-sender-name">{senderName}</span></div>}
          <div className="fest-decor-bottom"><DecorComponent /></div>
        </div>
      </div>
    );
  }

  /* ── Template 5: Split (image left, text right — stacks on mobile) ── */
  if (tplId === 5) {
    return (
      <div className="fest-card fest-card--holi holi-tpl holi-tpl--5" style={baseStyle}>
        <div className="fest-inner-frame" style={{ borderColor: tpl.frameColor }} />
        <div className="holi-tpl5-split">
          <div className="holi-tpl5-img-side">
            <img src={tpl.image} alt="Radha Krishna Holi" className="holi-tpl5-img" />
          </div>
          <div className="holi-tpl5-text-side">
            <div className="fest-main-emoji">🌈</div>
            <h1 className="fest-heading" style={{ fontSize: '1.35rem' }}>{heading}</h1>
            <p className="fest-subtext">{subtext}</p>
            {recipientName && <div className="fest-recipient">Dear <span className="fest-recipient-name">{recipientName}</span>,</div>}
          </div>
        </div>
        {message && <p className="fest-message">{message}</p>}
        {photoPreview && <div className="fest-photo-wrap"><img src={photoPreview} alt="Photo" className="fest-photo" loading="lazy" /></div>}
        {senderName && <div className="fest-sender"><span className="fest-from-label">With love,</span><span className="fest-sender-name">{senderName}</span></div>}
        <div className="fest-decor-bottom"><DecorComponent /></div>
      </div>
    );
  }

  /* ── Template 6: Framed (ornate frame at bottom with image) ── */
  return (
    <div className="fest-card fest-card--holi holi-tpl holi-tpl--6" style={baseStyle}>
      <div className="fest-inner-frame" style={{ borderColor: tpl.frameColor }} />
      <div className="fest-decor-top"><DecorComponent /></div>
      <div className="fest-main-emoji">🌈</div>
      <h1 className="fest-heading">{heading}</h1>
      <p className="fest-subtext">{subtext}</p>
      {recipientName && <div className="fest-recipient">Dear <span className="fest-recipient-name">{recipientName}</span>,</div>}
      {message && <p className="fest-message">{message}</p>}
      {photoPreview && <div className="fest-photo-wrap"><img src={photoPreview} alt="Photo" className="fest-photo" loading="lazy" /></div>}
      <div className="holi-tpl6-frame">
        <div className="holi-tpl6-frame-inner">
          <img src={tpl.image} alt="Radha Krishna Holi" className="holi-tpl6-img" />
        </div>
      </div>
      {senderName && <div className="fest-sender"><span className="fest-from-label">With love,</span><span className="fest-sender-name">{senderName}</span></div>}
    </div>
  );
}
