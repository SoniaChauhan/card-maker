/**
 * 14 Resume Templates — each renders the same data in a distinct layout.
 * Supports section reordering via data.sectionOrder.
 */

export const DEFAULT_SECTION_ORDER = ['summary', 'skills', 'experience', 'projects', 'education', 'languages', 'interests'];

/** Default column assignments per template (left/right). Single-column templates omitted. */
export const TEMPLATE_COLUMN_DEFAULTS = {
  'artsy-corner':    { left: ['summary', 'experience', 'projects'], right: ['skills', 'education', 'languages'] },
  'clean-classic':   { left: ['summary', 'experience', 'education', 'languages', 'interests'], right: ['skills', 'projects'] },
  'hexagon-modern':  { left: ['summary', 'experience', 'education', 'languages'], right: ['skills', 'projects', 'interests'] },
  'elegant-minimal': { left: ['summary', 'experience', 'education', 'languages'], right: ['skills', 'projects', 'interests'] },
  'bold-executive':  { left: ['summary', 'skills', 'education', 'languages'], right: ['experience', 'projects', 'interests'] },
  'simple-starter':  { left: ['interests', 'summary', 'experience', 'education'], right: ['skills', 'projects', 'languages'] },
  'dark-header-pro': { left: ['summary', 'experience', 'education', 'languages', 'interests'], right: ['skills', 'projects'] },
  'classic-photo':   { left: ['experience', 'projects'], right: ['skills'], full: ['summary', 'education', 'languages', 'interests'] },
  'magazine-split':  { left: ['skills', 'languages', 'interests'], right: ['summary', 'experience', 'projects', 'education'] },
};

/** Render section map values in the order given by sectionOrder */
function ordered(sections, sectionOrder) {
  return (sectionOrder || DEFAULT_SECTION_ORDER).reduce((acc, key) => {
    if (sections[key]) acc.push(sections[key]);
    return acc;
  }, []);
}

/* ── Helper: split comma-separated string ── */
function splitList(str) {
  return str ? str.split(',').map(s => s.trim()).filter(Boolean) : [];
}

