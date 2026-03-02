import FormField from '../shared/FormField';

export default function FestivalForm({ data, errors, onChange, onBack, onGenerate, festivals }) {
  return (
    <div className="form-screen festival-form-screen">
      <div className="form-card">
        <div className="form-header">
          <span className="form-header-icon">🎆</span>
          <h2>Festival Greeting Card</h2>
          <p>Beautiful customizable cards for all Indian festivals — Holi, Diwali, Lohri, Navratri, Eid, Christmas, and more.</p>
        </div>

        {/* ── Festival selector ── */}
        <div className="fest-selector">
          <label className="fest-selector-label">🎨 Choose Festival:</label>
          <div className="fest-selector-grid">
            {festivals.map(f => (
              <button
                key={f.id}
                type="button"
                className={`fest-selector-btn ${data.festival === f.id ? 'fest-selector-btn--active' : ''}`}
                onClick={() => onChange({ target: { name: 'festival', value: f.id } })}
              >
                <span className="fest-selector-icon">{f.icon}</span>
                <span className="fest-selector-name">{f.tag}</span>
              </button>
            ))}
          </div>
          {data.festival && (
            <p className="fest-selector-desc">
              {festivals.find(f => f.id === data.festival)?.desc}
            </p>
          )}
        </div>

        <div className="form-grid">
          <FormField label="Your Name" name="senderName"
            value={data.senderName} onChange={onChange}
            placeholder="e.g. Rahul Sharma" required
            error={errors.senderName} />

          <FormField label="Recipient Name" name="recipientName"
            value={data.recipientName} onChange={onChange}
            placeholder="Who are you sending this to? (optional)" />

          <FormField label="Custom Greeting Line" name="customGreeting"
            value={data.customGreeting} onChange={onChange}
            placeholder="e.g. Wishing you joy & happiness!" />

          <FormField label="Personal Message" name="message"
            value={data.message} onChange={onChange}
            placeholder="Write a heartfelt message…" rows={3} span />
        </div>

        {/* — Photo Upload — */}
        <div className="form-stack" style={{ marginBottom: 0 }}>
          <div className="card-photo-upload">
            <label htmlFor="fest-photo">
              📷 Upload Photo <span className="optional">(optional)</span>
            </label>
            <input type="file" id="fest-photo" name="photo" accept="image/*" onChange={onChange} />
            {data.photoPreview && (
              <img src={data.photoPreview} alt="Preview" className="card-photo-preview card-photo-preview--circle" />
            )}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-back-form" onClick={onBack}>← Back</button>
          <button className="btn-generate" onClick={onGenerate}
            style={{ background: 'linear-gradient(135deg,#ff6b6b,#feca57)', color: '#fff', boxShadow: '0 8px 24px rgba(255,107,107,.4)' }}>
            🎆 Generate Greeting Card
          </button>
        </div>
      </div>
    </div>
  );
}
