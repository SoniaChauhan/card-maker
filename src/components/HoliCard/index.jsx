'use client';
import { useState, useRef, useCallback } from 'react';
import './HoliCard.css';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import html2canvas from 'html2canvas';
import { logDownload } from '../../services/downloadHistoryService';

const PARTICLES = ['🌈', '💜', '💛', '💚', '💙', '🎨', '✨', '🪷', '💗', '🎉', '🌸', '💐'];

/* ── All shayaris grouped by category ── */
const SHAYARIS = [
  { cat: '🌸', text: "रंगों का हर एक कतरा,\nखुशियों का दे पैगाम।\nहोली मुबारक!" },
  { cat: '🌸', text: "गुलाल की ख़ुशबू में,\nप्यार का रंग घुल जाए।\nशुभ होली!" },
  { cat: '🌸', text: "रंगों की बरसात हो,\nखुशियों की सौगात हो।\nहोली की शुभकामनाएँ!" },
  { cat: '🌸', text: "चेहरे पर हंसी,\nदिल में प्यार—\nरंगों का त्योहार।" },
  { cat: '🌸', text: "होली के रंग,\nदिलों के संग।\nरंगीन रहे हर पल।" },
  { cat: '🌼', text: "थोड़ा सा गुलाल,\nथोड़ी सी मिठास—\nहोली बने खास!" },
  { cat: '🌼', text: "रंगों संग मुस्कान मिले,\nखुशियों की पहचान मिले।" },
  { cat: '🌼', text: "उड़ता गुलाल,\nमुस्कुराते लोग—\nहोली का जादू।" },
  { cat: '🌼', text: "रंग आपका,\nढंग आपका—\nहोली भी आपकी!" },
  { cat: '🌼', text: "मुस्कुराहटें हों बेहिसाब,\nहोली हो जनाब!" },
  { cat: '🎨', text: "तेरे संग हर रंग,\nखूबसूरत लगे।" },
  { cat: '🎨', text: "तुम हो तो हर त्योहार,\nखास बन जाता है।" },
  { cat: '🎨', text: "तेरी मुस्कान ही,\nमेरा पसंदीदा रंग।" },
  { cat: '🎨', text: "प्यार के रंग में,\nतुमसे रंगा हूँ।" },
  { cat: '🎨', text: "दिल के कैनवास पर,\nबस तुम ही तुम हो।" },
  { cat: '🙏', text: "राधा‑कृष्ण के रंग,\nआपके जीवन में ढेरों सौगातें भरें।" },
  { cat: '🙏', text: "श्री कृष्ण की कृपा से,\nरंगीनी ही रंगीनी हो।" },
  { cat: '🙏', text: "महादेव का आशीर्वाद,\nहर रंग को मंगल बना दे।" },
  { cat: '🙏', text: "रंग बरसाने वालो,\nजय श्री राधे‑कृष्ण!" },
  { cat: '🙏', text: "भगवान की कृपा में ही,\nसबसे सुंदर रंग है।" },

  /* ── Long Messages ── */
  { cat: '🙏', long: true, title: 'Devotional Style', text: "होली के इस शुभ अवसर पर भगवान कृष्ण और राधा रानी की कृपा आप पर सदा बनी रहे।\nजैसे वृंदावन में रंगों की बौछार प्रेम और भक्ति से भरी होती है,\nवैसे ही आपके जीवन में भी भक्ति, सौभाग्य और समृद्धि के रंग भरें।\nदुआ है कि आपका घर शांति, प्रेम और सकारात्मक ऊर्जा से महकता रहे।\nआप और आपके परिवार को पावन होली की हार्दिक शुभकामनाएँ।\nजय श्री कृष्ण!" },
  { cat: '💖', long: true, title: 'For Loved Ones / Couples', text: "इस होली मैं आपके जीवन में खुशियों और प्यार के अनगिनत रंग भरना चाहता/चाहती हूँ।\nआपके साथ बिताया हर पल मेरे लिए एक खूबसूरत रंग है,\nऔर हमारे रिश्ते की रंगोली हर त्योहार को और भी खास बना देती है।\nकामना है कि आने वाले सभी सालों में हम साथ मिलकर\nप्यार, सम्मान और समझदारी के नए रंग भरते रहें।\nहोली मुबारक, मेरे जीवन के सबसे प्यारे रंग!" },
  { cat: '🌈', long: true, title: 'Positive & Inspirational', text: "होली का यह रंगीन त्योहार आपके जीवन में नई ऊर्जा, नए अवसर और नए सपनों की शुरुआत करे।\nजैसे रंग एक-दूसरे में मिलकर सुंदरता पैदा करते हैं, वैसे ही आपके रिश्तों में भी प्रेम, सद्भाव और एकता के रंग घुलें।\nदुखों के सारे रंग धुल जाएँ और खुशियों का उजाला आपके जीवन के हर कोने को रोशन कर दे।\nआपके चेहरे की मुस्कान हमेशा बनी रहे—होली की हार्दिक शुभकामनाएँ!" },
  { cat: '🌸', long: true, title: 'Warm & Emotional', text: "रंगों के इस पावन त्योहार पर दिल से दुआ है कि आपके जीवन में खुशियों की बरसात हो,\nहर दिन आपके लिए एक नई उम्मीद लेकर आए,\nऔर आपके सभी रिश्तों में प्रेम और अपनापन हमेशा बना रहे।\nहोली के रंग आपकी ज़िंदगी को खुशियों, शांति और सफलता के अनगिनत रंगों से भर दें।\nआप और आपके परिवार को रंगों भरी होली की ढेरों शुभकामनाएँ!" },
  { cat: '🎨', long: true, title: 'Emotional & Beautiful Shayari', text: "रंगों की बूँदों में छुपी है दुआ मेरी,\nहर पल तुम्हारी ज़िंदगी हो हंसी से भरी।\nगिले‑शिकवे भूल कर प्यार के रंग में रंग जाओ,\nहोली है… आज खुशियों की बारिश में भीग जाओ।\nआपको और आपके परिवार को रंगों भरी शुभकामनाएँ!" },
  { cat: '🌸', long: true, title: 'Heart‑Touching Shayari', text: "होली के हर रंग में बस एक दुआ समाई है,\nआपकी खुशियों की डोरी कभी न टूटे—यही दुआ आई है।\nगुलाल की महक में रब की दयालुता मिले,\nऔर आपकी ज़िंदगी में हर कदम पर खुशियाँ खिलें।\nहोली की हार्दिक शुभकामनाएँ!" },
  { cat: '🌈', long: true, title: 'Romantic Shayari', text: "तेरे मेरे रिश्ते की रंगत कुछ ऐसी ही रहे,\nहर त्योहार में हमारी हंसी यूँ ही खिली रहे।\nइस होली चलो प्यार के नए रंग भरते हैं,\nसपनों की दुनिया में साथ‑साथ चलते हैं।\nहोली मुबारक, मेरे प्रिय!" },
  { cat: '🌼', long: true, title: 'Radha–Krishna Shayari', text: "बरसाने की होली की महक तेरे घर आ जाए,\nराधा‑कृष्ण का प्रेम तेरी आत्मा को छू जाए।\nरंगों के इस त्योहार पर बस यही वरदान मिले,\nतेरी जिंदगी में खुशियों के हजारों रंग खिलें।\nजय श्री कृष्ण – शुभ होली!" },
  { cat: '✨', long: true, title: 'Inspirational Shayari', text: "रंगों की तरह जिंदगी में भी आसमान भर जाए,\nहर कदम पर नई उम्मीद और नई रौशनी मिल जाए।\nहोली का ये त्योहार सिर्फ चेहरे नहीं दिल भी रंग दे,\nऔर हर दुख का रंग धुलकर खुशियों का रंग चढ़ जाए।\nआपको होली की ढेरों शुभकामनाएँ!" },
  { cat: '🌻', long: true, title: 'Family Friendly Shayari', text: "रंगों से भरी पिचकारी है, दिलों में भी खुशहाली है,\nहोली आई खुशियाँ लाई—बस इतनी सी कहानी है।\nमिठास हो रिश्तों में और घर में बस रौनक छा जाए,\nरंगों का ये त्योहार आपके जीवन में सुख‑समृद्धि ले आए।\nहोली मुबारक!" },
];

