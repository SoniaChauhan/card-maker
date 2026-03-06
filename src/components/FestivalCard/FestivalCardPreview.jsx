/* ══════════════════════════════════════════════════════════════
   Festival Card Preview — Unique themed design per festival
   ══════════════════════════════════════════════════════════════ */
import { T } from '../../utils/translations';

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
  dussehra: {
    gradient: 'linear-gradient(135deg, #b71c1c 0%, #e65100 40%, #ff8f00 100%)',
    heading: 'Happy Dussehra!',
    subtext: 'May truth always triumph — Wishing you a victorious Vijaya Dashami',
    emoji: '🏹',
    borderColor: '#ff8f00',
  },
  sankranti: {
    gradient: 'linear-gradient(135deg, #01579b 0%, #f9d423 50%, #ff9800 100%)',
    heading: 'Happy Makar Sankranti!',
    subtext: 'May the sun bring warmth, joy and sweet moments to your life',
    emoji: '🪁',
    borderColor: '#f9d423',
  },
  ganesh: {
    gradient: 'linear-gradient(135deg, #e65100 0%, #ff8f00 40%, #ffd54f 100%)',
    heading: 'गणपति बप्पा मोरया!',
    subtext: 'May Lord Ganesha remove all obstacles and bring wisdom to your life',
    emoji: '🙏',
    borderColor: '#ff8f00',
  },
  janmashtami: {
    gradient: 'linear-gradient(135deg, #1a0533 0%, #4a148c 40%, #7c4dff 100%)',
    heading: 'Happy Janmashtami!',
    subtext: 'May Lord Krishna fill your life with love, joy and divine blessings',
    emoji: '🦚',
    borderColor: '#7c4dff',
    dark: true,
  },
  independenceday: {
    gradient: 'linear-gradient(135deg, #ff9933 0%, #ffffff 50%, #138808 100%)',
    heading: 'Happy Independence Day!',
    subtext: 'Jai Hind! Celebrating the spirit of freedom and unity',
    emoji: '🇮🇳',
    borderColor: '#ff9933',
  },
  republicday: {
    gradient: 'linear-gradient(135deg, #138808 0%, #ffffff 50%, #ff9933 100%)',
    heading: 'Happy Republic Day!',
    subtext: 'Celebrating our Constitution and the spirit of democracy — Jai Hind!',
    emoji: '🇮🇳',
    borderColor: '#138808',
  },
  karwachauth: {
    gradient: 'linear-gradient(135deg, #4a0000 0%, #b71c1c 40%, #ffd700 100%)',
    heading: 'Happy Karwa Chauth!',
    subtext: 'May the moon of Karwa Chauth bless your love with eternal togetherness',
    emoji: '🌕',
    borderColor: '#ffd700',
    dark: true,
  },
  baisakhi: {
    gradient: 'linear-gradient(135deg, #33691e 0%, #9ccc65 40%, #ffd54f 100%)',
    heading: 'Happy Baisakhi!',
    subtext: 'Wishing you a joyful harvest season filled with prosperity and cheer',
    emoji: '🌾',
    borderColor: '#ffd54f',
  },
  chhath: {
    gradient: 'linear-gradient(135deg, #bf360c 0%, #f57c00 40%, #ffd54f 100%)',
    heading: 'Happy Chhath Puja!',
    subtext: 'May the Sun God bless your family with health, wealth and happiness',
    emoji: '🌅',
    borderColor: '#f57c00',
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

/* ── Dussehra ── */
function DussehraDecor() {
  return (
    <svg viewBox="0 0 300 120" className="fest-decor-svg" aria-hidden="true">
      {/* Bow */}
      <path d="M60 95 Q60 30 120 30" stroke="#8B4513" strokeWidth="3" fill="none" opacity=".7" />
      <line x1="60" y1="95" x2="120" y2="30" stroke="#d4a76a" strokeWidth="1" opacity=".5" />
      {/* Arrow */}
      <line x1="90" y1="55" x2="160" y2="55" stroke="#8B4513" strokeWidth="2" opacity=".7" />
      <polygon points="160,50 175,55 160,60" fill="#c0392b" opacity=".8" />
      <polygon points="90,52 82,55 90,58" fill="#f39c12" opacity=".7" />
      {/* Flames / Ravana burning */}
      {[200, 220, 240].map((x, i) => (
        <g key={i}>
          <polygon points={`${x - 8},110 ${x},${70 - i * 5} ${x + 8},110`} fill="#e65100" opacity=".5" />
          <polygon points={`${x - 5},110 ${x},${80 - i * 5} ${x + 5},110`} fill="#ff8f00" opacity=".4" />
          <polygon points={`${x - 3},110 ${x},${88 - i * 3} ${x + 3},110`} fill="#ffd54f" opacity=".3" />
        </g>
      ))}
      {/* Victory sparkles */}
      {[[40, 20], [150, 15], [270, 25], [180, 90]].map(([x, y], i) => (
        <circle key={`s${i}`} cx={x} cy={y} r={2} fill="#ffd700" opacity={0.4 + i * 0.1} />
      ))}
    </svg>
  );
}

/* ── Makar Sankranti ── */
function SankrantiDecor() {
  return (
    <svg viewBox="0 0 300 120" className="fest-decor-svg" aria-hidden="true">
      {/* Kites */}
      <g transform="rotate(-15 60 40)">
        <polygon points="60,15 85,40 60,65 35,40" fill="#e74c3c" opacity=".6" />
        <line x1="60" y1="15" x2="60" y2="65" stroke="#fff" strokeWidth="0.8" opacity=".4" />
        <line x1="35" y1="40" x2="85" y2="40" stroke="#fff" strokeWidth="0.8" opacity=".4" />
        <path d="M60 65 Q55 80 50 95 Q60 85 70 95 Q65 80 60 65" fill="#e74c3c" opacity=".4" />
      </g>
      <g transform="rotate(10 220 35)">
        <polygon points="220,10 245,35 220,60 195,35" fill="#2980b9" opacity=".6" />
        <line x1="220" y1="10" x2="220" y2="60" stroke="#fff" strokeWidth="0.8" opacity=".4" />
        <line x1="195" y1="35" x2="245" y2="35" stroke="#fff" strokeWidth="0.8" opacity=".4" />
        <path d="M220 60 Q215 75 210 90 Q220 80 230 90 Q225 75 220 60" fill="#2980b9" opacity=".4" />
      </g>
      {/* Kite strings */}
      <path d="M60 65 Q100 90 150 110" stroke="#333" strokeWidth="0.5" fill="none" opacity=".3" />
      <path d="M220 60 Q200 85 150 110" stroke="#333" strokeWidth="0.5" fill="none" opacity=".3" />
      {/* Sun */}
      <circle cx="150" cy="25" r="12" fill="#f9d423" opacity=".5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = deg * Math.PI / 180;
        return <line key={i} x1={150 + 14 * Math.cos(rad)} y1={25 + 14 * Math.sin(rad)} x2={150 + 20 * Math.cos(rad)} y2={25 + 20 * Math.sin(rad)} stroke="#f9d423" strokeWidth="1.5" opacity=".4" />;
      })}
      {/* Small kite */}
      <polygon points="140,80 150,90 140,100 130,90" fill="#27ae60" opacity=".4" />
    </svg>
  );
}

