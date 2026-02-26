import { useState, useEffect, lazy, Suspense } from 'react';
import './DownloadHistory.css';
import { getUserDownloads, deleteDownloadRecord } from '../../services/downloadHistoryService';
import Toast from '../shared/Toast';
import html2canvas from 'html2canvas';

/* Lazy-load card preview components so this module stays light */
const BirthdayCardPreview    = lazy(() => import('../BirthdayCard/BirthdayCardPreview'));
const WeddingCardPreview     = lazy(() => import('../WeddingCard/WeddingCardPreview'));
const AnniversaryCardPreview = lazy(() => import('../AnniversaryCard/AnniversaryCardPreview'));
const JagrataCardPreview     = lazy(() => import('../JagrataCard/JagrataCardPreview'));
const BiodataCardPreview     = lazy(() => import('../BiodataCard/BiodataCardPreview'));
const ResumeCardPreview      = lazy(() => import('../ResumeCard/ResumeCardPreview'));

const CARD_META = {
  birthday:        { icon: '🎂', label: 'Birthday Invite Designer',       color: 'linear-gradient(135deg,#ff6b6b,#feca57)' },
  wedding:         { icon: '💐', label: 'Wedding Invite Designer',       color: 'linear-gradient(135deg,#7b1c1c,#c9963e)' },
  anniversary:     { icon: '💍', label: 'Anniversary Greeting Designer',  color: 'linear-gradient(135deg,#dc3c64,#ff9a9e)' },
  babyshower:      { icon: '🍼', label: 'Baby Shower',                   color: 'linear-gradient(135deg,#f8a5c2,#f7d794)' },
  namingceremony:  { icon: '🪷', label: 'Naming Ceremony',               color: 'linear-gradient(135deg,#e056a0,#f0a3ef)' },
  housewarming:    { icon: '🏠', label: 'Housewarming',                  color: 'linear-gradient(135deg,#e17055,#fdcb6e)' },
  graduation:      { icon: '🎓', label: 'Graduation / Farewell',         color: 'linear-gradient(135deg,#636e72,#2d3436)' },
  haldi:           { icon: '💛', label: 'Haldi',                         color: 'linear-gradient(135deg,#f9ca24,#f0932b)' },
  mehendi:         { icon: '🌿', label: 'Mehendi',                       color: 'linear-gradient(135deg,#6ab04c,#badc58)' },
  sangeet:         { icon: '🎶', label: 'Sangeet',                       color: 'linear-gradient(135deg,#be2edd,#e056a0)' },
  reception:       { icon: '🥂', label: 'Reception',                     color: 'linear-gradient(135deg,#6c5ce7,#a29bfe)' },
  savethedate:     { icon: '📅', label: 'Save the Date',                 color: 'linear-gradient(135deg,#e84393,#fd79a8)' },
  jagrata:         { icon: '🪔', label: 'Jagrata',                       color: 'linear-gradient(135deg,#f7971e,#ffd200)' },
  satyanarayan:    { icon: '🙏', label: 'Satyanarayan Katha',            color: 'linear-gradient(135deg,#e55039,#f39c12)' },
  garba:           { icon: '💃', label: 'Garba / Navratri',              color: 'linear-gradient(135deg,#eb4d4b,#f9ca24)' },
  resume:          { icon: '📄', label: 'Resume Builder',                color: 'linear-gradient(135deg,#1a73e8,#2d3748)' },
  biodata:         { icon: '💍', label: 'Marriage Profile',               color: 'linear-gradient(135deg,#c0392b,#d4af37)' },
  visitingcard:    { icon: '🪪', label: 'Visiting Card',                 color: 'linear-gradient(135deg,#0984e3,#74b9ff)' },
  businessdocs:    { icon: '📋', label: 'Business Docs',                 color: 'linear-gradient(135deg,#2d3436,#636e72)' },
  thankyou:        { icon: '🙏', label: 'Thank You',                     color: 'linear-gradient(135deg,#e84393,#fd79a8)' },
  congratulations: { icon: '🎊', label: 'Congratulations',               color: 'linear-gradient(135deg,#f39c12,#e74c3c)' },
  goodluck:        { icon: '🍀', label: 'Good Luck',                     color: 'linear-gradient(135deg,#00b894,#55efc4)' },
  festivalcards:   { icon: '🎆', label: 'Festival Cards',                color: 'linear-gradient(135deg,#fdcb6e,#e17055)' },
  whatsappinvites: { icon: '💬', label: 'WhatsApp Invites',              color: 'linear-gradient(135deg,#25d366,#128c7e)' },
  instagramstory:  { icon: '📸', label: 'Instagram Story Templates',     color: 'linear-gradient(135deg,#833ab4,#fd1d1d)' },
  socialevent:     { icon: '🌐', label: 'Social Event Cards',            color: 'linear-gradient(135deg,#0984e3,#6c5ce7)' },
};

