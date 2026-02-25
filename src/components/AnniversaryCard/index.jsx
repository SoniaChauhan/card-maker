import { useState } from 'react';
import './AnniversaryCard.css';
import AnniversaryForm from './AnniversaryForm';
import AnniversaryCardPreview from './AnniversaryCardPreview';
import CardActions from '../shared/CardActions';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import useDownload from '../../hooks/useDownload';
import { toFilename } from '../../utils/helpers';

const INIT = { guestName: '', partner1: '', partner2: '', years: '', date: '', time: '', venue: '', venueAddress: '', message: '' };
const PARTICLES = ['🌹', '💕', '❤️', '💍', '✨', '🌸', '💖', '🌺'];

export default function AnniversaryCard({ onBack }) {
  const [step, setStep]     = useState('form');
  const [data, setData]     = useState(INIT);
  const [errors, setErrors] = useState({});

  const filename = `anniversary-${toFilename(data.partner1 || 'card')}.png`;
  const { downloading, handleDownload, toast } = useDownload('anniv-card-print', filename);

  function onChange(e) {
    const { name, value } = e.target;
    setData(d => ({ ...d, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  }

  function validate() {
    const err = {};
    if (!data.guestName.trim()) err.guestName = 'Guest name is required.';
    if (!data.partner1.trim()) err.partner1   = 'Partner 1 name is required.';
    if (!data.partner2.trim()) err.partner2   = 'Partner 2 name is required.';
    if (!data.date)            err.date       = 'Please select a date.';
    if (!data.venue.trim())    err.venue      = 'Venue is required.';
    return err;
  }

  function onGenerate() {
    const err = validate();
    if (Object.keys(err).length) { setErrors(err); return; }
    setStep('card');
  }

  if (step === 'form') {
    return <AnniversaryForm data={data} errors={errors} onChange={onChange} onBack={onBack} onGenerate={onGenerate} />;
  }

  return (
    <div className="anniversary-card-screen">
      <Particles icons={PARTICLES} count={24} />
      <p className="anniversary-screen-title">💍 Your Anniversary Card</p>
      <div className="card-wrapper">
        <AnniversaryCardPreview data={data} />
      </div>
      <CardActions
        onEdit={() => setStep('form')}
        onBack={onBack}
        onDownload={handleDownload}
        downloading={downloading}
        dlBtnStyle={{ background: 'linear-gradient(135deg,#dc3c64,#a18cd1)', color: '#fff', boxShadow: '0 6px 20px rgba(220,60,100,.4)' }}
      />
      <Toast text={toast.text} show={toast.show} />
    </div>
  );
}
