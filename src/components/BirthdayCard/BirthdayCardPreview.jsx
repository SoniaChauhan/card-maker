import { forwardRef } from 'react';
import { formatDate, formatTime } from '../../utils/helpers';
import { T } from '../../utils/translations';

/* ─── Theme 1 – Space Adventure ─── */
function SpaceTopDecor() {
  return (
    <svg className="bday-deco-svg" viewBox="0 0 420 90" fill="none">
      {/* Saturn */}
      <circle cx="80" cy="40" r="18" fill="#5fa8b6" opacity=".85" />
      <ellipse cx="80" cy="40" rx="30" ry="6" stroke="#e8d8a0" strokeWidth="2.5" fill="none" />
      {/* small stars */}
      <circle cx="40" cy="20" r="3" fill="#e8d8a0" />
      <circle cx="140" cy="15" r="2" fill="#fff" opacity=".7" />
      <circle cx="200" cy="30" r="2.5" fill="#e8d8a0" opacity=".8" />
      <circle cx="300" cy="18" r="2" fill="#fff" opacity=".6" />
      <circle cx="360" cy="25" r="3" fill="#e8d8a0" />
      {/* planet */}
      <circle cx="340" cy="45" r="13" fill="#c9a86e" opacity=".7" />
      <circle cx="345" cy="42" r="4" fill="#b89350" opacity=".5" />
    </svg>
  );
}

function SpaceAstronaut() {
  return (
    <svg className="bday-center-svg" viewBox="0 0 200 220" fill="none">
      {/* helmet */}
      <ellipse cx="100" cy="70" rx="42" ry="44" fill="#eee" stroke="#bbb" strokeWidth="2" />
      {/* visor */}
      <ellipse cx="100" cy="68" rx="30" ry="30" fill="#3a6186" opacity=".85" />
      {/* face reflection */}
      <ellipse cx="110" cy="60" rx="8" ry="10" fill="#fff" opacity=".22" />
      {/* eyes */}
      <circle cx="90" cy="65" r="3.5" fill="#fff" />
      <circle cx="110" cy="65" r="3.5" fill="#fff" />
      <circle cx="91" cy="66" r="1.5" fill="#222" />
      <circle cx="111" cy="66" r="1.5" fill="#222" />
      {/* cheeks */}
      <circle cx="85" cy="76" r="4" fill="#f0a0a0" opacity=".4" />
      <circle cx="115" cy="76" r="4" fill="#f0a0a0" opacity=".4" />
      {/* smile */}
      <path d="M93 78 Q100 85 107 78" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* body */}
      <rect x="68" y="110" width="64" height="60" rx="18" fill="#eee" stroke="#bbb" strokeWidth="2" />
      {/* control panel */}
      <rect x="85" y="122" width="30" height="18" rx="4" fill="#d4d4d4" />
      <circle cx="93" cy="131" r="3" fill="#e85d5d" />
      <circle cx="107" cy="131" r="3" fill="#5db8e8" />
      {/* left arm waving */}
      <path d="M68 125 Q40 100 30 80" stroke="#eee" strokeWidth="12" strokeLinecap="round" />
      <circle cx="28" cy="77" r="8" fill="#eee" stroke="#bbb" strokeWidth="1.5" />
      {/* right arm */}
      <path d="M132 125 Q150 140 155 155" stroke="#eee" strokeWidth="12" strokeLinecap="round" />
      <circle cx="157" cy="158" r="8" fill="#eee" stroke="#bbb" strokeWidth="1.5" />
      {/* legs */}
      <rect x="78" y="165" width="18" height="28" rx="8" fill="#eee" stroke="#bbb" strokeWidth="1.5" />
      <rect x="104" y="165" width="18" height="28" rx="8" fill="#eee" stroke="#bbb" strokeWidth="1.5" />
      {/* boots */}
      <rect x="75" y="188" width="24" height="10" rx="5" fill="#c55" />
      <rect x="101" y="188" width="24" height="10" rx="5" fill="#c55" />
      {/* small rocket */}
      <g transform="translate(160,20) scale(.65)">
        <rect x="0" y="20" width="20" height="40" rx="8" fill="#e85d5d" />
        <polygon points="10,0 0,20 20,20" fill="#e85d5d" />
        <rect x="5" y="45" width="10" height="6" rx="2" fill="#5fa8b6" />
        <circle cx="10" cy="32" r="4" fill="#fff" opacity=".7" />
        {/* flame */}
        <polygon points="4,60 10,75 16,60" fill="#f0c040" opacity=".8" />
      </g>
    </svg>
  );
}

function SpaceBottomDecor() {
  return (
    <svg className="bday-deco-svg" viewBox="0 0 420 50" fill="none">
      <circle cx="60" cy="30" r="16" fill="#c9a86e" opacity=".35" />
      <circle cx="65" cy="27" r="5" fill="#b89350" opacity=".25" />
      <circle cx="180" cy="20" r="2" fill="#e8d8a0" />
      <circle cx="280" cy="15" r="2.5" fill="#fff" opacity=".5" />
      <circle cx="370" cy="25" r="2" fill="#e8d8a0" opacity=".7" />
    </svg>
  );
}

