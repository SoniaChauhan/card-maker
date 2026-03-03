'use client';
import './HoliVideo.css';

/*
  ─── Holi Video Gallery ───
  Add your videos to public/videos/ and list them here.
  Supported formats: .mp4, .webm
  Name each file descriptively, e.g. holi-wish-colorful.mp4
*/
const HOLI_VIDEOS = [
  // { id: 1, title: 'Happy Holi — Colorful Splash', file: '/videos/holi-wish-1.mp4' },
  // { id: 2, title: 'Holi Greetings — Gulaal Burst', file: '/videos/holi-wish-2.mp4' },
  // { id: 3, title: 'Rang Barse — Festive Wish',     file: '/videos/holi-wish-3.mp4' },
  // Add more videos above ↑
];

export default function HoliVideo({ onBack }) {

  function handleDownload(video) {
    const link = document.createElement('a');
    link.href = video.file;
    link.download = video.file.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="holi-video-screen">
      <button className="holi-video-back" onClick={onBack}>← Back</button>

      <div className="holi-video-header">
        <h2>🎬 Holi Video Wishes</h2>
        <p>Download colorful Holi video greetings — share on WhatsApp, Instagram &amp; more!</p>
      </div>

      {HOLI_VIDEOS.length === 0 ? (
        <div className="holi-video-empty">
          <span>🎥</span>
          Videos coming soon! Add .mp4 files to <code>public/videos/</code> folder.
        </div>
      ) : (
        <div className="holi-video-grid">
          {HOLI_VIDEOS.map(v => (
            <div key={v.id} className="holi-video-card">
              <video
                className="holi-video-player"
                src={v.file}
                controls
                preload="metadata"
                playsInline
              />
              <div className="holi-video-info">
                <p className="holi-video-title">{v.title}</p>
                <button className="holi-video-dl-btn" onClick={() => handleDownload(v)}>
                  ⬇️ Download Video
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
