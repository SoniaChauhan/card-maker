'use client';
import { useState, useRef } from 'react';
import './AITextImageCard.css';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import useDownload from '../../hooks/useDownload';
import { logDownload } from '../../services/downloadHistoryService';

const PARTICLES = ['✨', '🎨', '💡', '🌟', '💫', '🎯', '🖼️', '📝'];

const LAYOUTS = [
  { id: 'left-image',   label: 'Left Image',   icon: '◧' },
  { id: 'right-image',  label: 'Right Image',  icon: '◨' },
  { id: 'top-image',    label: 'Top Image',    icon: '⬒' },
  { id: 'bottom-image', label: 'Bottom Image', icon: '⬓' },
];

const BG_COLORS = [
  { color: '#1a1a2e', label: 'Dark Navy' },
  { color: '#16213e', label: 'Deep Blue' },
  { color: '#0f3460', label: 'Royal Blue' },
  { color: '#533483', label: 'Purple' },
  { color: '#e94560', label: 'Red' },
  { color: '#f5f5dc', label: 'Beige' },
  { color: '#fdf8f0', label: 'Ivory' },
  { color: '#fce4ec', label: 'Blush Pink' },
  { color: '#e8f5e9', label: 'Sage Green' },
  { color: '#fff8e1', label: 'Warm Yellow' },
  { color: '#212121', label: 'Charcoal' },
  { color: '#ffffff', label: 'White' },
];

const FONT_OPTIONS = [
  { id: 'serif',      label: 'Elegant',    family: 'Georgia, serif' },
  { id: 'sans',       label: 'Modern',     family: "'Segoe UI', sans-serif" },
  { id: 'cursive',    label: 'Handwritten', family: "'Segoe Script', cursive" },
  { id: 'monospace',  label: 'Typewriter', family: "'Courier New', monospace" },
];

const CARD_TYPE = 'aitextimage';