/* ─── Theme 2 – Pastel Balloons ─── */
function PastelTopDecor() {
  return (
    <svg className="bday-deco-svg" viewBox="0 0 420 100" fill="none">
      {/* left balloon – pink */}
      <ellipse cx="80" cy="45" rx="26" ry="32" fill="#e8a0b0" opacity=".85" />
      <line x1="80" y1="77" x2="80" y2="100" stroke="#c9a86e" strokeWidth="1" />
      <polygon points="77,77 83,77 80,83" fill="#d08898" />
      {/* center balloon – heart */}
      <path d="M210 30 Q210 10 195 10 Q175 10 175 35 Q175 55 210 75 Q245 55 245 35 Q245 10 225 10 Q210 10 210 30Z" fill="#c4937f" opacity=".7" />
      <line x1="210" y1="75" x2="210" y2="100" stroke="#c9a86e" strokeWidth="1" />
      {/* right balloon – blue */}
      <ellipse cx="340" cy="42" rx="24" ry="30" fill="#a0c8d8" opacity=".8" />
      <line x1="340" y1="72" x2="340" y2="100" stroke="#c9a86e" strokeWidth="1" />
      <polygon points="337,72 343,72 340,78" fill="#8ab8c8" />
      {/* tiny dots */}
      <circle cx="140" cy="20" r="3" fill="#dec59b" opacity=".6" />
      <circle cx="280" cy="18" r="2.5" fill="#dec59b" opacity=".5" />
    </svg>
  );
}

function PastelBunting() {
  return (
    <svg className="bday-bunting-svg" viewBox="0 0 420 40" fill="none">
      <path d="M20 8 Q110 35 210 12 Q310 -5 400 15" stroke="#dec59b" strokeWidth="1.5" fill="none" />
      {[30, 80, 140, 200, 270, 340].map((x, i) => (
        <polygon key={i} points={`${x} ${10 + (i % 2) * 4},${x - 8} ${10 + (i % 2) * 4},${x - 4} ${28 + (i % 2) * 4}`}
          fill={['#e8a0b0', '#dec59b', '#a0c8d8', '#c4937f', '#dec59b', '#e8a0b0'][i]} opacity=".8" />
      ))}
    </svg>
  );
}

function PastelBottomDecor() {
  return (
    <svg className="bday-deco-svg" viewBox="0 0 420 50" fill="none">
      {/* laurel left */}
      <g transform="translate(130,5)">
        {[0, 1, 2, 3, 4].map(i => (
          <ellipse key={i} cx={10 - i * 6} cy={20 - i * 3} rx="8" ry="4"
            fill="#b8c9a0" opacity=".7" transform={`rotate(${-30 - i * 10} ${10 - i * 6} ${20 - i * 3})`} />
        ))}
      </g>
      {/* laurel right */}
      <g transform="translate(240,5)">
        {[0, 1, 2, 3, 4].map(i => (
          <ellipse key={i} cx={10 + i * 6} cy={20 - i * 3} rx="8" ry="4"
            fill="#b8c9a0" opacity=".7" transform={`rotate(${30 + i * 10} ${10 + i * 6} ${20 - i * 3})`} />
        ))}
      </g>
      {/* center star */}
      <polygon points="210,8 213,18 224,18 215,24 218,34 210,28 202,34 205,24 196,18 207,18" fill="#dec59b" opacity=".7" />
    </svg>
  );
}

