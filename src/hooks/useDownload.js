import { useState } from 'react';
import html2canvas from 'html2canvas';

/**
 * Custom hook that captures a DOM element as a PNG and triggers a browser download.
 *
 * @param {string} elementId  - id of the DOM element to capture
 * @param {string} filename   - desired download filename (should end in .png)
 * @returns {{ downloading, handleDownload, toast }}
 */
export default function useDownload(elementId, filename) {
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

    // Temporarily remove watermark for clean download
    const wrapper = el.closest('.card-preview-locked');
    if (wrapper) wrapper.classList.remove('card-preview-locked');

    /* Temporarily expand the card to a larger width for a high-quality download */
    const prevMaxW = el.style.maxWidth;
    const prevW    = el.style.width;
    const prevMinW = el.style.minWidth;
    el.style.maxWidth = 'none';
    el.style.width    = '900px';
    el.style.minWidth = '900px';

    // Let the browser reflow before capturing
    await new Promise(r => setTimeout(r, 100));

    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        width: el.offsetWidth,
        height: el.offsetHeight,
        windowWidth: el.offsetWidth,
        scrollX: 0,
        scrollY: -window.scrollY,
      });

      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`✅ Card downloaded as "${filename}"!`);
    } catch {
      showToast('⚠️ Download failed. Please try again.');
    } finally {
      // Restore original dimensions
      el.style.maxWidth = prevMaxW;
      el.style.width    = prevW;
      el.style.minWidth = prevMinW;
      // Restore watermark
      if (wrapper) wrapper.classList.add('card-preview-locked');
      setDownloading(false);
    }
  }

  return { downloading, handleDownload, toast };
}
