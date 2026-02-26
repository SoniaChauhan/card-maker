import { useState } from 'react';
import './BiodataCard.css';
import BiodataForm from './BiodataForm';
import BiodataCardPreview from './BiodataCardPreview';
import CardActions from '../shared/CardActions';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import LanguagePicker from '../shared/LanguagePicker';
import useDownload from '../../hooks/useDownload';
import { toFilename } from '../../utils/helpers';
import { LANGUAGES } from '../../utils/translations';
import { saveTemplate, updateTemplate } from '../../services/templateService';

const INIT = {
  // Personal
  fullName: '',
  dob: '',
  age: '',
  height: '',
  weight: '',
  complexion: '',
  bloodGroup: '',
  religion: 'Hindu',
  caste: '',
  subCaste: '',
  // Astrology
  gotra: '',
  rashi: '',
  nakshatra: '',
  manglik: 'No',
  // Education & Career
  education: '',
  occupation: '',
  employer: '',
  annualIncome: '',
  // Family
  fatherName: '',
  fatherOccupation: '',
  motherName: '',
  motherOccupation: '',
  siblings: '',
  // About
  hobbies: '',
  aboutMe: '',
  // Contact
  contactName: '',
  contactPhone: '',
  contactAddress: '',
  photo: null,
  photoPreview: '',
};

const PARTICLES = ['🌸', '💐', '🌺', '✨', '💖', '🕉️', '🌼', '💍'];

export default function BiodataCard({ onBack, userEmail, isSuperAdmin, initialData, templateId: initTplId }) {
  const [step, setStep]     = useState('form');
  const [data, setData]     = useState(initialData ? { ...INIT, ...initialData } : INIT);
  const [errors, setErrors] = useState({});
  const [lang, setLang]     = useState('en');
  const [saving, setSaving] = useState(false);
  const [templateId, setTemplateId] = useState(initTplId || null);

  const filename = `biodata-${toFilename(data.fullName || 'card')}.png`;
  const { downloading, handleDownload, toast } = useDownload('biodata-print', filename);

  function onChange(e) {
    const { name, value, files } = e.target;
    if (name === 'photo' && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(d => ({ ...d, photo: files[0], photoPreview: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setData(d => ({ ...d, [name]: value }));
      if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
    }
  }

  function validate() {
    const err = {};
    if (!data.fullName.trim())    err.fullName    = 'Full name is required.';
    if (!data.dob)                err.dob         = 'Date of birth is required.';
    if (!data.education.trim())   err.education   = 'Education is required.';
    if (!data.contactPhone.trim()) err.contactPhone = 'Contact number is required.';
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
      const name = data.fullName ? `${data.fullName} Biodata` : 'Biodata Template';
      if (templateId) {
        await updateTemplate(templateId, name, data);
      } else {
        const id = await saveTemplate(userEmail, 'biodata', name, data);
        setTemplateId(id);
      }
      alert(templateId ? 'Template updated!' : 'Template saved!');
    } catch (e) { console.error(e); alert('Failed to save template.'); }
    finally { setSaving(false); }
  }

  if (step === 'form') {
    return (
      <BiodataForm
        data={data}
        errors={errors}
        onChange={onChange}
        onBack={onBack}
        onGenerate={onGenerate}
      />
    );
  }

  return (
    <div className="biodata-card-screen">
      <Particles icons={PARTICLES} count={20} />
      <div className="card-screen-container">
        <p className="biodata-screen-title">💍 Marriage Biodata</p>
        <LanguagePicker value={lang} onChange={setLang} languages={LANGUAGES} />
        <div className={`card-wrapper screenshot-protected ${!isSuperAdmin ? 'card-preview-locked' : ''}`}>
          <BiodataCardPreview data={data} lang={lang} />
        </div>
        <CardActions
          onEdit={() => setStep('form')}
          onBack={onBack}
          onDownload={handleDownload}
          downloading={downloading}
          locked={!isSuperAdmin}
          cardId="biodata"
          cardLabel="Marriage Biodata"
          userEmail={userEmail}
          isSuperAdmin={isSuperAdmin}
          dlBtnStyle={{ background: 'linear-gradient(135deg,#d4af37,#c0392b)', boxShadow: '0 8px 24px rgba(212,175,55,.4)' }}
        />
        <button className="btn-save-template" onClick={handleSaveTemplate} disabled={saving}>
          {saving ? '⏳ Saving…' : templateId ? '💾 Update Template' : '💾 Save Template'}
        </button>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
