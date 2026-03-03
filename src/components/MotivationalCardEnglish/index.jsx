'use client';
import { useState, useRef, useCallback } from 'react';
import '../MotivationalCard/MotivationalCard.css';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import html2canvas from 'html2canvas';
import { logDownload } from '../../services/downloadHistoryService';

const PARTICLES = ['✨', '🌟', '💪', '🔥', '🚀', '⭐', '💫', '🎯', '🏆', '💖', '🌻', '🦋'];

/* ══════════════════════════════════════════════════════
   ENGLISH MOTIVATIONAL QUOTES — grouped by category
   ══════════════════════════════════════════════════════ */
const QUOTES = [
  { text: "Believe in the person you are becoming. Every step forward counts, even the tiny ones." },
  { text: "Your dreams are closer than you think. Keep moving, even when progress feels slow." },
  { text: "The best version of you is built in silence. Let your work speak when the time comes." },
  { text: "Small habits create big changes. Start today, and your future self will thank you." },
  { text: "You don't need to be perfect to start. You just need the courage to begin." },
  { text: "Choose progress over perfection. Tiny consistent efforts beat big inconsistent ones." },
  { text: "Every challenge is shaping you for something greater. Trust the process and keep going." },
  { text: "Every day gives you a new chance to rise higher. Take the first step, even if it's small." },
  { text: "Your dreams are closer than your fears tell you. Trust yourself and keep moving." },
  { text: "Progress isn't always loud. Sometimes it's the quiet work that changes your life." },
  { text: "Great things happen when you stop waiting for the perfect moment. Start now and build as you go." },
  { text: "You are stronger than yesterday. And tomorrow, you'll be stronger than today." },
  { text: "Success grows from tiny daily efforts. Let consistency become your superpower." },
  { text: "Your mindset shapes your path. Think boldly, and your steps will follow." },
  { text: "Challenges are not walls, but doors waiting to be pushed open. Keep trying until they unlock." },
  { text: "Don't underestimate slow growth. Roots always grow underground before the tree appears." },
  { text: "Believe in the person you're becoming. Evolution takes time, courage, and patience." },
  { text: "Your future self is cheering for you. Don't disappoint them by giving up today." },
  { text: "One brave decision can change everything. Choose courage over comfort every time." },
  { text: "Even the brightest stars shine after darkness. Let your tough days shape your glow." },
  { text: "Your effort today becomes your strength tomorrow. Keep going even when it feels slow." },
  { text: "Life rewards the ones who stay committed. Show up every day like your dreams matter." },
  { text: "You don't need permission to chase greatness. Just begin and let your journey speak." },
  { text: "Let your dreams be louder than your doubts. And your actions louder than your excuses." },
  { text: "Every setback carries a hidden lesson. Learn from it, rise, and move forward stronger." },
  { text: "Your journey won't be perfect, but it will be worth it. Keep your heart steady and your goals clear." },
  { text: "When life feels heavy, take one small step. That's enough to keep the story moving." },
];

/* Category order for rendering */
const CATEGORIES = [
  { key: '🔥', label: '🔥 Self-Belief', color: '#ff6b35' },
  { key: '🌿', label: '🌿 Personal Growth', color: '#2ecc71' },
  { key: '☀️', label: '☀️ Courage', color: '#f1c40f' },
  { key: '💪', label: '💪 Resilience', color: '#e67e22' },
];

/* Background theme presets */
const THEMES = [
  { id: 'purple',  label: '💜 Purple Dream',    bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',  font: '#ffffff' },
  { id: 'sunset',  label: '🌅 Sunset Glow',     bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',  font: '#ffffff' },
  { id: 'ocean',   label: '🌊 Deep Ocean',       bg: 'linear-gradient(135deg, #0c3483 0%, #a2b6df 100%)', font: '#ffffff' },
  { id: 'forest',  label: '🌲 Forest Green',     bg: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)', font: '#ffffff' },
  { id: 'gold',    label: '✨ Golden Hour',       bg: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', font: '#4a2800' },
  { id: 'dark',    label: '🌑 Dark Mode',         bg: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', font: '#e0e0e0' },
  { id: 'cherry',  label: '🌸 Cherry Blossom',   bg: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', font: '#4a1942' },
  { id: 'fire',    label: '🔥 Fire Red',          bg: 'linear-gradient(135deg, #ed213a 0%, #93291e 100%)', font: '#ffffff' },
];

const DEFAULT_BG = '#1a1a2e';
const DEFAULT_FONT = '#ffffff';

export default function MotivationalCardEnglish({ onBack, userEmail }) {
  const [activeTheme, setActiveTheme] = useState('dark');
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
        a.download = `motivational-quote-en-${idx + 1}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('✅ Card downloaded!');
        logDownload(userEmail, 'motivational-en', 'Motivational Quote (English)', `Quote #${idx + 1}`, `motivational-quote-en-${idx + 1}.png`, {}).catch(() => {});
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

        <h1 className="mq-title">✨ Motivational Quotes — English</h1>
        <p className="mq-subtitle">Inspiring words to fuel your day — pick a quote, choose a theme & download free!</p>

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
