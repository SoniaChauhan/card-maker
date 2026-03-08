/**
 * 11 Resume Templates — each renders the same data in a distinct layout.
 * Template IDs match the screenshots (row-by-row, left to right):
 *   1. artsy-corner     2. clean-classic     3. hexagon-modern
 *   4. elegant-minimal  5. bold-executive    6. simple-starter
 *   7. dark-header-pro  8. teal-corporate    9. sidebar-pro
 *  10. table-row-pink  11. classic-photo
 */

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
  const { fullName, jobTitle, email, phone, location, summary, experience, education, skills, languages, interests, photoPreview } = data;
  return (
    <div className="rt rt-artsy" style={ac(accentColor)}>
      <div className="rt-artsy-corner tl" /><div className="rt-artsy-corner tr" /><div className="rt-artsy-corner bl" /><div className="rt-artsy-corner br" />
      {photoPreview ? <img src={photoPreview} alt="" className="rt-artsy-photo" /> : <AvatarPlaceholder className="rt-artsy-photo" />}
      <h1 className="rt-artsy-name">{fullName || 'YOUR NAME'}</h1>
      {jobTitle && <div className="rt-artsy-job">{jobTitle}</div>}
      <div className="rt-artsy-body">
        <div className="rt-artsy-left">
          {summary && <><h3 className="rt-sh">SUMMARY</h3><p className="rt-p">{summary}</p></>}
          {experience?.length > 0 && experience.some(e => e.title) && (
            <><h3 className="rt-sh">EXPERIENCE</h3>
            {experience.map((e, i) => e.title && (
              <div key={i} className="rt-entry">
                <div className="rt-entry-role">{e.title}{e.from || e.to ? `, ${e.from}${e.to ? ' – ' + e.to : ''}` : ''}</div>
                <div className="rt-entry-co">{e.company}{e.location ? ` — ${e.location}` : ''}</div>
                {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
              </div>
            ))}</>
          )}
        </div>
        <div className="rt-artsy-right">
          <h3 className="rt-sh">CONTACT</h3>
          <div className="rt-contact-list">
            {phone && <span>📞 {phone}</span>}
            {email && <span>📧 {email}</span>}
            {location && <span>📍 {location}</span>}
          </div>
          {skills && <><h3 className="rt-sh">SKILLS</h3><ul className="rt-ul">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul></>}
          {education?.length > 0 && education.some(e => e.degree) && (
            <><h3 className="rt-sh">EDUCATION AND TRAINING</h3>
            {education.map((e, i) => e.degree && (
              <div key={i} className="rt-entry-sm">
                <strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}
              </div>
            ))}</>
          )}
          {languages && <><h3 className="rt-sh">LANGUAGES</h3>
            <div className="rt-lang-table">{splitList(languages).map((l, i) => {
              const [lang, ...rest] = l.split(':');
              return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
            })}</div></>}
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
  const { fullName, email, phone, location, summary, experience, education, skills, languages, interests } = data;
  return (
    <div className="rt rt-clean" style={ac(accentColor)}>
      <h1 className="rt-clean-name">{fullName || 'Your Name'}</h1>
      <div className="rt-clean-contact">{[location, phone, email].filter(Boolean).join('  •  ')}</div>
      <div className="rt-divider" />
      <div className="rt-two-col">
        <div className="rt-col-main">
          {summary && <><h3 className="rt-sh">SUMMARY</h3><p className="rt-p">{summary}</p></>}
          {experience?.length > 0 && experience.some(e => e.title) && (
            <><h3 className="rt-sh">EXPERIENCE</h3>
            {experience.map((e, i) => e.title && (
              <div key={i} className="rt-entry">
                <div className="rt-entry-role">{e.title}, {e.from}{e.to ? ' – ' + e.to : ''}</div>
                <div className="rt-entry-co">{e.company}{e.location ? `, ${e.location}` : ''}</div>
                {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
              </div>
            ))}</>
          )}
          {education?.length > 0 && education.some(e => e.degree) && (
            <><h3 className="rt-sh">EDUCATION AND TRAINING</h3>
            {education.map((e, i) => e.degree && (
              <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}</div>
            ))}</>
          )}
          {languages && <><h3 className="rt-sh">LANGUAGES</h3>
            <div className="rt-lang-table">{splitList(languages).map((l, i) => {
              const [lang, ...rest] = l.split(':');
              return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
            })}</div></>}
          {interests && <><h3 className="rt-sh">INTERESTS AND HOBBIES</h3><ul className="rt-ul">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul></>}
        </div>
        <div className="rt-col-side">
          <h3 className="rt-sh">CONTACT</h3>
          <div className="rt-contact-list">{email && <span>📧 {email}</span>}{phone && <span>📞 {phone}</span>}{location && <span>📍 {location}</span>}</div>
          {skills && <><h3 className="rt-sh">SKILLS</h3><ul className="rt-ul">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul></>}
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
  const { fullName, email, phone, location, summary, experience, education, skills, languages, interests, photoPreview } = data;
  return (
    <div className="rt rt-hexagon" style={ac(accentColor)}>
      <div className="rt-hex-header">
        <div className="rt-hex-badge">{photoPreview ? <img src={photoPreview} alt="" /> : <span>{initials(fullName)}</span>}</div>
        <div className="rt-hex-info">
          <h1>{fullName || 'Your Name'}</h1>
          <div className="rt-hex-contact">{email && <span>{email}</span>}{phone && <span>{phone}</span>}{location && <span>{location}</span>}</div>
        </div>
      </div>
      <div className="rt-two-col">
        <div className="rt-col-main">
          {summary && <><h3 className="rt-sh rt-sh-blue">Summary</h3><p className="rt-p">{summary}</p></>}
          {experience?.length > 0 && experience.some(e => e.title) && (
            <><h3 className="rt-sh rt-sh-blue">Experience</h3>
            {experience.map((e, i) => e.title && (
              <div key={i} className="rt-entry">
                <div className="rt-entry-role">{e.title}, {e.from}{e.to ? ' – ' + e.to : ''}</div>
                <div className="rt-entry-co">{e.company}{e.location ? `, ${e.location}` : ''}</div>
                {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
              </div>
            ))}</>
          )}
          {education?.length > 0 && education.some(e => e.degree) && (
            <><h3 className="rt-sh rt-sh-blue">Education and Training</h3>
            {education.map((e, i) => e.degree && (
              <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}</div>
            ))}</>
          )}
          {languages && <><h3 className="rt-sh rt-sh-blue">Languages</h3>
            <div className="rt-lang-table">{splitList(languages).map((l, i) => {
              const [lang, ...rest] = l.split(':');
              return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
            })}</div></>}
        </div>
        <div className="rt-col-side">
          {skills && <><h3 className="rt-sh rt-sh-blue">Skills</h3><ul className="rt-ul">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul></>}
          {interests && <><h3 className="rt-sh rt-sh-blue">Interests and Hobbies</h3><ul className="rt-ul">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul></>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE 4 — Elegant Minimal
   Name centered, contact dots, two‑col body, clean minimal
═══════════════════════════════════════════════════════════ */
export function Template4({ data, accentColor }) {
  const { fullName, email, phone, location, summary, experience, education, skills, languages, interests } = data;
  return (
    <div className="rt rt-elegant" style={ac(accentColor)}>
      <h1 className="rt-elegant-name">{fullName || 'Your Name'}</h1>
      <div className="rt-elegant-contact">{[location, phone, email].filter(Boolean).join('  •  ')}</div>
      <div className="rt-divider" />
      <div className="rt-two-col">
        <div className="rt-col-main">
          {summary && <><h3 className="rt-sh">SUMMARY</h3><p className="rt-p">{summary}</p></>}
          {experience?.length > 0 && experience.some(e => e.title) && (
            <><h3 className="rt-sh">EXPERIENCE</h3>
            {experience.map((e, i) => e.title && (
              <div key={i} className="rt-entry">
                <div className="rt-entry-role"><em>{e.title}</em>, {e.from}{e.to ? ' – ' + e.to : ''}</div>
                <div className="rt-entry-co">{e.company}{e.location ? ` — ${e.location}` : ''}</div>
                {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
              </div>
            ))}</>
          )}
          {education?.length > 0 && education.some(e => e.degree) && (
            <><h3 className="rt-sh">EDUCATION AND TRAINING</h3>
            {education.map((e, i) => e.degree && (
              <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}</div>
            ))}</>
          )}
          {languages && <><h3 className="rt-sh">LANGUAGES</h3>
            <div className="rt-lang-table">{splitList(languages).map((l, i) => {
              const [lang, ...rest] = l.split(':');
              return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
            })}</div></>}
        </div>
        <div className="rt-col-side">
          {skills && <><h3 className="rt-sh">SKILLS</h3><ul className="rt-ul">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul></>}
          {interests && <><h3 className="rt-sh">INTERESTS AND HOBBIES</h3><ul className="rt-ul">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul></>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE 5 — Bold Executive
   Large initials + dark maroon header, contact left with icons
═══════════════════════════════════════════════════════════ */
export function Template5({ data, accentColor }) {
  const { fullName, email, phone, location, summary, experience, education, skills, languages, interests, photoPreview } = data;
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
            {location && <span>📍 {location}</span>}
            {phone && <span>📞 {phone}</span>}
            {email && <span>📧 {email}</span>}
          </div>
          {summary && <><h3 className="rt-sh">SUMMARY</h3><p className="rt-p">{summary}</p></>}
          {skills && <><h3 className="rt-sh">SKILLS</h3><ul className="rt-ul">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul></>}
          {education?.length > 0 && education.some(e => e.degree) && (
            <><h3 className="rt-sh">EDUCATION AND TRAINING</h3>
            {education.map((e, i) => e.degree && (
              <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}</div>
            ))}</>
          )}
          {languages && <><h3 className="rt-sh">LANGUAGES</h3>
            <div className="rt-lang-table">{splitList(languages).map((l, i) => {
              const [lang, ...rest] = l.split(':');
              return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
            })}</div></>}
        </div>
        <div className="rt-bold-right">
          {experience?.length > 0 && experience.some(e => e.title) && (
            <><h3 className="rt-sh">EXPERIENCE</h3>
            {experience.map((e, i) => e.title && (
              <div key={i} className="rt-entry">
                <div className="rt-entry-role">{e.title}, {e.from}{e.to ? ' – ' + e.to : ''}</div>
                <div className="rt-entry-co">{e.company}{e.location ? ` — ${e.location}` : ''}</div>
                {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
              </div>
            ))}</>
          )}
          {interests && <><h3 className="rt-sh">INTERESTS AND HOBBIES</h3><ul className="rt-ul">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul></>}
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
  const { fullName, email, phone, location, summary, experience, education, skills, languages, interests } = data;
  return (
    <div className="rt rt-simple" style={ac(accentColor)}>
      <div className="rt-simple-header">
        <h1>{fullName || 'Your Name'}</h1>
        <div className="rt-simple-contact">{[email, phone, location].filter(Boolean).join(' | ')}</div>
      </div>
      <div className="rt-divider" />
      {interests && <><h3 className="rt-sh">Interests and Hobbies</h3><ul className="rt-ul">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul></>}
      <div className="rt-two-col">
        <div className="rt-col-main">
          {summary && <><h3 className="rt-sh">Summary</h3><p className="rt-p">{summary}</p></>}
          {experience?.length > 0 && experience.some(e => e.title) && (
            <><h3 className="rt-sh">Experience</h3>
            {experience.map((e, i) => e.title && (
              <div key={i} className="rt-entry">
                <div className="rt-entry-role">{e.title}, {e.from}{e.to ? ' – ' + e.to : ''}</div>
                <div className="rt-entry-co">{e.company}{e.location ? ` — ${e.location}` : ''}</div>
                {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
              </div>
            ))}</>
          )}
          {education?.length > 0 && education.some(e => e.degree) && (
            <><h3 className="rt-sh">Education and Training</h3>
            {education.map((e, i) => e.degree && (
              <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}</div>
            ))}</>
          )}
        </div>
        <div className="rt-col-side">
          {skills && <><h3 className="rt-sh">Skills</h3><ul className="rt-ul">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul></>}
          {languages && <><h3 className="rt-sh">Languages</h3>
            <div className="rt-lang-table">{splitList(languages).map((l, i) => {
              const [lang, ...rest] = l.split(':');
              return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
            })}</div></>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE 7 — Dark Header Pro
   Dark gray header with initials + large name, colored strip
═══════════════════════════════════════════════════════════ */
export function Template7({ data, accentColor }) {
  const { fullName, email, phone, location, summary, experience, education, skills, languages, interests, photoPreview } = data;
  return (
    <div className="rt rt-darkpro" style={ac(accentColor)}>
      <div className="rt-darkpro-header">
        <div className="rt-darkpro-init">{photoPreview ? <img src={photoPreview} alt="" /> : initials(fullName)}</div>
        <div className="rt-darkpro-sep" />
        <h1>{(fullName || 'YOUR NAME').toUpperCase()}</h1>
      </div>
      <div className="rt-darkpro-strip">{[location, phone, email].filter(Boolean).join('  •  ')}</div>
      <div className="rt-two-col">
        <div className="rt-col-main">
          {summary && <><h3 className="rt-sh">SUMMARY</h3><p className="rt-p">{summary}</p></>}
          {experience?.length > 0 && experience.some(e => e.title) && (
            <><h3 className="rt-sh">EXPERIENCE</h3>
            {experience.map((e, i) => e.title && (
              <div key={i} className="rt-entry">
                <div className="rt-entry-role">{e.title}, {e.from}{e.to ? ' – ' + e.to : ''}</div>
                <div className="rt-entry-co">{e.company}{e.location ? ` — ${e.location}` : ''}</div>
                {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
              </div>
            ))}</>
          )}
          {education?.length > 0 && education.some(e => e.degree) && (
            <><h3 className="rt-sh">EDUCATION AND TRAINING</h3>
            {education.map((e, i) => e.degree && (
              <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}</div>
            ))}</>
          )}
          {languages && <><h3 className="rt-sh">LANGUAGES</h3>
            <div className="rt-lang-table">{splitList(languages).map((l, i) => {
              const [lang, ...rest] = l.split(':');
              return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
            })}</div></>}
          {interests && <><h3 className="rt-sh">INTERESTS AND HOBBIES</h3><ul className="rt-ul">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul></>}
        </div>
        <div className="rt-col-side">
          {skills && <><h3 className="rt-sh">SKILLS</h3><ul className="rt-ul">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul></>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE 8 — Teal Corporate
   Teal/dark top bar with contact, name below, table‑style sections
═══════════════════════════════════════════════════════════ */
export function Template8({ data, accentColor }) {
  const { fullName, email, phone, location, summary, experience, education, skills, languages, interests } = data;
  return (
    <div className="rt rt-teal" style={ac(accentColor)}>
      <div className="rt-teal-bar">{[location, phone, email].filter(Boolean).join('  •  ')}</div>
      <h1 className="rt-teal-name">{fullName || 'Your Name'}</h1>
      <div className="rt-teal-body">
        {summary && <div className="rt-teal-row"><div className="rt-teal-label">Summary</div><div className="rt-teal-val"><p className="rt-p">{summary}</p></div></div>}
        {skills && <div className="rt-teal-row"><div className="rt-teal-label">Skills</div><div className="rt-teal-val"><ul className="rt-ul rt-ul-inline">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul></div></div>}
        {experience?.length > 0 && experience.some(e => e.title) && (
          <div className="rt-teal-row"><div className="rt-teal-label">Experience</div><div className="rt-teal-val">
            {experience.map((e, i) => e.title && (
              <div key={i} className="rt-entry">
                <div className="rt-entry-role">{e.title}, {e.from}{e.to ? ' – ' + e.to : ''}</div>
                <div className="rt-entry-co">{e.company}{e.location ? `, ${e.location}` : ''}</div>
                {e.desc && <p className="rt-p rt-p-sm">{e.desc}</p>}
              </div>
            ))}
          </div></div>
        )}
        {education?.length > 0 && education.some(e => e.degree) && (
          <div className="rt-teal-row"><div className="rt-teal-label">Education and Training</div><div className="rt-teal-val">
            {education.map((e, i) => e.degree && (
              <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}</div>
            ))}
          </div></div>
        )}
        {languages && <div className="rt-teal-row"><div className="rt-teal-label">Languages</div><div className="rt-teal-val">
          <div className="rt-lang-table">{splitList(languages).map((l, i) => {
            const [lang, ...rest] = l.split(':');
            return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
          })}</div>
        </div></div>}
        {interests && <div className="rt-teal-row"><div className="rt-teal-label">Interests</div><div className="rt-teal-val"><ul className="rt-ul">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul></div></div>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE 9 — Sidebar Pro
   Left colored sidebar with section titles, right side content
═══════════════════════════════════════════════════════════ */
export function Template9({ data, accentColor }) {
  const { fullName, email, phone, location, summary, experience, education, skills, languages, interests, photoPreview } = data;
  return (
    <div className="rt rt-sidebar" style={ac(accentColor)}>
      <div className="rt-sidebar-header">
        <div className="rt-sidebar-avatar">
          {photoPreview ? <img src={photoPreview} alt="" /> : <AvatarPlaceholder />}
        </div>
        <h1>{fullName || 'Your Name'}</h1>
        <div className="rt-sidebar-contact">{[email, phone, location].filter(Boolean).join('  •  ')}</div>
      </div>
      <div className="rt-sidebar-body">
        <div className="rt-sidebar-left">
          {summary && <h3 className="rt-sidebar-sh">Summary</h3>}
          {skills && <h3 className="rt-sidebar-sh" style={{ marginTop: summary ? 80 : 0 }}>Skills</h3>}
          {experience?.some(e => e.title) && <h3 className="rt-sidebar-sh">Experience</h3>}
          {education?.some(e => e.degree) && <h3 className="rt-sidebar-sh">Education And Training</h3>}
          {languages && <h3 className="rt-sidebar-sh">Languages</h3>}
        </div>
        <div className="rt-sidebar-right">
          {summary && <p className="rt-p">{summary}</p>}
          {skills && <ul className="rt-ul rt-ul-two-col">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul>}
          {experience?.length > 0 && experience.some(e => e.title) && (
            <div className="rt-sidebar-section">
              {experience.map((e, i) => e.title && (
                <div key={i} className="rt-entry">
                  <div className="rt-entry-role">{e.title}, <strong>{e.company}</strong></div>
                  <div className="rt-entry-date">{e.from}{e.to ? ' – ' + e.to : ''}{e.location ? `, ${e.location}` : ''}</div>
                  {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
                </div>
              ))}
            </div>
          )}
          {education?.length > 0 && education.some(e => e.degree) && (
            <div className="rt-sidebar-section">
              {education.map((e, i) => e.degree && (
                <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}</div>
              ))}
            </div>
          )}
          {languages && <div className="rt-lang-table">{splitList(languages).map((l, i) => {
            const [lang, ...rest] = l.split(':');
            return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
          })}</div>}
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
  const { fullName, jobTitle, email, phone, location, summary, experience, education, skills, languages, interests, photoPreview } = data;
  return (
    <div className="rt rt-tablerow" style={ac(accentColor)}>
      <div className="rt-tablerow-accent" />
      <div className="rt-tablerow-inner">
        <div className="rt-tablerow-top">
          <div className="rt-tablerow-name-block">
            <h1>{(fullName || 'YOUR NAME').toUpperCase()}</h1>
            {jobTitle && <div className="rt-tablerow-job">{jobTitle}</div>}
            <div className="rt-tablerow-contact">
              {location && <span>📍 {location}</span>}
              {phone && <span>📞 {phone}</span>}
              {email && <span>📧 {email}</span>}
            </div>
          </div>
          {photoPreview ? <img src={photoPreview} alt="" className="rt-tablerow-photo" /> : <AvatarPlaceholder className="rt-tablerow-photo" />}
        </div>

        {summary && (
          <div className="rt-tablerow-row">
            <div className="rt-tablerow-label">SUMMARY</div>
            <div className="rt-tablerow-val"><p className="rt-p">{summary}</p></div>
          </div>
        )}
        {skills && (
          <div className="rt-tablerow-row">
            <div className="rt-tablerow-label">SKILLS</div>
            <div className="rt-tablerow-val"><ul className="rt-ul rt-ul-inline">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul></div>
          </div>
        )}
        {experience?.length > 0 && experience.some(e => e.title) && (
          <div className="rt-tablerow-row">
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
        )}
        {education?.length > 0 && education.some(e => e.degree) && (
          <div className="rt-tablerow-row">
            <div className="rt-tablerow-label">EDUCATION AND TRAINING</div>
            <div className="rt-tablerow-val">
              {education.map((e, i) => e.degree && (
                <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}{e.location ? ` — ${e.location}` : ''}</div>
              ))}
            </div>
          </div>
        )}
        {languages && (
          <div className="rt-tablerow-row">
            <div className="rt-tablerow-label">LANGUAGES</div>
            <div className="rt-tablerow-val">
              <div className="rt-lang-table">{splitList(languages).map((l, i) => {
                const [lang, ...rest] = l.split(':');
                return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
              })}</div>
            </div>
          </div>
        )}
        {interests && (
          <div className="rt-tablerow-row">
            <div className="rt-tablerow-label">INTERESTS</div>
            <div className="rt-tablerow-val"><ul className="rt-ul">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul></div>
          </div>
        )}
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
  const { fullName, jobTitle, email, phone, location, summary, experience, education, skills, languages, interests, photoPreview } = data;
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

        {summary && <><h3 className="rt-sh rt-sh-accent">SUMMARY</h3><p className="rt-p">{summary}</p></>}

        <div className="rt-cp-two-col">
          <div className="rt-cp-main">
            {experience?.length > 0 && experience.some(e => e.title) && (
              <><h3 className="rt-sh rt-sh-accent">EXPERIENCE</h3>
              {experience.map((e, i) => e.title && (
                <div key={i} className="rt-entry">
                  <div className="rt-entry-role">{e.title}, {e.from}{e.to ? ' – ' + e.to : ''}</div>
                  <div className="rt-entry-co">{e.company}{e.location ? ` — ${e.location}` : ''}</div>
                  {e.desc && <ul className="rt-ul">{e.desc.split('\n').filter(Boolean).map((d, j) => <li key={j}>{d}</li>)}</ul>}
                </div>
              ))}</>
            )}
          </div>
          <div className="rt-cp-side">
            <h3 className="rt-sh rt-sh-accent">CONTACT</h3>
            <div className="rt-contact-list">
              {location && <span>📍 {location}</span>}
              {phone && <span>📞 {phone}</span>}
              {email && <span>📧 {email}</span>}
            </div>
            {skills && <><h3 className="rt-sh rt-sh-accent">SKILLS</h3><ul className="rt-ul">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul></>}
          </div>
        </div>

        {education?.length > 0 && education.some(e => e.degree) && (
          <><h3 className="rt-sh rt-sh-accent">EDUCATION AND TRAINING</h3>
          {education.map((e, i) => e.degree && (
            <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}{e.location ? ` — ${e.location}` : ''}</div>
          ))}</>
        )}

        {languages && <><h3 className="rt-sh rt-sh-accent">LANGUAGES</h3>
          <div className="rt-lang-table">{splitList(languages).map((l, i) => {
            const [lang, ...rest] = l.split(':');
            return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
          })}</div></>}

        {interests && <><h3 className="rt-sh rt-sh-accent">INTERESTS AND HOBBIES</h3><ul className="rt-ul">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul></>}
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
  const { fullName, jobTitle, email, phone, location, summary, experience, education, skills, languages, interests, photoPreview } = data;
  return (
    <div className="rt rt-timeline" style={ac(accentColor)}>
      {/* Header */}
      <div className="rt-tl-header">
        <div className="rt-tl-name-block">
          <h1 className="rt-tl-name">{fullName || 'YOUR NAME'}</h1>
          {jobTitle && <div className="rt-tl-job">{jobTitle}</div>}
          <div className="rt-tl-contact">
            {location && <span>📍 {location}</span>}
            {phone && <span>📞 {phone}</span>}
            {email && <span>📧 {email}</span>}
          </div>
        </div>
        {photoPreview ? <img src={photoPreview} alt="" className="rt-tl-photo" /> : <AvatarPlaceholder className="rt-tl-photo" />}
      </div>

      <hr className="rt-tl-divider" />

      {/* Summary */}
      {summary && (
        <div className="rt-tl-section">
          <h3 className="rt-tl-sh">✦ Professional Summary</h3>
          <p className="rt-p">{summary}</p>
        </div>
      )}

      {/* Skills */}
      {skills && (
        <div className="rt-tl-section">
          <h3 className="rt-tl-sh">★ Skills</h3>
          <ul className="rt-ul rt-ul-inline">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>
      )}

      {/* Work History — timeline layout */}
      {experience?.length > 0 && experience.some(e => e.title) && (
        <div className="rt-tl-section">
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
      )}

      {/* Education — timeline layout */}
      {education?.length > 0 && education.some(e => e.degree) && (
        <div className="rt-tl-section">
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
      )}

      {/* Languages */}
      {languages && (
        <div className="rt-tl-section">
          <h3 className="rt-tl-sh">🌐 Languages</h3>
          <div className="rt-lang-table">{splitList(languages).map((l, i) => {
            const [lang, ...rest] = l.split(':');
            return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
          })}</div>
        </div>
      )}

      {/* Interests */}
      {interests && (
        <div className="rt-tl-section">
          <h3 className="rt-tl-sh">🎯 Interests</h3>
          <ul className="rt-ul">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>
      )}
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
  const { fullName, jobTitle, email, phone, location, summary, experience, education, skills, languages, interests, photoPreview } = data;
  return (
    <div className="rt rt-initsplit" style={ac(accentColor)}>
      {/* Header with initials circle */}
      <div className="rt-is-header">
        <div className="rt-is-badge">{photoPreview ? <img src={photoPreview} alt="" className="rt-is-badge-img" /> : initials(fullName)}</div>
        <div className="rt-is-name-block">
          <h1 className="rt-is-name">{(fullName || 'YOUR NAME').toUpperCase()}</h1>
          {jobTitle && <div className="rt-is-job">{jobTitle.toUpperCase()}</div>}
        </div>
      </div>

      <div className="rt-is-contact-bar">
        {location && <span>📍 {location}</span>}
        {phone && <span>📞 {phone}</span>}
        {email && <span>📧 {email}</span>}
      </div>

      {/* Two-col body: label left, content right */}
      <div className="rt-is-body">
        {summary && (
          <div className="rt-is-row">
            <div className="rt-is-label">PROFESSIONAL SUMMARY</div>
            <div className="rt-is-val"><p className="rt-p">{summary}</p></div>
          </div>
        )}
        {skills && (
          <div className="rt-is-row">
            <div className="rt-is-label">SKILLS</div>
            <div className="rt-is-val"><ul className="rt-ul rt-ul-inline">{splitList(skills).map((s, i) => <li key={i}>{s}</li>)}</ul></div>
          </div>
        )}
        {experience?.length > 0 && experience.some(e => e.title) && (
          <div className="rt-is-row">
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
        )}
        {education?.length > 0 && education.some(e => e.degree) && (
          <div className="rt-is-row">
            <div className="rt-is-label">EDUCATION</div>
            <div className="rt-is-val">
              {education.map((e, i) => e.degree && (
                <div key={i} className="rt-entry-sm"><strong>{e.degree}</strong><br />{e.institution}{e.year ? `, ${e.year}` : ''}{e.location ? ` — ${e.location}` : ''}</div>
              ))}
            </div>
          </div>
        )}
        {languages && (
          <div className="rt-is-row">
            <div className="rt-is-label">LANGUAGES</div>
            <div className="rt-is-val">
              <div className="rt-lang-table">{splitList(languages).map((l, i) => {
                const [lang, ...rest] = l.split(':');
                return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
              })}</div>
            </div>
          </div>
        )}
        {interests && (
          <div className="rt-is-row">
            <div className="rt-is-label">INTERESTS</div>
            <div className="rt-is-val"><ul className="rt-ul">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul></div>
          </div>
        )}
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
  const { fullName, jobTitle, email, phone, location, summary, experience, education, skills, languages, interests, photoPreview } = data;
  return (
    <div className="rt rt-formal" style={ac(accentColor)}>
      {/* Header */}
      <div className="rt-fm-header">
        <h1 className="rt-fm-name">{fullName || 'YOUR NAME'}</h1>
        {jobTitle && <div className="rt-fm-job">{jobTitle}</div>}
        <div className="rt-fm-contact">
          {location && <span>{location}</span>}
          {phone && <span>{phone}</span>}
          {email && <span>{email}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="rt-fm-section">
          <div className="rt-fm-sh"><span>Professional Summary</span></div>
          <p className="rt-p">{summary}</p>
        </div>
      )}

      {/* Key Skills line */}
      {skills && (
        <div className="rt-fm-section">
          <p className="rt-p"><strong>Key Skills: </strong>{skills}</p>
        </div>
      )}

      {/* Work History */}
      {experience?.length > 0 && experience.some(e => e.title) && (
        <div className="rt-fm-section">
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
      )}

      {/* Education */}
      {education?.length > 0 && education.some(e => e.degree) && (
        <div className="rt-fm-section">
          <div className="rt-fm-sh"><span>Education</span></div>
          {education.map((e, i) => e.degree && (
            <div key={i} className="rt-fm-entry">
              <div className="rt-fm-entry-head"><strong>{e.degree}</strong>{e.year ? `, ${e.year}` : ''}</div>
              <div className="rt-fm-entry-co"><strong>{e.institution}</strong>{e.location ? ` - ${e.location}` : ''}</div>
            </div>
          ))}
        </div>
      )}

      {/* Skills with bars (2-col grid) */}
      {skills && (
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
      )}

      {/* Languages */}
      {languages && (
        <div className="rt-fm-section">
          <div className="rt-fm-sh"><span>Languages</span></div>
          <div className="rt-lang-table">{splitList(languages).map((l, i) => {
            const [lang, ...rest] = l.split(':');
            return <div key={i} className="rt-lang-row"><span>{lang.trim()}</span><span>{rest.join(':').trim()}</span></div>;
          })}</div>
        </div>
      )}

      {/* Interests */}
      {interests && (
        <div className="rt-fm-section">
          <div className="rt-fm-sh"><span>Interests</span></div>
          <ul className="rt-ul">{splitList(interests).map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>
      )}
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
];

/* ── Color palette presets for color picker ── */
export const COLOR_PRESETS = [
  '#e05577', '#6b3fa0', '#2980b9', '#2c7a7b', '#e8a87c',
  '#6b1d2e', '#3a3a3a', '#d4a843', '#48bb78', '#e67e22',
];

export function getTemplateById(id) {
  return TEMPLATES.find(t => t.id === id) || TEMPLATES[0];
}
