import { useState } from 'react';
import WeddingCardPreview from './WeddingCardPreview';

const TEMPLATES = [
  { id: 1, name: 'Classic Gold',    desc: 'Ivory & gold, timeless Indian elegance',            icon: '👑', accent: '#b8860b' },
  { id: 2, name: 'Gold Ornate',     desc: 'Warm ivory with rich golden accents',               icon: '✨', accent: '#c9a84c' },
  { id: 3, name: 'Garden Floral',   desc: 'Mint green with botanical leaf wreath',             icon: '🌿', accent: '#3a7a4a' },
  { id: 4, name: 'Warm Peach',      desc: 'Soft peach & blush, romantic warmth',               icon: '🌸', accent: '#c4756a' },
  { id: 5, name: 'Royal Maroon',    desc: 'Deep maroon with luxurious gold text',              icon: '🏛️', accent: '#3d0a12' },
  { id: 6, name: 'Divine Love',     desc: 'Centered layout with divine couple art',            icon: '🙏', accent: '#c9976a' },
  { id: 7, name: 'Sacred Border',   desc: 'Bold dark frame with rich gold accents',            icon: '🪷', accent: '#8b6914' },
];

export default function TemplateChooser({ data, lang, selected, onSelect, onClose }) {
  const [previewId, setPreviewId] = useState(null);

  return (
    <div className="tpl-chooser-overlay" onClick={onClose}>
      <div className="tpl-chooser-modal" onClick={e => e.stopPropagation()}>
        <div className="tpl-chooser-header">
          <h3>🎨 Choose Your Template Design</h3>
          <p>Select a style that matches your wedding theme</p>
          <button className="tpl-chooser-close" onClick={onClose}>✕</button>
        </div>

        <div className="tpl-chooser-grid">
          {TEMPLATES.map(tpl => (
            <div key={tpl.id}
              className={`tpl-chooser-card ${selected === tpl.id ? 'tpl-chooser-card--selected' : ''}`}
              onClick={() => onSelect(tpl.id)}>

              <div className="tpl-thumb" style={{ borderColor: tpl.accent }}>
                <div className="tpl-thumb-inner">
                  <WeddingCardPreview data={data} lang={lang} template={tpl.id} />
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
                <WeddingCardPreview data={data} lang={lang} template={previewId} />
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
