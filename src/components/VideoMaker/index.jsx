'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import './VideoMaker.css';

const MAX_IMAGES = 20;
const MIN_IMAGES = 2;
const ACCEPTED_IMAGE = 'image/jpeg,image/png,image/webp,image/avif';
const ACCEPTED_AUDIO = 'audio/mpeg,audio/wav,audio/ogg,audio/aac,audio/mp4';
const TRANSITIONS = ['fade', 'slideLeft', 'slideRight', 'zoomIn', 'zoomOut'];
const TRANSITION_LABELS = { fade: '✨ Fade', slideLeft: '👈 Slide Left', slideRight: '👉 Slide Right', zoomIn: '🔍 Zoom In', zoomOut: '🔎 Zoom Out' };

export default function VideoMaker({ onBack }) {
  /* ── state ── */
  const [images, setImages] = useState([]);         // { id, file, url, name }
  const [audio, setAudio] = useState(null);          // { file, url, name, duration }
  const [duration, setDuration] = useState(3);       // seconds per image
  const [transition, setTransition] = useState('fade');
  const [resolution, setResolution] = useState('720');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [step, setStep] = useState('upload');        // upload | settings | preview

  const imgInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const canvasRef = useRef(null);

  /* ── cleanup blob URLs on unmount ── */
  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.url));
      if (audio?.url) URL.revokeObjectURL(audio.url);
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── image handling ── */
  function handleImageSelect(e) {
    const files = Array.from(e.target.files || []);
    addImages(files);
    e.target.value = '';
  }

  function addImages(files) {
    const valid = files.filter(f => f.type.startsWith('image/'));
    if (!valid.length) { setError('Please select valid image files.'); return; }
    if (images.length + valid.length > MAX_IMAGES) {
      setError(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }
    setError('');
    const newImgs = valid.map(f => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file: f,
      url: URL.createObjectURL(f),
      name: f.name,
    }));
    setImages(prev => [...prev, ...newImgs]);
  }

  function removeImage(id) {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) URL.revokeObjectURL(img.url);
      return prev.filter(i => i.id !== id);
    });
  }

  function moveImage(idx, dir) {
    setImages(prev => {
      const arr = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= arr.length) return arr;
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  }

  /* ── drag & drop ── */
  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    addImages(files);
  }

  /* ── audio handling ── */
  function handleAudioSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('audio/')) {
      setError('Please select a valid audio file (MP3, WAV, OGG).');
      return;
    }
    if (audio?.url) URL.revokeObjectURL(audio.url);
    const url = URL.createObjectURL(file);
    // Get audio duration
    const audioEl = new Audio();
    audioEl.src = url;
    audioEl.addEventListener('loadedmetadata', () => {
      setAudio({ file, url, name: file.name, duration: audioEl.duration });
    });
    audioEl.addEventListener('error', () => {
      setAudio({ file, url, name: file.name, duration: 0 });
    });
    setError('');
    e.target.value = '';
  }

  function removeAudio() {
    if (audio?.url) URL.revokeObjectURL(audio.url);
    setAudio(null);
  }

  /* ── video generation using Canvas + MediaRecorder ── */
  const generateVideo = useCallback(async () => {
    if (images.length < MIN_IMAGES) {
      setError(`Please add at least ${MIN_IMAGES} images.`);
      return;
    }
    setGenerating(true);
    setProgress(0);
    setError('');
    if (videoUrl) { URL.revokeObjectURL(videoUrl); setVideoUrl(null); }

    try {
      const RES = { '480': [854, 480], '720': [1280, 720], '1080': [1920, 1080] };
      const [W, H] = RES[resolution] || RES['720'];
      const FPS = 30;
      const TRANS_FRAMES = Math.round(FPS * 0.8); // 0.8s transition
      const HOLD_FRAMES = Math.round(duration * FPS);
      const TOTAL = images.length * HOLD_FRAMES + (images.length - 1) * TRANS_FRAMES;

      /* ── load all images into bitmaps ── */
      const bitmaps = await Promise.all(
        images.map(img => new Promise((res, rej) => {
          const el = new Image();
          el.crossOrigin = 'anonymous';
          el.onload = () => res(el);
          el.onerror = rej;
          el.src = img.url;
        }))
      );

      /* ── setup canvas ── */
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');

      /* ── setup audio context for mixing ── */
      let audioCtx, audioSource, audioDest;
      if (audio?.file) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const arrayBuf = await audio.file.arrayBuffer();
        const audioBuf = await audioCtx.decodeAudioData(arrayBuf);
        audioDest = audioCtx.createMediaStreamDestination();
        audioSource = audioCtx.createBufferSource();
        audioSource.buffer = audioBuf;
        audioSource.connect(audioDest);
      }

      /* ── MediaRecorder ── */
      const videoStream = canvas.captureStream(FPS);
      if (audioDest) {
        audioDest.stream.getAudioTracks().forEach(t => videoStream.addTrack(t));
      }

      // Try VP9 first, fall back to VP8, then default
      let mimeType = 'video/webm;codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8,opus';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }

      const recorder = new MediaRecorder(videoStream, {
        mimeType,
        videoBitsPerSecond: resolution === '1080' ? 8_000_000 : resolution === '720' ? 5_000_000 : 2_500_000,
      });
      const chunks = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

      const recDone = new Promise(resolve => { recorder.onstop = resolve; });
      recorder.start(100);
      if (audioSource) audioSource.start(0);

      /* ── draw frames ── */
      function drawCover(ctx, img, w, h) {
        const iw = img.naturalWidth || img.width;
        const ih = img.naturalHeight || img.height;
        const scale = Math.max(w / iw, h / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
      }

      let frameIdx = 0;
      for (let i = 0; i < images.length; i++) {
        /* hold phase */
        for (let f = 0; f < HOLD_FRAMES; f++) {
          ctx.clearRect(0, 0, W, H);
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, W, H);
          drawCover(ctx, bitmaps[i], W, H);
          frameIdx++;
          setProgress(Math.round((frameIdx / TOTAL) * 100));
          await new Promise(r => requestAnimationFrame(r));
        }
        /* transition to next image */
        if (i < images.length - 1) {
          for (let f = 0; f < TRANS_FRAMES; f++) {
            const t = f / TRANS_FRAMES; // 0 → 1
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, W, H);

            switch (transition) {
              case 'fade':
                ctx.globalAlpha = 1 - t;
                drawCover(ctx, bitmaps[i], W, H);
                ctx.globalAlpha = t;
                drawCover(ctx, bitmaps[i + 1], W, H);
                ctx.globalAlpha = 1;
                break;
              case 'slideLeft':
                ctx.save();
                ctx.translate(-W * t, 0);
                drawCover(ctx, bitmaps[i], W, H);
                ctx.translate(W, 0);
                drawCover(ctx, bitmaps[i + 1], W, H);
                ctx.restore();
                break;
              case 'slideRight':
                ctx.save();
                ctx.translate(W * t, 0);
                drawCover(ctx, bitmaps[i], W, H);
                ctx.translate(-W, 0);
                drawCover(ctx, bitmaps[i + 1], W, H);
                ctx.restore();
                break;
              case 'zoomIn':
                ctx.globalAlpha = 1 - t;
                ctx.save();
                ctx.translate(W / 2, H / 2);
                ctx.scale(1 + t * 0.3, 1 + t * 0.3);
                ctx.translate(-W / 2, -H / 2);
                drawCover(ctx, bitmaps[i], W, H);
                ctx.restore();
                ctx.globalAlpha = t;
                drawCover(ctx, bitmaps[i + 1], W, H);
                ctx.globalAlpha = 1;
                break;
              case 'zoomOut':
                ctx.globalAlpha = 1 - t;
                drawCover(ctx, bitmaps[i], W, H);
                ctx.globalAlpha = t;
                ctx.save();
                ctx.translate(W / 2, H / 2);
                ctx.scale(1.3 - t * 0.3, 1.3 - t * 0.3);
                ctx.translate(-W / 2, -H / 2);
                drawCover(ctx, bitmaps[i + 1], W, H);
                ctx.restore();
                ctx.globalAlpha = 1;
                break;
              default:
                ctx.globalAlpha = 1 - t;
                drawCover(ctx, bitmaps[i], W, H);
                ctx.globalAlpha = t;
                drawCover(ctx, bitmaps[i + 1], W, H);
                ctx.globalAlpha = 1;
            }
            frameIdx++;
            setProgress(Math.round((frameIdx / TOTAL) * 100));
            await new Promise(r => requestAnimationFrame(r));
          }
        }
      }

      /* stop recording */
      recorder.stop();
      if (audioSource) { try { audioSource.stop(); } catch {} }
      if (audioCtx) { try { audioCtx.close(); } catch {} }
      await recDone;

      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setStep('preview');
    } catch (err) {
      console.error('Video generation failed:', err);
      setError('Failed to generate video. Please try a different browser or reduce the number of images.');
    } finally {
      setGenerating(false);
      setProgress(0);
    }
  }, [images, audio, duration, transition, resolution, videoUrl]);

  /* ── download ── */
  function handleDownload() {
    if (!videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `video-card-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function handleReset() {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoUrl(null);
    setStep('upload');
  }

  /* ── total estimated video length ── */
  const estLength = images.length > 0
    ? (images.length * duration + (images.length - 1) * 0.8).toFixed(1)
    : 0;

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <div className="vm-screen">
      <button className="vm-back" onClick={onBack}>← Back</button>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* ── HEADER ── */}
      <div className="vm-header">
        <h2>🎬 Video Card Maker</h2>
        <p>Upload your photos &amp; audio to create a beautiful video slideshow</p>
      </div>

      {/* ── STEPS INDICATOR ── */}
      <div className="vm-steps">
        <div className={`vm-step-dot ${step === 'upload' ? 'active' : (step === 'settings' || step === 'preview') ? 'done' : ''}`}>
          <span>1</span> Upload
        </div>
        <div className="vm-step-line" />
        <div className={`vm-step-dot ${step === 'settings' ? 'active' : step === 'preview' ? 'done' : ''}`}>
          <span>2</span> Settings
        </div>
        <div className="vm-step-line" />
        <div className={`vm-step-dot ${step === 'preview' ? 'active' : ''}`}>
          <span>3</span> Preview
        </div>
      </div>

      {/* ════════════ STEP 1: UPLOAD ════════════ */}
      {step === 'upload' && (
        <div className="vm-section">
          {/* Image Upload */}
          <div className="vm-upload-group">
            <h3>📷 Upload Images ({images.length}/{MAX_IMAGES})</h3>
            <div
              className={`vm-drop-zone ${dragOver ? 'drag-over' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => imgInputRef.current?.click()}
            >
              <div className="vm-drop-icon">📁</div>
              <p>Drag & drop images here or <strong>click to browse</strong></p>
              <small>JPG, PNG, WebP — max {MAX_IMAGES} images</small>
            </div>
            <input ref={imgInputRef} type="file" accept={ACCEPTED_IMAGE} multiple style={{ display: 'none' }} onChange={handleImageSelect} />
          </div>

          {/* Image Grid */}
          {images.length > 0 && (
            <div className="vm-img-grid">
              {images.map((img, idx) => (
                <div key={img.id} className="vm-img-thumb">
                  <img src={img.url} alt={img.name} />
                  <div className="vm-img-order">{idx + 1}</div>
                  <div className="vm-img-actions">
                    <button onClick={() => moveImage(idx, -1)} disabled={idx === 0} title="Move up">↑</button>
                    <button onClick={() => moveImage(idx, 1)} disabled={idx === images.length - 1} title="Move down">↓</button>
                    <button onClick={() => removeImage(img.id)} className="vm-img-remove" title="Remove">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Audio Upload */}
          <div className="vm-upload-group">
            <h3>🎵 Upload Audio / Song {audio ? '' : '(optional)'}</h3>
            {!audio ? (
              <div className="vm-audio-upload" onClick={() => audioInputRef.current?.click()}>
                <div className="vm-drop-icon">🎶</div>
                <p>Click to upload audio file</p>
                <small>MP3, WAV, OGG</small>
              </div>
            ) : (
              <div className="vm-audio-info">
                <span className="vm-audio-icon">🎵</span>
                <div className="vm-audio-details">
                  <p className="vm-audio-name">{audio.name}</p>
                  {audio.duration > 0 && <small>{Math.floor(audio.duration / 60)}:{String(Math.floor(audio.duration % 60)).padStart(2, '0')} duration</small>}
                </div>
                <button className="vm-audio-remove" onClick={removeAudio}>✕</button>
              </div>
            )}
            <input ref={audioInputRef} type="file" accept={ACCEPTED_AUDIO} style={{ display: 'none' }} onChange={handleAudioSelect} />
          </div>

          {error && <p className="vm-error">⚠️ {error}</p>}

          <button
            className="vm-btn-primary"
            disabled={images.length < MIN_IMAGES}
            onClick={() => { setError(''); setStep('settings'); }}
          >
            Continue to Settings →
          </button>
        </div>
      )}

      {/* ════════════ STEP 2: SETTINGS ════════════ */}
      {step === 'settings' && (
        <div className="vm-section">
          <div className="vm-settings-grid">
            {/* Duration per slide */}
            <div className="vm-setting-card">
              <label>⏱️ Duration per Image</label>
              <div className="vm-range-group">
                <input type="range" min="1" max="10" step="0.5" value={duration} onChange={e => setDuration(+e.target.value)} />
                <span className="vm-range-value">{duration}s</span>
              </div>
            </div>

            {/* Transition */}
            <div className="vm-setting-card">
              <label>🎞️ Transition Effect</label>
              <div className="vm-transition-options">
                {TRANSITIONS.map(t => (
                  <button
                    key={t}
                    className={`vm-trans-btn ${transition === t ? 'selected' : ''}`}
                    onClick={() => setTransition(t)}
                  >
                    {TRANSITION_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution */}
            <div className="vm-setting-card">
              <label>📐 Resolution</label>
              <div className="vm-transition-options">
                {['480', '720', '1080'].map(r => (
                  <button
                    key={r}
                    className={`vm-trans-btn ${resolution === r ? 'selected' : ''}`}
                    onClick={() => setResolution(r)}
                  >
                    {r}p
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="vm-summary">
            <div className="vm-summary-item"><span>📷</span> {images.length} images</div>
            <div className="vm-summary-item"><span>🎵</span> {audio ? audio.name : 'No audio'}</div>
            <div className="vm-summary-item"><span>⏱️</span> ~{estLength}s total</div>
            <div className="vm-summary-item"><span>🎞️</span> {TRANSITION_LABELS[transition]}</div>
            <div className="vm-summary-item"><span>📐</span> {resolution}p</div>
          </div>

          {error && <p className="vm-error">⚠️ {error}</p>}

          <div className="vm-btn-row">
            <button className="vm-btn-secondary" onClick={() => setStep('upload')}>← Back to Upload</button>
            <button className="vm-btn-primary" onClick={generateVideo} disabled={generating}>
              {generating ? `🎬 Generating… ${progress}%` : '🎬 Generate Video'}
            </button>
          </div>

          {generating && (
            <div className="vm-progress-bar">
              <div className="vm-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      )}

      {/* ════════════ STEP 3: PREVIEW ════════════ */}
      {step === 'preview' && videoUrl && (
        <div className="vm-section">
          <div className="vm-preview">
            <video src={videoUrl} controls autoPlay playsInline className="vm-video-player" />
          </div>

          <div className="vm-btn-row">
            <button className="vm-btn-secondary" onClick={handleReset}>🔄 Create New Video</button>
            <button className="vm-btn-primary" onClick={handleDownload}>⬇️ Download Video</button>
          </div>
        </div>
      )}
    </div>
  );
}
