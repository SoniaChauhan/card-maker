import { useState } from 'react';
import './BirthdayCard.css';
import BirthdayForm from './BirthdayForm';
import BirthdayCardPreview from './BirthdayCardPreview';
import CardActions from '../shared/CardActions';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import LanguagePicker from '../shared/LanguagePicker';
import useDownload from '../../hooks/useDownload';
import { toFilename } from '../../utils/helpers';
import { LANGUAGES } from '../../utils/translations';

const INIT = { guestName: '', birthdayPerson: '', age: '', date: '', time: '', venue: '', venueAddress: '', hostName: '', message: '', photo: null, photoPreview: '' };
const PARTICLES = ['🎈', '🎉', '🎊', '⭐', '✨', '🎁', '🌟', '🎂'];

export default function BirthdayCard({ onBack, userEmail, isSuperAdmin }) {
  const [step, setStep]     = useState('form');
  const [data, setData]     = useState(INIT);
  const [errors, setErrors] = useState({});
  const [lang, setLang]     = useState('en');

  const filename = `birthday-${toFilename(data.birthdayPerson || 'card')}.png`;
  const { downloading, handleDownload, toast } = useDownload('bday-card-print', filename);

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
      <p className="birthday-screen-title">� Your Birthday Invitation</p>
      <LanguagePicker value={lang} onChange={setLang} languages={LANGUAGES} />
      <div className={`card-wrapper screenshot-protected ${!isSuperAdmin ? 'card-preview-locked' : ''}`}>
        <BirthdayCardPreview data={data} lang={lang} />
      </div>
      <CardActions
        onEdit={() => setStep('form')}
        onBack={onBack}
        onDownload={handleDownload}
        downloading={downloading}
        locked={!isSuperAdmin}
        cardId="birthday"
        cardLabel="Birthday Invitation"
        userEmail={userEmail}
        isSuperAdmin={isSuperAdmin}
        dlBtnStyle={{ background: 'linear-gradient(135deg,#ff6b6b,#feca57)', color: '#fff', boxShadow: '0 6px 20px rgba(255,107,107,.45)' }}
      />
      <Toast text={toast.text} show={toast.show} />
    </div>
  );
}