export default function AITextImageCard({ onBack, userEmail }) {
  const [data, setData] = useState({
    title: '',
    body: '',
    photoPreview: '',
    layout: 'left-image',
    bgColor: '#1a1a2e',
    textColor: '#ffffff',
    fontFamily: FONT_OPTIONS[0].family,
  });
  const [toast, setToast] = useState({ show: false, text: '' });
  const [generated, setGenerated] = useState(false);
  const fileRef = useRef(null);

  const filename = `ai-card-${Date.now()}.png`;
  const { downloading, handleDownload, watermarkRef } = useDownload('aitextimage-card-print', filename, {
    onSuccess: async () => {
      await logDownload(userEmail, CARD_TYPE, 'AI Text+Image Card', data.title || 'Untitled', filename, {}).catch(() => null);
    },
    downloadWidth: 800,
    addWatermark: false,
  });

  function onChange(e) {
    const { name, value, files } = e.target;
    if (name === 'photo' && files && files[0]) {
      const maxSize = 10 * 1024 * 1024; // 10 MB
      if (files[0].size > maxSize) {
        showToast('⚠️ Image must be under 10 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setData(d => ({ ...d, photoPreview: reader.result }));
      reader.readAsDataURL(files[0]);
    } else {
      setData(d => ({ ...d, [name]: value }));
    }
  }

  function showToast(text) {
    setToast({ show: true, text });
    setTimeout(() => setToast({ show: false, text: '' }), 2500);
  }

  function handleGenerate() {
    if (!data.photoPreview) { showToast('⚠️ Please upload an image first.'); return; }
    if (!data.title.trim() && !data.body.trim()) { showToast('⚠️ Add some text — title or message.'); return; }
    setGenerated(true);
    showToast('✅ Card generated! Scroll down to preview.');
  }

  function handleReset() {
    setData({ title: '', body: '', photoPreview: '', layout: 'left-image', bgColor: '#1a1a2e', textColor: '#ffffff', fontFamily: FONT_OPTIONS[0].family });
    setGenerated(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  /* Determine text color for dark/light backgrounds */
  const isLightBg = ['#f5f5dc','#fdf8f0','#fce4ec','#e8f5e9','#fff8e1','#ffffff'].includes(data.bgColor);
  const autoTextColor = isLightBg ? '#1a1a2e' : '#ffffff';

  return (
    <div className="aitextimage-wrapper">
      <Particles icons={PARTICLES} count={20} />
      <button className="aitextimage-back" onClick={onBack}>← Back</button>

      <div className="aitextimage-header">
        <h1>🎨 AI Text + Image Card</h1>
        <p>Upload your photo, write something meaningful, and design your card!</p>
      </div>

      {/* ── FORM ── */}
      <div className="aitextimage-form-section">
        <h2>📝 Create Your Card</h2>

        {/* Image Upload */}
        <div className="aitextimage-field">
          <label>Upload Your Image *</label>
          <div className="aitextimage-upload-area">
            <input type="file" name="photo" accept="image/*" ref={fileRef} onChange={onChange} />
            {data.photoPreview ? (
              <img src={data.photoPreview} alt="Uploaded preview" className="aitextimage-upload-preview" />
            ) : (
              <>
                <div className="aitextimage-upload-icon">📷</div>
                <div className="aitextimage-upload-text">Tap to upload your photo (JPG, PNG, AVIF)</div>
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="aitextimage-field">
          <label>Card Title</label>
          <input type="text" name="title" value={data.title} onChange={onChange} placeholder="What's in your mind?" maxLength={100} />
        </div>

        {/* Body text */}
        <div className="aitextimage-field">
          <label>Message / Body Text</label>
          <textarea name="body" value={data.body} onChange={onChange} placeholder="Write your thoughts, wishes, or message here..." maxLength={500} />
        </div>

        {/* Layout Picker */}
        <div className="aitextimage-field">
          <label>Image Position</label>
          <div className="aitextimage-layout-chooser">
            {LAYOUTS.map(l => (
              <button
                key={l.id}
                type="button"
                className={`aitextimage-layout-btn${data.layout === l.id ? ' active' : ''}`}
                onClick={() => setData(d => ({ ...d, layout: l.id }))}
              >
                <span className="aitextimage-layout-icon">{l.icon}</span>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Background Color */}
        <div className="aitextimage-field">
          <label>Background Color</label>
          <div className="aitextimage-color-swatches">
            {BG_COLORS.map(s => (
              <div
                key={s.color}
                className={`aitextimage-swatch${data.bgColor === s.color ? ' active' : ''}`}
                style={{ background: s.color }}
                title={s.label}
                onClick={() => setData(d => ({ ...d, bgColor: s.color }))}
              />
            ))}
          </div>
        </div>

        {/* Font Style */}
        <div className="aitextimage-field">
          <label>Font Style</label>
          <div className="aitextimage-font-chooser">
            {FONT_OPTIONS.map(f => (
              <button
                key={f.id}
                type="button"
                className={`aitextimage-font-btn${data.fontFamily === f.family ? ' active' : ''}`}
                style={{ fontFamily: f.family }}
                onClick={() => setData(d => ({ ...d, fontFamily: f.family }))}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <button
          className="aitextimage-generate-btn"
          onClick={handleGenerate}
          disabled={!data.photoPreview}
        >
          ✨ Generate Card
        </button>
      </div>

      {/* ── PREVIEW ── */}
      {generated && (
        <div className="aitextimage-preview-section">
          <h2>🖼️ Your Card Preview</h2>

          <div
            id="aitextimage-card-print"
            className={`aitextimage-card layout-${data.layout}`}
            style={{ background: data.bgColor }}
          >
            {data.photoPreview ? (
              <div className="aitextimage-card-image">
                <img src={data.photoPreview} alt="Card" />
              </div>
            ) : (
              <div className="aitextimage-card-placeholder">📷</div>
            )}

            <div
              className="aitextimage-card-text"
              style={{ color: autoTextColor, fontFamily: data.fontFamily }}
            >
              {data.title && <h3>{data.title}</h3>}
              {data.body && <p>{data.body}</p>}
            </div>
          </div>

          <div className="aitextimage-actions">
            <button
              className="aitextimage-download-btn"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? '⏳ Downloading…' : '⬇️ Download Card'}
            </button>
            <button className="aitextimage-reset-btn" onClick={handleReset}>
              🔄 Start Over
            </button>
          </div>
        </div>
      )}

      <Toast text={toast.text} show={toast.show} />
    </div>
  );
}
