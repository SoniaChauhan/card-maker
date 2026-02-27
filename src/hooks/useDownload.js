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

  /**
   * Trigger a file download from a canvas using the most reliable method
   * available in the current browser.
   */
  function downloadCanvas(canvas, name) {
    return new Promise((resolve, reject) => {
      try {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas toBlob returned null'));
            return;
          }

          // IE / old Edge fallback
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, name);
            resolve();
            return;
          }

          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = name;

          // Some corporate browsers block blob download links.
          // Try anchor click first; if a download doesn't start within
          // 2 seconds, open in a new tab so user can save manually.
          document.body.appendChild(a);

          setTimeout(() => {
            a.click();

            setTimeout(() => {
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              resolve();
            }, 2000);
          }, 100);
        }, 'image/png');
      } catch (err) {
        // Ultimate fallback: open the image as a data URL in a new tab
        try {
          const dataUrl = canvas.toDataURL('image/png');
          const w = window.open('');
          if (w) {
            w.document.write(`<img src="${dataUrl}" style="max-width:100%" /><p>Right-click the image and choose "Save image as..." to download.</p>`);
            w.document.title = name;
          }
          resolve();
        } catch (e2) {
          reject(err);
        }
      }
    });
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

    /* ── Pre-convert inline SVGs to <img> in the live DOM ── */
    const svgRestore = [];
    el.querySelectorAll('svg').forEach(svg => {
      try {
        // Capture current rendered dimensions from the live DOM
        const rect = svg.getBoundingClientRect();
        const w = Math.round(rect.width)  || svg.clientWidth  || 170;
        const h = Math.round(rect.height) || svg.clientHeight || 90;

        // Clone the SVG so we don't mutate the live one
        const svgClone = svg.cloneNode(true);

        // Ensure SVG has xmlns
        svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

        // Set explicit width/height on the <svg> element — critical for <img> rendering
        svgClone.setAttribute('width', w);
        svgClone.setAttribute('height', h);

        // Ensure viewBox is set so the content scales correctly
        if (!svgClone.getAttribute('viewBox')) {
          svgClone.setAttribute('viewBox', `0 0 ${w} ${h}`);
        }

        const svgData = new XMLSerializer().serializeToString(svgClone);
        const encoded = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));

        const img = document.createElement('img');
        img.src = encoded;
        img.style.width   = w + 'px';
        img.style.height  = h + 'px';
        img.style.display = 'block';

        const computed = window.getComputedStyle(svg);
        img.style.margin  = computed.margin || '0 auto';
        img.className = svg.className?.baseVal || '';

        svg.parentNode.insertBefore(img, svg);
        svg.style.display = 'none';
        svgRestore.push({ svg, img });
      } catch (_) { /* leave SVG in place */ }
    });

    // Give the browser time to decode the data-URI images
    await new Promise(r => setTimeout(r, 300));

    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
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

          clonedEl.style.overflow = 'visible';
          clonedEl.style.position = 'relative';
          clonedEl.style.height = 'auto';

          clonedEl.querySelectorAll('*').forEach(child => {
            const cs = child.ownerDocument.defaultView.getComputedStyle(child);
            if (cs.overflow === 'hidden') child.style.overflow = 'visible';
          });

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

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        showToast('⚠️ Could not capture card. Please try again.');
        return;
      }

      await downloadCanvas(canvas, filename);

      showToast(`✅ Card downloaded as "${filename}"!`);
      if (onSuccess) { try { onSuccess(); } catch (_) {} }
    } catch (err) {
      console.error('Download failed:', err);
      showToast('⚠️ Download failed. Please try again.');
    } finally {
      /* ── Restore SVGs: remove inserted <img> tags & un-hide original SVGs ── */
      svgRestore.forEach(({ svg, img }) => {
        try {
          svg.style.display = '';
          if (img.parentNode) img.parentNode.removeChild(img);
        } catch (_) {}
      });

      // Restore original dimensions
      el.style.maxWidth  = prevMaxW;
      el.style.width     = prevW;
      el.style.minWidth  = prevMinW;
      el.style.overflow  = prevOverflow;

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
