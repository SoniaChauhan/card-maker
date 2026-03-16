'use client';
import { useState, useRef } from 'react';
import './AIFaceSwapCard.css';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import useDownload from '../../hooks/useDownload';
import { logDownload } from '../../services/downloadHistoryService';

const PARTICLES = ['✨', '🤖', '🎭', '🌟', '💫', '🎨', '🖼️', '👤'];

/* ── Themed card templates (Pinterest-inspired) ── */
const THEME_CATEGORIES = [
  { id: 'wedding', label: '💒 Wedding Functions' },
  { id: 'festive', label: '🎆 Festivals' },
  { id: 'traditional', label: '🪔 Traditional' },
  { id: 'modern', label: '✨ Modern' },
];

const THEMES = [
  // Wedding Functions
  { id: 'haldi',         category: 'wedding', name: 'Haldi Ceremony',      emoji: '💛', bg: 'linear-gradient(135deg, #f7dc6f, #f0b429, #e8a317)', textColor: '#5d3a00', deco: '🌼', subtitle: 'Haldi Ceremony Invitation' },
  { id: 'mehendi',       category: 'wedding', name: 'Mehendi Night',       emoji: '🌿', bg: 'linear-gradient(135deg, #27ae60, #2ecc71, #1abc9c)', textColor: '#fff',    deco: '🌿', subtitle: 'Mehendi Night Celebration' },
  { id: 'sangeet',       category: 'wedding', name: 'Sangeet Night',       emoji: '🎵', bg: 'linear-gradient(135deg, #8e44ad, #9b59b6, #c39bd3)', textColor: '#fff',    deco: '🎶', subtitle: 'Sangeet Night Party' },
  { id: 'reception',     category: 'wedding', name: 'Grand Reception',     emoji: '🥂', bg: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)', textColor: '#ffd700', deco: '🥂', subtitle: 'Grand Reception Invite' },
  { id: 'baraat',        category: 'wedding', name: 'Baraat Welcome',      emoji: '🐎', bg: 'linear-gradient(135deg, #c0392b, #e74c3c, #f39c12)', textColor: '#fff',    deco: '🎺', subtitle: 'Baraat Welcome Card' },
  { id: 'engagement',    category: 'wedding', name: 'Engagement',          emoji: '💍', bg: 'linear-gradient(135deg, #e8daef, #d2b4de, #bb8fce)', textColor: '#4a235a', deco: '💎', subtitle: 'Engagement Ceremony' },

  // Festivals
  { id: 'diwali',        category: 'festive', name: 'Diwali Celebration',  emoji: '🪔', bg: 'linear-gradient(135deg, #f39c12, #e67e22, #d35400)', textColor: '#fff',    deco: '🪔', subtitle: 'Happy Diwali' },
  { id: 'holi',          category: 'festive', name: 'Holi Festival',       emoji: '🌈', bg: 'linear-gradient(135deg, #e74c3c, #f39c12, #2ecc71, #3498db)', textColor: '#fff', deco: '🎨', subtitle: 'Happy Holi' },
  { id: 'navratri',      category: 'festive', name: 'Navratri Garba',     emoji: '💃', bg: 'linear-gradient(135deg, #c0392b, #e74c3c, #f1c40f)', textColor: '#fff',    deco: '🔴', subtitle: 'Navratri Special' },
  { id: 'eid',           category: 'festive', name: 'Eid Mubarak',        emoji: '🌙', bg: 'linear-gradient(135deg, #1a5276, #2e86c1, #aed6f1)', textColor: '#ffd700', deco: '☪️', subtitle: 'Eid Mubarak' },
  { id: 'christmas',     category: 'festive', name: 'Christmas Joy',      emoji: '🎄', bg: 'linear-gradient(135deg, #c0392b, #27ae60, #c0392b)', textColor: '#fff',    deco: '⭐', subtitle: 'Merry Christmas' },

  // Traditional
  { id: 'pooja',         category: 'traditional', name: 'Pooja Invite',    emoji: '🙏', bg: 'linear-gradient(135deg, #d4ac0d, #f1c40f, #f9e79f)', textColor: '#5d3a00', deco: '🕉️', subtitle: 'Sacred Pooja Invitation' },
  { id: 'mundan',        category: 'traditional', name: 'Mundan Ceremony', emoji: '👶', bg: 'linear-gradient(135deg, #f5b7b1, #f1948a, #ec7063)', textColor: '#641e16', deco: '🪷', subtitle: 'Mundan Ceremony' },
  { id: 'gruhpravesh',   category: 'traditional', name: 'Gruh Pravesh',   emoji: '🏠', bg: 'linear-gradient(135deg, #f0b429, #f7dc6f, #fdeaa8)', textColor: '#5d3a00', deco: '🏡', subtitle: 'Gruh Pravesh Celebration' },

  // Modern
  { id: 'birthday-glam', category: 'modern', name: 'Birthday Glam',       emoji: '🎂', bg: 'linear-gradient(135deg, #667eea, #764ba2)',           textColor: '#fff',    deco: '🎉', subtitle: 'Birthday Celebration' },
  { id: 'party-neon',    category: 'modern', name: 'Neon Party',          emoji: '🎉', bg: 'linear-gradient(135deg, #0a0a0a, #1a1a2e)',           textColor: '#00ff88', deco: '✨', subtitle: 'Party Night' },
  { id: 'graduation',    category: 'modern', name: 'Graduation Day',      emoji: '🎓', bg: 'linear-gradient(135deg, #1a237e, #283593, #3949ab)', textColor: '#ffd700', deco: '🎓', subtitle: 'Congratulations Graduate' },
  { id: 'baby-shower',   category: 'modern', name: 'Baby Shower',         emoji: '🍼', bg: 'linear-gradient(135deg, #fce4ec, #f8bbd0, #f48fb1)', textColor: '#880e4f', deco: '👶', subtitle: 'Baby Shower Party' },
];

