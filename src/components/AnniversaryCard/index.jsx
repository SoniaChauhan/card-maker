'use client';
import { useState } from 'react';
import './AnniversaryCard.css';
import AnniversaryForm from './AnniversaryForm';
import AnniversaryCardPreview from './AnniversaryCardPreview';
import AnniversaryTemplateChooser from './AnniversaryTemplateChooser';
import CardActions from '../shared/CardActions';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import LanguagePicker from '../shared/LanguagePicker';
import useDownload from '../../hooks/useDownload';
import { toFilename } from '../../utils/helpers';
import { LANGUAGES } from '../../utils/translations';
import { saveTemplate, updateTemplate } from '../../services/templateService';
import { logDownload } from '../../services/downloadHistoryService';

const INIT = { partner1: '', partner2: '', years: '', date: '', message: '', photo: null, photoPreview: '', selectedTemplate: 1, bgColor: '' };
const PARTICLES = ['🌹', '💕', '❤️', '💍', '✨', '🌸', '💖', '🌺'];

const BG_SWATCHES = [
  { color: '', label: 'Default' },
  { color: '#14264a', label: 'Deep Navy' },
  { color: '#2a1520', label: 'Dark Maroon' },
  { color: '#f8f5ee', label: 'Ivory' },
  { color: '#1a0a2e', label: 'Royal Purple' },
  { color: '#fdf8f0', label: 'Parchment' },
  { color: '#2d3436', label: 'Charcoal' },
  { color: '#0a1628', label: 'Midnight' },
  { color: '#1a3c2a', label: 'Forest' },
  { color: '#ffffff', label: 'White' },
];

export default function AnniversaryCard({ onBack, userEmail, initialData, templateId: initTplId }) {
  const [step, setStep]     = useState('form');
  const [data, setData]     = useState(initialData ? { ...INIT, ...initialData } : INIT);
  const [errors, setErrors] = useState({});
  const [lang, setLang]     = useState('en');
  const [saving, setSaving] = useState(false);
  const [templateId, setTemplateId] = useState(initTplId || null);
  const [showChooser, setShowChooser] = useState(false);

  const filename = `anniversary-${toFilename(data.partner1 || 'card')}.png`;
  const dlTitle = data.partner1 && data.partner2 ? `${data.partner1} & ${data.partner2} Anniversary` : 'Anniversary Card';
  const { downloading, handleDownload, toast } = useDownload('anniv-card-print', filename, {
    onSuccess: () => logDownload(userEmail, 'anniversary', 'Anniversary Greeting Designer', dlTitle, filename, data).catch(() => {}),
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
    if (!data.partner1.trim()) err.partner1   = 'Partner 1 name is required.';
    if (!data.partner2.trim()) err.partner2   = 'Partner 2 name is required.';
    if (!data.date)            err.date       = 'Please select a date.';
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
      const name = data.partner1 && data.partner2 ? `${data.partner1} & ${data.partner2} Anniversary` : 'Anniversary Template';
      if (templateId) {
        await updateTemplate(templateId, name, data);
      } else {
        const id = await saveTemplate(userEmail, 'anniversary', name, data);
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
    return <AnniversaryForm data={data} errors={errors} onChange={onChange} onBack={onBack} onGenerate={onGenerate} />;
  }

  return (
    <div className="anniversary-card-screen">
      <Particles icons={PARTICLES} count={24} />
      <div className="card-screen-container">
        <p className="anniversary-screen-title">💍 Your Anniversary Greeting</p>
        <LanguagePicker value={lang} onChange={setLang} languages={LANGUAGES} />

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '12px' }}>
          <button className="btn-choose-template" onClick={() => setShowChooser(true)}>
            🎨 Change Design Template
          </button>
        </div>

        {/* Background Color Picker */}
        <div className="anniv-bg-picker">
          <span className="anniv-bg-picker-label">🎨 Card Background:</span>
          <div className="anniv-bg-swatches">
            {BG_SWATCHES.map(s => (
              <button key={s.color || 'default'} className={`anniv-bg-swatch ${data.bgColor === s.color ? 'active' : ''}`}
                style={{ background: s.color || 'linear-gradient(135deg,#ccc,#eee)' }}
                title={s.label}
                onClick={() => setData(d => ({ ...d, bgColor: s.color }))} />
            ))}
            <input type="color" className="anniv-bg-custom-input" title="Pick custom color"
              value={data.bgColor || '#14264a'}
              onChange={e => setData(d => ({ ...d, bgColor: e.target.value }))} />
            {data.bgColor && (
              <button className="anniv-bg-reset" onClick={() => setData(d => ({ ...d, bgColor: '' }))}>
                ↺ Reset
              </button>
            )}
          </div>
        </div>

        <div className="card-wrapper screenshot-protected">
          <AnniversaryCardPreview data={data} lang={lang} template={data.selectedTemplate || 1} bgColor={data.bgColor} />
        </div>
        <CardActions
          onEdit={() => setStep('form')}
          onBack={onBack}
          onDownload={handleDownload}
          downloading={downloading}
          dlBtnStyle={{ background: 'linear-gradient(135deg,#1a2a5e,#c9a84c)', color: '#fff', boxShadow: '0 6px 20px rgba(201,168,76,.4)' }}
        />
        <button className="btn-save-template" onClick={handleSaveTemplate} disabled={saving}>
          {saving ? '⏳ Saving…' : templateId ? '💾 Update Template' : '💾 Save Template'}
        </button>
      </div>
      <Toast text={toast.text} show={toast.show} />

      {/* Template Chooser Modal */}
      {showChooser && (
        <AnniversaryTemplateChooser
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
