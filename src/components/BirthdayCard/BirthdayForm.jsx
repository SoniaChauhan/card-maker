import FormField from '../shared/FormField';

export default function BirthdayForm({ data, errors, onChange, onBack, onGenerate }) {
  const today = new Date().toISOString().split('T')[0];
  return (
    <div className="form-screen birthday-form-screen">
      <div className="form-card">
        <div className="form-header">
          <span className="form-header-icon">�</span>
          <h2>Birthday Invitation Details</h2>
          <p>Fill in the details and we'll create a beautiful birthday party invitation!</p>
        </div>

        <div className="form-grid">
          <FormField label="Birthday Person's Name" name="birthdayPerson"
            value={data.birthdayPerson} onChange={onChange}
            placeholder="Whose birthday is it?" required
            error={errors.birthdayPerson} />

          <FormField label="Age (Milestone)" name="age"
            type="number" value={data.age} onChange={onChange}
            placeholder="e.g. 25" min="1" max="120" />

          <FormField label="Invited Guest Name" name="guestName"
            value={data.guestName} onChange={onChange}
            placeholder="Who is being invited?" required
            error={errors.guestName} />

          <FormField label="Hosted By" name="hostName"
            value={data.hostName} onChange={onChange}
            placeholder="e.g. The Sharma Family" />

          <FormField label="Date of Party" name="date"
            type="date" value={data.date} onChange={onChange}
            required error={errors.date} min={today} />

          <FormField label="Party Time" name="time"
            type="time" value={data.time} onChange={onChange} />

          <FormField label="Venue / Location" name="venue"
            value={data.venue} onChange={onChange}
            placeholder="e.g. Home, Grand Ballroom" required
            error={errors.venue} />

          <FormField label="Venue Address" name="venueAddress"
            value={data.venueAddress} onChange={onChange}
            placeholder="Full address (optional)" />

          <FormField label="Special Message / RSVP Note" name="message"
            value={data.message} onChange={onChange}
            placeholder="e.g. Kindly RSVP by…" rows={3} span />
        </div>

        {/* — Photo Upload — */}
        <div className="form-stack" style={{ marginBottom: 0 }}>
          <div className="card-photo-upload">
            <label htmlFor="bday-photo">
              📷 Upload Photo <span className="optional">(optional)</span>
            </label>
            <input type="file" id="bday-photo" name="photo" accept="image/*" onChange={onChange} />
            {data.photoPreview && (
              <img src={data.photoPreview} alt="Preview" className="card-photo-preview card-photo-preview--circle" />
            )}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-back-form" onClick={onBack}>← Back</button>
          <button className="btn-generate" onClick={onGenerate}
            style={{ background: 'linear-gradient(135deg,#ff6b6b,#feca57)', color: '#fff', boxShadow: '0 8px 24px rgba(255,107,107,.4)' }}>
            🎉 Generate Invitation
          </button>
        </div>
      </div>
    </div>
  );
}
