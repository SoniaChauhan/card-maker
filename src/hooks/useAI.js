'use client';
import { useState, useCallback } from 'react';

/**
 * useAI — hook that calls /api/ai for all AI modes.
 */
export default function useAI() {
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

  /* helper: POST to /api/ai */
  const callAI = useCallback(async (body) => {
    setGenerating(true);
    setAiError('');
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) {
        setAiError(json.error || 'AI generation failed.');
        return null;
      }
      return json;
    } catch (err) {
      setAiError(err.message || 'Network error.');
      return null;
    } finally {
      setGenerating(false);
    }
  }, []);

  /**
   * MODE text — Fill with AI (returns { fields: { ... } })
   */
  const generateWithAI = useCallback(async (cardType, data) => {
    const json = await callAI({ mode: 'text', cardType, data });
    return json?.fields ?? null;
  }, [callAI]);

  /**
   * MODE magic — AI Magic Input (returns { cardType, formData })
   */
  const magicGenerate = useCallback(async (description) => {
    return callAI({ mode: 'magic', description });
  }, [callAI]);

  /**
   * MODE suggest — AI Layout Suggestions (returns { suggestions: [...] })
   */
  const suggestLayout = useCallback(async (cardType, currentTemplate, currentBgColor) => {
    const json = await callAI({ mode: 'suggest', cardType, currentTemplate, currentBgColor });
    return json?.suggestions ?? null;
  }, [callAI]);

  /**
   * MODE layouts — AI Layout Gallery (returns 5 rich layout presets)
   */
  const generateLayouts = useCallback(async (cardType, data) => {
    const json = await callAI({ mode: 'layouts', cardType, data });
    return json?.layouts ?? null;
  }, [callAI]);

  return { generating, aiError, generateWithAI, magicGenerate, suggestLayout, generateLayouts };
}
