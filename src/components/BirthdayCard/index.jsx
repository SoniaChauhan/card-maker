'use client';
import { useState, useEffect, useRef } from 'react';
import './BirthdayCard.css';
import BirthdayForm from './BirthdayForm';
import BirthdayCardPreview from './BirthdayCardPreview';
import { TEMPLATES } from './BirthdayTemplateChooser';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import LanguagePicker from '../shared/LanguagePicker';
import PaymentPopup from '../shared/PaymentPopup';
import useDownload from '../../hooks/useDownload';
import { toFilename } from '../../utils/helpers';
import { LANGUAGES } from '../../utils/translations';
import { saveTemplate, updateTemplate } from '../../services/templateService';
import { logDownload } from '../../services/downloadHistoryService';
import { hasUserPaid, getCardPrice, sendDownloadEmail } from '../../services/paymentService';

const CARD_TYPE = 'birthday';
const CARD_LABEL = 'Birthday Invitation';
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

export default function BirthdayCard({ onBack, userEmail, initialData, templateId: initTplId, isSuperAdmin }) {
  const [step, setStep]     = useState('form');
  const [data, setData]     = useState(initialData ? { ...INIT, ...initialData } : INIT);
  const [errors, setErrors] = useState({});
  const [lang, setLang]     = useState('en');
  const [saving, setSaving] = useState(false);
  const [templateId, setTemplateId] = useState(initTplId || null);
  const [paid, setPaid]     = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [downloadEmail, setDownloadEmail] = useState(userEmail || '');
  const [downloadPhone, setDownloadPhone] = useState('');
  const carouselRef = useRef(null);

  const filename = `birthday-${toFilename(data.birthdayPerson || 'card')}.png`;
  const dlTitle = data.birthdayPerson ? `${data.birthdayPerson}'s Birthday` : 'Birthday Card';
  const { downloading, handleDownload, toast, watermarkRef } = useDownload('bday-card-print', filename, {
    onSuccess: async () => {
      const downloadId = await logDownload(userEmail, CARD_TYPE, 'Birthday Invite Designer', dlTitle, filename, data).catch(() => null);
      if (downloadEmail) {
        sendDownloadEmail({ email: downloadEmail, cardType: CARD_TYPE, cardLabel: CARD_LABEL, downloadId }).catch(() => {});
      }
    },
    addWatermark: true,
  });

  /* Check payment status on mount */
  useEffect(() => {
    if (isSuperAdmin) { setPaid(true); watermarkRef.current = false; return; }
    if (!userEmail) return;
    hasUserPaid(userEmail, CARD_TYPE).then(p => {
      setPaid(p);
      watermarkRef.current = !p;
    }).catch(() => {});
  }, [userEmail, isSuperAdmin]);

  function scrollCarousel(direction) {
    if (carouselRef.current) {
      const scrollAmount = 200;
      carouselRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  }

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
      
      {/* Main Preview Card Container */}
      <div className="bday-preview-container">
        <p className="bday-screen-title">🎂 Your Birthday Invitation</p>
        <LanguagePicker value={lang} onChange={setLang} languages={LANGUAGES} />
        
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
        
        <div className="bday-preview-card-wrapper">
          <div id="bday-card-print" className={`screenshot-protected${paid ? '' : ' card-preview-locked'}`}>
            <BirthdayCardPreview data={data} lang={lang} template={data.selectedTemplate || 1} bgColor={data.bgColor} />
          </div>
          {!paid && (
            <div className="bday-preview-watermark">
              <span className="watermark-text">PREVIEW</span>
              <span className="watermark-subtext">Watermark removed in download</span>
            </div>
          )}
        </div>
      </div>

      {/* Template Carousel Section */}
      <div className="bday-template-section">
        <button className="carousel-arrow carousel-arrow-left" onClick={() => scrollCarousel(-1)}>‹</button>
        <div className="bday-template-carousel" ref={carouselRef}>
          {TEMPLATES.map(tpl => (
            <div 
              key={tpl.id}
              className={`bday-template-item ${data.selectedTemplate === tpl.id ? 'bday-template-item--selected' : ''}`}
              onClick={() => setData(d => ({ ...d, selectedTemplate: tpl.id }))}
            >
              <div className="bday-template-thumb" style={{ borderColor: data.selectedTemplate === tpl.id ? tpl.accent : 'transparent' }}>
                <div className="bday-template-thumb-inner">
                  <BirthdayCardPreview data={data} lang={lang} template={tpl.id} bgColor={data.bgColor} />
                </div>
              </div>
              <span className="bday-template-name">{tpl.name}</span>
            </div>
          ))}
        </div>
        <button className="carousel-arrow carousel-arrow-right" onClick={() => scrollCarousel(1)}>›</button>
      </div>

      {/* Action Buttons */}
      <div className="bday-action-buttons">
        <button className="bday-back-btn" onClick={onBack}>
          ← Back
        </button>
        <button className="bday-btn-edit" onClick={() => setStep('form')}>
          <span className="btn-icon">✏️</span> Edit Card
        </button>
        <button 
          className="bday-btn-download" 
          onClick={paid ? handleDownload : () => setShowPayment(true)}
          disabled={downloading}
        >
          <span className="btn-icon">⬇️</span> {downloading ? 'Downloading...' : 'Download Card'}
        </button>
      </div>

      <Toast text={toast.text} show={toast.show} />

      {/* Razorpay Payment Popup */}
      {showPayment && (
        <PaymentPopup
          cardType={CARD_TYPE}
          cardLabel={CARD_LABEL}
          userEmail={userEmail}
          onClose={() => setShowPayment(false)}
          onPaymentDone={(result) => {
            const withWatermark = result?.withWatermark ?? false;
            const isFree = result?.isFree ?? false;
            watermarkRef.current = withWatermark;
            if (!withWatermark && !isFree) setPaid(true);
            if (result?.email) setDownloadEmail(result.email);
            if (result?.phone) setDownloadPhone(result.phone);
            setShowPayment(false);
            setTimeout(() => handleDownload(), 500);
          }}
        />
      )}

    </div>
  );
}
