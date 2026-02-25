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
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
        width: el.offsetWidth,
        height: el.offsetHeight,
        windowWidth: el.offsetWidth,
        scrollX: 0,
        scrollY: 0,
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
      setDownloading(false);
    }
  }

  return { downloading, handleDownload, toast };
}
