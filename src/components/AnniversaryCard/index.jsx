'use client';
import { useState, useEffect, useRef } from 'react';
import './AnniversaryCard.css';
import AnniversaryForm from './AnniversaryForm';
import AnniversaryCardPreview from './AnniversaryCardPreview';
import { TEMPLATES } from './AnniversaryTemplateChooser';
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

const CARD_TYPE = 'anniversary';
const CARD_LABEL = 'Anniversary Greeting';

const INIT = { partner1: '', partner2: '', years: '', date: '', message: '', photo: null, photoPreview: '', selectedTemplate: 1, bgColor: '' };
const PARTICLES = ['🌹', '💕', '❤️', '💍', '✨', '🌸', '💖', '🌺'];

const BG_SWATCHES = [
  { color: '', label: 'Default' },
  { color: '#14264a', label: 'Deep Navy' },
  { color: '#2a1520', label: 'Dark Maroon' },
  { color: '#f8f5ee', label: 'Ivory' },
  { color: '#1a0a2e', label: 'Royal Purple' },
  { color: '#fdf8f0', label: 'Parchment' },
  { color: '#2d3436', label: 'Charcoal' },
  { color: '#0a1628', label: 'Midnight' },
  { color: '#1a3c2a', label: 'Forest' },
  { color: '#ffffff', label: 'White' },
];

export default function AnniversaryCard({ onBack, userEmail, initialData, templateId: initTplId, isSuperAdmin }) {
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

  const filename = `anniversary-${toFilename(data.partner1 || 'card')}.png`;
  const dlTitle = data.partner1 && data.partner2 ? `${data.partner1} & ${data.partner2} Anniversary` : 'Anniversary Card';
  const { downloading, handleDownload, toast, watermarkRef, downloadedBlob, clearDownloadedBlob } = useDownload('anniv-card-print', filename, {
    onSuccess: async () => {
      const downloadId = await logDownload(userEmail, CARD_TYPE, 'Anniversary Greeting Designer', dlTitle, filename, data).catch(() => null);
      if (downloadEmail) {
        sendDownloadEmail({ email: downloadEmail, cardType: CARD_TYPE, cardLabel: CARD_LABEL, downloadId }).catch(() => {});
      }
    },
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
    if (!data.partner1.trim()) err.partner1   = 'Partner 1 name is required.';
    if (!data.partner2.trim()) err.partner2   = 'Partner 2 name is required.';
    if (!data.date)            err.date       = 'Please select a date.';
    return err;
  }

  function onGenerate() {
    const err = validate();
    if (Object.keys(err).length) { setErrors(err); return; }
    setStep('card');
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
      <AnniversaryForm
        data={data}
        errors={errors}
        onChange={onChange}
        onBack={onBack}
        onGenerate={onGenerate}
      />
    );
  }

  return (
    <div className="anniversary-card-screen">
      <Particles icons={PARTICLES} count={24} />

      {/* Main Preview Card Container */}
      <div className="anniv-preview-container">
        <p className="anniversary-screen-title">💍 Your Anniversary Greeting</p>
        <LanguagePicker value={lang} onChange={setLang} languages={LANGUAGES} />

        {/* Background Color Picker */}
        <div className="anniv-bg-picker">
          <span className="anniv-bg-picker-label">🎨 Card Background:</span>
          <div className="anniv-bg-swatches">
            {BG_SWATCHES.map(s => (
              <button key={s.color || 'default'} className={`anniv-bg-swatch ${data.bgColor === s.color ? 'active' : ''}`}
                style={{ background: s.color || 'linear-gradient(135deg,#ccc,#eee)' }}
                title={s.label}
                onClick={() => setData(d => ({ ...d, bgColor: s.color }))} />
            ))}
            <input type="color" className="anniv-bg-custom-input" title="Pick custom color"
              value={data.bgColor || '#14264a'}
              onChange={e => setData(d => ({ ...d, bgColor: e.target.value }))} />
            {data.bgColor && (
              <button className="anniv-bg-reset" onClick={() => setData(d => ({ ...d, bgColor: '' }))}>
                ↺ Reset
              </button>
            )}
          </div>
        </div>

        <div className="anniv-preview-card-wrapper">
          <div id="anniv-card-print" className={`screenshot-protected${paid ? '' : ' card-preview-locked'}`}>
            <AnniversaryCardPreview data={data} lang={lang} template={data.selectedTemplate || 1} bgColor={data.bgColor} />
          </div>
          {!paid && (
            <div className="anniv-preview-watermark">
              <span className="watermark-text">PREVIEW</span>
              <span className="watermark-subtext">Watermark removed in download</span>
            </div>
          )}
        </div>
      </div>

      {/* Template Carousel Section */}
      <div className="anniv-template-section">
        <button className="carousel-arrow carousel-arrow-left" onClick={() => scrollCarousel(-1)}>‹</button>
        <div className="anniv-template-carousel" ref={carouselRef}>
          {TEMPLATES.map(tpl => (
            <div 
              key={tpl.id}
              className={`anniv-template-item ${data.selectedTemplate === tpl.id ? 'anniv-template-item--selected' : ''}`}
              onClick={() => setData(d => ({ ...d, selectedTemplate: tpl.id }))}
            >
              <div className="anniv-template-thumb" style={{ borderColor: data.selectedTemplate === tpl.id ? tpl.accent : 'transparent' }}>
                <div className="anniv-template-thumb-inner">
                  <AnniversaryCardPreview data={data} lang={lang} template={tpl.id} bgColor={data.bgColor} />
                </div>
              </div>
              <span className="anniv-template-name">{tpl.name}</span>
            </div>
          ))}
        </div>
        <button className="carousel-arrow carousel-arrow-right" onClick={() => scrollCarousel(1)}>›</button>
      </div>

      {/* Action Buttons */}
      <div className="anniv-action-buttons">
        <button className="anniv-back-btn" onClick={onBack}>
          ← Back
        </button>
        <button className="anniv-btn-edit" onClick={() => setStep('form')}>
          <span className="btn-icon">✏️</span> Edit Details
        </button>
        <button 
          className="anniv-btn-download" 
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
