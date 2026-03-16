'use client';
import { useState, useRef, useCallback } from 'react';
import '../MotivationalCard/MotivationalCard.css';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import html2canvas from 'html2canvas';
import { logDownload } from '../../services/downloadHistoryService';
import { addWatermark } from '../../utils/watermark';

const PARTICLES = ['💖', '👨‍👧', '🌟', '🙏', '💪', '⭐', '💫', '🏆', '❤️', '🌻', '🦋', '✨'];

/* ══════════════════════════════════════════════════════
   FATHER'S QUOTES — Hindi
   ══════════════════════════════════════════════════════ */
const QUOTES = [
  { text: "पिता का प्यार कम शब्दों में होता है, पर गहराई सबसे ज़्यादा होती है। उनका साया हमेशा सुरक्षा देता है।" },
  { text: "पिता दूर से भी आपका दर्द समझ लेते हैं। और चुपचाप आपका साथ निभाते हैं।" },
  { text: "पिता का संघर्ष अक्सर दिखता नहीं, पर आपकी हर खुशी में छिपा होता है।" },
  { text: "वो कम बोलते हैं लेकिन सभी सुन लेते हैं। यही पिता का अनोखा प्यार है।" },
  { text: "पिता आपका हाथ छोड़ते हैं, पर हौसला कभी नहीं। उनकी सीख हमेशा साथ रहती है।" },
  { text: "वो आपकी ख़ुशी के लिए अपनी नींद तक कुर्बान कर देते हैं। पिता का दिल बेहद बड़ा होता है।" },
  { text: "पिता की डांट में भी प्यार छिपा होता है। और उनकी चुप्पी में भी फिक्र।" },
  { text: "पिता कम दिखते हैं, पर हर पल आपके साथ खड़े रहते हैं।" },
  { text: "उनकी मेहनत में आपका भविष्य छिपा होता है। और उनकी मुस्कान में आपका कल।" },
  { text: "पिता आपके लिए दुनिया से लड़ सकते हैं। और आपके लिए खुद से भी।" },
  { text: "वो आपको गिरने देते हैं, ताकि आप उठना सीख सकें। लेकिन कभी दूर नहीं जाते।" },
  { text: "पिता के कंधे बचपन का सहारा होते हैं। और उनकी सीख पूरी ज़िंदगी का।" },
  { text: "पिता का प्यार नदी जैसा होता है। शांत भी, गहरा भी।" },
  { text: "वो चुप रहते हैं पर सोच आपके लिए ही रखते हैं। यही पिता की फितरत है।" },
  { text: "पिता कम बोलते हैं, पर सब समझते हैं। और बिना कहे सब कर जाते हैं।" },
  { text: "उनके कदमों में अनुशासन है। और उनके दिल में अपार प्यार।" },
  { text: "वो खुद थक जाते हैं, पर आपको थकने नहीं देते। यही पिता की ताकत है।" },
  { text: "आपकी हर जीत में उनका आशीर्वाद छिपा होता है। और हर हार में उनका धैर्य।" },
  { text: "पिता के सपने आपके सपनों जैसे बन जाते हैं। और उनकी उम्मीद ही आपकी राह बनती है।" },
  { text: "वो आपके लिए दुनिया बदल देते हैं। लेकिन खुद कभी बदलने की शिकायत नहीं करते।" },
  { text: "पिता की मुस्कान में सुकून बसता है। और उनकी बातों में जीवन के सबक।" },
  { text: "वो कठोर लगते हैं, पर दिल से नर्म होते हैं। पिता की ये पहचान है।" },
  { text: "पिता की छाया में डर मिट जाता है। और हिम्मत अपने आप बढ़ जाती है।" },
  { text: "उनकी मौजूदगी सबसे बड़ी सुरक्षा है। और उनका प्यार सबसे बड़ा वरदान।" },
  { text: "पिता घर की दीवार नहीं, नींव होते हैं। जो सब संभाल कर रखते हैं।" },
  { text: "वो आपकी हर गलती माफ कर देते हैं। पर आपसे उम्मीदें कभी नहीं छोड़ते।" },
  { text: "उनकी सीख रास्ता बनाती है। और उनका प्यार मंज़िल आसान कर देता है।" },
  { text: "वो कभी 'थक गया' नहीं कहते। क्योंकि उनका हौसला आपसे जुड़ा होता है।" },
  { text: "पिता की आंखों में सपने नहीं, जिम्मेदारियां होती हैं। लेकिन आपके लिए वो हर सपना सच करते हैं।" },
  { text: "वो कम बोलते हैं, पर सही बोलते हैं। और वही जीवन का सत्य बन जाता है।" },
  { text: "पिता की सीख सरल होती है। पर असर जीवनभर रहता है।" },
  { text: "वो आपकी खुशी के लिए अपनी इच्छाएँ त्याग देते हैं। बिना किसी शिकायत के।" },
  { text: "पिता का हाथ सिर पर हो तो दुनिया आसान लगती है। और कदम मज़बूत होते हैं।" },
  { text: "वो आपको उड़ने की आज़ादी देते हैं। पर अपने प्यार से बांधकर रखते हैं।" },
  { text: "पिता समय नहीं मांगते, ज़िम्मेदारी निभाते हैं। और प्यार को कर्म से जताते हैं।" },
  { text: "उनकी आंखों में कठोरता दिखती है। पर दिल में सिर्फ आपके लिए softness बसती है।" },
  { text: "पिता की उपस्थिति आत्मविश्वास दे जाती है। और उनकी अनुपस्थिति समझदारी।" },
  { text: "वो खुद टूटकर भी आपको संभाल लेते हैं। और कभी आपको टूटने नहीं देते।" },
  { text: "पिता की चुप्पी भी एक सीख होती है। और उनकी डांट भी एक दुआ।" },
  { text: "वो घर के राजा नहीं, घर का सहारा होते हैं।" },
  { text: "पिता आपके सपनों की नींव रखते हैं। और आपको आसमान तक पहुंचाते हैं।" },
  { text: "उनका प्यार कम शब्दों में पर गहरे अर्थों में बंधा होता है।" },
  { text: "वो आपको गिरते देखते हैं, पर उठने में कभी अकेला नहीं छोड़ते।" },
  { text: "पिता का दिल बड़ा होता है। इसमें कभी शिकायत नहीं, सिर्फ प्यार होता है।" },
  { text: "वो आपकी हर जरूरत बिना बताए समझ जाते हैं। यही पिता की खूबी है।" },
  { text: "पिता घर की शान नहीं, घर की जान होते हैं।" },
  { text: "उनकी मेहनत आपकी खुशियों की वजह बनती है। और उनकी सीख आपकी हिम्मत।" },
  { text: "पिता जीवन का पहला दोस्त होता है। और उम्रभर का प्रेरणास्त्रोत।" },
  { text: "वो बातें कम करते हैं, पर एहसान बड़े करते हैं।" },
  { text: "पिता की दुआ हर मुश्किल से बचा लेती है। और उनका प्यार हर राह आसान कर देता है।" },
  { text: "पिता का प्यार गहरा होता है, पर दिखाई कम देता है। उनकी दुआएँ हमेशा बिना आवाज़ के साथ चलती हैं।" },
  { text: "पिता आपके लिए रास्ता नहीं चुनते, चलना सिखाते हैं। और फिर दूर खड़े होकर आपकी जीत पर मुस्कुराते हैं।" },
  { text: "पिता की मेहनत में आपका भविष्य छिपा होता है। उनकी रातों की नींद आपके सपनों की कीमत है।" },
  { text: "पिता का हाथ सिर पर हो तो मुश्किलें भी आसान लगती हैं। उनका विश्वास ही आपकी सबसे बड़ी ताकत बन जाता है।" },
  { text: "पिता कम बोलते हैं, पर बहुत समझते हैं। उनकी चुप्पी में भी आपका नाम लिखा होता है।" },
  { text: "वो आपको उड़ना सिखाते हैं, पर आपकी गिरावट में सबसे पहले वही खड़े मिलते हैं।" },
  { text: "पिता की मुस्कान में गर्व होता है। और उनकी खामोशी में अपार प्यार।" },
  { text: "वो सपने आपके देखते हैं, पर मेहनत अपनी लगाते हैं। यही पिता की पहचान है।" },
  { text: "पिता अपनी तकलीफ़ें छुपा लेते हैं, पर आपका दुख नहीं देख पाते। उनका दिल कड़े खोल के पीछे बेहद नरम होता है।" },
  { text: "पिता की डांट भी दुआ होती है। और उनकी झुकी आंखों में आपकी खुशी बसती है।" },
  { text: "वो आपको दुनिया से नहीं, खुद से सुरक्षित रखते हैं। क्योंकि उनके लिए आप दुनिया से भी कीमती हैं।" },
  { text: "पिता आपकी हर जरूरत महसूस करते हैं। बिना कहे उसे पूरा कर देते हैं।" },
  { text: "वो अपनी जेबें खाली कर देते हैं, पर आपका दिल भरने में कभी कमी नहीं होने देते।" },
  { text: "पिता आपकी हर आदत समझते हैं। और हर गलती सिखा कर सुधार देते हैं।" },
  { text: "उनकी गोद में दुनिया से ज़्यादा सुकून है। और उनकी बातों में पूरा जीवन बसता है।" },
  { text: "वो कम बोलकर बहुत कुछ जता देते हैं। पिता का प्यार शब्दों में नहीं, कर्मों में मिलता है।" },
  { text: "आपकी हर छोटी उपलब्धि में उनका दिल गर्व से भर जाता है। क्योंकि आपके सपने ही उनकी जीत होते हैं।" },
  { text: "पिता की आंखों में उम्मीदें नहीं, भरोसा होता है। और यही भरोसा आपकी ताकत बनता है।" },
  { text: "वो आपका हाथ हमेशा थामते नहीं, पर कभी दूर भी नहीं जाते। दूरी में भी उनका सहारा महसूस होता है।" },
  { text: "पिता की डांट में छिपी फिक्र सबसे सच्ची होती है। और उनका प्यार सबसे गहरा।" },
  { text: "वो अपने सपनों को आपकी खुशी के लिए भूल जाते हैं। और फिर भी मुस्कुराते रहते हैं।" },
  { text: "पिता की छाया बड़ी मजबूत होती है। उसमें डर भी पिघल जाता है और हौसला भी जन्म लेता है।" },
  { text: "वो आपको सिखाते हैं कि जिंदगी कैसे जी जाती है। और दिखाते हैं कि प्यार कैसे निभाया जाता है।" },
  { text: "पिता की थकान में भी आपकी ही फिक्र होती है। उनकी मुस्कान में भी आपकी ही वजह छिपी होती है।" },
  { text: "वो आपकी कमियों को नहीं, आपकी क्षमताओं को देखते हैं। और वही क्षमताएँ आपका भविष्य बनती हैं।" },
  { text: "पिता की सीख समय के साथ और गहरी हो जाती है। वो आपकी ज़िंदगी की सबसे मजबूत नींव होती है।" },
  { text: "वो आपकी मुश्किलें छुपाकर खुद संभाल लेते हैं। ताकि आपकी हंसी कभी कम न हो।" },
  { text: "पिता आपके कदम नहीं रोकते, बस दिशा दिखाते हैं। और फिर दूर से आपकी तरक्की देखते हैं।" },
  { text: "उनकी हर कुर्बानी में आपका भला छिपा होता है। और हर मुस्कान में आपकी खुशी।" },
  { text: "पिता आपकी ढाल भी हैं और आपकी ताकत भी। दोनों एक ही रूप में आपको मिलते हैं।" },
  { text: "वो खुद टूट जाएँ, पर आपको टूटने नहीं देते। यही पिता की ममता है।" },
  { text: "उनकी कठोरता केवल बाहर से होती है। भीतर तो उनका दिल आपसे ही धड़कता है।" },
  { text: "पिता की बातें छोटी लगती हैं, पर सबक बड़े बन जाते हैं। और वही सबक आपको ज़िंदगी संभालना सिखाते हैं।" },
  { text: "वो आपकी खुशियों में ही अपनी खुशी ढूंढ लेते हैं। और आपकी जीत को अपनी जीत मानते हैं।" },
  { text: "पिता आपकी राह आसान नहीं बनाते, पर चलने की ताकत ज़रूर देते हैं।" },
  { text: "उनके शब्द कम होते हैं, लेकिन असर गहरा। एक बार सुन लो, ज़िंदगी बदल जाए।" },
  { text: "वो आपको गिरने से नहीं रोकते, पर गिरकर उठना सिखाते हैं।" },
  { text: "पिता का प्यार कभी पुराना नहीं होता। हर उम्र में वही सुकून देता है।" },
  { text: "वो आपकी गलतियों को भूल जाते हैं, पर आपके गुण कभी नहीं भूलते।" },
  { text: "पिता की छवि दिल में रहती है। और उनकी सीख यादों में।" },
  { text: "वो आपको मजबूर नहीं करते, मजबूत बनाते हैं। यही उनकी परवरिश है।" },
  { text: "पिता हर मुश्किल में आपका हाथ नहीं पकड़ते, पर हर मोड़ पर आपके साथ खड़े होते हैं।" },
  { text: "वो कम थकते नहीं, बल्कि कम दिखाते हैं। आपकी खुशी के लिए हर थकान छुपा लेते हैं।" },
  { text: "पिता की दुआओं की कीमत नहीं होती, पर ताकत अनमोल होती है।" },
  { text: "वो आपकी खुशी में सबसे पहले मुस्कुराते हैं। और आपके दुख में सबसे पहले टूटते हैं।" },
  { text: "पिता के कदमों में परंपरा है। और उनके दिल में आधुनिकता भी।" },
  { text: "वो आपके साथ नहीं चलते, पर आपके पीछे खड़े रहते हैं। ताकि आप डगमगाएँ नहीं।" },
  { text: "पिता की ममता शब्दों में नहीं उतरती। वो बस महसूस होती है।" },
  { text: "वो आपकी हर सफलता पर गर्व करते हैं। पर गर्व का बोझ कभी आपको नहीं उठाते देते।" },
  { text: "पिता का प्यार सबसे पवित्र रिश्ता है। कम बोला जाता है, पर जीवनभर निभाया जाता है।" },
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

export default function FathersCard({ onBack, userEmail }) {
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
        a.download = `fathers-quote-${idx + 1}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('✅ Card downloaded!');
        logDownload(userEmail, 'fathers', 'Fathers Quote', `Quote #${idx + 1}`, `fathers-quote-${idx + 1}.png`, {}).catch(() => {});
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

        <h1 className="mq-title">👨‍👧 पिता के लिए विचार — Father&apos;s Quotes</h1>
        <p className="mq-subtitle">पिता के प्यार को शब्दों में — थीम चुनें और फ्री डाउनलोड करें!</p>

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
                <svg className="mq-card-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v2h-2V7zm0 4h2v6h-2v-6z" fill="currentColor"/><path d="M12 21.95c4.05-1.12 7-5.34 7-10.26V6.3l-7-3.11-7 3.11v5.39c0 4.92 2.95 9.14 7 10.26z" fill="currentColor" opacity=".3"/><path d="M12 3.19l7 3.11v5.39c0 4.92-2.95 9.14-7 10.26-4.05-1.12-7-5.34-7-10.26V6.3l7-3.11zM12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="currentColor"/></svg>
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
