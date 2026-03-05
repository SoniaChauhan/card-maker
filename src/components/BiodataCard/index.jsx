'use client';
import { useState, useEffect, useRef } from 'react';
import './BiodataCard.css';
import BiodataFormNew from './BiodataFormNew';
import BiodataCardPreview from './BiodataCardPreview';
import BiodataPaymentPopup from './BiodataPaymentPopup';
import { TEMPLATES } from './BiodataTemplateChooser';
import Toast from '../shared/Toast';
import ShareButtons from '../shared/ShareButtons';
import '../shared/ShareButtons.css';
import UserLookup from '../shared/UserLookup';
import '../shared/UserLookup.css';
import useDownload from '../../hooks/useDownload';
import { toFilename } from '../../utils/helpers';
import { saveTemplate, updateTemplate } from '../../services/templateService';
import { logDownload } from '../../services/downloadHistoryService';
import { hasUserPaid, sendDownloadEmail } from '../../services/paymentService';

const CARD_TYPE = 'biodata';
const CARD_LABEL = 'Marriage Biodata';

const COMMUNITIES = [
  { id: 'marathi', label: 'Marathi', lang: 'mr' },
  { id: 'muslim', label: 'Muslim', lang: 'en' },
  { id: 'gujarati', label: 'Gujarati', lang: 'gu' },
  { id: 'hindi', label: 'Hindi', lang: 'hi' },
  { id: 'english', label: 'English', lang: 'en' },
];

const INIT = {
  fullName: '',
  dob: '',
  age: '',
  height: '',
  weight: '',
  complexion: '',
  bloodGroup: '',
  religion: 'Hindu',
  caste: '',
  subCaste: '',
  gotra: '',
  rashi: '',
  nakshatra: '',
  manglik: 'No',
  education: '',
  occupation: '',
  employer: '',
  annualIncome: '',
  fatherName: '',
  fatherOccupation: '',
  motherName: '',
  motherOccupation: '',
  siblings: '',
  hobbies: '',
  aboutMe: '',
  contactName: '',
  contactPhone: '',
  contactAddress: '',
  photo: null,
  photoPreview: '',
};

