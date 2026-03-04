'use client';
import { useState, useRef, useCallback } from 'react';
import '../MotivationalCard/MotivationalCard.css';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import html2canvas from 'html2canvas';
import { logDownload } from '../../services/downloadHistoryService';

const PARTICLES = ['💐', '🌸', '💖', '🌹', '✨', '🌷', '💗', '🌺', '🦋', '💝', '🕊️', '🙏'];

/* ══════════════════════════════════════════════════════
   माँ पर सुविचार — HINDI
   ══════════════════════════════════════════════════════ */
const QUOTES = [
  { text: "मां का प्यार शब्दों में नहीं, एहसासों में बसता है। वो बिना बोले सब समझ जाती है।" },
  { text: "मां की दुआ हर मुश्किल को पार कर देती है। उसके आशीर्वाद में अपार शक्ति होती है।" },
  { text: "मां खुद भूखी रह सकती है, पर आपको भूखा नहीं देख सकती। यही उसका पवित्र प्रेम है।" },
  { text: "मां की मुस्कान में सुकून है। और उसकी गोद में दुनिया की सबसे बड़ी राहत।" },
  { text: "वो आपकी हर गलती माफ कर देती है। क्योंकि उसके दिल में सिर्फ प्यार होता है।" },
  { text: "मां कम बोलती है, पर हर बात दिल में बस जाती है। उसकी सीख जीवनभर साथ चलती है।" },
  { text: "उसके हाथों में जादू है। वो दर्द भी मिटा देती है और डर भी।" },
  { text: "मां की नज़र आप पर रहती है, चाहे आप कितनी भी दूर चले जाएँ। उसका प्यार दूरी नहीं जानता।" },
  { text: "वो आपकी खुशी के लिए अपनी खुशी भूल जाती है। यही मां का सबसे सुंदर रूप है।" },
  { text: "मां की आंखों में दुनिया की सबसे सच्ची दुआएं बसती हैं। वो आपको हमेशा सुरक्षित रखती हैं।" },
  { text: "उसका प्यार धीमा नहीं पड़ता, बस गहरा होता जाता है। मां का दिल महासागर जैसा है।" },
  { text: "मां आपकी हर कमजोरी को ताकत में बदल देती है। उसके शब्दों में अनोखी शक्ति होती है।" },
  { text: "वो आपकी थकान समझ लेती है। और एक मुस्कान से दूर कर देती है।" },
  { text: "मां की गोद में हर चिंता खत्म हो जाती है। उसका स्पर्श औषधि जैसा है।" },
  { text: "मां आपको गिरने नहीं देती और गिरकर उठना भी सिखाती है। यही उसका संतुलित प्यार है।" },
  { text: "वो आपके लिए पूरी दुनिया से लड़ सकती है। और आपको कभी दुनिया से हारने नहीं देती।" },
  { text: "मां का दिल बहुत बड़ा होता है। उसमें दर्द भी समा सकता है और प्यार भी।" },
  { text: "उसकी दुआएं रास्ते बदल सकती हैं। उसका आशीर्वाद किस्मत लिख सकता है।" },
  { text: "मां के चेहरे पर चिंता कम, प्यार ज्यादा होता है। उसका दिल सिर्फ आपके लिए धड़कता है।" },
  { text: "वो आपकी हंसी में खुद की खुशी ढूंढ लेती है। मां का संसार आप ही होते हैं।" },
  { text: "मां की बातें छोटी होती हैं, पर असर गहरा होता है। वो जीवन की दिशा बदल देती हैं।" },
  { text: "उसकी ममता हर घाव भर देती है। और हर दुख हल्का कर देती है।" },
  { text: "मां के बिना घर घर नहीं लगता। उसकी मौजूदगी से ही जगह घर बनती है।" },
  { text: "वो आपकी हर जरूरत बिना कहे समझ जाती है। और बिना दिखाए पूरी कर देती है।" },
  { text: "मां की ममता में ईश्वर बसता है। और उसके प्यार में दुनिया की सारी भलाई।" },
  { text: "वो हजार बार टूटेगी, पर आपको टूटने नहीं देगी। यही उसकी शक्ति है।" },
  { text: "मां का दिल माफ करने में सबसे आगे होता है। क्योंकि उसके प्यार में कोई शर्त नहीं होती।" },
  { text: "उसकी सीख जिंदगी की सबसे बड़ी पूंजी होती है। जो हर समय साथ देती है।" },
  { text: "मां आपके हर आंसू को पहचानती है। और बिना पूछे पोंछ देती है।" },
  { text: "वो आपकी राह आसान नहीं बनाती, पर आपको मजबूत जरूर बनाती है।" },
  { text: "मां की दुआएं हर कदम पर आपके साथ चलती हैं। उसका आशीर्वाद छाया जैसा है।" },
  { text: "वो आपको प्यार से समझाती है और समझदारी से संभालती है। मां का तरीका अनोखा है।" },
  { text: "मां की मुस्कान से घर रोशन हो जाता है। उसकी उपस्थिति में सुकून बसता है।" },
  { text: "वो आपकी हर गलती सुधारती है, पर कभी आपका साथ नहीं छोड़ती।" },
  { text: "मां का दिल सबके दुखों को समेट सकता है। इतना विशाल उसका प्यार होता है।" },
  { text: "उसकी नसीहतें जीवन का स्थाई आधार बनती हैं। वो समय के साथ और मूल्यवान हो जाती हैं।" },
  { text: "मां हर दर्द पीछे छोड़कर आगे बढ़ना सिखाती है। और जीवन को प्रेम से भर देती है।" },
  { text: "वो आपको गिरने देती नहीं और उड़ने से रोकती नहीं। मां संतुलन है।" },
  { text: "मां की यादें सबसे कीमती होती हैं। वो जीवनभर दिल में बसती हैं।" },
  { text: "उसके प्यार में दुनिया की सारी मिठास छिपी होती है। और सारी ताकत भी।" },
  { text: "मां आपकी सबसे पहली दोस्त होती है। और आखिरी सहारा भी।" },
  { text: "उसका प्यार कभी कम नहीं होता, बस बदलता है। और हर रूप में खूबसूरत होता है।" },
  { text: "मां की डांट भी प्यार होता है। और उसके हंसने में आशीर्वाद।" },
  { text: "वो आपकी परवाह में खुद को भूल जाती है। ऐसा ही पवित्र होता है मां का दिल।" },
  { text: "मां आपकी हर खुशी ईश्वर से पहले सुन लेती है। उसकी दुआ में जादू होता है।" },
  { text: "उसकी ममता से बड़ा कोई वरदान नहीं। उसका प्यार हर डर मिटा देता है।" },
  { text: "मां की गोद में दुनिया की सबसे बड़ी सुरक्षा है। और उसके शब्दों में सबसे बड़ा ज्ञान।" },
  { text: "वो आपको सिर्फ बड़ा नहीं करती, बल्कि अच्छा इंसान बनाती है।" },
  { text: "मां की आत्मा में शांति होती है। और उसके दिल में केवल प्यार।" },
  { text: "वो आपकी मंजिलें आसान नहीं बनाती, पर रास्ता दिखाती जरूर है।" },
  { text: "मां का प्यार हर दर्द को हल्का कर देता है। उसके स्पर्श में ईश्वर का आशीर्वाद बसता है।" },
  { text: "वो आपकी हर कमी को अपनी ममता से पूरा कर देती है। मां से बढ़कर कोई नहीं।" },
  { text: "मां का दिल बहुत बड़ा होता है। उसमें दुख भी समा जाता है और दुआ भी।" },
  { text: "वो खुद रो लेती है, पर आपको रोने नहीं देती। यही मां का अनोखा प्यार है।" },
  { text: "मां की गोद में समय ठहर जाता है। और हर चिंता दूर हो जाती है।" },
  { text: "वो आपको चोट से नहीं, दुनिया से बचाने की कोशिश करती है। उसका प्यार सुरक्षा की ढाल है।" },
  { text: "मां बिना कहे आपकी हर बात समझ जाती है। उसके पास प्यार की अपनी भाषा होती है।" },
  { text: "वो आपकी मुस्कान में अपनी खुशी ढूंढ लेती है। और आपके दुख में खुद टूट जाती है।" },
  { text: "मां की दुआ हर मुश्किल आसान कर देती है। उसका आशीर्वाद जिंदगी का सबसे बड़ा सहारा है।" },
  { text: "वो आपकी हर गलती माफ कर देती है। क्योंकि उसका दिल सिर्फ प्यार जानता है।" },
  { text: "मां का साथ हो तो जिंदगी खूबसूरत लगती है। और उसके बिना सब अधूरा लगता है।" },
  { text: "वो आपकी राह आसान करने नहीं आती। पर आपको मजबूत जरूर बनाती है।" },
  { text: "मां की मुस्कान घर की रोशनी होती है। उससे ही जीवन में उजाला आता है।" },
  { text: "वो आपकी हंसी के लिए सब कुछ सह लेती है। मां त्याग की सबसे सुंदर परिभाषा है।" },
  { text: "मां की छाया में डर मिट जाता है। और हिम्मत जन्म लेती है।" },
  { text: "वो अपने सपनों को पीछे छोड़ देती है। ताकि आपका हर सपना पूरा हो सके।" },
  { text: "मां की आंखों में दुआएं होती हैं। और उसकी बांहों में सुकून।" },
  { text: "मां का दिल कभी नहीं थकता। वो हमेशा आपके लिए धड़कता रहता है।" },
  { text: "वो आपकी हर जरूरत समझती है। और हर दर्द बांट लेती है।" },
  { text: "मां का प्यार वक्त के साथ नहीं बदलता। बस और गहरा होता जाता है।" },
  { text: "वो आपकी हर गलती पर नाराज़ नहीं होती। बस आपको बेहतर बनाना चाहती है।" },
  { text: "मां के बिना जीवन की मिठास अधूरी है। उसकी उपस्थिति ही सबसे बड़ा वरदान है।" },
  { text: "वो हर पल आपकी रक्षा करती है। और हर कदम आपके साथ खड़ी रहती है।" },
  { text: "मां आपकी पहली गुरु है। और आखिरी सहारा भी।" },
  { text: "उसका प्यार सीमाओं में नहीं बंधता। वो हर उम्र में वैसा ही स्नेह देती है।" },
];