/* ── Ganesh Chaturthi ── */
function GaneshDecor() {
  return (
    <svg viewBox="0 0 300 120" className="fest-decor-svg" aria-hidden="true">
      {/* Ganesha silhouette (simplified) */}
      <circle cx="150" cy="45" r="22" fill="#f7971e" opacity=".3" />
      <circle cx="150" cy="45" r="16" fill="#ff8f00" opacity=".25" />
      {/* Trunk */}
      <path d="M150 55 Q145 70 140 75 Q138 78 142 78" stroke="#ff8f00" strokeWidth="3" fill="none" opacity=".35" />
      {/* Ears */}
      <ellipse cx="130" cy="42" rx="10" ry="14" fill="#f7971e" opacity=".2" transform="rotate(-10 130 42)" />
      <ellipse cx="170" cy="42" rx="10" ry="14" fill="#f7971e" opacity=".2" transform="rotate(10 170 42)" />
      {/* Modak */}
      {[[50, 85], [250, 80]].map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y + 5} rx="10" ry="6" fill="#f9d423" opacity=".4" />
          <ellipse cx={x} cy={y} rx="8" ry="8" fill="#ffd54f" opacity=".35" />
          <line x1={x} y1={y - 6} x2={x} y2={y + 4} stroke="#f7971e" strokeWidth="0.5" opacity=".3" />
        </g>
      ))}
      {/* Lotus petals */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = deg * Math.PI / 180;
        const cx = 150 + 35 * Math.cos(rad);
        const cy = 45 + 35 * Math.sin(rad);
        return <ellipse key={i} cx={cx} cy={cy} rx="5" ry="3" fill="#ffd54f" opacity=".2" transform={`rotate(${deg} ${cx} ${cy})`} />;
      })}
      {/* Om symbol hint */}
      <text x="80" y="50" fontSize="18" fill="#ff8f00" opacity=".2" fontFamily="serif">ॐ</text>
      <text x="210" y="50" fontSize="18" fill="#ff8f00" opacity=".2" fontFamily="serif">ॐ</text>
      {/* Diyas */}
      {[30, 270].map((x, i) => (
        <g key={`d${i}`}>
          <ellipse cx={x} cy={105} rx="8" ry="4" fill="#d4a017" opacity=".5" />
          <ellipse cx={x} cy={98} rx="3" ry="5" fill="#ff6b35" opacity=".6" />
          <ellipse cx={x} cy={96} rx="1.5" ry="3" fill="#ffd700" opacity=".5" />
        </g>
      ))}
    </svg>
  );
}

