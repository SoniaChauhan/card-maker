'use client';
import { useState, useRef, useCallback } from 'react';
import '../HoliCard/HoliCard.css';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import html2canvas from 'html2canvas';
import { logDownload } from '../../services/downloadHistoryService';

const PARTICLES = ['🌈', '💜', '💛', '💚', '💙', '🎨', '✨', '🪷', '💗', '🎉', '🌸', '💐'];

/* ── All English Holi Messages ── */
const MESSAGES = [
  /* ── 20 Short / Medium Messages ── */
  { cat: '🌈', text: "May your Holi be filled with colors of joy, moments of love, and shades of beautiful memories." },
  { cat: '🌈', text: "Wishing you a Holi that brings peace to your heart and brightness to your days." },
  { cat: '🌸', text: "Let every color of Holi remind you how beautiful life becomes with happiness and hope." },
  { cat: '🌸', text: "May this Holi sprinkle positivity around you and fill your world with warmth and smiles." },
  { cat: '💛', text: "Wishing you a vibrant festival filled with laughter, love, and meaningful moments." },
  { cat: '💛', text: "Celebrate Holi with an open heart, pure joy, and colors that brighten every corner of your life." },
  { cat: '✨', text: "May this festival bring you new beginnings, renewed energy, and endless happiness." },
  { cat: '✨', text: "The colors of Holi may fade, but the joy it brings stays forever—wishing you a happy celebration." },
  { cat: '🌼', text: "Sending warm wishes for a festival filled with bright colors, sweet smiles, and peaceful vibes." },
  { cat: '🌼', text: "May the spirit of Holi fill your heart with warmth and your days with boundless joy." },
  { cat: '🎨', text: "Let the colors of Holi spread happiness around you and fill your life with beautiful surprises." },
  { cat: '🎨', text: "Wishing you a celebration full of joy, laughter, and unforgettable colorful moments." },
  { cat: '🌸', text: "May your Holi be as bright as sunshine and as sweet as the memories you share." },
  { cat: '🌸', text: "Let this Holi be a reminder that life is a beautiful mix of colors—cherish every shade." },
  { cat: '💛', text: "Wishing you a Holi filled with bright colors, calm moments, and joyful beginnings." },
  { cat: '💛', text: "May this festival refresh your soul, uplift your spirit, and bring harmony to your life." },
  { cat: '🌈', text: "Celebrate this Holi with love in your heart and happiness in every color around you." },
  { cat: '🌈', text: "Wishing you a colorful Holi filled with moments that turn into beautiful memories." },
  { cat: '✨', text: "May your life blossom with the colors of joy, peace, and positivity this Holi." },
  { cat: '✨', text: "May every color you play with bring a new blessing, a new reason to smile, and a new spark of joy." },

  /* ── 7 Medium-Length Premium Messages ── */
  { cat: '💖', long: true, title: 'Warm & Heartfelt', text: "May the colors of Holi fill your heart with joy, your home with love, and your life with endless positivity. Wishing you a bright and beautiful Holi!" },
  { cat: '🌟', long: true, title: 'Positive & Inspirational', text: "Let this Holi remind you that life becomes beautiful when we embrace every shade with happiness. Wishing you a colorful, peaceful, and joyful Holi." },
  { cat: '🌸', long: true, title: 'Soft & Poetic', text: "As vibrant colors fill the air, may your days glow with warmth, hope, and beautiful moments. Wishing you a joyful and colorful Holi!" },
  { cat: '💕', long: true, title: 'Romantic / For Loved Ones', text: "You are the most beautiful color in my world. May this Holi bring us closer and fill our hearts with love and laughter. Happy Holi!" },
  { cat: '✨', long: true, title: 'Elegant & Classy', text: "Wishing you a Holi that paints your life with joy, peace, new beginnings, and countless smiles. Have a wonderful and colorful celebration!" },
  { cat: '👨‍👩‍👧‍👦', long: true, title: 'Family-Friendly', text: "May this festival bring cheer, harmony, and togetherness into your home. Sending warm wishes for a happy and colorful Holi to you and your family." },
  { cat: '🎉', long: true, title: 'Fresh & Modern', text: "Bright colors, happy vibes, and moments that turn into memories—wishing you a fun, vibrant, and unforgettable Holi!" },
];

const DEFAULT_BG = '#fffde7';
const DEFAULT_FONT = '#4a148c';

