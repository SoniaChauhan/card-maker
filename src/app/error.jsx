'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', background: '#f9fafb' }}>
      <div style={{ textAlign: 'center', padding: '2rem', maxWidth: 420 }}>
        <h2 style={{ fontSize: '1.5rem', color: '#1f2937', marginBottom: '0.75rem' }}>Something went wrong</h2>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>An unexpected error occurred. Please try again.</p>
        <button
          onClick={() => reset()}
          style={{ padding: '0.6rem 1.5rem', background: '#0A3A67', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '1rem' }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
