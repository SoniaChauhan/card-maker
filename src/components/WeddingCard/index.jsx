'use client';
import { useState, useEffect, useRef } from 'react';
import './WeddingCard.css';
import WeddingForm from './WeddingForm';
import WeddingCardPreview from './WeddingCardPreview';
import { TEMPLATES } from './TemplateChooser';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import LanguagePicker from '../shared/LanguagePicker';
import PaymentPopup from '../shared/PaymentPopup';
import ShareButtons from '../shared/ShareButtons';
import '../shared/ShareButtons.css';
import UserLookup from '../shared/UserLookup';
import '../shared/UserLookup.css';
import useDownload from '../../hooks/useDownload';
import { toFilename } from '../../utils/helpers';
import { LANGUAGES } from '../../utils/translations';
import { logDownload } from '../../services/downloadHistoryService';
import { hasUserPaid, checkUserAccess, sendDownloadEmail } from '../../services/paymentService';

const CARD_TYPE = 'wedding';
const CARD_LABEL = 'Wedding Invitation';

const INIT = {
  groomName: '', brideName: '', groomFamily: '', brideFamily: '',
  weddingDate: '', weddingTime: '', weddingVenue: '', weddingVenueAddress: '',
  receptionDate: '', receptionTime: '', receptionVenue: '',
  guestName: '', message: '', familyMembers: '', photo: null, photoPreview: '',
  customPrograms: [],   // [{ name, date, time, venue }]
  selectedTemplate: 1,  // 1-7 template choice
  bgColor: '',          // custom background color
};
const PARTICLES = ['🌸', '🪷', '✨', '🌺', '💐', '🎊', '🌟', '💖', '🪷', '✿'];

const BG_SWATCHES = [
  { color: '',        label: 'Default' },
  { color: '#fdf8f0', label: 'Ivory' },
  { color: '#fce4ec', label: 'Blush Pink' },
  { color: '#fff8e1', label: 'Champagne' },
  { color: '#f3e5f5', label: 'Lavender' },
  { color: '#e8f5e9', label: 'Sage' },
  { color: '#e3f2fd', label: 'Sky Blue' },
  { color: '#ffffff', label: 'White' },
  { color: '#2a0608', label: 'Dark Maroon' },
  { color: '#1a0a2e', label: 'Deep Purple' },
];

