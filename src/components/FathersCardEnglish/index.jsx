'use client';
import { useState, useRef, useCallback } from 'react';
import '../MotivationalCard/MotivationalCard.css';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import html2canvas from 'html2canvas';
import { logDownload } from '../../services/downloadHistoryService';

const PARTICLES = ['💖', '👨‍👧', '🌟', '🙏', '💪', '⭐', '💫', '🏆', '❤️', '🌻', '🦋', '✨'];

/* ══════════════════════════════════════════════════════
   FATHER'S QUOTES — English
   ══════════════════════════════════════════════════════ */
const QUOTES = [
  { text: "A father's strength builds your confidence. His quiet love shapes your heart forever." },
  { text: "He may not say it often, but his actions speak love. A father's care is felt in every step you take." },
  { text: "A father teaches you how to stand tall. Even when life tries to push you down." },
  { text: "His guidance becomes your inner voice. His values become your lifetime compass." },
  { text: "A father's love is steady, deep, and unwavering. It grows even when unspoken." },
  { text: "He works silently so you can dream loudly. That's the beauty of a father's sacrifice." },
  { text: "A father doesn't give you the world—he teaches you how to win it. And he walks behind you to support every step." },
  { text: "You become stronger when you know he believes in you. A father's belief is the biggest motivation." },
  { text: "He protects you without making it obvious. That's how fathers love—quiet but powerful." },
  { text: "A father is the first hero you admire. And the lifelong guide you trust." },
  { text: "He gives without expecting anything back. That's why a father's love is priceless." },
  { text: "A father's words may be few, but his heart is full. His love is seen in everything he does." },
  { text: "He doesn't show his struggles, only his strength. That's how he keeps you fearless." },
  { text: "A father stands like a shield between you and the world. His presence makes you brave." },
  { text: "He inspires you not by what he says, but by how he lives. His example becomes your courage." },
  { text: "A father's hug may be rare, but his love is constant. You feel it even in silence." },
  { text: "He works hard today so your tomorrow can shine brighter. That is a father's silent promise." },
  { text: "A father gives his time, his effort, his strength. And he calls it love." },
  { text: "With a father beside you, fears seem smaller. Dreams feel closer." },
  { text: "He stands behind you when you hesitate. And beside you when you rise." },
  { text: "A father's smile hides a thousand sacrifices. His strength hides a thousand pains." },
  { text: "He may not always say 'I love you,' but he shows it a thousand ways. That's a father." },
  { text: "A father teaches you to be humble in success. And brave in failure." },
  { text: "His lessons stay long after his words fade. A father's wisdom is forever." },
  { text: "He holds your hand when you're small. And holds your heart forever." },
  { text: "A father builds your courage with his patience. And your dreams with his faith." },
  { text: "His love is not loud, but it is strong. It stays with you wherever you go." },
  { text: "A father gives you roots and wings. Roots to stay grounded, wings to rise high." },
  { text: "He works quietly behind the scenes. So you can shine confidently on the stage." },
  { text: "A father's presence is a blessing. His love is a lifetime gift." },
  { text: "He listens even when you think he's not watching. A father notices everything." },
  { text: "His love guides you in childhood. His wisdom guides you forever." },
  { text: "He stands tall so you can learn to stand stronger. That's a father's love." },
  { text: "A father believes in your dreams even before you do. That belief becomes your strength." },
  { text: "He never stops caring, even when you grow up. A father's love has no age limit." },
  { text: "A father's discipline shapes your character. His love shapes your soul." },
  { text: "He is the calm in your chaos. And the strength in your weakness." },
  { text: "A father shows love through actions. Not promises, but presence." },
  { text: "His protection makes you fearless. His love makes you unstoppable." },
  { text: "A father may not have superpowers, but he becomes your hero anyway. Because his love is real." },
  { text: "He sacrifices his comfort for your dreams. That's the purity of a father's heart." },
  { text: "A father teaches you courage by living it. And teaches love by giving it." },
  { text: "He holds your world together with his strength. And fills it with love in silence." },
  { text: "A father corrects you not to hurt you. But to prepare you for life." },
  { text: "He may look strong, but his heart melts for you. That's the magic of a father's love." },
  { text: "A father's love doesn't fade with time. It becomes stronger with every memory." },
  { text: "He lifts you when you fall. And cheers the loudest when you rise." },
  { text: "A father thinks before you think. He cares before you ask." },
  { text: "His guidance becomes your confidence. His love becomes your foundation." },
  { text: "He is your first protector and your forever supporter. That's the role only a father can play." },
  { text: "A father carries the world on his shoulders so his child can walk freely. His love is the quiet strength behind every success." },
  { text: "He may not ask for appreciation, yet he deserves the world. A father's love is the most selfless form of devotion." },
  { text: "A father teaches you to stand firm when life shakes you. His courage becomes the foundation you grow on." },
  { text: "He gives you the confidence to try again. Because to him, you will always be capable of more than you know." },
  { text: "A father's love is felt most on the days you struggle. His faith becomes your hidden strength." },
  { text: "He works hard so you can rise higher than he ever could. That is the beauty of a father's heart." },
  { text: "A father's silence is filled with endless care. His every action says, 'I'm here for you.'" },
  { text: "He lifts you up with his wisdom. And protects you with his experience." },
  { text: "A father believes in discipline, but his love is gentle. He shapes you without breaking you." },
  { text: "He stands steady so you can lean on him. And he smiles quietly watching you grow stronger." },
  { text: "A father gives you the tools to build your own life. And the courage to use them." },
  { text: "He listens more than he speaks. That's how he understands everything you don't say." },
  { text: "A father's pride is not loud, but it is deep. His heart celebrates every victory of yours." },
  { text: "He guides you through storms without showing his own battles. That's the strength of a father." },
  { text: "A father's advice becomes your anchor. His love becomes your compass." },
  { text: "He may seem strict, but every rule comes from love. He only wants you to become your best self." },
  { text: "A father never stops believing in your dreams. Even when you start doubting them." },
  { text: "His love is woven into every sacrifice he makes. Even those you never see." },
  { text: "A father stands like a lighthouse — quietly guiding you home. His presence gives direction to your journey." },
  { text: "He protects you from storms, yet teaches you how to fight them. That's how fathers build strength." },
  { text: "A father's heart is steady even when life is not. His love is the calm you return to." },
  { text: "He teaches you resilience by living it. His life becomes your inspiration." },
  { text: "A father's arms may grow old, but his love never does. It holds you forever." },
  { text: "He sees your potential long before you do. And pushes you gently toward it." },
  { text: "A father fights unseen battles so you don't have to. His bravery keeps your world safe." },
  { text: "He leads by example, not by words. And that makes his lessons unforgettable." },
  { text: "A father's love is constant even when life changes. He remains your safest place." },
  { text: "He teaches you the value of effort. And the strength of humility." },
  { text: "A father's encouragement becomes your courage. His trust becomes your confidence." },
  { text: "He guides you through life's noise with quiet wisdom. His presence is your clarity." },
  { text: "A father protects your heart by strengthening your spirit. That's how he prepares you for the world." },
  { text: "He stands tall so you can see the world clearly. His guidance removes your fears." },
  { text: "A father's love doesn't fade — it evolves. And grows with every stage of your life." },
  { text: "He shows you what responsibility looks like. And what unconditional love feels like." },
  { text: "A father's lessons follow you everywhere. They become the strength behind every good decision." },
  { text: "He gives endlessly without expecting anything in return. That is the purest form of love." },
  { text: "A father's presence turns challenges into lessons. And failures into opportunities." },
  { text: "He may not always be right, but he's always there. And that makes all the difference." },
  { text: "A father's love lights your path. Even in the darkest moments." },
  { text: "He teaches you not to fear the world. Because he has already faced it for you." },
  { text: "A father carries your childhood in his memory. And your dreams in his heart." },
  { text: "He walks beside you in silence. But in that silence lives a lifetime of love." },
  { text: "A father shapes your character with patience. And your courage with resilience." },
  { text: "He teaches you to rise after every fall. Because he knows you are stronger than you think." },
  { text: "A father's love stays with you long after his words fade. It becomes a part of who you are." },
  { text: "He worries for you quietly. And prays for you endlessly." },
  { text: "A father builds your tomorrow by sacrificing his today. That's the depth of his love." },
  { text: "He teaches you to be gentle with others. And strong for yourself." },
  { text: "A father's love is firm yet soft. It corrects, protects, and guides." },
  { text: "He may not show emotions easily. But his heart beats with love only for you." },
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

export default function FathersCardEnglish({ onBack, userEmail }) {
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
        a.download = `fathers-quote-en-${idx + 1}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('✅ Card downloaded!');
        logDownload(userEmail, 'fathers-en', 'Father\'s Quote (English)', `Quote #${idx + 1}`, `fathers-quote-en-${idx + 1}.png`, {}).catch(() => {});
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

        <h1 className="mq-title">👨‍👧 Father&apos;s Quotes — English</h1>
        <p className="mq-subtitle">Heartfelt words for the greatest hero — pick a theme &amp; download free!</p>

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
