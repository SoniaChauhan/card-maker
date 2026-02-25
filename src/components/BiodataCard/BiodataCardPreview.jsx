import { formatDate } from '../../utils/helpers';
import { T } from '../../utils/translations';

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

export default function BiodataCardPreview({ data, lang = 'en' }) {
  const t = T[lang];
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

  return (
    <div id="biodata-print" className="biodata-card">

      {/* Header */}
      <div className="bio-header">
        <div className="bio-header-deco">🌸 ॐ 🌸</div>
        <div className="bio-header-title">{t.bioTitle}</div>
        <div className="bio-header-sub">{t.bioSubTitle}</div>
        <div className="bio-divider-ornament">❧ ✦ ❧</div>
      </div>

      {/* Photo + Name Section */}
      <div className="bio-top-section">
        {photoPreview && (
          <img src={photoPreview} alt={fullName} className="bio-photo" />
        )}
        <div className="bio-name-block">
          <div className="bio-full-name">{fullName || 'Candidate Name'}</div>
          {dob && <div className="bio-dob-line">{t.bioBorn}: {formatDate(dob)}</div>}
          {(caste || religion) && (
            <div className="bio-caste-line">{[religion, caste].filter(Boolean).join(' • ')}</div>
          )}
        </div>
      </div>

      <div className="bio-divider" />

      {/* Personal Details */}
      <div className="bio-section">
        <div className="bio-section-heading">{t.bioPersonal}</div>
        <div className="bio-rows">
          <Row label={t.bioAge}        value={age ? `${age} ${t.bioYears}` : ''} />
          <Row label={t.bioHeight}     value={height} />
          <Row label={t.bioWeight}     value={weight} />
          <Row label={t.bioComplexion} value={complexion} />
          <Row label={t.bioBlood}      value={bloodGroup} />
          <Row label={t.bioReligion}   value={religion} />
          <Row label={t.bioCaste}      value={caste} />
          <Row label={t.bioSubCaste}   value={subCaste} />
        </div>
      </div>

      <div className="bio-divider" />

      {/* Astrological Details */}
      {(gotra || rashi || nakshatra || manglik) && (
        <>
          <div className="bio-section">
            <div className="bio-section-heading">{t.bioAstro}</div>
            <div className="bio-rows">
              <Row label={t.bioGotra}     value={gotra} />
              <Row label={t.bioRashi}     value={rashi} />
              <Row label={t.bioNakshatra} value={nakshatra} />
              <Row label={t.bioManglik}   value={manglik} />
            </div>
          </div>
          <div className="bio-divider" />
        </>
      )}

      {/* Education & Career */}
      <div className="bio-section">
        <div className="bio-section-heading">{t.bioEdu}</div>
        <div className="bio-rows">
          <Row label={t.bioEducation}  value={education} />
          <Row label={t.bioOccupation} value={occupation} />
          <Row label={t.bioEmployer}   value={employer} />
          <Row label={t.bioIncome}     value={annualIncome} />
        </div>
      </div>

      <div className="bio-divider" />

      {/* Family Details */}
      {(fatherName || motherName || siblings) && (
        <>
          <div className="bio-section">
            <div className="bio-section-heading">{t.bioFamily}</div>
            <div className="bio-rows">
              <Row label={t.bioFather}    value={fatherName} />
              <Row label={t.bioFatherOcc} value={fatherOccupation} />
              <Row label={t.bioMother}    value={motherName} />
              <Row label={t.bioMotherOcc} value={motherOccupation} />
              <Row label={t.bioSiblings}  value={siblings} />
            </div>
          </div>
          <div className="bio-divider" />
        </>
      )}

      {/* About Me */}
      {(hobbies || aboutMe) && (
        <>
          <div className="bio-section">
            <div className="bio-section-heading">{t.bioAbout}</div>
            {hobbies && (
              <div className="bio-about-row">
                <span className="bio-label">{t.bioHobbies}</span>
                <span className="bio-colon">:</span>
                <span className="bio-value">{hobbies}</span>
              </div>
            )}
            {aboutMe && <div className="bio-about-text">"{aboutMe}"</div>}
          </div>
          <div className="bio-divider" />
        </>
      )}

      {/* Contact Details */}
      <div className="bio-section bio-contact-section">
        <div className="bio-section-heading">{t.bioContact}</div>
        <div className="bio-rows">
          <Row label={t.bioContactPerson} value={contactName} />
          <Row label={t.bioPhone}         value={contactPhone} />
          <Row label={t.bioAddress}       value={contactAddress} />
        </div>
      </div>

      {/* Footer */}
      <div className="bio-footer">
        <div className="bio-footer-deco">🌸 ✦ 🌸 ✦ 🌸</div>
        <div className="bio-footer-note">{t.bioFooter}</div>
      </div>
    </div>
  );
}
