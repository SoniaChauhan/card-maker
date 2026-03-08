'use client';
import { useState, useMemo, useEffect, useRef, useCallback, memo } from 'react';
import { TEMPLATES, getTemplateById, COLOR_PRESETS } from './ResumeTemplates';
import { sendOTP, verifyOTP } from '../../services/paymentService';
import Particles from '../shared/Particles';
import StepResumeForm from './StepResumeForm';

const PARTICLES = ['📄', '✨', '💼', '🎓', '⭐', '💎', '🖊️', '💡'];

/* ── Sample data for template thumbnails ── */
const SAMPLE = {
  fullName: 'Priya Sharma',
  jobTitle: 'Senior Software Engineer',
  email: 'priya.sharma@example.com',
  phone: '+91 98765 43210',
  location: 'Bangalore, India 560001',
  linkedin: 'linkedin.com/in/priyasharma',
  summary: 'Dynamic Senior Software Engineer with extensive experience specializing in Angular and React.js. Proven track record in developing robust applications and enhancing team collaboration. Adept at integrating complex APIs and optimizing performance, while ensuring client requirements are met through innovative solutions and effective communication.',
  experience: [
    { title: 'Senior Software Engineer', company: 'Wipro Technologies', from: '12/2022', to: 'Current', location: 'Greater Noida, India', desc: 'Developed and maintained front-end applications for Dealer Management System (DMS) using Angular.\nImplemented unit test cases using Jest for robust and reliable code.\nWorked on multiple dashboards including Windsurf Dashboard, Tooling Dashboard, KPI Dashboard, and Metrics Dashboard.\nIntegrated and managed tools like Codebeamer and Jama for requirement and project management.\nCollaborated on full-stack development using Angular, React.js, Node.js, .NET, and Python.\nUtilized tools such as pgAdmin, Docker, Git, and MongoDB for database management, containerization, version control, and data handling.' },
    { title: 'Software Engineer', company: 'Magic EdTech', from: '06/2021', to: '11/2022', location: 'Greater Noida, India', desc: 'Established efficient communication channels within the team, leading to better collaboration among members during project development phases.\nCoordinated with other engineers to evaluate and improve software and hardware interfaces.\nTested methodology with writing and execution of test plans, debugging and testing scripts and tools.\nFocused on Accessibility compliance for web applications.\nDeveloped features using React.js, Angular, Redux, and TypeScript.' },
    { title: 'Software Engineer', company: 'Hocalwire', from: '02/2021', to: '05/2021', location: 'Noida, India', desc: 'Debug and troubleshoot template-related issues.\nParticipate in code reviews and contribute to best practices for templating and front-end development.\nDevelop and maintain Jade/Pug templates for rendering dynamic HTML content.\nCollaborate with designers and back-end developers to implement responsive and user-friendly interfaces.\nOptimize templates for performance and scalability.' },
    { title: 'Software Engineer', company: 'Enco Engineer Combine Pvt Ltd', from: '11/2019', to: '01/2021', location: 'Gurgaon, India', desc: 'Develop and maintain ERP web applications for multiple business modules (HR, Finance, Sales, Marketing).\nDesign and implement dynamic and responsive forms using Angular.\nIntegrate RESTful APIs and third-party services into ERP systems.\nCollaborate with cross-functional teams to gather requirements and deliver scalable solutions.\nOptimize application performance and ensure security compliance.\nTroubleshoot and resolve technical issues across ERP modules.\nParticipate in code reviews and maintain best practices in software development.' },
    { title: 'Software Engineer', company: 'Educo Internation Pvt Ltd', from: '09/2018', to: '08/2019', location: 'New Delhi, India', desc: 'Developed and maintained interactive web applications using HTML, JavaScript, jQuery, and SVG for dynamic and responsive user interfaces.\nImplemented mathematical and logical algorithms to solve complex problems and enhance application functionality.\nDesigned and integrated social science-based animations to create engaging and educational user experiences.\nOptimized front-end performance and ensured cross-browser compatibility for seamless user interaction.\nCollaborated with teams to deliver data-driven visualizations and interactive content for diverse domains.' },
  ],
  education: [
    { degree: 'Bachelor of Technology: Computer Science', institution: 'Guru Govind Singh Indraprastha University', year: '07/2018', location: 'New Delhi, India' },
  ],
  skills: 'React.js, Angular, Node.js, Python, .NET, Jest, Docker, Git, MongoDB, pgAdmin, Client Requirements',
  languages: 'Hindi: Native speaker, English: Professional',
  interests: 'Full-stack Development, Open Source Contributions, Tech Community',
  photo: null,
  photoPreview: '',
};

