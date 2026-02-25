import { useState } from 'react';
import './ResumeCard.css';
import ResumeForm from './ResumeForm';
import ResumeCardPreview from './ResumeCardPreview';
import CardActions from '../shared/CardActions';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import usePdfDownload from '../../hooks/usePdfDownload';
import { toFilename } from '../../utils/helpers';

const INIT = {
  fullName: '', jobTitle: '', email: '', phone: '', location: '', linkedin: '',
  summary: '',
  experience: [{ title: '', company: '', from: '', to: '', desc: '' }],
  education:  [{ degree: '', institution: '', from: '', to: '', desc: '' }],
  skills: '', languages: '',
  photo: null, photoPreview: '',
};
const PARTICLES = ['📄', '✨', '💼', '🎓', '⭐', '🌟', '🖊️', '💡'];

export default function ResumeCard({ onBack }) {
  const [step, setStep]     = useState('form');
  const [data, setData]     = useState(INIT);
  const [errors, setErrors] = useState({});

  const filename = `resume-${toFilename(data.fullName || 'document')}.pdf`;
  const { downloading, handleDownload, toast } = usePdfDownload('resume-card-print', filename);

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
      <p className="resume-screen-title">📄 Your Resume</p>
      <div className="card-wrapper">
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
      <Toast text={toast.text} show={toast.show} />
    </div>
  );
}
