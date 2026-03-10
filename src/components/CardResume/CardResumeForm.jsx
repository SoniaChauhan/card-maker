'use client';
import FormField from '../shared/FormField';
import RichTextEditor from './RichTextEditor';

const EMPTY_EXP = { title: '', company: '', from: '', to: '', location: '', desc: '' };
const EMPTY_EDU = { degree: '', institution: '', year: '', location: '' };
const EMPTY_PROJECT = { name: '', tech: '', desc: '' };

export default function CardResumeForm({ data, errors, onChange, onBack, onGenerate, templateName }) {

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

  return (
    <div className="form-screen cardresume-form-screen">
      <div className="form-card">
        <div className="form-header">
          <span className="form-header-icon">📄</span>
          <h2>Resume Builder</h2>
          <p>Fill in your details and generate a professional PDF/Word resume!</p>
        </div>

        {/* ── Personal Info ── */}
        <h3 className="cr-form-section-title">👤 Personal Information</h3>
        <div className="form-grid">
          <FormField label="Full Name" name="fullName"
            value={data.fullName} onChange={onChange}
            placeholder="e.g. Priya Sharma" required error={errors.fullName} />

          <FormField label="Job Title / Designation" name="jobTitle"
            value={data.jobTitle} onChange={onChange}
            placeholder="e.g. Senior Software Engineer" />

          <FormField label="Email" name="email" type="email"
            value={data.email} onChange={onChange}
            placeholder="you@email.com" error={errors.email} />

          <FormField label="Phone" name="phone"
            value={data.phone} onChange={onChange}
            placeholder="+91 98765 43210" />

          <FormField label="Location" name="location"
            value={data.location} onChange={onChange}
            placeholder="e.g. Bangalore, India 560001" />

          <FormField label="LinkedIn / Portfolio" name="linkedin"
            value={data.linkedin} onChange={onChange}
            placeholder="linkedin.com/in/yourname" />
        </div>

        {/* ── Photo Upload ── */}
        <div className="form-stack" style={{ marginBottom: 16 }}>
          <div className="card-photo-upload">
            <label htmlFor="cardresume-photo">
              📷 Profile Photo <span className="optional">(optional — used by some templates)</span>
            </label>
            <input type="file" id="cardresume-photo" name="photo" accept="image/*" onChange={onChange} />
            {data.photoPreview && (
              <img src={data.photoPreview} alt="Resume photo preview" className="card-photo-preview card-photo-preview--circle" loading="lazy" />
            )}
          </div>
        </div>

        {/* ── Professional Summary ── */}
        <h3 className="cr-form-section-title">📝 Professional Summary</h3>
        <div className="form-grid">
          <div style={{ gridColumn: '1 / -1' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13.5, color: '#344054' }}>Summary</label>
            <RichTextEditor
              value={data.summary}
              onChange={(html) => onChange({ target: { name: 'summary', value: html } })}
              placeholder="Brief overview of your professional background, key strengths and career highlights…"
              rows={4}
            />
          </div>
        </div>

        {/* ── Work Experience ── */}
        <h3 className="cr-form-section-title">💼 Work Experience</h3>
        {data.experience.map((exp, i) => (
          <div key={i} className="resume-entry-form">
            <div className="resume-entry-form-header">
              <strong>Experience #{i + 1}</strong>
              <button type="button" className="resume-remove-btn" onClick={() => removeEntry('experience', i)}>✕</button>
            </div>
            <div className="form-grid">
              <FormField label="Job Title" name={`exp-title-${i}`}
                value={exp.title} onChange={e => updateEntry('experience', i, 'title', e.target.value)}
                placeholder="e.g. Senior Software Engineer" />
              <FormField label="Company" name={`exp-company-${i}`}
                value={exp.company} onChange={e => updateEntry('experience', i, 'company', e.target.value)}
                placeholder="e.g. Wipro Technologies" />
              <FormField label="From" name={`exp-from-${i}`}
                value={exp.from} onChange={e => updateEntry('experience', i, 'from', e.target.value)}
                placeholder="e.g. 12/2022" />
              <FormField label="To" name={`exp-to-${i}`}
                value={exp.to} onChange={e => updateEntry('experience', i, 'to', e.target.value)}
                placeholder="e.g. Current" />
              <FormField label="Location" name={`exp-loc-${i}`}
                value={exp.location} onChange={e => updateEntry('experience', i, 'location', e.target.value)}
                placeholder="e.g. Greater Noida, India" />
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13.5, color: '#344054' }}>Description</label>
                <RichTextEditor
                  value={exp.desc}
                  onChange={(html) => updateEntry('experience', i, 'desc', html)}
                  placeholder="Key responsibilities — use bullet list or one per line…"
                  rows={4}
                />
              </div>
            </div>
          </div>
        ))}
        <button type="button" className="resume-add-btn" onClick={() => addEntry('experience', EMPTY_EXP)}>+ Add Experience</button>

        {/* ── Education ── */}
        <h3 className="cr-form-section-title">🎓 Education &amp; Training</h3>
        {data.education.map((edu, i) => (
          <div key={i} className="resume-entry-form">
            <div className="resume-entry-form-header">
              <strong>Education #{i + 1}</strong>
              <button type="button" className="resume-remove-btn" onClick={() => removeEntry('education', i)}>✕</button>
            </div>
            <div className="form-grid">
              <FormField label="Degree / Course" name={`edu-degree-${i}`}
                value={edu.degree} onChange={e => updateEntry('education', i, 'degree', e.target.value)}
                placeholder="e.g. B.Tech Computer Science" />
              <FormField label="Institution" name={`edu-inst-${i}`}
                value={edu.institution} onChange={e => updateEntry('education', i, 'institution', e.target.value)}
                placeholder="e.g. Indraprastha University" />
              <FormField label="Year" name={`edu-year-${i}`}
                value={edu.year} onChange={e => updateEntry('education', i, 'year', e.target.value)}
                placeholder="e.g. 2018" />
              <FormField label="Location" name={`edu-loc-${i}`}
                value={edu.location} onChange={e => updateEntry('education', i, 'location', e.target.value)}
                placeholder="e.g. New Delhi, India" />
            </div>
          </div>
        ))}
        <button type="button" className="resume-add-btn" onClick={() => addEntry('education', EMPTY_EDU)}>+ Add Education</button>

        {/* ── Projects ── */}
        <h3 className="cr-form-section-title">🚀 Projects</h3>
        {data.projects.map((proj, i) => (
          <div key={i} className="resume-entry-form">
            <div className="resume-entry-form-header">
              <strong>Project #{i + 1}</strong>
              <button type="button" className="resume-remove-btn" onClick={() => removeEntry('projects', i)}>✕</button>
            </div>
            <div className="form-grid">
              <FormField label="Project Name" name={`proj-name-${i}`}
                value={proj.name} onChange={e => updateEntry('projects', i, 'name', e.target.value)}
                placeholder="e.g. E-Commerce Platform" />
              <FormField label="Technologies" name={`proj-tech-${i}`}
                value={proj.tech} onChange={e => updateEntry('projects', i, 'tech', e.target.value)}
                placeholder="e.g. React, Node.js, MongoDB" />
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 13.5, color: '#344054' }}>Description</label>
                <RichTextEditor
                  value={proj.desc}
                  onChange={(html) => updateEntry('projects', i, 'desc', html)}
                  placeholder="Brief description of the project…"
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}
        <button type="button" className="resume-add-btn" onClick={() => addEntry('projects', EMPTY_PROJECT)}>+ Add Project</button>

        {/* ── Skills ── */}
        <h3 className="cr-form-section-title">🛠️ Skills</h3>
        <div className="form-grid">
          <FormField label="Skills (comma-separated)" name="skills"
            value={data.skills} onChange={onChange}
            placeholder="e.g. React.js, Angular, Node.js, Python, Docker, Git, MongoDB" span />
        </div>

        {/* ── Languages ── */}
        <h3 className="cr-form-section-title">🗣️ Languages</h3>
        <div className="form-grid">
          <FormField label="Languages (e.g. Hindi: Native, English: Professional)" name="languages"
            value={data.languages} onChange={onChange}
            placeholder="e.g. Hindi: Native speaker, English: Professional" span />
        </div>

        {/* ── Interests & Hobbies ── */}
        <h3 className="cr-form-section-title">🎯 Interests &amp; Hobbies</h3>
        <div className="form-grid">
          <FormField label="Interests (comma-separated)" name="interests"
            value={data.interests} onChange={onChange}
            placeholder="e.g. Open Source, Tech Community, Full-stack Development" span />
        </div>

        {/* ── Actions ── */}
        <div className="form-actions" style={{ marginTop: 24 }}>
          <button className="btn-back-form" onClick={onBack}>← Back</button>
          <button className="btn-generate" onClick={onGenerate}
            style={{ background: 'linear-gradient(135deg,#6c63ff,#3b2fd4)', color: '#fff', boxShadow: '0 8px 24px rgba(108,99,255,.4)' }}>
            📄 Generate Resume
          </button>
        </div>
      </div>
    </div>
  );
}
