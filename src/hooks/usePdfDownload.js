import { useState } from 'react';

/**
 * Custom hook that captures a DOM element as a PDF and triggers download.
 *
 * @param {string} elementId  - id of the DOM element to capture
 * @param {string} filename   - desired download filename (should end in .pdf)
 * @returns {{ downloading, handleDownload, toast }}
 */
export default function usePdfDownload(elementId, filename) {
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState({ text: '', show: false });

  function showToast(msg) {
    setToast({ text: msg, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  }

  async function handleDownload() {
    const el = document.getElementById(elementId);
    if (!el) return;

    setDownloading(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: 0,
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };
      await html2pdf().set(opt).from(el).save();
      showToast('✅ PDF downloaded!');
    } catch {
      showToast('❌ Download failed — try again.');
    } finally {
      setDownloading(false);
    }
  }

  return { downloading, handleDownload, toast };
}
