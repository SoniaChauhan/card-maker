'use client';
import { useState, useEffect, useRef } from 'react';
import './RentCard.css';
import RentForm from './RentForm';
import RentCardPreview from './RentCardPreview';
import { DEFAULT_FEATURES, DEFAULT_AMENITIES, RENT_TEMPLATES, PROPERTY_TYPES, PROPERTY_TYPE_CONFIG } from './rentConstants';
import BiodataPaymentPopup from '../BiodataCard/BiodataPaymentPopup';
import '../BiodataCard/BiodataCard.css';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import ShareButtons from '../shared/ShareButtons';
import '../shared/ShareButtons.css';
import useDownload from '../../hooks/useDownload';
import { toFilename } from '../../utils/helpers';
import { logDownload } from '../../services/downloadHistoryService';
import { hasUserPaid } from '../../services/paymentService';

const CARD_TYPE = 'rentcard';
const CARD_LABEL = 'PG / Rent Card';
const PARTICLES = ['🏠', '🏡', '🛏️', '🔑', '🪟', '💡', '🏢', '✨'];

const INIT = {
  propertyType: 'pg',
  selectedTemplate: 1,
  title: 'PG / PER BED RENT AVAILABLE',
  location: '',
  rentWithoutAC: '',
  rentWithAC: '',
  features: [...DEFAULT_FEATURES],
  amenities: [...DEFAULT_AMENITIES],
  contactName: '',
  contactPhone: '',
  logo: null,
  logoPreview: '',
  propertyImages: [],       // array of { src, label } — max 6
  propertyImagesPreview: [],
};

export default function RentCard({ onBack, userEmail, initialData, isSuperAdmin }) {
  const [step, setStep]     = useState(initialData ? 'form' : 'form');
  const [data, setData]     = useState(initialData ? { ...INIT, ...initialData } : INIT);
  const [errors, setErrors] = useState({});
  const [paid, setPaid]             = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const filename = `rent-card-${toFilename(data.contactName || 'pg')}.png`;
  const dlTitle  = data.title || 'PG Rent Card';

  const { downloading, handleDownload, toast, watermarkRef, downloadedBlob, clearDownloadedBlob } = useDownload('rent-card-print', filename, {
    onSuccess: async () => {
      await logDownload(userEmail, CARD_TYPE, CARD_LABEL, dlTitle, filename, data).catch(() => null);
    },
    addWatermark: true,
  });

  /* Check payment status */
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
    if (name === 'logo' && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setData(d => ({ ...d, logo: reader.result, logoPreview: reader.result }));
      reader.readAsDataURL(files[0]);
    } else {
      setData(d => ({ ...d, [name]: value }));
      if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
    }
  }

  /* ── Property image helpers (max 6) ── */
  function addPropertyImages(fileList) {
    const remaining = 6 - (data.propertyImages || []).length;
    const toAdd = Array.from(fileList).slice(0, remaining);
    toAdd.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(d => {
          const imgs = [...(d.propertyImages || []), { src: reader.result, label: '' }];
          return { ...d, propertyImages: imgs };
        });
      };
      reader.readAsDataURL(file);
    });
  }
  function removePropertyImage(idx) {
    setData(d => ({ ...d, propertyImages: (d.propertyImages || []).filter((_, i) => i !== idx) }));
  }
  function updatePropertyImageLabel(idx, label) {
    setData(d => ({
      ...d,
      propertyImages: (d.propertyImages || []).map((img, i) => i === idx ? { ...img, label } : img),
    }));
  }

  /* ── Property type change — loads type-specific defaults ── */
  function onPropertyTypeChange(typeId) {
    const pt = PROPERTY_TYPES.find(t => t.id === typeId);
    const cfg = PROPERTY_TYPE_CONFIG[typeId] || PROPERTY_TYPE_CONFIG.pg;
    setData(d => ({
      ...d,
      propertyType: typeId,
      title: pt?.titleDefault || d.title,
      features: [...cfg.defaultFeatures],
      amenities: cfg.defaultAmenities.map(a => ({ ...a })),
    }));
  }

  function validate() {
    return {};
  }

  function onGenerate() {
    const err = validate();
    if (Object.keys(err).length) { setErrors(err); return; }
    setStep('card');
  }

  /* ─── Form View ─── */
  if (step === 'form') {
    return (
      <RentForm
        data={data}
        errors={errors}
        onChange={onChange}
        onBack={onBack}
        onGenerate={onGenerate}
        onFeatureChange={(features) => setData(d => ({ ...d, features }))}
        onAmenityChange={(amenities) => setData(d => ({ ...d, amenities }))}
        onPropertyTypeChange={onPropertyTypeChange}
        onTemplateChange={(id) => setData(d => ({ ...d, selectedTemplate: id }))}
        addPropertyImages={addPropertyImages}
        removePropertyImage={removePropertyImage}
        updatePropertyImageLabel={updatePropertyImageLabel}
      />
    );
  }

  /* ─── Card Preview View ─── */
  return (
    <div className="rent-card-screen">
      <Particles icons={PARTICLES} count={20} />

      <div className="rent-preview-container">
        <p className="rent-screen-title">🏠 Your PG / Rent Card</p>
        <div className="rent-preview-wrapper">
          <div id="rent-card-print">
            <RentCardPreview data={data} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="rent-action-buttons">
        <button className="rent-back-btn" onClick={() => setStep('form')}>← Back</button>
        <button className="rent-btn-edit" onClick={() => setStep('form')}>
          <span className="btn-icon">✏️</span> Edit Card
        </button>
        <button
          className="rent-btn-download"
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
        <BiodataPaymentPopup
          userEmail={userEmail}
          cardType={CARD_TYPE}
          cardLabel={CARD_LABEL}
          onClose={() => setShowPayment(false)}
          onPaymentDone={(result) => {
            const withWatermark = result?.withWatermark ?? false;
            const isFree = result?.isFree ?? false;
            watermarkRef.current = withWatermark;
            if (!withWatermark && !isFree) setPaid(true);
            setShowPayment(false);
            setTimeout(() => handleDownload(), 500);
          }}
        />
      )}
    </div>
  );
}
