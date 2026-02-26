import { useState, useEffect } from 'react';
import './MyTemplates.css';
import { getUserTemplates, deleteTemplate } from '../../services/templateService';
import Toast from '../shared/Toast';

const CARD_META = {
  birthday:    { icon: '🎂', label: 'Birthday Invite Designer',       color: 'linear-gradient(135deg,#ff6b6b,#feca57)' },
  anniversary: { icon: '💍', label: 'Anniversary Greeting Designer',  color: 'linear-gradient(135deg,#dc3c64,#ff9a9e)' },
  jagrata:     { icon: '🪔', label: 'Spiritual Event Invitation',    color: 'linear-gradient(135deg,#f7971e,#ffd200)' },
  biodata:     { icon: '💍', label: 'Marriage Profile Card',          color: 'linear-gradient(135deg,#c0392b,#d4af37)' },
  wedding:     { icon: '💐', label: 'Wedding Invite Designer',       color: 'linear-gradient(135deg,#7b1c1c,#c9963e)' },
  resume:      { icon: '📄', label: 'Professional Resume Builder',   color: 'linear-gradient(135deg,#1a73e8,#2d3748)' },
};

export default function MyTemplates({ userEmail, onEditTemplate }) {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [deleting, setDeleting]   = useState(null);
  const [toast, setToast]         = useState({ show: false, text: '' });

  useEffect(() => {
    loadTemplates();
  }, [userEmail]);

  async function loadTemplates() {
    setLoading(true);
    try {
      const list = await getUserTemplates(userEmail);
      setTemplates(list);
    } catch (err) {
      console.error('Failed to load templates:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(tpl) {
    if (!window.confirm(`Delete "${tpl.templateName}"? This cannot be undone.`)) return;
    setDeleting(tpl.id);
    try {
      await deleteTemplate(tpl.id);
      setTemplates(prev => prev.filter(t => t.id !== tpl.id));
      showToast('Template deleted successfully.');
    } catch (err) {
      console.error('Delete failed:', err);
      showToast('Failed to delete template.');
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
      <div className="mt-loading">
        <div className="mt-spinner" />
        <p>Loading your templates...</p>
      </div>
    );
  }

  if (!templates.length) {
    return (
      <div className="mt-empty">
        <span className="mt-empty-icon">📋</span>
        <h3>No saved templates yet</h3>
        <p>When you generate a card, you can save it as a template — so you can edit and reuse it anytime.</p>
      </div>
    );
  }

  return (
    <div className="my-templates">
      <p className="mt-subtitle">You have <strong>{templates.length}</strong> saved template{templates.length > 1 ? 's' : ''}</p>

      <div className="mt-grid">
        {templates.map(tpl => {
          const meta = CARD_META[tpl.cardType] || { icon: '🃏', label: tpl.cardType, color: '#555' };
          return (
            <div className="mt-card" key={tpl.id}>
              {/* colour badge */}
              <div className="mt-card-badge" style={{ background: meta.color }}>
                <span className="mt-card-badge-icon">{meta.icon}</span>
                <span className="mt-card-badge-label">{meta.label}</span>
              </div>

              <div className="mt-card-body">
                <h4 className="mt-card-name">{tpl.templateName}</h4>
                <div className="mt-card-dates">
                  <span>Created: {formatDate(tpl.createdAt)}</span>
                  <span>Updated: {formatDate(tpl.updatedAt)}</span>
                </div>

                {/* quick preview of key fields */}
                <div className="mt-card-fields">
                  {Object.entries(tpl.formData || {}).slice(0, 4).map(([k, v]) => {
                    if (!v || k === 'photoPreview') return null;
                    const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
                    const display = typeof v === 'string' ? v : Array.isArray(v) ? `${v.length} items` : '';
                    if (!display) return null;
                    return (
                      <span className="mt-field-chip" key={k} title={`${label}: ${display}`}>
                        {label}: {display.length > 25 ? display.slice(0, 25) + '…' : display}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="mt-card-actions">
                <button className="mt-btn mt-btn-edit" onClick={() => onEditTemplate(tpl)}>
                  ✏️ Edit & Generate
                </button>
                <button
                  className="mt-btn mt-btn-delete"
                  onClick={() => handleDelete(tpl)}
                  disabled={deleting === tpl.id}
                >
                  {deleting === tpl.id ? '⏳' : '🗑️'} Delete
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
