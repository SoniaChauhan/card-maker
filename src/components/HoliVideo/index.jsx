'use client';
import { useState } from 'react';
import './HoliVideo.css';

const HOLI_VIDEOS = [
  { id: 1, title: 'Happy Holi — Colorful Wishes 🎨', file: '/videos/video1.mp4', type: 'video/mp4' },
  { id: 3, title: 'Holi Mubarak — Gulaal Splash 🎉', file: '/videos/video3.mp4', type: 'video/mp4' },
];

export default function HoliVideo({ onBack }) {
  const [errors, setErrors] = useState({});

  function handleDownload(video) {
    const link = document.createElement('a');
    link.href = video.file;
    link.download = video.file.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleVideoError(id) {
    setErrors(prev => ({ ...prev, [id]: true }));
  }

  return (
    <div className="holi-video-screen">
      <button className="holi-video-back" onClick={onBack}>← Back</button>

      <div className="holi-video-header">
        <h2>🎬 Holi Video Wishes</h2>
        <p>Download colorful Holi video greetings — share on WhatsApp, Instagram &amp; more!</p>
      </div>

      <div className="holi-video-grid">
        {HOLI_VIDEOS.map(v => (
          <div key={v.id} className="holi-video-card">
            {errors[v.id] ? (
              <div className="holi-video-fallback">
                <span>🎬</span>
                <p>Preview not supported in this browser</p>
                <small>Download to watch this video</small>
              </div>
            ) : (
              <video
                className="holi-video-player"
                controls
                preload="metadata"
                playsInline
                onError={() => handleVideoError(v.id)}
              >
                <source src={v.file} type={v.type} />
                <source src={v.file} type="video/mp4" />
              </video>
            )}
            <div className="holi-video-info">
              <p className="holi-video-title">{v.title}</p>
              <button className="holi-video-dl-btn" onClick={() => handleDownload(v)}>
                ⬇️ Download Video
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
