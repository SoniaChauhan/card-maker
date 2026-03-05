'use client';

/**
 * ShareButtons — shown after a successful download.
 * Provides WhatsApp share and Email share options.
 * If the browser supports Web Share API + file sharing, uses native share.
 */
export default function ShareButtons({ blob, filename, cardLabel, onClose }) {
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

  return (
    <div className="share-buttons-overlay" onClick={onClose}>
      <div className="share-buttons-card" onClick={e => e.stopPropagation()}>
        <button className="share-close-btn" onClick={onClose}>✕</button>
        <h3 className="share-title">🎉 Download Complete!</h3>
        <p className="share-subtitle">Share your {cardLabel || 'card'} with friends & family</p>

        <div className="share-btn-group">
          <button className="share-btn share-btn-whatsapp" onClick={handleWhatsApp}>
            <span className="share-btn-icon">💬</span>
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
