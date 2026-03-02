'use client';
import { useState, useEffect } from 'react';
import './JagrataCard.css';
import JagrataForm from './JagrataForm';
import JagrataCardPreview from './JagrataCardPreview';
import CardActions from '../shared/CardActions';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import LanguagePicker from '../shared/LanguagePicker';
import PaymentPopup from '../shared/PaymentPopup';
import useDownload from '../../hooks/useDownload';
import { toFilename } from '../../utils/helpers';
import { LANGUAGES } from '../../utils/translations';
import { saveTemplate, updateTemplate } from '../../services/templateService';
import { logDownload } from '../../services/downloadHistoryService';
import { hasUserPaid, getCardPrice } from '../../services/paymentService';

const CARD_TYPE = 'jagrata';
const CARD_LABEL = 'Spiritual Event Invitation';

const INIT = { religion: 'hindu', guestName: '', organizerName: '', jagrataTitle: '', purpose: '', date: '', startTime: '', venue: '', venueAddress: '', prasad: '', message: '' };
const PARTICLES = ['🪔', '🙏', '🕉️', '✨', '🌸', '🌺', '⭐', '💛'];

export default function JagrataCard({ onBack, userEmail, initialData, templateId: initTplId, isSuperAdmin }) {
  const [step, setStep]     = useState('form');
  const [data, setData]     = useState(initialData ? { ...INIT, ...initialData } : INIT);
  const [errors, setErrors] = useState({});
  const [lang, setLang]     = useState('hi');
  const [saving, setSaving] = useState(false);
  const [templateId, setTemplateId] = useState(initTplId || null);
  const [paid, setPaid]     = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const filename = `jagrata-${toFilename(data.jagrataTitle || 'invite')}.png`;
  const dlTitle = data.jagrataTitle || 'Spiritual Event Invitation';
  const { downloading, handleDownload, toast, watermarkRef } = useDownload('jagrata-card-print', filename, {
    onSuccess: () => logDownload(userEmail, CARD_TYPE, 'Spiritual Event Invitation', dlTitle, filename, data).catch(() => {}),
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

  async function handleSaveTemplate() {
    setSaving(true);
    try {
      const name = data.jagrataTitle || 'Jagrata Template';
      if (templateId) {
        await updateTemplate(templateId, name, data);
      } else {
        const id = await saveTemplate(userEmail, 'jagrata', name, data);
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
    return <JagrataForm data={data} errors={errors} onChange={onChange} onBack={onBack} onGenerate={onGenerate} />;
  }

  return (
    <div className="jagrata-card-screen">
      <Particles icons={PARTICLES} count={24} />
      <div className="card-screen-container">
        <p className="jagrata-screen-title">🪔 Your Spiritual Event Invitation</p>
        <LanguagePicker value={lang} onChange={setLang} languages={LANGUAGES} />
        <div className={`card-wrapper screenshot-protected${!paid ? ' card-preview-locked' : ''}`}>
          <JagrataCardPreview data={data} lang={lang} />
        </div>

        {!paid && (
          <div className="download-locked-badge">
            🔒 Preview Mode — Pay ₹{getCardPrice(CARD_TYPE)} to remove watermark
          </div>
        )}
        {!paid && (
          <button
            className="btn-download pay-download-btn"
            onClick={() => setShowPayment(true)}
            style={{ background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', marginBottom: '8px', width: '100%', padding: '13px', fontSize: '15px', fontWeight: 700, border: 'none', borderRadius: '12px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(102,126,234,.4)' }}
          >
            💎 Pay ₹{getCardPrice(CARD_TYPE)} & Download (No Watermark)
          </button>
        )}

        <CardActions
          onEdit={() => setStep('form')}
          onBack={onBack}
          onDownload={handleDownload}
          downloading={downloading}
          dlBtnStyle={{ background: 'linear-gradient(135deg,#f7971e,#ffd200)', color: '#7a3e00', boxShadow: '0 6px 20px rgba(247,151,30,.5)' }}
          dlLabel={paid ? '⬇️ Download Card' : '⬇️ Download (with watermark)'}
        />
        <button className="btn-save-template" onClick={handleSaveTemplate} disabled={saving}>
          {saving ? '⏳ Saving…' : templateId ? '💾 Update Template' : '💾 Save Template'}
        </button>
      </div>
      <Toast text={toast.text} show={toast.show} />

      {showPayment && (
        <PaymentPopup
          cardType={CARD_TYPE}
          cardLabel={CARD_LABEL}
          userEmail={userEmail}
          onClose={() => setShowPayment(false)}
          onPaymentDone={() => {
            setPaid(true);
            watermarkRef.current = false;
            setShowPayment(false);
            setTimeout(() => handleDownload(), 500);
          }}
        />
      )}
    </div>
  );
}
