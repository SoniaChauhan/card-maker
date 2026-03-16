'use client';
import { useState, useEffect } from 'react';
import './FestivalCard.css';
import FestivalForm from './FestivalForm';
import FestivalCardPreview from './FestivalCardPreview';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import LanguagePicker from '../shared/LanguagePicker';
import HoliTemplateChooser from './HoliTemplateChooser';
import useDownload from '../../hooks/useDownload';
import { toFilename } from '../../utils/helpers';
import { LANGUAGES } from '../../utils/translations';
import { saveTemplate, updateTemplate } from '../../services/templateService';
import { logDownload } from '../../services/downloadHistoryService';


/* ── Festival definitions ── */
export const HOLI_FESTIVAL = { id: 'holi', label: 'Holi Celebration Card', icon: '🌈', tag: 'Holi Card', desc: 'Vibrant and colorful Holi greeting card with playful splashes, gulaal effects, and festive typography.' };

export const FESTIVALS = [
  { id: 'diwali',          label: 'Diwali Wishes Card',           icon: '🪔', tag: 'Diwali Card',           desc: 'Elegant Deepawali greeting card featuring diyas, rangoli, lights, and auspicious festive elements.' },
  { id: 'lohri',           label: 'Lohri Festival Card',          icon: '🔥', tag: 'Lohri Card',            desc: 'Warm Lohri greeting card inspired by bonfire, dhol beats, winter theme, and Punjabi culture.' },
  { id: 'navratri',        label: 'Navratri Greeting Card',       icon: '✨', tag: 'Navratri Card',         desc: 'Devotional card with Maa Durga, garba theme, and festive colors for Shubh Navratri.' },
  { id: 'dussehra',        label: 'Dussehra Greeting Card',       icon: '🏹', tag: 'Dussehra Card',         desc: 'Celebrate Vijaya Dashami with bow-arrow themes and triumph of good over evil.' },
  { id: 'sankranti',       label: 'Makar Sankranti Card',         icon: '🪁', tag: 'Sankranti Card',        desc: 'Colorful kite theme with til-gul, sunshine, and harvest celebration.' },
  { id: 'ganesh',          label: 'Ganesh Chaturthi Card',        icon: '🙏', tag: 'Ganesh Card',           desc: 'Auspicious Ganpati Bappa design with modak, lotus, and divine blessings.' },
  { id: 'janmashtami',     label: 'Janmashtami Greeting Card',    icon: '🦚', tag: 'Janmashtami Card',      desc: 'Divine Krishna-themed card with peacock feather, flute, and midnight celebration.' },
  { id: 'eid',             label: 'Eid Mubarak Card',             icon: '🌙', tag: 'Eid Card',              desc: 'Elegant Eid greeting card featuring moon, stars, lanterns, and traditional patterns.' },
  { id: 'christmas',       label: 'Christmas Wishes Card',        icon: '🎄', tag: 'Christmas Card',        desc: 'Warm Christmas greeting card with Santa, snowflakes, bells, and festive ornaments.' },
  { id: 'rakhi',           label: 'Rakhi Greeting Card',          icon: '🎎', tag: 'Rakhi Card',            desc: 'Beautiful card featuring rakhi patterns, brother-sister bond theme, and traditional motifs.' },
  { id: 'mothersday',      label: "Mother's Day Greeting Card",   icon: '💐', tag: "Mother's Day Card",     desc: 'Soft, floral design to celebrate love and gratitude for mothers.' },
  { id: 'fathersday',      label: "Father's Day Greeting Card",   icon: '👔', tag: "Father's Day Card",     desc: 'Bold and warm design celebrating fathers and their strength.' },
  { id: 'newyear',         label: 'New Year Wishes Card',         icon: '🎉', tag: 'New Year Card',         desc: 'Sparkling theme with fireworks, lights, and a joyful greeting layout.' },
  { id: 'independenceday', label: 'Independence Day Card',        icon: '🇮🇳', tag: 'Independence Day Card', desc: 'Tricolor patriotic theme celebrating Indian freedom and national pride.' },
  { id: 'republicday',     label: 'Republic Day Card',            icon: '🇮🇳', tag: 'Republic Day Card',     desc: 'Patriotic design celebrating the Constitution and democratic values of India.' },
  { id: 'karwachauth',     label: 'Karwa Chauth Card',            icon: '🌕', tag: 'Karwa Chauth Card',     desc: 'Romantic moonlit design celebrating love, devotion, and the sacred bond.' },
  { id: 'baisakhi',        label: 'Baisakhi Festival Card',       icon: '🌾', tag: 'Baisakhi Card',         desc: 'Vibrant harvest celebration with wheat, bhangra dance, and Punjabi culture.' },
  { id: 'chhath',          label: 'Chhath Puja Card',             icon: '🌅', tag: 'Chhath Puja Card',      desc: 'Sacred sunrise theme with water offerings, Surya dev, and divine devotion.' },
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
  holi:            ['🌈', '💜', '💛', '💚', '💙', '🎨', '✨', '🪷'],
  diwali:          ['🪔', '✨', '🎆', '🎇', '🌟', '💫', '🕯️', '🎉'],
  lohri:           ['🔥', '🌾', '🥜', '✨', '🎵', '🪘', '🌟', '🎊'],
  navratri:        ['✨', '💃', '🔴', '🟡', '🟢', '🪷', '🌺', '🙏'],
  dussehra:        ['🏹', '🔥', '✨', '🪔', '💫', '🎯', '🌟', '🙏'],
  sankranti:       ['🪁', '☀️', '✨', '🌾', '🍬', '🌟', '💫', '🎊'],
  ganesh:          ['🙏', '🪷', '✨', '🌺', '💫', '🎉', '🌟', '🪔'],
  janmashtami:     ['🦚', '🪈', '✨', '🌙', '💫', '🌟', '🪷', '🎶'],
  eid:             ['🌙', '⭐', '✨', '🕌', '🏮', '🌟', '💫', '🎊'],
  christmas:       ['🎄', '🎅', '❄️', '🔔', '⭐', '🎁', '✨', '🌟'],
  rakhi:           ['🎎', '💖', '✨', '🌸', '🌺', '🎀', '🌟', '💐'],
  mothersday:      ['💐', '🌸', '💖', '🌹', '✨', '🌷', '💗', '🌺'],
  fathersday:      ['👔', '🏆', '⭐', '💪', '✨', '🎉', '💙', '🌟'],
  newyear:         ['🎉', '🎆', '🎇', '✨', '🥂', '🌟', '💫', '🎊'],
  independenceday: ['🇮🇳', '🕊️', '✨', '⭐', '💫', '🌟', '🎉', '🪔'],
  republicday:     ['🇮🇳', '🕊️', '✨', '⭐', '💫', '🌟', '🎊', '🪔'],
  karwachauth:     ['🌕', '✨', '💍', '🌙', '💫', '💖', '🌟', '🪔'],
  baisakhi:        ['🌾', '💃', '✨', '🥁', '🎵', '🌟', '💫', '🎊'],
  chhath:          ['🌅', '☀️', '✨', '🪔', '💫', '🌟', '🙏', '🎊'],
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

export default function FestivalCard({ onBack, userEmail, initialData, templateId: initTplId, isSuperAdmin, lockedFestival, initialFestival }) {
  /* When lockedFestival is set, use only that festival */
  const allFestivals = lockedFestival === 'holi' ? [HOLI_FESTIVAL] : FESTIVALS;
  /* Use initialFestival if provided and valid, otherwise fall back to first festival in list */
  const resolvedFestival = lockedFestival || (initialFestival && FESTIVALS.some(f => f.id === initialFestival) ? initialFestival : FESTIVALS[0].id);
  const effectiveInit = { ...INIT, festival: resolvedFestival };
  const effectiveCardType = lockedFestival === 'holi' ? 'holicard' : CARD_TYPE;
  const effectiveCardLabel = lockedFestival === 'holi' ? 'Holi Celebration Card' : CARD_LABEL;
  const [step, setStep]     = useState('form');
  const [data, setData]     = useState(initialData ? { ...effectiveInit, ...initialData } : effectiveInit);
  const [errors, setErrors] = useState({});
  const [lang, setLang]     = useState('en');
  const [saving, setSaving] = useState(false);
  const [templateId, setTemplateId] = useState(initTplId || null);
  const [showChooser, setShowChooser] = useState(false);
  const isHoliCard = lockedFestival === 'holi';

  const festival = allFestivals.find(f => f.id === data.festival) || (lockedFestival === 'holi' ? HOLI_FESTIVAL : allFestivals[0]);
  const filename = `festival-${toFilename(festival.tag)}-${toFilename(data.recipientName || 'card')}.png`;
  const dlTitle = data.recipientName ? `${festival.label} for ${data.recipientName}` : festival.label;
  const { downloading, handleDownload, toast } = useDownload('festival-card-print', filename, {
    onSuccess: () => logDownload(userEmail, 'festival', 'Festival Greeting Card', dlTitle, filename, data).catch(() => {}),
    addWatermark: false,
  });

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
    return {};
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
        {!isHoliCard && <LanguagePicker value={lang} onChange={setLang} languages={LANGUAGES} />}

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

        <div id="festival-card-print" className="card-wrapper screenshot-protected">
          <FestivalCardPreview data={data} lang={lang} bgColor={data.bgColor} />
        </div>

        {/* Action Buttons */}
        <div className="fest-action-buttons">
          <button className="fest-back-btn" onClick={() => setStep('form')}>
            ← Back
          </button>
          <button className="fest-btn-edit" onClick={() => setStep('form')}>
            <span className="btn-icon">✏️</span> Edit Card
          </button>
          <button
            className="fest-btn-download"
            onClick={handleDownload}
            disabled={downloading}
          >
            <span className="btn-icon">⬇️</span> {downloading ? 'Downloading...' : 'Download Card'}
          </button>
        </div>
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

    </div>
  );
}
