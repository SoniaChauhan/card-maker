'use client';
import { useState } from 'react';
import FormField from '../shared/FormField';
import DobPicker from '../shared/DobPicker';

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

const STEPS = [
  { id: 1, label: 'Basic Info', icon: '👤' },
  { id: 2, label: 'Family', icon: '👨‍👩‍👧' },
  { id: 3, label: 'Contact', icon: '📞' },
];

/* Default visibility for all fields */
const DEFAULT_VISIBILITY = {
  fullName: true, dob: true, age: true, height: true, weight: true,
  complexion: true, bloodGroup: true, religion: true, caste: true, subCaste: true,
  gotra: true, rashi: true, nakshatra: true, manglik: true,
  education: true, occupation: true, employer: true, annualIncome: true,
  fatherName: true, fatherOccupation: true, motherName: true, motherOccupation: true, siblings: true,
  hobbies: true, aboutMe: true,
  contactName: true, contactPhone: true, contactAddress: true,
};

/* Field wrapper - defined outside component to prevent re-creation on every render */
function FieldWithToggle({ label, children, required }) {
  return (
    <div className="bio-field-wrapper">
      <div className="bio-field-header">
        <span className="bio-field-label">{label} {required && <span className="required-star">*</span>}</span>
      </div>
      <div className="bio-field-content">
        {children}
      </div>
    </div>
  );
}

