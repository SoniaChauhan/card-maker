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

        {/* ── Cards grid ── */}
        <div className="holi-grid">
          {SHAYARIS.map((s, i) => (
            <div key={i} className="holi-item">
              {/* The card (captured on download) */}
              <div className="holi-card" ref={el => (refs.current[i] = el)} style={{ background: bgColor, color: fontColor }}>
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
              <button className="holi-dl" onClick={() => download(i)} disabled={dlIdx === i} title="Download">
                {dlIdx === i ? '⏳' : '⬇️'} Download
              </button>
            </div>
          ))}
        </div>

        <div className="holi-back-wrap">
          <button className="holi-btn-back" onClick={onBack}>← Back to Home</button>
        </div>
      </div>

      <Toast text={toast.text} show={toast.show} />
    </div>
  );
}
