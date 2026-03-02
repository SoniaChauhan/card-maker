'use client';
import { useState } from 'react';
import useAI from '../../hooks/useAI';

/* Mood → emoji mapping */
const MOOD_ICONS = {
  elegant: '✨', fun: '🎉', traditional: '🪔', modern: '💎', minimal: '◻️',
  royal: '👑', romantic: '💕', spiritual: '🙏', professional: '💼', playful: '🎈',
};

/**
 * AILayoutGallery — Modal that shows 5 AI-generated layout presets.
 *
 * Props:
 *   cardType       — card type string
 *   data           — current form data (used for context)
 *   currentLayout  — { template, bgColor, fontFamily, accentColor } current values
 *   onApply(layout) — called when user picks a layout
 *   onClose        — close the gallery
 */
export default function AILayoutGallery({ cardType, data, currentLayout, onApply, onClose }) {
  const { generating, aiError, generateLayouts } = useAI();
  const [layouts, setLayouts] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(null);

  async function handleGenerate() {
    setLayouts(null);
    setSelectedIdx(null);
    const result = await generateLayouts(cardType, data);
    if (result && Array.isArray(result)) {
      setLayouts(result);
    }
  }

  function handleApply(layout) {
    onApply({
      template: layout.template,
      bgColor: layout.bgColor || '',
      accentColor: layout.accentColor || '',
      fontFamily: layout.fontFamily || '',
    });
    onClose();
  }

  return (
    <div className="ai-gallery-overlay" onClick={onClose}>
      <div className="ai-gallery-modal" onClick={e => e.stopPropagation()}>
        <button className="ai-gallery-close" onClick={onClose}>✕</button>

        <div className="ai-gallery-header">
          <h2 className="ai-gallery-title">✨ AI Layout Gallery</h2>
          <p className="ai-gallery-sub">
            Let AI design 5 unique layouts for your {cardType} card.
            Click any layout to preview it instantly.
          </p>
        </div>

        <div className="ai-gallery-actions">
          <button className="ai-gallery-generate-btn" onClick={handleGenerate} disabled={generating}>
            {generating
              ? <><span className="ai-spinner" /> Generating 5 layouts…</>
              : layouts ? '🔄 Generate New Layouts' : '✨ Generate AI Layouts'}
          </button>
          {aiError && <p className="ai-gallery-error">⚠️ {aiError}</p>}
        </div>

        {/* Layout Cards Grid */}
        {layouts && layouts.length > 0 && (
          <div className="ai-gallery-grid">
            {layouts.map((layout, i) => {
              const moodIcon = MOOD_ICONS[layout.mood] || '✨';
              return (
                <button
                  key={i}
                  className={`ai-gallery-card ${selectedIdx === i ? 'selected' : ''}`}
                  onClick={() => setSelectedIdx(i)}
                >
                  {/* Color preview bar */}
                  <div className="ai-gallery-card-colors">
                    <div className="ai-gallery-swatch ai-gallery-swatch-bg"
                      style={{ background: layout.bgColor || '#f5f5f5' }}
                      title={`Background: ${layout.bgColor || 'default'}`} />
                    <div className="ai-gallery-swatch ai-gallery-swatch-accent"
                      style={{ background: layout.accentColor || '#a855f7' }}
                      title={`Accent: ${layout.accentColor}`} />
                    <span className="ai-gallery-template-badge">T{layout.template}</span>
                  </div>

                  {/* Layout info */}
                  <h3 className="ai-gallery-card-name">
                    {moodIcon} {layout.name}
                  </h3>
                  <p className="ai-gallery-card-desc">{layout.description}</p>

                  {/* Font preview */}
                  <p className="ai-gallery-card-font"
                    style={{ fontFamily: `'${layout.fontFamily}', serif` }}>
                    {layout.fontFamily || 'Default Font'}
                  </p>

                  {/* Mood tag */}
                  <span className="ai-gallery-mood-tag">{layout.mood}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Apply button */}
        {selectedIdx !== null && layouts?.[selectedIdx] && (
          <div className="ai-gallery-apply-bar">
            <p className="ai-gallery-apply-preview">
              Selected: <strong>{layouts[selectedIdx].name}</strong> — Template {layouts[selectedIdx].template},
              Font: {layouts[selectedIdx].fontFamily}
            </p>
            <button className="ai-gallery-apply-btn" onClick={() => handleApply(layouts[selectedIdx])}>
              🎨 Use This Layout
            </button>
          </div>
        )}

        {/* Empty state */}
        {!layouts && !generating && (
          <div className="ai-gallery-empty">
            <span className="ai-gallery-empty-icon">🎨</span>
            <p>Click "Generate AI Layouts" to see 5 unique designs crafted by AI for your card.</p>
          </div>
        )}
      </div>
    </div>
  );
}