/* ── Janmashtami ── */
function JanmashtamiDecor() {
  return (
    <svg viewBox="0 0 300 120" className="fest-decor-svg" aria-hidden="true">
      {/* Peacock feather */}
      <ellipse cx="150" cy="50" rx="12" ry="25" fill="#1b5e20" opacity=".3" />
      <ellipse cx="150" cy="45" rx="8" ry="18" fill="#4caf50" opacity=".25" />
      <ellipse cx="150" cy="42" rx="5" ry="10" fill="#2196f3" opacity=".3" />
      <circle cx="150" cy="40" r="4" fill="#1a237e" opacity=".4" />
      <circle cx="150" cy="40" r="2" fill="#ffd700" opacity=".5" />
      {/* Feather spine */}
      <line x1="150" y1="20" x2="150" y2="90" stroke="#33691e" strokeWidth="1" opacity=".3" />
      {/* Flute */}
      <rect x="90" y="85" width="60" height="6" rx="3" fill="#8d6e63" opacity=".5" />
      {[100, 110, 120, 130, 140].map((x, i) => (
        <circle key={i} cx={x} cy={88} r="1.5" fill="#5d4037" opacity=".5" />
      ))}
      {/* Moon */}
      <circle cx="50" cy="25" r="14" fill="#7c4dff" opacity=".2" />
      <circle cx="55" cy="22" r="12" fill="#1a0533" opacity=".9" />
      {/* Stars */}
      {[[80, 15], [240, 20], [270, 50], [30, 60], [260, 90]].map(([x, y], i) => (
        <circle key={`s${i}`} cx={x} cy={y} r={1.5 + i * 0.3} fill="#ffd700" opacity={0.3 + i * 0.08} />
      ))}
      {/* Matki (pot) */}
      <ellipse cx="240" cy="70" rx="12" ry="8" fill="#8d6e63" opacity=".4" />
      <ellipse cx="240" cy="62" rx="10" ry="5" fill="#a1887f" opacity=".3" />
      <ellipse cx="240" cy="73" rx="14" ry="4" fill="#6d4c41" opacity=".3" />
      {/* Butter drops */}
      <circle cx="235" cy="58" r="2" fill="#fff9c4" opacity=".4" />
      <circle cx="245" cy="56" r="1.5" fill="#fff9c4" opacity=".3" />
    </svg>
  );
}

