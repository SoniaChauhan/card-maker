'use client';
import { useState, useEffect, useRef } from 'react';
import './CardResume.css';
import TemplateSelector from './TemplateSelector';
import CardResumeForm from './CardResumeForm';
import StepResumeForm from './StepResumeForm';
import { getTemplateById, COLOR_PRESETS, TEMPLATES } from './ResumeTemplates';
import { parseResumeFile } from './resumeParser';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import BiodataPaymentPopup from '../BiodataCard/BiodataPaymentPopup';
import '../BiodataCard/BiodataCard.css';
import usePdfDownload from '../../hooks/usePdfDownload';
import { toFilename } from '../../utils/helpers';
import { saveTemplate, updateTemplate, getUserTemplates } from '../../services/templateService';
import { logDownload } from '../../services/downloadHistoryService';
import { hasUserPaid } from '../../services/paymentService';

const CARD_TYPE = 'cardresume';
const CARD_LABEL = 'Card Resume Maker';

/**
 * Check if an object has at least one non-empty string value.
 */
function hasContent(obj) {
  if (!obj || typeof obj !== 'object') return false;
  return Object.values(obj).some(v => typeof v === 'string' && v.trim() !== '');
}

/**
 * Merge source into target, but skip empty/missing values in source.
 * This ensures partially-parsed or partially-saved data doesn't wipe out
 * existing defaults or user data.
 */
function mergeNonEmpty(target, source) {
  const merged = { ...target };
  for (const [key, val] of Object.entries(source || {})) {
    if (val === undefined || val === null) continue;
    if (typeof val === 'string' && val.trim() === '') continue;
    if (Array.isArray(val)) {
      // Skip empty arrays
      if (val.length === 0) continue;
      // For arrays of objects (like experience/education), skip if every entry is blank
      if (val.every(item => typeof item === 'object' && item !== null && !hasContent(item))) continue;
      // Filter out completely empty entries, keep only those with content
      const filtered = val.filter(item => typeof item !== 'object' || item === null || hasContent(item));
      if (filtered.length === 0) continue;
      merged[key] = filtered;
      continue;
    }
    merged[key] = val;
  }
  return merged;
}

const INIT = {
  fullName: 'Priya Sharma',
  jobTitle: 'Senior Software Engineer',
  email: 'priya.sharma@example.com',
  phone: '+91 98765 43210',
  location: 'Bangalore, India 560001',
  linkedin: 'linkedin.com/in/priyasharma',
  summary: 'Dynamic Senior Software Engineer with extensive experience specializing in Angular and React.js. Proven track record in developing robust applications and enhancing team collaboration. Adept at integrating complex APIs and optimizing performance, while ensuring client requirements are met through innovative solutions and effective communication.',
  interests: 'Full-stack Development, Open Source Contributions, Tech Community',
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
  photo: null, photoPreview: '',
};

/* Static sample data for template thumbnails — never changes */
const SAMPLE_DATA = { ...INIT };

const PARTICLES = ['📄', '✨', '💼', '🎓', '⭐', '💎', '🖊️', '💡'];

/* Blank state for "Build my resume" — all fields empty */
const BLANK = {
  fullName: '',
  jobTitle: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  summary: '',
  interests: '',
  experience: [{ title: '', company: '', from: '', to: '', location: '', desc: '' }],
  education: [{ degree: '', institution: '', year: '', location: '' }],
  skills: '',
  languages: '',
  photo: null, photoPreview: '',
};

