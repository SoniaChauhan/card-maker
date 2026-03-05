'use client';
import { useState, useMemo } from 'react';

/**
 * ShareButtons — shown after a successful download.
 * Provides WhatsApp share and Email share options.
 * If the browser supports Web Share API + file sharing, uses native share.
 * Also includes an in-app "View Card" image viewer with a back button.
 */
export default function ShareButtons({ blob, filename, cardLabel, onClose }) {
  const [viewing, setViewing] = useState(false);

  /* Create a blob URL only when user clicks "View Card" */
  const blobUrl = useMemo(() => (blob ? URL.createObjectURL(blob) : null), [blob]);

  if (!blob) return null;

  const siteUrl = 'https://creativethinkerdesignhub.com';
  const shareText = `Check out my ${cardLabel || 'card'} created with Card Maker!\n${siteUrl}`;

  async function handleWhatsApp() {
    // Try native share with file first (mobile-friendly)
    if (navigator.canShare) {
      try {
        const file = new File([blob], filename || 'card.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            text: shareText,
            files: [file],
          });
          return;
        }
      } catch (_) { /* fall through to URL share */ }
    }
    // Fallback — open WhatsApp with text only
    const encoded = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  }

  function handleEmail() {
    const subject = encodeURIComponent(`My ${cardLabel || 'Card'} — Created with Card Maker`);
    const body = encodeURIComponent(
      `Hi,\n\nI created a beautiful ${cardLabel || 'card'} using Card Maker.\n\nVisit ${siteUrl} to create yours!\n\nRegards`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
  }

  async function handleNativeShare() {
    try {
      const file = new File([blob], filename || 'card.png', { type: 'image/png' });
      await navigator.share({
        title: `My ${cardLabel || 'Card'}`,
        text: shareText,
        files: [file],
      });
    } catch (_) { /* user cancelled */ }
  }

  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  /* ── In-app image viewer ── */
  if (viewing) {
    return (
      <div className="share-viewer-overlay">
        <div className="share-viewer-topbar">
          <button className="share-viewer-back" onClick={() => setViewing(false)}>
            ← Back
          </button>
          <span className="share-viewer-title">{cardLabel || 'Card'} Preview</span>
        </div>
        <div className="share-viewer-body">
          <img src={blobUrl} alt={cardLabel || 'Downloaded card'} className="share-viewer-img" />
        </div>
      </div>
    );
  }

  return (
    <div className="share-buttons-overlay" onClick={onClose}>
      <div className="share-buttons-card" onClick={e => e.stopPropagation()}>
        <button className="share-close-btn" onClick={onClose}>✕</button>
        <h3 className="share-title">🎉 Download Complete!</h3>
        <p className="share-subtitle">Share your {cardLabel || 'card'} with friends & family</p>

        {/* View Card button */}
        <button className="share-view-btn" onClick={() => setViewing(true)}>
          <span className="share-btn-icon">👁️</span>
          <span>View Card</span>
        </button>

        <div className="share-btn-group">
          <button className="share-btn share-btn-whatsapp" onClick={handleWhatsApp}>
            <svg className="share-btn-svg-icon" viewBox="0 0 32 32" fill="#fff" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.004 2.002c-7.732 0-14.002 6.27-14.002 14.002 0 2.467.655 4.87 1.898 6.988L2 30l7.257-1.852A13.943 13.943 0 0 0 16.004 30c7.732 0 14.002-6.27 14.002-14.002S23.736 2.002 16.004 2.002Zm0 25.602a11.56 11.56 0 0 1-6.102-1.74l-.438-.26-4.31 1.1 1.12-4.198-.287-.456A11.555 11.555 0 0 1 4.4 16.004c0-6.4 5.208-11.604 11.604-11.604 6.4 0 11.604 5.204 11.604 11.604 0 6.396-5.204 11.6-11.604 11.6Zm6.352-8.683c-.348-.174-2.06-1.016-2.38-1.132-.32-.116-.553-.174-.786.174-.232.348-.902 1.132-1.106 1.364-.204.232-.407.26-.755.088-.348-.174-1.47-.542-2.8-1.728-1.034-.922-1.733-2.062-1.936-2.41-.204-.348-.022-.536.153-.71.157-.156.348-.406.522-.61.174-.204.232-.348.348-.58.116-.232.058-.436-.03-.61-.087-.174-.785-1.894-1.075-2.592-.283-.68-.57-.588-.786-.598-.204-.01-.436-.012-.67-.012a1.285 1.285 0 0 0-.93.436c-.32.348-1.222 1.194-1.222 2.912s1.252 3.376 1.426 3.61c.174.232 2.462 3.76 5.966 5.272.834.36 1.484.576 1.992.737.837.266 1.598.228 2.2.138.67-.1 2.06-.842 2.35-1.656.29-.814.29-1.51.204-1.656-.088-.146-.32-.232-.67-.407Z"/>
            </svg>
            <span>Share on WhatsApp</span>
          </button>

          <button className="share-btn share-btn-email" onClick={handleEmail}>
            <span className="share-btn-icon">✉️</span>
            <span>Share via Email</span>
          </button>

          {canNativeShare && (
            <button className="share-btn share-btn-more" onClick={handleNativeShare}>
              <span className="share-btn-icon">📤</span>
              <span>More Options</span>
            </button>
          )}
        </div>

        <button className="share-done-btn" onClick={onClose}>Done</button>
      </div>
    </div>
  );
}