/* ── Independence Day ── */
function IndependenceDayDecor() {
  return (
    <svg viewBox="0 0 300 120" className="fest-decor-svg" aria-hidden="true">
      {/* Tricolor bands */}
      <rect x="0" y="0" width="300" height="8" fill="#ff9933" opacity=".4" />
      <rect x="0" y="8" width="300" height="8" fill="#ffffff" opacity=".3" />
      <rect x="0" y="16" width="300" height="8" fill="#138808" opacity=".4" />
      {/* Ashoka Chakra */}
      <circle cx="150" cy="60" r="18" fill="none" stroke="#000080" strokeWidth="1.5" opacity=".3" />
      <circle cx="150" cy="60" r="3" fill="#000080" opacity=".3" />
      {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map((deg, i) => {
        const rad = deg * Math.PI / 180;
        return <line key={i} x1={150 + 4 * Math.cos(rad)} y1={60 + 4 * Math.sin(rad)} x2={150 + 16 * Math.cos(rad)} y2={60 + 16 * Math.sin(rad)} stroke="#000080" strokeWidth="0.5" opacity=".25" />;
      })}
      {/* Dove / birds */}
      <path d="M60 50 Q55 42 50 45 Q55 38 65 42 Q58 38 60 32 Q65 40 65 42 L60 50" fill="#666" opacity=".2" />
      <path d="M240 45 Q235 37 230 40 Q235 33 245 37 Q238 33 240 27 Q245 35 245 37 L240 45" fill="#666" opacity=".2" />
      {/* Flag pole */}
      <line x1="30" y1="30" x2="30" y2="110" stroke="#666" strokeWidth="2" opacity=".3" />
      <rect x="32" y="30" width="30" height="7" fill="#ff9933" opacity=".4" />
      <rect x="32" y="37" width="30" height="7" fill="#fff" opacity=".3" />
      <rect x="32" y="44" width="30" height="7" fill="#138808" opacity=".4" />
      {/* Stars */}
      {[[100, 90], [200, 95], [260, 70]].map(([x, y], i) => (
        <circle key={`s${i}`} cx={x} cy={y} r={2} fill="#ff9933" opacity={0.3 + i * 0.1} />
      ))}
    </svg>
  );
}

/* ── Republic Day ── */
function RepublicDayDecor() {
  return (
    <svg viewBox="0 0 300 120" className="fest-decor-svg" aria-hidden="true">
      {/* Tricolor bands at bottom */}
      <rect x="0" y="104" width="300" height="6" fill="#138808" opacity=".4" />
      <rect x="0" y="110" width="300" height="5" fill="#ffffff" opacity=".3" />
      <rect x="0" y="115" width="300" height="5" fill="#ff9933" opacity=".4" />
      {/* Parliament / India Gate silhouette */}
      <rect x="110" y="55" width="80" height="40" fill="#8d6e63" opacity=".15" rx="2" />
      <path d="M105 55 Q150 25 195 55" fill="#8d6e63" opacity=".15" />
      {[120, 135, 150, 165, 180].map((x, i) => (
        <rect key={i} x={x - 2} y="60" width="4" height="30" fill="#6d4c41" opacity=".12" />
      ))}
      {/* Ashoka pillar lion hint */}
      <circle cx="150" cy="20" r="10" fill="#000080" opacity=".12" />
      <rect x="145" y="28" width="10" height="8" fill="#000080" opacity=".1" />
      {/* Tricolor swirl */}
      <path d="M30 40 Q60 20 90 40" stroke="#ff9933" strokeWidth="2" fill="none" opacity=".3" />
      <path d="M30 45 Q60 25 90 45" stroke="#138808" strokeWidth="2" fill="none" opacity=".3" />
      <path d="M210 40 Q240 20 270 40" stroke="#ff9933" strokeWidth="2" fill="none" opacity=".3" />
      <path d="M210 45 Q240 25 270 45" stroke="#138808" strokeWidth="2" fill="none" opacity=".3" />
      {/* Stars */}
      {[[50, 70], [250, 65], [80, 90], [220, 85]].map(([x, y], i) => (
        <circle key={`s${i}`} cx={x} cy={y} r={2} fill={i % 2 ? '#ff9933' : '#138808'} opacity=".3" />
      ))}
    </svg>
  );
}

