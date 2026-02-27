'use client';
import { useState } from 'react';
import './WeddingCard.css';
import WeddingForm from './WeddingForm';
import WeddingCardPreview from './WeddingCardPreview';
import TemplateChooser from './TemplateChooser';
import SavedWeddingCards from './SavedWeddingCards';
import CardActions from '../shared/CardActions';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import LanguagePicker from '../shared/LanguagePicker';
import useDownload from '../../hooks/useDownload';
import { toFilename } from '../../utils/helpers';
import { LANGUAGES } from '../../utils/translations';
import { saveTemplate, updateTemplate } from '../../services/templateService';
import { logDownload } from '../../services/downloadHistoryService';

const INIT = {
  groomName: '', brideName: '', groomFamily: '', brideFamily: '',
  weddingDate: '', weddingTime: '', weddingVenue: '', weddingVenueAddress: '',
  receptionDate: '', receptionTime: '', receptionVenue: '',
  guestName: '', message: '', familyMembers: '', photo: null, photoPreview: '',
  customPrograms: [],   // [{ name, date, time, venue }]
  selectedTemplate: 1,  // 1-7 template choice
  bgColor: '',          // custom background color
};
const PARTICLES = ['🌸', '🪷', '✨', '🌺', '💐', '🎊', '🌟', '💖', '🪷', '✿'];

const BG_SWATCHES = [
  { color: '',        label: 'Default' },
  { color: '#fdf8f0', label: 'Ivory' },
  { color: '#fce4ec', label: 'Blush Pink' },
  { color: '#fff8e1', label: 'Champagne' },
  { color: '#f3e5f5', label: 'Lavender' },
  { color: '#e8f5e9', label: 'Sage' },
  { color: '#e3f2fd', label: 'Sky Blue' },
  { color: '#ffffff', label: 'White' },
  { color: '#2a0608', label: 'Dark Maroon' },
  { color: '#1a0a2e', label: 'Deep Purple' },
];