/* ── Filter options ── */
const HEADSHOT_OPTIONS = [
  { label: 'With photo', value: true },
  { label: 'Without photo', value: false },
];
const COLUMNS_OPTIONS = [
  { label: '1 Column', value: 1 },
  { label: '2 Columns', value: 2 },
];
const STYLE_OPTIONS = [
  { label: 'Traditional', value: 'traditional' },
  { label: 'Creative', value: 'creative' },
  { label: 'Contemporary', value: 'contemporary' },
];

/* Memoized template thumbnail — never re-renders on userData changes */
const TemplateThumbnail = memo(function TemplateThumbnail({ tpl, onSelect, onPreview }) {
  return (
    <div className="ts-template-card" onClick={() => onSelect(tpl.id)}>
      <div className="ts-preview-wrap">
        <div className="ts-preview-scaler">
          <tpl.Component data={SAMPLE} />
        </div>
      </div>
      <div className="ts-btn-row">
        <button className="ts-choose-btn" onClick={(e) => { e.stopPropagation(); onSelect(tpl.id); }}>
          Choose
        </button>
        <button className="ts-preview-btn" onClick={(e) => { e.stopPropagation(); onPreview(tpl); }}>
          👁️
        </button>
      </div>
    </div>
  );
});

export default function TemplateSelector({
  onSelect, onBuildResume, buildMode, onBack, onUploadResume, userData,
  importDone, selectedTemplate, accentColor, onAccentChange,
  onChange, onGenerate, errors, onEmailVerified,
  autoLoaded, autoLoading, userEmail
}) {
  const [filters, setFilters] = useState({ headshot: null, columns: null, style: null });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [fullPreview, setFullPreview] = useState(false);
  const [uploadEmail, setUploadEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [activeFormStep, setActiveFormStep] = useState(1);
  const [previewTpl, setPreviewTpl] = useState(null);
  const [previewColor, setPreviewColor] = useState('');
  const previewRef = useRef(null);

  /* ── Step-to-section highlight mapping ── */
  const STEP_SECTION_MAP = {
    1: /^(contact|name|personal|phone|email|location|profile)$/i,
    2: /^(experience|work|employment)$/i,
    3: /^(education|training|academic)$/i,
    4: /^(skills|languages|technical|competenc)$/i,
    5: /^(summary|objective|interests|hobbies)$/i,
  };

  /* Highlight the matching section in the live preview */
  useEffect(() => {
    const container = previewRef.current;
    if (!container) return;

    // Clear previous highlights
    container.querySelectorAll('.rt-hl-active').forEach(el => {
      el.classList.remove('rt-hl-active');
    });

    if (activeFormStep >= 6) return; // Finalize = no highlight

    const pattern = STEP_SECTION_MAP[activeFormStep];
    if (!pattern) return;

    if (activeFormStep === 1) {
      // For step 1 (personal info), highlight header area before first rt-sh
      const rt = container.querySelector('.rt');
      if (rt) {
        const allChildren = Array.from(rt.children);
        let firstHeadingFound = false;
        for (const child of allChildren) {
          // Stop at first section heading
          if (child.querySelector('.rt-sh') || child.classList.contains('rt-sh')) {
            firstHeadingFound = true;
          }
          // Also check by section heading text
          const headings = child.querySelectorAll('.rt-sh');
          if (headings.length > 0) firstHeadingFound = true;

          if (!firstHeadingFound) {
            child.classList.add('rt-hl-active');
          }
        }
        // Also highlight h1 (the name)
        const h1 = rt.querySelector('h1');
        if (h1) h1.classList.add('rt-hl-active');
      }
    } else {
      // For steps 2-5, find matching section headings and highlight them + their content
      const headings = container.querySelectorAll('.rt-sh');
      headings.forEach(h => {
        const text = h.textContent.trim().replace(/[^a-zA-Z\s]/g, '').trim();
        const words = text.split(/\s+/);
        const matches = words.some(w => pattern.test(w));
        if (matches) {
          h.classList.add('rt-hl-active');
          // Highlight siblings until the next rt-sh
          let sibling = h.nextElementSibling;
          while (sibling && !sibling.classList.contains('rt-sh')) {
            sibling.classList.add('rt-hl-active');
            sibling = sibling.nextElementSibling;
          }
        }
      });
    }

    // Auto-scroll to first highlighted element
    const firstHL = container.querySelector('.rt-hl-active');
    if (firstHL) {
      firstHL.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeFormStep, userData, selectedTemplate]);

  const handleStepChange = useCallback((step) => setActiveFormStep(step), []);
  const handlePreviewTpl = useCallback((tpl) => { setPreviewTpl(tpl); setPreviewColor(''); }, []);

  useEffect(() => {
    if (otpCountdown <= 0) return;
    const timer = setTimeout(() => setOtpCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  // Auto-show editor panel once import completes
  useEffect(() => {
    if (importDone || buildMode) { setShowEditor(true); setShowUpload(false); }
    if (buildMode) { setShowPreview(false); }
  }, [importDone, buildMode]);

  const toggleFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: prev[key] === value ? null : value }));
  };

  const clearFilters = () => setFilters({ headshot: null, columns: null, style: null });

  const hasActiveFilters = filters.headshot !== null || filters.columns !== null || filters.style !== null;

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* Open the email/OTP popup when clicking Import */
  function handleImportClick() {
    if (importDone) {
      // Already imported — just toggle the right-side editor panel
      setShowEditor(prev => !prev);
      setShowUpload(false);
    } else if (otpVerified) {
      // Verified but not yet imported — toggle upload panel
      setShowUpload(prev => !prev);
    } else {
      setShowOtpModal(true);
    }
  }

  function handleSendOtpClick() {
    const trimmed = uploadEmail.trim();
    if (!trimmed) { setEmailError('Please enter your email address.'); return; }
    if (!isValidEmail(trimmed)) { setEmailError('Please enter a valid email address.'); return; }
    setEmailError('');
    handleSendOtp(trimmed);
  }

  async function handleSendOtp(email) {
    const target = email || uploadEmail.trim();
    setOtpLoading(true);
    setOtpError('');
    try {
      const res = await sendOTP('email', target);
      if (res.ok) { setOtpSent(true); setOtpCountdown(30); }
      else { setEmailError(res.message || 'Failed to send OTP'); }
    } catch (err) { setEmailError(err.message || 'Failed to send OTP. Try again.'); }
    setOtpLoading(false);
  }

  async function handleVerifyOtp() {
    if (!otpValue || otpValue.length < 4) { setOtpError('Enter the OTP sent to your email'); return; }
    setOtpLoading(true);
    setOtpError('');
    try {
      const res = await verifyOTP('email', uploadEmail.trim(), otpValue);
      if (res.verified) {
        setOtpVerified(true);
        setShowOtpModal(false);   // close the popup
        // Notify parent to check for existing resume data
        if (onEmailVerified) {
          const hasExisting = await onEmailVerified(uploadEmail.trim());
          if (!hasExisting) {
            setShowUpload(true);  // no existing data — show upload panel
          }
        } else {
          setShowUpload(true);
        }
      }
      else { setOtpError(res.error || 'Invalid OTP. Please try again.'); }
    } catch (err) { setOtpError(err.message || 'Verification failed. Try again.'); }
    setOtpLoading(false);
  }

  function closeOtpModal() {
    setShowOtpModal(false);
  }

  const filtered = useMemo(() => {
    return TEMPLATES.filter(t => {
      if (filters.headshot !== null && t.hasPhoto !== filters.headshot) return false;
      if (filters.columns !== null && t.columns !== filters.columns) return false;
      if (filters.style !== null && t.style !== filters.style) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="template-selector-screen">
      <Particles icons={PARTICLES} count={20} />

      <button className="ts-back-btn" onClick={onBack}>🏠 Home</button>

      <div className="ts-header">
        <h1>PROFESSIONAL RESUME TEMPLATES</h1>
        <p>Choose from 15+ tailored-built templates that have landed thousands of people like you the jobs they were dreaming of.</p>
      </div>

      {/* Hero Action Buttons */}
      <div className="ts-hero-actions">
        {autoLoading ? (
          <span className="ts-hero-btn ts-hero-import" style={{ opacity: 0.7, cursor: 'default' }}>
            ⏳ Loading your saved resume…
          </span>
        ) : (
          <button className={`ts-hero-btn ts-hero-import${(showUpload || showEditor) ? ' active' : ''}`} onClick={handleImportClick}>
            {importDone
              ? (showEditor ? 'Hide editor' : '✏️ Open editor')
              : otpVerified
                ? (showUpload ? 'Hide upload' : 'Upload resume')
                : 'Import existing resume'}
          </button>
        )}
        <button className={`ts-hero-btn ts-hero-build${buildMode ? ' active' : ''}`} onClick={() => { if (filtered.length) onBuildResume(filtered[0].id); }}>
          Build my resume
        </button>
      </div>

      {/* ── Horizontal Filters ── */}
      <div className="ts-filters-bar">
        <div className="ts-filters-bar-inner">
          <span className="ts-filters-bar-label">🔍 Filters</span>
          {HEADSHOT_OPTIONS.map(opt => (
            <button key={String(opt.value)} type="button" className={`ts-hfilter-chip${filters.headshot === opt.value ? ' active' : ''}`} onClick={() => toggleFilter('headshot', opt.value)}>
              {opt.label}
            </button>
          ))}
          <span className="ts-filters-bar-sep" />
          {COLUMNS_OPTIONS.map(opt => (
            <button key={opt.value} type="button" className={`ts-hfilter-chip${filters.columns === opt.value ? ' active' : ''}`} onClick={() => toggleFilter('columns', opt.value)}>
              {opt.label}
            </button>
          ))}
          <span className="ts-filters-bar-sep" />
          {STYLE_OPTIONS.map(opt => (
            <button key={opt.value} type="button" className={`ts-hfilter-chip${filters.style === opt.value ? ' active' : ''}`} onClick={() => toggleFilter('style', opt.value)}>
              {opt.label}
            </button>
          ))}
          {hasActiveFilters && <button className="ts-clear-btn ts-hclear" onClick={clearFilters}>✕ Clear</button>}
        </div>
      </div>

      {/* ── Main: Templates + Upload Panel ── */}
      <div className="ts-split-layout">
        <div className="ts-templates-col">
          {filtered.length === 0 && (
            <div className="ts-no-results">
              <p>No templates match your filters.</p>
              <button className="ts-clear-btn" onClick={clearFilters}>Clear filters</button>
            </div>
          )}
          <div className="ts-grid-compact">
            {filtered.map(tpl => (
              <TemplateThumbnail
                key={tpl.id}
                tpl={tpl}
                onSelect={onSelect}
                onPreview={handlePreviewTpl}
              />
            ))}
          </div>
        </div>

        {/* Right: Upload Panel (only after OTP verified, before import, and NOT auto-loaded) */}
        {showUpload && otpVerified && !importDone && !autoLoaded && (
          <div className="ts-upload-col">
            <div className="ts-upload-card">
              <div className="ts-upload-icon">📥</div>
              <h3 className="ts-upload-title">Upload Your Resume</h3>
              <p className="ts-upload-desc">
                Upload a PDF or Word file — we&apos;ll extract your details and fill the form automatically!
              </p>
              <p className="ts-upload-verified-badge">✅ Verified: {uploadEmail}</p>
              <button className="ts-upload-btn" onClick={() => onUploadResume(uploadEmail.trim())}>
                📄 Choose File &amp; Fill
              </button>
            </div>
          </div>
        )}

        {/* Right: Split Form (left) + Preview (right) side by side after import or build */}
        {(importDone || buildMode) && showEditor && (() => {
          const tpl = getTemplateById(selectedTemplate);
          const TplComp = tpl.Component;
          return (
            <div className="ts-editor-col">
              {autoLoaded && userEmail && (
                <div className="ts-auto-loaded-badge">
                  ✅ Resume loaded for <strong>{userEmail}</strong>
                </div>
              )}

              {/* Full Preview (replaces form when active) */}
              {fullPreview ? (
                <div className="ts-fullpreview-inline">
                  <div className="ts-fullpreview-inline-header">
                    <span>📄 {tpl.name} — Full Preview</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="ts-editor-colors">
                        {COLOR_PRESETS.map(c => (
                          <button
                            key={c}
                            className={`cr-color-dot-sm${accentColor === c ? ' active' : ''}`}
                            style={{ background: c }}
                            onClick={() => onAccentChange(accentColor === c ? '' : c)}
                          />
                        ))}
                      </div>
                      <button className="ts-fullpreview-close" onClick={() => setFullPreview(false)}>✕ Close</button>
                    </div>
                  </div>
                  <div className="ts-fullpreview-inline-body">
                    <div style={accentColor ? { '--rt-accent': accentColor } : undefined}>
                      <TplComp data={userData} accentColor={accentColor} />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {showPreview && (
                    <div className="ts-editor-preview">
                      <div className="ts-editor-preview-header">
                        <span>📄 Live Preview — {tpl.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="ts-editor-colors">
                            {COLOR_PRESETS.map(c => (
                              <button
                                key={c}
                                className={`cr-color-dot-sm${accentColor === c ? ' active' : ''}`}
                                style={{ background: c }}
                                onClick={() => onAccentChange(accentColor === c ? '' : c)}
                              />
                            ))}
                          </div>
                          <button className="ts-fullpreview-btn" onClick={() => setFullPreview(true)}>🔍 Full Preview</button>
                        </div>
                      </div>
                      <div className="ts-editor-preview-body" ref={previewRef}>
                        <div style={accentColor ? { '--rt-accent': accentColor } : undefined}>
                          <TplComp data={userData} accentColor={accentColor} />
                        </div>
                      </div>
                    </div>
                  )}
              <div className="ts-editor-form">
                <div className="ts-editor-form-toolbar">
                  <span className="ts-editor-form-title">✏️ Edit Details</span>
                  <button
                    className={`ts-preview-toggle-btn${showPreview ? ' active' : ''}`}
                    onClick={() => setShowPreview(p => !p)}
                  >
                    👁️ {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </button>
                </div>
                <StepResumeForm
                  data={userData}
                  errors={errors}
                  onChange={onChange}
                  onGenerate={onGenerate}
                  onStepChange={handleStepChange}
                />
              </div>
                </>
              )}
            </div>
          );
        })()}
      </div>

      {/* ── Email / OTP Verification Popup ── */}
      {showOtpModal && (
        <div className="ts-otp-overlay" onClick={closeOtpModal}>
          <div className="ts-otp-modal" onClick={e => e.stopPropagation()}>
            <button className="ts-otp-modal-close" onClick={closeOtpModal}>✕</button>

            {!otpSent ? (
              /* ── Step 1: Email Input ── */
              <>
                <div className="ts-otp-modal-icon">📧</div>
                <h3 className="ts-otp-modal-title">Verify Your Email</h3>
                <p className="ts-otp-modal-desc">
                  Enter your email address. We&apos;ll send a one‑time password to verify your identity before uploading.
                </p>
                <div className="ts-otp-modal-field">
                  <input
                    type="email"
                    className={`ts-otp-modal-input${emailError ? ' ts-otp-modal-input--error' : ''}`}
                    placeholder="you@example.com"
                    value={uploadEmail}
                    onChange={e => { setUploadEmail(e.target.value); if (emailError) setEmailError(''); }}
                    autoFocus
                  />
                  {emailError && <span className="ts-otp-modal-error">{emailError}</span>}
                </div>
                <button className="ts-otp-modal-btn" onClick={handleSendOtpClick} disabled={otpLoading}>
                  {otpLoading ? '⏳ Sending…' : '📧 Send OTP'}
                </button>
              </>
            ) : (
              /* ── Step 2: OTP Input ── */
              <>
                <div className="ts-otp-modal-icon">🔐</div>
                <h3 className="ts-otp-modal-title">Enter OTP</h3>
                <p className="ts-otp-modal-desc">
                  We&apos;ve sent a verification code to <strong>{uploadEmail}</strong>. Enter it below.
                </p>
                <button
                  type="button"
                  className="ts-otp-modal-change-email"
                  onClick={() => { setOtpSent(false); setOtpValue(''); setOtpError(''); }}
                >
                  ✏️ Change email
                </button>
                <div className="ts-otp-modal-field">
                  <input
                    type="text"
                    className={`ts-otp-modal-input ts-otp-modal-input--otp${otpError ? ' ts-otp-modal-input--error' : ''}`}
                    placeholder="• • • • • •"
                    value={otpValue}
                    onChange={e => { setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6)); if (otpError) setOtpError(''); }}
                    maxLength={6}
                    autoFocus
                  />
                  {otpError && <span className="ts-otp-modal-error">{otpError}</span>}
                </div>
                <button className="ts-otp-modal-btn" onClick={handleVerifyOtp} disabled={otpLoading}>
                  {otpLoading ? '⏳ Verifying…' : '✅ Verify & Continue'}
                </button>
                <div className="ts-otp-modal-footer">
                  {otpCountdown > 0
                    ? <span className="ts-otp-modal-countdown">Resend in {otpCountdown}s</span>
                    : <button type="button" className="ts-otp-modal-resend" onClick={() => handleSendOtp()} disabled={otpLoading}>Resend OTP</button>}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Full-screen Template Preview Modal ── */}
      {previewTpl && (() => {
        const TplComp = previewTpl.Component;
        return (
          <div className="ts-modal-overlay" onClick={() => setPreviewTpl(null)}>
            <div className="ts-modal-content" onClick={e => e.stopPropagation()}>
              <div className="ts-modal-bar">
                <span>📄 {previewTpl.name}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="ts-modal-select" onClick={() => { onSelect(previewTpl.id); setPreviewTpl(null); }}>
                    ✅ Choose This
                  </button>
                  <button className="ts-modal-close" onClick={() => setPreviewTpl(null)}>✕ Close</button>
                </div>
              </div>
              <div className="ts-modal-colors">
                <span>Accent:</span>
                {COLOR_PRESETS.map(c => (
                  <button
                    key={c}
                    className={`ts-modal-color-dot${previewColor === c ? ' active' : ''}`}
                    style={{ background: c }}
                    onClick={() => setPreviewColor(previewColor === c ? '' : c)}
                  />
                ))}
              </div>
              <div style={previewColor ? { '--rt-accent': previewColor } : undefined}>
                <TplComp data={SAMPLE} accentColor={previewColor} />
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
