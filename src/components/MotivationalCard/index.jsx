'use client';
import { useState, useRef, useCallback } from 'react';
import './MotivationalCard.css';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import html2canvas from 'html2canvas';
import { logDownload } from '../../services/downloadHistoryService';
import { addWatermark } from '../../utils/watermark';

const PARTICLES = ['✨', '🌟', '💪', '🔥', '🚀', '⭐', '💫', '🎯', '🏆', '💖', '🌻', '🦋'];

/* ══════════════════════════════════════════════════════
   MOTIVATIONAL QUOTES — grouped by category
   ══════════════════════════════════════════════════════ */
const QUOTES = [
  /* ── 🔥 Success / सफलता ── */
  { cat: '🔥', catLabel: 'सफलता', text: "सपने पूरे करने की शुरुआत विश्वास से होती है। अगर तुम खुद पर भरोसा कर लो, तो मुश्किल रास्ते भी आसान लगने लगते हैं। हर दिन थोड़ा-थोड़ा आगे बढ़ो। एक दिन वही छोटे कदम बड़ी सफलता की कहानी बन जाएंगे।" },
  { cat: '🔥', catLabel: 'सफलता', text: "जो इंसान हर दिन थोड़ा-सा भी सुधार करता है, एक दिन वही सबसे आगे निकल जाता है। सफलता अचानक नहीं मिलती, लेकिन कोशिशें कभी बेकार नहीं जातीं। खुद पर विश्वास रखो — तुम जितना सोचते हो, उससे ज़्यादा सक्षम हो।" },
  { cat: '🔥', catLabel: 'सफलता', text: "सफलता उसे मिलती है जो हर बार गिरकर उठना जानता है। रास्ते कठिन हो सकते हैं, लेकिन मंज़िल उन्हीं की है जो रुकते नहीं।" },
  { cat: '🔥', catLabel: 'सफलता', text: "कामयाबी कोई मंज़िल नहीं, एक सफ़र है। हर छोटी कोशिश तुम्हें उस मुकाम तक ले जाएगी जहाँ दुनिया तुम्हें सलाम करेगी।" },
  { cat: '🔥', catLabel: 'सफलता', text: "मेहनत इतनी खामोशी से करो कि सफलता शोर मचा दे। जो लोग आज तुम पर हँस रहे हैं, कल वही तुम्हारी कहानी सुनाएँगे।" },
  { cat: '🔥', catLabel: 'सफलता', text: "सफलता का कोई शॉर्टकट नहीं होता। रोज़ एक कदम बढ़ाओ, धैर्य रखो और मेहनत करते रहो — नतीजे खुद बोलेंगे।" },
  { cat: '🔥', catLabel: 'सफलता', text: "सपने तभी सच होते हैं जब मेहनत साथ चलती है। बस थोड़ा-सा हर दिन आगे बढ़ते रहो।" },
  { cat: '🔥', catLabel: 'सफलता', text: "खुद पर विश्वास रखो, दुनिया मानने लगेगी। एक-एक कदम तुम्हें सफलता की ओर ले जा रहा है।" },

  /* ── 🌿 Life / ज़िंदगी ── */
  { cat: '🌿', catLabel: 'ज़िंदगी', text: "अंधेरा चाहे कितना भी गहरा क्यों न हो, सुबह का उजाला कभी रुकता नहीं। ठीक उसी तरह, मुश्किलें चाहे जितनी हों, आपकी मेहनत का फल जरूर मिलेगा। धैर्य रखो, मेहनत करते रहो — समय बदलने में देर नहीं लगती।" },
  { cat: '🌿', catLabel: 'ज़िंदगी', text: "जब तक टूटने की नौबत न आए, इंसान अपनी ताकत नहीं पहचानता। मुश्किलें आपको पछाड़ने नहीं आतीं, वे आपको मजबूत बनाने आती हैं। बस चलते रहो — आपकी जीत रास्ते में ही है।" },
  { cat: '🌿', catLabel: 'ज़िंदगी', text: "ज़िंदगी एक किताब है और हर दिन एक नया पन्ना। बुरे दिन सिर्फ़ एक अध्याय हैं, पूरी कहानी नहीं। आगे बहुत कुछ अच्छा लिखा है।" },
  { cat: '🌿', catLabel: 'ज़िंदगी', text: "वक़्त सबसे बड़ा उस्ताद है — वो सिखाता है कि कौन साथ है और कौन बस दिखावा। सब्र रखो, ज़िंदगी हर सवाल का जवाब देती है।" },
  { cat: '🌿', catLabel: 'ज़िंदगी', text: "ज़िंदगी में कभी-कभी रास्ते खो जाते हैं, लेकिन भटकना भी सीखने का हिस्सा है। हर मोड़ पर एक नया सबक मिलता है।" },
  { cat: '🌿', catLabel: 'ज़िंदगी', text: "ज़िंदगी छोटी है — शिकायतों में मत गुज़ारो। जो है उसमें खुश रहो, जो नहीं है उसके लिए मेहनत करो।" },

  /* ── 💖 Love / प्यार ── */
  { cat: '💖', catLabel: 'प्यार', text: "प्यार वो ताकत है जो टूटे दिलों को जोड़ती है और अकेलेपन को दूर भगाती है। जहाँ प्यार है, वहाँ उम्मीद है।" },
  { cat: '💖', catLabel: 'प्यार', text: "सच्चा प्यार वो है जो बिना शर्त हो — जो बुरे वक़्त में साथ निभाए और अच्छे वक़्त में ख़ुश हो।" },
  { cat: '💖', catLabel: 'प्यार', text: "प्यार सिर्फ़ कहने से नहीं, निभाने से होता है। जो हर मुश्किल में तुम्हारा हाथ पकड़े, वही सच्चा साथी है।" },
  { cat: '💖', catLabel: 'प्यार', text: "मोहब्बत में ताकत इतनी होती है कि वो पत्थर दिलों को भी मोम बना दे। प्यार बाँटो — दुनिया खूबसूरत बन जाएगी।" },
  { cat: '💖', catLabel: 'प्यार', text: "दुनिया की सबसे बड़ी ताकत प्यार है — वो जहाँ होता है, वहाँ अंधेरा नहीं टिकता।" },
  { cat: '💖', catLabel: 'प्यार', text: "हर इंसान प्यार का हक़दार है। कभी-कभी बस ज़रूरत होती है किसी के कहने की — 'मैं हूँ ना तुम्हारे साथ।'" },

  /* ── ☀️ Positivity / सकारात्मकता ── */
  { cat: '☀️', catLabel: 'सकारात्मकता', text: "ज़िंदगी में जीत उसी की होती है जो हार से नहीं डरता। जब आप ठान लेते हो कि रुकना नहीं है, तब दुनिया की कोई ताकत आपको रोक नहीं सकती। कोशिश करते रहो, मंज़िल खुद चलकर तुम्हारे करीब आएगी।" },
  { cat: '☀️', catLabel: 'सकारात्मकता', text: "हर सुबह एक नया मौका है — कल से बेहतर बनने का। उठो, मुस्कुराओ, और दुनिया को दिखाओ कि तुम क्या कर सकते हो।" },
  { cat: '☀️', catLabel: 'सकारात्मकता', text: "नकारात्मक सोच को दरवाज़े पर छोड़ दो। जब तुम सकारात्मक सोचते हो, तो ब्रह्मांड भी तुम्हारे पक्ष में काम करने लगता है।" },
  { cat: '☀️', catLabel: 'सकारात्मकता', text: "मुस्कुराना सीखो — ज़िंदगी बदल जाएगी। जो खुश रहता है, वो दूसरों को भी खुशी बाँटता है।" },
  { cat: '☀️', catLabel: 'सकारात्मकता', text: "बुरा वक़्त हमेशा नहीं रहता। जैसे रात के बाद सुबह आती है, वैसे ही मुश्किलों के बाद खुशियाँ ज़रूर आती हैं।" },
  { cat: '☀️', catLabel: 'सकारात्मकता', text: "अपने आप पर यकीन रखो। तुम उन सब चीज़ों के काबिल हो जिनका तुम सपना देखते हो। बस हिम्मत मत हारो।" },
  { cat: '☀️', catLabel: 'सकारात्मकता', text: "समय भले लग जाए, पर मेहनत कभी बेकार नहीं जाती। भरोसा रखो, सब अच्छा होगा।" },
  { cat: '☀️', catLabel: 'सकारात्मकता', text: "हर नया दिन एक नया मौका है। उसे बेकार मत जाने दो।" },

  /* ── 💪 Strength / हिम्मत ── */
  { cat: '💪', catLabel: 'हिम्मत', text: "हार मानना आसान है, लेकिन लड़ना ही ज़िंदगी है। जो तूफ़ानों में भी खड़ा रहता है, जीत उसी की होती है।" },
  { cat: '💪', catLabel: 'हिम्मत', text: "जब लगे कि सब ख़त्म हो गया, तब याद रखो — यही वो मोड़ है जहाँ से नई शुरुआत होती है।" },
  { cat: '💪', catLabel: 'हिम्मत', text: "तुम्हारी हिम्मत ही तुम्हारी सबसे बड़ी ताकत है। किसी के भरोसे मत बैठो — खुद अपना रास्ता बनाओ।" },
  { cat: '💪', catLabel: 'हिम्मत', text: "जो डर कर रुक जाता है, वो कभी जीत नहीं पाता। हिम्मत करो, कदम बढ़ाओ — मंज़िल इंतज़ार कर रही है।" },
  { cat: '💪', catLabel: 'हिम्मत', text: "शेर कभी भेड़ों की राय से नहीं डरता। अपनी राह पर चलो, लोग अपने आप रास्ता दे देंगे।" },
  { cat: '💪', catLabel: 'हिम्मत', text: "टूटकर बिखरना कमज़ोरी नहीं — टूटकर फिर से जुड़ना ही असली ताकत है।" },
  { cat: '💪', catLabel: 'हिम्मत', text: "हार मत मानो, कोशिश करने वालों की ही जीत होती है। आज नहीं तो कल, मंज़िल ज़रूर मिलेगी।" },
  { cat: '💪', catLabel: 'हिम्मत', text: "मुश्किलें रास्ता रोकने नहीं आतीं, मजबूत बनाने आती हैं। चलते रहो — जीत करीब है।" },
];

