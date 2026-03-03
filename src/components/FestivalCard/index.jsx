'use client';
import { useState, useEffect } from 'react';
import './FestivalCard.css';
import FestivalForm from './FestivalForm';
import FestivalCardPreview from './FestivalCardPreview';
import CardActions from '../shared/CardActions';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import LanguagePicker from '../shared/LanguagePicker';
import PaymentPopup from '../shared/PaymentPopup';
import HoliTemplateChooser from './HoliTemplateChooser';
import useDownload from '../../hooks/useDownload';
import { toFilename } from '../../utils/helpers';
import { LANGUAGES } from '../../utils/translations';
import { saveTemplate, updateTemplate } from '../../services/templateService';
import { logDownload } from '../../services/downloadHistoryService';
import { hasUserPaid, getCardPrice } from '../../services/paymentService';

/* ── Festival definitions ── */
export const HOLI_FESTIVAL = { id: 'holi', label: 'Holi Celebration Card', icon: '🌈', tag: 'Holi Card', desc: 'Vibrant and colorful Holi greeting card with playful splashes, gulaal effects, and festive typography.' };

export const FESTIVALS = [
  { id: 'diwali',      label: 'Diwali Wishes Card',           icon: '🪔', tag: 'Diwali Card',       desc: 'Elegant Deepawali greeting card featuring diyas, rangoli, lights, and auspicious festive elements.' },
  { id: 'lohri',       label: 'Lohri Festival Card',          icon: '🔥', tag: 'Lohri Card',        desc: 'Warm Lohri greeting card inspired by bonfire, dhol beats, winter theme, and Punjabi culture.' },
  { id: 'navratri',    label: 'Navratri Greeting Card',       icon: '✨', tag: 'Navratri Card',     desc: 'Devotional card with Maa Durga, garba theme, and festive colors for Shubh Navratri.' },
  { id: 'eid',         label: 'Eid Mubarak Card',             icon: '🌙', tag: 'Eid Card',          desc: 'Elegant Eid greeting card featuring moon, stars, lanterns, and traditional patterns.' },
  { id: 'christmas',   label: 'Christmas Wishes Card',        icon: '🎄', tag: 'Christmas Card',    desc: 'Warm Christmas greeting card with Santa, snowflakes, bells, and festive ornaments.' },
  { id: 'rakhi',       label: 'Rakhi Greeting Card',          icon: '🎎', tag: 'Rakhi Card',        desc: 'Beautiful card featuring rakhi patterns, brother-sister bond theme, and traditional motifs.' },
  { id: 'mothersday',  label: "Mother's Day Greeting Card",   icon: '💐', tag: "Mother's Day Card", desc: 'Soft, floral design to celebrate love and gratitude for mothers.' },
  { id: 'fathersday',  label: "Father's Day Greeting Card",   icon: '👔', tag: "Father's Day Card", desc: 'Bold and warm design celebrating fathers and their strength.' },
  { id: 'newyear',     label: 'New Year Wishes Card',         icon: '🎉', tag: 'New Year Card',     desc: 'Sparkling theme with fireworks, lights, and a joyful greeting layout.' },
];

const INIT = {
  festival: 'diwali',
  senderName: '',
  recipientName: '',
  message: '',
  customGreeting: '',
  photo: null,
  photoPreview: '',
  bgColor: '',
  selectedTemplate: 1,
};

const PARTICLES_MAP = {
  holi:       ['🌈', '💜', '💛', '💚', '💙', '🎨', '✨', '🪷'],
  diwali:     ['🪔', '✨', '🎆', '🎇', '🌟', '💫', '🕯️', '🎉'],
  lohri:      ['🔥', '🌾', '🥜', '✨', '🎵', '🪘', '🌟', '🎊'],
  navratri:   ['✨', '💃', '🔴', '🟡', '🟢', '🪷', '🌺', '🙏'],
  eid:        ['🌙', '⭐', '✨', '🕌', '🏮', '🌟', '💫', '🎊'],
  christmas:  ['🎄', '🎅', '❄️', '🔔', '⭐', '🎁', '✨', '🌟'],
  rakhi:      ['🎎', '💖', '✨', '🌸', '🌺', '🎀', '🌟', '💐'],
  mothersday: ['💐', '🌸', '💖', '🌹', '✨', '🌷', '💗', '🌺'],
  fathersday: ['👔', '🏆', '⭐', '💪', '✨', '🎉', '💙', '🌟'],
  newyear:    ['🎉', '🎆', '🎇', '✨', '🥂', '🌟', '💫', '🎊'],
};

