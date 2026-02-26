import FormField from '../shared/FormField';

const PRESET_PROGRAMS = [
  { name: 'Mehendi', icon: '🌿' },
  { name: 'Haldi', icon: '🟡' },
  { name: 'Sangeet', icon: '🎵' },
  { name: 'Ring Ceremony', icon: '💍' },
  { name: 'Tilak', icon: '🔴' },
  { name: 'Baraat', icon: '🐎' },
  { name: 'Sagai / Engagement', icon: '💞' },
  { name: 'Ladies Sangeet', icon: '💃' },
];

export default function WeddingForm({ data, errors, onChange, onBack, onGenerate, onProgramChange }) {
  const today = new Date().toISOString().split('T')[0];
  const programs = data.customPrograms || [];

  function addProgram(preset) {
    const newProg = { name: preset || '', date: '', time: '', venue: '' };
    onProgramChange([...programs, newProg]);
  }

  function removeProgram(idx) {
    onProgramChange(programs.filter((_, i) => i !== idx));
  }

  function updateProgram(idx, field, value) {
    const updated = programs.map((p, i) => i === idx ? { ...p, [field]: value } : p);
    onProgramChange(updated);
  }

  return (
    <div className="form-screen wedding-form-screen">
      <div className="form-card">
        <div className="form-header">
          <span className="form-header-icon">🪷</span>
          <h2>Wedding Invite Details</h2>
          <p>Fill in the details and we'll create a beautiful wedding invite card!</p>
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

        {/* ═══ CUSTOM PROGRAMS / EVENTS ═══ */}
        <div className="form-stack wed-programs-section">
          <div className="wed-programs-header">
            <label className="form-label">🎊 Additional Programs / Events</label>
            <p className="wed-programs-hint">Add ceremonies like Mehendi, Haldi, Ring Ceremony, etc.</p>
          </div>

          {/* Preset quick-add chips */}
          <div className="wed-preset-chips">
            {PRESET_PROGRAMS.map(p => {
              const alreadyAdded = programs.some(pr => pr.name === p.name);
              return (
                <button key={p.name} type="button"
                  className={`wed-preset-chip ${alreadyAdded ? 'wed-preset-chip--added' : ''}`}
                  onClick={() => !alreadyAdded && addProgram(p.name)}
                  disabled={alreadyAdded}>
                  <span className="wed-chip-icon">{p.icon}</span> {p.name}
                  {alreadyAdded && <span className="wed-chip-check">✓</span>}
                </button>
              );
            })}
          </div>

          {/* Added program entries */}
          {programs.map((prog, idx) => (
            <div key={idx} className="wed-program-entry">
              <div className="wed-program-entry-header">
                <span className="wed-program-num">#{idx + 1}</span>
                <input
                  type="text"
                  className="form-input wed-program-name-input"
                  value={prog.name}
                  onChange={e => updateProgram(idx, 'name', e.target.value)}
                  placeholder="Program name"
                />
                <button type="button" className="wed-program-remove" onClick={() => removeProgram(idx)}
                  title="Remove program">✕</button>
              </div>
              <div className="wed-program-fields">
                <div className="wed-program-field">
                  <label>📅 Date</label>
                  <input type="date" className="form-input" value={prog.date}
                    onChange={e => updateProgram(idx, 'date', e.target.value)} min={today} />
                </div>
                <div className="wed-program-field">
                  <label>🕐 Time</label>
                  <input type="time" className="form-input" value={prog.time}
                    onChange={e => updateProgram(idx, 'time', e.target.value)} />
                </div>
                <div className="wed-program-field wed-program-field--full">
                  <label>📍 Venue</label>
                  <input type="text" className="form-input" value={prog.venue}
                    onChange={e => updateProgram(idx, 'venue', e.target.value)}
                    placeholder="Venue / location" />
                </div>
              </div>
            </div>
          ))}

          {/* Add custom program button */}
          <button type="button" className="wed-add-program-btn" onClick={() => addProgram('')}>
            <span className="wed-add-icon">＋</span> Add Custom Program
          </button>
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
            style={{ background: 'linear-gradient(135deg,#6b1520,#b8860b)', color: '#fff', boxShadow: '0 8px 24px rgba(107,21,32,.4)' }}>
            🪷 Generate Invitation
          </button>
        </div>
      </div>
    </div>
  );
}