export default function HoliCardEnglish({ onBack, userEmail }) {
  const [bgColor, setBgColor] = useState(DEFAULT_BG);
  const [fontColor, setFontColor] = useState(DEFAULT_FONT);
  const [dlIdx, setDlIdx] = useState(null);
  const [toast, setToast] = useState({ text: '', show: false });
  const refs = useRef({});

  function showToast(msg) {
    setToast({ text: msg, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  }

  const download = useCallback(async (idx) => {
    const el = refs.current[idx];
    if (!el) return;
    setDlIdx(idx);
    try {
      const canvas = await html2canvas(el, { useCORS: true, scale: 2, backgroundColor: null });
      canvas.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `holi-english-${idx + 1}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('✅ Card downloaded!');
        logDownload(userEmail, 'holi-en', 'Holi Wishes (English)', `Holi Message #${idx + 1}`, `holi-english-${idx + 1}.png`, {}).catch(() => {});
      });
    } catch {
      showToast('❌ Download failed.');
    } finally { setDlIdx(null); }
  }, [userEmail]);

  return (
    <div className="holi-screen">
      <Particles icons={PARTICLES} count={28} />

      <div className="holi-container">
        <h1 className="holi-title">🌈 Happy Holi Wishes</h1>
        <p className="holi-subtitle">Beautiful English Holi messages — customize colors & download!</p>

        {/* ── Color pickers ── */}
        <div className="holi-pickers">
          <label className="holi-picker">
            🎨 Background
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} />
            {bgColor !== DEFAULT_BG && <button className="holi-rst" onClick={() => setBgColor(DEFAULT_BG)}>↺</button>}
          </label>
          <label className="holi-picker">
            ✏️ Font Color
            <input type="color" value={fontColor} onChange={e => setFontColor(e.target.value)} />
            {fontColor !== DEFAULT_FONT && <button className="holi-rst" onClick={() => setFontColor(DEFAULT_FONT)}>↺</button>}
          </label>
        </div>

        {/* ── Short / Medium Messages ── */}
        <h2 className="holi-section-label">🌈 Holi Wishes</h2>
        <div className="holi-grid">
          {MESSAGES.filter(s => !s.long).map((s, i) => {
            const idx = MESSAGES.indexOf(s);
            return (
              <div key={idx} className="holi-item">
                <div className="holi-card" ref={el => (refs.current[idx] = el)} style={{ background: bgColor, color: fontColor }}>
                  <div className="holi-border-outer" />
                  <div className="holi-border-inner" />
                  <span className="holi-cat">{s.cat}</span>
                  <div className="holi-card-h">Happy Holi!</div>
                  <div className="holi-card-sub" style={{ color: fontColor }}>Festival of Colors</div>
                  <div className="holi-shayari" style={{ color: fontColor }}>{s.text}</div>
                  <div className="holi-dots">
                    {['#ff6f91','#ffc75f','#a29bfe','#55efc4','#fd79a8'].map((c,j) => (
                      <span key={j} style={{ background: c }} />
                    ))}
                  </div>
                </div>
                <button className="holi-dl" onClick={() => download(idx)} disabled={dlIdx === idx} title="Download">
                  {dlIdx === idx ? '⏳' : '⬇️'} Download
                </button>
              </div>
            );
          })}
        </div>

        {/* ── Premium Medium-Length Messages ── */}
        <h2 className="holi-section-label">📜 Premium Messages</h2>
        <div className="holi-grid holi-grid-long">
          {MESSAGES.filter(s => s.long).map((s) => {
            const idx = MESSAGES.indexOf(s);
            return (
              <div key={idx} className="holi-item holi-item-long">
                <div className="holi-card holi-card-long" ref={el => (refs.current[idx] = el)} style={{ background: bgColor, color: fontColor }}>
                  <div className="holi-border-outer" />
                  <div className="holi-border-inner" />
                  <span className="holi-cat">{s.cat}</span>
                  <div className="holi-card-h">Happy Holi!</div>
                  {s.title && <div className="holi-card-tag" style={{ color: fontColor }}>{s.title}</div>}
                  <div className="holi-card-sub" style={{ color: fontColor }}>Festival of Colors</div>
                  <div className="holi-shayari holi-shayari-long" style={{ color: fontColor }}>{s.text}</div>
                  <div className="holi-dots">
                    {['#ff6f91','#ffc75f','#a29bfe','#55efc4','#fd79a8'].map((c,j) => (
                      <span key={j} style={{ background: c }} />
                    ))}
                  </div>
                </div>
                <button className="holi-dl" onClick={() => download(idx)} disabled={dlIdx === idx} title="Download">
                  {dlIdx === idx ? '⏳' : '⬇️'} Download
                </button>
              </div>
            );
          })}
        </div>

        <div className="holi-back-wrap">
          <button className="holi-btn-back" onClick={onBack}>← Back to Home</button>
        </div>
      </div>

      <Toast text={toast.text} show={toast.show} />
    </div>
  );
}