export default function BiodataCard({ onBack, userEmail, initialData, templateId: initTplId, isSuperAdmin }) {
  const [step, setStep] = useState(initialData ? 'form' : 'lookup');
  const [data, setData] = useState(initialData ? { ...INIT, ...initialData } : INIT);
  const [errors, setErrors] = useState({});
  // Language is derived from community selection
  const [saving, setSaving] = useState(false);
  const [templateId, setTemplateId] = useState(initTplId || null);
  const [paid, setPaid] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(initialData?.selectedTemplate || 1);
  const [community, setCommunity] = useState('hindi');
  const [showCommunityDropdown, setShowCommunityDropdown] = useState(false);
  const [downloadEmail, setDownloadEmail] = useState(userEmail || '');
  const [downloadPhone, setDownloadPhone] = useState('');
  const carouselRef = useRef(null);

  const filename = `biodata-${toFilename(data.fullName || 'card')}.png`;
  const dlTitle = data.fullName ? `${data.fullName} Profile` : 'Marriage Profile';
  const { downloading, handleDownload, toast, watermarkRef, downloadedBlob, clearDownloadedBlob } = useDownload('biodata-print', filename, {
    onSuccess: async () => {
      const downloadId = await logDownload(userEmail, CARD_TYPE, 'Marriage Profile Card', dlTitle, filename, data).catch(() => null);
      if (downloadEmail) {
        sendDownloadEmail({ email: downloadEmail, cardType: CARD_TYPE, cardLabel: CARD_LABEL, downloadId }).catch(() => {});
      }
    },
    addWatermark: true,
  });

  function scrollCarousel(direction) {
    if (carouselRef.current) {
      const scrollAmount = 200;
      carouselRef.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  }

  useEffect(() => {
    if (isSuperAdmin) { setPaid(true); watermarkRef.current = false; return; }
    if (!userEmail) return;
    hasUserPaid(userEmail, CARD_TYPE).then(p => {
      setPaid(p);
      watermarkRef.current = !p;
    }).catch(() => {});
  }, [userEmail, isSuperAdmin]);

  function onChange(e) {
    const { name, value, files } = e.target;
    if (name === 'photo' && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(d => ({ ...d, photo: files[0], photoPreview: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setData(d => ({ ...d, [name]: value }));
      if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
    }
  }

  function validate() {
    // All fields are optional — no required validation
    return {};
  }

  function onGenerate() {
    const err = validate();
    if (Object.keys(err).length) { 
      setErrors(err);
      return; 
    }
    setStep('card');
  }

  async function handleSaveTemplate() {
    setSaving(true);
    try {
      const name = data.fullName ? `${data.fullName} Biodata` : 'Biodata Template';
      const saveData = { ...data, selectedTemplate };
      if (templateId) {
        await updateTemplate(templateId, name, saveData);
      } else {
        const id = await saveTemplate(userEmail, 'biodata', name, saveData);
        setTemplateId(id);
      }
      alert(templateId ? 'Template updated!' : 'Template saved!');
    } catch (e) {
      console.error('Save template error:', e);
      const msg = e?.code === 'permission-denied'
        ? 'Firestore permission denied. Please update your Firestore rules.'
        : `Failed to save template: ${e.message || e}`;
      alert(msg);
    } finally { setSaving(false); }
  }

  if (step === 'lookup') {
    return (
      <UserLookup
        cardType={CARD_TYPE}
        onContinue={({ prefillData }) => {
          if (prefillData) {
            setData(d => ({ ...d, ...prefillData, photo: null, photoPreview: prefillData.photoPreview || '' }));
          }
          setStep('form');
        }}
        onSkip={() => setStep('form')}
      />
    );
  }

  if (step === 'form') {
    return (
      <BiodataFormNew
        data={data}
        errors={errors}
        onChange={onChange}
        onBack={onBack}
        onGenerate={onGenerate}
      />
    );
  }

  return (
    <div className="biodata-preview-screen">
      {/* Support Banner - Full Width */}
      <div className="biodata-support-banner">
        <div className="support-message">
          <p className="support-msg-en">Facing issues while creating biodata? We&apos;re here to help!</p>
          <p className="support-msg-hi">बायोडाटा बनाने में कोई समस्या? हम आपकी मदद के लिए यहाँ हैं!</p>
        </div>
        <div className="support-contact">
          <span className="support-icon">✉️</span>
          <a href="mailto:creativethinker.designhub@gmail.com" className="support-link">creativethinker.designhub@gmail.com</a>
        </div>
      </div>

      {/* Format Info Cloud */}
      <div className="biodata-format-info">
        <div className="format-info-header">
          <span className="format-info-icon">📱</span>
          <h4 className="format-info-title">Why PNG/JPG Format?</h4>
        </div>
        <p className="format-info-text">
          We provide biodata in <strong>PNG/JPG image format</strong> because not everyone has PDF reader apps on their mobile. 
          Images are universally viewable and can be <strong>easily shared via WhatsApp, Email, or social media</strong> without any compatibility issues!
        </p>
      </div>

      {/* Main Preview Section */}
      <div className="biodata-main-preview">
        <div className="biodata-preview-card-wrapper">
          <BiodataCardPreview data={data} lang={COMMUNITIES.find(c => c.id === community)?.lang || 'en'} template={selectedTemplate} community={community} />
          {/* Watermark overlay for preview */}
          {!paid && (
            <div className="biodata-preview-watermark">
              <span className="watermark-text">PREVIEW</span>
              <span className="watermark-subtext">Watermark removed in download</span>
            </div>
          )}
        </div>
      </div>

      {/* Template Carousel Section */}
      <div className="biodata-template-section">
        <button className="carousel-arrow carousel-arrow-left" onClick={() => scrollCarousel(-1)}>
          ‹
        </button>
        
        <div className="biodata-template-carousel" ref={carouselRef}>
          {TEMPLATES.map(tpl => (
            <div 
              key={tpl.id}
              className={`biodata-template-item ${selectedTemplate === tpl.id ? 'biodata-template-item--selected' : ''}`}
              onClick={() => setSelectedTemplate(tpl.id)}
            >
              <div className="biodata-template-thumb" style={{ borderColor: selectedTemplate === tpl.id ? tpl.accent : 'transparent' }}>
                <div className="biodata-template-thumb-inner">
                  <BiodataCardPreview data={data} lang={COMMUNITIES.find(c => c.id === community)?.lang || 'en'} template={tpl.id} community={community} />
                </div>
              </div>
              <span className="biodata-template-name">{tpl.name}</span>
            </div>
          ))}
        </div>

        <button className="carousel-arrow carousel-arrow-right" onClick={() => scrollCarousel(1)}>
          ›
        </button>
      </div>

      {/* Action Buttons with Community Dropdown */}
      <div className="biodata-action-buttons">
        {/* Back Button */}
        <button className="biodata-back-btn" onClick={onBack}>
          ← Back
        </button>

        {/* Community Dropdown */}
        <div className="community-picker-wrap">
          <button 
            className="community-picker-trigger"
            onClick={() => setShowCommunityDropdown(!showCommunityDropdown)}
          >
            <span className="community-icon">👥</span>
            <span className="community-label">{COMMUNITIES.find(c => c.id === community)?.label || 'Community'}</span>
            <span className={`community-arrow ${showCommunityDropdown ? 'community-arrow--up' : ''}`}>▾</span>
          </button>
          {showCommunityDropdown && (
            <div className="community-picker-dropdown">
              {COMMUNITIES.map(c => (
                <button
                  key={c.id}
                  className={`community-picker-item ${community === c.id ? 'community-picker-item--active' : ''}`}
                  onClick={() => { setCommunity(c.id); setShowCommunityDropdown(false); }}
                >
                  {c.label}
                  {community === c.id && <span className="community-check">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="biodata-btn-edit" onClick={() => setStep('form')}>
          <span className="btn-icon">✏️</span> Edit Biodata
        </button>
        <button 
          className="biodata-btn-download" 
          onClick={paid ? handleDownload : () => setShowPayment(true)}
          disabled={downloading}
        >
          <span className="btn-icon">⬇️</span> {downloading ? 'Downloading...' : 'Download Biodata'}
        </button>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}

      {downloadedBlob && (
        <ShareButtons
          blob={downloadedBlob}
          filename={filename}
          cardLabel={CARD_LABEL}
          onClose={clearDownloadedBlob}
        />
      )}

      {showPayment && (
        <BiodataPaymentPopup
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
