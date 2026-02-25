import FormField from '../shared/FormField';

export default function BirthdayForm({ data, errors, onChange, onBack, onGenerate }) {
  const today = new Date().toISOString().split('T')[0];
  return (
    <div className="form-screen birthday-form-screen">
      <div className="form-card">
        <div className="form-header">
          <span className="form-header-icon">🎂</span>
          <h2>Birthday Card Details</h2>
          <p>Fill in the details and we'll create a beautiful personalised birthday card!</p>
        </div>

        <div className="form-grid">
          <FormField label="Guest / Recipient Name" name="guestName"
            value={data.guestName} onChange={onChange}
            placeholder="Who will receive this card?" required
            error={errors.guestName} />

          <FormField label="Birthday Person's Name" name="birthdayPerson"
            value={data.birthdayPerson} onChange={onChange}
            placeholder="Whose birthday is it?" required
            error={errors.birthdayPerson} />

          <FormField label="Age (if applicable)" name="age"
            type="number" value={data.age} onChange={onChange}
            placeholder="e.g. 25" min="1" max="120" />

          <FormField label="Date of Birthday" name="date"
            type="date" value={data.date} onChange={onChange}
            required error={errors.date} min={today} />

          <FormField label="Venue / Location" name="venue"
            value={data.venue} onChange={onChange}
            placeholder="e.g. Home, Grand Ballroom" required
            error={errors.venue} />

          <FormField label="Venue Address" name="venueAddress"
            value={data.venueAddress} onChange={onChange}
            placeholder="Full address (optional)" />

          <FormField label="Personal Message" name="message"
            value={data.message} onChange={onChange}
            placeholder="Write a heartfelt message…" rows={3} span />
        </div>

        <div className="form-actions">
          <button className="btn-back-form" onClick={onBack}>← Back</button>
          <button className="btn-generate" onClick={onGenerate}
            style={{ background: 'linear-gradient(135deg,#ff6b6b,#feca57)', color: '#fff', boxShadow: '0 8px 24px rgba(255,107,107,.4)' }}>
            🎉 Generate Card
          </button>
        </div>
      </div>
    </div>
  );
}
