import FormField from '../shared/FormField';

const COMPLEXION_OPTIONS = [
  { value: 'Very Fair', label: 'Very Fair' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Wheatish', label: 'Wheatish' },
  { value: 'Wheatish Brown', label: 'Wheatish Brown' },
  { value: 'Dark', label: 'Dark' },
];

const MANGLIK_OPTIONS = [
  { value: 'No', label: 'No' },
  { value: 'Yes', label: 'Yes' },
  { value: 'Partial', label: 'Partial (Anshik)' },
];

const BLOOD_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(v => ({ value: v, label: v }));

const RASHI_OPTIONS = [
  'Mesh (Aries)', 'Vrishabh (Taurus)', 'Mithun (Gemini)', 'Kark (Cancer)',
  'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchik (Scorpio)',
  'Dhanu (Sagittarius)', 'Makar (Capricorn)', 'Kumbh (Aquarius)', 'Meen (Pisces)',
].map(v => ({ value: v, label: v }));

export default function BiodataForm({ data, errors, onChange, onBack, onGenerate }) {
  const today = new Date().toISOString().split('T')[0];
  const minDob = '1940-01-01';
  return (
    <div className="form-screen biodata-form-screen">
      <div className="form-card biodata-form-card">
        <div className="form-header biodata-form-header">
          <span className="form-header-icon">💍</span>
          <h2>Marriage Biodata</h2>
          <p>Fill in the details to generate a beautiful marriage biodata card.</p>
        </div>

        {/* — Personal Information — */}
        <div className="biodata-section-title">👤 Personal Information</div>
        <div className="form-stack">
          <FormField label="Full Name" name="fullName"
            value={data.fullName} onChange={onChange}
            placeholder="e.g. Priya Sharma" required error={errors.fullName} />

          <FormField label="Date of Birth" name="dob"
            type="date" value={data.dob} onChange={onChange}
            required error={errors.dob} min={minDob} max={today} />

          <FormField label="Age" name="age"
            type="number" value={data.age} onChange={onChange}
            placeholder="e.g. 25" min="18" max="60" />

          <FormField label="Height" name="height"
            value={data.height} onChange={onChange}
            placeholder="e.g. 5 ft 4 in" />

          <FormField label="Weight" name="weight"
            value={data.weight} onChange={onChange}
            placeholder="e.g. 55 kg" />

          <FormField label="Complexion" name="complexion"
            value={data.complexion} onChange={onChange}
            options={COMPLEXION_OPTIONS} />

          <FormField label="Blood Group" name="bloodGroup"
            value={data.bloodGroup} onChange={onChange}
            options={BLOOD_OPTIONS} />

          <FormField label="Religion" name="religion"
            value={data.religion} onChange={onChange}
            placeholder="e.g. Hindu" />

          <FormField label="Caste" name="caste"
            value={data.caste} onChange={onChange}
            placeholder="e.g. Brahmin" />

          <FormField label="Sub Caste" name="subCaste"
            value={data.subCaste} onChange={onChange}
            placeholder="e.g. Saraswat" />
        </div>

        {/* — Astrological Details — */}
        <div className="biodata-section-title">🔮 Astrological Details</div>
        <div className="form-stack">
          <FormField label="Gotra" name="gotra"
            value={data.gotra} onChange={onChange}
            placeholder="e.g. Kashyap" />

          <FormField label="Rashi (Moon Sign)" name="rashi"
            value={data.rashi} onChange={onChange}
            options={RASHI_OPTIONS} />

          <FormField label="Nakshatra (Birth Star)" name="nakshatra"
            value={data.nakshatra} onChange={onChange}
            placeholder="e.g. Rohini" />

          <FormField label="Manglik" name="manglik"
            value={data.manglik} onChange={onChange}
            options={MANGLIK_OPTIONS} />
        </div>

        {/* — Education & Career — */}
        <div className="biodata-section-title">🎓 Education &amp; Career</div>
        <div className="form-stack">
          <FormField label="Highest Education" name="education"
            value={data.education} onChange={onChange}
            placeholder="e.g. B.Tech / MBA / M.Sc" required error={errors.education} />

          <FormField label="Occupation" name="occupation"
            value={data.occupation} onChange={onChange}
            placeholder="e.g. Software Engineer" />

          <FormField label="Employer / Company" name="employer"
            value={data.employer} onChange={onChange}
            placeholder="e.g. TCS, Self-employed" />

          <FormField label="Annual Income" name="annualIncome"
            value={data.annualIncome} onChange={onChange}
            placeholder="e.g. 8 LPA" />
        </div>

        {/* — Family Details — */}
        <div className="biodata-section-title">👨‍👩‍👧 Family Details</div>
        <div className="form-stack">
          <FormField label="Father's Name" name="fatherName"
            value={data.fatherName} onChange={onChange}
            placeholder="Father's full name" />

          <FormField label="Father's Occupation" name="fatherOccupation"
            value={data.fatherOccupation} onChange={onChange}
            placeholder="e.g. Retired Govt. Officer" />

          <FormField label="Mother's Name" name="motherName"
            value={data.motherName} onChange={onChange}
            placeholder="Mother's full name" />

          <FormField label="Mother's Occupation" name="motherOccupation"
            value={data.motherOccupation} onChange={onChange}
            placeholder="e.g. Homemaker" />

          <FormField label="Siblings" name="siblings"
            value={data.siblings} onChange={onChange}
            placeholder="e.g. 1 Elder Brother (Married)" />
        </div>

        {/* — About Me — */}
        <div className="biodata-section-title">💬 About Me</div>
        <div className="form-stack">
          <FormField label="Hobbies &amp; Interests" name="hobbies"
            value={data.hobbies} onChange={onChange}
            placeholder="e.g. Reading, Cooking, Travelling" />

          <FormField label="About Yourself" name="aboutMe"
            value={data.aboutMe} onChange={onChange}
            placeholder="Write a short introduction about yourself…"
            rows={3} />
        </div>

        {/* — Contact Details — */}
        <div className="biodata-section-title">📞 Contact Details</div>
        <div className="form-stack">
          <FormField label="Contact Person Name" name="contactName"
            value={data.contactName} onChange={onChange}
            placeholder="e.g. Ramesh Sharma (Father)" />

          <FormField label="Contact Number" name="contactPhone"
            value={data.contactPhone} onChange={onChange}
            placeholder="e.g. +91 98765 43210" required error={errors.contactPhone} />

          <FormField label="Address" name="contactAddress"
            value={data.contactAddress} onChange={onChange}
            placeholder="City, State" />
        </div>

        {/* — Photo Upload — */}
        <div className="biodata-section-title">📷 Photo (optional)</div>
        <div className="form-grid">
          <div className="form-group span-2 biodata-photo-upload">
            <label htmlFor="photo">Upload Photo <span className="optional">(optional)</span></label>
            <input type="file" id="photo" name="photo" accept="image/*" onChange={onChange} />
            {data.photoPreview && (
              <img src={data.photoPreview} alt="Preview" className="biodata-photo-preview" />
            )}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-back-form" onClick={onBack}>← Back</button>
          <button
            className="btn-generate"
            onClick={onGenerate}
            style={{ background: 'linear-gradient(135deg,#d4af37,#c0392b)', color: '#fff', boxShadow: '0 8px 24px rgba(212,175,55,.4)' }}
          >
            💍 Generate Biodata
          </button>
        </div>
      </div>
    </div>
  );
}
