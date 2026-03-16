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

/**
 * Fallback: capture audio by playing the video through Web Audio API.
 * Used when decodeAudioData cannot parse the video container format.
 */
function captureAudioViaPlayback(url, onProgress) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.src = url;
    video.preload = 'auto';
    video.playsInline = true;

    function cleanup(ctx, nodes) {
      if (nodes) nodes.forEach(n => { try { n.disconnect(); } catch {} });
      if (ctx) try { ctx.close(); } catch {}
      video.pause();
      video.removeAttribute('src');
      video.load();
    }

    video.addEventListener('loadedmetadata', async () => {
      const duration = video.duration;
      if (!duration || !isFinite(duration)) {
        reject(new Error('Cannot determine video duration'));
        return;
      }

      const sampleRate = 44100;
      let ctx;
      try {
        ctx = new AudioContext({ sampleRate });
        if (ctx.state === 'suspended') await ctx.resume();
      } catch {
        reject(new Error('AudioContext unavailable'));
        return;
      }

      const source = ctx.createMediaElementSource(video);
      const processor = ctx.createScriptProcessor(4096, 2, 2);
      const muteGain = ctx.createGain();
      muteGain.gain.value = 0; // keep speakers silent

      // source → processor → muteGain(0) → destination
      // processor must be connected to destination to fire onaudioprocess
      source.connect(processor);
      processor.connect(muteGain);
      muteGain.connect(ctx.destination);

      const leftChunks = [];
      const rightChunks = [];

      processor.onaudioprocess = (e) => {
        leftChunks.push(new Float32Array(e.inputBuffer.getChannelData(0)));
        rightChunks.push(new Float32Array(
          e.inputBuffer.numberOfChannels > 1
            ? e.inputBuffer.getChannelData(1)
            : e.inputBuffer.getChannelData(0)
        ));
        if (onProgress && duration > 0) {
          const pct = Math.min(video.currentTime / duration, 1);
          onProgress(10 + Math.round(pct * 80));
        }
      };

      video.addEventListener('ended', () => {
        cleanup(ctx, [processor, muteGain, source]);
        const totalLen = leftChunks.reduce((a, c) => a + c.length, 0);
        if (totalLen === 0) { reject(new Error('Video has no audio track')); return; }

        // Check for silence — video may lack an actual audio stream
        let hasSound = false;
        for (const c of leftChunks) {
          for (let i = 0; i < c.length; i += 100) {
            if (Math.abs(c[i]) > 0.0001) { hasSound = true; break; }
          }
          if (hasSound) break;
        }
        if (!hasSound) { reject(new Error('Video has no audio track')); return; }

        // Concatenate captured samples
        const left = new Float32Array(totalLen);
        const right = new Float32Array(totalLen);
        let off = 0;
        for (let i = 0; i < leftChunks.length; i++) {
          left.set(leftChunks[i], off);
          right.set(rightChunks[i], off);
          off += leftChunks[i].length;
        }

        resolve({
          sampleRate,
          numberOfChannels: 2,
          length: totalLen,
          getChannelData: (ch) => ch === 0 ? left : right,
        });
      });

      video.addEventListener('error', () => {
        cleanup(ctx, [processor, muteGain, source]);
        reject(new Error('Playback error'));
      });

      try { await video.play(); } catch {
        cleanup(ctx, [processor, muteGain, source]);
        reject(new Error('Could not start video playback'));
      }
    });

    video.addEventListener('error', () => reject(new Error('Could not load video')));
  });
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

  /* ── Convert: decode audio → encode MP3 with lamejs ── */
  async function handleConvert() {
    if (!videoFile || !videoUrl) return;
    setConverting(true);
    setProgress(0);
    setError('');
    setStep('converting');
    if (audioUrl) { URL.revokeObjectURL(audioUrl); setAudioUrl(null); setAudioBlob(null); }

    try {
      let audioBuffer;
      let usedFallback = false;

      // Method 1 (fast): decodeAudioData — works for many video formats
      try {
        setProgress(5);
        const arrayBuffer = await videoFile.arrayBuffer();
        setProgress(10);
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        try { audioCtx.close(); } catch {}
      } catch {
        // Method 2 (fallback): real-time audio capture via video playback
        usedFallback = true;
        audioBuffer = await captureAudioViaPlayback(videoUrl, setProgress);
      }

      const sampleRate = audioBuffer.sampleRate;
      const numChannels = Math.min(audioBuffer.numberOfChannels, 2); // max stereo
      const samples = [];
      for (let ch = 0; ch < numChannels; ch++) {
        samples.push(audioBuffer.getChannelData(ch));
      }

      // Encode to MP3 using lamejs
      const lamejs = await import('lamejs');
      const kbps = Math.round(bitrate / 1000);
      const encoder = new lamejs.Mp3Encoder(numChannels, sampleRate, kbps);
      const mp3Chunks = [];
      const blockSize = 1152;
      const totalSamples = samples[0].length;
      const encodeBase = usedFallback ? 90 : 10;
      const encodeRange = usedFallback ? 9 : 85;

      function floatTo16BitPCM(float32Array) {
        const int16 = new Int16Array(float32Array.length);
        for (let i = 0; i < float32Array.length; i++) {
          const s = Math.max(-1, Math.min(1, float32Array[i]));
          int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        return int16;
      }

      for (let i = 0; i < totalSamples; i += blockSize) {
        const end = Math.min(i + blockSize, totalSamples);
        let mp3buf;
        if (numChannels === 1) {
          mp3buf = encoder.encodeBuffer(floatTo16BitPCM(samples[0].subarray(i, end)));
        } else {
          mp3buf = encoder.encodeBuffer(
            floatTo16BitPCM(samples[0].subarray(i, end)),
            floatTo16BitPCM(samples[1].subarray(i, end))
          );
        }
        if (mp3buf.length > 0) mp3Chunks.push(mp3buf);
        if (i % (blockSize * 50) === 0) {
          setProgress(encodeBase + Math.round((i / totalSamples) * encodeRange));
        }
      }

      const flush = encoder.flush();
      if (flush.length > 0) mp3Chunks.push(flush);
      setProgress(100);

      const blob = new Blob(mp3Chunks, { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      setAudioBlob(blob);
      setAudioUrl(url);
      setStep('done');
    } catch (err) {
      console.error('Conversion failed:', err);
      setError(
        err?.message === 'Video has no audio track'
          ? 'This video does not contain an audio track.'
          : 'Failed to extract audio. The video may not contain an audio track, or try a different format.'
      );
      setStep('upload');
    } finally {
      setConverting(false);
      setProgress(0);
    }
  }

  /* ── Download ── */
  function handleDownload() {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `${videoName || 'audio'}.mp3`;
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
              <p className="m2m-audio-name">{videoName || 'audio'}.mp3</p>
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
