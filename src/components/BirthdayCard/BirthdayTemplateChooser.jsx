'use client';
import { useState } from 'react';
import BirthdayCardPreview from './BirthdayCardPreview';

const TEMPLATES = [
  { id: 1,  name: 'Space Adventure',   desc: 'Astronaut, planets & rockets for little explorers', icon: '🚀', accent: '#2c3e6b' },
  { id: 2,  name: 'Pastel Balloons',   desc: 'Soft pastel balloons & golden bunting flags',       icon: '🎈', accent: '#c4937f' },
  { id: 3,  name: 'Cute Stars',        desc: 'Birthday cake, balloon & colorful scattered stars', icon: '⭐', accent: '#c67a5c' },
  { id: 4,  name: 'Party Confetti',    desc: 'Bright bunting, balloons & confetti celebration',   icon: '🎉', accent: '#d98a4b' },
  { id: 5,  name: 'Sunshine Floral',   desc: 'Watercolor flowers & a smiling sun',                icon: '🌸', accent: '#b87f7f' },
  { id: 6,  name: 'Animal Friends',    desc: 'Bear, bunny & tiger with party hats',               icon: '🐻', accent: '#9e7b5a' },
  { id: 7,  name: 'Candy Pop',         desc: 'Bright candy colours with sprinkles vibe',          icon: '🍭', accent: '#e85090' },
  { id: 8,  name: 'Ocean Splash',      desc: 'Under-the-sea blues & turquoise waves',             icon: '🐬', accent: '#1a8a9a' },
  { id: 9,  name: 'Jungle Safari',     desc: 'Tropical green with wild animal energy',            icon: '🦁', accent: '#4a7a2a' },
  { id: 10, name: 'Princess Castle',   desc: 'Soft pink & purple with magical sparkles',          icon: '👸', accent: '#9a5abc' },
  { id: 11, name: 'Superhero Pow',     desc: 'Bold comic-style reds & electric blues',            icon: '🦸', accent: '#c42020' },
  { id: 12, name: 'Unicorn Magic',     desc: 'Rainbow pastels with dreamy unicorn vibes',         icon: '🦄', accent: '#c488d0' },
  { id: 13, name: 'Dino Roar',         desc: 'Earthy greens & warm browns for dino lovers',       icon: '🦕', accent: '#5a8848' },
  { id: 14, name: 'Ice Cream Dream',   desc: 'Vanilla, strawberry & mint sweet palette',          icon: '🍦', accent: '#d4748a' },
  { id: 15, name: 'Pirate Treasure',   desc: 'Deep navy with gold treasure accents',              icon: '🏴‍☠️', accent: '#2a3a5a' },
  { id: 16, name: 'Garden Butterfly',  desc: 'Lavender & sage with fluttering butterflies',       icon: '🦋', accent: '#7a6aaa' },
  { id: 17, name: 'Race Car',          desc: 'Chequered flag with high-speed reds',               icon: '🏎️', accent: '#b82020' },
  { id: 18, name: 'Rainbow Bright',    desc: 'Vibrant rainbow gradient celebration',              icon: '🌈', accent: '#e87040' },
  { id: 19, name: 'Teddy Picnic',      desc: 'Warm beige & soft brown cozy vibes',                icon: '🧸', accent: '#a07850' },
  { id: 20, name: 'Neon Glow',         desc: 'Dark background with electric neon accents',        icon: '✨', accent: '#0a0a1a' },
];

export { TEMPLATES };

export default function BirthdayTemplateChooser({ data, lang, selected, onSelect, onClose }) {
  const [previewId, setPreviewId] = useState(null);

  return (
    <div className="tpl-chooser-overlay" onClick={onClose}>
      <div className="tpl-chooser-modal" onClick={e => e.stopPropagation()}>
        <div className="tpl-chooser-header">
          <h3>🎨 Choose Birthday Template</h3>
          <p>Select a style that matches the birthday vibe</p>
          <button className="tpl-chooser-close" onClick={onClose}>✕</button>
        </div>

        <div className="tpl-chooser-grid">
          {TEMPLATES.map(tpl => (
            <div key={tpl.id}
              className={`tpl-chooser-card ${selected === tpl.id ? 'tpl-chooser-card--selected' : ''}`}
              onClick={() => onSelect(tpl.id)}>

              <div className="tpl-thumb" style={{ borderColor: tpl.accent }}>
                <div className="tpl-thumb-inner">
                  <BirthdayCardPreview data={data} lang={lang} template={tpl.id} />
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
                <BirthdayCardPreview data={data} lang={lang} template={previewId} />
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