/* ── Karwa Chauth ── */
function KarwaChAuthDecor() {
  return (
    <svg viewBox="0 0 300 120" className="fest-decor-svg" aria-hidden="true">
      {/* Full moon */}
      <circle cx="150" cy="35" r="22" fill="#ffd700" opacity=".5" />
      <circle cx="145" cy="30" r="4" fill="#ffecb3" opacity=".3" />
      <circle cx="155" cy="38" r="3" fill="#ffecb3" opacity=".2" />
      <circle cx="148" cy="42" r="2" fill="#ffecb3" opacity=".2" />
      {/* Sieve (chalni) */}
      <ellipse cx="80" cy="65" rx="20" ry="12" fill="none" stroke="#8d6e63" strokeWidth="2" opacity=".4" />
      {/* Sieve mesh pattern */}
      {[-12, -4, 4, 12].map((dx, i) => (
        <line key={`h${i}`} x1={65} y1={65 + dx * 0.6} x2={95} y2={65 + dx * 0.6} stroke="#8d6e63" strokeWidth="0.5" opacity=".2" />
      ))}
      {[-8, 0, 8].map((dx, i) => (
        <line key={`v${i}`} x1={80 + dx} y1={55} x2={80 + dx} y2={75} stroke="#8d6e63" strokeWidth="0.5" opacity=".2" />
      ))}
      {/* Mehendi hand */}
      <path d="M220 90 Q220 70 230 60 Q235 55 235 65 Q240 55 240 65 Q245 55 245 65 Q250 55 250 68 Q250 80 240 90 Z" fill="#c0392b" opacity=".2" />
      {/* Hearts */}
      {[[40, 30], [260, 25], [120, 95], [200, 100]].map(([x, y], i) => (
        <path key={i} d={`M${x},${y + 3} C${x - 4},${y - 2} ${x - 4},${y - 6} ${x},${y - 3} C${x + 4},${y - 6} ${x + 4},${y - 2} ${x},${y + 3}`} fill="#e74c3c" opacity={0.25 + i * 0.05} />
      ))}
      {/* Diyas */}
      {[30, 270].map((x, i) => (
        <g key={`d${i}`}>
          <ellipse cx={x} cy={105} rx="8" ry="4" fill="#d4a017" opacity=".4" />
          <ellipse cx={x} cy={98} rx="3" ry="5" fill="#ff6b35" opacity=".5" />
          <ellipse cx={x} cy={96} rx="1.5" ry="3" fill="#ffd700" opacity=".4" />
        </g>
      ))}
      {/* Stars around moon */}
      {[[120, 20], [180, 18], [130, 55], [170, 50]].map(([x, y], i) => (
        <circle key={`s${i}`} cx={x} cy={y} r={1.5} fill="#ffd700" opacity={0.3 + i * 0.08} />
      ))}
    </svg>
  );
}

