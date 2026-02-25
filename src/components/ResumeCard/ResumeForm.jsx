import FormField from '../shared/FormField';

const EMPTY_EXP = { title: '', company: '', from: '', to: '', desc: '' };
const EMPTY_EDU = { degree: '', institution: '', from: '', to: '', desc: '' };

export default function ResumeForm({ data, errors, onChange, onBack, onGenerate }) {

  /* ---- helpers for dynamic sections ---- */
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
    <div className="form-screen resume-form-screen">
      <div className="form-card">
        <div className="form-header">
          <span className="form-header-icon">📄</span>
          <h2>Resume Builder</h2>
          <p>Fill in your details and we'll generate a professional resume you can download as PDF!</p>
        </div>

        {/* ---- Personal ---- */}
        <div className="form-grid">
          <FormField label="Full Name" name="fullName"
            value={data.fullName} onChange={onChange}
            placeholder="e.g. Sonia Chauhan" required error={errors.fullName} />

          <FormField label="Job Title / Role" name="jobTitle"
            value={data.jobTitle} onChange={onChange}
            placeholder="e.g. Frontend Developer" />

          <FormField label="Email" name="email" type="email"
            value={data.email} onChange={onChange}
            placeholder="you@email.com" required error={errors.email} />

          <FormField label="Phone" name="phone"
            value={data.phone} onChange={onChange}
            placeholder="+91 9876543210" />

          <FormField label="Location" name="location"
            value={data.location} onChange={onChange}
            placeholder="e.g. Mumbai, India" />

          <FormField label="LinkedIn / Portfolio URL" name="linkedin"
            value={data.linkedin} onChange={onChange}
            placeholder="https://linkedin.com/in/..." />

          <FormField label="Professional Summary" name="summary"
            value={data.summary} onChange={onChange}
            placeholder="A brief summary of your experience…" rows={3} span />
        </div>

        {/* ---- Photo ---- */}
        <div className="form-stack" style={{ marginBottom: 16 }}>
          <div className="card-photo-upload">
            <label htmlFor="resume-photo">
              📷 Profile Photo <span className="optional">(optional)</span>
            </label>
            <input type="file" id="resume-photo" name="photo" accept="image/*" onChange={onChange} />
            {data.photoPreview && (
              <img src={data.photoPreview} alt="Preview" className="card-photo-preview card-photo-preview--circle" />
            )}
          </div>
        </div>

        {/* ---- Experience ---- */}
        <h3 style={{ color: '#1a73e8', marginBottom: 10, fontSize: 15 }}>💼 Work Experience</h3>
        {data.experience.map((exp, i) => (
          <div key={i} className="resume-entry-form">
            <div className="resume-entry-form-header">
              <strong>Experience #{i + 1}</strong>
              <button type="button" className="resume-remove-btn" onClick={() => removeEntry('experience', i)}>✕</button>
            </div>
            <div className="form-grid">
              <FormField label="Job Title" name={`exp-title-${i}`}
                value={exp.title} onChange={e => updateEntry('experience', i, 'title', e.target.value)}
                placeholder="e.g. Software Engineer" />
              <FormField label="Company" name={`exp-company-${i}`}
                value={exp.company} onChange={e => updateEntry('experience', i, 'company', e.target.value)}
                placeholder="e.g. TCS" />
              <FormField label="From" name={`exp-from-${i}`}
                value={exp.from} onChange={e => updateEntry('experience', i, 'from', e.target.value)}
                placeholder="e.g. Jan 2020" />
              <FormField label="To" name={`exp-to-${i}`}
                value={exp.to} onChange={e => updateEntry('experience', i, 'to', e.target.value)}
                placeholder="e.g. Present" />
              <FormField label="Description" name={`exp-desc-${i}`}
                value={exp.desc} onChange={e => updateEntry('experience', i, 'desc', e.target.value)}
                placeholder="Key responsibilities…" rows={2} span />
            </div>
          </div>
        ))}
        <button type="button" className="resume-add-btn" onClick={() => addEntry('experience', EMPTY_EXP)}>+ Add Experience</button>

        {/* ---- Education ---- */}
        <h3 style={{ color: '#1a73e8', margin: '20px 0 10px', fontSize: 15 }}>🎓 Education</h3>
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
                placeholder="e.g. IIT Delhi" />
              <FormField label="From" name={`edu-from-${i}`}
                value={edu.from} onChange={e => updateEntry('education', i, 'from', e.target.value)}
                placeholder="e.g. 2016" />
              <FormField label="To" name={`edu-to-${i}`}
                value={edu.to} onChange={e => updateEntry('education', i, 'to', e.target.value)}
                placeholder="e.g. 2020" />
              <FormField label="Details" name={`edu-desc-${i}`}
                value={edu.desc} onChange={e => updateEntry('education', i, 'desc', e.target.value)}
                placeholder="Achievements, GPA…" rows={2} span />
            </div>
          </div>
        ))}
        <button type="button" className="resume-add-btn" onClick={() => addEntry('education', EMPTY_EDU)}>+ Add Education</button>

        {/* ---- Skills & Languages ---- */}
        <h3 style={{ color: '#1a73e8', margin: '20px 0 10px', fontSize: 15 }}>🛠️ Skills & Languages</h3>
        <div className="form-grid">
          <FormField label="Skills (comma-separated)" name="skills"
            value={data.skills} onChange={onChange}
            placeholder="e.g. React, Node.js, Python, SQL" span />

          <FormField label="Languages (comma-separated)" name="languages"
            value={data.languages} onChange={onChange}
            placeholder="e.g. English, Hindi, Marathi" span />
        </div>

        <div className="form-actions" style={{ marginTop: 24 }}>
          <button className="btn-back-form" onClick={onBack}>← Back</button>
          <button className="btn-generate" onClick={onGenerate}
            style={{ background: 'linear-gradient(135deg,#1a73e8,#2d3748)', color: '#fff', boxShadow: '0 8px 24px rgba(26,115,232,.4)' }}>
            📄 Generate Resume
          </button>
        </div>
      </div>
    </div>
  );
}