/* Category order for rendering */
const CATEGORIES = [
  { key: '🔥', label: '🔥 सफलता — Success', color: '#ff6b35' },
  { key: '🌿', label: '🌿 ज़िंदगी — Life', color: '#2ecc71' },
  { key: '💖', label: '💖 प्यार — Love', color: '#e74c8b' },
  { key: '☀️', label: '☀️ सकारात्मकता — Positivity', color: '#f1c40f' },
  { key: '💪', label: '💪 हिम्मत — Strength', color: '#e67e22' },
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

export default function MotivationalCard({ onBack, userEmail }) {
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
      addWatermark(canvas);
      canvas.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `motivational-quote-${idx + 1}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('✅ Card downloaded!');
        logDownload(userEmail, 'motivational', 'Motivational Quote', `Quote #${idx + 1}`, `motivational-quote-${idx + 1}.png`, {}).catch(() => {});
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

        <h1 className="mq-title">✨ Motivational Quotes Cards</h1>
        <p className="mq-subtitle">प्रेरणादायक विचार — Choose a quote, pick a theme & download free!</p>

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

        {/* ── Quotes by category ── */}
        {CATEGORIES.map(category => {
          const catQuotes = QUOTES.filter(q => q.cat === category.key);
          if (catQuotes.length === 0) return null;
          return (
            <div key={category.key}>
              <h2 className="mq-section-label" style={{ borderLeftColor: category.color }}>
                {category.label}
              </h2>
              <div className="mq-grid">
                {catQuotes.map((q) => {
                  const idx = QUOTES.indexOf(q);
                  return (
                    <div key={idx} className="mq-item">
                      <div
                        className="mq-card"
                        ref={el => (refs.current[idx] = el)}
                        style={{ background: cardBg, color: cardFont }}
                      >
                        <div className="mq-border-outer" />
                        <div className="mq-border-inner" />
                        <svg className="mq-card-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" fill="currentColor"/></svg>
                        <div className="mq-quote-text" style={{ color: cardFont }}>{q.text}</div>
                      </div>
                      <button className="mq-dl" onClick={() => download(idx)} disabled={dlIdx === idx} title="Download">
                        {dlIdx === idx ? '⏳' : '⬇️'} Download
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <Toast text={toast.text} show={toast.show} />
    </div>
  );
}
