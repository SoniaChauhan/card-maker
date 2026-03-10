'use client';
import { useState } from 'react';
import BiodataCardPreview from './BiodataCardPreview';

const TEMPLATES = [
  { id: 1,  name: 'Classic Gold',     desc: 'Traditional maroon & gold elegance',             icon: '👑', accent: '#d4af37' },
  { id: 2,  name: 'Royal Blue',       desc: 'Navy blue with silver accents',                  icon: '💎', accent: '#1a3a5c' },
  { id: 3,  name: 'Elegant Green',    desc: 'Forest green with golden touches',               icon: '🌿', accent: '#2d5a3d' },
  { id: 4,  name: 'Pink Blossom',     desc: 'Soft pink with rose gold warmth',                icon: '🌸', accent: '#d4748a' },
  { id: 5,  name: 'Modern Minimal',   desc: 'Clean white with subtle sophistication',         icon: '✨', accent: '#4a4a4a' },
  { id: 6,  name: 'Royal Purple',     desc: 'Regal purple with golden highlights',            icon: '👸', accent: '#5c3a6e' },
  { id: 7,  name: 'Burgundy Rich',    desc: 'Deep burgundy with warm gold accents',           icon: '🍷', accent: '#6e1a2a' },
  { id: 8,  name: 'Teal Heritage',    desc: 'Rich teal with traditional charm',               icon: '🦚', accent: '#1a5a5a' },
  { id: 9,  name: 'Saffron Sunrise',  desc: 'Warm saffron with festive orange tones',         icon: '🌅', accent: '#c06020' },
  { id: 10, name: 'Midnight Navy',    desc: 'Deep navy with platinum silver accents',         icon: '🌙', accent: '#1a2a4a' },
  { id: 11, name: 'Rose Quartz',      desc: 'Dusty rose with soft mauve elegance',            icon: '🌹', accent: '#b06080' },
  { id: 12, name: 'Olive Traditional', desc: 'Earthy olive green with bronze warmth',         icon: '🫒', accent: '#5a6e30' },
  { id: 13, name: 'Copper Charm',     desc: 'Warm copper on cream parchment',                 icon: '🏺', accent: '#a06840' },
  { id: 14, name: 'Sapphire Jewel',   desc: 'Bright sapphire blue with crystal accents',      icon: '💠', accent: '#2050a0' },
  { id: 15, name: 'Lavender Grace',   desc: 'Gentle lavender with violet highlights',         icon: '💜', accent: '#7a50a0' },
  { id: 16, name: 'Mahogany Classic', desc: 'Deep mahogany brown with ivory elegance',        icon: '📜', accent: '#5a2a18' },
  { id: 17, name: 'Peacock Teal',     desc: 'Vibrant peacock teal with gold filigree',        icon: '🦋', accent: '#0a6a6a' },
  { id: 18, name: 'Coral Festive',    desc: 'Bright coral with festive warm energy',          icon: '🎊', accent: '#d05040' },
  { id: 19, name: 'Slate Formal',     desc: 'Professional slate gray with clean lines',       icon: '📋', accent: '#4a5568' },
  { id: 20, name: 'Marigold Auspicious', desc: 'Auspicious marigold yellow with red accents', icon: '🌻', accent: '#c89020' },
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
