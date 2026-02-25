import { useState } from 'react';
import './JagrataCard.css';
import JagrataForm from './JagrataForm';
import JagrataCardPreview from './JagrataCardPreview';
import CardActions from '../shared/CardActions';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import useDownload from '../../hooks/useDownload';
import { toFilename } from '../../utils/helpers';
import { LANGUAGES } from '../../utils/translations';

const INIT = { religion: 'hindu', guestName: '', organizerName: '', jagrataTitle: '', purpose: '', date: '', startTime: '', venue: '', venueAddress: '', prasad: '', message: '' };
const PARTICLES = ['🪔', '🙏', '🕉️', '✨', '🌸', '🌺', '⭐', '💛'];

export default function JagrataCard({ onBack }) {
  const [step, setStep]     = useState('form');
  const [data, setData]     = useState(INIT);
  const [errors, setErrors] = useState({});
  const [lang, setLang]     = useState('hi');

  const filename = `jagrata-${toFilename(data.jagrataTitle || 'invite')}.png`;
  const { downloading, handleDownload, toast } = useDownload('jagrata-card-print', filename);

  function onChange(e) {
    const { name, value } = e.target;
    setData(d => ({ ...d, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  }

  function validate() {
    const err = {};
    if (!data.guestName.trim())     err.guestName     = 'Guest name is required.';
    if (!data.organizerName.trim()) err.organizerName = 'Organizer name is required.';
    if (!data.jagrataTitle.trim())  err.jagrataTitle  = 'Jagrata title is required.';
    if (!data.date)                 err.date          = 'Please select a date.';
    if (!data.venue.trim())         err.venue         = 'Venue is required.';
    return err;
  }

  function onGenerate() {
    const err = validate();
    if (Object.keys(err).length) { setErrors(err); return; }
    setStep('card');
  }

  if (step === 'form') {
    return <JagrataForm data={data} errors={errors} onChange={onChange} onBack={onBack} onGenerate={onGenerate} />;
  }

  return (
    <div className="jagrata-card-screen">
      <Particles icons={PARTICLES} count={24} />
      <p className="jagrata-screen-title">🪔 Your Jagrata Invitation</p>
      <div className="lang-toggle-bar">
        <label className="lang-select-label">🌐 Language:</label>
        <select className="lang-select" value={lang} onChange={e => setLang(e.target.value)}>
          {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
        </select>
      </div>
      <div className="card-wrapper">
        <JagrataCardPreview data={data} lang={lang} />
      </div>
      <CardActions
        onEdit={() => setStep('form')}
        onBack={onBack}
        onDownload={handleDownload}
        downloading={downloading}
        dlBtnStyle={{ background: 'linear-gradient(135deg,#f7971e,#ffd200)', color: '#7a3e00', boxShadow: '0 6px 20px rgba(247,151,30,.5)' }}
      />
      <Toast text={toast.text} show={toast.show} />
    </div>
  );
}