const CARD_TYPE = 'aifaceswap';

export default function AIFaceSwapCard({ onBack, userEmail }) {
  const [step, setStep] = useState('theme');   // theme → upload → result
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [activeCategory, setActiveCategory] = useState('wedding');
  const [photoPreview, setPhotoPreview] = useState('');
  const [personName, setPersonName] = useState('');
  const [customSubtitle, setCustomSubtitle] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [toast, setToast] = useState({ show: false, text: '' });
  const fileRef = useRef(null);

  const filename = `ai-themed-card-${selectedTheme?.id || 'card'}-${Date.now()}.png`;
  const { downloading, handleDownload } = useDownload('aifaceswap-card-print', filename, {
    onSuccess: async () => {
      await logDownload(userEmail, CARD_TYPE, 'AI Themed Card', selectedTheme?.name || 'Card', filename, {}).catch(() => null);
    },
    downloadWidth: 600,
    addWatermark: false,
  });

  function showToast(text) {
    setToast({ show: true, text });
    setTimeout(() => setToast({ show: false, text: '' }), 2500);
  }

  function handleThemeSelect(theme) {
    setSelectedTheme(theme);
    setCustomSubtitle(theme.subtitle);
    setStep('upload');
  }

  function handlePhotoUpload(e) {
    const files = e.target.files;
    if (files && files[0]) {
      const maxSize = 10 * 1024 * 1024;
      if (files[0].size > maxSize) {
        showToast('⚠️ Image must be under 10 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(files[0]);
    }
  }

  function handleGenerate() {
    if (!photoPreview) { showToast('⚠️ Please upload your photo first.'); return; }
    setGenerating(true);
    // Simulate AI processing (in production, call face-swap API)
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      showToast('✅ Card generated! Your themed card is ready.');
    }, 1500);
  }

  function handleReset() {
    setStep('theme');
    setSelectedTheme(null);
    setPhotoPreview('');
    setPersonName('');
    setCustomSubtitle('');
    setGenerated(false);
    setGenerating(false);
    if (fileRef.current) fileRef.current.value = '';
  }

  const filteredThemes = THEMES.filter(t => t.category === activeCategory);
  const theme = selectedTheme;

  const stepStates = {
    theme:  step === 'theme'  ? 'active' : (step === 'upload' || step === 'result' ? 'done' : ''),
    upload: step === 'upload' ? 'active' : (step === 'result' ? 'done' : ''),
    result: generated ? 'active' : '',
  };

  return (
    <div className="aifaceswap-wrapper">
      <Particles icons={PARTICLES} count={20} />
      <button className="aifaceswap-back" onClick={step === 'theme' ? onBack : () => { if (step === 'result' || generated) { setGenerated(false); setStep('upload'); } else { setStep('theme'); } }}>
        ← {step === 'theme' ? 'Back' : 'Previous Step'}
      </button>

      <div className="aifaceswap-header">
        <h1>🎭 AI Themed Card Maker</h1>
        <p>Pick a theme, upload your photo, and get a stunning personalised card!</p>
      </div>

      {/* Steps */}
      <div className="aifaceswap-steps">
        <div className={`aifaceswap-step ${stepStates.theme}`}>
          <span className="aifaceswap-step-num">{stepStates.theme === 'done' ? '✓' : '1'}</span>
          Pick Theme
        </div>
        <div className={`aifaceswap-step ${stepStates.upload}`}>
          <span className="aifaceswap-step-num">{stepStates.upload === 'done' ? '✓' : '2'}</span>
          Upload Photo
        </div>
        <div className={`aifaceswap-step ${stepStates.result}`}>
          <span className="aifaceswap-step-num">3</span>
          Download Card
        </div>
      </div>

      {/* ── STEP 1: Theme Selection ── */}
      {step === 'theme' && (
        <div className="aifaceswap-themes-section">
          <h2>🎨 Choose a Card Theme</h2>

          <div className="aifaceswap-category-tabs">
            {THEME_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`aifaceswap-cat-tab${activeCategory === cat.id ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="aifaceswap-themes-grid">
            {filteredThemes.map(t => (
              <div
                key={t.id}
                className={`aifaceswap-theme-card${selectedTheme?.id === t.id ? ' selected' : ''}`}
                onClick={() => handleThemeSelect(t)}
              >
                <div className="aifaceswap-theme-thumb" style={{ background: t.bg }}>
                  {t.emoji}
                </div>
                <div className="aifaceswap-theme-name">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 2: Upload Photo ── */}
      {step === 'upload' && theme && (
        <div className="aifaceswap-upload-section">
          <h2>📷 Upload Your Photo</h2>
          <p>Upload a clear face photo for best results</p>

          {/* Selected theme info */}
          <div className="aifaceswap-selected-info">
            <div className="aifaceswap-selected-thumb" style={{ background: theme.bg }}>
              {theme.emoji}
            </div>
            <span className="aifaceswap-selected-name">{theme.name}</span>
            <button className="aifaceswap-change-btn" onClick={() => setStep('theme')}>Change</button>
          </div>

          <div className="aifaceswap-upload-area">
            <input type="file" accept="image/*" ref={fileRef} onChange={handlePhotoUpload} />
            {photoPreview ? (
              <img src={photoPreview} alt="Face preview" className="aifaceswap-upload-preview" />
            ) : (
              <>
                <div className="aifaceswap-upload-icon">🤳</div>
                <div className="aifaceswap-upload-text">Tap to upload a face photo</div>
              </>
            )}
          </div>
          <div className="aifaceswap-upload-hint">💡 Use a clear, front-facing photo for best results</div>

          {/* Personalisation fields */}
          <div className="aifaceswap-personalise">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={personName}
              onChange={e => setPersonName(e.target.value)}
              maxLength={50}
            />
            <input
              type="text"
              placeholder="Custom subtitle (optional)"
              value={customSubtitle}
              onChange={e => setCustomSubtitle(e.target.value)}
              maxLength={80}
            />
          </div>

          <button
            className="aifaceswap-generate-btn"
            onClick={handleGenerate}
            disabled={!photoPreview || generating}
          >
            {generating ? '⏳ Creating your card…' : '🎭 Generate Themed Card'}
          </button>
        </div>
      )}

      {/* ── Loading State ── */}
      {generating && (
        <div className="aifaceswap-loading">
          <div className="aifaceswap-spinner" />
          <p>Creating your personalised {theme?.name} card…</p>
        </div>
      )}

      {/* ── STEP 3: Result ── */}
      {generated && theme && !generating && (
        <div className="aifaceswap-result-section">
          <h2>🎉 Your Card is Ready!</h2>

          <div
            id="aifaceswap-card-print"
            className="aifaceswap-card-preview"
            style={{ background: theme.bg }}
          >
            <div className="aifaceswap-card-bg">
              <div className="aifaceswap-card-bg-pattern">{theme.emoji}</div>
            </div>

            <div className="aifaceswap-card-content">
              {photoPreview && (
                <img src={photoPreview} alt="Face" className="aifaceswap-card-face" />
              )}
              <div className="aifaceswap-card-title" style={{ color: theme.textColor }}>
                {personName || 'Your Name'}
              </div>
              <div className="aifaceswap-card-subtitle" style={{ color: theme.textColor }}>
                {customSubtitle || theme.subtitle}
              </div>
              <div className="aifaceswap-card-deco">{theme.deco}</div>
            </div>
          </div>

          <div className="aifaceswap-actions">
            <button
              className="aifaceswap-download-btn"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? '⏳ Downloading…' : '⬇️ Download Card'}
            </button>
            <button className="aifaceswap-reset-btn" onClick={handleReset}>
              🔄 Start Over
            </button>
          </div>
        </div>
      )}

      <Toast text={toast.text} show={toast.show} />
    </div>
  );
}
