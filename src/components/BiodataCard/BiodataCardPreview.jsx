import { formatDate } from '../../utils/helpers';

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

export default function BiodataCardPreview({ data }) {
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
        <div className="bio-header-title">Marriage Biodata</div>
        <div className="bio-header-sub">विवाह परिचय पत्र</div>
        <div className="bio-divider-ornament">❧ ✦ ❧</div>
      </div>

      {/* Photo + Name Section */}
      <div className="bio-top-section">
        {photoPreview ? (
          <img src={photoPreview} alt={fullName} className="bio-photo" />
        ) : (
          <div className="bio-photo-placeholder">👤</div>
        )}
        <div className="bio-name-block">
          <div className="bio-full-name">{fullName || 'Candidate Name'}</div>
          {dob && <div className="bio-dob-line">Born: {formatDate(dob)}</div>}
          {(caste || religion) && (
            <div className="bio-caste-line">{[religion, caste].filter(Boolean).join(' • ')}</div>
          )}
        </div>
      </div>

      <div className="bio-divider" />

      {/* Personal Details */}
      <div className="bio-section">
        <div className="bio-section-heading">👤 Personal Details</div>
        <div className="bio-rows">
          <Row label="Age"         value={age ? `${age} Years` : ''} />
          <Row label="Height"      value={height} />
          <Row label="Weight"      value={weight} />
          <Row label="Complexion"  value={complexion} />
          <Row label="Blood Group" value={bloodGroup} />
          <Row label="Religion"    value={religion} />
          <Row label="Caste"       value={caste} />
          <Row label="Sub Caste"   value={subCaste} />
        </div>
      </div>

      <div className="bio-divider" />

      {/* Astrological Details */}
      {(gotra || rashi || nakshatra || manglik) && (
        <>
          <div className="bio-section">
            <div className="bio-section-heading">🔮 Astrological Details</div>
            <div className="bio-rows">
              <Row label="Gotra"     value={gotra} />
              <Row label="Rashi"     value={rashi} />
              <Row label="Nakshatra" value={nakshatra} />
              <Row label="Manglik"   value={manglik} />
            </div>
          </div>
          <div className="bio-divider" />
        </>
      )}

      {/* Education & Career */}
      <div className="bio-section">
        <div className="bio-section-heading">🎓 Education &amp; Career</div>
        <div className="bio-rows">
          <Row label="Education"      value={education} />
          <Row label="Occupation"     value={occupation} />
          <Row label="Employer"       value={employer} />
          <Row label="Annual Income"  value={annualIncome} />
        </div>
      </div>

      <div className="bio-divider" />

      {/* Family Details */}
      {(fatherName || motherName || siblings) && (
        <>
          <div className="bio-section">
            <div className="bio-section-heading">👨‍👩‍👧 Family Details</div>
            <div className="bio-rows">
              <Row label="Father's Name"       value={fatherName} />
              <Row label="Father's Occupation" value={fatherOccupation} />
              <Row label="Mother's Name"       value={motherName} />
              <Row label="Mother's Occupation" value={motherOccupation} />
              <Row label="Siblings"            value={siblings} />
            </div>
          </div>
          <div className="bio-divider" />
        </>
      )}

      {/* About Me */}
      {(hobbies || aboutMe) && (
        <>
          <div className="bio-section">
            <div className="bio-section-heading">💬 About Me</div>
            {hobbies && (
              <div className="bio-about-row">
                <span className="bio-label">Hobbies</span>
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
        <div className="bio-section-heading">📞 Contact Details</div>
        <div className="bio-rows">
          <Row label="Contact Person" value={contactName} />
          <Row label="Phone"          value={contactPhone} />
          <Row label="Address"        value={contactAddress} />
        </div>
      </div>

      {/* Footer */}
      <div className="bio-footer">
        <div className="bio-footer-deco">🌸 ✦ 🌸 ✦ 🌸</div>
        <div className="bio-footer-note">With Family Blessings</div>
      </div>
    </div>
  );
}