/* ── Helper: get initials ── */
function initials(name) {
  if (!name) return 'NA';
  return name.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

/* ── Helper: accent style object from accentColor prop ── */
function ac(color) {
  return color ? { '--rt-accent': color } : {};
}

/* ── Helper: render contact items in configurable order with drag attributes ── */
const CONTACT_ICONS = { phone: '📞', email: '📧', location: '📍' };
export const DEFAULT_CONTACT_ORDER = ['phone', 'email', 'location'];
function renderContactItems(data, opts) {
  const order = data.contactOrder || DEFAULT_CONTACT_ORDER;
  const icons = opts?.icons === false ? {} : CONTACT_ICONS;
  let idx = 0;
  return order.map(k => {
    const val = data[k];
    if (!val) return null;
    const prefix = icons[k] ? `${icons[k]} ` : '';
    return <span key={k} data-item-type="contact" data-item-idx={idx++}>{prefix}{val}</span>;
  }).filter(Boolean);
}

/* ── SVG Avatar Placeholder ── */
function AvatarPlaceholder({ className }) {
  return (
    <div className={`rt-avatar-placeholder ${className || ''}`}>
      <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="60" r="60" fill="#e2e8f0" />
        <circle cx="60" cy="45" r="20" fill="#94a3b8" />
        <ellipse cx="60" cy="95" rx="35" ry="25" fill="#94a3b8" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE 1 — Artsy Corner
   Decorative colored corners, name large caps, contact right
═══════════════════════════════════════════════════════════ */
export function Template1({ data, accentColor }) {
  const { fullName, jobTitle, email, phone, location, summary, experience, education, projects, skills, languages, interests, photoPreview, sectionOrder, columnConfig, contactOrder } = data;
  const leftKeys = new Set(columnConfig?.left || ['summary', 'experience', 'projects']);
  const rightKeys = new Set(columnConfig?.right || ['skills', 'education', 'languages']);
  const sections = {
    summary: summary && <div key="summary" data-section="summary"><h3 className="rt-sh">SUMMARY</h3><p className="rt-p">{summary}</p></div>,
    experience: experience?.length > 0 && experience.some(e => e.title) && (
      <div key="experience" data-section="experience"><h3 className="rt-sh">EXPERIENCE</h3>
      {experience.map((e, i) => e.title && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role">{e.title}{e.from || e.to ? `, ${e.from}${e.to ? ' – ' + e.to : ''}` : ''}</div>
          <div className="rt-entry-co">{e.company}{e.location ? ` — ${e.location}` : ''}</div>
          {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</div>
    ),
    projects: projects?.length > 0 && projects.some(p => p.name) && (
      <div key="projects" data-section="projects"><h3 className="rt-sh">PROJECTS</h3>
      {projects.map((p, i) => p.name && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role">{p.name}</div>
          {p.tech && <div className="rt-entry-co">{p.tech}</div>}
          {p.desc && <ul className="rt-ul">{p.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</div>
    ),
    skills: skills && <div key="skills" data-section="skills"><h3 className="rt-sh">SKILLS</h3><ul className="rt-ul">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul></div>,
    education: education?.length > 0 && education.some(e => e.degree) && (
      <div key="education" data-section="education"><h3 className="rt-sh">EDUCATION AND TRAINING</h3>
      {education.map((e, i) => e.degree && (
        <div key={i} className="rt-entry-sm">
          <strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}
        </div>
      ))}</div>
    ),
    languages: languages && <div key="languages" data-section="languages"><h3 className="rt-sh">LANGUAGES</h3>
      <div className="rt-lang-table">{splitList(languages).map((l, i) => {
        const [lang, ...rest] = l.split(':');
        return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
      })}</div></div>,
  };
  const order = sectionOrder || DEFAULT_SECTION_ORDER;
  return (
    <div className="rt rt-artsy" style={ac(accentColor)}>
      <div className="rt-artsy-corner tl" /><div className="rt-artsy-corner tr" /><div className="rt-artsy-corner bl" /><div className="rt-artsy-corner br" />
      {photoPreview ? <img src={photoPreview} alt="" className="rt-artsy-photo" /> : <AvatarPlaceholder className="rt-artsy-photo" />}
      <h1 className="rt-artsy-name">{fullName || 'YOUR NAME'}</h1>
      {jobTitle && <div className="rt-artsy-job">{jobTitle}</div>}
      <div className="rt-artsy-body">
        <div className="rt-artsy-left">
          {ordered(sections, order.filter(k => leftKeys.has(k)))}
        </div>
        <div className="rt-artsy-right">
          <h3 className="rt-sh">CONTACT</h3>
          <div className="rt-contact-list">
            {renderContactItems(data)}
          </div>
          {ordered(sections, order.filter(k => rightKeys.has(k)))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE 2 — Clean Classic
   Name centered, thin line, contact strip, two‑column body
═══════════════════════════════════════════════════════════ */
export function Template2({ data, accentColor }) {
  const { fullName, email, phone, location, summary, experience, education, projects, skills, languages, interests, sectionOrder, columnConfig } = data;
  const mainKeys = new Set(columnConfig?.left || ['summary', 'experience', 'education', 'languages', 'interests']);
  const sideKeys = new Set(columnConfig?.right || ['skills', 'projects']);
  const sections = {
    summary: summary && <div key="summary" data-section="summary"><h3 className="rt-sh">SUMMARY</h3><p className="rt-p">{summary}</p></div>,
    experience: experience?.length > 0 && experience.some(e => e.title) && (
      <div key="experience" data-section="experience"><h3 className="rt-sh">EXPERIENCE</h3>
      {experience.map((e, i) => e.title && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role">{e.title}, {e.from}{e.to ? ' – ' + e.to : ''}</div>
          <div className="rt-entry-co">{e.company}{e.location ? `, ${e.location}` : ''}</div>
          {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</div>
    ),
    education: education?.length > 0 && education.some(e => e.degree) && (
      <div key="education" data-section="education"><h3 className="rt-sh">EDUCATION AND TRAINING</h3>
      {education.map((e, i) => e.degree && (
        <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}</div>
      ))}</div>
    ),
    languages: languages && <div key="languages" data-section="languages"><h3 className="rt-sh">LANGUAGES</h3>
      <div className="rt-lang-table">{splitList(languages).map((l, i) => {
        const [lang, ...rest] = l.split(':');
        return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
      })}</div></div>,
    interests: interests && <div key="interests" data-section="interests"><h3 className="rt-sh">INTERESTS AND HOBBIES</h3><ul className="rt-ul">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul></div>,
    skills: skills && <div key="skills" data-section="skills"><h3 className="rt-sh">SKILLS</h3><ul className="rt-ul">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul></div>,
    projects: projects?.length > 0 && projects.some(p => p.name) && (
      <div key="projects" data-section="projects"><h3 className="rt-sh">PROJECTS</h3>
      {projects.map((p, i) => p.name && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role">{p.name}</div>
          {p.tech && <div className="rt-entry-co">{p.tech}</div>}
          {p.desc && <ul className="rt-ul">{p.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</div>
    ),
  };
  const order = sectionOrder || DEFAULT_SECTION_ORDER;
  return (
    <div className="rt rt-clean" style={ac(accentColor)}>
      <h1 className="rt-clean-name">{fullName || 'Your Name'}</h1>
      <div className="rt-clean-contact">{renderContactItems(data, { icons: false })}</div>
      <div className="rt-divider" />
      <div className="rt-two-col">
        <div className="rt-col-main">{ordered(sections, order.filter(k => mainKeys.has(k)))}</div>
        <div className="rt-col-side">
          <h3 className="rt-sh">CONTACT</h3>
          <div className="rt-contact-list">{renderContactItems(data)}</div>
          {ordered(sections, order.filter(k => sideKeys.has(k)))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE 3 — Hexagon Modern
   Hexagon initials top‑left, name right, contact right, two‑col body
═══════════════════════════════════════════════════════════ */
export function Template3({ data, accentColor }) {
  const { fullName, email, phone, location, summary, experience, education, projects, skills, languages, interests, photoPreview, sectionOrder, columnConfig } = data;
  const mainKeys = new Set(columnConfig?.left || ['summary', 'experience', 'education', 'languages']);
  const sideKeys = new Set(columnConfig?.right || ['skills', 'projects', 'interests']);
  const sections = {
    summary: summary && <div key="summary" data-section="summary"><h3 className="rt-sh rt-sh-blue">Summary</h3><p className="rt-p">{summary}</p></div>,
    experience: experience?.length > 0 && experience.some(e => e.title) && (
      <div key="experience" data-section="experience"><h3 className="rt-sh rt-sh-blue">Experience</h3>
      {experience.map((e, i) => e.title && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role">{e.title}, {e.from}{e.to ? ' – ' + e.to : ''}</div>
          <div className="rt-entry-co">{e.company}{e.location ? `, ${e.location}` : ''}</div>
          {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</div>
    ),
    education: education?.length > 0 && education.some(e => e.degree) && (
      <div key="education" data-section="education"><h3 className="rt-sh rt-sh-blue">Education and Training</h3>
      {education.map((e, i) => e.degree && (
        <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}</div>
      ))}</div>
    ),
    languages: languages && <div key="languages" data-section="languages"><h3 className="rt-sh rt-sh-blue">Languages</h3>
      <div className="rt-lang-table">{splitList(languages).map((l, i) => {
        const [lang, ...rest] = l.split(':');
        return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
      })}</div></div>,
    skills: skills && <div key="skills" data-section="skills"><h3 className="rt-sh rt-sh-blue">Skills</h3><ul className="rt-ul">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul></div>,
    projects: projects?.length > 0 && projects.some(p => p.name) && (
      <div key="projects" data-section="projects"><h3 className="rt-sh rt-sh-blue">Projects</h3>
      {projects.map((p, i) => p.name && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role">{p.name}</div>
          {p.tech && <div className="rt-entry-co">{p.tech}</div>}
          {p.desc && <ul className="rt-ul">{p.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</div>
    ),
    interests: interests && <div key="interests" data-section="interests"><h3 className="rt-sh rt-sh-blue">Interests and Hobbies</h3><ul className="rt-ul">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul></div>,
  };
  const order = sectionOrder || DEFAULT_SECTION_ORDER;
  return (
    <div className="rt rt-hexagon" style={ac(accentColor)}>
      <div className="rt-hex-header">
        <div className="rt-hex-badge">{photoPreview ? <img src={photoPreview} alt="" /> : <span>{initials(fullName)}</span>}</div>
        <div className="rt-hex-info">
          <h1>{fullName || 'Your Name'}</h1>
          <div className="rt-hex-contact">{renderContactItems(data, { icons: false })}</div>
        </div>
      </div>
      <div className="rt-two-col">
        <div className="rt-col-main">{ordered(sections, order.filter(k => mainKeys.has(k)))}</div>
        <div className="rt-col-side">{ordered(sections, order.filter(k => sideKeys.has(k)))}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE 4 — Elegant Minimal
   Name centered, contact dots, two‑col body, clean minimal
═══════════════════════════════════════════════════════════ */
export function Template4({ data, accentColor }) {
  const { fullName, email, phone, location, summary, experience, education, projects, skills, languages, interests, sectionOrder, columnConfig } = data;
  const mainKeys = new Set(columnConfig?.left || ['summary', 'experience', 'education', 'languages']);
  const sideKeys = new Set(columnConfig?.right || ['skills', 'projects', 'interests']);
  const sections = {
    summary: summary && <div key="summary" data-section="summary"><h3 className="rt-sh">SUMMARY</h3><p className="rt-p">{summary}</p></div>,
    experience: experience?.length > 0 && experience.some(e => e.title) && (
      <div key="experience" data-section="experience"><h3 className="rt-sh">EXPERIENCE</h3>
      {experience.map((e, i) => e.title && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role"><em>{e.title}</em>, {e.from}{e.to ? ' – ' + e.to : ''}</div>
          <div className="rt-entry-co">{e.company}{e.location ? ` — ${e.location}` : ''}</div>
          {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</div>
    ),
    education: education?.length > 0 && education.some(e => e.degree) && (
      <div key="education" data-section="education"><h3 className="rt-sh">EDUCATION AND TRAINING</h3>
      {education.map((e, i) => e.degree && (
        <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}</div>
      ))}</div>
    ),
    languages: languages && <div key="languages" data-section="languages"><h3 className="rt-sh">LANGUAGES</h3>
      <div className="rt-lang-table">{splitList(languages).map((l, i) => {
        const [lang, ...rest] = l.split(':');
        return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
      })}</div></div>,
    skills: skills && <div key="skills" data-section="skills"><h3 className="rt-sh">SKILLS</h3><ul className="rt-ul">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul></div>,
    projects: projects?.length > 0 && projects.some(p => p.name) && (
      <div key="projects" data-section="projects"><h3 className="rt-sh">PROJECTS</h3>
      {projects.map((p, i) => p.name && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role">{p.name}</div>
          {p.tech && <div className="rt-entry-co">{p.tech}</div>}
          {p.desc && <ul className="rt-ul">{p.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</div>
    ),
    interests: interests && <div key="interests" data-section="interests"><h3 className="rt-sh">INTERESTS AND HOBBIES</h3><ul className="rt-ul">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul></div>,
  };
  const order = sectionOrder || DEFAULT_SECTION_ORDER;
  return (
    <div className="rt rt-elegant" style={ac(accentColor)}>
      <h1 className="rt-elegant-name">{fullName || 'Your Name'}</h1>
      <div className="rt-elegant-contact">{renderContactItems(data, { icons: false })}</div>
      <div className="rt-divider" />
      <div className="rt-two-col">
        <div className="rt-col-main">{ordered(sections, order.filter(k => mainKeys.has(k)))}</div>
        <div className="rt-col-side">{ordered(sections, order.filter(k => sideKeys.has(k)))}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE 5 — Bold Executive
   Large initials + dark maroon header, contact left with icons
═══════════════════════════════════════════════════════════ */
export function Template5({ data, accentColor }) {
  const { fullName, email, phone, location, summary, experience, education, projects, skills, languages, interests, photoPreview, sectionOrder, columnConfig } = data;
  const leftKeys = new Set(columnConfig?.left || ['summary', 'skills', 'education', 'languages']);
  const rightKeys = new Set(columnConfig?.right || ['experience', 'projects', 'interests']);
  const sections = {
    summary: summary && <div key="summary" data-section="summary"><h3 className="rt-sh">SUMMARY</h3><p className="rt-p">{summary}</p></div>,
    skills: skills && <div key="skills" data-section="skills"><h3 className="rt-sh">SKILLS</h3><ul className="rt-ul">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul></div>,
    education: education?.length > 0 && education.some(e => e.degree) && (
      <div key="education" data-section="education"><h3 className="rt-sh">EDUCATION AND TRAINING</h3>
      {education.map((e, i) => e.degree && (
        <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}</div>
      ))}</div>
    ),
    languages: languages && <div key="languages" data-section="languages"><h3 className="rt-sh">LANGUAGES</h3>
      <div className="rt-lang-table">{splitList(languages).map((l, i) => {
        const [lang, ...rest] = l.split(':');
        return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
      })}</div></div>,
    experience: experience?.length > 0 && experience.some(e => e.title) && (
      <div key="experience" data-section="experience"><h3 className="rt-sh">EXPERIENCE</h3>
      {experience.map((e, i) => e.title && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role">{e.title}, {e.from}{e.to ? ' – ' + e.to : ''}</div>
          <div className="rt-entry-co">{e.company}{e.location ? ` — ${e.location}` : ''}</div>
          {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</div>
    ),
    projects: projects?.length > 0 && projects.some(p => p.name) && (
      <div key="projects" data-section="projects"><h3 className="rt-sh">PROJECTS</h3>
      {projects.map((p, i) => p.name && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role">{p.name}</div>
          {p.tech && <div className="rt-entry-co">{p.tech}</div>}
          {p.desc && <ul className="rt-ul">{p.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</div>
    ),
    interests: interests && <div key="interests" data-section="interests"><h3 className="rt-sh">INTERESTS AND HOBBIES</h3><ul className="rt-ul">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul></div>,
  };
  const order = sectionOrder || DEFAULT_SECTION_ORDER;
  return (
    <div className="rt rt-bold" style={ac(accentColor)}>
      <div className="rt-bold-header">
        <div className="rt-bold-initials">{photoPreview ? <img src={photoPreview} alt="" /> : <span>{initials(fullName)}</span>}</div>
        <div className="rt-bold-name-block">
          <h1>{(fullName || 'YOUR NAME').toUpperCase()}</h1>
        </div>
      </div>
      <div className="rt-bold-body">
        <div className="rt-bold-left">
          <div className="rt-contact-list">
            {renderContactItems(data)}
          </div>
          {ordered(sections, order.filter(k => leftKeys.has(k)))}
        </div>
        <div className="rt-bold-right">
          {ordered(sections, order.filter(k => rightKeys.has(k)))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE 6 — Simple Starter
   Name top‑right, contact below, hobbies first, then summary/skills
═══════════════════════════════════════════════════════════ */
export function Template6({ data, accentColor }) {
  const { fullName, email, phone, location, summary, experience, education, projects, skills, languages, interests, sectionOrder, columnConfig } = data;
  const mainKeys = new Set(columnConfig?.left || ['interests', 'summary', 'experience', 'education']);
  const sideKeys = new Set(columnConfig?.right || ['skills', 'projects', 'languages']);
  const sections = {
    interests: interests && <div key="interests" data-section="interests"><h3 className="rt-sh">Interests and Hobbies</h3><ul className="rt-ul">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul></div>,
    summary: summary && <div key="summary" data-section="summary"><h3 className="rt-sh">Summary</h3><p className="rt-p">{summary}</p></div>,
    experience: experience?.length > 0 && experience.some(e => e.title) && (
      <div key="experience" data-section="experience"><h3 className="rt-sh">Experience</h3>
      {experience.map((e, i) => e.title && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role">{e.title}, {e.from}{e.to ? ' – ' + e.to : ''}</div>
          <div className="rt-entry-co">{e.company}{e.location ? ` — ${e.location}` : ''}</div>
          {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</div>
    ),
    education: education?.length > 0 && education.some(e => e.degree) && (
      <div key="education" data-section="education"><h3 className="rt-sh">Education and Training</h3>
      {education.map((e, i) => e.degree && (
        <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}</div>
      ))}</div>
    ),
    skills: skills && <div key="skills" data-section="skills"><h3 className="rt-sh">Skills</h3><ul className="rt-ul">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul></div>,
    projects: projects?.length > 0 && projects.some(p => p.name) && (
      <div key="projects" data-section="projects"><h3 className="rt-sh">Projects</h3>
      {projects.map((p, i) => p.name && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role">{p.name}</div>
          {p.tech && <div className="rt-entry-co">{p.tech}</div>}
          {p.desc && <ul className="rt-ul">{p.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</div>
    ),
    languages: languages && <div key="languages" data-section="languages"><h3 className="rt-sh">Languages</h3>
      <div className="rt-lang-table">{splitList(languages).map((l, i) => {
        const [lang, ...rest] = l.split(':');
        return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
      })}</div></div>,
  };
  const order = sectionOrder || DEFAULT_SECTION_ORDER;
  return (
    <div className="rt rt-simple" style={ac(accentColor)}>
      <div className="rt-simple-header">
        <h1>{fullName || 'Your Name'}</h1>
        <div className="rt-simple-contact">{renderContactItems(data, { icons: false })}</div>
      </div>
      <div className="rt-divider" />
      <div className="rt-two-col">
        <div className="rt-col-main">{ordered(sections, order.filter(k => mainKeys.has(k)))}</div>
        <div className="rt-col-side">{ordered(sections, order.filter(k => sideKeys.has(k)))}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE 7 — Dark Header Pro
   Dark gray header with initials + large name, colored strip
═══════════════════════════════════════════════════════════ */
export function Template7({ data, accentColor }) {
  const { fullName, email, phone, location, summary, experience, education, projects, skills, languages, interests, photoPreview, sectionOrder, columnConfig } = data;
  const mainKeys = new Set(columnConfig?.left || ['summary', 'experience', 'education', 'languages', 'interests']);
  const sideKeys = new Set(columnConfig?.right || ['skills', 'projects']);
  const sections = {
    summary: summary && <div key="summary" data-section="summary"><h3 className="rt-sh">SUMMARY</h3><p className="rt-p">{summary}</p></div>,
    experience: experience?.length > 0 && experience.some(e => e.title) && (
      <div key="experience" data-section="experience"><h3 className="rt-sh">EXPERIENCE</h3>
      {experience.map((e, i) => e.title && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role">{e.title}, {e.from}{e.to ? ' – ' + e.to : ''}</div>
          <div className="rt-entry-co">{e.company}{e.location ? ` — ${e.location}` : ''}</div>
          {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</div>
    ),
    education: education?.length > 0 && education.some(e => e.degree) && (
      <div key="education" data-section="education"><h3 className="rt-sh">EDUCATION AND TRAINING</h3>
      {education.map((e, i) => e.degree && (
        <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}</div>
      ))}</div>
    ),
    languages: languages && <div key="languages" data-section="languages"><h3 className="rt-sh">LANGUAGES</h3>
      <div className="rt-lang-table">{splitList(languages).map((l, i) => {
        const [lang, ...rest] = l.split(':');
        return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
      })}</div></div>,
    interests: interests && <div key="interests" data-section="interests"><h3 className="rt-sh">INTERESTS AND HOBBIES</h3><ul className="rt-ul">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul></div>,
    skills: skills && <div key="skills" data-section="skills"><h3 className="rt-sh">SKILLS</h3><ul className="rt-ul">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul></div>,
    projects: projects?.length > 0 && projects.some(p => p.name) && (
      <div key="projects" data-section="projects"><h3 className="rt-sh">PROJECTS</h3>
      {projects.map((p, i) => p.name && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role">{p.name}</div>
          {p.tech && <div className="rt-entry-co">{p.tech}</div>}
          {p.desc && <ul className="rt-ul">{p.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</div>
    ),
  };
  const order = sectionOrder || DEFAULT_SECTION_ORDER;
  return (
    <div className="rt rt-darkpro" style={ac(accentColor)}>
      <div className="rt-darkpro-header">
        <div className="rt-darkpro-init">{photoPreview ? <img src={photoPreview} alt="" /> : initials(fullName)}</div>
        <div className="rt-darkpro-sep" />
        <h1>{(fullName || 'YOUR NAME').toUpperCase()}</h1>
      </div>
      <div className="rt-darkpro-strip">{renderContactItems(data, { icons: false })}</div>
      <div className="rt-two-col">
        <div className="rt-col-main">{ordered(sections, order.filter(k => mainKeys.has(k)))}</div>
        <div className="rt-col-side">{ordered(sections, order.filter(k => sideKeys.has(k)))}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE 8 — Teal Corporate
   Teal/dark top bar with contact, name below, table‑style sections
═══════════════════════════════════════════════════════════ */
export function Template8({ data, accentColor }) {
  const { fullName, email, phone, location, summary, experience, education, projects, skills, languages, interests, sectionOrder } = data;
  const sections = {
    summary: summary && <div key="summary" data-section="summary" className="rt-teal-row"><div className="rt-teal-label">Summary</div><div className="rt-teal-val"><p className="rt-p">{summary}</p></div></div>,
    skills: skills && <div key="skills" data-section="skills" className="rt-teal-row"><div className="rt-teal-label">Skills</div><div className="rt-teal-val"><ul className="rt-ul rt-ul-inline">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul></div></div>,
    experience: experience?.length > 0 && experience.some(e => e.title) && (
      <div key="experience" data-section="experience" className="rt-teal-row"><div className="rt-teal-label">Experience</div><div className="rt-teal-val">
        {experience.map((e, i) => e.title && (
          <div key={i} className="rt-entry">
            <div className="rt-entry-role">{e.title}, {e.from}{e.to ? ' – ' + e.to : ''}</div>
            <div className="rt-entry-co">{e.company}{e.location ? `, ${e.location}` : ''}</div>
            {e.desc && <p className="rt-p rt-p-sm">{e.desc}</p>}
          </div>
        ))}
      </div></div>
    ),
    projects: projects?.length > 0 && projects.some(p => p.name) && (
      <div key="projects" data-section="projects" className="rt-teal-row"><div className="rt-teal-label">Projects</div><div className="rt-teal-val">
        {projects.map((p, i) => p.name && (
          <div key={i} className="rt-entry">
            <div className="rt-entry-role">{p.name}</div>
            {p.tech && <div className="rt-entry-co">{p.tech}</div>}
            {p.desc && <p className="rt-p rt-p-sm">{p.desc}</p>}
          </div>
        ))}
      </div></div>
    ),
    education: education?.length > 0 && education.some(e => e.degree) && (
      <div key="education" data-section="education" className="rt-teal-row"><div className="rt-teal-label">Education and Training</div><div className="rt-teal-val">
        {education.map((e, i) => e.degree && (
          <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}</div>
        ))}
      </div></div>
    ),
    languages: languages && <div key="languages" data-section="languages" className="rt-teal-row"><div className="rt-teal-label">Languages</div><div className="rt-teal-val">
      <div className="rt-lang-table">{splitList(languages).map((l, i) => {
        const [lang, ...rest] = l.split(':');
        return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
      })}</div>
    </div></div>,
    interests: interests && <div key="interests" data-section="interests" className="rt-teal-row"><div className="rt-teal-label">Interests</div><div className="rt-teal-val"><ul className="rt-ul">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul></div></div>,
  };
  return (
    <div className="rt rt-teal" style={ac(accentColor)}>
      <div className="rt-teal-bar">{renderContactItems(data, { icons: false })}</div>
      <h1 className="rt-teal-name">{fullName || 'Your Name'}</h1>
      <div className="rt-teal-body">
        {ordered(sections, sectionOrder)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE 9 — Sidebar Pro
   Left colored sidebar with section titles, right side content
═══════════════════════════════════════════════════════════ */
export function Template9({ data, accentColor }) {
  const { fullName, email, phone, location, summary, experience, education, projects, skills, languages, interests, photoPreview, sectionOrder } = data;
  const order = sectionOrder || DEFAULT_SECTION_ORDER;
  const sectionContent = {
    summary: summary && <div key="summary" data-section="summary"><p className="rt-p">{summary}</p></div>,
    skills: skills && <div key="skills" data-section="skills"><ul className="rt-ul rt-ul-two-col">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul></div>,
    experience: experience?.length > 0 && experience.some(e => e.title) && (
      <div key="experience" data-section="experience" className="rt-sidebar-section">
        {experience.map((e, i) => e.title && (
          <div key={i} className="rt-entry">
            <div className="rt-entry-role">{e.title}, <strong>{e.company}</strong></div>
            <div className="rt-entry-date">{e.from}{e.to ? ' – ' + e.to : ''}{e.location ? `, ${e.location}` : ''}</div>
            {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
          </div>
        ))}
      </div>
    ),
    projects: projects?.length > 0 && projects.some(p => p.name) && (
      <div key="projects" data-section="projects" className="rt-sidebar-section">
        {projects.map((p, i) => p.name && (
          <div key={i} className="rt-entry">
            <div className="rt-entry-role">{p.name}</div>
            {p.tech && <div className="rt-entry-date">{p.tech}</div>}
            {p.desc && <ul className="rt-ul">{p.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
          </div>
        ))}
      </div>
    ),
    education: education?.length > 0 && education.some(e => e.degree) && (
      <div key="education" data-section="education" className="rt-sidebar-section">
        {education.map((e, i) => e.degree && (
          <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}</div>
        ))}
      </div>
    ),
    languages: languages && <div key="languages" data-section="languages"><div className="rt-lang-table">{splitList(languages).map((l, i) => {
      const [lang, ...rest] = l.split(':');
      return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
    })}</div></div>,
  };
  const sectionLabels = {
    summary: 'Summary',
    skills: 'Skills',
    experience: 'Experience',
    projects: 'Projects',
    education: 'Education And Training',
    languages: 'Languages',
  };
  const activeOrder = order.filter(k => sectionContent[k]);
  return (
    <div className="rt rt-sidebar" style={ac(accentColor)}>
      <div className="rt-sidebar-header">
        <div className="rt-sidebar-avatar">
          {photoPreview ? <img src={photoPreview} alt="" /> : <AvatarPlaceholder />}
        </div>
        <h1>{fullName || 'Your Name'}</h1>
        <div className="rt-sidebar-contact">{renderContactItems(data, { icons: false })}</div>
      </div>
      <div className="rt-sidebar-body">
        <div className="rt-sidebar-left">
          {activeOrder.map(k => <h3 key={k} className="rt-sidebar-sh">{sectionLabels[k]}</h3>)}
        </div>
        <div className="rt-sidebar-right">
          {ordered(sectionContent, order)}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE 10 — Table Row Pink
   Pink left accent strip, photo top‑right, table‑row sections
   (matches screenshot 1 — "Recommended" style)
═══════════════════════════════════════════════════════════ */
export function Template10({ data, accentColor }) {
  const { fullName, jobTitle, email, phone, location, summary, experience, education, projects, skills, languages, interests, photoPreview, sectionOrder } = data;
  const sections = {
    summary: summary && (
      <div key="summary" data-section="summary" className="rt-tablerow-row">
        <div className="rt-tablerow-label">SUMMARY</div>
        <div className="rt-tablerow-val"><p className="rt-p">{summary}</p></div>
      </div>
    ),
    skills: skills && (
      <div key="skills" data-section="skills" className="rt-tablerow-row">
        <div className="rt-tablerow-label">SKILLS</div>
        <div className="rt-tablerow-val"><ul className="rt-ul rt-ul-inline">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul></div>
      </div>
    ),
    experience: experience?.length > 0 && experience.some(e => e.title) && (
      <div key="experience" data-section="experience" className="rt-tablerow-row">
        <div className="rt-tablerow-label">EXPERIENCE</div>
        <div className="rt-tablerow-val">
          {experience.map((e, i) => e.title && (
            <div key={i} className="rt-entry">
              <div className="rt-entry-role">{e.title}, {e.from}{e.to ? ' – ' + e.to : ''}</div>
              <div className="rt-entry-co">{e.company}{e.location ? ` — ${e.location}` : ''}</div>
              {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
            </div>
          ))}
        </div>
      </div>
    ),
    projects: projects?.length > 0 && projects.some(p => p.name) && (
      <div key="projects" data-section="projects" className="rt-tablerow-row">
        <div className="rt-tablerow-label">PROJECTS</div>
        <div className="rt-tablerow-val">
          {projects.map((p, i) => p.name && (
            <div key={i} className="rt-entry">
              <div className="rt-entry-role">{p.name}</div>
              {p.tech && <div className="rt-entry-co">{p.tech}</div>}
              {p.desc && <ul className="rt-ul">{p.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
            </div>
          ))}
        </div>
      </div>
    ),
    education: education?.length > 0 && education.some(e => e.degree) && (
      <div key="education" data-section="education" className="rt-tablerow-row">
        <div className="rt-tablerow-label">EDUCATION AND TRAINING</div>
        <div className="rt-tablerow-val">
          {education.map((e, i) => e.degree && (
            <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}{e.location ? ` — ${e.location}` : ''}</div>
          ))}
        </div>
      </div>
    ),
    languages: languages && (
      <div key="languages" data-section="languages" className="rt-tablerow-row">
        <div className="rt-tablerow-label">LANGUAGES</div>
        <div className="rt-tablerow-val">
          <div className="rt-lang-table">{splitList(languages).map((l, i) => {
            const [lang, ...rest] = l.split(':');
            return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
          })}</div>
        </div>
      </div>
    ),
    interests: interests && (
      <div key="interests" data-section="interests" className="rt-tablerow-row">
        <div className="rt-tablerow-label">INTERESTS</div>
        <div className="rt-tablerow-val"><ul className="rt-ul">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul></div>
      </div>
    ),
  };
  return (
    <div className="rt rt-tablerow" style={ac(accentColor)}>
      <div className="rt-tablerow-accent" />
      <div className="rt-tablerow-inner">
        <div className="rt-tablerow-top">
          <div className="rt-tablerow-name-block">
            <h1>{(fullName || 'YOUR NAME').toUpperCase()}</h1>
            {jobTitle && <div className="rt-tablerow-job">{jobTitle}</div>}
            <div className="rt-tablerow-contact">
              {renderContactItems(data)}
            </div>
          </div>
          {photoPreview ? <img src={photoPreview} alt="" className="rt-tablerow-photo" /> : <AvatarPlaceholder className="rt-tablerow-photo" />}
        </div>
        {ordered(sections, sectionOrder)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE 11 — Classic Photo
   Dark left accent border, photo top‑right, two‑col Experience+Contact/Skills,
   Education & Languages full‑width bottom
   (matches screenshot 2 — with color picker)
═══════════════════════════════════════════════════════════ */
export function Template11({ data, accentColor }) {
  const { fullName, jobTitle, email, phone, location, summary, experience, education, projects, skills, languages, interests, photoPreview, sectionOrder, columnConfig } = data;
  const sections = {
    summary: summary && <div key="summary" data-section="summary"><h3 className="rt-sh rt-sh-accent">SUMMARY</h3><p className="rt-p">{summary}</p></div>,
    experience: experience?.length > 0 && experience.some(e => e.title) && (
      <div key="experience" data-section="experience"><h3 className="rt-sh rt-sh-accent">EXPERIENCE</h3>
      {experience.map((e, i) => e.title && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role">{e.title}, {e.from}{e.to ? ' – ' + e.to : ''}</div>
          <div className="rt-entry-co">{e.company}{e.location ? ` — ${e.location}` : ''}</div>
          {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</div>
    ),
    projects: projects?.length > 0 && projects.some(p => p.name) && (
      <div key="projects" data-section="projects"><h3 className="rt-sh rt-sh-accent">PROJECTS</h3>
      {projects.map((p, i) => p.name && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role">{p.name}</div>
          {p.tech && <div className="rt-entry-co">{p.tech}</div>}
          {p.desc && <ul className="rt-ul">{p.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</div>
    ),
    skills: skills && <div key="skills" data-section="skills"><h3 className="rt-sh rt-sh-accent">SKILLS</h3><ul className="rt-ul">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul></div>,
    education: education?.length > 0 && education.some(e => e.degree) && (
      <div key="education" data-section="education"><h3 className="rt-sh rt-sh-accent">EDUCATION AND TRAINING</h3>
      {education.map((e, i) => e.degree && (
        <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}{e.location ? ` — ${e.location}` : ''}</div>
      ))}</div>
    ),
    languages: languages && <div key="languages" data-section="languages"><h3 className="rt-sh rt-sh-accent">LANGUAGES</h3>
      <div className="rt-lang-table">{splitList(languages).map((l, i) => {
        const [lang, ...rest] = l.split(':');
        return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
      })}</div></div>,
    interests: interests && <div key="interests" data-section="interests"><h3 className="rt-sh rt-sh-accent">INTERESTS AND HOBBIES</h3><ul className="rt-ul">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul></div>,
  };
  const mainKeys = new Set(columnConfig?.left || ['experience', 'projects']);
  const sideKeys = new Set(columnConfig?.right || ['skills']);
  const fullKeys = new Set(columnConfig?.full || ['summary', 'education', 'languages', 'interests']);
  const order = sectionOrder || DEFAULT_SECTION_ORDER;
  return (
    <div className="rt rt-classicphoto" style={ac(accentColor)}>
      <div className="rt-cp-accent" />
      <div className="rt-cp-inner">
        <div className="rt-cp-top">
          <div>
            <h1 className="rt-cp-name">{(fullName || 'YOUR NAME').toUpperCase()}</h1>
            {jobTitle && <div className="rt-cp-job">{jobTitle}</div>}
          </div>
          {photoPreview ? <img src={photoPreview} alt="" className="rt-cp-photo" /> : <AvatarPlaceholder className="rt-cp-photo" />}
        </div>
        {ordered(sections, order.filter(k => fullKeys.has(k) && order.indexOf(k) < order.indexOf('experience')))}
        <div className="rt-cp-two-col">
          <div className="rt-cp-main">{ordered(sections, order.filter(k => mainKeys.has(k)))}</div>
          <div className="rt-cp-side">
            <h3 className="rt-sh rt-sh-accent">CONTACT</h3>
            <div className="rt-contact-list">
              {renderContactItems(data)}
            </div>
            {ordered(sections, order.filter(k => sideKeys.has(k)))}
          </div>
        </div>
        {ordered(sections, order.filter(k => fullKeys.has(k) && order.indexOf(k) >= order.indexOf('experience')))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE 12 — Timeline Blue
   Clean layout, photo top-right, blue accent, date timestamps
   on left margin, colored section headers with icons
═══════════════════════════════════════════════════════════ */
export function Template12({ data, accentColor }) {
  const { fullName, jobTitle, email, phone, location, summary, experience, education, projects, skills, languages, interests, photoPreview, sectionOrder } = data;
  const sections = {
    summary: summary && (
      <div key="summary" data-section="summary" className="rt-tl-section">
        <h3 className="rt-tl-sh">✦ Professional Summary</h3>
        <p className="rt-p">{summary}</p>
      </div>
    ),
    skills: skills && (
      <div key="skills" data-section="skills" className="rt-tl-section">
        <h3 className="rt-tl-sh">★ Skills</h3>
        <ul className="rt-ul rt-ul-inline">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul>
      </div>
    ),
    experience: experience?.length > 0 && experience.some(e => e.title) && (
      <div key="experience" data-section="experience" className="rt-tl-section">
        <h3 className="rt-tl-sh">💼 Work History</h3>
        <div className="rt-tl-entries">
          {experience.map((e, i) => e.title && (
            <div key={i} className="rt-tl-entry">
              <div className="rt-tl-date">{e.from}{e.to ? ` – ${e.to}` : ''}</div>
              <div className="rt-tl-dot" />
              <div className="rt-tl-content">
                <div className="rt-entry-role">{e.title}</div>
                <div className="rt-entry-co">{e.company}{e.location ? ` — ${e.location}` : ''}</div>
                {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    projects: projects?.length > 0 && projects.some(p => p.name) && (
      <div key="projects" data-section="projects" className="rt-tl-section">
        <h3 className="rt-tl-sh">🚀 Projects</h3>
        <div className="rt-tl-entries">
          {projects.map((p, i) => p.name && (
            <div key={i} className="rt-tl-entry">
              <div className="rt-tl-date">{p.tech || ''}</div>
              <div className="rt-tl-dot" />
              <div className="rt-tl-content">
                <div className="rt-entry-role">{p.name}</div>
                {p.desc && <ul className="rt-ul">{p.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    education: education?.length > 0 && education.some(e => e.degree) && (
      <div key="education" data-section="education" className="rt-tl-section">
        <h3 className="rt-tl-sh">🎓 Education</h3>
        <div className="rt-tl-entries">
          {education.map((e, i) => e.degree && (
            <div key={i} className="rt-tl-entry">
              <div className="rt-tl-date">{e.year || ''}</div>
              <div className="rt-tl-dot" />
              <div className="rt-tl-content">
                <div className="rt-entry-role">{e.degree}</div>
                <div className="rt-entry-co">{e.institution}{e.location ? ` — ${e.location}` : ''}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    languages: languages && (
      <div key="languages" data-section="languages" className="rt-tl-section">
        <h3 className="rt-tl-sh">🌐 Languages</h3>
        <div className="rt-lang-table">{splitList(languages).map((l, i) => {
          const [lang, ...rest] = l.split(':');
          return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
        })}</div>
      </div>
    ),
    interests: interests && (
      <div key="interests" data-section="interests" className="rt-tl-section">
        <h3 className="rt-tl-sh">🎯 Interests</h3>
        <ul className="rt-ul">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul>
      </div>
    ),
  };
  return (
    <div className="rt rt-timeline" style={ac(accentColor)}>
      <div className="rt-tl-header">
        <div className="rt-tl-name-block">
          <h1 className="rt-tl-name">{fullName || 'YOUR NAME'}</h1>
          {jobTitle && <div className="rt-tl-job">{jobTitle}</div>}
          <div className="rt-tl-contact">
            {renderContactItems(data)}
          </div>
        </div>
        {photoPreview ? <img src={photoPreview} alt="" className="rt-tl-photo" /> : <AvatarPlaceholder className="rt-tl-photo" />}
      </div>
      <hr className="rt-tl-divider" />
      {ordered(sections, sectionOrder)}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE 13 — Initials Two-Col
   Circle initials badge top-left, two-column layout: section
   labels on the left in accent color, content on the right.
   Contemporary structured layout.
═══════════════════════════════════════════════════════════ */
export function Template13({ data, accentColor }) {
  const { fullName, jobTitle, email, phone, location, summary, experience, education, projects, skills, languages, interests, photoPreview, sectionOrder } = data;
  const sections = {
    summary: summary && (
      <div key="summary" data-section="summary" className="rt-is-row">
        <div className="rt-is-label">PROFESSIONAL SUMMARY</div>
        <div className="rt-is-val"><p className="rt-p">{summary}</p></div>
      </div>
    ),
    skills: skills && (
      <div key="skills" data-section="skills" className="rt-is-row">
        <div className="rt-is-label">SKILLS</div>
        <div className="rt-is-val"><ul className="rt-ul rt-ul-inline">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul></div>
      </div>
    ),
    experience: experience?.length > 0 && experience.some(e => e.title) && (
      <div key="experience" data-section="experience" className="rt-is-row">
        <div className="rt-is-label">WORK HISTORY</div>
        <div className="rt-is-val">
          {experience.map((e, i) => e.title && (
            <div key={i} className="rt-entry">
              <div className="rt-entry-role">{e.title}, {e.from}{e.to ? ' – ' + e.to : ''}</div>
              <div className="rt-entry-co">{e.company}{e.location ? ` — ${e.location}` : ''}</div>
              {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
            </div>
          ))}
        </div>
      </div>
    ),
    projects: projects?.length > 0 && projects.some(p => p.name) && (
      <div key="projects" data-section="projects" className="rt-is-row">
        <div className="rt-is-label">PROJECTS</div>
        <div className="rt-is-val">
          {projects.map((p, i) => p.name && (
            <div key={i} className="rt-entry">
              <div className="rt-entry-role">{p.name}</div>
              {p.tech && <div className="rt-entry-co">{p.tech}</div>}
              {p.desc && <ul className="rt-ul">{p.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
            </div>
          ))}
        </div>
      </div>
    ),
    education: education?.length > 0 && education.some(e => e.degree) && (
      <div key="education" data-section="education" className="rt-is-row">
        <div className="rt-is-label">EDUCATION</div>
        <div className="rt-is-val">
          {education.map((e, i) => e.degree && (
            <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}{e.location ? ` — ${e.location}` : ''}</div>
          ))}
        </div>
      </div>
    ),
    languages: languages && (
      <div key="languages" data-section="languages" className="rt-is-row">
        <div className="rt-is-label">LANGUAGES</div>
        <div className="rt-is-val">
          <div className="rt-lang-table">{splitList(languages).map((l, i) => {
            const [lang, ...rest] = l.split(':');
            return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
          })}</div>
        </div>
      </div>
    ),
    interests: interests && (
      <div key="interests" data-section="interests" className="rt-is-row">
        <div className="rt-is-label">INTERESTS</div>
        <div className="rt-is-val"><ul className="rt-ul">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul></div>
      </div>
    ),
  };
  return (
    <div className="rt rt-initsplit" style={ac(accentColor)}>
      <div className="rt-is-header">
        <div className="rt-is-badge">{photoPreview ? <img src={photoPreview} alt="" className="rt-is-badge-img" /> : initials(fullName)}</div>
        <div className="rt-is-name-block">
          <h1 className="rt-is-name">{(fullName || 'YOUR NAME').toUpperCase()}</h1>
          {jobTitle && <div className="rt-is-job">{jobTitle.toUpperCase()}</div>}
        </div>
      </div>
      <div className="rt-is-contact-bar">
        {renderContactItems(data)}
      </div>
      <div className="rt-is-body">
        {ordered(sections, sectionOrder)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE 14 — Classic Formal
   Traditional centered section headers with horizontal rules,
   2-column skill bars, bold key terms, clean serif-inspired look.
   Matches the "Software Engineer" resume style from screenshots.
═══════════════════════════════════════════════════════════ */
export function Template14({ data, accentColor }) {
  const { fullName, jobTitle, email, phone, location, summary, experience, education, projects, skills, languages, interests, photoPreview, sectionOrder } = data;
  const sections = {
    summary: summary && (
      <div key="summary" data-section="summary" className="rt-fm-section">
        <div className="rt-fm-sh"><span>Professional Summary</span></div>
        <p className="rt-p">{summary}</p>
      </div>
    ),
    skills: skills && (
      <div key="skills" data-section="skills">
        <div className="rt-fm-section">
          <p className="rt-p"><strong>Key Skills: </strong>{skills}</p>
        </div>
        <div className="rt-fm-section">
          <div className="rt-fm-sh"><span>Skills</span></div>
          <div className="rt-fm-skills-grid">
            {splitList(skills).map((s, i) => (
              <div key={i} className="rt-fm-skill">
                <div className="rt-fm-skill-name">{s}</div>
                <div className="rt-fm-skill-bar"><div className="rt-fm-skill-fill" /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    experience: experience?.length > 0 && experience.some(e => e.title) && (
      <div key="experience" data-section="experience" className="rt-fm-section">
        <div className="rt-fm-sh"><span>Work History</span></div>
        {experience.map((e, i) => e.title && (
          <div key={i} className="rt-fm-entry">
            <div className="rt-fm-entry-head">
              <strong>{e.title}</strong>, {e.from}{e.to ? ' - ' + e.to : ''}
            </div>
            <div className="rt-fm-entry-co"><strong>{e.company}</strong>{e.location ? ` – ${e.location}` : ''}</div>
            {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
          </div>
        ))}
      </div>
    ),
    projects: projects?.length > 0 && projects.some(p => p.name) && (
      <div key="projects" data-section="projects" className="rt-fm-section">
        <div className="rt-fm-sh"><span>Projects</span></div>
        {projects.map((p, i) => p.name && (
          <div key={i} className="rt-fm-entry">
            <div className="rt-fm-entry-head"><strong>{p.name}</strong></div>
            {p.tech && <div className="rt-fm-entry-co">{p.tech}</div>}
            {p.desc && <ul className="rt-ul">{p.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
          </div>
        ))}
      </div>
    ),
    education: education?.length > 0 && education.some(e => e.degree) && (
      <div key="education" data-section="education" className="rt-fm-section">
        <div className="rt-fm-sh"><span>Education</span></div>
        {education.map((e, i) => e.degree && (
          <div key={i} className="rt-fm-entry">
            <div className="rt-fm-entry-head"><strong>{e.degree}</strong>{e.year ? `, ${e.year}` : ''}</div>
            <div className="rt-fm-entry-co"><strong>{e.institution}</strong>{e.location ? ` - ${e.location}` : ''}</div>
          </div>
        ))}
      </div>
    ),
    languages: languages && (
      <div key="languages" data-section="languages" className="rt-fm-section">
        <div className="rt-fm-sh"><span>Languages</span></div>
        <div className="rt-lang-table">{splitList(languages).map((l, i) => {
          const [lang, ...rest] = l.split(':');
          return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
        })}</div>
      </div>
    ),
    interests: interests && (
      <div key="interests" data-section="interests" className="rt-fm-section">
        <div className="rt-fm-sh"><span>Interests</span></div>
        <ul className="rt-ul">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul>
      </div>
    ),
  };
  return (
    <div className="rt rt-formal" style={ac(accentColor)}>
      <div className="rt-fm-header">
        <h1 className="rt-fm-name">{fullName || 'YOUR NAME'}</h1>
        {jobTitle && <div className="rt-fm-job">{jobTitle}</div>}
        <div className="rt-fm-contact">
          {renderContactItems(data, { icons: false })}
        </div>
      </div>
      {ordered(sections, sectionOrder)}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE 15 — Gradient Header
   Full-width gradient header with name/title, pill-shaped
   skill tags, clean single-column body.
═══════════════════════════════════════════════════════════ */
export function Template15({ data, accentColor }) {
  const { fullName, jobTitle, email, phone, location, summary, experience, education, projects, skills, languages, interests, sectionOrder } = data;
  const sections = {
    summary: summary && <div key="summary" data-section="summary"><h3 className="rt-sh">Profile</h3><p className="rt-p">{summary}</p></div>,
    skills: skills && <div key="skills" data-section="skills"><h3 className="rt-sh">Skills</h3><div className="rt-grad-pills">{splitList(skills).map((s, i) => <span key={i} className="rt-grad-pill">{s}</span>)}</div></div>,
    experience: experience?.length > 0 && experience.some(e => e.title) && (
      <div key="experience" data-section="experience"><h3 className="rt-sh">Experience</h3>
      {experience.map((e, i) => e.title && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role">{e.title} — {e.company}</div>
          <div className="rt-entry-date">{e.from}{e.to ? ' – ' + e.to : ''}{e.location ? ` | ${e.location}` : ''}</div>
          {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</div>
    ),
    projects: projects?.length > 0 && projects.some(p => p.name) && (
      <div key="projects" data-section="projects"><h3 className="rt-sh">Projects</h3>
      {projects.map((p, i) => p.name && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role">{p.name}</div>
          {p.tech && <div className="rt-entry-date">{p.tech}</div>}
          {p.desc && <ul className="rt-ul">{p.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</div>
    ),
    education: education?.length > 0 && education.some(e => e.degree) && (
      <div key="education" data-section="education"><h3 className="rt-sh">Education</h3>
      {education.map((e, i) => e.degree && (
        <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong> — {e.institution}{e.year ? `, ${e.year}` : ''}</div>
      ))}</div>
    ),
    languages: languages && <div key="languages" data-section="languages"><h3 className="rt-sh">Languages</h3><div className="rt-lang-table">{splitList(languages).map((l, i) => { const [lang, ...rest] = l.split(':'); return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>; })}</div></div>,
    interests: interests && <div key="interests" data-section="interests"><h3 className="rt-sh">Interests</h3><ul className="rt-ul rt-ul-inline">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul></div>,
  };
  return (
    <div className="rt rt-grad" style={ac(accentColor)}>
      <div className="rt-grad-header">
        <h1 className="rt-grad-name">{fullName || 'YOUR NAME'}</h1>
        {jobTitle && <div className="rt-grad-job">{jobTitle}</div>}
        <div className="rt-grad-contact">{renderContactItems(data, { icons: false })}</div>
      </div>
      <div className="rt-grad-body">{ordered(sections, sectionOrder)}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE 16 — Metro Blocks
   Bold colored blocks for each section header, card-style
   layout with subtle shadows and rounded corners.
═══════════════════════════════════════════════════════════ */
export function Template16({ data, accentColor }) {
  const { fullName, jobTitle, email, phone, location, summary, experience, education, projects, skills, languages, interests, sectionOrder } = data;
  const sections = {
    summary: summary && <div key="summary" data-section="summary" className="rt-metro-card"><div className="rt-metro-tag">Profile</div><p className="rt-p">{summary}</p></div>,
    skills: skills && <div key="skills" data-section="skills" className="rt-metro-card"><div className="rt-metro-tag">Skills</div><ul className="rt-ul rt-ul-inline">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul></div>,
    experience: experience?.length > 0 && experience.some(e => e.title) && (
      <div key="experience" data-section="experience" className="rt-metro-card"><div className="rt-metro-tag">Experience</div>
      {experience.map((e, i) => e.title && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role">{e.title}</div>
          <div className="rt-entry-co">{e.company}{e.from ? `, ${e.from}${e.to ? ' – ' + e.to : ''}` : ''}{e.location ? ` | ${e.location}` : ''}</div>
          {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</div>
    ),
    projects: projects?.length > 0 && projects.some(p => p.name) && (
      <div key="projects" data-section="projects" className="rt-metro-card"><div className="rt-metro-tag">Projects</div>
      {projects.map((p, i) => p.name && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role">{p.name}</div>
          {p.tech && <div className="rt-entry-co">{p.tech}</div>}
          {p.desc && <ul className="rt-ul">{p.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</div>
    ),
    education: education?.length > 0 && education.some(e => e.degree) && (
      <div key="education" data-section="education" className="rt-metro-card"><div className="rt-metro-tag">Education</div>
      {education.map((e, i) => e.degree && (
        <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}</div>
      ))}</div>
    ),
    languages: languages && <div key="languages" data-section="languages" className="rt-metro-card"><div className="rt-metro-tag">Languages</div><div className="rt-lang-table">{splitList(languages).map((l, i) => { const [lang, ...rest] = l.split(':'); return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>; })}</div></div>,
    interests: interests && <div key="interests" data-section="interests" className="rt-metro-card"><div className="rt-metro-tag">Interests</div><ul className="rt-ul rt-ul-inline">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul></div>,
  };
  return (
    <div className="rt rt-metro" style={ac(accentColor)}>
      <div className="rt-metro-header">
        <h1 className="rt-metro-name">{fullName || 'YOUR NAME'}</h1>
        {jobTitle && <div className="rt-metro-job">{jobTitle}</div>}
        <div className="rt-metro-contact">{renderContactItems(data)}</div>
      </div>
      <div className="rt-metro-body">{ordered(sections, sectionOrder)}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE 17 — Left Accent Bar
   Thin left accent bar per section, modern minimalist feel
   with monochrome body and colored accents.
═══════════════════════════════════════════════════════════ */
export function Template17({ data, accentColor }) {
  const { fullName, jobTitle, email, phone, location, summary, experience, education, projects, skills, languages, interests, sectionOrder } = data;
  const sec = (key, label, content) => content && (
    <div key={key} data-section={key} className="rt-accent-sec">
      <div className="rt-accent-bar" />
      <div className="rt-accent-content"><h3 className="rt-accent-sh">{label}</h3>{content}</div>
    </div>
  );
  const sections = {
    summary: sec('summary', 'Summary', summary && <p className="rt-p">{summary}</p>),
    skills: sec('skills', 'Skills', skills && <div className="rt-grad-pills">{splitList(skills).map((s, i) => <span key={i} className="rt-grad-pill">{s}</span>)}</div>),
    experience: sec('experience', 'Experience', experience?.length > 0 && experience.some(e => e.title) && (
      <>{experience.map((e, i) => e.title && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role">{e.title} — {e.company}</div>
          <div className="rt-entry-date">{e.from}{e.to ? ' – ' + e.to : ''}{e.location ? ` | ${e.location}` : ''}</div>
          {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</>
    )),
    projects: sec('projects', 'Projects', projects?.length > 0 && projects.some(p => p.name) && (
      <>{projects.map((p, i) => p.name && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role">{p.name}</div>
          {p.tech && <div className="rt-entry-date">{p.tech}</div>}
          {p.desc && <ul className="rt-ul">{p.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</>
    )),
    education: sec('education', 'Education', education?.length > 0 && education.some(e => e.degree) && (
      <>{education.map((e, i) => e.degree && (
        <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong> — {e.institution}{e.year ? `, ${e.year}` : ''}</div>
      ))}</>
    )),
    languages: sec('languages', 'Languages', languages && <div className="rt-lang-table">{splitList(languages).map((l, i) => { const [lang, ...rest] = l.split(':'); return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>; })}</div>),
    interests: sec('interests', 'Interests', interests && <ul className="rt-ul rt-ul-inline">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul>),
  };
  return (
    <div className="rt rt-accentbar" style={ac(accentColor)}>
      <div className="rt-accentbar-header">
        <h1 className="rt-accentbar-name">{fullName || 'YOUR NAME'}</h1>
        {jobTitle && <div className="rt-accentbar-job">{jobTitle}</div>}
        <div className="rt-accentbar-contact">{renderContactItems(data, { icons: false })}</div>
      </div>
      {ordered(sections, sectionOrder)}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE 18 — Magazine Split
   Large header with colored background, 2-column body with
   left sidebar for contact/skills and right for content.
═══════════════════════════════════════════════════════════ */
export function Template18({ data, accentColor }) {
  const { fullName, jobTitle, email, phone, location, summary, experience, education, projects, skills, languages, interests, photoPreview, sectionOrder, columnConfig } = data;
  const leftKeys = new Set(columnConfig?.left || ['skills', 'languages', 'interests']);
  const rightKeys = new Set(columnConfig?.right || ['summary', 'experience', 'projects', 'education']);
  const sections = {
    summary: summary && <div key="summary" data-section="summary"><h3 className="rt-mag-sh">Summary</h3><p className="rt-p">{summary}</p></div>,
    skills: skills && <div key="skills" data-section="skills"><h3 className="rt-mag-sh">Skills</h3><ul className="rt-ul">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul></div>,
    experience: experience?.length > 0 && experience.some(e => e.title) && (
      <div key="experience" data-section="experience"><h3 className="rt-mag-sh">Experience</h3>
      {experience.map((e, i) => e.title && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role">{e.title}</div>
          <div className="rt-entry-co">{e.company}, {e.from}{e.to ? ' – ' + e.to : ''}</div>
          {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</div>
    ),
    projects: projects?.length > 0 && projects.some(p => p.name) && (
      <div key="projects" data-section="projects"><h3 className="rt-mag-sh">Projects</h3>
      {projects.map((p, i) => p.name && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role">{p.name}</div>
          {p.tech && <div className="rt-entry-co">{p.tech}</div>}
          {p.desc && <ul className="rt-ul">{p.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</div>
    ),
    education: education?.length > 0 && education.some(e => e.degree) && (
      <div key="education" data-section="education"><h3 className="rt-mag-sh">Education</h3>
      {education.map((e, i) => e.degree && (
        <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}</div>
      ))}</div>
    ),
    languages: languages && <div key="languages" data-section="languages"><h3 className="rt-mag-sh">Languages</h3><div className="rt-lang-table">{splitList(languages).map((l, i) => { const [lang, ...rest] = l.split(':'); return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>; })}</div></div>,
    interests: interests && <div key="interests" data-section="interests"><h3 className="rt-mag-sh">Interests</h3><ul className="rt-ul">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul></div>,
  };
  const order = sectionOrder || DEFAULT_SECTION_ORDER;
  return (
    <div className="rt rt-mag" style={ac(accentColor)}>
      <div className="rt-mag-header">
        {photoPreview ? <img src={photoPreview} alt="" className="rt-mag-photo" /> : <AvatarPlaceholder className="rt-mag-photo" />}
        <div>
          <h1 className="rt-mag-name">{fullName || 'YOUR NAME'}</h1>
          {jobTitle && <div className="rt-mag-job">{jobTitle}</div>}
        </div>
      </div>
      <div className="rt-mag-body">
        <div className="rt-mag-left">
          <div className="rt-mag-contact-sec">
            <h3 className="rt-mag-sh">Contact</h3>
            <div className="rt-contact-list">{renderContactItems(data)}</div>
          </div>
          {ordered(sections, order.filter(k => leftKeys.has(k)))}
        </div>
        <div className="rt-mag-right">
          {ordered(sections, order.filter(k => rightKeys.has(k)))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE 19 — Compact Grid
   Space-efficient grid layout, small font, dense information
   display ideal for experienced professionals. Single-column.
═══════════════════════════════════════════════════════════ */
export function Template19({ data, accentColor }) {
  const { fullName, jobTitle, email, phone, location, summary, experience, education, projects, skills, languages, interests, sectionOrder } = data;
  const sections = {
    summary: summary && <div key="summary" data-section="summary" className="rt-compact-sec"><div className="rt-compact-sh">Professional Summary</div><p className="rt-p">{summary}</p></div>,
    skills: skills && <div key="skills" data-section="skills" className="rt-compact-sec"><div className="rt-compact-sh">Technical Skills</div><div className="rt-compact-skills">{splitList(skills).map((s, i) => <span key={i} className="rt-compact-chip">{s}</span>)}</div></div>,
    experience: experience?.length > 0 && experience.some(e => e.title) && (
      <div key="experience" data-section="experience" className="rt-compact-sec"><div className="rt-compact-sh">Work Experience</div>
      {experience.map((e, i) => e.title && (
        <div key={i} className="rt-compact-entry">
          <div className="rt-compact-entry-head"><strong>{e.title}</strong> at {e.company} <span className="rt-compact-date">{e.from}{e.to ? ' – ' + e.to : ''}</span></div>
          {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</div>
    ),
    projects: projects?.length > 0 && projects.some(p => p.name) && (
      <div key="projects" data-section="projects" className="rt-compact-sec"><div className="rt-compact-sh">Projects</div>
      {projects.map((p, i) => p.name && (
        <div key={i} className="rt-compact-entry">
          <div className="rt-compact-entry-head"><strong>{p.name}</strong>{p.tech ? ` — ${p.tech}` : ''}</div>
          {p.desc && <ul className="rt-ul">{p.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</div>
    ),
    education: education?.length > 0 && education.some(e => e.degree) && (
      <div key="education" data-section="education" className="rt-compact-sec"><div className="rt-compact-sh">Education</div>
      {education.map((e, i) => e.degree && (
        <div key={i} className="rt-compact-entry"><strong>{e.degree}</strong> — {e.institution}{e.year ? `, ${e.year}` : ''}</div>
      ))}</div>
    ),
    languages: languages && <div key="languages" data-section="languages" className="rt-compact-sec"><div className="rt-compact-sh">Languages</div><div className="rt-lang-table">{splitList(languages).map((l, i) => { const [lang, ...rest] = l.split(':'); return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>; })}</div></div>,
    interests: interests && <div key="interests" data-section="interests" className="rt-compact-sec"><div className="rt-compact-sh">Interests</div><ul className="rt-ul rt-ul-inline">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul></div>,
  };
  return (
    <div className="rt rt-compact" style={ac(accentColor)}>
      <div className="rt-compact-header">
        <h1 className="rt-compact-name">{fullName || 'YOUR NAME'}</h1>
        {jobTitle && <div className="rt-compact-job">{jobTitle}</div>}
        <div className="rt-compact-contact">{renderContactItems(data, { icons: false })}</div>
      </div>
      {ordered(sections, sectionOrder)}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE 20 — Creative Zigzag
   Alternating left/right alignment for sections giving a
   zigzag visual flow. Colored section dividers, modern feel.
═══════════════════════════════════════════════════════════ */
export function Template20({ data, accentColor }) {
  const { fullName, jobTitle, email, phone, location, summary, experience, education, projects, skills, languages, interests, sectionOrder } = data;
  const makeSec = (key, label, content) => content && (
    <div key={key} data-section={key} className="rt-zz-sec">
      <div className="rt-zz-label">{label}</div>
      <div className="rt-zz-content">{content}</div>
    </div>
  );
  const sections = {
    summary: makeSec('summary', 'Summary', summary && <p className="rt-p">{summary}</p>),
    skills: makeSec('skills', 'Skills', skills && <div className="rt-grad-pills">{splitList(skills).map((s, i) => <span key={i} className="rt-grad-pill">{s}</span>)}</div>),
    experience: makeSec('experience', 'Experience', experience?.length > 0 && experience.some(e => e.title) && (
      <>{experience.map((e, i) => e.title && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role">{e.title} — {e.company}</div>
          <div className="rt-entry-date">{e.from}{e.to ? ' – ' + e.to : ''}{e.location ? ` | ${e.location}` : ''}</div>
          {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</>
    )),
    projects: makeSec('projects', 'Projects', projects?.length > 0 && projects.some(p => p.name) && (
      <>{projects.map((p, i) => p.name && (
        <div key={i} className="rt-entry">
          <div className="rt-entry-role">{p.name}</div>
          {p.tech && <div className="rt-entry-date">{p.tech}</div>}
          {p.desc && <ul className="rt-ul">{p.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
        </div>
      ))}</>
    )),
    education: makeSec('education', 'Education', education?.length > 0 && education.some(e => e.degree) && (
      <>{education.map((e, i) => e.degree && (
        <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong> — {e.institution}{e.year ? `, ${e.year}` : ''}</div>
      ))}</>
    )),
    languages: makeSec('languages', 'Languages', languages && <div className="rt-lang-table">{splitList(languages).map((l, i) => { const [lang, ...rest] = l.split(':'); return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>; })}</div>),
    interests: makeSec('interests', 'Interests', interests && <ul className="rt-ul rt-ul-inline">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul>),
  };
  return (
    <div className="rt rt-zigzag" style={ac(accentColor)}>
      <div className="rt-zz-header">
        <h1 className="rt-zz-name">{fullName || 'YOUR NAME'}</h1>
        {jobTitle && <div className="rt-zz-job">{jobTitle}</div>}
        <div className="rt-zz-contact">{renderContactItems(data, { icons: false })}</div>
      </div>
      <div className="rt-zz-body">{ordered(sections, sectionOrder)}</div>
    </div>
  );
}

/* ── Template registry ── */
export const TEMPLATES = [
  { id: 'artsy-corner',     name: 'Artsy Corner',       Component: Template1,  color: '#e8a87c', hasPhoto: false, columns: 1, style: 'creative' },
  { id: 'clean-classic',    name: 'Clean Classic',       Component: Template2,  color: '#555',    hasPhoto: false, columns: 1, style: 'traditional' },
  { id: 'hexagon-modern',   name: 'Hexagon Modern',      Component: Template3,  color: '#2980b9', hasPhoto: true,  columns: 1, style: 'creative' },
  { id: 'elegant-minimal',  name: 'Elegant Minimal',     Component: Template4,  color: '#777',    hasPhoto: false, columns: 1, style: 'traditional' },
  { id: 'bold-executive',   name: 'Bold Executive',      Component: Template5,  color: '#6b1d2e', hasPhoto: false, columns: 1, style: 'traditional' },
  { id: 'simple-starter',   name: 'Simple Starter',      Component: Template6,  color: '#444',    hasPhoto: false, columns: 1, style: 'traditional' },
  { id: 'dark-header-pro',  name: 'Dark Header Pro',     Component: Template7,  color: '#3a3a3a', hasPhoto: false, columns: 1, style: 'contemporary' },
  { id: 'teal-corporate',   name: 'Teal Corporate',      Component: Template8,  color: '#2c7a7b', hasPhoto: false, columns: 2, style: 'contemporary' },
  { id: 'sidebar-pro',      name: 'Sidebar Pro',         Component: Template9,  color: '#2b6cb0', hasPhoto: true,  columns: 2, style: 'creative' },
  { id: 'table-row-pink',   name: 'Table Row',           Component: Template10, color: '#e05577', hasPhoto: true,  columns: 1, style: 'contemporary' },
  { id: 'classic-photo',    name: 'Classic Photo',       Component: Template11, color: '#6b3fa0', hasPhoto: true,  columns: 2, style: 'traditional' },
  { id: 'timeline-blue',    name: 'Timeline Blue',       Component: Template12, color: '#2980b9', hasPhoto: true,  columns: 1, style: 'creative' },
  { id: 'initials-split',   name: 'Initials Two-Col',    Component: Template13, color: '#c0392b', hasPhoto: false, columns: 2, style: 'contemporary' },
  { id: 'classic-formal',   name: 'Classic Formal',      Component: Template14, color: '#2c3e50', hasPhoto: false, columns: 1, style: 'traditional' },
  { id: 'gradient-header',  name: 'Gradient Header',     Component: Template15, color: '#667eea', hasPhoto: false, columns: 1, style: 'creative' },
  { id: 'metro-blocks',     name: 'Metro Blocks',        Component: Template16, color: '#e74c3c', hasPhoto: false, columns: 1, style: 'contemporary' },
  { id: 'left-accent-bar',  name: 'Left Accent Bar',     Component: Template17, color: '#16a085', hasPhoto: false, columns: 1, style: 'contemporary' },
  { id: 'magazine-split',   name: 'Magazine Split',      Component: Template18, color: '#8e44ad', hasPhoto: true,  columns: 2, style: 'creative' },
  { id: 'compact-grid',     name: 'Compact Grid',        Component: Template19, color: '#34495e', hasPhoto: false, columns: 1, style: 'traditional' },
  { id: 'creative-zigzag',  name: 'Creative Zigzag',     Component: Template20, color: '#d35400', hasPhoto: false, columns: 1, style: 'creative' },
];

/* ── Color palette presets for color picker ── */
export const COLOR_PRESETS = [
  '#4A7BA7', '#6B6B6B', '#5B8FA8', '#5D7B8A', '#A45A6B', '#5E7383',
];

export function getTemplateById(id) {
  return TEMPLATES.find(t => t.id === id) || TEMPLATES[0];
}

/* ── 20 diverse sample profiles for template thumbnails ── */
const _spBase = { photo: null, photoPreview: '', interests: '', linkedin: '' };
export const SAMPLE_PROFILES = [
  { ..._spBase, fullName: 'Dr. Ishaan Khurana', jobTitle: 'General Physician', email: 'ishaan.khurana@example.com', phone: '+91 99001 12233', location: 'Mumbai, India',
    summary: 'Experienced General Physician with strong diagnostic skills and patient-centric care.',
    experience: [
      { title: 'Senior Physician', company: 'CityCare Hospital', from: '2023', to: 'Present', location: 'Mumbai', desc: 'Managing OPD with 50+ patients daily.\nConducting health camps and preventive care programs.' },
      { title: 'Resident Doctor', company: 'Pulse Multispeciality', from: '2021', to: '2023', location: 'Pune', desc: 'Handled emergency cases and inpatient care.\nCollaborated with specialists for complex diagnoses.' },
      { title: 'Junior Doctor', company: 'HealthFirst Clinic', from: '2019', to: '2021', location: 'Mumbai', desc: 'Provided primary care and patient counseling.\nAssisted in minor surgical procedures.' },
    ],
    education: [{ degree: 'MBBS, MD (General Medicine)', institution: 'Grant Medical College', year: '2019', location: 'Mumbai' }],
    projects: [{ name: 'Community Health Drive', tech: 'Public Health', desc: 'Organized free health check-up camps for 2000+ patients in rural areas.' }],
    skills: 'Diagnosis, Emergency Care, Patient Counseling, Internal Medicine',
    languages: 'Hindi: Native, English: Professional, Marathi: Intermediate',
  },
  { ..._spBase, fullName: 'Dr. Meera Rajput', jobTitle: 'Pediatrician', email: 'meera.rajput@example.com', phone: '+91 98123 45678', location: 'Delhi, India',
    summary: 'Pediatric specialist with expertise in newborn and child healthcare.',
    experience: [
      { title: 'Consultant Pediatrician', company: 'Sunshine Children\'s Hospital', from: '2022', to: 'Present', location: 'Delhi', desc: 'Leading neonatal care unit with 30+ beds.\nConducting pediatric developmental assessments.' },
      { title: 'Pediatric Registrar', company: 'KidzCare Centre', from: '2020', to: '2022', location: 'Gurgaon', desc: 'Managed outpatient pediatric consultations.\nConducted vaccination drives for underprivileged children.' },
      { title: 'Junior Doctor', company: 'Apollo Children\'s Wing', from: '2018', to: '2020', location: 'Delhi', desc: 'Provided pediatric emergency care.\nAssisted in neonatal ICU management.' },
    ],
    education: [{ degree: 'MBBS, DCH', institution: 'Lady Hardinge Medical College', year: '2018', location: 'Delhi' }],
    projects: [{ name: 'Child Nutrition Program', tech: 'Pediatrics', desc: 'Designed and implemented a nutrition tracking program for 500+ children.' }],
    skills: 'Child Care, Vaccinations, Growth Monitoring, Neonatal Care',
    languages: 'Hindi: Native, English: Professional',
  },
  { ..._spBase, fullName: 'Ravi Pratap Singh', jobTitle: 'Mathematics Teacher', email: 'ravi.singh@example.com', phone: '+91 97654 11223', location: 'Jaipur, India',
    summary: 'Dedicated Mathematics Teacher skilled in conceptual teaching and exam preparation.',
    experience: [
      { title: 'Senior Math Teacher', company: 'Delhi Global School', from: '2022', to: 'Present', location: 'Jaipur', desc: 'Teaching classes 10-12 with 95% pass rate.\nDesigning innovative math worksheets and practice sets.' },
      { title: 'Math Faculty', company: 'Brilliance Coaching', from: '2020', to: '2022', location: 'Jaipur', desc: 'Prepared 200+ students for JEE & board exams.\nDeveloped custom problem sets for competitive exams.' },
      { title: 'Assistant Teacher', company: 'Maple Public School', from: '2018', to: '2020', location: 'Delhi', desc: 'Conducted math classes for middle school.\nOrganized inter-school math olympiad.' },
    ],
    education: [{ degree: 'B.Sc Mathematics + B.Ed', institution: 'University of Rajasthan', year: '2018', location: 'Jaipur' }],
    projects: [{ name: 'Math Olympiad Program', tech: 'Education', desc: 'Launched an inter-school math competition with 50+ participating schools.' }],
    skills: 'Algebra, Trigonometry, Classroom Management, Exam Coaching',
    languages: 'Hindi: Native, English: Professional',
  },
  { ..._spBase, fullName: 'Pooja Arora', jobTitle: 'English Teacher', email: 'pooja.arora@example.com', phone: '+91 88765 99012', location: 'Chandigarh, India',
    summary: 'Experienced English teacher focused on communication skills and literature.',
    experience: [
      { title: 'English Teacher', company: 'Green Valley School', from: '2021', to: 'Present', location: 'Chandigarh', desc: 'Teaching English literature and grammar to senior classes.\nOrganizing creative writing workshops and debates.' },
      { title: 'Language Trainer', company: 'EduBright Academy', from: '2019', to: '2021', location: 'Chandigarh', desc: 'Trained 100+ students in spoken English.\nDeveloped communication skill curriculum.' },
      { title: 'Assistant Teacher', company: 'Vidhya Mandir', from: '2017', to: '2019', location: 'Delhi', desc: 'Conducted English classes for middle school.\nGuided students in creative writing competitions.' },
    ],
    education: [{ degree: 'M.A. English + B.Ed', institution: 'Panjab University', year: '2017', location: 'Chandigarh' }],
    projects: [{ name: 'Creative Writing Club', tech: 'Education', desc: 'Founded a student writing club with 80+ active members publishing monthly newsletters.' }],
    skills: 'Grammar, Literature, Communication Skills, Creative Writing',
    languages: 'Hindi: Native, English: Fluent, Punjabi: Intermediate',
  },
  { ..._spBase, fullName: 'Sameer Bhandari', jobTitle: 'Project Manager', email: 'sameer.bhandari@example.com', phone: '+91 99887 11234', location: 'Hyderabad, India',
    summary: 'Project Manager with experience in agile delivery, stakeholder coordination, and team leadership.',
    experience: [
      { title: 'Project Manager', company: 'NexaSoft Pvt. Ltd.', from: '2023', to: 'Present', location: 'Hyderabad', desc: 'Leading a team of 15 engineers across 3 product lines.\nImplemented agile ceremonies improving delivery velocity by 30%.' },
      { title: 'Scrum Master', company: 'CloudWave Technologies', from: '2021', to: '2023', location: 'Hyderabad', desc: 'Facilitated sprint planning and retrospectives for 4 teams.\nReduced sprint-over-sprint defects by 40%.' },
      { title: 'Project Coordinator', company: 'DigiWorks', from: '2019', to: '2021', location: 'Pune', desc: 'Coordinated cross-functional team activities.\nManaged project timelines and resource allocation.' },
    ],
    education: [{ degree: 'MBA + PMP (Certified)', institution: 'ISB Hyderabad', year: '2019', location: 'Hyderabad' }],
    projects: [{ name: 'Enterprise Platform Migration', tech: 'JIRA, Confluence', desc: 'Managed migration of legacy platform to cloud-native architecture for 10K+ users.' }],
    skills: 'Agile, JIRA, Team Management, Stakeholder Communication',
    languages: 'Hindi: Native, English: Professional',
  },
  { ..._spBase, fullName: 'Anita Joseph', jobTitle: 'Operations Manager', email: 'anita.joseph@example.com', phone: '+91 77665 44332', location: 'Chennai, India',
    summary: 'Operations Manager specializing in process optimization and workflow improvement.',
    experience: [
      { title: 'Operations Manager', company: 'Crystal Logistics', from: '2022', to: 'Present', location: 'Chennai', desc: 'Streamlined warehouse operations reducing costs by 20%.\nManaged a team of 40+ logistics staff.' },
      { title: 'Assistant Ops Manager', company: 'SpeedX Couriers', from: '2019', to: '2022', location: 'Chennai', desc: 'Optimized delivery routes improving efficiency by 25%.\nImplemented real-time tracking dashboards.' },
      { title: 'Operations Executive', company: 'GoTrade Services', from: '2017', to: '2019', location: 'Bangalore', desc: 'Managed daily operations and SLA compliance.\nPrepared weekly performance reports for management.' },
    ],
    education: [{ degree: 'MBA Operations', institution: 'Anna University', year: '2017', location: 'Chennai' }],
    projects: [{ name: 'Warehouse Automation', tech: 'ERP, IoT', desc: 'Implemented automated sorting system reducing processing time by 50%.' }],
    skills: 'Operations, Reporting, SLA Management, Process Optimization',
    languages: 'Tamil: Native, English: Professional, Hindi: Conversational',
  },
  { ..._spBase, fullName: 'Aditya Narain', jobTitle: 'Mechanical Engineer', email: 'aditya.narain@example.com', phone: '+91 88990 77665', location: 'Pune, India',
    summary: 'Mechanical Engineer with hands-on experience in manufacturing and quality control.',
    experience: [
      { title: 'Mechanical Engineer', company: 'Bharat AutoTech', from: '2023', to: 'Present', location: 'Pune', desc: 'Designing components for EV drivetrain systems.\nConducting FEA analysis for structural integrity.' },
      { title: 'Quality Engineer', company: 'MetalWorks Ltd.', from: '2021', to: '2023', location: 'Pune', desc: 'Implemented Six Sigma processes reducing defect rate by 35%.\nManaged supplier quality audits.' },
      { title: 'Graduate Engineer Trainee', company: 'Kirolos Engineering', from: '2020', to: '2021', location: 'Chennai', desc: 'Assisted in product design and prototype testing.\nPrepared technical documentation for manufacturing.' },
    ],
    education: [{ degree: 'B.Tech Mechanical', institution: 'VIT Pune', year: '2020', location: 'Pune' }],
    projects: [{ name: 'EV Drivetrain Design', tech: 'SolidWorks, ANSYS', desc: 'Designed and optimized drivetrain components for a compact electric vehicle.' }],
    skills: 'AutoCAD, SolidWorks, Quality Control, Six Sigma',
    languages: 'Hindi: Native, English: Professional',
  },
  { ..._spBase, fullName: 'Sakshi Rawal', jobTitle: 'Civil Engineer', email: 'sakshi.rawal@example.com', phone: '+91 70012 33445', location: 'Ahmedabad, India',
    summary: 'Civil Engineer experienced in construction supervision and site management.',
    experience: [
      { title: 'Site Engineer', company: 'BuildMax Construction', from: '2022', to: 'Present', location: 'Ahmedabad', desc: 'Supervising construction of a 200-unit residential complex.\nConducting soil testing and foundation planning.' },
      { title: 'Junior Engineer', company: 'MetroLine Infra', from: '2020', to: '2022', location: 'Surat', desc: 'Managed material procurement for metro rail project.\nPrepared BOQ and cost estimation reports.' },
      { title: 'Trainee Engineer', company: 'CoreBuild Developers', from: '2019', to: '2020', location: 'Ahmedabad', desc: 'Assisted in structural design and drafting.\nConducted site surveys and prepared layout plans.' },
    ],
    education: [{ degree: 'B.Tech Civil', institution: 'LD College of Engineering', year: '2019', location: 'Ahmedabad' }],
    projects: [{ name: 'Smart Township Planning', tech: 'AutoCAD, Revit', desc: 'Designed a green township with rainwater harvesting and solar integration.' }],
    skills: 'Site Execution, Estimation, AutoCAD, Structural Design',
    languages: 'Hindi: Native, English: Professional, Gujarati: Native',
  },
  { ..._spBase, fullName: 'Harshit Chawla', jobTitle: 'Electrical Engineer', email: 'harshit.chawla@example.com', phone: '+91 99123 66778', location: 'Lucknow, India',
    summary: 'Electrical Engineer specializing in power systems and industrial maintenance.',
    experience: [
      { title: 'Electrical Engineer', company: 'PowerGrid Services', from: '2023', to: 'Present', location: 'Lucknow', desc: 'Maintaining high-voltage substations and transformers.\nImplementing SCADA systems for remote monitoring.' },
      { title: 'Maintenance Engineer', company: 'Voltmax Industries', from: '2021', to: '2023', location: 'Kanpur', desc: 'Performed preventive maintenance on industrial motors.\nReduced equipment downtime by 20%.' },
      { title: 'Apprentice', company: 'Nova Electricals', from: '2020', to: '2021', location: 'Lucknow', desc: 'Assisted in wiring and panel installation.\nLearned PLC programming for automation projects.' },
    ],
    education: [{ degree: 'B.Tech Electrical', institution: 'AKTU', year: '2020', location: 'Lucknow' }],
    projects: [{ name: 'Solar Microgrid', tech: 'PLC, SCADA', desc: 'Designed a 50kW solar microgrid for a rural village.' }],
    skills: 'PLC, Power Systems, Maintenance, SCADA',
    languages: 'Hindi: Native, English: Professional',
  },
  { ..._spBase, fullName: 'Neelam Gupta', jobTitle: 'QA Engineer', email: 'neelam.gupta@example.com', phone: '+91 88776 55443', location: 'Noida, India',
    summary: 'QA Engineer with strong experience in manual and automation testing.',
    experience: [
      { title: 'QA Engineer', company: 'TestCore Technologies', from: '2023', to: 'Present', location: 'Noida', desc: 'Automating regression suites using Selenium and Cypress.\nReducing manual testing effort by 60%.' },
      { title: 'Test Analyst', company: 'QualityWorks', from: '2021', to: '2023', location: 'Gurgaon', desc: 'Created test plans and execution reports.\nPerformed API testing using Postman and RestAssured.' },
      { title: 'QA Intern', company: 'ByteSoft Solutions', from: '2020', to: '2021', location: 'Noida', desc: 'Learned testing fundamentals and bug tracking.\nAssisted in smoke and sanity testing cycles.' },
    ],
    education: [{ degree: 'B.Tech CSE', institution: 'AKTU', year: '2020', location: 'Noida' }],
    projects: [{ name: 'Test Automation Framework', tech: 'Selenium, Java', desc: 'Built a reusable page-object-model framework for web testing across 5 products.' }],
    skills: 'Selenium, API Testing, JIRA, Cypress, Postman',
    languages: 'Hindi: Native, English: Professional',
  },
  { ..._spBase, fullName: 'Manav Jindal', jobTitle: 'UI/UX Designer', email: 'manav.jindal@example.com', phone: '+91 99234 55667', location: 'Bangalore, India',
    summary: 'Creative designer focused on user-centric design and user research.',
    experience: [
      { title: 'UI/UX Designer', company: 'FlowTech Digital', from: '2022', to: 'Present', location: 'Bangalore', desc: 'Redesigned the flagship product increasing user engagement by 40%.\nConducting user research interviews and usability tests.' },
      { title: 'Product Designer', company: 'BrightApps', from: '2020', to: '2022', location: 'Bangalore', desc: 'Designed mobile-first interfaces for 3 consumer apps.\nCreated design system with 200+ reusable components.' },
      { title: 'Design Intern', company: 'UXLab Studio', from: '2019', to: '2020', location: 'Mumbai', desc: 'Created wireframes and prototypes for client projects.\nAssisted in user journey mapping and persona development.' },
    ],
    education: [{ degree: 'B.Des Communication Design', institution: 'NID Ahmedabad', year: '2019', location: 'Ahmedabad' }],
    projects: [{ name: 'Design System Library', tech: 'Figma, Storybook', desc: 'Created a comprehensive design system used across 5 product teams.' }],
    skills: 'Figma, Wireframing, User Research, Prototyping',
    languages: 'Hindi: Native, English: Professional',
  },
  { ..._spBase, fullName: 'Shreya Talvar', jobTitle: 'Marketing Manager', email: 'shreya.talvar@example.com', phone: '+91 77889 00112', location: 'Gurgaon, India',
    summary: 'Marketing professional with experience in digital campaigns and brand strategy.',
    experience: [
      { title: 'Marketing Manager', company: 'TrendMinds Media', from: '2023', to: 'Present', location: 'Gurgaon', desc: 'Managing a monthly ad budget of ₹15L across Google & Meta.\nGrew organic traffic by 120% through content strategy.' },
      { title: 'Digital Marketer', company: 'AdSpark Pvt. Ltd.', from: '2020', to: '2023', location: 'Delhi', desc: 'Ran paid campaigns with 5x ROAS consistently.\nManaged social media presence for 10+ brands.' },
      { title: 'Marketing Executive', company: 'MediaMint', from: '2018', to: '2020', location: 'Noida', desc: 'Created email marketing campaigns with 25% open rates.\nAssisted in brand launch events and PR activities.' },
    ],
    education: [{ degree: 'MBA Marketing', institution: 'IMT Ghaziabad', year: '2018', location: 'Ghaziabad' }],
    projects: [{ name: 'Brand Relaunch Campaign', tech: 'Google Ads, Meta', desc: 'Led a complete brand repositioning campaign reaching 5M+ impressions.' }],
    skills: 'SEO, SEM, Branding, Content Strategy, Google Analytics',
    languages: 'Hindi: Native, English: Professional',
  },
  { ..._spBase, fullName: 'Rohit Singh', jobTitle: 'Customer Support Executive', email: 'rohit.singh@example.com', phone: '+91 66554 33221', location: 'Indore, India',
    summary: 'Customer support specialist with experience in chat, email, and phone support.',
    experience: [
      { title: 'Support Executive', company: 'QuickHelp Services', from: '2022', to: 'Present', location: 'Indore', desc: 'Handling 80+ customer queries daily across channels.\nMaintaining 4.8★ CSAT rating consistently.' },
      { title: 'CSR', company: 'CallConnect India', from: '2020', to: '2022', location: 'Indore', desc: 'Resolved escalated complaints within 24-hour SLA.\nTrained 15 new hires on CRM and processes.' },
      { title: 'Support Associate', company: 'SkyTech BPO', from: '2019', to: '2020', location: 'Bhopal', desc: 'Provided first-level tech support for software products.\nDocumented FAQs and knowledge base articles.' },
    ],
    education: [{ degree: 'BBA', institution: 'Devi Ahilya University', year: '2019', location: 'Indore' }],
    projects: [{ name: 'Knowledge Base Portal', tech: 'Zendesk', desc: 'Built a self-service knowledge base reducing ticket volume by 30%.' }],
    skills: 'CRM, Ticketing, Communication, Zendesk',
    languages: 'Hindi: Native, English: Professional',
  },
  { ..._spBase, fullName: 'Naina Banerjee', jobTitle: 'Pharmacist', email: 'naina.banerjee@example.com', phone: '+91 55443 22110', location: 'Kolkata, India',
    summary: 'Pharmacist with experience in prescription handling and medicine dispensing.',
    experience: [
      { title: 'Pharmacist', company: 'Apollo Pharmacy', from: '2022', to: 'Present', location: 'Kolkata', desc: 'Managing inventory of 5000+ medicines.\nCounseling patients on dosage and side effects.' },
      { title: 'Assistant Pharmacist', company: 'MedPlus', from: '2020', to: '2022', location: 'Kolkata', desc: 'Processed 150+ prescriptions daily.\nMaintained regulatory compliance and licenses.' },
      { title: 'Trainee', company: 'HealthMart Pharmacy', from: '2019', to: '2020', location: 'Howrah', desc: 'Learned medicine dispensing and inventory management.\nAssisted in hospital pharmacy operations.' },
    ],
    education: [{ degree: 'D.Pharma', institution: 'Jadavpur University', year: '2019', location: 'Kolkata' }],
    projects: [{ name: 'Inventory Management System', tech: 'Excel, VBA', desc: 'Automated medicine expiry tracking that reduced waste by 25%.' }],
    skills: 'Medicines, Prescriptions, Customer Handling, Inventory',
    languages: 'Bengali: Native, Hindi: Fluent, English: Professional',
  },
  { ..._spBase, fullName: 'Shivani Patel', jobTitle: 'Digital Marketer', email: 'shivani.patel@example.com', phone: '+91 99001 88776', location: 'Surat, India',
    summary: 'Highly motivated fresher with strong skills in SEO and social media marketing.',
    experience: [
      { title: 'Digital Marketing Intern', company: 'WebBoost Agency', from: '2023', to: '2023', location: 'Surat', desc: 'Managed social media accounts for 5 local businesses.\nCreated content calendars and engagement strategies.' },
      { title: 'SEO Intern', company: 'RankUp Media', from: '2022', to: '2022', location: 'Ahmedabad', desc: 'Conducted keyword research and on-page optimization.\nImproved organic rankings for 10+ client websites.' },
      { title: 'Freelance Social Media Manager', company: 'Self-employed', from: '2021', to: '2021', location: 'Surat', desc: 'Managed Instagram and Facebook pages for local shops.\nGrew follower base by 200% for key clients.' },
    ],
    education: [{ degree: 'BBA', institution: 'VNSGU', year: '2023', location: 'Surat' }],
    projects: [{ name: 'Local Business Digital Presence', tech: 'Canva, Meta Business', desc: 'Helped 10 small businesses establish their digital presence on social platforms.' }],
    skills: 'SEO, Canva, Social Media, Content Creation',
    languages: 'Gujarati: Native, Hindi: Fluent, English: Professional',
  },
  { ..._spBase, fullName: 'Karan Yadav', jobTitle: 'Software Developer', email: 'karan.yadav@example.com', phone: '+91 88234 55667', location: 'Nagpur, India',
    summary: 'Entry-level developer passionate about JavaScript and backend technologies.',
    experience: [
      { title: 'Developer Intern', company: 'AlphaDev Labs', from: '2023', to: '2023', location: 'Nagpur', desc: 'Built REST APIs using Node.js and Express.\nDeveloped responsive UI components with React.' },
      { title: 'Web Intern', company: 'CodeMania', from: '2022', to: '2022', location: 'Pune', desc: 'Created landing pages and interactive web features.\nLearned Git workflow and agile development.' },
      { title: 'Student Project Developer', company: 'College Labs', from: '2021', to: '2021', location: 'Nagpur', desc: 'Built a college event management web app.\nImplemented user authentication and database design.' },
    ],
    education: [{ degree: 'B.Tech CSE', institution: 'RTMNU', year: '2023', location: 'Nagpur' }],
    projects: [{ name: 'Event Management Portal', tech: 'React, Node.js, MongoDB', desc: 'Full-stack web app for college events with registration, ticketing, and admin dashboard.' }],
    skills: 'JavaScript, React, Node.js, MongoDB, Git',
    languages: 'Hindi: Native, English: Professional, Marathi: Intermediate',
  },
  { ..._spBase, fullName: 'Vaibhav Malhotra', jobTitle: 'Business Analyst', email: 'vaibhav.malhotra@example.com', phone: '+91 77665 00998', location: 'Pune, India',
    summary: 'Analytical BA with skills in requirement gathering and dashboard reporting.',
    experience: [
      { title: 'Business Analyst', company: 'InsightLogic', from: '2023', to: 'Present', location: 'Pune', desc: 'Gathering requirements for fintech product features.\nCreating dashboards in Power BI for executive leadership.' },
      { title: 'Associate BA', company: 'DataPulse Corp', from: '2021', to: '2023', location: 'Mumbai', desc: 'Documented 50+ user stories and acceptance criteria.\nFacilitated UAT sessions with business stakeholders.' },
      { title: 'BA Intern', company: 'FinTech Pro', from: '2020', to: '2021', location: 'Pune', desc: 'Assisted in workflow analysis and process mapping.\nPrepared business requirement documents.' },
    ],
    education: [{ degree: 'MBA Analytics', institution: 'Symbiosis Pune', year: '2020', location: 'Pune' }],
    projects: [{ name: 'Executive Dashboard', tech: 'Power BI, SQL', desc: 'Built a real-time leadership dashboard tracking 20+ KPIs across departments.' }],
    skills: 'Excel, Power BI, Documentation, SQL, Stakeholder Management',
    languages: 'Hindi: Native, English: Professional',
  },
  { ..._spBase, fullName: 'Aditi Thomas', jobTitle: 'Registered Nurse', email: 'aditi.thomas@example.com', phone: '+91 66543 21098', location: 'Kochi, India',
    summary: 'Registered nurse with experience in patient monitoring and emergency care.',
    experience: [
      { title: 'Staff Nurse', company: 'Fortis Wing', from: '2022', to: 'Present', location: 'Kochi', desc: 'Providing bedside care to 20+ patients per shift.\nMonitoring vitals and administering medications.' },
      { title: 'ICU Nurse', company: 'CarePoint Hospital', from: '2020', to: '2022', location: 'Thiruvananthapuram', desc: 'Managed critical care patients on ventilators.\nAssisted doctors during emergency procedures.' },
      { title: 'Trainee Nurse', company: 'LifeCare Hospital', from: '2019', to: '2020', location: 'Kochi', desc: 'Completed clinical rotations across departments.\nLearned patient documentation and care protocols.' },
    ],
    education: [{ degree: 'B.Sc Nursing', institution: 'KUHS', year: '2019', location: 'Kochi' }],
    projects: [{ name: 'Patient Care Protocol', tech: 'Healthcare', desc: 'Developed standardized patient handover checklist adopted hospital-wide.' }],
    skills: 'ICU, Patient Care, Monitoring, Emergency Response',
    languages: 'Malayalam: Native, English: Professional, Hindi: Conversational',
  },
  { ..._spBase, fullName: 'Nikhil Verma', jobTitle: 'Head Chef', email: 'nikhil.verma@example.com', phone: '+91 99888 77665', location: 'Jaipur, India',
    summary: 'Professional chef with experience in Indian and continental cuisine.',
    experience: [
      { title: 'Head Chef', company: 'UrbanTaste Restaurant', from: '2023', to: 'Present', location: 'Jaipur', desc: 'Managing a kitchen team of 12 staff.\nDesigning seasonal menus featuring regional specialties.' },
      { title: 'Sous Chef', company: 'SpiceVilla', from: '2021', to: '2023', location: 'Udaipur', desc: 'Prepared dishes for 200+ covers per service.\nTrained junior chefs on plating and presentation.' },
      { title: 'Commis Chef', company: 'FoodCraft Hotel', from: '2019', to: '2021', location: 'Delhi', desc: 'Prepared mise en place and assisted in buffet setup.\nLearned international cuisines and techniques.' },
    ],
    education: [{ degree: 'Diploma in Culinary Arts', institution: 'IHM Jaipur', year: '2019', location: 'Jaipur' }],
    projects: [{ name: 'Farm-to-Table Menu', tech: 'Culinary Arts', desc: 'Launched a zero-waste menu sourcing 100% local ingredients, featured in food magazines.' }],
    skills: 'Indian Cuisine, Menu Planning, Garnishing, Team Leadership',
    languages: 'Hindi: Native, English: Professional',
  },
  { ..._spBase, fullName: 'Ritika Anand', jobTitle: 'Data Scientist', email: 'ritika.anand@example.com', phone: '+91 88901 22334', location: 'Bangalore, India',
    summary: 'Data Scientist with strengths in machine learning and predictive analytics.',
    experience: [
      { title: 'Data Scientist', company: 'AIQuant Labs', from: '2023', to: 'Present', location: 'Bangalore', desc: 'Building ML models for customer churn prediction.\nDeploying models to production using MLflow and Docker.' },
      { title: 'ML Engineer', company: 'TechSense AI', from: '2021', to: '2023', location: 'Hyderabad', desc: 'Developed NLP pipelines for sentiment analysis.\nOptimized model training reducing compute costs by 30%.' },
      { title: 'Data Analyst', company: 'Nova Analytics', from: '2019', to: '2021', location: 'Bangalore', desc: 'Created automated data pipelines using Python.\nBuilt dashboards for business intelligence reporting.' },
    ],
    education: [{ degree: 'M.Sc Data Science', institution: 'IIIT Bangalore', year: '2019', location: 'Bangalore' }],
    projects: [{ name: 'Churn Prediction Engine', tech: 'Python, Scikit-learn, MLflow', desc: 'Built an ML pipeline predicting customer churn with 92% accuracy, saving ₹2Cr annually.' }],
    skills: 'Python, ML Models, SQL, TensorFlow, Data Visualization',
    languages: 'Hindi: Native, English: Professional',
  },
];