export default function WeddingCard({ onBack, userEmail, initialData, templateId: initTplId }) {
  const [step, setStep]     = useState('form');
  const [data, setData]     = useState(initialData ? { ...INIT, ...initialData } : INIT);
  const [errors, setErrors] = useState({});
  const [lang, setLang]     = useState('en');
  const [saving, setSaving] = useState(false);
  const [templateId, setTemplateId] = useState(initTplId || null);
  const [showChooser, setShowChooser] = useState(false);
  const [showSaved, setShowSaved]     = useState(false);

  const filename = `wedding-${toFilename(data.groomName || 'invitation')}.png`;
  const dlTitle = data.groomName && data.brideName ? `${data.groomName} & ${data.brideName} Wedding` : 'Wedding Invite';
  const { downloading, handleDownload, toast } = useDownload('wedding-card-print', filename, {
    onSuccess: () => logDownload(userEmail, 'wedding', 'Wedding Invite Designer', dlTitle, filename, data).catch(() => {}),
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
    const err = {};
    if (!data.groomName.trim())    err.groomName    = 'Groom\'s name is required.';
    if (!data.brideName.trim())    err.brideName    = 'Bride\'s name is required.';
    if (!data.weddingDate)         err.weddingDate  = 'Wedding date is required.';
    if (!data.weddingVenue.trim()) err.weddingVenue = 'Wedding venue is required.';
    if (!data.guestName.trim())    err.guestName    = 'Guest name is required.';
    return err;
  }

  function onGenerate() {
    const err = validate();
    if (Object.keys(err).length) { setErrors(err); return; }
    setStep('card');
  }

  function onProgramChange(programs) {
    setData(d => ({ ...d, customPrograms: programs }));
  }

  function onTemplateSelect(id) {
    setData(d => ({ ...d, selectedTemplate: id }));
  }

  function handleLoadSavedTemplate(tpl) {
    const fd = tpl.formData || {};
    setData({ ...INIT, ...fd });
    setTemplateId(tpl.id);
    setShowSaved(false);
    setStep('form');
  }

  async function handleSaveTemplate() {
    setSaving(true);
    try {
      const name = data.groomName && data.brideName ? `${data.groomName} & ${data.brideName} Wedding` : 'Wedding Template';
      if (templateId) {
        await updateTemplate(templateId, name, data);
      } else {
        const id = await saveTemplate(userEmail, 'wedding', name, data);
        setTemplateId(id);
      }
      alert(templateId ? 'Template updated!' : 'Template saved!');
    } catch (e) {
      console.error('Save template error:', e);
      const msg = e?.code === 'permission-denied'
        ? 'Firestore permission denied. Please update your Firestore rules to allow the "templates" collection.'
        : `Failed to save template: ${e.message || e}`;
      alert(msg);
    } finally { setSaving(false); }
  }

  if (step === 'form') {
    return (
      <WeddingForm
        data={data}
        errors={errors}
        onChange={onChange}
        onBack={onBack}
        onGenerate={onGenerate}
        onProgramChange={onProgramChange}
      />
    );
  }

  return (
    <div className="wedding-card-screen">
      <Particles icons={PARTICLES} count={24} />
      <div className="card-screen-container">
        <p className="wedding-screen-title">💍 Your Wedding Invite</p>
        <LanguagePicker value={lang} onChange={setLang} languages={LANGUAGES} />

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn-choose-template" onClick={() => setShowChooser(true)}>
            🎨 Change Design Template
          </button>
          <button className="btn-saved-cards" onClick={() => setShowSaved(true)}>
            📋 My Saved Cards
          </button>
        </div>

        {/* Background Color Picker */}
        <div className="wed-bg-picker">
          <span className="wed-bg-picker-label">🎨 Card Background:</span>
          <div className="wed-bg-swatches">
            {BG_SWATCHES.map(s => (
              <button key={s.color || 'default'} className={`wed-bg-swatch ${data.bgColor === s.color ? 'active' : ''}`}
                style={{ background: s.color || 'linear-gradient(135deg,#ccc,#eee)' }}
                title={s.label}
                onClick={() => setData(d => ({ ...d, bgColor: s.color }))} />
            ))}
            <input type="color" className="wed-bg-custom-input" title="Pick custom color"
              value={data.bgColor || '#fdf8f0'}
              onChange={e => setData(d => ({ ...d, bgColor: e.target.value }))} />
            {data.bgColor && (
              <button className="wed-bg-reset" onClick={() => setData(d => ({ ...d, bgColor: '' }))}>
                ↺ Reset
              </button>
            )}
          </div>
        </div>

        <div className="card-wrapper screenshot-protected">
          <WeddingCardPreview data={data} lang={lang} template={data.selectedTemplate || 1} bgColor={data.bgColor} />
        </div>
        <CardActions
          onEdit={() => setStep('form')}
          onBack={onBack}
          onDownload={handleDownload}
          downloading={downloading}
          dlBtnStyle={{ background: 'linear-gradient(135deg,#6b1520,#b8860b)', color: '#fff', boxShadow: '0 6px 20px rgba(107,21,32,.45)' }}
        />
        <button className="btn-save-template" onClick={handleSaveTemplate} disabled={saving}>
          {saving ? '⏳ Saving…' : templateId ? '💾 Update Template' : '💾 Save Template'}
        </button>
      </div>
      <Toast text={toast.text} show={toast.show} />

      {/* Template Chooser Modal */}
      {showChooser && (
        <TemplateChooser
          data={data}
          lang={lang}
          selected={data.selectedTemplate || 1}
          onSelect={onTemplateSelect}
          onClose={() => setShowChooser(false)}
        />
      )}

      {/* Saved Wedding Cards Modal */}
      {showSaved && (
        <SavedWeddingCards
          userEmail={userEmail}
          onLoadTemplate={handleLoadSavedTemplate}
          onClose={() => setShowSaved(false)}
        />
      )}
    </div>
  );
}
