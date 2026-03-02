import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Card Maker – Create Beautiful Cards Online';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontFamily: 'Arial, sans-serif',
          color: '#fff',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: '80px', marginBottom: '8px', display: 'flex' }}>🎨</div>
        <div style={{ fontSize: '64px', fontWeight: 'bold', marginBottom: '16px', display: 'flex' }}>
          Card Maker
        </div>
        <div style={{ fontSize: '28px', opacity: 0.9, marginBottom: '12px', textAlign: 'center', display: 'flex' }}>
          Create Beautiful Cards Online — Free & Premium
        </div>
        <div style={{ fontSize: '22px', opacity: 0.7, marginBottom: '32px', textAlign: 'center', display: 'flex' }}>
          Birthday • Wedding • Anniversary • Holi Wishes • Festival Cards
        </div>
        <div
          style={{
            fontSize: '16px',
            opacity: 0.5,
            borderTop: '1px solid rgba(255,255,255,0.2)',
            paddingTop: '16px',
            display: 'flex',
          }}
        >
          A product of Creative Thinker Design Hub
        </div>
      </div>
    ),
    { ...size }
  );
}
