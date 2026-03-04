'use client';
import { useState, useRef, useCallback } from 'react';
import '../MotivationalCard/MotivationalCard.css';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import html2canvas from 'html2canvas';
import { logDownload } from '../../services/downloadHistoryService';

const PARTICLES = ['💐', '🌸', '💖', '🌹', '✨', '🌷', '💗', '🌺', '🦋', '💝', '🕊️', '🌻'];

/* ══════════════════════════════════════════════════════
   MOTHER'S QUOTES — ENGLISH
   ══════════════════════════════════════════════════════ */
const QUOTES = [
  { text: "A mother's love whispers strength into your heart. Her presence is a blessing that lasts a lifetime." },
  { text: "She gives without asking and loves without limits. A mother's heart is the world's greatest treasure." },
  { text: "A mother sees your worth even when you doubt yourself. Her belief becomes your courage." },
  { text: "Her hands may get tired, but her love never does. That is the beauty of a mother." },
  { text: "A mother's smile can heal a thousand worries. Her voice feels like home." },
  { text: "She carries your pain without letting you know. That's how deeply a mother loves." },
  { text: "A mother doesn't just raise you; she builds your entire world. Her love is the foundation of your life." },
  { text: "She teaches you to shine even when she stands in the shadows. A mother's sacrifice is silent but powerful." },
  { text: "Her love is gentle yet strong enough to move mountains for you. That is a mother's magic." },
  { text: "A mother's prayers follow you everywhere. They protect you even when she's far away." },
  { text: "She forgives your mistakes before you even apologize. A mother's heart holds endless love." },
  { text: "A mother sees the best in you on your worst days. She reminds you of your strength when you forget it." },
  { text: "Her warmth is a shelter no storm can take away. A mother is a forever blessing." },
  { text: "She works quietly so you can dream loudly. That's a mother's devotion." },
  { text: "Her love doesn't grow old—it grows deeper. Every year makes her more precious." },
  { text: "A mother's guidance stays with you long after her words fade. Her wisdom becomes your path." },
  { text: "She carries your childhood in her memories. And your happiness in her heart." },
  { text: "A mother feels your tears before they fall. She understands your silence better than your words." },
  { text: "Her embrace is the safest place in the world. A mother's arms hold endless comfort." },
  { text: "She fights every battle for you, yet teaches you to stand on your own. That is true love." },
  { text: "A mother's love is the first light you ever see. And the last light that ever leaves you." },
  { text: "She teaches kindness not through words, but through her actions. A mother is a living lesson in love." },
  { text: "Her dreams always include you. Her happiness begins with yours." },
  { text: "A mother's heart grows with every sacrifice. And blooms with every smile of yours." },
  { text: "She makes your world beautiful even when hers is falling apart. A mother's strength is unmatched." },
  { text: "Her love wraps around you like a warm blanket. It comforts your soul in ways nothing else can." },
  { text: "A mother doesn't count her struggles. She counts your smiles." },
  { text: "She protects you from the world, even when you don't understand why. That's unconditional love." },
  { text: "Her love lights your darkest days. And her presence makes your brightest days even better." },
  { text: "A mother's sacrifices are written in silence. But their impact echoes forever." },
  { text: "She knows your heart before you speak. A mother understands beyond words." },
  { text: "Her love teaches courage. Her care teaches patience." },
  { text: "A mother gives roots and wings—roots to stay grounded, wings to fly high." },
  { text: "She stands by you in every season of life. Her love is your constant companion." },
  { text: "A mother's blessings go where you cannot see. And protect you where she cannot reach." },
  { text: "She lifts you up when you fall. And lifts your soul when you rise." },
  { text: "Her love asks for nothing, yet gives everything. That is her greatness." },
  { text: "Even in silence, a mother speaks through love. Her presence says more than words ever could." },
  { text: "A mother's love is the first gift you receive. And the last gift that stays forever." },
  { text: "Her eyes shine with pride for you. And her heart beats with hope for you." },
  { text: "She teaches you to be strong, yet reminds you it's okay to be soft. A mother balances everything." },
  { text: "Her love is your first home. And her heart is your safest place." },
  { text: "A mother gives you memories sweeter than time and love stronger than life." },
  { text: "She stands by you in ways no one else ever could. Her love is eternal." },
  { text: "A mother's voice is the melody of comfort. Her love is the rhythm of life." },
  { text: "She teaches patience through her actions. And kindness through her heart." },
  { text: "A mother's heart knows no boundaries. It loves without limits and forgives without conditions." },
  { text: "She bends so you can stand tall. She sacrifices so you can shine." },
  { text: "Her love protects, heals, and empowers. A mother is life's purest blessing." },
  { text: "No matter how old you grow, you'll always need her love. A mother is forever." },
  { text: "A mother's love protects you even when she's far away. Her blessings walk with you every step of life." },
  { text: "She turns ordinary days into beautiful memories. That is the magic only a mother can create." },
  { text: "A mother's strength holds the family together. Her softness holds the world together." },
  { text: "She gives hope when days feel heavy. And peace when life feels uncertain." },
  { text: "A mother's love shapes your heart. Her words shape your journey." },
  { text: "She carries your worries quietly. And gives you courage loudly." },
  { text: "A mother's love doesn't age—it deepens. With time, it becomes the greatest comfort." },
  { text: "She teaches you how to be gentle and strong. A rare balance only a mother masters." },
  { text: "Her heart holds your childhood. And her prayers hold your future." },
  { text: "A mother's presence turns any place into home. Her love makes every moment feel safe." },
  { text: "She celebrates your smallest victories. And supports you through your hardest moments." },
  { text: "A mother gives you wings but stays close enough to catch you. That's her silent promise." },
  { text: "Her sacrifices go unseen, but their blessings stay forever. A mother gives more than she receives." },
  { text: "She is the soft voice that guides your heart. And the strong force that shapes your will." },
  { text: "A mother's smile brightens the darkest day. Her touch heals the deepest pain." },
  { text: "She chooses your happiness over her comfort. That is her purest kind of love." },
  { text: "A mother's patience teaches kindness. Her love teaches strength." },
  { text: "She holds you close when the world feels cold. And lets you fly when your dreams take shape." },
  { text: "Her wisdom whispers in your heart long after the conversation ends. Mothers never truly leave you." },
  { text: "A mother's love is gentle enough to comfort you. And powerful enough to transform you." },
  { text: "She sees beauty in your flaws. And hope in your fears." },
  { text: "A mother invests her life in your dreams. And finds her joy in your smile." },
  { text: "Her love doesn't demand. It simply gives, protects, and uplifts." },
  { text: "She holds the family in her arms and the future in her prayers." },
  { text: "A mother may grow older, but her love remains timeless. It is the one thing that never fades." },
];

