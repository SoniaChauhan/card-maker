'use client';
import { useEffect } from 'react';

/**
 * VisitorTracker — logs each page visit to MongoDB.
 * Placed once in the app layout. Fires on mount.
 */
export default function VisitorTracker() {
  useEffect(() => {
    // Small delay to avoid blocking initial render
    const timer = setTimeout(() => {
      try {
        fetch('/api/visitors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'log',
            page: window.location.pathname + window.location.search,
            referrer: document.referrer || '',
            screenWidth: window.screen?.width || 0,
            screenHeight: window.screen?.height || 0,
            language: navigator.language || '',
            userAgent: navigator.userAgent || '',
          }),
        }).catch(() => {}); // silently ignore errors
      } catch (_) {}
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return null; // invisible component
}
