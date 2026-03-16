'use client';
import { useState, useRef, useEffect } from 'react';
import './Mp4ToMp3.css';

const ACCEPTED_VIDEO = 'video/mp4,video/webm,video/ogg,video/quicktime,video/x-matroska';
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

function formatTime(sec) {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatSize(bytes) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function Mp4ToMp3({ onBack }) {
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoName, setVideoName] = useState('');

  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [step, setStep] = useState('upload'); // upload | converting | done

  // Audio quality
  const [bitrate, setBitrate] = useState(128000); // 128kbps

  const fileInputRef = useRef(null);
  const videoElRef = useRef(null);

  /* ── Cleanup ── */
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── File handling ── */
  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (file) loadVideo(file);
    e.target.value = '';
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadVideo(file);
  }

  function loadVideo(file) {
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file (MP4, WebM, MOV).');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File too large. Maximum 500MB allowed.');
      return;
    }
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (audioUrl) { URL.revokeObjectURL(audioUrl); setAudioUrl(null); setAudioBlob(null); }

    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(url);
    setVideoName(file.name.replace(/\.[^.]+$/, ''));
    setError('');
    setStep('upload');
  }

  function handleVideoLoaded() {
    const vid = videoElRef.current;
    if (vid) setVideoDuration(vid.duration);
  }

  /* ── Convert: extract audio using Web Audio API + MediaRecorder ── */
  async function handleConvert() {
    if (!videoFile || !videoUrl) return;
    setConverting(true);
    setProgress(0);
    setError('');
    setStep('converting');
    if (audioUrl) { URL.revokeObjectURL(audioUrl); setAudioUrl(null); setAudioBlob(null); }

    try {
      // Create a hidden video element for playback
      const vid = document.createElement('video');
      vid.src = videoUrl;
      vid.muted = false;
      vid.playsInline = true;
      await new Promise((resolve, reject) => {
        vid.onloadeddata = resolve;
        vid.onerror = reject;
        vid.load();
      });

      // Setup AudioContext to capture audio from video
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaElementSource(vid);
      const dest = audioCtx.createMediaStreamDestination();
      source.connect(dest);
      // Don't connect to speakers to avoid echo

      // MediaRecorder on audio stream
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'audio/ogg;codecs=opus';

      const recorder = new MediaRecorder(dest.stream, {
        mimeType,
        audioBitsPerSecond: bitrate,
      });
      const chunks = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
      const recDone = new Promise(resolve => { recorder.onstop = resolve; });

      // Play and record
      recorder.start(100);
      vid.currentTime = 0;
      vid.play();

      // Track progress
      const duration = vid.duration || videoDuration;
      const progressInterval = setInterval(() => {
        if (vid.currentTime > 0 && duration > 0) {
          setProgress(Math.min(99, Math.round((vid.currentTime / duration) * 100)));
        }
      }, 200);

      // Wait for video to end
      await new Promise(resolve => {
        vid.onended = resolve;
        vid.onpause = () => {
          // In case video pauses before ending (unlikely)
          if (vid.currentTime >= duration - 0.1) resolve();
        };
      });

      clearInterval(progressInterval);
      setProgress(100);

      recorder.stop();
      vid.pause();
      try { audioCtx.close(); } catch {}
      await recDone;

      const ext = mimeType.includes('ogg') ? 'ogg' : 'webm';
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      setAudioBlob(blob);
      setAudioUrl(url);
      setStep('done');
    } catch (err) {
      console.error('Conversion failed:', err);
      setError('Failed to extract audio. The video may not contain an audio track, or try a different format.');
      setStep('upload');
    } finally {
      setConverting(false);
      setProgress(0);
    }
  }

  /* ── Download ── */
  function handleDownload() {
    if (!audioUrl) return;
    const ext = audioBlob?.type?.includes('ogg') ? 'ogg' : 'webm';
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `${videoName || 'audio'}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function handleReset() {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setVideoFile(null);
    setVideoUrl(null);
    setAudioUrl(null);
    setAudioBlob(null);
    setVideoDuration(0);
    setVideoName('');
    setError('');
    setStep('upload');
  }

  const BITRATE_OPTIONS = [
    { value: 64000,  label: '64 kbps',  desc: 'Small size' },
    { value: 128000, label: '128 kbps', desc: 'Standard' },
    { value: 192000, label: '192 kbps', desc: 'High quality' },
    { value: 320000, label: '320 kbps', desc: 'Best quality' },
  ];

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <div className="m2m-screen">
      <button className="m2m-back" onClick={onBack}>← Back</button>

      {/* ── HEADER ── */}
      <div className="m2m-header">
        <h2>🎵 MP4 to MP3 Converter</h2>
        <p>Extract audio from any video file — download as audio, all in your browser</p>
      </div>

      {/* ── STEPS ── */}
      <div className="m2m-steps">
        <div className={`m2m-step-dot ${step === 'upload' ? 'active' : step !== 'upload' ? 'done' : ''}`}>
          <span>1</span> Upload
        </div>
        <div className="m2m-step-line" />
        <div className={`m2m-step-dot ${step === 'converting' ? 'active' : step === 'done' ? 'done' : ''}`}>
          <span>2</span> Convert
        </div>
        <div className="m2m-step-line" />
        <div className={`m2m-step-dot ${step === 'done' ? 'active' : ''}`}>
          <span>3</span> Download
        </div>
      </div>

      {/* ════════════ STEP 1: UPLOAD ════════════ */}
      {step === 'upload' && (
        <div className="m2m-section">
          {!videoFile ? (
            <div
              className={`m2m-drop-zone ${dragOver ? 'drag-over' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="m2m-drop-icon">🎥</div>
              <p>Drag &amp; drop a video here or <strong>click to browse</strong></p>
              <small>MP4, WebM, MOV, MKV — max 500MB</small>
            </div>
          ) : (
            <div className="m2m-file-card">
              <div className="m2m-file-preview">
                <video
                  ref={videoElRef}
                  src={videoUrl}
                  onLoadedMetadata={handleVideoLoaded}
                  playsInline
                  muted
                  className="m2m-mini-video"
                />
              </div>
              <div className="m2m-file-info">
                <p className="m2m-file-name">{videoFile.name}</p>
                <div className="m2m-file-meta">
                  <span>📁 {formatSize(videoFile.size)}</span>
                  {videoDuration > 0 && <span>⏱️ {formatTime(videoDuration)}</span>}
                </div>
              </div>
              <button className="m2m-file-change" onClick={() => fileInputRef.current?.click()}>📁 Change</button>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept={ACCEPTED_VIDEO} style={{ display: 'none' }} onChange={handleFileSelect} />

          {/* Quality selector */}
          {videoFile && (
            <div className="m2m-quality-section">
              <h3>🎚️ Audio Quality</h3>
              <div className="m2m-quality-options">
                {BITRATE_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    className={`m2m-quality-btn ${bitrate === opt.value ? 'selected' : ''}`}
                    onClick={() => setBitrate(opt.value)}
                  >
                    <strong>{opt.label}</strong>
                    <small>{opt.desc}</small>
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="m2m-error">⚠️ {error}</p>}

          {videoFile && (
            <button className="m2m-btn-primary" onClick={handleConvert}>
              🎵 Convert to Audio
            </button>
          )}
        </div>
      )}

      {/* ════════════ STEP 2: CONVERTING ════════════ */}
      {step === 'converting' && (
        <div className="m2m-section">
          <div className="m2m-converting-card">
            <div className="m2m-spin-icon">🎵</div>
            <h3>Extracting audio…</h3>
            <p>Playing video internally to capture audio. Please wait.</p>
            <div className="m2m-progress-bar">
              <div className="m2m-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="m2m-progress-text">{progress}%</span>
          </div>
        </div>
      )}

      {/* ════════════ STEP 3: DONE ════════════ */}
      {step === 'done' && audioUrl && (
        <div className="m2m-section">
          <div className="m2m-done-badge">✅ Audio Extracted Successfully!</div>

          {/* Audio player */}
          <div className="m2m-audio-card">
            <div className="m2m-audio-icon">🎵</div>
            <div className="m2m-audio-info">
              <p className="m2m-audio-name">{videoName || 'audio'}.{audioBlob?.type?.includes('ogg') ? 'ogg' : 'webm'}</p>
              <audio src={audioUrl} controls className="m2m-audio-player" />
            </div>
          </div>

          {/* Summary */}
          <div className="m2m-summary">
            <div className="m2m-summary-item"><span>🎥</span> Source: {videoFile?.name}</div>
            <div className="m2m-summary-item"><span>⏱️</span> Duration: {formatTime(videoDuration)}</div>
            <div className="m2m-summary-item"><span>🎚️</span> Quality: {BITRATE_OPTIONS.find(o => o.value === bitrate)?.label}</div>
            {audioBlob && <div className="m2m-summary-item"><span>📁</span> Size: {formatSize(audioBlob.size)}</div>}
          </div>

          <div className="m2m-btn-row">
            <button className="m2m-btn-secondary" onClick={handleReset}>📁 Convert Another</button>
            <button className="m2m-btn-primary" onClick={handleDownload}>⬇️ Download Audio</button>
          </div>
        </div>
      )}
    </div>
  );
}
