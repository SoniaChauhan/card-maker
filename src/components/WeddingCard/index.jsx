import { useState } from 'react';
import './WeddingCard.css';
import WeddingForm from './WeddingForm';
import WeddingCardPreview from './WeddingCardPreview';
import CardActions from '../shared/CardActions';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import LanguagePicker from '../shared/LanguagePicker';
import useDownload from '../../hooks/useDownload';
import { toFilename } from '../../utils/helpers';
import { LANGUAGES } from '../../utils/translations';

const INIT = {
  groomName: '', brideName: '', groomFamily: '', brideFamily: '',
  weddingDate: '', weddingTime: '', weddingVenue: '', weddingVenueAddress: '',
  receptionDate: '', receptionTime: '', receptionVenue: '',
  guestName: '', message: '', familyMembers: '', photo: null, photoPreview: '',
};
const PARTICLES = ['🌸', '🪷', '✨', '🌺', '💐', '🎊', '🌟', '💖', '🪷', '✿'];

export default function WeddingCard({ onBack, userEmail, isSuperAdmin }) {
  const [step, setStep]     = useState('form');
  const [data, setData]     = useState(INIT);
  const [errors, setErrors] = useState({});
  const [lang, setLang]     = useState('en');

  const filename = `wedding-${toFilename(data.groomName || 'invitation')}.png`;
  const { downloading, handleDownload, toast } = useDownload('wedding-card-print', filename);

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

  if (step === 'form') {
    return (
      <WeddingForm
        data={data}
        errors={errors}
        onChange={onChange}
        onBack={onBack}
        onGenerate={onGenerate}
      />
    );
  }

  return (
    <div className="wedding-card-screen">
      <Particles icons={PARTICLES} count={24} />
      <div className="card-screen-container">
        <p className="wedding-screen-title">💍 Your Wedding Invitation</p>
        <LanguagePicker value={lang} onChange={setLang} languages={LANGUAGES} />
        <div className={`card-wrapper screenshot-protected ${!isSuperAdmin ? 'card-preview-locked' : ''}`}>
          <WeddingCardPreview data={data} lang={lang} />
        </div>
        <CardActions
          onEdit={() => setStep('form')}
          onBack={onBack}
          onDownload={handleDownload}
          downloading={downloading}
          locked={!isSuperAdmin}
          cardId="wedding"
          cardLabel="Wedding Invitation"
          userEmail={userEmail}
          isSuperAdmin={isSuperAdmin}
          dlBtnStyle={{ background: 'linear-gradient(135deg,#6b1520,#b8860b)', color: '#fff', boxShadow: '0 6px 20px rgba(107,21,32,.45)' }}
        />
      </div>
      <Toast text={toast.text} show={toast.show} />
    </div>
  );
}
