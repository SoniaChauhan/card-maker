'use client';
import { useState, useEffect } from 'react';
import './SalonCard.css';
import SalonForm from './SalonForm';
import { DEFAULT_SERVICES } from './SalonForm';
import SalonCardPreview from './SalonCardPreview';
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

const CARD_TYPE = 'saloncard';
const CARD_LABEL = 'Salon / Parlour Card';
const PARTICLES = ['💇', '💅', '✨', '💄', '🌸', '🪞', '💎', '🌿'];

const INIT = {
  businessName: '',
  tagline: 'Special Packages',
  services: [...DEFAULT_SERVICES],
  contactPhone: '',
  contactName: '',
  address: '',
  logo: null,
  logoPreview: '',
  theme: 'dark-gold',
};

export default function SalonCard({ onBack, userEmail, initialData, isSuperAdmin }) {
  const [step, setStep]     = useState('form');
  const [data, setData]     = useState(initialData ? { ...INIT, ...initialData } : INIT);
  const [errors, setErrors] = useState({});
  const [paid, setPaid]             = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const filename = `salon-card-${toFilename(data.businessName || 'salon')}.png`;
  const dlTitle  = data.businessName || 'Salon Card';

  const { downloading, handleDownload, toast, watermarkRef, downloadedBlob, clearDownloadedBlob } = useDownload('salon-card-print', filename, {
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
      <SalonForm
        data={data}
        errors={errors}
        onChange={onChange}
        onBack={onBack}
        onGenerate={onGenerate}
        onServiceChange={(services) => setData(d => ({ ...d, services }))}
      />
    );
  }

  /* ─── Card Preview View ─── */
  return (
    <div className="salon-card-screen">
      <Particles icons={PARTICLES} count={20} />

      <div className="salon-preview-container">
        <p className="salon-screen-title">💇 Your Salon Service Card</p>
        <div className="salon-preview-wrapper">
          <div id="salon-card-print">
            <SalonCardPreview data={data} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="salon-action-buttons">
        <button className="salon-back-btn" onClick={() => setStep('form')}>← Back</button>
        <button className="salon-btn-edit" onClick={() => setStep('form')}>
          <span className="btn-icon">✏️</span> Edit Card
        </button>
        <button
          className="salon-btn-download"
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