export default function CardResume({ onBack, userEmail, initialData, templateId: initTplId, isSuperAdmin }) {
  const [step, setStep] = useState('templates');         // templates | upload | form | preview
  const [selectedTemplate, setSelectedTemplate] = useState('artsy-corner');
  const [data, setData]     = useState(initialData ? { ...INIT, ...initialData } : INIT);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [templateId, setTemplateId] = useState(initTplId || null);
  const [paid, setPaid]     = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [toastState, setToastState] = useState({ text: '', show: false });
  const [accentColor, setAccentColor] = useState('');
  const [importDone, setImportDone] = useState(false);
  const fileInputRef = useRef(null);
  const verifiedEmailRef = useRef('');

  const [autoLoading, setAutoLoading] = useState(false);
  const [editorShowForm, setEditorShowForm] = useState(true);
  const [editorShowPreview, setEditorShowPreview] = useState(true);
  const [editorInitialStep, setEditorInitialStep] = useState(null);
  const [buildMode, setBuildMode] = useState(false);

  const pdfFilename = `resume-${toFilename(data.fullName || 'professional')}.pdf`;
  const dlTitle  = data.fullName ? `${data.fullName} Resume` : 'Resume';

  const { downloading, handleDownload: handlePdfDownload, toast: pdfToast, watermarkRef } = usePdfDownload('resume-print-area', pdfFilename, {
    onSuccess: async () => {
      await logDownload(userEmail, CARD_TYPE, CARD_LABEL, dlTitle, pdfFilename, data).catch(() => null);
    },
    addWatermark: true,
  });

  const [downloadingWord, setDownloadingWord] = useState(false);

  function showToast(msg) {
    setToastState({ text: msg, show: true });
    setTimeout(() => setToastState(t => ({ ...t, show: false })), 3500);
  }

  /* Check payment */
  useEffect(() => {
    if (isSuperAdmin) { setPaid(true); watermarkRef.current = false; return; }
    if (!userEmail) return;
    hasUserPaid(userEmail, CARD_TYPE).then(p => {
      setPaid(p);
      watermarkRef.current = !p;
    }).catch(() => {});
  }, [userEmail, isSuperAdmin]);

  /* Auto-load existing resume data when userEmail is available on mount */
  useEffect(() => {
    if (!userEmail || initialData || importDone) return; // skip if no email, editing existing, or already loaded
    let cancelled = false;
    (async () => {
      setAutoLoading(true);
      try {
        const templates = await getUserTemplates(userEmail);
        const existing = templates.find(t => t.cardType === CARD_TYPE);
        if (!cancelled && existing && existing.formData) {
          const saved = existing.formData;
          const merged = mergeNonEmpty(INIT, saved);
          const tplChoice = saved.selectedTemplate || TEMPLATES[0]?.id || 'artsy-corner';
          const colorChoice = saved.accentColor || '';
          setData({
            ...merged,
            email: saved.email || userEmail,
            photo: null,
            photoPreview: saved.photoPreview || '',
          });
          setSelectedTemplate(tplChoice);
          if (colorChoice) setAccentColor(colorChoice);
          setTemplateId(existing.id);
          setImportDone(true);
          verifiedEmailRef.current = userEmail;
          showToast('✅ Welcome back! Your saved resume loaded automatically.');
          // Re-save complete merged data so future loads are clean
          try {
            const name = merged.fullName ? `${merged.fullName} Resume` : 'Resume Template';
            await updateTemplate(existing.id, name, { ...merged, email: saved.email || userEmail, selectedTemplate: tplChoice, accentColor: colorChoice });
          } catch (e) { console.error('Re-save merged data failed:', e); }
        }
      } catch (err) {
        console.error('Auto-load resume error:', err);
      } finally {
        if (!cancelled) setAutoLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [userEmail]); // eslint-disable-line react-hooks/exhaustive-deps

  function onChange(e) {
    const { name, value, files } = e.target;
    if (name === 'photo' && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setData(d => ({ ...d, photo: files[0], photoPreview: reader.result }));
      reader.readAsDataURL(files[0]);
    } else {
      setData(d => ({ ...d, [name]: value }));
      if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
    }
  }

  function validate() {
    const err = {};
    if (!data.fullName.trim()) err.fullName = 'Name is required.';
    return err;
  }

  function onGenerate() {
    const err = validate();
    if (Object.keys(err).length) {
      setErrors(err);
      alert('Please fill in the required fields (Full Name) before generating.');
      return;
    }
    setStep('preview');
  }

  /* ── Template Selection ── */
  function handleSelectTemplate(tplId) {
    setSelectedTemplate(tplId);
    if (!importDone && !buildMode) {
      setData({ ...INIT });
      setStep('editor');
    }
    // When importDone or buildMode, just update selectedTemplate — stay on templates page
  }

  /* ── Build from scratch — blank form on templates page ── */
  function handleBuildResume(tplId) {
    setData({ ...BLANK });
    setSelectedTemplate(tplId);
    setBuildMode(true);
    setEditorShowForm(true);
    // Stay on 'templates' step — the editor panel shows via buildMode
  }

  /* ── Check for existing resume data after email verification ── */
  async function handleEmailVerified(email) {
    verifiedEmailRef.current = email; // Store for later use in save

    // Check payment status for this verified email
    try {
      const isPaid = await hasUserPaid(email, CARD_TYPE);
      if (isPaid) {
        setPaid(true);
        watermarkRef.current = false;
      }
    } catch { /* ignore */ }

    try {
      const templates = await getUserTemplates(email);
      // Find the most recent cardresume template
      const existing = templates.find(t => t.cardType === CARD_TYPE);
      if (existing && existing.formData) {
        const saved = existing.formData;
        // Merge saved data with INIT defaults — fills any gaps left by parser
        const merged = mergeNonEmpty(INIT, saved);
        const tplChoice = saved.selectedTemplate || TEMPLATES[0]?.id || 'artsy-corner';
        const colorChoice = saved.accentColor || '';
        setData({
          ...merged,
          email: saved.email || email,
          photo: null,
          photoPreview: saved.photoPreview || '',
        });
        setSelectedTemplate(tplChoice);
        if (colorChoice) setAccentColor(colorChoice);
        setTemplateId(existing.id);
        setImportDone(true);
        showToast('✅ Found your saved resume! Details loaded automatically.');
        // Re-save the complete merged data so future loads are clean
        try {
          const name = merged.fullName ? `${merged.fullName} Resume` : 'Resume Template';
          await updateTemplate(existing.id, name, { ...merged, email: saved.email || email, selectedTemplate: tplChoice, accentColor: colorChoice });
        } catch (e) { console.error('Re-save merged data failed:', e); }
        return true; // has existing data
      }
    } catch (err) {
      console.error('Error checking existing resume:', err);
    }
    return false; // no existing data
  }

  /* ── Resume Upload ── */
  function handleUploadResume(email) {
    if (email) {
      verifiedEmailRef.current = email;
      setData(d => ({ ...d, email }));
    }
    if (fileInputRef.current) fileInputRef.current.click();
  }

  async function handleFileSelected(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setParsing(true);
    showToast('⏳ Parsing your resume…');
    try {
      const parsed = await parseResumeFile(file);
      // Merge parsed data with INIT defaults so we always get a complete resume
      const merged = mergeNonEmpty(INIT, parsed);
      const tplChoice = TEMPLATES[0]?.id || 'artsy-corner';
      // Also keep the verified email
      const email = verifiedEmailRef.current || parsed.email || data.email || '';
      setData({ ...merged, email, photo: null, photoPreview: '' });
      showToast('✅ Resume parsed! Review and edit the details below.');
      setSelectedTemplate(tplChoice);
      setImportDone(true);
      // Auto-save complete merged data so it's available next time
      try {
        const name = merged.fullName ? `${merged.fullName} Resume` : 'Resume Template';
        const saveData = { ...merged, email, selectedTemplate: tplChoice, accentColor };
        if (templateId) {
          await updateTemplate(templateId, name, saveData);
        } else {
          const id = await saveTemplate(email, CARD_TYPE, name, saveData);
          setTemplateId(id);
        }
      } catch (saveErr) {
        console.error('Auto-save after parse failed:', saveErr);
      }
      // Stay on templates page — right side will split into form + preview
    } catch (err) {
      console.error('Resume parse error:', err);
      showToast('❌ ' + (err.message || 'Failed to parse resume'));
    } finally {
      setParsing(false);
      // Reset input so same file can be re-uploaded
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  /* ── Word Download ── */
  async function handleWordDownload() {
    setDownloadingWord(true);
    try {
      const el = document.getElementById('resume-print-area');
      if (!el) return;
      const htmlContent = el.outerHTML;
      // Get computed styles for the template
      const styleSheets = Array.from(document.styleSheets);
      let css = '';
      for (const sheet of styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            css += rule.cssText + '\n';
          }
        } catch { /* cross-origin stylesheets */ }
      }

      const fullHtml = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="utf-8"><title>${dlTitle}</title>
        <style>${css}
          @page { size: A4; margin: 0; }
          body { margin: 0; padding: 0; }
          .rt { width: 794px !important; max-width: 794px !important; }
        </style></head>
        <body>${htmlContent}</body></html>`;

      const blob = new Blob([fullHtml], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-${toFilename(data.fullName || 'professional')}.doc`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('✅ Word document downloaded!');
      logDownload(userEmail, CARD_TYPE, CARD_LABEL, dlTitle, a.download, data).catch(() => {});
    } catch {
      showToast('❌ Word download failed — try again.');
    } finally {
      setDownloadingWord(false);
    }
  }

  async function handleSaveTemplate() {
    setSaving(true);
    try {
      const name = data.fullName ? `${data.fullName} Resume` : 'Resume Template';
      const saveData = { ...data, selectedTemplate, accentColor };
      if (templateId) {
        await updateTemplate(templateId, name, saveData);
      } else {
        const id = await saveTemplate(userEmail, CARD_TYPE, name, saveData);
        setTemplateId(id);
      }
      alert(templateId ? 'Template updated!' : 'Template saved!');
    } catch (e) {
      console.error('Save template error:', e);
      const msg = e?.code === 'permission-denied'
        ? 'Firestore permission denied.'
        : `Failed to save template: ${e.message || e}`;
      alert(msg);
    } finally { setSaving(false); }
  }

  /* Hidden file input for resume upload */
  const hiddenFileInput = (
    <input
      ref={fileInputRef}
      type="file"
      accept=".pdf,.docx,.doc,.txt"
      style={{ display: 'none' }}
      onChange={handleFileSelected}
    />
  );

  /* ─────── STEP 1: Template Selection ─────── */
  if (step === 'templates') {
    return (
      <>
        {hiddenFileInput}
        <TemplateSelector
          onSelect={handleSelectTemplate}
          onBuildResume={handleBuildResume}
          buildMode={buildMode}
          onBack={onBack}
          onUploadResume={handleUploadResume}
          userData={data}
          importDone={importDone}
          selectedTemplate={selectedTemplate}
          accentColor={accentColor}
          onAccentChange={setAccentColor}
          onChange={onChange}
          onGenerate={onGenerate}
          errors={errors}
          onEmailVerified={handleEmailVerified}
          autoLoaded={importDone && !!userEmail}
          autoLoading={autoLoading}
          userEmail={userEmail}
        />
        <Toast text={toastState.text} show={toastState.show} />
        {parsing && (
          <div className="cr-parsing-overlay">
            <div className="cr-parsing-spinner">⏳ Parsing your resume…</div>
          </div>
        )}
      </>
    );
  }

  /* ─────── STEP 2: Editor (Templates + Step Form + Live Preview) ─────── */
  if (step === 'editor') {
    const tpl = getTemplateById(selectedTemplate);
    const TemplateComponent = tpl.Component;
    return (
      <div className="cr-editor-screen">
        {hiddenFileInput}

        {/* Left: Template Thumbnails */}
        <div className="cr-editor-templates">
          <button className="cr-editor-back" onClick={() => { setData({ ...BLANK }); setStep('templates'); }}>← Back</button>
          <h3 className="cr-editor-templates-title">Choose Template</h3>
          <div className="cr-editor-tpl-grid">
            {TEMPLATES.map(t => (
              <div
                key={t.id}
                className={`cr-editor-tpl-card${selectedTemplate === t.id ? ' cr-editor-tpl-active' : ''}`}
                onClick={() => { setSelectedTemplate(t.id); setData({ ...INIT }); }}
              >
                <div className="cr-editor-tpl-preview">
                  <div className="cr-editor-tpl-scaler">
                    <t.Component data={SAMPLE_DATA} />
                  </div>
                </div>
                <span className="cr-editor-tpl-name">{t.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Form (top, toggleable) + Preview (bottom) */}
        <div className="cr-editor-right">
          {!editorShowForm && (
            <div className="cr-editor-edit-bar">
              <button className="cr-editor-edit-btn" onClick={() => setEditorShowForm(true)}>
                ✏️ Edit Details
              </button>
            </div>
          )}
          {editorShowForm && (
            <div className="cr-editor-form-panel">
              <div className="cr-editor-form-toolbar">
                <span className="cr-editor-form-label">✏️ Edit Details</span>
                <button className="cr-editor-form-hide" onClick={() => setEditorShowForm(false)}>Hide form ▲</button>
              </div>
              <StepResumeForm
                data={data}
                errors={errors}
                onChange={onChange}
                onGenerate={onGenerate}
                initialStep={editorInitialStep}
              />
            </div>
          )}
          {editorShowPreview && (
          <div className="cr-editor-preview-panel">
            <div className="cr-editor-preview-header">
              <span>📄 Live Preview — {tpl.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="cr-editor-colors">
                  {COLOR_PRESETS.map(c => (
                    <button
                      key={c}
                      className={`cr-color-dot-sm${accentColor === c ? ' active' : ''}`}
                      style={{ background: c }}
                      onClick={() => setAccentColor(accentColor === c ? '' : c)}
                    />
                  ))}
                </div>
                <button className="cr-editor-form-hide" onClick={() => setEditorShowPreview(false)}>Hide preview ▲</button>
              </div>
            </div>
            <div className="cr-editor-preview-body">
              <div style={accentColor ? { '--rt-accent': accentColor } : undefined}>
                <TemplateComponent data={data} accentColor={accentColor} />
              </div>
            </div>
          </div>
          )}
          {!editorShowPreview && (
            <div className="cr-editor-edit-bar">
              <button className="cr-editor-edit-btn" onClick={() => setEditorShowPreview(true)}>
                📄 Show Preview
              </button>
            </div>
          )}
        </div>

        <Toast text={toastState.text} show={toastState.show} />
        {parsing && (
          <div className="cr-parsing-overlay">
            <div className="cr-parsing-spinner">⏳ Parsing your resume…</div>
          </div>
        )}
      </div>
    );
  }

  /* ─────── STEP 3: Form (legacy) ─────── */
  if (step === 'form') {
    const tpl = getTemplateById(selectedTemplate);
    return (
      <>
        {hiddenFileInput}
        <CardResumeForm
          data={data}
          errors={errors}
          onChange={onChange}
          onBack={() => setStep('templates')}
          onGenerate={onGenerate}
          templateName={tpl.name}
        />
        <Toast text={toastState.text} show={toastState.show} />
      </>
    );
  }

  /* ─────── STEP 3: Preview & Download ─────── */
  const tpl = getTemplateById(selectedTemplate);
  const TemplateComponent = tpl.Component;

  return (
    <div className="cr-editor-screen">
      {/* Left: Template Thumbnails */}
      <div className="cr-editor-templates">
        <button className="cr-editor-back" onClick={onBack}>🏠 Home</button>
        <h3 className="cr-editor-templates-title">Choose Template</h3>
        <div className="cr-editor-tpl-grid">
          {TEMPLATES.map(t => (
            <div
              key={t.id}
              className={`cr-editor-tpl-card${selectedTemplate === t.id ? ' cr-editor-tpl-active' : ''}`}
              onClick={() => setSelectedTemplate(t.id)}
            >
              <div className="cr-editor-tpl-preview">
                <div className="cr-editor-tpl-scaler">
                  <t.Component data={SAMPLE_DATA} />
                </div>
              </div>
              <span className="cr-editor-tpl-name">{t.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Preview & Download */}
      <div className="cr-editor-right">
        <div className="cr-preview-toolbar">
          <span className="cr-preview-toolbar-title">📄 {tpl.name}</span>
          <div className="cr-editor-colors">
            {COLOR_PRESETS.map(c => (
              <button
                key={c}
                className={`cr-color-dot-sm${accentColor === c ? ' active' : ''}`}
                style={{ background: c }}
                onClick={() => setAccentColor(accentColor === c ? '' : c)}
              />
            ))}
          </div>
          <button className="cr-preview-edit-btn" onClick={() => { setEditorShowForm(true); setStep('editor'); }}>
            ✏️ Edit Details
          </button>
        </div>

        <div className="cr-preview-resume-area">
          <div id="resume-print-area">
            <TemplateComponent data={data} accentColor={accentColor} />
          </div>
        </div>

        <div className="cr-preview-bottom-bar">
          <button className="cr-preview-prev-btn" onClick={() => { setEditorShowForm(true); setEditorInitialStep(5); setStep('editor'); }}>← Previous</button>
          <div className="cr-preview-download-group">
            {paid && (
              <button
                className="cr-preview-word-btn"
                onClick={handleWordDownload}
                disabled={downloadingWord}
              >
                📝 {downloadingWord ? 'Saving…' : 'Word Format'}
              </button>
            )}
            <button
              className="cr-preview-download-btn"
              onClick={paid ? handlePdfDownload : () => setShowPayment(true)}
              disabled={downloading}
            >
              📥 {downloading ? 'Saving PDF…' : paid ? 'Download PDF' : '💳 Download Resume'}
            </button>
          </div>
        </div>
      </div>

      <button className="cr-save-template-btn" style={{ display: 'none' }} onClick={handleSaveTemplate} disabled={saving}>
        {saving ? '⏳ Saving…' : templateId ? '💾 Update Template' : '💾 Save Template'}
      </button>

      <Toast text={pdfToast.text || toastState.text} show={pdfToast.show || toastState.show} />

      {showPayment && (
        <BiodataPaymentPopup
          userEmail={userEmail}
          cardType={CARD_TYPE}
          cardLabel={CARD_LABEL}
          onClose={() => setShowPayment(false)}
          onPaymentDone={(result) => {
            const withWatermark = result?.withWatermark ?? false;
            const isFree = result?.isFree ?? false;
            watermarkRef.current = withWatermark;
            if (!withWatermark && !isFree) setPaid(true);
            setShowPayment(false);
            setTimeout(() => handlePdfDownload(), 500);
          }}
        />
      )}
    </div>
  );
}
