import { useState } from 'react';
import './BirthdayCard.css';
import BirthdayForm from './BirthdayForm';
import BirthdayCardPreview from './BirthdayCardPreview';
import CardActions from '../shared/CardActions';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import useDownload from '../../hooks/useDownload';
import { toFilename } from '../../utils/helpers';

const INIT = { guestName: '', birthdayPerson: '', age: '', date: '', venue: '', venueAddress: '', message: '' };
const PARTICLES = ['🎈', '🎉', '🎊', '⭐', '✨', '🎁', '🌟', '🎂'];

export default function BirthdayCard({ onBack }) {
  const [step, setStep]     = useState('form');
  const [data, setData]     = useState(INIT);
  const [errors, setErrors] = useState({});
  const [lang, setLang]     = useState('en');

  const filename = `birthday-${toFilename(data.birthdayPerson || 'card')}.png`;
  const { downloading, handleDownload, toast } = useDownload('bday-card-print', filename);

  function onChange(e) {
    const { name, value } = e.target;
    setData(d => ({ ...d, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  }

  function validate() {
    const err = {};
    if (!data.guestName.trim())       err.guestName       = 'Guest name is required.';
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
      <p className="birthday-screen-title">🎂 Your Birthday Card</p>
      <div className="lang-toggle-bar">
        <label className="lang-select-label">🌐 Language:</label>
        <select className="lang-select" value={lang} onChange={e => setLang(e.target.value)}>
          <option value="en">🇬🇧 English</option>
          <option value="hi">🇮🇳 हिन्दी</option>
        </select>
      </div>
      <div className="card-wrapper">
        <BirthdayCardPreview data={data} lang={lang} />
      </div>
      <CardActions
        onEdit={() => setStep('form')}
        onBack={onBack}
        onDownload={handleDownload}
        downloading={downloading}
        dlBtnStyle={{ background: 'linear-gradient(135deg,#ff6b6b,#feca57)', color: '#fff', boxShadow: '0 6px 20px rgba(255,107,107,.45)' }}
      />
      <Toast text={toast.text} show={toast.show} />
    </div>
  );
}
