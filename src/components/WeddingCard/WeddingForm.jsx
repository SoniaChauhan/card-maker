import FormField from '../shared/FormField';

export default function WeddingForm({ data, errors, onChange, onBack, onGenerate }) {
  const today = new Date().toISOString().split('T')[0];
  return (
    <div className="form-screen wedding-form-screen">
      <div className="form-card">
        <div className="form-header">
          <span className="form-header-icon">🪷</span>
          <h2>Wedding Invitation Details</h2>
          <p>Fill in the details and we'll create a beautiful wedding invitation card!</p>
        </div>

        <div className="form-grid">
          {/* Couple */}
          <FormField label="Groom's Name" name="groomName"
            value={data.groomName} onChange={onChange}
            placeholder="Full name of the groom" required
            error={errors.groomName} />

          <FormField label="Bride's Name" name="brideName"
            value={data.brideName} onChange={onChange}
            placeholder="Full name of the bride" required
            error={errors.brideName} />

          <FormField label="Groom's Family / Father's Name" name="groomFamily"
            value={data.groomFamily} onChange={onChange}
            placeholder="e.g. S/O Ramesh Kumar Sharma" />

          <FormField label="Bride's Family / Father's Name" name="brideFamily"
            value={data.brideFamily} onChange={onChange}
            placeholder="e.g. D/O Suresh Gupta" />

          {/* Ceremony */}
          <FormField label="Wedding Date" name="weddingDate"
            type="date" value={data.weddingDate} onChange={onChange}
            required error={errors.weddingDate} min={today} />

          <FormField label="Wedding Time" name="weddingTime"
            type="time" value={data.weddingTime} onChange={onChange} />

          <FormField label="Wedding Venue" name="weddingVenue"
            value={data.weddingVenue} onChange={onChange}
            placeholder="e.g. Shri Ram Marriage Garden" required
            error={errors.weddingVenue} />

          <FormField label="Venue Address" name="weddingVenueAddress"
            value={data.weddingVenueAddress} onChange={onChange}
            placeholder="Full address (optional)" />

          {/* Reception */}
          <FormField label="Reception Date" name="receptionDate"
            type="date" value={data.receptionDate} onChange={onChange}
            min={today} />

          <FormField label="Reception Time" name="receptionTime"
            type="time" value={data.receptionTime} onChange={onChange} />

          <FormField label="Reception Venue" name="receptionVenue"
            value={data.receptionVenue} onChange={onChange}
            placeholder="e.g. Hotel Grand Palace (optional)" />

          {/* Guest */}
          <FormField label="Invited Guest Name" name="guestName"
            value={data.guestName} onChange={onChange}
            placeholder="Who is being invited?" required
            error={errors.guestName} />

          <FormField label="Special Message / RSVP Note" name="message"
            value={data.message} onChange={onChange}
            placeholder="e.g. Your presence will bless our union…" rows={3} span />
        </div>

        {/* — Family Members — */}
        <div className="form-stack">
          <div className="form-group">
            <label className="form-label">👨‍👩‍👧‍👦 Family Members <span className="optional">(one per line)</span></label>
            <textarea
              className="form-input"
              name="familyMembers"
              value={data.familyMembers}
              onChange={onChange}
              placeholder={"e.g.\nMr. & Mrs. Ramesh Sharma\nRahul Sharma (Brother)\nPriya Sharma (Sister)\nGrandmother - Smt. Kamla Devi"}
              rows={5}
              style={{ resize: 'vertical', fontFamily: 'inherit', fontSize: '13px', lineHeight: '1.6' }}
            />
          </div>
        </div>

        {/* — Couple Photo — */}
        <div className="form-stack" style={{ marginBottom: 0 }}>
          <div className="card-photo-upload">
            <label htmlFor="wedding-photo">
              📷 Upload Couple Photo <span className="optional">(optional)</span>
            </label>
            <input type="file" id="wedding-photo" name="photo" accept="image/*" onChange={onChange} />
            {data.photoPreview && (
              <img src={data.photoPreview} alt="Preview" className="card-photo-preview card-photo-preview--circle" />
            )}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-back-form" onClick={onBack}>← Back</button>
          <button className="btn-generate" onClick={onGenerate}
            style={{ background: 'linear-gradient(135deg,#7b1c1c,#c9963e)', color: '#fff', boxShadow: '0 8px 24px rgba(123,28,28,.4)' }}>
            🪷 Generate Invitation
          </button>
        </div>
      </div>
    </div>
  );
}
