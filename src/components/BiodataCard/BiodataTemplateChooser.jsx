'use client';
import { useState } from 'react';
import BiodataCardPreview from './BiodataCardPreview';

const TEMPLATES = [
  { id: 1, name: 'Classic Gold',    desc: 'Traditional maroon & gold elegance',           icon: '👑', accent: '#d4af37' },
  { id: 2, name: 'Royal Blue',      desc: 'Navy blue with silver accents',                icon: '💎', accent: '#1a3a5c' },
  { id: 3, name: 'Elegant Green',   desc: 'Forest green with golden touches',             icon: '🌿', accent: '#2d5a3d' },
  { id: 4, name: 'Pink Blossom',    desc: 'Soft pink with rose gold warmth',              icon: '🌸', accent: '#d4748a' },
  { id: 5, name: 'Modern Minimal',  desc: 'Clean white with subtle sophistication',       icon: '✨', accent: '#4a4a4a' },
  { id: 6, name: 'Royal Purple',    desc: 'Regal purple with golden highlights',          icon: '👸', accent: '#5c3a6e' },
];

export { TEMPLATES };

export default function BiodataTemplateChooser({ data, lang, selected, onSelect, onClose }) {
  const [previewId, setPreviewId] = useState(null);

  return (
    <div className="tpl-chooser-overlay" onClick={onClose}>
      <div className="tpl-chooser-modal" onClick={e => e.stopPropagation()}>
        <div className="tpl-chooser-header">
          <h3>🎨 Choose Your Template Design</h3>
          <p>Select a style that matches your preference</p>
          <button className="tpl-chooser-close" onClick={onClose}>✕</button>
        </div>

        <div className="tpl-chooser-grid">
          {TEMPLATES.map(tpl => (
            <div key={tpl.id}
              className={`tpl-chooser-card ${selected === tpl.id ? 'tpl-chooser-card--selected' : ''}`}
              onClick={() => onSelect(tpl.id)}>

              <div className="tpl-thumb" style={{ borderColor: tpl.accent }}>
                <div className="tpl-thumb-inner">
                  <BiodataCardPreview data={data} lang={lang} template={tpl.id} />
                </div>
              </div>

              <div className="tpl-card-info">
                <span className="tpl-card-icon">{tpl.icon}</span>
                <span className="tpl-card-name">{tpl.name}</span>
                {selected === tpl.id && <span className="tpl-card-check">✓</span>}
              </div>
              <p className="tpl-card-desc">{tpl.desc}</p>

              <button type="button"
                className="tpl-preview-btn"
                onClick={e => { e.stopPropagation(); setPreviewId(tpl.id); }}>
                👁️ Preview
              </button>
            </div>
          ))}
        </div>

        <div className="tpl-chooser-footer">
          <button className="tpl-btn-confirm" onClick={onClose}>
            ✓ Use Selected Design
          </button>
        </div>

        {/* Full-size preview overlay */}
        {previewId && (
          <div className="tpl-fullpreview-overlay" onClick={() => setPreviewId(null)}>
            <div className="tpl-fullpreview-wrap" onClick={e => e.stopPropagation()}>
              <button className="tpl-fullpreview-close" onClick={() => setPreviewId(null)}>✕</button>
              <div className="tpl-fullpreview-card">
                <BiodataCardPreview data={data} lang={lang} template={previewId} />
              </div>
              <div className="tpl-fullpreview-actions">
                <button className="tpl-btn-select" onClick={() => { onSelect(previewId); setPreviewId(null); }}>
                  ✓ Select This Design
                </button>
                <button className="tpl-btn-back" onClick={() => setPreviewId(null)}>
                  ← Back to Templates
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
