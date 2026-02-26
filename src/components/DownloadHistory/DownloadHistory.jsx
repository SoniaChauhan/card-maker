import { useState, useEffect } from 'react';
import './DownloadHistory.css';
import { getUserDownloads, deleteDownloadRecord } from '../../services/downloadHistoryService';
import Toast from '../shared/Toast';

const CARD_META = {
  birthday:    { icon: '🎂', label: 'Birthday Invitation',  color: 'linear-gradient(135deg,#ff6b6b,#feca57)' },
  anniversary: { icon: '💍', label: 'Anniversary Card',      color: 'linear-gradient(135deg,#dc3c64,#ff9a9e)' },
  jagrata:     { icon: '🪔', label: 'Jagrata Invitation',    color: 'linear-gradient(135deg,#f7971e,#ffd200)' },
  biodata:     { icon: '💍', label: 'Marriage Biodata',       color: 'linear-gradient(135deg,#c0392b,#d4af37)' },
  wedding:     { icon: '💐', label: 'Wedding Invitation',    color: 'linear-gradient(135deg,#7b1c1c,#c9963e)' },
  resume:      { icon: '📄', label: 'Resume / CV',            color: 'linear-gradient(135deg,#1a73e8,#2d3748)' },
};

export default function DownloadHistory({ userEmail }) {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [deleting, setDeleting]   = useState(null);
  const [toast, setToast]         = useState({ show: false, text: '' });

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
                    if (!v || k === 'photoPreview') return null;
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
      <Toast text={toast.text} show={toast.show} />
    </div>
  );
}