/* ── Baisakhi ── */
function BaisakhiDecor() {
  return (
    <svg viewBox="0 0 300 120" className="fest-decor-svg" aria-hidden="true">
      {/* Wheat stalks */}
      {[40, 80, 220, 260].map((x, i) => (
        <g key={i}>
          <line x1={x} y1={110} x2={x + (i < 2 ? 5 : -5)} y2={30} stroke="#8d6e63" strokeWidth="1.5" opacity=".4" />
          {[45, 55, 65, 75, 85].map((yOff, j) => {
            const xOff = x + (i < 2 ? 5 : -5) * (1 - (yOff - 30) / 80);
            return (
              <g key={j}>
                <ellipse cx={xOff - 5} cy={yOff} rx="4" ry="2" fill="#f9d423" opacity=".4" transform={`rotate(-30 ${xOff - 5} ${yOff})`} />
                <ellipse cx={xOff + 5} cy={yOff} rx="4" ry="2" fill="#f9d423" opacity=".4" transform={`rotate(30 ${xOff + 5} ${yOff})`} />
              </g>
            );
          })}
        </g>
      ))}
      {/* Dhol drum */}
      <ellipse cx="150" cy="75" rx="22" ry="14" fill="#8d6e63" opacity=".35" />
      <rect x="130" y="62" width="40" height="26" rx="4" fill="#a1887f" opacity=".3" />
      <ellipse cx="150" cy="62" rx="20" ry="12" fill="#6d4c41" opacity=".25" />
      <line x1="130" y1="75" x2="170" y2="75" stroke="#fff" strokeWidth="0.8" opacity=".2" />
      {/* Drum sticks */}
      <line x1="125" y1="60" x2="115" y2="45" stroke="#5d4037" strokeWidth="2" opacity=".3" />
      <circle cx="114" cy="44" r="3" fill="#5d4037" opacity=".3" />
      <line x1="175" y1="60" x2="185" y2="45" stroke="#5d4037" strokeWidth="2" opacity=".3" />
      <circle cx="186" cy="44" r="3" fill="#5d4037" opacity=".3" />
      {/* Sun */}
      <circle cx="150" cy="18" r="10" fill="#ffd54f" opacity=".4" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = deg * Math.PI / 180;
        return <line key={i} x1={150 + 12 * Math.cos(rad)} y1={18 + 12 * Math.sin(rad)} x2={150 + 17 * Math.cos(rad)} y2={18 + 17 * Math.sin(rad)} stroke="#ffd54f" strokeWidth="1.5" opacity=".3" />;
      })}
    </svg>
  );
}

