'use client';
import { useState, useEffect, Fragment } from 'react';
import FormField from '../shared/FormField';
import RichTextEditor from './RichTextEditor';

const STEPS = [
  { id: 1, label: 'Heading' },
  { id: 2, label: 'Work History' },
  { id: 3, label: 'Education' },
  { id: 4, label: 'Projects' },
  { id: 5, label: 'Skills' },
  { id: 6, label: 'Summary' },
  { id: 7, label: 'Finalize' },
];

const EMPTY_EXP = { title: '', company: '', from: '', to: '', location: '', desc: '' };
const EMPTY_EDU = { degree: '', institution: '', year: '', location: '' };
const EMPTY_PROJECT = { name: '', tech: '', desc: '' };

export default function StepResumeForm({ data, errors = {}, onChange, onGenerate, onStepChange, initialStep }) {
  const [currentStep, setCurrentStep] = useState(initialStep || 1);

  useEffect(() => {
    if (initialStep) setCurrentStep(initialStep);
  }, [initialStep]);

  // Notify parent whenever step changes
  useEffect(() => {
    if (onStepChange) onStepChange(currentStep);
  }, [currentStep, onStepChange]);

  function addEntry(field, empty) {
    onChange({ target: { name: field, value: [...data[field], { ...empty }] } });
  }
  function removeEntry(field, idx) {
    onChange({ target: { name: field, value: data[field].filter((_, i) => i !== idx) } });
  }
  function updateEntry(field, idx, key, val) {
    const updated = data[field].map((e, i) => i === idx ? { ...e, [key]: val } : e);
    onChange({ target: { name: field, value: updated } });
  }

  const nextStep = () => { if (currentStep < 7) setCurrentStep(s => s + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(s => s - 1); };

  function resetSection(step) {
    switch (step) {
      case 1:
        ['fullName', 'jobTitle', 'email', 'phone', 'location', 'linkedin'].forEach(f =>
          onChange({ target: { name: f, value: '' } })
        );
        onChange({ target: { name: 'photo', value: null } });
        onChange({ target: { name: 'photoPreview', value: '' } });
        break;
      case 2:
        onChange({ target: { name: 'experience', value: [{ ...EMPTY_EXP }] } });
        break;
      case 3:
        onChange({ target: { name: 'education', value: [{ ...EMPTY_EDU }] } });
        break;
      case 4:
        onChange({ target: { name: 'projects', value: [{ ...EMPTY_PROJECT }] } });
        break;
      case 5:
        onChange({ target: { name: 'skills', value: '' } });
        onChange({ target: { name: 'languages', value: '' } });
        break;
      case 6:
        onChange({ target: { name: 'summary', value: '' } });
        onChange({ target: { name: 'interests', value: '' } });
        break;
      default: break;
    }
  }

  return (
    <div className="sf-container">
      {/* ── Step Indicator ── */}
      <div className="sf-steps">
        {STEPS.map((step, i) => (
          <Fragment key={step.id}>
            <div
              className={`sf-step${currentStep === step.id ? ' active' : ''}${currentStep > step.id ? ' done' : ''}`}
              onClick={() => setCurrentStep(step.id)}
            >
              <div className="sf-step-circle">{currentStep > step.id ? '✓' : step.id}</div>
              <span className="sf-step-label">{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`sf-step-connector${currentStep > step.id ? ' done' : ''}`} />
            )}
          </Fragment>
        ))}
      </div>

      {/* ── Step Content ── */}
      <div className="sf-step-content">

        {/* Step 1: Heading / Personal Info */}
        {currentStep === 1 && (
          <>
            <div className="sf-step-title-row">
              <h3 className="sf-step-title">👤 Personal Information</h3>
              <button type="button" className="sf-reset-btn" onClick={() => resetSection(1)}>🔄 Reset</button>
            </div>
            <div className="form-grid">
              <FormField label="Full Name" name="fullName" value={data.fullName} onChange={onChange} placeholder="e.g. Your Full Name" required error={errors.fullName} />
              <FormField label="Job Title" name="jobTitle" value={data.jobTitle} onChange={onChange} placeholder="e.g. Senior Software Engineer" />
              <FormField label="Email" name="email" type="email" value={data.email} onChange={onChange} placeholder="you@email.com" error={errors.email} />
              <FormField label="Phone" name="phone" value={data.phone} onChange={onChange} placeholder="+91 98765 43210" />
              <FormField label="Location" name="location" value={data.location} onChange={onChange} placeholder="e.g. Bangalore, India" />
              <FormField label="LinkedIn / Portfolio" name="linkedin" value={data.linkedin} onChange={onChange} placeholder="linkedin.com/in/yourname" />
            </div>
            <div className="form-stack" style={{ marginTop: 12 }}>
              <div className="card-photo-upload">
                <label htmlFor="sf-photo">📷 Profile Photo <span className="optional">(optional)</span></label>
                <input type="file" id="sf-photo" name="photo" accept="image/*" onChange={onChange} />
                {data.photoPreview && <img src={data.photoPreview} alt="Preview" className="card-photo-preview card-photo-preview--circle" loading="lazy" />}
              </div>
            </div>
          </>
        )}

        {/* Step 2: Work History */}
        {currentStep === 2 && (
          <>
            <div className="sf-step-title-row">
              <h3 className="sf-step-title">💼 Work Experience</h3>
              <button type="button" className="sf-reset-btn" onClick={() => resetSection(2)}>🔄 Reset</button>
            </div>
            {data.experience.map((exp, i) => (
              <div key={i} className="resume-entry-form">
                <div className="resume-entry-form-header">
                  <strong>Experience #{i + 1}</strong>
                  {data.experience.length > 1 && <button type="button" className="resume-remove-btn" onClick={() => removeEntry('experience', i)}>✕</button>}
                </div>
                <div className="form-grid">
                  <FormField label="Job Title" name={`exp-title-${i}`} value={exp.title} onChange={e => updateEntry('experience', i, 'title', e.target.value)} placeholder="e.g. Senior Software Engineer" />
                  <FormField label="Company" name={`exp-company-${i}`} value={exp.company} onChange={e => updateEntry('experience', i, 'company', e.target.value)} placeholder="e.g. Wipro Technologies" />
                  <FormField label="From" name={`exp-from-${i}`} value={exp.from} onChange={e => updateEntry('experience', i, 'from', e.target.value)} placeholder="e.g. 12/2022" />
                  <FormField label="To" name={`exp-to-${i}`} value={exp.to} onChange={e => updateEntry('experience', i, 'to', e.target.value)} placeholder="e.g. Current" />
                  <FormField label="Location" name={`exp-loc-${i}`} value={exp.location} onChange={e => updateEntry('experience', i, 'location', e.target.value)} placeholder="e.g. Greater Noida, India" />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13.5, color: '#344054' }}>Description</label>
                    <RichTextEditor value={exp.desc} onChange={(html) => updateEntry('experience', i, 'desc', html)} placeholder="Key responsibilities…" rows={3} />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="resume-add-btn" onClick={() => addEntry('experience', EMPTY_EXP)}>+ Add Experience</button>
          </>
        )}

        {/* Step 3: Education */}
        {currentStep === 3 && (
          <>
            <div className="sf-step-title-row">
              <h3 className="sf-step-title">🎓 Education &amp; Training</h3>
              <button type="button" className="sf-reset-btn" onClick={() => resetSection(3)}>🔄 Reset</button>
            </div>
            {data.education.map((edu, i) => (
              <div key={i} className="resume-entry-form">
                <div className="resume-entry-form-header">
                  <strong>Education #{i + 1}</strong>
                  {data.education.length > 1 && <button type="button" className="resume-remove-btn" onClick={() => removeEntry('education', i)}>✕</button>}
                </div>
                <div className="form-grid">
                  <FormField label="Degree / Course" name={`edu-degree-${i}`} value={edu.degree} onChange={e => updateEntry('education', i, 'degree', e.target.value)} placeholder="e.g. B.Tech Computer Science" />
                  <FormField label="Institution" name={`edu-inst-${i}`} value={edu.institution} onChange={e => updateEntry('education', i, 'institution', e.target.value)} placeholder="e.g. Indraprastha University" />
                  <FormField label="Year" name={`edu-year-${i}`} value={edu.year} onChange={e => updateEntry('education', i, 'year', e.target.value)} placeholder="e.g. 2018" />
                  <FormField label="Location" name={`edu-loc-${i}`} value={edu.location} onChange={e => updateEntry('education', i, 'location', e.target.value)} placeholder="e.g. New Delhi, India" />
                </div>
              </div>
            ))}
            <button type="button" className="resume-add-btn" onClick={() => addEntry('education', EMPTY_EDU)}>+ Add Education</button>
          </>
        )}

        {/* Step 4: Projects */}
        {currentStep === 4 && (
          <>
            <div className="sf-step-title-row">
              <h3 className="sf-step-title">🚀 Projects</h3>
              <button type="button" className="sf-reset-btn" onClick={() => resetSection(4)}>🔄 Reset</button>
            </div>
            {data.projects.map((proj, i) => (
              <div key={i} className="resume-entry-form">
                <div className="resume-entry-form-header">
                  <strong>Project #{i + 1}</strong>
                  {data.projects.length > 1 && <button type="button" className="resume-remove-btn" onClick={() => removeEntry('projects', i)}>✕</button>}
                </div>
                <div className="form-grid">
                  <FormField label="Project Name" name={`proj-name-${i}`} value={proj.name} onChange={e => updateEntry('projects', i, 'name', e.target.value)} placeholder="e.g. E-Commerce Platform" />
                  <FormField label="Technologies" name={`proj-tech-${i}`} value={proj.tech} onChange={e => updateEntry('projects', i, 'tech', e.target.value)} placeholder="e.g. React, Node.js, MongoDB" />
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13.5, color: '#344054' }}>Description</label>
                    <RichTextEditor value={proj.desc} onChange={(html) => updateEntry('projects', i, 'desc', html)} placeholder="Brief description of the project…" rows={3} />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="resume-add-btn" onClick={() => addEntry('projects', EMPTY_PROJECT)}>+ Add Project</button>
          </>
        )}

        {/* Step 5: Skills & Languages */}
        {currentStep === 5 && (
          <>
            <div className="sf-step-title-row">
              <h3 className="sf-step-title">🛠️ Skills &amp; Languages</h3>
              <button type="button" className="sf-reset-btn" onClick={() => resetSection(5)}>🔄 Reset</button>
            </div>
            <div className="form-grid">
              <FormField label="Skills (comma-separated)" name="skills" value={data.skills} onChange={onChange} placeholder="e.g. React.js, Angular, Node.js, Python" span />
              <FormField label="Languages" name="languages" value={data.languages} onChange={onChange} placeholder="e.g. Hindi: Native, English: Professional" span />
            </div>
          </>
        )}

        {/* Step 6: Summary */}
        {currentStep === 6 && (
          <>
            <div className="sf-step-title-row">
              <h3 className="sf-step-title">📝 Professional Summary</h3>
              <button type="button" className="sf-reset-btn" onClick={() => resetSection(6)}>🔄 Reset</button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13.5, color: '#344054' }}>Summary</label>
              <RichTextEditor value={data.summary} onChange={(html) => onChange({ target: { name: 'summary', value: html } })} placeholder="Brief overview of your professional background…" rows={4} />
            </div>
            <div className="form-grid">
              <FormField label="Interests & Hobbies" name="interests" value={data.interests} onChange={onChange} placeholder="e.g. Open Source, Tech Community" span />
            </div>
          </>
        )}

        {/* Step 7: Finalize */}
        {currentStep === 7 && (
          <>
            <h3 className="sf-step-title">✅ Review &amp; Finalize</h3>
            <div className="sf-finalize-summary">
              <div className="sf-finalize-item"><span className="sf-finalize-label">Name</span><span className="sf-finalize-value">{data.fullName || '—'}</span></div>
              <div className="sf-finalize-item"><span className="sf-finalize-label">Title</span><span className="sf-finalize-value">{data.jobTitle || '—'}</span></div>
              <div className="sf-finalize-item"><span className="sf-finalize-label">Email</span><span className="sf-finalize-value">{data.email || '—'}</span></div>
              <div className="sf-finalize-item"><span className="sf-finalize-label">Experience</span><span className="sf-finalize-value">{data.experience?.length || 0} entries</span></div>
              <div className="sf-finalize-item"><span className="sf-finalize-label">Education</span><span className="sf-finalize-value">{data.education?.length || 0} entries</span></div>
              <div className="sf-finalize-item"><span className="sf-finalize-label">Projects</span><span className="sf-finalize-value">{data.projects?.length || 0} entries</span></div>
              <div className="sf-finalize-item"><span className="sf-finalize-label">Skills</span><span className="sf-finalize-value">{data.skills ? data.skills.split(',').length + ' skills' : '—'}</span></div>
            </div>
            <p className="sf-finalize-note">Review the live preview above, then click &ldquo;Generate Resume&rdquo; to download.</p>
          </>
        )}
      </div>

      {/* ── Navigation ── */}
      <div className="sf-nav">
        {currentStep > 1 && <button className="sf-nav-btn sf-nav-prev" onClick={prevStep}>← Previous</button>}
        <div style={{ flex: 1 }} />
        {currentStep < 7 && <button className="sf-nav-btn sf-nav-next" onClick={nextStep}>Next →</button>}
        {currentStep === 7 && <button className="sf-nav-btn sf-nav-generate" onClick={onGenerate}>📄 Generate Resume</button>}
      </div>
    </div>
  );
}
