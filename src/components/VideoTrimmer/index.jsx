'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import './VideoTrimmer.css';

const ACCEPTED_VIDEO = 'video/mp4,video/webm,video/ogg,video/quicktime,video/x-matroska';
const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

function formatTime(sec) {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  const ms = Math.floor((sec % 1) * 10);
  return `${m}:${String(s).padStart(2, '0')}.${ms}`;
}

export default function VideoTrimmer({ onBack }) {
  /* ── State ── */
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoReady, setVideoReady] = useState(false);

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [trimming, setTrimming] = useState(false);
  const [progress, setProgress] = useState(0);
  const [trimmedUrl, setTrimmedUrl] = useState(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [step, setStep] = useState('upload'); // upload | trim | done

  // Timeline dragging
  const [dragging, setDragging] = useState(null); // 'start' | 'end' | null
  const timelineRef = useRef(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  /* ── Cleanup ── */
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (trimmedUrl) URL.revokeObjectURL(trimmedUrl);
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
    // cleanup previous
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (trimmedUrl) { URL.revokeObjectURL(trimmedUrl); setTrimmedUrl(null); }

    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(url);
    setVideoReady(false);
    setError('');
    setStartTime(0);
    setEndTime(0);
    setStep('trim');
  }

  function handleVideoLoaded() {
    const vid = videoRef.current;
    if (!vid) return;
    setVideoDuration(vid.duration);
    setEndTime(vid.duration);
    setVideoReady(true);
  }

  /* ── Playback controls ── */
  function togglePlay() {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.currentTime = startTime;
      vid.play();
      setIsPlaying(true);
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  }

  function handleTimeUpdate() {
    const vid = videoRef.current;
    if (!vid) return;
    setCurrentTime(vid.currentTime);
    // Stop at end trim point
    if (vid.currentTime >= endTime) {
      vid.pause();
      vid.currentTime = startTime;
      setIsPlaying(false);
    }
  }

  function handlePreviewStart() {
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = startTime;
    vid.play();
    setIsPlaying(true);
  }

  /* ── Timeline interaction ── */
  function getTimeFromPosition(clientX) {
    const rect = timelineRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return ratio * videoDuration;
  }

  function handleTimelineMouseDown(e, handle) {
    e.preventDefault();
    setDragging(handle);
  }

  const handleTimelineMouseMove = useCallback((e) => {
    if (!dragging) return;
    const t = getTimeFromPosition(e.clientX || e.touches?.[0]?.clientX);
    if (dragging === 'start') {
      setStartTime(Math.min(t, endTime - 0.5));
    } else if (dragging === 'end') {
      setEndTime(Math.max(t, startTime + 0.5));
    }
  }, [dragging, startTime, endTime, videoDuration]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTimelineMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleTimelineMouseMove);
      window.addEventListener('mouseup', handleTimelineMouseUp);
      window.addEventListener('touchmove', handleTimelineMouseMove);
      window.addEventListener('touchend', handleTimelineMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleTimelineMouseMove);
        window.removeEventListener('mouseup', handleTimelineMouseUp);
        window.removeEventListener('touchmove', handleTimelineMouseMove);
        window.removeEventListener('touchend', handleTimelineMouseUp);
      };
    }
  }, [dragging, handleTimelineMouseMove, handleTimelineMouseUp]);

  /* ── Trim video using Canvas + MediaRecorder ── */
  const handleTrim = useCallback(async () => {
    if (!videoRef.current || !videoReady) return;
    if (endTime - startTime < 0.5) {
      setError('Clip must be at least 0.5 seconds long.');
      return;
    }

    setTrimming(true);
    setProgress(0);
    setError('');
    if (trimmedUrl) { URL.revokeObjectURL(trimmedUrl); setTrimmedUrl(null); }

    try {
      const srcVideo = videoRef.current;
      srcVideo.pause();

      // Create offscreen video element for rendering
      const renderVid = document.createElement('video');
      renderVid.src = videoUrl;
      renderVid.muted = false;
      renderVid.playsInline = true;
      await new Promise((resolve, reject) => {
        renderVid.onloadeddata = resolve;
        renderVid.onerror = reject;
        renderVid.load();
      });

      const W = renderVid.videoWidth || 1280;
      const H = renderVid.videoHeight || 720;
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');

      // Setup audio from the video
      let audioCtx, audioSource, audioDest;
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioSource = audioCtx.createMediaElementSource(renderVid);
        audioDest = audioCtx.createMediaStreamDestination();
        audioSource.connect(audioDest);
        audioSource.connect(audioCtx.destination); // so we can hear (optional)
      } catch {
        // Audio extraction may fail in some browsers
      }

      // MediaRecorder
      const videoStream = canvas.captureStream(30);
      if (audioDest) {
        audioDest.stream.getAudioTracks().forEach(t => videoStream.addTrack(t));
      }

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

      // Seek to start
      renderVid.currentTime = startTime;
      await new Promise(resolve => { renderVid.onseeked = resolve; });

      recorder.start(100);
      renderVid.play();

      const clipDuration = endTime - startTime;

      // Draw frames while video plays
      await new Promise((resolve) => {
        function drawFrame() {
          if (renderVid.currentTime >= endTime || renderVid.ended) {
            renderVid.pause();
            resolve();
            return;
          }
          ctx.drawImage(renderVid, 0, 0, W, H);
          const elapsed = renderVid.currentTime - startTime;
          setProgress(Math.round((elapsed / clipDuration) * 100));
          requestAnimationFrame(drawFrame);
        }
        drawFrame();
      });

      recorder.stop();
      if (audioCtx) { try { audioCtx.close(); } catch {} }
      await recDone;

      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setTrimmedUrl(url);
      setStep('done');
    } catch (err) {
      console.error('Trim failed:', err);
      setError('Failed to trim video. Try a different format or shorter clip.');
    } finally {
      setTrimming(false);
      setProgress(0);
    }
  }, [videoUrl, videoReady, startTime, endTime, trimmedUrl]);

  /* ── Download ── */
  function handleDownload() {
    if (!trimmedUrl) return;
    const a = document.createElement('a');
    a.href = trimmedUrl;
    a.download = `trimmed-clip-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function handleReset() {
    if (trimmedUrl) URL.revokeObjectURL(trimmedUrl);
    setTrimmedUrl(null);
    setStep('trim');
    setStartTime(0);
    setEndTime(videoDuration);
  }

  function handleNewVideo() {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (trimmedUrl) URL.revokeObjectURL(trimmedUrl);
    setVideoFile(null);
    setVideoUrl(null);
    setTrimmedUrl(null);
    setVideoDuration(0);
    setVideoReady(false);
    setStep('upload');
    setStartTime(0);
    setEndTime(0);
    setError('');
  }

  const clipDuration = endTime - startTime;

  /* ═══════════════ RENDER ═══════════════ */
  return (
    <div className="vt-screen">
      <button className="vt-back" onClick={onBack}>← Back</button>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* ── HEADER ── */}
      <div className="vt-header">
        <h2>✂️ Video Trimmer</h2>
        <p>Upload a video, select the portion you want, and download your trimmed clip</p>
      </div>

      {/* ── STEPS ── */}
      <div className="vt-steps">
        <div className={`vt-step-dot ${step === 'upload' ? 'active' : step !== 'upload' ? 'done' : ''}`}>
          <span>1</span> Upload
        </div>
        <div className="vt-step-line" />
        <div className={`vt-step-dot ${step === 'trim' ? 'active' : step === 'done' ? 'done' : ''}`}>
          <span>2</span> Trim
        </div>
        <div className="vt-step-line" />
        <div className={`vt-step-dot ${step === 'done' ? 'active' : ''}`}>
          <span>3</span> Download
        </div>
      </div>

      {/* ════════════ STEP 1: UPLOAD ════════════ */}
      {step === 'upload' && (
        <div className="vt-section">
          <div
            className={`vt-drop-zone ${dragOver ? 'drag-over' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="vt-drop-icon">🎥</div>
            <p>Drag &amp; drop a video here or <strong>click to browse</strong></p>
            <small>MP4, WebM, MOV — max 500MB</small>
          </div>
          <input ref={fileInputRef} type="file" accept={ACCEPTED_VIDEO} style={{ display: 'none' }} onChange={handleFileSelect} />
          {error && <p className="vt-error">⚠️ {error}</p>}
        </div>
      )}

      {/* ════════════ STEP 2: TRIM ════════════ */}
      {step === 'trim' && videoUrl && (
        <div className="vt-section">
          {/* Video preview */}
          <div className="vt-video-wrap">
            <video
              ref={videoRef}
              src={videoUrl}
              onLoadedMetadata={handleVideoLoaded}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              playsInline
              className="vt-video-player"
            />
          </div>

          {/* Playback controls */}
          <div className="vt-controls">
            <button className="vt-ctrl-btn" onClick={togglePlay} disabled={!videoReady}>
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            <button className="vt-ctrl-btn" onClick={handlePreviewStart} disabled={!videoReady} title="Preview trimmed clip">
              🔄 Preview Clip
            </button>
            <span className="vt-time-display">
              {formatTime(currentTime)} / {formatTime(videoDuration)}
            </span>
          </div>

          {/* Timeline with range selector */}
          {videoReady && (
            <div className="vt-timeline-section">
              <div className="vt-trim-info">
                <div className="vt-trim-badge">
                  <span>✂️ Start:</span> <strong>{formatTime(startTime)}</strong>
                </div>
                <div className="vt-trim-badge">
                  <span>🏁 End:</span> <strong>{formatTime(endTime)}</strong>
                </div>
                <div className="vt-trim-badge vt-clip-len">
                  <span>📏 Clip:</span> <strong>{formatTime(clipDuration)}</strong>
                </div>
              </div>

              {/* Visual timeline bar */}
              <div className="vt-timeline" ref={timelineRef}>
                {/* Selected region highlight */}
                <div
                  className="vt-timeline-selected"
                  style={{
                    left: `${(startTime / videoDuration) * 100}%`,
                    width: `${((endTime - startTime) / videoDuration) * 100}%`,
                  }}
                />
                {/* Playhead */}
                <div
                  className="vt-playhead"
                  style={{ left: `${(currentTime / videoDuration) * 100}%` }}
                />
                {/* Start handle */}
                <div
                  className="vt-handle vt-handle-start"
                  style={{ left: `${(startTime / videoDuration) * 100}%` }}
                  onMouseDown={e => handleTimelineMouseDown(e, 'start')}
                  onTouchStart={e => handleTimelineMouseDown(e, 'start')}
                >
                  <div className="vt-handle-grip">◀</div>
                </div>
                {/* End handle */}
                <div
                  className="vt-handle vt-handle-end"
                  style={{ left: `${(endTime / videoDuration) * 100}%` }}
                  onMouseDown={e => handleTimelineMouseDown(e, 'end')}
                  onTouchStart={e => handleTimelineMouseDown(e, 'end')}
                >
                  <div className="vt-handle-grip">▶</div>
                </div>
              </div>

              {/* Manual time inputs */}
              <div className="vt-manual-inputs">
                <label>
                  Start (sec)
                  <input
                    type="number"
                    min={0}
                    max={endTime - 0.5}
                    step={0.1}
                    value={Number(startTime.toFixed(1))}
                    onChange={e => setStartTime(Math.max(0, Math.min(+e.target.value, endTime - 0.5)))}
                  />
                </label>
                <label>
                  End (sec)
                  <input
                    type="number"
                    min={startTime + 0.5}
                    max={videoDuration}
                    step={0.1}
                    value={Number(endTime.toFixed(1))}
                    onChange={e => setEndTime(Math.max(startTime + 0.5, Math.min(+e.target.value, videoDuration)))}
                  />
                </label>
              </div>
            </div>
          )}

          {error && <p className="vt-error">⚠️ {error}</p>}

          <div className="vt-btn-row">
            <button className="vt-btn-secondary" onClick={handleNewVideo}>📁 Choose Different Video</button>
            <button className="vt-btn-primary" onClick={handleTrim} disabled={trimming || !videoReady}>
              {trimming ? `✂️ Trimming… ${progress}%` : '✂️ Trim & Export Clip'}
            </button>
          </div>

          {trimming && (
            <div className="vt-progress-bar">
              <div className="vt-progress-fill" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      )}

      {/* ════════════ STEP 3: DONE ════════════ */}
      {step === 'done' && trimmedUrl && (
        <div className="vt-section">
          <div className="vt-done-badge">✅ Clip Ready!</div>

          <div className="vt-video-wrap">
            <video src={trimmedUrl} controls autoPlay playsInline className="vt-video-player" />
          </div>

          <div className="vt-clip-summary">
            <div className="vt-summary-item"><span>✂️</span> {formatTime(startTime)} → {formatTime(endTime)}</div>
            <div className="vt-summary-item"><span>📏</span> {formatTime(clipDuration)} clip</div>
            <div className="vt-summary-item"><span>📁</span> WebM format</div>
          </div>

          <div className="vt-btn-row">
            <button className="vt-btn-secondary" onClick={handleReset}>✂️ Trim Again</button>
            <button className="vt-btn-secondary" onClick={handleNewVideo}>📁 New Video</button>
            <button className="vt-btn-primary" onClick={handleDownload}>⬇️ Download Clip</button>
          </div>
        </div>
      )}
    </div>
  );
}
