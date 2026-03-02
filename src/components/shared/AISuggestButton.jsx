'use client';
import { useState} from 'react';
import useAI from '../../hooks/useAI';

/**
 * AISuggestButton — "✨ AI Suggest Style" button for card preview screens.
 * Calls AI suggest mode and shows clickable style suggestions.
 *
 * Props:
 *   cardType        — 'birthday'|'wedding'|'anniversary'|etc.
 *   currentTemplate — current template number
 *   currentBgColor  — current bgColor string
 *   onApply(obj)    — called with { template, bgColor } when user picks a suggestion
 */
export default function AISuggestButton({ cardType, currentTemplate, currentBgColor, onApply }) {
  const { generating, aiError, suggestLayout } = useAI();
  const [suggestions, setSuggestions] = useState(null);

  async function handleSuggest() {
    setSuggestions(null);
    const result = await suggestLayout(cardType, currentTemplate, currentBgColor);
    if (result && Array.isArray(result)) {
      setSuggestions(result);
    }
  }

  return (
    <div className="ai-suggest-section">
      <button className="btn-ai-suggest" onClick={handleSuggest} disabled={generating}>
        {generating ? <><span className="ai-spinner" /> Thinking…</> : '✨ AI Suggest Style'}
      </button>

      {aiError && <p className="ai-suggest-error">⚠️ {aiError}</p>}

      {suggestions && suggestions.length > 0 && (
        <div className="ai-suggest-chips">
          {suggestions.map((s, i) => (
            <button
              key={i}
              className="ai-suggest-chip"
              style={{ borderColor: s.bgColor || '#a855f7' }}
              onClick={() => { onApply({ template: s.template, bgColor: s.bgColor }); setSuggestions(null); }}
            >
              <span className="ai-suggest-swatch" style={{ background: s.bgColor || '#ddd' }} />
              <span className="ai-suggest-label">{s.label || `Style ${i + 1}`}</span>
              <span className="ai-suggest-meta">Template {s.template}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
