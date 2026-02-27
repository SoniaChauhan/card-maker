'use client';
import { useState, useEffect } from 'react';
import { getUserTemplates, deleteTemplate } from '../../services/templateService';
import WeddingCardPreview from './WeddingCardPreview';
import Toast from '../shared/Toast';

function formatDate(ts) {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function SavedWeddingCards({ userEmail, onLoadTemplate, onClose }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [deleting, setDeleting]   = useState(null);
  const [previewTpl, setPreviewTpl] = useState(null);
  const [toast, setToast]         = useState({ show: false, text: '' });

  useEffect(() => { loadTemplates(); }, [userEmail]);

  async function loadTemplates() {
    setLoading(true);
    try {
      const all = await getUserTemplates(userEmail);
      setTemplates(all.filter(t => t.cardType === 'wedding'));
    } catch (err) {
      console.error('Failed to load wedding templates:', err);
    } finally { setLoading(false); }
  }

  async function handleDelete(tpl) {
    if (!window.confirm(`Delete "${tpl.templateName}"? This cannot be undone.`)) return;
    setDeleting(tpl.id);
    try {
      await deleteTemplate(tpl.id);
      setTemplates(prev => prev.filter(t => t.id !== tpl.id));
      showToast('Template deleted.');
    } catch { showToast('Failed to delete.'); }
    finally { setDeleting(null); }
  }

  function showToast(text) {
    setToast({ show: true, text });
    setTimeout(() => setToast({ show: false, text: '' }), 2500);
  }

  /* ---- FULL PREVIEW OVERLAY ---- */
  if (previewTpl) {
    const fd = previewTpl.formData || {};
    return (
      <div className="swc-preview-overlay">
        <div className="swc-preview-wrap">
          <button className="swc-preview-close" onClick={() => setPreviewTpl(null)}>✕</button>
          <WeddingCardPreview data={fd} lang="en" template={fd.selectedTemplate || 1} />
          <div className="swc-preview-actions">
            <button className="swc-btn-load" onClick={() => { onLoadTemplate(previewTpl); setPreviewTpl(null); }}>
              ✏️ Load &amp; Edit This Card
            </button>
            <button className="swc-btn-back" onClick={() => setPreviewTpl(null)}>← Back to List</button>
          </div>
        </div>
      </div>
    );
  }

  /* ---- MAIN PANEL ---- */
  return (
    <div className="swc-overlay">
      <div className="swc-modal">
        <button className="swc-close" onClick={onClose}>✕</button>

        <div className="swc-header">
          <h3>📋 My Saved Wedding Cards</h3>
          <p>View, preview, or load any of your past and saved wedding designs.</p>
        </div>

        {loading ? (
          <div className="swc-loading">
            <div className="swc-spinner" />
            <p>Loading your cards…</p>
          </div>
        ) : !templates.length ? (
          <div className="swc-empty">
            <span className="swc-empty-icon">📭</span>
            <p>No saved wedding cards yet.</p>
            <p className="swc-empty-hint">
              Create a wedding card and click <strong>"Save Template"</strong> to see it here.
            </p>
          </div>
        ) : (
          <div className="swc-grid">
            {templates.map(tpl => {
              const fd = tpl.formData || {};
              return (
                <div key={tpl.id} className="swc-card">
                  {/* Mini preview thumb */}
                  <div className="swc-thumb" onClick={() => setPreviewTpl(tpl)}>
                    <div className="swc-thumb-inner">
                      <WeddingCardPreview data={fd} lang="en" template={fd.selectedTemplate || 1} />
                    </div>
                    <div className="swc-thumb-overlay">
                      <span>👁️ Preview</span>
                    </div>
                  </div>

                  <div className="swc-info">
                    <div className="swc-name">{tpl.templateName || 'Wedding Card'}</div>
                    <div className="swc-meta">
                      {fd.groomName && fd.brideName
                        ? <span className="swc-couple">{fd.groomName} & {fd.brideName}</span>
                        : null}
                      {fd.weddingDate && <span className="swc-date-badge">📅 {fd.weddingDate}</span>}
                    </div>
                    <div className="swc-time">
                      Saved: {formatDate(tpl.updatedAt || tpl.createdAt)}
                    </div>
                  </div>

                  <div className="swc-actions">
                    <button className="swc-btn-load" onClick={() => onLoadTemplate(tpl)}>
                      ✏️ Load &amp; Edit
                    </button>
                    <button
                      className="swc-btn-del"
                      onClick={() => handleDelete(tpl)}
                      disabled={deleting === tpl.id}
                    >
                      {deleting === tpl.id ? '⏳' : '🗑️'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <Toast text={toast.text} show={toast.show} />
      </div>
    </div>
  );
}
