export default function ResumeCardPreview({ data }) {
  const {
    fullName, jobTitle, email, phone, location, linkedin,
    summary, experience, education, skills, languages, photoPreview,
  } = data;

  const skillArr = skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : [];
  const langArr  = languages ? languages.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <div id="resume-card-print" className="resume-card">

      {/* ---- Header ---- */}
      <div className="resume-header">
        {photoPreview && <img src={photoPreview} alt={fullName} className="resume-photo" />}
        <div className="resume-header-info">
          <div className="resume-name">{fullName || 'Your Name'}</div>
          {jobTitle && <div className="resume-jobtitle">{jobTitle}</div>}
          <div className="resume-contact-row">
            {email && <span>📧 {email}</span>}
            {phone && <span>📞 {phone}</span>}
            {location && <span>📍 {location}</span>}
            {linkedin && <span>🔗 {linkedin}</span>}
          </div>
        </div>
      </div>

      {/* ---- Body ---- */}
      <div className="resume-body">

        {/* Professional Summary */}
        {summary && (
          <div className="resume-section">
            <div className="resume-section-title">Professional Summary</div>
            <div className="resume-summary">{summary}</div>
          </div>
        )}

        {/* Work Experience */}
        {experience.length > 0 && experience.some(e => e.title || e.company) && (
          <div className="resume-section">
            <div className="resume-section-title">Work Experience</div>
            {experience.map((exp, i) => (
              (exp.title || exp.company) && (
                <div className="resume-entry" key={i}>
                  <div className="resume-entry-header">
                    <span className="resume-entry-title">{exp.title}</span>
                    {(exp.from || exp.to) && (
                      <span className="resume-entry-date">{exp.from}{exp.from && exp.to ? ' – ' : ''}{exp.to}</span>
                    )}
                  </div>
                  {exp.company && <div className="resume-entry-subtitle">{exp.company}</div>}
                  {exp.desc && <div className="resume-entry-desc">{exp.desc}</div>}
                </div>
              )
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && education.some(e => e.degree || e.institution) && (
          <div className="resume-section">
            <div className="resume-section-title">Education</div>
            {education.map((edu, i) => (
              (edu.degree || edu.institution) && (
                <div className="resume-entry" key={i}>
                  <div className="resume-entry-header">
                    <span className="resume-entry-title">{edu.degree}</span>
                    {(edu.from || edu.to) && (
                      <span className="resume-entry-date">{edu.from}{edu.from && edu.to ? ' – ' : ''}{edu.to}</span>
                    )}
                  </div>
                  {edu.institution && <div className="resume-entry-subtitle">{edu.institution}</div>}
                  {edu.desc && <div className="resume-entry-desc">{edu.desc}</div>}
                </div>
              )
            ))}
          </div>
        )}

        {/* Skills */}
        {skillArr.length > 0 && (
          <div className="resume-section">
            <div className="resume-section-title">Skills</div>
            <div className="resume-skills-list">
              {skillArr.map((s, i) => <span className="resume-skill-tag" key={i}>{s}</span>)}
            </div>
          </div>
        )}

        {/* Languages */}
        {langArr.length > 0 && (
          <div className="resume-section">
            <div className="resume-section-title">Languages</div>
            <div className="resume-lang-list">
              {langArr.map((l, i) => <span key={i}>🗣️ {l}</span>)}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