/* ── Chhath Puja ── */
function ChhathDecor() {
  return (
    <svg viewBox="0 0 300 120" className="fest-decor-svg" aria-hidden="true">
      {/* Rising sun */}
      <circle cx="150" cy="30" r="20" fill="#f57c00" opacity=".5" />
      <circle cx="150" cy="30" r="14" fill="#ffd54f" opacity=".4" />
      {/* Sun rays */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
        const rad = deg * Math.PI / 180;
        return <line key={i} x1={150 + 22 * Math.cos(rad)} y1={30 + 22 * Math.sin(rad)} x2={150 + 32 * Math.cos(rad)} y2={30 + 32 * Math.sin(rad)} stroke="#f57c00" strokeWidth="1.5" opacity=".3" />;
      })}
      {/* Water/river */}
      <path d="M0 85 Q40 75 80 85 Q120 95 160 85 Q200 75 240 85 Q280 95 300 85" fill="none" stroke="#4fc3f7" strokeWidth="2" opacity=".3" />
      <path d="M0 92 Q40 82 80 92 Q120 102 160 92 Q200 82 240 92 Q280 102 300 92" fill="none" stroke="#29b6f6" strokeWidth="1.5" opacity=".25" />
      {/* Offering basket (soop) */}
      <path d="M60 100 Q60 80 90 80 Q120 80 120 100" fill="#8d6e63" opacity=".3" />
      <ellipse cx="90" cy="100" rx="30" ry="6" fill="#a1887f" opacity=".3" />
      {/* Fruits in basket */}
      <circle cx="80" cy="78" r="5" fill="#ff9800" opacity=".35" />
      <circle cx="92" cy="76" r="4" fill="#f44336" opacity=".3" />
      <circle cx="102" cy="79" r="5" fill="#ffc107" opacity=".35" />
      {/* Diyas on water */}
      {[190, 230, 260].map((x, i) => (
        <g key={i}>
          <ellipse cx={x} cy={88} rx="6" ry="3" fill="#d4a017" opacity=".4" />
          <ellipse cx={x} cy={83} rx="2" ry="4" fill="#ff6b35" opacity=".5" />
          <ellipse cx={x} cy={81} rx="1" ry="2" fill="#ffd700" opacity=".4" />
        </g>
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
  dussehra: DussehraDecor,
  sankranti: SankrantiDecor,
  ganesh: GaneshDecor,
  janmashtami: JanmashtamiDecor,
  independenceday: IndependenceDayDecor,
  republicday: RepublicDayDecor,
  karwachauth: KarwaChAuthDecor,
  baisakhi: BaisakhiDecor,
  chhath: ChhathDecor,
};

/* ── Main Preview ── */
export default function FestivalCardPreview({ data, lang = 'en', bgColor }) {
  const { festival, senderName, recipientName, customGreeting, message, photoPreview } = data;
  const theme = THEME[festival] || THEME.holi;
  const DecorComponent = DECOR_MAP[festival] || HoliDecor;
  const isDark = theme.dark;
  const t = T[lang] || T.en;

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
        t={t}
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
          {t.festDear} <span className="fest-recipient-name">{recipientName}</span>,
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
          <span className="fest-from-label">{t.festWithLove}</span>
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
function HoliTemplateCard({ tpl, tplId, theme, data, bgColor, DecorComponent, t }) {
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
        {recipientName && <div className="fest-recipient">{t.festDear} <span className="fest-recipient-name">{recipientName}</span>,</div>}
        {message && <p className="fest-message">{message}</p>}
        {photoPreview && <div className="fest-photo-wrap"><img src={photoPreview} alt="Photo" className="fest-photo" loading="lazy" /></div>}
        {senderName && <div className="fest-sender"><span className="fest-from-label">{t.festWithLove}</span><span className="fest-sender-name">{senderName}</span></div>}
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
          {recipientName && <div className="fest-recipient">{t.festDear} <span className="fest-recipient-name">{recipientName}</span>,</div>}
          {message && <p className="fest-message">{message}</p>}
          {photoPreview && <div className="fest-photo-wrap"><img src={photoPreview} alt="Photo" className="fest-photo" loading="lazy" /></div>}
          {senderName && <div className="fest-sender"><span className="fest-from-label">{t.festWithLove}</span><span className="fest-sender-name">{senderName}</span></div>}
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
            {recipientName && <div className="fest-recipient" style={{ marginTop: 8 }}>{t.festDear} <span className="fest-recipient-name">{recipientName}</span>,</div>}
          </div>
        </div>
        {message && <p className="fest-message">{message}</p>}
        {photoPreview && <div className="fest-photo-wrap"><img src={photoPreview} alt="Photo" className="fest-photo" loading="lazy" /></div>}
        {senderName && <div className="fest-sender"><span className="fest-from-label">{t.festWithLove}</span><span className="fest-sender-name">{senderName}</span></div>}
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
          {recipientName && <div className="fest-recipient">{t.festDear} <span className="fest-recipient-name">{recipientName}</span>,</div>}
          {message && <p className="fest-message">{message}</p>}
          {photoPreview && <div className="fest-photo-wrap"><img src={photoPreview} alt="Photo" className="fest-photo" loading="lazy" /></div>}
          {senderName && <div className="fest-sender"><span className="fest-from-label">{t.festWithLove}</span><span className="fest-sender-name">{senderName}</span></div>}
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
            {recipientName && <div className="fest-recipient">{t.festDear} <span className="fest-recipient-name">{recipientName}</span>,</div>}
          </div>
        </div>
        {message && <p className="fest-message">{message}</p>}
        {photoPreview && <div className="fest-photo-wrap"><img src={photoPreview} alt="Photo" className="fest-photo" loading="lazy" /></div>}
        {senderName && <div className="fest-sender"><span className="fest-from-label">{t.festWithLove}</span><span className="fest-sender-name">{senderName}</span></div>}
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
      {recipientName && <div className="fest-recipient">{t.festDear} <span className="fest-recipient-name">{recipientName}</span>,</div>}
      {message && <p className="fest-message">{message}</p>}
      {photoPreview && <div className="fest-photo-wrap"><img src={photoPreview} alt="Photo" className="fest-photo" loading="lazy" /></div>}
      <div className="holi-tpl6-frame">
        <div className="holi-tpl6-frame-inner">
          <img src={tpl.image} alt="Radha Krishna Holi" className="holi-tpl6-img" />
        </div>
      </div>
      {senderName && <div className="fest-sender"><span className="fest-from-label">{t.festWithLove}</span><span className="fest-sender-name">{senderName}</span></div>}
    </div>
  );
}