export default function BiodataFormNew({ data, errors, onChange, onBack, onGenerate, fieldVisibility, onVisibilityChange }) {
  const [step, setStep] = useState(1);
  const visibility = fieldVisibility || DEFAULT_VISIBILITY;

  function onAgeChange(ageStr) {
    onChange({ target: { name: 'age', value: ageStr } });
  }

  function toggleVisibility(fieldName) {
    if (onVisibilityChange) {
      onVisibilityChange(fieldName, !visibility[fieldName]);
    }
  }

  const progress = (step / STEPS.length) * 100;

  return (
    <div className="form-screen biodata-form-screen biodata-form-new">
      <div className="form-card biodata-form-card">
        {/* Header */}
        <div className="form-header biodata-form-header">
          <span className="form-header-icon">💍</span>
          <h2>Create Your Marriage Biodata</h2>
          <p>Fill in the details step by step to create a beautiful biodata</p>
        </div>

        {/* Step Indicator */}
        <div className="bio-steps-container">
          <div className="bio-steps">
            {STEPS.map((s, idx) => (
              <div key={s.id} className={`bio-step ${step >= s.id ? 'bio-step-active' : ''} ${step === s.id ? 'bio-step-current' : ''}`}>
                <div className="bio-step-circle">{s.id}</div>
                <span className="bio-step-label">{s.label}</span>
                {idx < STEPS.length - 1 && <div className="bio-step-line" />}
              </div>
            ))}
          </div>
          <div className="bio-progress-bar">
            <div className="bio-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="bio-step-content">
            <div className="bio-section-card">
              <h3 className="bio-section-title">👤 Personal Details</h3>
              
              <FieldWithToggle label="Full Name" name="fullName" required>
                <FormField name="fullName" value={data.fullName} onChange={onChange}
                  placeholder="e.g. Priya Sharma" error={errors.fullName} hideLabel />
              </FieldWithToggle>

              <FieldWithToggle label="Date of Birth" name="dob" required>
                <DobPicker value={data.dob} onChange={onChange} onAgeChange={onAgeChange}
                  error={errors.dob} hideLabel />
              </FieldWithToggle>

              <FieldWithToggle label="Age" name="age">
                <FormField name="age" type="number" value={data.age} onChange={onChange}
                  placeholder="Auto-calculated" min="18" max="60" hideLabel />
              </FieldWithToggle>

              <FieldWithToggle label="Height" name="height">
                <FormField name="height" value={data.height} onChange={onChange}
                  placeholder="e.g. 5 ft 4 in" hideLabel />
              </FieldWithToggle>

              <FieldWithToggle label="Weight" name="weight">
                <FormField name="weight" value={data.weight} onChange={onChange}
                  placeholder="e.g. 55 kg" hideLabel />
              </FieldWithToggle>

              <FieldWithToggle label="Complexion" name="complexion">
                <FormField name="complexion" value={data.complexion} onChange={onChange}
                  options={COMPLEXION_OPTIONS} hideLabel />
              </FieldWithToggle>

              <FieldWithToggle label="Blood Group" name="bloodGroup">
                <FormField name="bloodGroup" value={data.bloodGroup} onChange={onChange}
                  options={BLOOD_OPTIONS} hideLabel />
              </FieldWithToggle>

              <FieldWithToggle label="Religion" name="religion">
                <FormField name="religion" value={data.religion} onChange={onChange}
                  placeholder="e.g. Hindu" hideLabel />
              </FieldWithToggle>

              <FieldWithToggle label="Caste" name="caste">
                <FormField name="caste" value={data.caste} onChange={onChange}
                  placeholder="e.g. Brahmin" hideLabel />
              </FieldWithToggle>

              <FieldWithToggle label="Sub Caste" name="subCaste">
                <FormField name="subCaste" value={data.subCaste} onChange={onChange}
                  placeholder="e.g. Saraswat" hideLabel />
              </FieldWithToggle>
            </div>

            <div className="bio-section-card">
              <h3 className="bio-section-title">🔮 Astrological Details</h3>
              
              <FieldWithToggle label="Gotra" name="gotra">
                <FormField name="gotra" value={data.gotra} onChange={onChange}
                  placeholder="e.g. Kashyap" hideLabel />
              </FieldWithToggle>

              <FieldWithToggle label="Rashi (Moon Sign)" name="rashi">
                <FormField name="rashi" value={data.rashi} onChange={onChange}
                  options={RASHI_OPTIONS} hideLabel />
              </FieldWithToggle>

              <FieldWithToggle label="Nakshatra" name="nakshatra">
                <FormField name="nakshatra" value={data.nakshatra} onChange={onChange}
                  placeholder="e.g. Rohini" hideLabel />
              </FieldWithToggle>

              <FieldWithToggle label="Manglik" name="manglik">
                <FormField name="manglik" value={data.manglik} onChange={onChange}
                  options={MANGLIK_OPTIONS} hideLabel />
              </FieldWithToggle>
            </div>

            <div className="bio-section-card">
              <h3 className="bio-section-title">🎓 Education &amp; Career</h3>
              
              <FieldWithToggle label="Highest Education" name="education" required>
                <FormField name="education" value={data.education} onChange={onChange}
                  placeholder="e.g. B.Tech / MBA" error={errors.education} hideLabel />
              </FieldWithToggle>

              <FieldWithToggle label="Occupation" name="occupation">
                <FormField name="occupation" value={data.occupation} onChange={onChange}
                  placeholder="e.g. Software Engineer" hideLabel />
              </FieldWithToggle>

              <FieldWithToggle label="Employer / Company" name="employer">
                <FormField name="employer" value={data.employer} onChange={onChange}
                  placeholder="e.g. TCS, Self-employed" hideLabel />
              </FieldWithToggle>

              <FieldWithToggle label="Annual Income" name="annualIncome">
                <FormField name="annualIncome" value={data.annualIncome} onChange={onChange}
                  placeholder="e.g. 8 LPA" hideLabel />
              </FieldWithToggle>
            </div>

            {/* Photo Upload */}
            <div className="bio-section-card">
              <h3 className="bio-section-title">📷 Photo (Optional)</h3>
              <div className="bio-photo-upload">
                <div className="bio-photo-preview-area">
                  {data.photoPreview ? (
                    <img src={data.photoPreview} alt="Preview" className="bio-photo-img" />
                  ) : (
                    <div className="bio-photo-placeholder">
                      <span>📷</span>
                      <p>Upload Photo</p>
                    </div>
                  )}
                </div>
                <div className="bio-photo-info">
                  <input type="file" id="photo" name="photo" accept="image/*" onChange={onChange} />
                  <p className="bio-photo-hint">• Portrait photo recommended<br/>• Image will be cropped to 4:5 ratio</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Family Details */}
        {step === 2 && (
          <div className="bio-step-content">
            <div className="bio-section-card">
              <h3 className="bio-section-title">👨‍👩‍👧 Family Details</h3>
              
              <FieldWithToggle label="Father's Name" name="fatherName">
                <FormField name="fatherName" value={data.fatherName} onChange={onChange}
                  placeholder="Father's full name" hideLabel />
              </FieldWithToggle>

              <FieldWithToggle label="Father's Occupation" name="fatherOccupation">
                <FormField name="fatherOccupation" value={data.fatherOccupation} onChange={onChange}
                  placeholder="e.g. Retired Govt. Officer" hideLabel />
              </FieldWithToggle>

              <FieldWithToggle label="Mother's Name" name="motherName">
                <FormField name="motherName" value={data.motherName} onChange={onChange}
                  placeholder="Mother's full name" hideLabel />
              </FieldWithToggle>

              <FieldWithToggle label="Mother's Occupation" name="motherOccupation">
                <FormField name="motherOccupation" value={data.motherOccupation} onChange={onChange}
                  placeholder="e.g. Homemaker" hideLabel />
              </FieldWithToggle>

              <FieldWithToggle label="Siblings" name="siblings">
                <FormField name="siblings" value={data.siblings} onChange={onChange}
                  placeholder="e.g. 1 Elder Brother (Married)" hideLabel />
              </FieldWithToggle>
            </div>

            <div className="bio-section-card">
              <h3 className="bio-section-title">💬 About Me</h3>
              
              <FieldWithToggle label="Hobbies &amp; Interests" name="hobbies">
                <FormField name="hobbies" value={data.hobbies} onChange={onChange}
                  placeholder="e.g. Reading, Cooking, Travelling" hideLabel />
              </FieldWithToggle>

              <FieldWithToggle label="About Yourself" name="aboutMe">
                <FormField name="aboutMe" value={data.aboutMe} onChange={onChange}
                  placeholder="Write a short introduction about yourself…"
                  rows={3} hideLabel />
              </FieldWithToggle>
            </div>
          </div>
        )}

        {/* Step 3: Contact Details */}
        {step === 3 && (
          <div className="bio-step-content">
            <div className="bio-section-card">
              <h3 className="bio-section-title">📞 Contact Details</h3>
              
              <FieldWithToggle label="Contact Person" name="contactName">
                <FormField name="contactName" value={data.contactName} onChange={onChange}
                  placeholder="e.g. Ramesh Sharma (Father)" hideLabel />
              </FieldWithToggle>

              <FieldWithToggle label="Mobile Number" name="contactPhone" required>
                <FormField name="contactPhone" value={data.contactPhone} onChange={onChange}
                  placeholder="e.g. +91 98765 43210" error={errors.contactPhone} hideLabel />
              </FieldWithToggle>

              <FieldWithToggle label="Address" name="contactAddress">
                <FormField name="contactAddress" value={data.contactAddress} onChange={onChange}
                  placeholder="City, State" hideLabel />
              </FieldWithToggle>
            </div>

            <div className="bio-ready-card">
              <div className="bio-ready-icon">✅</div>
              <h3>Almost Ready!</h3>
              <p>Click "Preview Biodata" to see your beautifully designed marriage profile.</p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="bio-form-actions">
          {step === 1 ? (
            <button className="bio-btn-back" onClick={onBack}>← Back to Home</button>
          ) : (
            <button className="bio-btn-prev" onClick={() => setStep(s => s - 1)}>← Previous</button>
          )}
          
          {step < 3 ? (
            <button className="bio-btn-next" onClick={() => setStep(s => s + 1)}>Next →</button>
          ) : (
            <button className="bio-btn-preview" onClick={onGenerate}>
              ✨ Preview Biodata
            </button>
          )}
        </div>

        <button className="bio-reset-btn" onClick={() => window.location.reload()}>
          ↻ Reset Form
        </button>
      </div>
    </div>
  );
}
