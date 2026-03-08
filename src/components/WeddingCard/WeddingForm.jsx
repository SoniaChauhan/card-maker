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
          <p>Fill in the details and we&apos;ll create a beautiful wedding invite card!</p>
        </div>

        <div className="form-grid">
          {/* Couple */}
          <FormField label="Groom's Name" name="groomName"
            value={data.groomName} onChange={onChange}
            placeholder="Full name of the groom"
            error={errors.groomName} />

          <FormField label="Bride's Name" name="brideName"
            value={data.brideName} onChange={onChange}
            placeholder="Full name of the bride"
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
            error={errors.weddingDate} min={today} />

          <FormField label="Wedding Time" name="weddingTime"
            type="time" value={data.weddingTime} onChange={onChange} />

          <FormField label="Wedding Venue" name="weddingVenue"
            value={data.weddingVenue} onChange={onChange}
            placeholder="e.g. Shri Ram Marriage Garden"
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
            placeholder="Who is being invited? (optional)" />

          <FormField label="Special Message / RSVP Note" name="message"
            value={data.message} onChange={onChange}
            options={[
              { value: "Your presence will add joy to our special day. Kindly RSVP and bless us with your company.", label: "Your presence will add joy to our special day. Kindly RSVP and bless us with your company." },
              { value: "We would be honored to have you celebrate with us. Please confirm your presence at the earliest.", label: "We would be honored to have you celebrate with us. Please confirm your presence at the earliest." },
              { value: "Your blessings mean the world to us. Kindly RSVP to help us prepare warmly for you.", label: "Your blessings mean the world to us. Kindly RSVP to help us prepare warmly for you." },
              { value: "We look forward to celebrating this beautiful moment with you. Please confirm your attendance.", label: "We look forward to celebrating this beautiful moment with you. Please confirm your attendance." },
              { value: "Your presence will make our day complete. Kindly send your RSVP.", label: "Your presence will make our day complete. Kindly send your RSVP." },
              { value: "We request the pleasure of your company. Please RSVP to join us on our special day.", label: "We request the pleasure of your company. Please RSVP to join us on our special day." },
              { value: "Kindly confirm your presence to be part of our wedding celebration.", label: "Kindly confirm your presence to be part of our wedding celebration." },
              { value: "Your love and support matter. Please respond with your RSVP.", label: "Your love and support matter. Please respond with your RSVP." },
              { value: "We'd be grateful to celebrate this day together. Kindly let us know if you can attend.", label: "We'd be grateful to celebrate this day together. Kindly let us know if you can attend." },
              { value: "Please RSVP at your convenience. Your presence will make our wedding memorable.", label: "Please RSVP at your convenience. Your presence will make our wedding memorable." },
              { value: "Join us as we begin a new chapter. Please confirm your presence.", label: "Join us as we begin a new chapter. Please confirm your presence." },
              { value: "A warm celebration awaits you. Kindly RSVP to help us plan better.", label: "A warm celebration awaits you. Kindly RSVP to help us plan better." },
              { value: "We request the honor of your presence. Please RSVP to confirm.", label: "We request the honor of your presence. Please RSVP to confirm." },
              { value: "Your presence will bring happiness and blessings. Kindly reply with your RSVP.", label: "Your presence will bring happiness and blessings. Kindly reply with your RSVP." },
              { value: "Celebrate the joy of our union. Please confirm your attendance.", label: "Celebrate the joy of our union. Please confirm your attendance." },
              { value: "Your presence will add charm to our wedding. Please RSVP soon.", label: "Your presence will add charm to our wedding. Please RSVP soon." },
              { value: "We humbly request your RSVP to help us prepare for your arrival.", label: "We humbly request your RSVP to help us prepare for your arrival." },
              { value: "Your presence is our biggest gift. Kindly confirm your attendance.", label: "Your presence is our biggest gift. Kindly confirm your attendance." },
              { value: "We look forward to sharing our happiness with you. Please RSVP.", label: "We look forward to sharing our happiness with you. Please RSVP." },
              { value: "Your company is treasured. Kindly let us know if you'll be joining us.", label: "Your company is treasured. Kindly let us know if you'll be joining us." },
              { value: "Please RSVP and join us in celebrating love, joy, and togetherness.", label: "Please RSVP and join us in celebrating love, joy, and togetherness." },
              { value: "Help us plan smoothly—kindly confirm your presence.", label: "Help us plan smoothly—kindly confirm your presence." },
              { value: "We are excited to celebrate with you. Please RSVP to attend.", label: "We are excited to celebrate with you. Please RSVP to attend." },
              { value: "Your reply will help us prepare a beautiful celebration. Kindly confirm.", label: "Your reply will help us prepare a beautiful celebration. Kindly confirm." },
              { value: "Your presence will be deeply appreciated. Please RSVP.", label: "Your presence will be deeply appreciated. Please RSVP." },
              { value: "Kindly respond with your availability. We hope to see you there!", label: "Kindly respond with your availability. We hope to see you there!" },
              { value: "Please take a moment to confirm your presence at our wedding.", label: "Please take a moment to confirm your presence at our wedding." },
              { value: "Your blessings and presence are precious to us. Kindly RSVP.", label: "Your blessings and presence are precious to us. Kindly RSVP." },
              { value: "We look forward to hosting you. Please confirm your attendance.", label: "We look forward to hosting you. Please confirm your attendance." },
              { value: "Your presence would bring joy to our hearts. Kindly RSVP.", label: "Your presence would bring joy to our hearts. Kindly RSVP." },
              { value: "Kindly confirm your presence to celebrate this special day with us.", label: "Kindly confirm your presence to celebrate this special day with us." },
              { value: "Please RSVP and join us as we tie the knot.", label: "Please RSVP and join us as we tie the knot." },
              { value: "Your attendance will make our day more meaningful. Kindly confirm.", label: "Your attendance will make our day more meaningful. Kindly confirm." },
              { value: "A heartfelt celebration awaits. Please send your RSVP.", label: "A heartfelt celebration awaits. Please send your RSVP." },
              { value: "We would be delighted to have you. Kindly confirm your presence.", label: "We would be delighted to have you. Kindly confirm your presence." },
              { value: "Please RSVP so we can welcome you with love and warmth.", label: "Please RSVP so we can welcome you with love and warmth." },
              { value: "Your presence is truly valued. Kindly let us know if you can attend.", label: "Your presence is truly valued. Kindly let us know if you can attend." },
              { value: "Your RSVP will help us prepare a beautiful celebration. Please confirm soon.", label: "Your RSVP will help us prepare a beautiful celebration. Please confirm soon." },
              { value: "We hope you can join us as we celebrate our love. Please RSVP.", label: "We hope you can join us as we celebrate our love. Please RSVP." },
              { value: "Your confirmation will help us plan the perfect evening. Kindly respond.", label: "Your confirmation will help us plan the perfect evening. Kindly respond." },
              { value: "Your presence means more than you know. Please confirm your attendance.", label: "Your presence means more than you know. Please confirm your attendance." },
              { value: "Kindly RSVP to be a part of our joyous beginning.", label: "Kindly RSVP to be a part of our joyous beginning." },
              { value: "We look forward to celebrating with you. Please respond with your RSVP.", label: "We look forward to celebrating with you. Please respond with your RSVP." },
              { value: "Your blessings complete our big day. Kindly confirm your presence.", label: "Your blessings complete our big day. Kindly confirm your presence." },
              { value: "Please RSVP and grace us with your warm presence.", label: "Please RSVP and grace us with your warm presence." },
              { value: "Join us for a celebration of love and togetherness. Kindly confirm your attendance.", label: "Join us for a celebration of love and togetherness. Kindly confirm your attendance." },
              { value: "Your reply will help us prepare arrangements with love. Please RSVP.", label: "Your reply will help us prepare arrangements with love. Please RSVP." },
              { value: "We would love to have you with us. Kindly send your RSVP.", label: "We would love to have you with us. Kindly send your RSVP." },
              { value: "Your presence will bring joy to our hearts. Please confirm your attendance.", label: "Your presence will bring joy to our hearts. Please confirm your attendance." },
              { value: "We hope to celebrate this special moment with you. Kindly RSVP at your earliest.", label: "We hope to celebrate this special moment with you. Kindly RSVP at your earliest." },
            ]}
            span />
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
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.photoPreview} alt="Wedding card photo preview - custom wedding invitation" className="card-photo-preview card-photo-preview--circle" loading="lazy" />
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