export default function WeddingCard({ onBack, userEmail, initialData, templateId: initTplId, isSuperAdmin }) {
  const [step, setStep]     = useState(initialData ? 'form' : 'lookup');
  const [data, setData]     = useState(initialData ? { ...INIT, ...initialData } : INIT);
  const [errors, setErrors] = useState({});
  const [lang, setLang]     = useState('en');
  const [paid, setPaid]     = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [downloadEmail, setDownloadEmail] = useState(userEmail || '');
  const [downloadPhone, setDownloadPhone] = useState('');
  const [lookupPhone, setLookupPhone] = useState('');
  const carouselRef = useRef(null);

  const filename = `wedding-${toFilename(data.groomName || 'invitation')}.png`;
  const dlTitle = data.groomName && data.brideName ? `${data.groomName} & ${data.brideName} Wedding` : 'Wedding Invite';
  const { downloading, handleDownload, toast, watermarkRef, downloadedBlob, clearDownloadedBlob } = useDownload('wedding-card-print', filename, {
    onSuccess: async () => {
      // Log download
      const downloadId = await logDownload(userEmail, CARD_TYPE, 'Wedding Invite Designer', dlTitle, filename, data).catch(() => null);
      // Send download link email
      if (downloadEmail) {
        sendDownloadEmail({ email: downloadEmail, cardType: CARD_TYPE, cardLabel: CARD_LABEL, downloadId }).catch(() => {});
      }
    },
    downloadWidth: 800,
    addWatermark: true,
  });

  useEffect(() => {
    if (isSuperAdmin) { setPaid(true); watermarkRef.current = false; return; }
    if (!userEmail) return;
    hasUserPaid(userEmail, CARD_TYPE).then(p => {
      setPaid(p);
      watermarkRef.current = !p;
    }).catch(() => {});
  }, [userEmail, isSuperAdmin]);

  /* If lookup found details, check payment access by phone */
  useEffect(() => {
    if (!lookupPhone || paid) return;
    checkUserAccess('', CARD_TYPE, lookupPhone).then(access => {
      if (access.hasAccess) {
        setPaid(true);
        watermarkRef.current = false;
      }
    }).catch(() => {});
  }, [lookupPhone]);

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
    if (!data.groomName.trim())    err.groomName    = 'Groom\'s name is required.';
    if (!data.brideName.trim())    err.brideName    = 'Bride\'s name is required.';
    if (!data.weddingDate)         err.weddingDate  = 'Wedding date is required.';
    if (!data.weddingVenue.trim()) err.weddingVenue = 'Wedding venue is required.';
    return err;
  }

  function onGenerate() {
    const err = validate();
    if (Object.keys(err).length) { setErrors(err); return; }
    setStep('card');
  }

  function onProgramChange(programs) {
    setData(d => ({ ...d, customPrograms: programs }));
  }

  if (step === 'lookup') {
    return (
      <UserLookup
        cardType={CARD_TYPE}
        onContinue={({ prefillData, lookupId, lookupFound }) => {
          if (prefillData) {
            setData(d => ({ ...d, ...prefillData, photo: null, photoPreview: prefillData.photoPreview || '' }));
          }
          if (lookupFound && lookupId) setLookupPhone(lookupId);
          setStep('form');
        }}
        onSkip={() => setStep('form')}
      />
    );
  }

  if (step === 'form') {
    return (
      <WeddingForm
        data={data}
        errors={errors}
        onChange={onChange}
        onBack={onBack}
        onGenerate={onGenerate}
        onProgramChange={onProgramChange}
      />
    );
  }

  return (
    <div className="wedding-card-screen">
      <Particles icons={PARTICLES} count={24} />

      {/* Main Preview Card Container */}
      <div className="wed-preview-container">
        <p className="wedding-screen-title">💍 Your Wedding Invite</p>
        <LanguagePicker value={lang} onChange={setLang} languages={LANGUAGES} />

        {/* Background Color Picker */}
        <div className="wed-bg-picker">
          <span className="wed-bg-picker-label">🎨 Card Background:</span>
          <div className="wed-bg-swatches">
            {BG_SWATCHES.map(s => (
              <button key={s.color || 'default'} className={`wed-bg-swatch ${data.bgColor === s.color ? 'active' : ''}`}
                style={{ background: s.color || 'linear-gradient(135deg,#ccc,#eee)' }}
                title={s.label}
                onClick={() => setData(d => ({ ...d, bgColor: s.color }))} />
            ))}
            <input type="color" className="wed-bg-custom-input" title="Pick custom color"
              value={data.bgColor || '#fdf8f0'}
              onChange={e => setData(d => ({ ...d, bgColor: e.target.value }))} />
            {data.bgColor && (
              <button className="wed-bg-reset" onClick={() => setData(d => ({ ...d, bgColor: '' }))}>
                ↺ Reset
              </button>
            )}
          </div>
        </div>

        <div className="wed-preview-card-wrapper">
          <div id="wedding-card-print" className={`screenshot-protected${paid ? '' : ' card-preview-locked'}`}>
            <WeddingCardPreview data={data} lang={lang} template={data.selectedTemplate || 1} bgColor={data.bgColor} />
          </div>
          {!paid && (
            <div className="wed-preview-watermark">
              <span className="watermark-text">PREVIEW</span>
              <span className="watermark-subtext">Watermark removed in download</span>
            </div>
          )}
        </div>
      </div>

      {/* Template Carousel Section */}
      <div className="wed-template-section">
        <button className="carousel-arrow carousel-arrow-left" onClick={() => scrollCarousel(-1)}>‹</button>
        <div className="wed-template-carousel" ref={carouselRef}>
          {TEMPLATES.map(tpl => (
            <div 
              key={tpl.id}
              className={`wed-template-item ${data.selectedTemplate === tpl.id ? 'wed-template-item--selected' : ''}`}
              onClick={() => setData(d => ({ ...d, selectedTemplate: tpl.id }))}
            >
              <div className="wed-template-thumb" style={{ borderColor: data.selectedTemplate === tpl.id ? tpl.accent : 'transparent' }}>
                <div className="wed-template-thumb-inner">
                  <WeddingCardPreview data={data} lang={lang} template={tpl.id} bgColor={data.bgColor} />
                </div>
              </div>
              <span className="wed-template-name">{tpl.name}</span>
            </div>
          ))}
        </div>
        <button className="carousel-arrow carousel-arrow-right" onClick={() => scrollCarousel(1)}>›</button>
      </div>

      {/* Action Buttons */}
      <div className="wed-action-buttons">
        <button className="wed-back-btn" onClick={onBack}>
          ← Back
        </button>
        <button className="wed-btn-edit" onClick={() => setStep('form')}>
          <span className="btn-icon">✏️</span> Edit Card
        </button>
        <button 
          className="wed-btn-download" 
          onClick={paid ? handleDownload : () => setShowPayment(true)}
          disabled={downloading}
        >
          <span className="btn-icon">⬇️</span> {downloading ? 'Downloading...' : 'Download Card'}
        </button>
      </div>

      <Toast text={toast.text} show={toast.show} />

      {downloadedBlob && (
        <ShareButtons
          blob={downloadedBlob}
          filename={filename}
          cardLabel={CARD_LABEL}
          onClose={clearDownloadedBlob}
        />
      )}

      {showPayment && (
        <PaymentPopup
          cardType={CARD_TYPE}
          cardLabel={CARD_LABEL}
          userEmail={userEmail}
          lookupPhone={lookupPhone}
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
