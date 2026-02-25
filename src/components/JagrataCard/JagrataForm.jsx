import FormField from '../shared/FormField';
import { RELIGIONS } from '../../utils/religionConfig';

export default function JagrataForm({ data, errors, onChange, onBack, onGenerate }) {
  const today = new Date().toISOString().split('T')[0];
  const selectedReligion = RELIGIONS.find(r => r.code === data.religion) || RELIGIONS[0];
  return (
    <div className="form-screen jagrata-form-screen">
      <div className="form-card">
        <div className="form-header">
          <span className="form-header-icon">{selectedReligion.label.split(' ')[0]}</span>
          <h2>Jagrata Invitation Details</h2>
          <p>Create a beautiful divine invitation &mdash; choose your religion for a personalised card!</p>
        </div>

        <div className="form-grid">
          <div className="form-field" style={{ gridColumn: '1/-1' }}>
            <label className="form-label">Religion / Faith <span className="form-required">*</span></label>
            <select
              name="religion"
              value={data.religion}
              onChange={onChange}
              className="form-input"
              style={{ cursor: 'pointer' }}
            >
              {RELIGIONS.map(r => (
                <option key={r.code} value={r.code}>{r.label}</option>
              ))}
            </select>
          </div>
          <FormField label="Guest / Recipient Name" name="guestName"
            value={data.guestName} onChange={onChange}
            placeholder="Who will receive this invite?" required error={errors.guestName} />

          <FormField label="Organizer Name" name="organizerName"
            value={data.organizerName} onChange={onChange}
            placeholder="Who is organizing?" required error={errors.organizerName} />

          <FormField label="Jagrata Title" name="jagrataTitle"
            value={data.jagrataTitle} onChange={onChange}
            placeholder="e.g. Shree Shyam Jagrata" required error={errors.jagrataTitle} span />

          <FormField label="Date" name="date"
            type="date" value={data.date} onChange={onChange}
            required error={errors.date} min={today} />

          <FormField label="Start Time" name="startTime"
            type="time" value={data.startTime} onChange={onChange} />

          <FormField label="Venue / Location" name="venue"
            value={data.venue} onChange={onChange}
            placeholder="Where is the Jagrata?" required error={errors.venue} />

          <FormField label="Venue Address" name="venueAddress"
            value={data.venueAddress} onChange={onChange}
            placeholder="Full address (optional)" />

          <FormField label="Purpose / Occasion" name="purpose"
            value={data.purpose} onChange={onChange}
            placeholder="e.g. Baba's grace, family wellbeing…" />

          <FormField label="Prasad Info" name="prasad"
            value={data.prasad} onChange={onChange}
            placeholder="e.g. Panchamrit, Panjiri…" />

          <FormField label="Personal Message / Blessings" name="message"
            value={data.message} onChange={onChange}
            placeholder="Write a blessing message…" rows={3} span />
        </div>

        <div className="form-actions">
          <button className="btn-back-form" onClick={onBack}>← Back</button>
          <button
            className="btn-generate"
            onClick={onGenerate}
            style={{ background: 'linear-gradient(135deg,#f7971e,#ffd200)', color: '#7a3e00', boxShadow: '0 8px 24px rgba(247,151,30,.45)' }}
          >
            🙏 Generate Invitation
          </button>
        </div>
      </div>
    </div>
  );
}