/* ─── Theme 3 – Cute Stars ─── */
function CuteStarsTopDecor() {
  return (
    <svg className="bday-deco-svg" viewBox="0 0 420 100" fill="none">
      {/* star with face */}
      <g transform="translate(50,10)">
        <polygon points="35,0 43,22 67,22 48,36 55,58 35,44 15,58 22,36 3,22 27,22" fill="#dcc66e" />
        <circle cx="28" cy="28" r="2" fill="#444" />
        <circle cx="42" cy="28" r="2" fill="#444" />
        <path d="M30 35 Q35 40 40 35" stroke="#444" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </g>
      {/* cake with candle */}
      <g transform="translate(170,20)">
        <rect x="10" y="30" width="60" height="35" rx="6" fill="#e8a0b0" />
        <rect x="10" y="30" width="60" height="12" rx="6" fill="#f0c0c0" />
        <rect x="36" y="10" width="8" height="22" rx="3" fill="#a0c8d8" />
        <ellipse cx="40" cy="8" rx="5" ry="7" fill="#f0c040" opacity=".9" />
        {/* dots on cake */}
        <circle cx="25" cy="50" r="2.5" fill="#fff" opacity=".5" />
        <circle cx="40" cy="52" r="2.5" fill="#fff" opacity=".5" />
        <circle cx="55" cy="50" r="2.5" fill="#fff" opacity=".5" />
      </g>
      {/* balloon */}
      <g transform="translate(320,5)">
        <ellipse cx="30" cy="35" rx="22" ry="28" fill="#a8d8c8" opacity=".8" />
        <line x1="30" y1="63" x2="30" y2="90" stroke="#c9a86e" strokeWidth="1" />
        {/* face on balloon */}
        <circle cx="24" cy="32" r="2" fill="#444" />
        <circle cx="36" cy="32" r="2" fill="#444" />
        <path d="M26 40 Q30 44 34 40" stroke="#444" strokeWidth="1" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function CuteStarsScatter() {
  const colors = ['#dcc66e', '#e8a0b0', '#a0c8d8', '#c67a5c', '#a8d8c8', '#dec59b'];
  return (
    <svg className="bday-stars-scatter-svg" viewBox="0 0 420 40" fill="none">
      {[40, 110, 170, 250, 310, 380].map((x, i) => {
        const s = 8 + (i % 3) * 2;
        return <polygon key={i}
          points={`${x},${5} ${x + s * 0.22},${5 + s * 0.35} ${x + s * 0.5},${5 + s * 0.35} ${x + s * 0.28},${5 + s * 0.57} ${x + s * 0.36},${5 + s * 0.9} ${x},${5 + s * 0.7} ${x - s * 0.36},${5 + s * 0.9} ${x - s * 0.28},${5 + s * 0.57} ${x - s * 0.5},${5 + s * 0.35} ${x - s * 0.22},${5 + s * 0.35}`}
          fill={colors[i]} opacity=".75" />;
      })}
    </svg>
  );
}

function CuteGirlIllustration() {
  return (
    <svg className="bday-center-svg" viewBox="0 0 200 200" fill="none">
      {/* hair */}
      <ellipse cx="100" cy="55" rx="36" ry="38" fill="#6b3a2a" />
      {/* face */}
      <circle cx="100" cy="62" r="28" fill="#f5d0b0" />
      {/* eyes */}
      <circle cx="90" cy="58" r="3.5" fill="#444" />
      <circle cx="110" cy="58" r="3.5" fill="#444" />
      <circle cx="91.5" cy="57" r="1.2" fill="#fff" />
      <circle cx="111.5" cy="57" r="1.2" fill="#fff" />
      {/* cheeks */}
      <circle cx="83" cy="68" r="4" fill="#f0a0a0" opacity=".4" />
      <circle cx="117" cy="68" r="4" fill="#f0a0a0" opacity=".4" />
      {/* smile */}
      <path d="M92 72 Q100 80 108 72" stroke="#c67a5c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* dress body */}
      <path d="M72 90 Q100 85 128 90 L135 155 Q100 162 65 155 Z" fill="#e8a0b0" />
      {/* dress collar */}
      <path d="M82 90 Q100 96 118 90" stroke="#d08898" strokeWidth="2" fill="none" />
      {/* arms */}
      <rect x="55" y="95" width="14" height="35" rx="7" fill="#f5d0b0" />
      <rect x="131" y="95" width="14" height="35" rx="7" fill="#f5d0b0" />
      {/* legs */}
      <rect x="82" y="152" width="12" height="25" rx="6" fill="#f5d0b0" />
      <rect x="106" y="152" width="12" height="25" rx="6" fill="#f5d0b0" />
      {/* shoes */}
      <ellipse cx="88" cy="178" rx="9" ry="5" fill="#c67a5c" />
      <ellipse cx="112" cy="178" rx="9" ry="5" fill="#c67a5c" />
      {/* scattered stars around girl */}
      <polygon points="40,50 43,58 51,58 45,63 47,71 40,66 33,71 35,63 29,58 37,58" fill="#dcc66e" opacity=".7" />
      <polygon points="160,45 162,50 168,50 163,54 165,59 160,56 155,59 157,54 152,50 158,50" fill="#a0c8d8" opacity=".7" />
      <polygon points="150,110 152,115 157,115 153,118 155,123 150,120 145,123 147,118 143,115 148,115" fill="#e8a0b0" opacity=".6" />
    </svg>
  );
}

function CuteBottomDecor() {
  return (
    <svg className="bday-deco-svg" viewBox="0 0 420 30" fill="none">
      <path d="M140 15 Q170 5 210 15 Q250 25 280 15" stroke="#c67a5c" strokeWidth="1.5" fill="none" opacity=".5" />
      <circle cx="210" cy="15" r="3" fill="#dcc66e" opacity=".6" />
      <circle cx="160" cy="12" r="2" fill="#e8a0b0" opacity=".5" />
      <circle cx="260" cy="12" r="2" fill="#a0c8d8" opacity=".5" />
    </svg>
  );
}

/* ─── Theme 4 – Party Confetti ─── */
function PartyTopDecor() {
  return (
    <svg className="bday-deco-svg" viewBox="0 0 420 80" fill="none">
      {/* bunting */}
      <path d="M10 10 Q110 40 210 10 Q310 -15 410 18" stroke="#d98a4b" strokeWidth="1.5" fill="none" />
      {[30, 80, 140, 200, 270, 340, 390].map((x, i) => (
        <polygon key={i} points={`${x},${8 + (i % 2) * 5} ${x - 10},${8 + (i % 2) * 5} ${x - 5},${26 + (i % 2) * 5}`}
          fill={['#e8985a', '#5db8a0', '#e8c85a', '#d98a4b', '#e85d7a', '#5da8e8', '#e8985a'][i]} opacity=".85" />
      ))}
      {/* balloon polka dot */}
      <g transform="translate(50,30)">
        <ellipse cx="20" cy="20" rx="16" ry="20" fill="#e85d7a" opacity=".75" />
        <circle cx="14" cy="14" r="2.5" fill="#fff" opacity=".3" />
        <circle cx="24" cy="22" r="2" fill="#fff" opacity=".3" />
        <line x1="20" y1="40" x2="18" y2="55" stroke="#c9a86e" strokeWidth="1" />
      </g>
      {/* balloon rainbow */}
      <g transform="translate(330,28)">
        <ellipse cx="20" cy="20" rx="16" ry="20" fill="#5db8a0" opacity=".75" />
        <path d="M8 18 Q20 8 32 18" stroke="#fff" strokeWidth="1.5" fill="none" opacity=".3" />
        <line x1="20" y1="40" x2="22" y2="55" stroke="#c9a86e" strokeWidth="1" />
      </g>
      {/* confetti bits */}
      {[120, 180, 250, 300].map((x, i) => (
        <rect key={i} x={x} y={35 + i * 5} width="6" height="3" rx="1"
          fill={['#e8985a', '#5db8a0', '#e85d7a', '#e8c85a'][i]} opacity=".6"
          transform={`rotate(${20 + i * 30} ${x + 3} ${37 + i * 5})`} />
      ))}
    </svg>
  );
}

function PartyGirlIllustration() {
  return (
    <svg className="bday-center-svg" viewBox="0 0 200 220" fill="none">
      {/* party hat */}
      <polygon points="100,5 80,55 120,55" fill="#e8985a" />
      <circle cx="100" cy="5" r="5" fill="#e8c85a" />
      <line x1="85" y1="30" x2="115" y2="30" stroke="#5db8a0" strokeWidth="2" />
      <line x1="88" y1="42" x2="112" y2="42" stroke="#e85d7a" strokeWidth="2" />
      {/* head */}
      <circle cx="100" cy="75" r="28" fill="#f5d0b0" />
      {/* hair */}
      <path d="M72 68 Q72 42 100 42 Q128 42 128 68" fill="#5a3220" />
      {/* eyes - closed happy */}
      <path d="M86 72 Q90 68 94 72" stroke="#444" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M106 72 Q110 68 114 72" stroke="#444" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* cheeks */}
      <circle cx="82" cy="82" r="5" fill="#f0a0a0" opacity=".4" />
      <circle cx="118" cy="82" r="5" fill="#f0a0a0" opacity=".4" />
      {/* big smile */}
      <path d="M88 85 Q100 96 112 85" stroke="#d98a4b" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* body/dress */}
      <path d="M72 102 Q100 96 128 102 L140 175 Q100 185 60 175 Z" fill="#e85d7a" />
      {/* collar */}
      <path d="M80 102 Q100 110 120 102" stroke="#d04868" strokeWidth="2" fill="none" />
      {/* arms raised */}
      <path d="M68 115 Q50 90 38 72" stroke="#f5d0b0" strokeWidth="14" strokeLinecap="round" />
      <path d="M132 115 Q150 90 162 72" stroke="#f5d0b0" strokeWidth="14" strokeLinecap="round" />
      {/* hands */}
      <circle cx="35" cy="69" r="8" fill="#f5d0b0" />
      <circle cx="165" cy="69" r="8" fill="#f5d0b0" />
      {/* confetti around */}
      <rect x="25" y="50" width="6" height="3" rx="1" fill="#e8c85a" opacity=".7" transform="rotate(30 28 51.5)" />
      <rect x="170" y="48" width="5" height="3" rx="1" fill="#5db8a0" opacity=".7" transform="rotate(-20 172.5 49.5)" />
      <circle cx="30" cy="90" r="3" fill="#e8985a" opacity=".5" />
      <circle cx="175" cy="85" r="2.5" fill="#e85d7a" opacity=".5" />
      {/* legs */}
      <rect x="82" y="172" width="12" height="25" rx="6" fill="#f5d0b0" />
      <rect x="106" y="172" width="12" height="25" rx="6" fill="#f5d0b0" />
      {/* shoes */}
      <ellipse cx="88" cy="198" rx="10" ry="5" fill="#d98a4b" />
      <ellipse cx="112" cy="198" rx="10" ry="5" fill="#d98a4b" />
    </svg>
  );
}

function PartyBottomDecor() {
  return (
    <svg className="bday-deco-svg" viewBox="0 0 420 35" fill="none">
      <g transform="translate(140,5)">
        {[0, 1, 2, 3, 4].map(i => (
          <ellipse key={i} cx={10 - i * 7} cy={15 - i * 2} rx="9" ry="4"
            fill="#5db8a0" opacity=".5" transform={`rotate(${-25 - i * 8} ${10 - i * 7} ${15 - i * 2})`} />
        ))}
      </g>
      <g transform="translate(240,5)">
        {[0, 1, 2, 3, 4].map(i => (
          <ellipse key={i} cx={10 + i * 7} cy={15 - i * 2} rx="9" ry="4"
            fill="#5db8a0" opacity=".5" transform={`rotate(${25 + i * 8} ${10 + i * 7} ${15 - i * 2})`} />
        ))}
      </g>
    </svg>
  );
}

/* ─── Theme 5 – Sunshine Floral ─── */
function FloralSideDecor() {
  return (
    <>
      {/* Left side flowers */}
      <svg className="bday-floral-sides-svg bday-floral-left" viewBox="0 0 80 400" fill="none">
        {/* stem */}
        <path d="M40 380 Q30 300 45 220 Q55 150 35 80" stroke="#8ba888" strokeWidth="2" fill="none" />
        {/* leaves */}
        <ellipse cx="30" cy="320" rx="18" ry="8" fill="#8ba888" opacity=".6" transform="rotate(-30 30 320)" />
        <ellipse cx="50" cy="250" rx="16" ry="7" fill="#8ba888" opacity=".6" transform="rotate(25 50 250)" />
        <ellipse cx="28" cy="180" rx="15" ry="7" fill="#8ba888" opacity=".5" transform="rotate(-25 28 180)" />
        {/* flowers */}
        <g transform="translate(35,100)">
          {[0, 60, 120, 180, 240, 300].map(a => (
            <ellipse key={a} cx={Math.cos(a * Math.PI / 180) * 10} cy={Math.sin(a * Math.PI / 180) * 10} rx="7" ry="5" fill="#e8a0b8" opacity=".7" transform={`rotate(${a} ${Math.cos(a * Math.PI / 180) * 10} ${Math.sin(a * Math.PI / 180) * 10})`} />
          ))}
          <circle cx="0" cy="0" r="5" fill="#f0c040" opacity=".8" />
        </g>
        <g transform="translate(25,270)">
          {[0, 72, 144, 216, 288].map(a => (
            <ellipse key={a} cx={Math.cos(a * Math.PI / 180) * 8} cy={Math.sin(a * Math.PI / 180) * 8} rx="6" ry="4" fill="#b87f7f" opacity=".6" transform={`rotate(${a} ${Math.cos(a * Math.PI / 180) * 8} ${Math.sin(a * Math.PI / 180) * 8})`} />
          ))}
          <circle cx="0" cy="0" r="4" fill="#f0c040" opacity=".7" />
        </g>
      </svg>
      {/* Right side - mirrored */}
      <svg className="bday-floral-sides-svg bday-floral-right" viewBox="0 0 80 400" fill="none" style={{ transform: 'scaleX(-1)' }}>
        <path d="M40 380 Q30 300 45 220 Q55 150 35 80" stroke="#8ba888" strokeWidth="2" fill="none" />
        <ellipse cx="30" cy="320" rx="18" ry="8" fill="#8ba888" opacity=".6" transform="rotate(-30 30 320)" />
        <ellipse cx="50" cy="250" rx="16" ry="7" fill="#8ba888" opacity=".6" transform="rotate(25 50 250)" />
        <ellipse cx="28" cy="180" rx="15" ry="7" fill="#8ba888" opacity=".5" transform="rotate(-25 28 180)" />
        <g transform="translate(35,100)">
          {[0, 60, 120, 180, 240, 300].map(a => (
            <ellipse key={a} cx={Math.cos(a * Math.PI / 180) * 10} cy={Math.sin(a * Math.PI / 180) * 10} rx="7" ry="5" fill="#e8a0b8" opacity=".7" transform={`rotate(${a} ${Math.cos(a * Math.PI / 180) * 10} ${Math.sin(a * Math.PI / 180) * 10})`} />
          ))}
          <circle cx="0" cy="0" r="5" fill="#f0c040" opacity=".8" />
        </g>
        <g transform="translate(25,270)">
          {[0, 72, 144, 216, 288].map(a => (
            <ellipse key={a} cx={Math.cos(a * Math.PI / 180) * 8} cy={Math.sin(a * Math.PI / 180) * 8} rx="6" ry="4" fill="#b87f7f" opacity=".6" transform={`rotate(${a} ${Math.cos(a * Math.PI / 180) * 8} ${Math.sin(a * Math.PI / 180) * 8})`} />
          ))}
          <circle cx="0" cy="0" r="4" fill="#f0c040" opacity=".7" />
        </g>
      </svg>
    </>
  );
}

function SunshineFace() {
  return (
    <svg className="bday-sunshine-svg" viewBox="0 0 160 160" fill="none">
      {/* rays */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => (
        <ellipse key={a}
          cx={80 + Math.cos(a * Math.PI / 180) * 58}
          cy={80 + Math.sin(a * Math.PI / 180) * 58}
          rx="14" ry="6" fill="#f0c040" opacity=".6"
          transform={`rotate(${a} ${80 + Math.cos(a * Math.PI / 180) * 58} ${80 + Math.sin(a * Math.PI / 180) * 58})`} />
      ))}
      {/* face circle */}
      <circle cx="80" cy="80" r="40" fill="#f0c040" />
      {/* closed eyes */}
      <path d="M65 75 Q70 70 75 75" stroke="#9e7b5a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M85 75 Q90 70 95 75" stroke="#9e7b5a" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* cheeks */}
      <circle cx="60" cy="85" r="5" fill="#f0a060" opacity=".4" />
      <circle cx="100" cy="85" r="5" fill="#f0a060" opacity=".4" />
      {/* smile */}
      <path d="M68 88 Q80 100 92 88" stroke="#9e7b5a" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Theme 6 – Animal Friends ─── */
function AnimalBunting() {
  return (
    <svg className="bday-bunting-svg" viewBox="0 0 420 45" fill="none">
      <path d="M15 8 Q110 32 210 10 Q310 -8 405 14" stroke="#d98a4b" strokeWidth="1.5" fill="none" />
      {[40, 100, 160, 230, 300, 370].map((x, i) => (
        <polygon key={i}
          points={`${x},${8 + (i % 2) * 4} ${x - 9},${8 + (i % 2) * 4} ${x - 4.5},${24 + (i % 2) * 4}`}
          fill={['#e8985a', '#5db8a0', '#e8c85a', '#e85d7a', '#9e7b5a', '#a0c8d8'][i]} opacity=".85" />
      ))}
      {/* confetti bits */}
      <circle cx="70" cy="30" r="2" fill="#e8c85a" opacity=".5" />
      <circle cx="200" cy="35" r="2.5" fill="#e85d7a" opacity=".4" />
      <circle cx="340" cy="28" r="2" fill="#5db8a0" opacity=".5" />
    </svg>
  );
}

function AnimalFriends() {
  return (
    <svg className="bday-animals-svg" viewBox="0 0 320 180" fill="none">
      {/* ── Bear ── */}
      <g transform="translate(30,20)">
        {/* ears */}
        <circle cx="20" cy="20" r="14" fill="#c9a86e" />
        <circle cx="60" cy="20" r="14" fill="#c9a86e" />
        <circle cx="20" cy="20" r="7" fill="#e8c0a0" />
        <circle cx="60" cy="20" r="7" fill="#e8c0a0" />
        {/* party hat */}
        <polygon points="40,0 28,30 52,30" fill="#e85d7a" />
        <circle cx="40" cy="0" r="4" fill="#e8c85a" />
        {/* head */}
        <circle cx="40" cy="45" r="28" fill="#c9a86e" />
        {/* muzzle */}
        <ellipse cx="40" cy="55" rx="14" ry="10" fill="#e8d8c0" />
        {/* nose */}
        <ellipse cx="40" cy="52" rx="4" ry="3" fill="#6b4a30" />
        {/* eyes */}
        <circle cx="30" cy="42" r="3" fill="#333" />
        <circle cx="50" cy="42" r="3" fill="#333" />
        <circle cx="31" cy="41" r="1" fill="#fff" />
        <circle cx="51" cy="41" r="1" fill="#fff" />
        {/* cheeks */}
        <circle cx="22" cy="52" r="5" fill="#f0a0a0" opacity=".35" />
        <circle cx="58" cy="52" r="5" fill="#f0a0a0" opacity=".35" />
        {/* smile */}
        <path d="M34 58 Q40 64 46 58" stroke="#6b4a30" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        {/* body */}
        <ellipse cx="40" cy="95" rx="22" ry="26" fill="#c9a86e" />
        <ellipse cx="40" cy="90" rx="14" ry="12" fill="#e8d8c0" />
        {/* arms */}
        <ellipse cx="14" cy="90" rx="8" ry="14" fill="#c9a86e" transform="rotate(15 14 90)" />
        <ellipse cx="66" cy="90" rx="8" ry="14" fill="#c9a86e" transform="rotate(-15 66 90)" />
        {/* feet */}
        <ellipse cx="28" cy="118" rx="10" ry="7" fill="#c9a86e" />
        <ellipse cx="52" cy="118" rx="10" ry="7" fill="#c9a86e" />
      </g>

      {/* ── Bunny ── */}
      <g transform="translate(130,15)">
        {/* ears */}
        <ellipse cx="22" cy="5" rx="8" ry="28" fill="#e8d8d8" />
        <ellipse cx="48" cy="5" rx="8" ry="28" fill="#e8d8d8" />
        <ellipse cx="22" cy="5" rx="4" ry="20" fill="#f0b8b8" opacity=".5" />
        <ellipse cx="48" cy="5" rx="4" ry="20" fill="#f0b8b8" opacity=".5" />
        {/* party hat on ear */}
        <polygon points="48,-20 40,5 56,5" fill="#5db8a0" />
        <circle cx="48" cy="-20" r="3.5" fill="#e8c85a" />
        {/* head */}
        <circle cx="35" cy="50" r="26" fill="#f0e8e0" />
        {/* eyes */}
        <circle cx="26" cy="46" r="3" fill="#333" />
        <circle cx="44" cy="46" r="3" fill="#333" />
        <circle cx="27" cy="45" r="1" fill="#fff" />
        <circle cx="45" cy="45" r="1" fill="#fff" />
        {/* nose */}
        <ellipse cx="35" cy="55" rx="3" ry="2.5" fill="#f0a0a0" />
        {/* whiskers */}
        <line x1="10" y1="52" x2="25" y2="55" stroke="#ccc" strokeWidth=".8" />
        <line x1="10" y1="58" x2="25" y2="58" stroke="#ccc" strokeWidth=".8" />
        <line x1="45" y1="55" x2="60" y2="52" stroke="#ccc" strokeWidth=".8" />
        <line x1="45" y1="58" x2="60" y2="58" stroke="#ccc" strokeWidth=".8" />
        {/* cheeks */}
        <circle cx="20" cy="56" r="5" fill="#f0a0a0" opacity=".3" />
        <circle cx="50" cy="56" r="5" fill="#f0a0a0" opacity=".3" />
        {/* mouth */}
        <path d="M30 60 Q35 66 40 60" stroke="#c9a0a0" strokeWidth="1" fill="none" />
        {/* body */}
        <ellipse cx="35" cy="100" rx="20" ry="25" fill="#f0e8e0" />
        <ellipse cx="35" cy="95" rx="12" ry="12" fill="#fff" opacity=".5" />
        {/* arms */}
        <ellipse cx="12" cy="95" rx="7" ry="12" fill="#f0e8e0" transform="rotate(10 12 95)" />
        <ellipse cx="58" cy="95" rx="7" ry="12" fill="#f0e8e0" transform="rotate(-10 58 95)" />
        {/* feet */}
        <ellipse cx="22" cy="122" rx="10" ry="6" fill="#f0e8e0" />
        <ellipse cx="48" cy="122" rx="10" ry="6" fill="#f0e8e0" />
      </g>

      {/* ── Tiger ── */}
      <g transform="translate(230,20)">
        {/* ears */}
        <circle cx="20" cy="20" r="12" fill="#e8985a" />
        <circle cx="60" cy="20" r="12" fill="#e8985a" />
        <circle cx="20" cy="20" r="6" fill="#f0c8a0" />
        <circle cx="60" cy="20" r="6" fill="#f0c8a0" />
        {/* gift box on head */}
        <g transform="translate(25,-10)">
          <rect x="0" y="5" width="30" height="22" rx="3" fill="#e8c85a" />
          <rect x="0" y="5" width="30" height="8" rx="3" fill="#d98a4b" />
          <rect x="12" y="5" width="6" height="22" fill="#d98a4b" opacity=".5" />
          <path d="M15 5 Q10 -5 5 0" stroke="#e85d7a" strokeWidth="2" fill="none" />
          <path d="M15 5 Q20 -5 25 0" stroke="#e85d7a" strokeWidth="2" fill="none" />
        </g>
        {/* head */}
        <circle cx="40" cy="45" r="26" fill="#e8985a" />
        {/* lighter face area */}
        <ellipse cx="40" cy="52" rx="18" ry="14" fill="#f0d8b0" />
        {/* stripes */}
        <line x1="18" y1="35" x2="28" y2="40" stroke="#9e5a2a" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="45" x2="26" y2="46" stroke="#9e5a2a" strokeWidth="2" strokeLinecap="round" />
        <line x1="52" y1="40" x2="62" y2="35" stroke="#9e5a2a" strokeWidth="2" strokeLinecap="round" />
        <line x1="54" y1="46" x2="64" y2="45" stroke="#9e5a2a" strokeWidth="2" strokeLinecap="round" />
        {/* eyes */}
        <circle cx="30" cy="42" r="3" fill="#333" />
        <circle cx="50" cy="42" r="3" fill="#333" />
        <circle cx="31" cy="41" r="1" fill="#fff" />
        <circle cx="51" cy="41" r="1" fill="#fff" />
        {/* nose */}
        <ellipse cx="40" cy="50" rx="4" ry="3" fill="#6b4a30" />
        {/* cheeks */}
        <circle cx="24" cy="52" r="5" fill="#f0a0a0" opacity=".35" />
        <circle cx="56" cy="52" r="5" fill="#f0a0a0" opacity=".35" />
        {/* smile */}
        <path d="M34 56 Q40 62 46 56" stroke="#6b4a30" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        {/* body */}
        <ellipse cx="40" cy="95" rx="22" ry="26" fill="#e8985a" />
        <ellipse cx="40" cy="90" rx="14" ry="14" fill="#f0d8b0" />
        {/* body stripes */}
        <line x1="20" y1="82" x2="26" y2="88" stroke="#9e5a2a" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="54" y1="88" x2="60" y2="82" stroke="#9e5a2a" strokeWidth="1.5" strokeLinecap="round" />
        {/* arms */}
        <ellipse cx="14" cy="90" rx="8" ry="14" fill="#e8985a" transform="rotate(15 14 90)" />
        <ellipse cx="66" cy="90" rx="8" ry="14" fill="#e8985a" transform="rotate(-15 66 90)" />
        {/* feet */}
        <ellipse cx="28" cy="118" rx="10" ry="7" fill="#e8985a" />
        <ellipse cx="52" cy="118" rx="10" ry="7" fill="#e8985a" />
      </g>

      {/* balloon between bunny & tiger */}
      <ellipse cx="225" cy="15" rx="12" ry="15" fill="#e85d7a" opacity=".6" />
      <line x1="225" y1="30" x2="220" y2="60" stroke="#c9a86e" strokeWidth="1" />

      {/* confetti */}
      <circle cx="20" cy="10" r="2.5" fill="#e8c85a" opacity=".6" />
      <circle cx="310" cy="8" r="2" fill="#5db8a0" opacity=".5" />
      <rect x="160" y="5" width="5" height="3" rx="1" fill="#e85d7a" opacity=".5" transform="rotate(25 162 6.5)" />
    </svg>
  );
}

function AnimalBottomDecor() {
  return (
    <svg className="bday-deco-svg" viewBox="0 0 420 35" fill="none">
      {/* leaf branch */}
      <path d="M150 18 Q210 8 270 18" stroke="#8ba888" strokeWidth="1.5" fill="none" />
      {[160, 185, 210, 235, 260].map((x, i) => (
        <ellipse key={i} cx={x} cy={14 + (i % 2) * 5} rx="8" ry="4"
          fill="#8ba888" opacity=".5" transform={`rotate(${(i % 2 ? 20 : -20)} ${x} ${14 + (i % 2) * 5})`} />
      ))}
      <circle cx="210" cy="15" r="4" fill="#e8a0b0" opacity=".6" />
    </svg>
  );
}

/* ─── Main Preview Component ─── */
const BirthdayCardPreview = forwardRef(function BirthdayCardPreview({ data, lang, template = 1 }, ref) {
  const t = (k) => T(lang, k);
  const tpl = template || 1;
  const themeClass = `bday-theme-${tpl}`;

  return (
    <div className={`bday-card ${themeClass}`} ref={ref}>

      {/* Theme-specific top decoration */}
      {tpl === 1 && <SpaceTopDecor />}
      {tpl === 2 && <><PastelTopDecor /><PastelBunting /></>}
      {tpl === 3 && <CuteStarsTopDecor />}
      {tpl === 4 && <PartyTopDecor />}
      {tpl === 5 && <FloralSideDecor />}
      {tpl === 6 && <AnimalBunting />}

      {/* Subtitle */}
      <p className="bday-subtitle">{t('bdayJoinUs')}</p>

      {/* Hero name */}
      <h1 className="bday-hero-name">{data.birthdayPerson || 'Name'}</h1>
      <p className="bday-hero-title">{t('bdayTitle')}</p>

      {/* Age badge */}
      {data.age && <div className="bday-age-badge">{t('bdayMilestone')(data.age)}</div>}

      {/* Center illustration */}
      {tpl === 1 && <SpaceAstronaut />}
      {tpl === 2 && null}
      {tpl === 3 && <><CuteStarsScatter /><CuteGirlIllustration /></>}
      {tpl === 4 && <PartyGirlIllustration />}
      {tpl === 5 && <SunshineFace />}
      {tpl === 6 && <AnimalFriends />}

      {/* Photo */}
      {(data.photoPreview || (typeof data.photo === 'string' && data.photo)) && (
        <div className="bday-photo-frame">
          <img className="bday-photo" src={data.photoPreview || data.photo} alt="" />
        </div>
      )}

      {/* Event details */}
      {data.date && <p className="bday-event-line">📅 {formatDate(data.date, lang)}</p>}
      {data.time && <p className="bday-event-line">🕐 {formatTime(data.time, lang)}</p>}
      {data.venue && <p className="bday-venue-line">📍 {data.venue}</p>}
      {data.venueAddress && <p className="bday-address-line">{data.venueAddress}</p>}

      {/* Host */}
      {data.hostName && <p className="bday-event-line">{t('bdayHostedBy')}: {data.hostName}</p>}

      {/* Guest */}
      {data.guestName && (
        <p className="bday-guest-tag">
          {t('bdayWishLine')}: <span className="bday-guest-name">{data.guestName}</span>
        </p>
      )}

      {/* Message */}
      {data.message && <p className="bday-message">{data.message}</p>}

      {/* Bottom decoration */}
      {tpl === 1 && <SpaceBottomDecor />}
      {tpl === 2 && <PastelBottomDecor />}
      {tpl === 3 && <CuteBottomDecor />}
      {tpl === 4 && <PartyBottomDecor />}
      {tpl === 6 && <AnimalBottomDecor />}
    </div>
  );
});

export default BirthdayCardPreview;
