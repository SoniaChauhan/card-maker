'use client';
import { useState } from 'react';
import AnniversaryCardPreview from './AnniversaryCardPreview';

const TEMPLATES = [
  { id: 1,  name: 'Royal Gold Floral',   desc: 'Elegant gold floral corners & vine borders on navy',    icon: '🌿', accent: '#c9a84c' },
  { id: 2,  name: 'Rose Gold Romance',   desc: 'Warm rose-gold hearts on deep maroon',                  icon: '💕', accent: '#d4a373' },
  { id: 3,  name: 'Emerald Laurels',     desc: 'Classic greenery laurels on ivory parchment',            icon: '🌿', accent: '#5a8a4a' },
  { id: 4,  name: 'Mandala Rings',       desc: 'Royal purple backdrop with golden mandala art',          icon: '🔮', accent: '#d4af37' },
  { id: 5,  name: 'Vintage Frame',       desc: 'Double-line antique frame on warm parchment',            icon: '🖼️', accent: '#b8860b' },
  { id: 6,  name: 'Minimal Swirl',       desc: 'Sleek gold swirls on charcoal slate',                   icon: '✨', accent: '#c9a84c' },
  { id: 7,  name: 'Midnight Sapphire',   desc: 'Deep sapphire blue with silver accents',                icon: '💎', accent: '#7b9ec7' },
  { id: 8,  name: 'Blush Petal',         desc: 'Soft blush pink with dusty rose highlights',            icon: '🌸', accent: '#d4748a' },
  { id: 9,  name: 'Champagne Glow',      desc: 'Warm champagne tones on cream backdrop',                icon: '🥂', accent: '#c4a35a' },
  { id: 10, name: 'Teal Elegance',       desc: 'Rich teal with copper metallic touches',                icon: '🦚', accent: '#2a8a7a' },
  { id: 11, name: 'Burgundy Velvet',     desc: 'Deep burgundy with gold filigree accents',              icon: '🍷', accent: '#8b2252' },
  { id: 12, name: 'Ivory Classic',       desc: 'Timeless ivory with dark brown script',                 icon: '📜', accent: '#8b7355' },
  { id: 13, name: 'Sunset Coral',        desc: 'Warm sunset coral & peach gradient',                    icon: '🌅', accent: '#e07050' },
  { id: 14, name: 'Silver Moonlight',    desc: 'Cool silver on midnight charcoal',                      icon: '🌙', accent: '#a8b8c8' },
  { id: 15, name: 'Lavender Dreams',     desc: 'Soft lavender with violet accents',                     icon: '💜', accent: '#9b7db8' },
  { id: 16, name: 'Forest & Amber',      desc: 'Deep forest green with amber gold',                     icon: '🌲', accent: '#c8a840' },
  { id: 17, name: 'Ocean Breeze',        desc: 'Calm ocean blue with seafoam highlights',               icon: '🌊', accent: '#4a90b8' },
  { id: 18, name: 'Marigold Festive',    desc: 'Vibrant marigold with festive warm tones',              icon: '🌻', accent: '#e0a030' },
  { id: 19, name: 'Copper Rose',         desc: 'Warm copper on deep mahogany',                          icon: '🌹', accent: '#c87850' },
  { id: 20, name: 'Pearl White',         desc: 'Pristine pearl white with platinum accents',            icon: '🤍', accent: '#b0b8c0' },
];

export { TEMPLATES };

export default function AnniversaryTemplateChooser({ data, lang, selected, onSelect, onClose }) {
  const [previewId, setPreviewId] = useState(null);

  return (
    <div className="tpl-chooser-overlay" onClick={onClose}>
      <div className="tpl-chooser-modal" onClick={e => e.stopPropagation()}>
        <div className="tpl-chooser-header">
          <h3>🎨 Choose Anniversary Template</h3>
          <p>Select a style that matches the celebration</p>
          <button className="tpl-chooser-close" onClick={onClose}>✕</button>
        </div>

        <div className="tpl-chooser-grid">
          {TEMPLATES.map(tpl => (
            <div key={tpl.id}
              className={`tpl-chooser-card ${selected === tpl.id ? 'tpl-chooser-card--selected' : ''}`}
              onClick={() => onSelect(tpl.id)}>

              <div className="tpl-thumb" style={{ borderColor: tpl.accent }}>
                <div className="tpl-thumb-inner">
                  <AnniversaryCardPreview data={data} lang={lang} template={tpl.id} />
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

        {previewId && (
          <div className="tpl-fullpreview-overlay" onClick={() => setPreviewId(null)}>
            <div className="tpl-fullpreview-wrap" onClick={e => e.stopPropagation()}>
              <button className="tpl-fullpreview-close" onClick={() => setPreviewId(null)}>✕</button>
              <div className="tpl-fullpreview-card">
                <AnniversaryCardPreview data={data} lang={lang} template={previewId} />
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
