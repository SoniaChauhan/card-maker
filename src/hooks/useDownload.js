import { useState } from 'react';
import html2canvas from 'html2canvas';

/**
 * Custom hook that captures a DOM element as a PNG and triggers a browser download.
 *
 * @param {string} elementId  - id of the DOM element to capture
 * @param {string} filename   - desired download filename (should end in .png)
 * @returns {{ downloading, handleDownload, toast }}
 */
export default function useDownload(elementId, filename, { onSuccess } = {}) {
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState({ text: '', show: false });

  function showToast(msg) {
    setToast({ text: msg, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  }

  async function handleDownload() {
    const el = document.getElementById(elementId);
    if (!el) {
      showToast('⚠️ Card element not found.');
      return;
    }

    setDownloading(true);

    /* Temporarily expand the card to a fixed width for a high-quality download */
    const prevMaxW = el.style.maxWidth;
    const prevW    = el.style.width;
    const prevMinW = el.style.minWidth;
    const prevOverflow = el.style.overflow;
    el.style.maxWidth = 'none';
    el.style.width    = '600px';
    el.style.minWidth = '600px';
    el.style.overflow = 'visible';

    /* Also expand any direct child card so it fills the wrapper */
    const directChildren = Array.from(el.children);
    const childPrev = directChildren.map(c => ({
      el: c,
      maxWidth: c.style.maxWidth,
      width: c.style.width,
      overflow: c.style.overflow,
    }));
    directChildren.forEach(c => {
      c.style.maxWidth = 'none';
      c.style.width    = '100%';
      c.style.overflow = 'visible';
    });

    // Let the browser reflow before capturing
    await new Promise(r => setTimeout(r, 300));

    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
        width: el.scrollWidth,
        height: el.scrollHeight,
        windowWidth: el.scrollWidth + 100,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          const clonedEl = clonedDoc.getElementById(elementId);
          if (!clonedEl) return;

          // Ensure the clone has proper dimensions and no overflow clipping
          clonedEl.style.overflow = 'visible';
          clonedEl.style.position = 'relative';
          clonedEl.style.height = 'auto';

          // Also fix overflow on all children so nothing gets cropped
          clonedEl.querySelectorAll('*').forEach(child => {
            const cs = child.ownerDocument.defaultView.getComputedStyle(child);
            if (cs.overflow === 'hidden') child.style.overflow = 'visible';
          });

          // Remove pseudo-elements html2canvas can't render &
          // freeze all CSS animations so we capture a clean frame.
          const style = clonedDoc.createElement('style');
          style.textContent = `
            #${elementId},
            #${elementId} * {
              overflow: visible !important;
              max-height: none !important;
            }
            #${elementId} > * {
              max-width: none !important;
              min-width: 0 !important;
            }
            #${elementId}::before,
            #${elementId}::after {
              display: none !important;
            }
            *, *::before, *::after {
              animation: none !important;
              transition: none !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        },
      });

      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`✅ Card downloaded as "${filename}"!`);
      if (onSuccess) { try { onSuccess(); } catch (_) {} }
    } catch (err) {
      console.error('Download failed:', err);
      showToast('⚠️ Download failed. Please try again.');
    } finally {
      // Restore original dimensions
      el.style.maxWidth  = prevMaxW;
      el.style.width     = prevW;
      el.style.minWidth  = prevMinW;
      el.style.overflow  = prevOverflow;

      // Restore direct children
      childPrev.forEach(({ el: c, maxWidth, width, overflow }) => {
        c.style.maxWidth = maxWidth;
        c.style.width    = width;
        c.style.overflow = overflow;
      });

      setDownloading(false);
    }
  }

  return { downloading, handleDownload, toast };
}
