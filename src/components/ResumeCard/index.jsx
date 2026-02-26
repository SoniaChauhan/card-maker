import { useState } from 'react';
import './ResumeCard.css';
import ResumeForm from './ResumeForm';
import ResumeCardPreview from './ResumeCardPreview';
import CardActions from '../shared/CardActions';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import usePdfDownload from '../../hooks/usePdfDownload';
import { toFilename } from '../../utils/helpers';
import { saveTemplate, updateTemplate } from '../../services/templateService';
import { logDownload } from '../../services/downloadHistoryService';

const INIT = {
  fullName: '', jobTitle: '', email: '', phone: '', location: '', linkedin: '',
  summary: '',
  experience: [{ title: '', company: '', from: '', to: '', desc: '' }],
  education:  [{ degree: '', institution: '', from: '', to: '', desc: '' }],
  skills: '', languages: '',
  photo: null, photoPreview: '',
};
const PARTICLES = ['📄', '✨', '💼', '🎓', '⭐', '🌟', '🖊️', '💡'];

export default function ResumeCard({ onBack, userEmail, initialData, templateId: initTplId }) {
  const [step, setStep]     = useState('form');
  const [data, setData]     = useState(initialData ? { ...INIT, ...initialData } : INIT);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [templateId, setTemplateId] = useState(initTplId || null);

  const filename = `resume-${toFilename(data.fullName || 'document')}.pdf`;
  const dlTitle = data.fullName ? `${data.fullName} Resume` : 'Resume';
  const { downloading, handleDownload, toast } = usePdfDownload('resume-card-print', filename, {
    onSuccess: () => logDownload(userEmail, 'resume', 'Professional Resume Builder', dlTitle, filename, data).catch(() => {}),
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
    if (!data.fullName.trim()) err.fullName = 'Name is required.';
    if (!data.email.trim())    err.email    = 'Email is required.';
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
      const name = data.fullName ? `${data.fullName} Resume` : 'Resume Template';
      if (templateId) {
        await updateTemplate(templateId, name, data);
      } else {
        const id = await saveTemplate(userEmail, 'resume', name, data);
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
      <ResumeForm
        data={data}
        errors={errors}
        onChange={onChange}
        onBack={onBack}
        onGenerate={onGenerate}
      />
    );
  }

  return (
    <div className="resume-card-screen">
      <Particles icons={PARTICLES} count={20} />
      <div className="card-screen-container">
        <p className="resume-screen-title">📄 Your Resume</p>
        <div className="card-wrapper screenshot-protected">
          <ResumeCardPreview data={data} />
        </div>
        <CardActions
          onEdit={() => setStep('form')}
          onBack={onBack}
          onDownload={handleDownload}
          downloading={downloading}
          dlLabel="📥 Download PDF"
          dlBtnStyle={{ background: 'linear-gradient(135deg,#1a73e8,#2d3748)', color: '#fff', boxShadow: '0 6px 20px rgba(26,115,232,.45)' }}
        />
        <button className="btn-save-template" onClick={handleSaveTemplate} disabled={saving}>
          {saving ? '⏳ Saving…' : templateId ? '💾 Update Template' : '💾 Save Template'}
        </button>
      </div>
      <Toast text={toast.text} show={toast.show} />
    </div>
  );
}
