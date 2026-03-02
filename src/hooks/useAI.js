'use client';
import { useState, useCallback } from 'react';

/**
 * useAI — hook that calls /api/ai to generate card content with Google Gemini.
 *
 * @returns {{ generating: boolean, aiError: string, generateWithAI: Function }}
 */
export default function useAI() {
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState('');

  /**
   * Call the AI API and return the generated fields.
   * @param {string} cardType — 'birthday'|'wedding'|'anniversary'|'jagrata'|'biodata'|'resume'
   * @param {object} data — current form data
   * @returns {Promise<object|null>} — { field: value, ... } or null on failure
   */
  const generateWithAI = useCallback(async (cardType, data) => {
    setGenerating(true);
    setAiError('');
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardType, data }),
      });
      const json = await res.json();
      if (!res.ok) {
        setAiError(json.error || 'AI generation failed.');
        return null;
      }
      return json.fields; // { message: "...", etc. }
    } catch (err) {
      setAiError(err.message || 'Network error.');
      return null;
    } finally {
      setGenerating(false);
    }
  }, []);

  return { generating, aiError, generateWithAI };
}