/* Background theme presets */
const THEMES = [
  { id: 'rose',    label: '🌹 Rose Garden',      bg: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', font: '#4a1942' },
  { id: 'blush',   label: '🌸 Soft Blush',       bg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', font: '#5a2d0c' },
  { id: 'lavender',label: '💜 Lavender Dream',    bg: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', font: '#3d1f5c' },
  { id: 'ocean',   label: '🌊 Calm Ocean',        bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', font: '#ffffff' },
  { id: 'sage',    label: '🌿 Sage Green',        bg: 'linear-gradient(135deg, #a8e6cf 0%, #88d8b0 100%)', font: '#1a4731' },
  { id: 'sunset',  label: '🌅 Warm Sunset',       bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', font: '#ffffff' },
  { id: 'gold',    label: '✨ Golden Hour',        bg: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', font: '#4a2800' },
  { id: 'dark',    label: '🌑 Elegant Dark',      bg: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', font: '#e0e0e0' },
];

const DEFAULT_BG = '#fce4ec';
const DEFAULT_FONT = '#4a1942';

export default function MothersCard({ onBack, userEmail }) {
  const [activeTheme, setActiveTheme] = useState('rose');
  const [customBg, setCustomBg] = useState(DEFAULT_BG);
  const [customFont, setCustomFont] = useState(DEFAULT_FONT);
  const [useCustom, setUseCustom] = useState(false);
  const [dlIdx, setDlIdx] = useState(null);
  const [toast, setToast] = useState({ text: '', show: false });
  const refs = useRef({});

  function showToast(msg) {
    setToast({ text: msg, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  }

  const theme = THEMES.find(t => t.id === activeTheme) || THEMES[0];
  const cardBg = useCustom ? customBg : theme.bg;
  const cardFont = useCustom ? customFont : theme.font;

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
        a.download = `mothers-quote-en-${idx + 1}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('✅ Card downloaded!');
        logDownload(userEmail, 'mothers-en', "Mother's Quote (English)", `Quote #${idx + 1}`, `mothers-quote-en-${idx + 1}.png`, {}).catch(() => {});
      });
    } catch {
      showToast('❌ Download failed.');
    } finally { setDlIdx(null); }
  }, [userEmail]);

  return (
    <div className="mq-screen">
      <Particles icons={PARTICLES} count={28} />

      <div className="mq-container">
        {/* Back button */}
        <div className="mq-back-wrap mq-back-top">
          <button className="mq-btn-back" onClick={onBack}>← Back to Home</button>
        </div>

        <h1 className="mq-title">💐 Mother&apos;s Quotes — English</h1>
        <p className="mq-subtitle">Beautiful words celebrating a mother&apos;s love — pick a quote, choose a theme & download free!</p>

        {/* ── Theme selector ── */}
        <div className="mq-themes">
          <h3 className="mq-themes-label">🎨 Choose Theme</h3>
          <div className="mq-theme-grid">
            {THEMES.map(t => (
              <button
                key={t.id}
                className={`mq-theme-btn ${!useCustom && activeTheme === t.id ? 'active' : ''}`}
                style={{ background: t.bg, color: t.font }}
                onClick={() => { setActiveTheme(t.id); setUseCustom(false); }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Custom color pickers ── */}
        <div className="mq-pickers">
          <label className="mq-picker" onClick={() => setUseCustom(true)}>
            🎨 Custom BG
            <input type="color" value={customBg} onChange={e => { setCustomBg(e.target.value); setUseCustom(true); }} />
          </label>
          <label className="mq-picker" onClick={() => setUseCustom(true)}>
            ✏️ Font Color
            <input type="color" value={customFont} onChange={e => { setCustomFont(e.target.value); setUseCustom(true); }} />
          </label>
          {useCustom && (
            <button className="mq-rst" onClick={() => setUseCustom(false)} title="Back to theme">↺ Reset</button>
          )}
        </div>

        {/* ── All quotes in one grid ── */}
        <div className="mq-grid">
          {QUOTES.map((q, idx) => (
            <div key={idx} className="mq-item">
              <div
                className="mq-card"
                ref={el => (refs.current[idx] = el)}
                style={{ background: cardBg, color: cardFont }}
              >
                <div className="mq-border-outer" />
                <div className="mq-border-inner" />
                <div className="mq-quote-text" style={{ color: cardFont }}>{q.text}</div>
              </div>
              <button className="mq-dl" onClick={() => download(idx)} disabled={dlIdx === idx} title="Download">
                {dlIdx === idx ? '⏳' : '⬇️'} Download
              </button>
            </div>
          ))}
        </div>
      </div>

      <Toast text={toast.text} show={toast.show} />
    </div>
  );
}
