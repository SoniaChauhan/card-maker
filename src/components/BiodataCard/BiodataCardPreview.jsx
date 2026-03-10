import { formatDate } from '../../utils/helpers';
import { T } from '../../utils/translations';

/* Community header image mapping */
const COMMUNITY_HEADER_IMAGES = {
  hindi: '/hindu_symbol.svg',
  english: '/hindu_symbol.svg',
  muslim: '/muslim_biodata.png',
  gujarati: '/gujarati_symbol.svg',
  marathi: '/marathi_symbol.svg',
};

/* Community header text config */
const COMMUNITY_HEADER_TEXT = {
  hindi: { title: 'विवाह परिचय पत्र', subtitle: '॥ शुभ विवाह ॥', deco: '✦' },
  english: { title: 'Marriage Biodata', subtitle: '~ Auspicious Union ~', deco: '✦' },
  muslim: { title: 'رشتہ بائیوڈیٹا', subtitle: 'بِسْمِ اللَّهِ', deco: '☪' },
  gujarati: { title: 'લગ્ન બાયોડેટા', subtitle: '॥ શુભ લગ્ન ॥', deco: '✦' },
  marathi: { title: 'विवाह परिचय पत्र', subtitle: '॥ शुभ विवाह ॥', deco: '✦' },
};

/* Template theme configurations */
const TEMPLATE_THEMES = {
  1:  { class: 'bio-theme-gold',      deco: '🌸 ॐ 🌸', ornament: '❧ ✦ ❧', footer: '🌸 ✦ 🌸 ✦ 🌸' },
  2:  { class: 'bio-theme-blue',      deco: '💎 ॐ 💎', ornament: '◆ ✦ ◆', footer: '💎 ✦ 💎 ✦ 💎' },
  3:  { class: 'bio-theme-green',     deco: '🌿 ॐ 🌿', ornament: '❧ ✦ ❧', footer: '🌿 ✦ 🌿 ✦ 🌿' },
  4:  { class: 'bio-theme-pink',      deco: '🌸 ॐ 🌸', ornament: '♡ ✦ ♡', footer: '🌸 ♡ 🌸 ♡ 🌸' },
  5:  { class: 'bio-theme-minimal',   deco: '✦ ॐ ✦',  ornament: '─ ✦ ─', footer: '✦ ─ ✦ ─ ✦' },
  6:  { class: 'bio-theme-purple',    deco: '👑 ॐ 👑', ornament: '◈ ✦ ◈', footer: '👑 ✦ 👑 ✦ 👑' },
  7:  { class: 'bio-theme-burgundy',  deco: '🍷 ॐ 🍷', ornament: '❧ ✦ ❧', footer: '🍷 ✦ 🍷 ✦ 🍷' },
  8:  { class: 'bio-theme-teal',      deco: '🦚 ॐ 🦚', ornament: '◆ ✦ ◆', footer: '🦚 ✦ 🦚 ✦ 🦚' },
  9:  { class: 'bio-theme-saffron',   deco: '🌅 ॐ 🌅', ornament: '✦ ❧ ✦', footer: '🌅 ✦ 🌅 ✦ 🌅' },
  10: { class: 'bio-theme-navy',      deco: '🌙 ॐ 🌙', ornament: '◆ ✦ ◆', footer: '🌙 ✦ 🌙 ✦ 🌙' },
  11: { class: 'bio-theme-rose',      deco: '🌹 ॐ 🌹', ornament: '♡ ✦ ♡', footer: '🌹 ♡ 🌹 ♡ 🌹' },
  12: { class: 'bio-theme-olive',     deco: '🫒 ॐ 🫒', ornament: '❧ ✦ ❧', footer: '🫒 ✦ 🫒 ✦ 🫒' },
  13: { class: 'bio-theme-copper',    deco: '🏺 ॐ 🏺', ornament: '✦ ❧ ✦', footer: '🏺 ✦ 🏺 ✦ 🏺' },
  14: { class: 'bio-theme-sapphire',  deco: '💠 ॐ 💠', ornament: '◆ ✦ ◆', footer: '💠 ✦ 💠 ✦ 💠' },
  15: { class: 'bio-theme-lavender',  deco: '💜 ॐ 💜', ornament: '◈ ✦ ◈', footer: '💜 ✦ 💜 ✦ 💜' },
  16: { class: 'bio-theme-mahogany',  deco: '📜 ॐ 📜', ornament: '❧ ✦ ❧', footer: '📜 ✦ 📜 ✦ 📜' },
  17: { class: 'bio-theme-peacock',   deco: '🦋 ॐ 🦋', ornament: '◆ ✦ ◆', footer: '🦋 ✦ 🦋 ✦ 🦋' },
  18: { class: 'bio-theme-coral',     deco: '🎊 ॐ 🎊', ornament: '✦ ♡ ✦', footer: '🎊 ✦ 🎊 ✦ 🎊' },
  19: { class: 'bio-theme-slate',     deco: '✦ ॐ ✦',  ornament: '─ ✦ ─', footer: '✦ ─ ✦ ─ ✦' },
  20: { class: 'bio-theme-marigold',  deco: '🌻 ॐ 🌻', ornament: '✦ ❧ ✦', footer: '🌻 ✦ 🌻 ✦ 🌻' },
};

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="bio-row">
      <span className="bio-label">{label}</span>
      <span className="bio-colon">:</span>
      <span className="bio-value">{value}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   5 LAYOUT FAMILIES
   Layout A (1-4):  Classic single-column sections
   Layout B (5-8):  Photo sidebar + right details
   Layout C (9-12): Card-based section grid
   Layout D (13-16): Compact table-style
   Layout E (17-20): Modern hero photo centered
   ═══════════════════════════════════════════════════ */