/* Background theme presets */
const THEMES = [
  { id: 'rose',    label: '🌹 गुलाबी बगीचा',    bg: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', font: '#4a1942' },
  { id: 'blush',   label: '🌸 मुलायम गुलाबी',    bg: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', font: '#5a2d0c' },
  { id: 'lavender',label: '💜 लैवेंडर',           bg: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)', font: '#3d1f5c' },
  { id: 'ocean',   label: '🌊 शांत सागर',         bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', font: '#ffffff' },
  { id: 'sage',    label: '🌿 हरी शांति',         bg: 'linear-gradient(135deg, #a8e6cf 0%, #88d8b0 100%)', font: '#1a4731' },
  { id: 'sunset',  label: '🌅 सूर्यास्त',         bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', font: '#ffffff' },
  { id: 'gold',    label: '✨ सुनहरा',             bg: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', font: '#4a2800' },
  { id: 'dark',    label: '🌑 गहरा',              bg: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', font: '#e0e0e0' },
];

const DEFAULT_BG = '#fce4ec';
const DEFAULT_FONT = '#4a1942';

export default function MothersCardHindi({ onBack, userEmail }) {
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
        a.download = `maa-suvichar-${idx + 1}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('✅ कार्ड डाउनलोड हो गया!');
        logDownload(userEmail, 'mothers', 'माँ पर सुविचार (हिन्दी)', `सुविचार #${idx + 1}`, `maa-suvichar-${idx + 1}.png`, {}).catch(() => {});
      });
    } catch {
      showToast('❌ डाउनलोड विफल।');
    } finally { setDlIdx(null); }
  }, [userEmail]);

  return (
    <div className="mq-screen">
      <Particles icons={PARTICLES} count={28} />

      <div className="mq-container">
        {/* Back button */}
        <div className="mq-back-wrap mq-back-top">
          <button className="mq-btn-back" onClick={onBack}>← वापस जाएं</button>
        </div>

        <h1 className="mq-title">💐 माँ पर सुविचार — हिन्दी</h1>
        <p className="mq-subtitle">माँ के प्यार को शब्दों में — थीम चुनें, कस्टमाइज़ करें और फ्री डाउनलोड करें!</p>

        {/* ── Theme selector ── */}
        <div className="mq-themes">
          <h3 className="mq-themes-label">🎨 थीम चुनें</h3>
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
            🎨 कस्टम बैकग्राउंड
            <input type="color" value={customBg} onChange={e => { setCustomBg(e.target.value); setUseCustom(true); }} />
          </label>
          <label className="mq-picker" onClick={() => setUseCustom(true)}>
            ✏️ फ़ॉन्ट रंग
            <input type="color" value={customFont} onChange={e => { setCustomFont(e.target.value); setUseCustom(true); }} />
          </label>
          {useCustom && (
            <button className="mq-rst" onClick={() => setUseCustom(false)} title="थीम पर वापस">↺ रीसेट</button>
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
                <svg className="mq-card-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/></svg>
                <div className="mq-quote-text" style={{ color: cardFont }}>{q.text}</div>
              </div>
              <button className="mq-dl" onClick={() => download(idx)} disabled={dlIdx === idx} title="डाउनलोड">
                {dlIdx === idx ? '⏳' : '⬇️'} डाउनलोड
              </button>
            </div>
          ))}
        </div>
      </div>

      <Toast text={toast.text} show={toast.show} />
    </div>
  );
}
