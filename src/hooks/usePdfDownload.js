import { useState, useRef } from 'react';

/**
 * Custom hook that captures a DOM element as a PDF and triggers download.
 *
 * @param {string} elementId  - id of the DOM element to capture
 * @param {string} filename   - desired download filename (should end in .pdf)
 * @returns {{ downloading, handleDownload, toast, watermarkRef }}
 */
export default function usePdfDownload(elementId, filename, { onSuccess, addWatermark = false } = {}) {
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState({ text: '', show: false });
  const watermarkRef = useRef(addWatermark);

  function showToast(msg) {
    setToast({ text: msg, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  }

  async function handleDownload() {
    const el = document.getElementById(elementId);
    if (!el) return;

    setDownloading(true);

    /* Temporarily expand the element to fill A4 width so there's no white gap */
    const prevMaxW = el.style.maxWidth;
    const prevW    = el.style.width;
    const prevPos  = el.style.position;
    el.style.maxWidth = 'none';
    el.style.width    = '794px';   // A4 width at 96 dpi (210mm)

    /* Add watermark overlay if needed */
    let watermarkDiv = null;
    if (watermarkRef.current) {
      el.style.position = 'relative';
      watermarkDiv = document.createElement('div');
      watermarkDiv.className = 'pdf-watermark-overlay';
      watermarkDiv.style.cssText = `
        position: absolute; inset: 0; z-index: 9999;
        display: flex; align-items: center; justify-content: center;
        pointer-events: none; overflow: hidden;
      `;
      watermarkDiv.innerHTML = `
        <div style="transform: rotate(-30deg); font-size: 60px; font-weight: 900;
          color: rgba(0,0,0,0.08); letter-spacing: 12px; white-space: nowrap;
          text-shadow: 0 2px 8px rgba(0,0,0,.05);">PREVIEW</div>
      `;
      el.appendChild(watermarkDiv);
    }

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: 0,
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false, width: 794 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };
      await html2pdf().set(opt).from(el).save();
      showToast('✅ PDF downloaded!');
      if (onSuccess) { try { onSuccess(); } catch (_) {} }
    } catch {
      showToast('❌ Download failed — try again.');
    } finally {
      /* Remove watermark overlay */
      if (watermarkDiv && watermarkDiv.parentNode) {
        watermarkDiv.parentNode.removeChild(watermarkDiv);
      }
      /* Restore original dimensions */
      el.style.maxWidth = prevMaxW;
      el.style.width    = prevW;
      el.style.position = prevPos;
      setDownloading(false);
    }
  }

  return { downloading, handleDownload, toast, watermarkRef };
}
