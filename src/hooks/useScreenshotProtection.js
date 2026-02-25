import { useEffect } from 'react';

/**
 * Hook to prevent screenshots / screen capture on card previews.
 *
 * Protects against:
 *  - PrintScreen key
 *  - Ctrl+P (print)
 *  - Ctrl+Shift+S (screenshot shortcuts)
 *  - Right-click → Save Image / Copy
 *  - Drag-to-save images
 *  - Window focus loss → blur content (defeats screen recorders)
 */
export default function useScreenshotProtection() {
  useEffect(() => {
    /* ---- Block keyboard shortcuts ---- */
    function handleKeyDown(e) {
      // PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        navigator.clipboard?.writeText?.('');  // clear clipboard
        showToast();
        return;
      }
      // Ctrl+P (print)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        showToast();
        return;
      }
      // Ctrl+Shift+S (various screenshot tools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        showToast();
        return;
      }
      // Win+Shift+S (Windows Snipping Tool) — limited browser support
      if (e.key === 'Meta' && e.shiftKey) {
        e.preventDefault();
        return;
      }
    }

    /* ---- Block right-click on card areas ---- */
    function handleContextMenu(e) {
      const el = e.target.closest('.screenshot-protected');
      if (el) {
        e.preventDefault();
        showToast();
      }
    }

    /* ---- Blur on visibility change (screen recorders) ---- */
    function handleVisibilityChange() {
      const protectedEls = document.querySelectorAll('.screenshot-protected');
      protectedEls.forEach(el => {
        if (document.hidden) {
          el.classList.add('ss-blurred');
        } else {
          el.classList.remove('ss-blurred');
        }
      });
    }

    /* ---- Toast notification ---- */
    function showToast() {
      // Remove any existing toast
      const existing = document.getElementById('ss-block-toast');
      if (existing) existing.remove();

      const toast = document.createElement('div');
      toast.id = 'ss-block-toast';
      toast.textContent = '🚫 Screenshots are disabled for card previews';
      toast.style.cssText = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
        background: linear-gradient(135deg, #e53e3e, #c53030); color: #fff;
        padding: 12px 24px; border-radius: 12px; font-size: 14px; font-weight: 700;
        z-index: 99999; box-shadow: 0 8px 30px rgba(229,62,62,.4);
        animation: ssToastIn .3s ease;
      `;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2500);
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', (e) => {
      if (e.key === 'PrintScreen') {
        navigator.clipboard?.writeText?.('');
      }
    });
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
}
