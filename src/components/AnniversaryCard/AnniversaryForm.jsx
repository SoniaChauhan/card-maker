import FormField from '../shared/FormField';

export default function AnniversaryForm({ data, errors, onChange, onBack, onGenerate }) {
  return (
    <div className="form-screen anniversary-form-screen">
      <div className="form-card">
        <div className="form-header">
          <span className="form-header-icon">💍</span>
          <h2>Anniversary Card Details</h2>
          <p>Celebrate a beautiful love story with a romantic personalised card.</p>
        </div>

        <div className="form-grid">
          <FormField label="Guest / Recipient Name" name="guestName"
            value={data.guestName} onChange={onChange}
            placeholder="Who will receive this card?" required error={errors.guestName} />

          <FormField label="Partner 1 Name" name="partner1"
            value={data.partner1} onChange={onChange}
            placeholder="First partner's name" required error={errors.partner1} />

          <FormField label="Partner 2 Name" name="partner2"
            value={data.partner2} onChange={onChange}
            placeholder="Second partner's name" required error={errors.partner2} />

          <FormField label="Years Together" name="years"
            type="number" value={data.years} onChange={onChange}
            placeholder="e.g. 10" min="1" />

          <FormField label="Date of Anniversary" name="date"
            type="date" value={data.date} onChange={onChange}
            required error={errors.date} />

          <FormField label="Time" name="time"
            type="time" value={data.time} onChange={onChange} />

          <FormField label="Venue / Location" name="venue"
            value={data.venue} onChange={onChange}
            placeholder="Where is the celebration?" required error={errors.venue} />

          <FormField label="Venue Address" name="venueAddress"
            value={data.venueAddress} onChange={onChange}
            placeholder="Full address (optional)" />

          <FormField label="Personal Message" name="message"
            value={data.message} onChange={onChange}
            placeholder="Write a romantic message…" rows={3} span />
        </div>

        <div className="form-actions">
          <button className="btn-back-form" onClick={onBack}>← Back</button>
          <button
            className="btn-generate"
            onClick={onGenerate}
            style={{ background: 'linear-gradient(135deg,#dc3c64,#a18cd1)', color: '#fff', boxShadow: '0 8px 24px rgba(220,60,100,.4)' }}
          >
            💖 Generate Card
          </button>
        </div>
      </div>
    </div>
  );
}
