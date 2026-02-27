'use client';
import { useState } from 'react';
import './BirthdayCard.css';
import BirthdayForm from './BirthdayForm';
import BirthdayCardPreview from './BirthdayCardPreview';
import BirthdayTemplateChooser from './BirthdayTemplateChooser';
import CardActions from '../shared/CardActions';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import LanguagePicker from '../shared/LanguagePicker';
import useDownload from '../../hooks/useDownload';
import { toFilename } from '../../utils/helpers';
import { LANGUAGES } from '../../utils/translations';
import { saveTemplate, updateTemplate } from '../../services/templateService';
import { logDownload } from '../../services/downloadHistoryService';

const INIT = { guestName: '', birthdayPerson: '', age: '', date: '', time: '', venue: '', venueAddress: '', hostName: '', message: '', photo: null, photoPreview: '', selectedTemplate: 1, bgColor: '' };
const PARTICLES = ['🎈', '🎉', '🎊', '⭐', '✨', '🎁', '🌟', '🎂'];

const BG_SWATCHES = [
  { color: '', label: 'Default' },
  { color: '#0f1b3d', label: 'Deep Navy' },
  { color: '#fce4ec', label: 'Blush Pink' },
  { color: '#fffde7', label: 'Lemon' },
  { color: '#e8f5e9', label: 'Mint' },
  { color: '#e3f2fd', label: 'Sky Blue' },
  { color: '#f3e5f5', label: 'Lavender' },
  { color: '#fff3e0', label: 'Peach' },
  { color: '#ffffff', label: 'White' },
  { color: '#263238', label: 'Charcoal' },
];

export default function BirthdayCard({ onBack, userEmail, initialData, templateId: initTplId }) {
  const [step, setStep]     = useState('form');
  const [data, setData]     = useState(initialData ? { ...INIT, ...initialData } : INIT);
  const [errors, setErrors] = useState({});
  const [lang, setLang]     = useState('en');
  const [saving, setSaving] = useState(false);
  const [templateId, setTemplateId] = useState(initTplId || null);
  const [showChooser, setShowChooser] = useState(false);

  const filename = `birthday-${toFilename(data.birthdayPerson || 'card')}.png`;
  const dlTitle = data.birthdayPerson ? `${data.birthdayPerson}'s Birthday` : 'Birthday Card';
  const { downloading, handleDownload, toast } = useDownload('bday-card-print', filename, {
    onSuccess: () => logDownload(userEmail, 'birthday', 'Birthday Invite Designer', dlTitle, filename, data).catch(() => {}),
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
    if (!data.guestName.trim())       err.guestName       = 'Invited guest name is required.';
    if (!data.birthdayPerson.trim())  err.birthdayPerson  = 'Birthday person is required.';
    if (!data.date)                   err.date            = 'Please select a date.';
    if (!data.venue.trim())           err.venue           = 'Venue is required.';
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
      const name = data.birthdayPerson ? `${data.birthdayPerson}'s Birthday` : 'Birthday Template';
      if (templateId) {
        await updateTemplate(templateId, name, data);
      } else {
        const id = await saveTemplate(userEmail, 'birthday', name, data);
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
      <BirthdayForm
        data={data}
        errors={errors}
        onChange={onChange}
        onBack={onBack}
        onGenerate={onGenerate}
      />
    );
  }

  return (
    <div className="birthday-card-screen">
      <Particles icons={PARTICLES} count={24} />
      <div className="card-screen-container">
        <p className="birthday-screen-title">� Your Birthday Invitation</p>
        <LanguagePicker value={lang} onChange={setLang} languages={LANGUAGES} />

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '12px' }}>
          <button className="btn-choose-template" onClick={() => setShowChooser(true)}>
            🎨 Change Design Template
          </button>
        </div>

        {/* Background Color Picker */}
        <div className="bday-bg-picker">
          <span className="bday-bg-picker-label">🎨 Card Background:</span>
          <div className="bday-bg-swatches">
            {BG_SWATCHES.map(s => (
              <button key={s.color || 'default'} className={`bday-bg-swatch ${data.bgColor === s.color ? 'active' : ''}`}
                style={{ background: s.color || 'linear-gradient(135deg,#ccc,#eee)' }}
                title={s.label}
                onClick={() => setData(d => ({ ...d, bgColor: s.color }))} />
            ))}
            <input type="color" className="bday-bg-custom-input" title="Pick custom color"
              value={data.bgColor || '#ffffff'}
              onChange={e => setData(d => ({ ...d, bgColor: e.target.value }))} />
            {data.bgColor && (
              <button className="bday-bg-reset" onClick={() => setData(d => ({ ...d, bgColor: '' }))}>
                ↺ Reset
              </button>
            )}
          </div>
        </div>

        <div id="bday-card-print" className="card-wrapper screenshot-protected">
          <BirthdayCardPreview data={data} lang={lang} template={data.selectedTemplate || 1} bgColor={data.bgColor} />
        </div>
        <CardActions
          onEdit={() => setStep('form')}
          onBack={onBack}
          onDownload={handleDownload}
          downloading={downloading}
          dlBtnStyle={{ background: 'linear-gradient(135deg,#ff6b6b,#feca57)', color: '#fff', boxShadow: '0 6px 20px rgba(255,107,107,.45)' }}
        />
        <button className="btn-save-template" onClick={handleSaveTemplate} disabled={saving}>
          {saving ? '⏳ Saving…' : templateId ? '💾 Update Template' : '💾 Save Template'}
        </button>
      </div>
      <Toast text={toast.text} show={toast.show} />

      {/* Template Chooser Modal */}
      {showChooser && (
        <BirthdayTemplateChooser
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