const BG_SWATCHES = [
  { color: '',        label: 'Default' },
  { color: '#fff8e1', label: 'Champagne' },
  { color: '#fce4ec', label: 'Blush Pink' },
  { color: '#e8f5e9', label: 'Sage' },
  { color: '#e3f2fd', label: 'Sky Blue' },
  { color: '#f3e5f5', label: 'Lavender' },
  { color: '#fff3e0', label: 'Peach' },
  { color: '#ffffff', label: 'White' },
  { color: '#1a0a2e', label: 'Deep Purple' },
  { color: '#0d1b2a', label: 'Midnight Blue' },
];

const CARD_TYPE = 'festivalcards';
const CARD_LABEL = 'Festival Greeting Card';

export default function FestivalCard({ onBack, userEmail, initialData, templateId: initTplId, isSuperAdmin, lockedFestival }) {
  /* When lockedFestival is set, use only that festival */
  const allFestivals = lockedFestival === 'holi' ? [HOLI_FESTIVAL] : FESTIVALS;
  const effectiveInit = lockedFestival ? { ...INIT, festival: lockedFestival } : INIT;
  const effectiveCardType = lockedFestival === 'holi' ? 'holicard' : CARD_TYPE;
  const effectiveCardLabel = lockedFestival === 'holi' ? 'Holi Celebration Card' : CARD_LABEL;
  const [step, setStep]     = useState('form');
  const [data, setData]     = useState(initialData ? { ...effectiveInit, ...initialData } : effectiveInit);
  const [errors, setErrors] = useState({});
  const [lang, setLang]     = useState('en');
  const [saving, setSaving] = useState(false);
  const [templateId, setTemplateId] = useState(initTplId || null);
  const [paid, setPaid]     = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showChooser, setShowChooser] = useState(false);

  const festival = allFestivals.find(f => f.id === data.festival) || (lockedFestival === 'holi' ? HOLI_FESTIVAL : allFestivals[0]);
  const filename = `festival-${toFilename(festival.tag)}-${toFilename(data.recipientName || 'card')}.png`;
  const dlTitle = data.recipientName ? `${festival.label} for ${data.recipientName}` : festival.label;
  const { downloading, handleDownload, toast, watermarkRef } = useDownload('festival-card-print', filename, {
    onSuccess: () => logDownload(userEmail, 'festival', 'Festival Greeting Card', dlTitle, filename, data).catch(() => {}),
    addWatermark: true,
  });

  /* Check payment status on mount */
  useEffect(() => {
    if (isSuperAdmin) { setPaid(true); watermarkRef.current = false; return; }
    if (!userEmail) return;
    hasUserPaid(userEmail, effectiveCardType).then(p => {
      setPaid(p);
      watermarkRef.current = !p;
    }).catch(() => {});
  }, [userEmail, isSuperAdmin]);

  function onChange(e) {
    const { name, value, files } = e.target;
    if (name === 'photo' && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setData(d => ({ ...d, photo: files[0], photoPreview: reader.result }));
      reader.readAsDataURL(files[0]);
    } else {
      setData(d => ({ ...d, [name]: value }));
      if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
    }
  }

  function validate() {
    const err = {};
    if (!data.senderName.trim()) err.senderName = 'Your name is required.';
    return err;
  }

  function onGenerate() {
    const err = validate();
    if (Object.keys(err).length) { setErrors(err); return; }
    setStep('card');
  }

  async function handleSaveTemplate() {
    setSaving(true);
    try {
      const name = `${festival.label}${data.recipientName ? ` for ${data.recipientName}` : ''}`;
      if (templateId) {
        await updateTemplate(templateId, name, data);
      } else {
        const id = await saveTemplate(userEmail, effectiveCardType, name, data);
        setTemplateId(id);
      }
      alert(templateId ? 'Template updated!' : 'Template saved!');
    } catch (e) {
      console.error('Save template error:', e);
      alert(`Failed to save template: ${e.message || e}`);
    } finally { setSaving(false); }
  }

  if (step === 'form') {
    return (
      <FestivalForm
        data={data}
        errors={errors}
        onChange={onChange}
        onBack={onBack}
        onGenerate={onGenerate}
        festivals={allFestivals}
      />
    );
  }

  const particles = PARTICLES_MAP[data.festival] || PARTICLES_MAP.holi;

  return (
    <div className="festival-card-screen">
      <Particles icons={particles} count={24} />
      <div className="card-screen-container">
        <p className="festival-screen-title">{festival.icon} {festival.label}</p>
        <LanguagePicker value={lang} onChange={setLang} languages={LANGUAGES} />

        {/* Background Color Picker */}
        <div className="fest-bg-picker">
          <span className="fest-bg-picker-label">🎨 Card Background:</span>
          <div className="fest-bg-swatches">
            {BG_SWATCHES.map(s => (
              <button key={s.color || 'default'} className={`fest-bg-swatch ${data.bgColor === s.color ? 'active' : ''}`}
                style={{ background: s.color || 'linear-gradient(135deg,#ccc,#eee)' }}
                title={s.label}
                onClick={() => setData(d => ({ ...d, bgColor: s.color }))} />
            ))}
            <input type="color" className="fest-bg-custom-input" title="Pick custom color"
              value={data.bgColor || '#ffffff'}
              onChange={e => setData(d => ({ ...d, bgColor: e.target.value }))} />
            {data.bgColor && (
              <button className="fest-bg-reset" onClick={() => setData(d => ({ ...d, bgColor: '' }))}>
                ↺ Reset
              </button>
            )}
          </div>
        </div>

        {/* Holi template chooser button */}
        {data.festival === 'holi' && (
          <button className="btn-choose-template" onClick={() => setShowChooser(true)}
            style={{ marginBottom: '10px', background: 'linear-gradient(135deg,#ff6f91,#ffc75f)', color: '#fff', border: 'none', borderRadius: '12px', padding: '10px 22px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(255,111,145,.35)' }}>
            🎨 Choose Holi Template ({data.selectedTemplate || 1}/6)
          </button>
        )}

        <div id="festival-card-print" className={`card-wrapper screenshot-protected${!paid ? ' card-preview-locked' : ''}`}>
          <FestivalCardPreview data={data} lang={lang} bgColor={data.bgColor} />
        </div>

        {/* Payment / Download actions */}
        {!paid && (
          <div className="download-locked-badge">
            🔒 Preview Mode — Pay ₹{getCardPrice(effectiveCardType)} to remove watermark
          </div>
        )}

        {!paid && (
          <button
            className="btn-download pay-download-btn"
            onClick={() => setShowPayment(true)}
            style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', marginBottom: '8px', width: '100%', padding: '13px', fontSize: '15px', fontWeight: 700, border: 'none', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(102,126,234,.4)' }}
          >
            💎 Pay ₹{getCardPrice(effectiveCardType)} & Download (No Watermark)
          </button>
        )}

        <CardActions
          onEdit={() => setStep('form')}
          onBack={onBack}
          onDownload={handleDownload}
          downloading={downloading}
          dlBtnStyle={{ background: 'linear-gradient(135deg,#ff6b6b,#feca57)', color: '#fff', boxShadow: '0 6px 20px rgba(255,107,107,.45)' }}
          dlLabel={paid ? '⬇️ Download Card' : '⬇️ Download (with watermark)'}
        />
        <button className="btn-save-template" onClick={handleSaveTemplate} disabled={saving}>
          {saving ? '⏳ Saving…' : templateId ? '💾 Update Template' : '💾 Save Template'}
        </button>
      </div>
      <Toast text={toast.text} show={toast.show} />

      {/* Holi Template Chooser Modal */}
      {showChooser && data.festival === 'holi' && (
        <HoliTemplateChooser
          data={data}
          lang={lang}
          selected={data.selectedTemplate || 1}
          onSelect={id => setData(d => ({ ...d, selectedTemplate: id }))}
          onClose={() => setShowChooser(false)}
        />
      )}

      {/* Razorpay Payment Popup */}
      {showPayment && (
        <PaymentPopup
          cardType={effectiveCardType}
          cardLabel={effectiveCardLabel}
          userEmail={userEmail}
          onClose={() => setShowPayment(false)}
          onPaymentDone={() => {
            setPaid(true);
            watermarkRef.current = false;
            setShowPayment(false);
            setTimeout(() => handleDownload(), 500);
          }}
        />
      )}
    </div>
  );
}
