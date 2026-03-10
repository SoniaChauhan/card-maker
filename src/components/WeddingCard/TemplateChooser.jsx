'use client';
import { useState } from 'react';
import WeddingCardPreview from './WeddingCardPreview';

const TEMPLATES = [
  { id: 1,  name: 'Classic Gold',       desc: 'Ivory & gold, timeless Indian elegance',            icon: '👑', accent: '#b8860b' },
  { id: 2,  name: 'Gold Ornate',        desc: 'Warm ivory with rich golden accents',               icon: '✨', accent: '#c9a84c' },
  { id: 3,  name: 'Garden Floral',      desc: 'Mint green with botanical leaf wreath',             icon: '🌿', accent: '#3a7a4a' },
  { id: 4,  name: 'Warm Peach',         desc: 'Soft peach & blush, romantic warmth',               icon: '🌸', accent: '#c4756a' },
  { id: 5,  name: 'Royal Maroon',       desc: 'Deep maroon with luxurious gold text',              icon: '🏛️', accent: '#3d0a12' },
  { id: 6,  name: 'Divine Love',        desc: 'Centered layout with divine couple art',            icon: '🙏', accent: '#c9976a' },
  { id: 7,  name: 'Sacred Border',      desc: 'Bold dark frame with rich gold accents',            icon: '🪷', accent: '#8b6914' },
  { id: 8,  name: 'Midnight Navy',      desc: 'Deep navy with silver & white elegance',            icon: '🌙', accent: '#1b2a4a' },
  { id: 9,  name: 'Lavender Dream',     desc: 'Soft lavender & lilac, dreamy romance',             icon: '💜', accent: '#7b5ea7' },
  { id: 10, name: 'Rose Garden',        desc: 'Blush pink with dusty rose accents',                icon: '🌹', accent: '#c45b78' },
  { id: 11, name: 'Teal Royale',        desc: 'Rich teal with copper-gold highlights',             icon: '🦚', accent: '#1a6b6a' },
  { id: 12, name: 'Champagne Toast',    desc: 'Warm champagne with soft golden glow',              icon: '🥂', accent: '#b8976a' },
  { id: 13, name: 'Emerald Palace',     desc: 'Deep emerald green with gold filigree',             icon: '💚', accent: '#1a5a3a' },
  { id: 14, name: 'Ivory Lace',         desc: 'Delicate ivory with lace-inspired borders',         icon: '🕊️', accent: '#a08a6a' },
  { id: 15, name: 'Sunset Amber',       desc: 'Warm amber & burnt orange, golden hour',            icon: '🌅', accent: '#c47820' },
  { id: 16, name: 'Regal Purple',       desc: 'Royal purple with platinum accents',                icon: '👸', accent: '#5a2a7a' },
  { id: 17, name: 'Lotus Pink',         desc: 'Centered lotus motif with soft pinks',              icon: '🪷', accent: '#d4748a' },
  { id: 18, name: 'Ocean Blue',         desc: 'Centered serene blue with pearl whites',            icon: '🐚', accent: '#2a6a9a' },
  { id: 19, name: 'Marigold Festive',   desc: 'Vibrant marigold orange, festive Indian',           icon: '🏵️', accent: '#d4882a' },
  { id: 20, name: 'Black Tie',          desc: 'Sophisticated black with gold lettering',           icon: '🎩', accent: '#1a1a1a' },
];

export { TEMPLATES };

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
