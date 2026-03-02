'use client';
import { useState } from 'react';
import FestivalCardPreview from './FestivalCardPreview';

const HOLI_TEMPLATES = [
  { id: 1, name: 'Classic Radha Krishna', desc: 'Traditional Radha-Krishna with colorful splashes', icon: '🌈', accent: '#ff6f91' },
  { id: 2, name: 'Gulaal Burst',          desc: 'Vibrant colors with gulaal powder cloud effect', icon: '💜', accent: '#a29bfe' },
  { id: 3, name: 'Rang Barse',            desc: 'Bright pichkari & water colors celebration',    icon: '🎨', accent: '#ffc75f' },
  { id: 4, name: 'Divine Holi',           desc: 'Spiritual Radha-Krishna with peacock feathers',  icon: '🦚', accent: '#55efc4' },
  { id: 5, name: 'Festive Joy',           desc: 'Warm festival vibes with traditional motifs',    icon: '🪷', accent: '#fd79a8' },
  { id: 6, name: 'Modern Splash',         desc: 'Bold paint splashes with contemporary design',   icon: '✨', accent: '#74b9ff' },
];

export default function HoliTemplateChooser({ data, lang, selected, onSelect, onClose }) {
  const [previewId, setPreviewId] = useState(null);

  return (
    <div className="tpl-chooser-overlay" onClick={onClose}>
      <div className="tpl-chooser-modal" onClick={e => e.stopPropagation()}>
        <div className="tpl-chooser-header">
          <h3>🌈 Choose Holi Template</h3>
          <p>Select your favorite Holi card design</p>
          <button className="tpl-chooser-close" onClick={onClose}>✕</button>
        </div>

        <div className="tpl-chooser-grid">
          {HOLI_TEMPLATES.map(tpl => (
            <div key={tpl.id}
              className={`tpl-chooser-card ${selected === tpl.id ? 'tpl-chooser-card--selected' : ''}`}
              onClick={() => onSelect(tpl.id)}>

              <div className="tpl-thumb" style={{ borderColor: tpl.accent }}>
                <div className="tpl-thumb-inner">
                  <FestivalCardPreview
                    data={{ ...data, festival: 'holi', selectedTemplate: tpl.id }}
                    lang={lang}
                    bgColor={data.bgColor}
                  />
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
                <FestivalCardPreview
                  data={{ ...data, festival: 'holi', selectedTemplate: previewId }}
                  lang={lang}
                  bgColor={data.bgColor}
                />
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