/* Map cardType ➜ preview element id (matches what useDownload uses) */
const PRINT_IDS = {
  birthday: 'birthday-card-print', wedding: 'wedding-card-print',
  anniversary: 'anniversary-card-print', jagrata: 'jagrata-card-print',
  biodata: 'biodata-print', resume: 'resume-print',
};

/* Card type ➜ preview component */
function PreviewRenderer({ cardType, data }) {
  switch (cardType) {
    case 'birthday':    return <BirthdayCardPreview    data={data} lang={data._lang || 'en'} template={data._template || 1} />;
    case 'wedding':     return <WeddingCardPreview     data={data} lang={data._lang || 'en'} template={data._template || 1} />;
    case 'anniversary': return <AnniversaryCardPreview data={data} lang={data._lang || 'en'} />;
    case 'jagrata':     return <JagrataCardPreview     data={data} lang={data._lang || 'hi'} />;
    case 'biodata':     return <BiodataCardPreview     data={data} lang={data._lang || 'en'} />;
    case 'resume':      return <ResumeCardPreview      data={data} />;
    default:            return <p style={{ color: '#888', textAlign: 'center', padding: 40 }}>Preview not available for this card type.</p>;
  }
}

export default function DownloadHistory({ userEmail }) {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [deleting, setDeleting]   = useState(null);
  const [toast, setToast]         = useState({ show: false, text: '' });
  const [preview, setPreview]     = useState(null);   // download object being previewed
  const [downloading, setDownloading] = useState(null); // id of card being re-downloaded

  useEffect(() => {
    loadDownloads();
  }, [userEmail]);

  async function loadDownloads() {
    setLoading(true);
    try {
      const list = await getUserDownloads(userEmail);
      setDownloads(list);
    } catch (err) {
      console.error('Failed to load download history:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(dl) {
    if (!window.confirm(`Remove "${dl.title}" from download history?`)) return;
    setDeleting(dl.id);
    try {
      await deleteDownloadRecord(dl.id);
      setDownloads(prev => prev.filter(d => d.id !== dl.id));
      showToast('Download record removed.');
    } catch (err) {
      console.error('Delete failed:', err);
      showToast('Failed to remove record.');
    } finally {
      setDeleting(null);
    }
  }

  /* Re-download from the preview modal */
  async function handleRedownload(dl) {
    const printId = PRINT_IDS[dl.cardType];
    if (!printId) {
      showToast('⚠️ Re-download not available for this card type.');
      return;
    }
    setDownloading(dl.id);
    await new Promise(r => setTimeout(r, 400)); // let the preview render

    const el = document.getElementById(printId);
    if (!el) { showToast('⚠️ Card element not found.'); setDownloading(null); return; }

    try {
      const prevMaxW = el.style.maxWidth;
      const prevW    = el.style.width;
      const prevMinW = el.style.minWidth;
      el.style.maxWidth = 'none';
      el.style.width    = '600px';
      el.style.minWidth = '600px';
      await new Promise(r => setTimeout(r, 300));

      const canvas = await html2canvas(el, {
        scale: 2, useCORS: true, allowTaint: true,
        backgroundColor: null, logging: false,
        width: el.scrollWidth, height: el.scrollHeight,
        windowWidth: el.scrollWidth + 100, scrollX: 0, scrollY: 0,
      });

      el.style.maxWidth = prevMaxW;
      el.style.width    = prevW;
      el.style.minWidth = prevMinW;

      const link = document.createElement('a');
      link.download = dl.filename || 'card.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast('✅ Card downloaded!');
    } catch (err) {
      console.error('Re-download failed:', err);
      showToast('❌ Download failed.');
    } finally {
      setDownloading(null);
    }
  }

  function showToast(text) {
    setToast({ show: true, text });
    setTimeout(() => setToast({ show: false, text: '' }), 2500);
  }

  function formatDate(ts) {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }

  /* ---- rendering ---- */

  if (loading) {
    return (
      <div className="dh-loading">
        <div className="dh-spinner" />
        <p>Loading download history…</p>
      </div>
    );
  }

  if (!downloads.length) {
    return (
      <div className="dh-empty">
        <span className="dh-empty-icon">📥</span>
        <h3>No downloads yet</h3>
        <p>When you download a card, it will be recorded here so you can track all your generated designs.</p>
      </div>
    );
  }

  return (
    <div className="download-history">
      <p className="dh-subtitle">
        You have downloaded <strong>{downloads.length}</strong> card{downloads.length > 1 ? 's' : ''}
      </p>

      <div className="dh-grid">
        {downloads.map(dl => {
          const meta = CARD_META[dl.cardType] || { icon: '🃏', label: dl.cardType, color: '#555' };
          const hasPreview = !!PRINT_IDS[dl.cardType];
          return (
            <div className="dh-card" key={dl.id}>
              {/* colour badge */}
              <div className="dh-card-badge" style={{ background: meta.color }}>
                <span className="dh-card-badge-icon">{meta.icon}</span>
                <span className="dh-card-badge-label">{meta.label}</span>
              </div>

              <div className="dh-card-body">
                <h4 className="dh-card-title">{dl.title}</h4>
                <div className="dh-card-meta">
                  <span className="dh-meta-file">📁 {dl.filename}</span>
                  <span className="dh-meta-date">📅 {formatDate(dl.downloadedAt)}</span>
                </div>

                {/* snapshot preview chips */}
                <div className="dh-card-fields">
                  {Object.entries(dl.formSnapshot || {}).slice(0, 4).map(([k, v]) => {
                    if (!v || k === 'photoPreview' || k.startsWith('_')) return null;
                    const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                    const display = typeof v === 'string' ? v : Array.isArray(v) ? `${v.length} items` : '';
                    if (!display) return null;
                    return (
                      <span className="dh-field-chip" key={k} title={`${label}: ${display}`}>
                        {label}: {display.length > 25 ? display.slice(0, 25) + '…' : display}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="dh-card-actions">
                {hasPreview && (
                  <button className="dh-btn dh-btn-preview" onClick={() => setPreview(dl)}>
                    👁️ Preview
                  </button>
                )}
                {hasPreview && (
                  <button
                    className="dh-btn dh-btn-download"
                    onClick={() => { setPreview(dl); setTimeout(() => handleRedownload(dl), 500); }}
                    disabled={downloading === dl.id}
                  >
                    {downloading === dl.id ? '⏳ Downloading…' : '⬇️ Download'}
                  </button>
                )}
                <button
                  className="dh-btn dh-btn-delete"
                  onClick={() => handleDelete(dl)}
                  disabled={deleting === dl.id}
                >
                  {deleting === dl.id ? '⏳' : '🗑️'} Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Preview Modal ─── */}
      {preview && (
        <div className="dh-preview-overlay" onClick={() => setPreview(null)}>
          <div className="dh-preview-modal" onClick={e => e.stopPropagation()}>
            <div className="dh-preview-header">
              <h3>{preview.title}</h3>
              <button className="dh-preview-close" onClick={() => setPreview(null)}>✕</button>
            </div>
            <div className="dh-preview-body">
              <Suspense fallback={<div className="dh-loading"><div className="dh-spinner" /><p>Loading preview…</p></div>}>
                <PreviewRenderer cardType={preview.cardType} data={preview.formSnapshot || {}} />
              </Suspense>
            </div>
            <div className="dh-preview-footer">
              <button
                className="dh-btn dh-btn-download"
                onClick={() => handleRedownload(preview)}
                disabled={downloading === preview.id}
              >
                {downloading === preview.id ? '⏳ Downloading…' : '⬇️ Download Again'}
              </button>
              <button className="dh-btn dh-btn-close-modal" onClick={() => setPreview(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast text={toast.text} show={toast.show} />
    </div>
  );
}
