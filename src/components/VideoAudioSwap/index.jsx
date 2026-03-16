'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import './VideoAudioSwap.css';

const ACCEPTED_VIDEO = 'video/mp4,video/webm,video/ogg,video/quicktime';
const ACCEPTED_AUDIO = 'audio/mpeg,audio/wav,audio/ogg,audio/aac,audio/mp4,audio/webm';
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

export default function VideoAudioSwap({ onBack }) {
  /* ── State ── */
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioName, setAudioName] = useState('');

  const [musicVolume, setMusicVolume] = useState(100);    // 0-100 new song volume
  const [originalVolume, setOriginalVolume] = useState(0); // 0-100 original audio volume (0 = muted)

  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputUrl, setOutputUrl] = useState(null);
  const [error, setError] = useState('');
  const [dragOverVideo, setDragOverVideo] = useState(false);
  const [dragOverAudio, setDragOverAudio] = useState(false);
  const [step, setStep] = useState('upload'); // upload | settings | processing | done

  // Preview
  const [previewing, setPreviewing] = useState(false);

  const videoInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const videoElRef = useRef(null);
  const previewAudioRef = useRef(null);
  const canvasRef = useRef(null);

  /* ── Cleanup ── */
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Video handling ── */
  function handleVideoSelect(e) {
    const file = e.target.files?.[0];
    if (file) loadVideo(file);
    e.target.value = '';
  }

  function handleVideoDrop(e) {
    e.preventDefault();
    setDragOverVideo(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadVideo(file);
  }

  function loadVideo(file) {
    if (!file.type.startsWith('video/')) {
      setError('Please select a valid video file (MP4, WebM, MOV).');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Video too large. Maximum 500MB.');
      return;
    }
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(url);
    setVideoReady(false);
    setError('');
  }

  function handleVideoLoaded() {
    const vid = videoElRef.current;
    if (vid) {
      setVideoDuration(vid.duration);
      setVideoReady(true);
    }
  }

  /* ── Audio handling ── */
  function handleAudioSelect(e) {
    const file = e.target.files?.[0];
    if (file) loadAudio(file);
    e.target.value = '';
  }

  function handleAudioDrop(e) {
    e.preventDefault();
    setDragOverAudio(false);
    const file = e.dataTransfer.files?.[0];
    if (file) loadAudio(file);
  }

  function loadAudio(file) {
    if (!file.type.startsWith('audio/')) {
      setError('Please select a valid audio file (MP3, WAV, OGG, AAC).');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Audio too large. Maximum 500MB.');
      return;
    }
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    const url = URL.createObjectURL(file);
    setAudioFile(file);
    setAudioUrl(url);
    setAudioName(file.name);
    setError('');

    // Get duration
    const el = new Audio();
    el.src = url;
    el.addEventListener('loadedmetadata', () => setAudioDuration(el.duration));
  }

  function removeAudio() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioFile(null);
    setAudioUrl(null);
    setAudioName('');
    setAudioDuration(0);
  }

  /* ── Preview: play video muted with new song ── */
  function togglePreview() {
    const vid = videoElRef.current;
    if (!vid) return;

    if (previewing) {
      vid.pause();
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
      setPreviewing(false);
    } else {
      vid.currentTime = 0;
      vid.muted = originalVolume === 0;
      vid.volume = originalVolume / 100;
      vid.play();

      if (audioUrl) {
        const a = new Audio(audioUrl);
        a.volume = musicVolume / 100;
        a.play();
        previewAudioRef.current = a;

        // Sync: stop music when video ends
        vid.onended = () => {
          a.pause();
          setPreviewing(false);
        };
      } else {
        vid.onended = () => setPreviewing(false);
      }
      setPreviewing(true);
    }
  }

  /* ── Process: Merge video + new audio using Canvas + AudioContext + MediaRecorder ── */
  const handleProcess = useCallback(async () => {
    if (!videoUrl) return;
    if (!audioFile && originalVolume === 0) {
      setError('Please upload a song or keep some original audio volume.');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError('');
    setStep('processing');
    if (outputUrl) { URL.revokeObjectURL(outputUrl); setOutputUrl(null); }

    try {
      // Create render video element
      const renderVid = document.createElement('video');
      renderVid.src = videoUrl;
      renderVid.playsInline = true;
      await new Promise((res, rej) => {
        renderVid.onloadeddata = res;
        renderVid.onerror = rej;
        renderVid.load();
      });

      const W = renderVid.videoWidth || 1280;
      const H = renderVid.videoHeight || 720;
      const duration = renderVid.duration;

      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');

      // Setup AudioContext for mixing
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const mixDest = audioCtx.createMediaStreamDestination();

      // Original video audio (if volume > 0)
      let vidSource;
      if (originalVolume > 0) {
        vidSource = audioCtx.createMediaElementSource(renderVid);
        const vidGain = audioCtx.createGain();
        vidGain.gain.value = originalVolume / 100;
        vidSource.connect(vidGain);
        vidGain.connect(mixDest);
      } else {
        renderVid.muted = true;
      }

      // New song audio
      let songSource, songBuffer;
      if (audioFile) {
        const arrBuf = await audioFile.arrayBuffer();
        songBuffer = await audioCtx.decodeAudioData(arrBuf);
        songSource = audioCtx.createBufferSource();
        songSource.buffer = songBuffer;

        // If song is shorter than video, loop it
        if (songBuffer.duration < duration) {
          songSource.loop = true;
        }

        const songGain = audioCtx.createGain();
        songGain.gain.value = musicVolume / 100;
        songSource.connect(songGain);
        songGain.connect(mixDest);
      }

      // MediaRecorder
      const videoStream = canvas.captureStream(30);
      mixDest.stream.getAudioTracks().forEach(t => videoStream.addTrack(t));

      let mimeType = 'video/webm;codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm;codecs=vp8,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm';

      const recorder = new MediaRecorder(videoStream, {
        mimeType,
        videoBitsPerSecond: 5_000_000,
      });
      const chunks = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
      const recDone = new Promise(resolve => { recorder.onstop = resolve; });

      // Start everything
      recorder.start(100);
      renderVid.currentTime = 0;
      if (songSource) songSource.start(0);
      renderVid.play();

      // Draw frames + track progress
      await new Promise(resolve => {
        function draw() {
          if (renderVid.ended || renderVid.currentTime >= duration) {
            renderVid.pause();
            resolve();
            return;
          }
          ctx.drawImage(renderVid, 0, 0, W, H);
          setProgress(Math.min(99, Math.round((renderVid.currentTime / duration) * 100)));
          requestAnimationFrame(draw);
        }
        draw();
      });

      setProgress(100);
      recorder.stop();
      if (songSource) { try { songSource.stop(); } catch {} }
      try { audioCtx.close(); } catch {}
      await recDone;

      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setOutputUrl(url);
      setStep('done');
    } catch (err) {
      console.error('Processing failed:', err);
      setError('Failed to process video. Try a different format or shorter video.');
      setStep('settings');
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  }, [videoUrl, audioFile, musicVolume, originalVolume, outputUrl]);

  /* ── Download ── */
  function handleDownload() {
    if (!outputUrl) return;
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = `video-with-music-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function handleReset() {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl(null);
    setStep('settings');
  }

  function handleFullReset() {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setVideoFile(null); setVideoUrl(null); setVideoDuration(0); setVideoReady(false);
    setAudioFile(null); setAudioUrl(null); setAudioDuration(0); setAudioName('');
    setOutputUrl(null);
    setMusicVolume(100); setOriginalVolume(0);
    setError(''); setStep('upload');
  }

  const canProceed = videoFile && audioFile;

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <div className="vas-screen">
      <button className="vas-back" onClick={onBack}>← Back</button>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* ── HEADER ── */}
      <div className="vas-header">
        <h2>🎶 Video Audio Replacer</h2>
        <p>Remove original sound from a video and replace it with your favourite song</p>
      </div>

      {/* ── STEPS ── */}
      <div className="vas-steps">
        <div className={`vas-step-dot ${step === 'upload' ? 'active' : step !== 'upload' ? 'done' : ''}`}>
          <span>1</span> Upload
        </div>
        <div className="vas-step-line" />
        <div className={`vas-step-dot ${step === 'settings' ? 'active' : (step === 'processing' || step === 'done') ? 'done' : ''}`}>
          <span>2</span> Mix
        </div>
        <div className="vas-step-line" />
        <div className={`vas-step-dot ${step === 'done' ? 'active' : ''}`}>
          <span>3</span> Download
        </div>
      </div>

      {/* ════════════ STEP 1: UPLOAD ════════════ */}
      {step === 'upload' && (
        <div className="vas-section">
          {/* Video upload */}
          <div className="vas-upload-group">
            <h3>🎥 Upload Video</h3>
            {!videoFile ? (
              <div
                className={`vas-drop-zone ${dragOverVideo ? 'drag-over' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOverVideo(true); }}
                onDragLeave={() => setDragOverVideo(false)}
                onDrop={handleVideoDrop}
                onClick={() => videoInputRef.current?.click()}
              >
                <div className="vas-drop-icon">🎥</div>
                <p>Drag &amp; drop video here or <strong>click to browse</strong></p>
                <small>MP4, WebM, MOV — max 500MB</small>
              </div>
            ) : (
              <div className="vas-file-card">
                <video
                  ref={videoElRef}
                  src={videoUrl}
                  onLoadedMetadata={handleVideoLoaded}
                  playsInline
                  muted
                  className="vas-mini-video"
                />
                <div className="vas-file-info">
                  <p className="vas-file-name">{videoFile.name}</p>
                  <div className="vas-file-meta">
                    <span>📁 {formatSize(videoFile.size)}</span>
                    {videoDuration > 0 && <span>⏱️ {formatTime(videoDuration)}</span>}
                  </div>
                </div>
                <button className="vas-file-change" onClick={() => videoInputRef.current?.click()}>Change</button>
              </div>
            )}
            <input ref={videoInputRef} type="file" accept={ACCEPTED_VIDEO} style={{ display: 'none' }} onChange={handleVideoSelect} />
          </div>

          {/* Audio upload */}
          <div className="vas-upload-group">
            <h3>🎵 Upload Song / Audio</h3>
            {!audioFile ? (
              <div
                className={`vas-drop-zone vas-drop-audio ${dragOverAudio ? 'drag-over' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragOverAudio(true); }}
                onDragLeave={() => setDragOverAudio(false)}
                onDrop={handleAudioDrop}
                onClick={() => audioInputRef.current?.click()}
              >
                <div className="vas-drop-icon">🎶</div>
                <p>Drag &amp; drop audio here or <strong>click to browse</strong></p>
                <small>MP3, WAV, OGG, AAC</small>
              </div>
            ) : (
              <div className="vas-audio-card">
                <span className="vas-audio-icon">🎵</span>
                <div className="vas-audio-details">
                  <p className="vas-audio-name">{audioName}</p>
                  {audioDuration > 0 && <small>⏱️ {formatTime(audioDuration)}</small>}
                  {audioDuration > 0 && videoDuration > 0 && audioDuration < videoDuration && (
                    <small className="vas-loop-note">🔁 Song will loop to match video length</small>
                  )}
                </div>
                <button className="vas-audio-remove" onClick={removeAudio}>✕</button>
              </div>
            )}
            <input ref={audioInputRef} type="file" accept={ACCEPTED_AUDIO} style={{ display: 'none' }} onChange={handleAudioSelect} />
          </div>

          {error && <p className="vas-error">⚠️ {error}</p>}

          <button
            className="vas-btn-primary"
            disabled={!canProceed}
            onClick={() => { setError(''); setStep('settings'); }}
          >
            Continue to Mix Settings →
          </button>
        </div>
      )}

      {/* ════════════ STEP 2: SETTINGS ════════════ */}
      {step === 'settings' && (
        <div className="vas-section">
          {/* Video preview */}
          <div className="vas-preview-wrap">
            <video
              ref={videoElRef}
              src={videoUrl}
              onLoadedMetadata={handleVideoLoaded}
              playsInline
              muted
              className="vas-preview-video"
            />
            <button className="vas-preview-btn" onClick={togglePreview}>
              {previewing ? '⏸️ Stop Preview' : '▶️ Preview with New Song'}
            </button>
          </div>

          {/* Volume controls */}
          <div className="vas-mix-controls">
            <div className="vas-mix-card">
              <div className="vas-mix-label">
                <span>🔇</span> Original Video Audio
              </div>
              <div className="vas-range-row">
                <input
                  type="range"
                  min={0} max={100} step={1}
                  value={originalVolume}
                  onChange={e => setOriginalVolume(+e.target.value)}
                />
                <span className="vas-range-value">{originalVolume}%</span>
              </div>
              <small className="vas-mix-hint">
                {originalVolume === 0 ? '🔇 Original sound completely removed' : `🔊 Keeping ${originalVolume}% of original sound`}
              </small>
            </div>

            <div className="vas-mix-card">
              <div className="vas-mix-label">
                <span>🎵</span> New Song Volume
              </div>
              <div className="vas-range-row">
                <input
                  type="range"
                  min={0} max={100} step={1}
                  value={musicVolume}
                  onChange={e => setMusicVolume(+e.target.value)}
                />
                <span className="vas-range-value">{musicVolume}%</span>
              </div>
              <small className="vas-mix-hint">🎶 {audioName}</small>
            </div>
          </div>

          {/* Summary */}
          <div className="vas-summary">
            <div className="vas-summary-item"><span>🎥</span> {videoFile?.name}</div>
            <div className="vas-summary-item"><span>⏱️</span> {formatTime(videoDuration)}</div>
            <div className="vas-summary-item"><span>🎵</span> {audioName}</div>
            <div className="vas-summary-item"><span>🔇</span> Original: {originalVolume}%</div>
            <div className="vas-summary-item"><span>🔊</span> Song: {musicVolume}%</div>
          </div>

          {error && <p className="vas-error">⚠️ {error}</p>}

          <div className="vas-btn-row">
            <button className="vas-btn-secondary" onClick={() => setStep('upload')}>← Back</button>
            <button className="vas-btn-primary" onClick={handleProcess} disabled={processing}>
              🎬 Replace Audio & Export
            </button>
          </div>
        </div>
      )}

      {/* ════════════ STEP 2.5: PROCESSING ════════════ */}
      {step === 'processing' && (
        <div className="vas-section">
          <div className="vas-processing-card">
            <div className="vas-spin-icon">🎬</div>
            <h3>Processing video…</h3>
            <p>Replacing audio and encoding. Please wait.</p>
            <div className="vas-progress-bar">
              <div className="vas-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="vas-progress-text">{progress}%</span>
          </div>
        </div>
      )}

      {/* ════════════ STEP 3: DONE ════════════ */}
      {step === 'done' && outputUrl && (
        <div className="vas-section">
          <div className="vas-done-badge">✅ Video Ready with New Audio!</div>

          <div className="vas-output-wrap">
            <video src={outputUrl} controls autoPlay playsInline className="vas-output-video" />
          </div>

          <div className="vas-summary">
            <div className="vas-summary-item"><span>🎥</span> {videoFile?.name}</div>
            <div className="vas-summary-item"><span>🎵</span> {audioName}</div>
            <div className="vas-summary-item"><span>🔇</span> Original: {originalVolume}%</div>
            <div className="vas-summary-item"><span>🔊</span> Song: {musicVolume}%</div>
          </div>

          <div className="vas-btn-row">
            <button className="vas-btn-secondary" onClick={handleReset}>🔄 Adjust & Re-export</button>
            <button className="vas-btn-secondary" onClick={handleFullReset}>📁 Start Over</button>
            <button className="vas-btn-primary" onClick={handleDownload}>⬇️ Download Video</button>
          </div>
        </div>
      )}
    </div>
  );
}