const DEFAULT_BG = '#fffde7';
const DEFAULT_FONT = '#4a148c';

export default function HoliCard({ onBack, userEmail }) {
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
        a.download = `holi-shayari-${idx + 1}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('✅ Card downloaded!');
        logDownload(userEmail, 'holi', 'Holi Wishes', `Holi Shayari #${idx + 1}`, `holi-shayari-${idx + 1}.png`, {}).catch(() => {});
      });
    } catch {
      showToast('❌ Download failed.');
    } finally { setDlIdx(null); }
  }, [userEmail]);

  return (
    <div className="holi-screen">
      <Particles icons={PARTICLES} count={28} />

      <div className="holi-container">
        <div className="holi-back-wrap holi-back-top">
          <button className="holi-btn-back" onClick={onBack}>← Back to Home</button>
        </div>
        <h1 className="holi-title">🌈 Happy Holi Wishes</h1>
        <p className="holi-subtitle">Pick your favorite shayari, customize colors & download!</p>

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

        {/* ── Short Shayari Cards ── */}
        <h2 className="holi-section-label">🌸 Short Shayaris</h2>
        <div className="holi-grid">
          {SHAYARIS.filter(s => !s.long).map((s, i) => {
            const idx = SHAYARIS.indexOf(s);
            return (
              <div key={idx} className="holi-item">
                <div className="holi-card" ref={el => (refs.current[idx] = el)} style={{ background: bgColor, color: fontColor }}>
                  <div className="holi-border-outer" />
                  <div className="holi-border-inner" />
                  <span className="holi-cat">{s.cat}</span>
                  <div className="holi-card-h">Happy Holi!</div>
                  <div className="holi-card-sub" style={{ color: fontColor }}>होली की शुभकामनाएँ</div>
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

        {/* ── Long Messages & Shayaris ── */}
        <h2 className="holi-section-label">📜 Long Messages & Shayaris</h2>
        <div className="holi-grid holi-grid-long">
          {SHAYARIS.filter(s => s.long).map((s) => {
            const idx = SHAYARIS.indexOf(s);
            return (
              <div key={idx} className="holi-item holi-item-long">
                <div className="holi-card holi-card-long" ref={el => (refs.current[idx] = el)} style={{ background: bgColor, color: fontColor }}>
                  <div className="holi-border-outer" />
                  <div className="holi-border-inner" />
                  <span className="holi-cat">{s.cat}</span>
                  <div className="holi-card-h">Happy Holi!</div>
                  {s.title && <div className="holi-card-tag" style={{ color: fontColor }}>{s.title}</div>}
                  <div className="holi-card-sub" style={{ color: fontColor }}>होली की शुभकामनाएँ</div>
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

      </div>

      <Toast text={toast.text} show={toast.show} />
    </div>
  );
}