function getLayout(tpl) {
  if (tpl <= 4) return 'A';
  if (tpl <= 8) return 'B';
  if (tpl <= 12) return 'C';
  if (tpl <= 16) return 'D';
  return 'E';
}

export default function BiodataCardPreview({ data, lang = 'en', template = 1, community = 'hindi' }) {
  const t = T[lang];
  const theme = TEMPLATE_THEMES[template] || TEMPLATE_THEMES[1];
  const layout = getLayout(template);
  const headerImage = COMMUNITY_HEADER_IMAGES[community] || COMMUNITY_HEADER_IMAGES.hindi;
  const headerText = COMMUNITY_HEADER_TEXT[community] || COMMUNITY_HEADER_TEXT.hindi;
  const {
    fullName, dob, age, height, weight, complexion, bloodGroup,
    religion, caste, subCaste,
    gotra, rashi, nakshatra, manglik,
    education, occupation, employer, annualIncome,
    fatherName, fatherOccupation, motherName, motherOccupation, siblings,
    hobbies, aboutMe,
    contactName, contactPhone, contactAddress,
    photoPreview,
  } = data;

  const hasAstro = gotra || rashi || nakshatra || manglik;
  const hasFamily = fatherName || motherName || siblings;
  const hasAbout = hobbies || aboutMe;

  /* ─── LAYOUT A: Classic Single-Column ─── */
  if (layout === 'A') {
    return (
      <div id="biodata-print" className={`biodata-card ${theme.class}`}>
        <div className="bio-header">
          <div className="bio-header-content">
            <span className="bio-header-deco">{headerText.deco}</span>
            <img src={headerImage} alt="" className="bio-header-image" />
            <span className="bio-header-deco">{headerText.deco}</span>
          </div>
          <h1 className="bio-header-title">{headerText.title}</h1>
          <p className="bio-header-subtitle">{headerText.subtitle}</p>
        </div>
        <div className="bio-top-section">
          {photoPreview && <img src={photoPreview} alt={fullName} className="bio-photo" />}
          <div className="bio-name-block">
            <div className="bio-full-name">{fullName || 'Candidate Name'}</div>
            {dob && <div className="bio-dob-line">{t.bioBorn}: {formatDate(dob)}</div>}
            {(caste || religion) && <div className="bio-caste-line">{[religion, caste].filter(Boolean).join(' • ')}</div>}
          </div>
        </div>
        <div className="bio-divider" />
        <div className="bio-section"><div className="bio-section-heading">{t.bioPersonal}</div><div className="bio-rows"><Row label={t.bioAge} value={age ? `${age} ${t.bioYears}` : ''} /><Row label={t.bioHeight} value={height} /><Row label={t.bioWeight} value={weight} /><Row label={t.bioComplexion} value={complexion} /><Row label={t.bioBlood} value={bloodGroup} /><Row label={t.bioReligion} value={religion} /><Row label={t.bioCaste} value={caste} /><Row label={t.bioSubCaste} value={subCaste} /></div></div>
        <div className="bio-divider" />
        {hasAstro && <><div className="bio-section"><div className="bio-section-heading">{t.bioAstro}</div><div className="bio-rows"><Row label={t.bioGotra} value={gotra} /><Row label={t.bioRashi} value={rashi} /><Row label={t.bioNakshatra} value={nakshatra} /><Row label={t.bioManglik} value={manglik} /></div></div><div className="bio-divider" /></>}
        <div className="bio-section"><div className="bio-section-heading">{t.bioEdu}</div><div className="bio-rows"><Row label={t.bioEducation} value={education} /><Row label={t.bioOccupation} value={occupation} /><Row label={t.bioEmployer} value={employer} /><Row label={t.bioIncome} value={annualIncome} /></div></div>
        <div className="bio-divider" />
        {hasFamily && <><div className="bio-section"><div className="bio-section-heading">{t.bioFamily}</div><div className="bio-rows"><Row label={t.bioFather} value={fatherName} /><Row label={t.bioFatherOcc} value={fatherOccupation} /><Row label={t.bioMother} value={motherName} /><Row label={t.bioMotherOcc} value={motherOccupation} /><Row label={t.bioSiblings} value={siblings} /></div></div><div className="bio-divider" /></>}
        {hasAbout && <><div className="bio-section"><div className="bio-section-heading">{t.bioAbout}</div>{hobbies && <div className="bio-about-row"><span className="bio-label">{t.bioHobbies}</span><span className="bio-colon">:</span><span className="bio-value">{hobbies}</span></div>}{aboutMe && <div className="bio-about-text">&ldquo;{aboutMe}&rdquo;</div>}</div><div className="bio-divider" /></>}
        <div className="bio-section bio-contact-section"><div className="bio-section-heading">{t.bioContact}</div><div className="bio-rows"><Row label={t.bioContactPerson} value={contactName} /><Row label={t.bioPhone} value={contactPhone} /><Row label={t.bioAddress} value={contactAddress} /></div></div>
        <div className="bio-footer"><div className="bio-footer-deco">{theme.footer}</div><div className="bio-footer-note">{t.bioFooter}</div></div>
      </div>
    );
  }

  /* ─── LAYOUT B: Photo Sidebar + Right Details ─── */
  if (layout === 'B') {
    return (
      <div id="biodata-print" className={`biodata-card bio-layout-b ${theme.class}`}>
        <div className="bio-b-header">
          <img src={headerImage} alt="" className="bio-b-header-img" />
          <div><h1 className="bio-b-header-title">{headerText.title}</h1><p className="bio-b-header-sub">{headerText.subtitle}</p></div>
        </div>
        <div className="bio-b-columns">
          <div className="bio-b-left">
            {photoPreview && <img src={photoPreview} alt={fullName} className="bio-b-photo" />}
            <div className="bio-b-name">{fullName || 'Candidate Name'}</div>
            {dob && <div className="bio-b-dob">{t.bioBorn}: {formatDate(dob)}</div>}
            {(caste || religion) && <div className="bio-b-caste">{[religion, caste].filter(Boolean).join(' • ')}</div>}
            <div className="bio-b-divider" />
            <div className="bio-b-section-title">{t.bioContact}</div>
            <Row label={t.bioContactPerson} value={contactName} />
            <Row label={t.bioPhone} value={contactPhone} />
            <Row label={t.bioAddress} value={contactAddress} />
          </div>
          <div className="bio-b-right">
            <div className="bio-b-section"><div className="bio-b-section-title">{t.bioPersonal}</div><Row label={t.bioAge} value={age ? `${age} ${t.bioYears}` : ''} /><Row label={t.bioHeight} value={height} /><Row label={t.bioWeight} value={weight} /><Row label={t.bioComplexion} value={complexion} /><Row label={t.bioBlood} value={bloodGroup} /><Row label={t.bioReligion} value={religion} /><Row label={t.bioCaste} value={caste} /><Row label={t.bioSubCaste} value={subCaste} /></div>
            {hasAstro && <div className="bio-b-section"><div className="bio-b-section-title">{t.bioAstro}</div><Row label={t.bioGotra} value={gotra} /><Row label={t.bioRashi} value={rashi} /><Row label={t.bioNakshatra} value={nakshatra} /><Row label={t.bioManglik} value={manglik} /></div>}
            <div className="bio-b-section"><div className="bio-b-section-title">{t.bioEdu}</div><Row label={t.bioEducation} value={education} /><Row label={t.bioOccupation} value={occupation} /><Row label={t.bioEmployer} value={employer} /><Row label={t.bioIncome} value={annualIncome} /></div>
            {hasFamily && <div className="bio-b-section"><div className="bio-b-section-title">{t.bioFamily}</div><Row label={t.bioFather} value={fatherName} /><Row label={t.bioFatherOcc} value={fatherOccupation} /><Row label={t.bioMother} value={motherName} /><Row label={t.bioMotherOcc} value={motherOccupation} /><Row label={t.bioSiblings} value={siblings} /></div>}
            {hasAbout && <div className="bio-b-section"><div className="bio-b-section-title">{t.bioAbout}</div>{hobbies && <Row label={t.bioHobbies} value={hobbies} />}{aboutMe && <div className="bio-about-text">&ldquo;{aboutMe}&rdquo;</div>}</div>}
          </div>
        </div>
        <div className="bio-footer"><div className="bio-footer-deco">{theme.footer}</div></div>
      </div>
    );
  }

  /* ─── LAYOUT C: Card-Based Section Grid ─── */
  if (layout === 'C') {
    return (
      <div id="biodata-print" className={`biodata-card bio-layout-c ${theme.class}`}>
        <div className="bio-c-header">
          <img src={headerImage} alt="" className="bio-c-header-img" />
          <h1 className="bio-c-title">{headerText.title}</h1>
          <p className="bio-c-subtitle">{headerText.subtitle}</p>
        </div>
        <div className="bio-c-hero">
          {photoPreview && <img src={photoPreview} alt={fullName} className="bio-c-photo" />}
          <div className="bio-c-name">{fullName || 'Candidate Name'}</div>
          {(caste || religion) && <div className="bio-c-caste">{[religion, caste].filter(Boolean).join(' • ')}</div>}
        </div>
        <div className="bio-c-grid">
          <div className="bio-c-card"><div className="bio-c-card-title">{t.bioPersonal}</div><Row label={t.bioAge} value={age ? `${age} ${t.bioYears}` : ''} /><Row label={t.bioHeight} value={height} /><Row label={t.bioComplexion} value={complexion} /><Row label={t.bioBlood} value={bloodGroup} /></div>
          <div className="bio-c-card"><div className="bio-c-card-title">{t.bioEdu}</div><Row label={t.bioEducation} value={education} /><Row label={t.bioOccupation} value={occupation} /><Row label={t.bioIncome} value={annualIncome} /></div>
          {hasAstro && <div className="bio-c-card"><div className="bio-c-card-title">{t.bioAstro}</div><Row label={t.bioGotra} value={gotra} /><Row label={t.bioRashi} value={rashi} /><Row label={t.bioNakshatra} value={nakshatra} /><Row label={t.bioManglik} value={manglik} /></div>}
          {hasFamily && <div className="bio-c-card"><div className="bio-c-card-title">{t.bioFamily}</div><Row label={t.bioFather} value={fatherName} /><Row label={t.bioMother} value={motherName} /><Row label={t.bioSiblings} value={siblings} /></div>}
        </div>
        <div className="bio-c-contact"><div className="bio-c-card-title">{t.bioContact}</div><div className="bio-c-contact-row"><Row label={t.bioContactPerson} value={contactName} /><Row label={t.bioPhone} value={contactPhone} /><Row label={t.bioAddress} value={contactAddress} /></div></div>
        <div className="bio-footer"><div className="bio-footer-deco">{theme.footer}</div></div>
      </div>
    );
  }

  /* ─── LAYOUT D: Compact Table Style ─── */
  if (layout === 'D') {
    return (
      <div id="biodata-print" className={`biodata-card bio-layout-d ${theme.class}`}>
        <div className="bio-d-strip" />
        <div className="bio-d-header">
          <img src={headerImage} alt="" className="bio-d-header-img" />
          <h1 className="bio-d-title">{headerText.title}</h1>
        </div>
        <div className="bio-d-profile">
          {photoPreview && <img src={photoPreview} alt={fullName} className="bio-d-photo" />}
          <div><div className="bio-d-name">{fullName || 'Candidate Name'}</div>{dob && <div className="bio-d-dob">{t.bioBorn}: {formatDate(dob)}</div>}{(caste || religion) && <div className="bio-d-caste">{[religion, caste].filter(Boolean).join(' • ')}</div>}</div>
        </div>
        <table className="bio-d-table">
          <tbody>
            <tr className="bio-d-section-row"><td colSpan="2">{t.bioPersonal}</td></tr>
            {age && <tr><td>{t.bioAge}</td><td>{age} {t.bioYears}</td></tr>}
            {height && <tr><td>{t.bioHeight}</td><td>{height}</td></tr>}
            {weight && <tr><td>{t.bioWeight}</td><td>{weight}</td></tr>}
            {complexion && <tr><td>{t.bioComplexion}</td><td>{complexion}</td></tr>}
            {bloodGroup && <tr><td>{t.bioBlood}</td><td>{bloodGroup}</td></tr>}
            {hasAstro && <><tr className="bio-d-section-row"><td colSpan="2">{t.bioAstro}</td></tr>{gotra && <tr><td>{t.bioGotra}</td><td>{gotra}</td></tr>}{rashi && <tr><td>{t.bioRashi}</td><td>{rashi}</td></tr>}{nakshatra && <tr><td>{t.bioNakshatra}</td><td>{nakshatra}</td></tr>}{manglik && <tr><td>{t.bioManglik}</td><td>{manglik}</td></tr>}</>}
            <tr className="bio-d-section-row"><td colSpan="2">{t.bioEdu}</td></tr>
            {education && <tr><td>{t.bioEducation}</td><td>{education}</td></tr>}
            {occupation && <tr><td>{t.bioOccupation}</td><td>{occupation}</td></tr>}
            {annualIncome && <tr><td>{t.bioIncome}</td><td>{annualIncome}</td></tr>}
            {hasFamily && <><tr className="bio-d-section-row"><td colSpan="2">{t.bioFamily}</td></tr>{fatherName && <tr><td>{t.bioFather}</td><td>{fatherName}</td></tr>}{motherName && <tr><td>{t.bioMother}</td><td>{motherName}</td></tr>}{siblings && <tr><td>{t.bioSiblings}</td><td>{siblings}</td></tr>}</>}
            <tr className="bio-d-section-row"><td colSpan="2">{t.bioContact}</td></tr>
            {contactName && <tr><td>{t.bioContactPerson}</td><td>{contactName}</td></tr>}
            {contactPhone && <tr><td>{t.bioPhone}</td><td>{contactPhone}</td></tr>}
            {contactAddress && <tr><td>{t.bioAddress}</td><td>{contactAddress}</td></tr>}
          </tbody>
        </table>
        <div className="bio-d-strip" />
      </div>
    );
  }

  /* ─── LAYOUT E: Modern Hero Photo Centered ─── */
  return (
    <div id="biodata-print" className={`biodata-card bio-layout-e ${theme.class}`}>
      <div className="bio-e-border">
        <div className="bio-e-header">
          <span className="bio-e-deco">{headerText.deco}</span>
          <h1 className="bio-e-title">{headerText.title}</h1>
          <p className="bio-e-subtitle">{headerText.subtitle}</p>
        </div>
        <div className="bio-e-hero">
          {photoPreview && <div className="bio-e-photo-frame"><img src={photoPreview} alt={fullName} className="bio-e-photo" /></div>}
          <div className="bio-e-name">{fullName || 'Candidate Name'}</div>
          {dob && <div className="bio-e-dob">{t.bioBorn}: {formatDate(dob)}</div>}
          {(caste || religion) && <div className="bio-e-caste">{[religion, caste].filter(Boolean).join(' • ')}</div>}
        </div>
        <div className="bio-e-sections">
          <div className="bio-e-section"><div className="bio-e-sec-title">{t.bioPersonal}</div><div className="bio-e-rows"><Row label={t.bioAge} value={age ? `${age} ${t.bioYears}` : ''} /><Row label={t.bioHeight} value={height} /><Row label={t.bioWeight} value={weight} /><Row label={t.bioComplexion} value={complexion} /><Row label={t.bioBlood} value={bloodGroup} /></div></div>
          {hasAstro && <div className="bio-e-section"><div className="bio-e-sec-title">{t.bioAstro}</div><div className="bio-e-rows"><Row label={t.bioGotra} value={gotra} /><Row label={t.bioRashi} value={rashi} /><Row label={t.bioNakshatra} value={nakshatra} /><Row label={t.bioManglik} value={manglik} /></div></div>}
          <div className="bio-e-section"><div className="bio-e-sec-title">{t.bioEdu}</div><div className="bio-e-rows"><Row label={t.bioEducation} value={education} /><Row label={t.bioOccupation} value={occupation} /><Row label={t.bioIncome} value={annualIncome} /></div></div>
          {hasFamily && <div className="bio-e-section"><div className="bio-e-sec-title">{t.bioFamily}</div><div className="bio-e-rows"><Row label={t.bioFather} value={fatherName} /><Row label={t.bioMother} value={motherName} /><Row label={t.bioSiblings} value={siblings} /></div></div>}
          <div className="bio-e-section"><div className="bio-e-sec-title">{t.bioContact}</div><div className="bio-e-rows"><Row label={t.bioContactPerson} value={contactName} /><Row label={t.bioPhone} value={contactPhone} /><Row label={t.bioAddress} value={contactAddress} /></div></div>
        </div>
        <div className="bio-footer"><div className="bio-footer-deco">{theme.footer}</div></div>
      </div>
    </div>
  );
}
