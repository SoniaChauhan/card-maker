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
            placeholder="Who is being invited? (optional)" />

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
            options={[
              { value: "Your presence will make the celebration brighter. Kindly RSVP to confirm.", label: "Your presence will make the celebration brighter. Kindly RSVP to confirm." },
              { value: "We would be delighted to have you with us. Please RSVP at your earliest convenience.", label: "We would be delighted to have you with us. Please RSVP at your earliest convenience." },
              { value: "Join us for a memorable birthday evening! Kindly confirm your presence.", label: "Join us for a memorable birthday evening! Kindly confirm your presence." },
              { value: "Your blessings and presence mean a lot. Please RSVP to let us know.", label: "Your blessings and presence mean a lot. Please RSVP to let us know." },
              { value: "We hope to celebrate this special day together. Kindly let us know if you can join.", label: "We hope to celebrate this special day together. Kindly let us know if you can join." },
              { value: "Please confirm your attendance so we can prepare a warm welcome for you!", label: "Please confirm your attendance so we can prepare a warm welcome for you!" },
              { value: "Looking forward to celebrating with you. Kindly send your RSVP.", label: "Looking forward to celebrating with you. Kindly send your RSVP." },
              { value: "Your presence will make our joy complete. Please RSVP.", label: "Your presence will make our joy complete. Please RSVP." },
              { value: "Please take a moment to confirm your presence. We'd love to have you!", label: "Please take a moment to confirm your presence. We'd love to have you!" },
              { value: "We can't wait to celebrate! Kindly RSVP to help us plan better.", label: "We can't wait to celebrate! Kindly RSVP to help us plan better." },
              { value: "Your presence adds happiness. Please confirm your attendance.", label: "Your presence adds happiness. Please confirm your attendance." },
              { value: "To make the celebration special, your presence is requested. Kindly RSVP.", label: "To make the celebration special, your presence is requested. Kindly RSVP." },
              { value: "We'd be honored to celebrate together. Please RSVP soon.", label: "We'd be honored to celebrate together. Please RSVP soon." },
              { value: "Excited to celebrate with you! Kindly confirm your presence.", label: "Excited to celebrate with you! Kindly confirm your presence." },
              { value: "Please let us know if you'll be joining—your company means a lot.", label: "Please let us know if you'll be joining—your company means a lot." },
              { value: "A warm celebration awaits. Kindly RSVP.", label: "A warm celebration awaits. Kindly RSVP." },
              { value: "Your presence will make the birthday extra special. Please confirm.", label: "Your presence will make the birthday extra special. Please confirm." },
              { value: "Help us plan the day better—kindly send your RSVP.", label: "Help us plan the day better—kindly send your RSVP." },
              { value: "We look forward to celebrating with you. Please RSVP at your convenience.", label: "We look forward to celebrating with you. Please RSVP at your convenience." },
              { value: "Please let us know if you can join our celebration.", label: "Please let us know if you can join our celebration." },
              { value: "Kindly confirm your presence to join the festivities.", label: "Kindly confirm your presence to join the festivities." },
              { value: "Your presence is highly appreciated—please RSVP.", label: "Your presence is highly appreciated—please RSVP." },
              { value: "We'd love to host you. Kindly confirm your attendance.", label: "We'd love to host you. Kindly confirm your attendance." },
              { value: "Please RSVP so we can prepare a warm and joyful celebration.", label: "Please RSVP so we can prepare a warm and joyful celebration." },
              { value: "Your confirmation will help us plan smoothly. Kindly RSVP.", label: "Your confirmation will help us plan smoothly. Kindly RSVP." },
              { value: "Please take a moment to send your RSVP. We are excited to host you!", label: "Please take a moment to send your RSVP. We are excited to host you!" },
              { value: "Your blessings and presence matter. Kindly let us know if you can join.", label: "Your blessings and presence matter. Kindly let us know if you can join." },
              { value: "Join us for a fun-filled birthday celebration! Please RSVP.", label: "Join us for a fun-filled birthday celebration! Please RSVP." },
              { value: "Looking forward to your presence—kindly confirm your attendance.", label: "Looking forward to your presence—kindly confirm your attendance." },
              { value: "Your presence will add happiness to the celebration. Please RSVP.", label: "Your presence will add happiness to the celebration. Please RSVP." },
              { value: "We would truly appreciate your RSVP. Hope to see you there!", label: "We would truly appreciate your RSVP. Hope to see you there!" },
              { value: "Kindly let us know if you'll be able to join our special day.", label: "Kindly let us know if you'll be able to join our special day." },
              { value: "Your company makes celebrations brighter. Please confirm your presence.", label: "Your company makes celebrations brighter. Please confirm your presence." },
              { value: "RSVP requested to help us prepare the best celebration.", label: "RSVP requested to help us prepare the best celebration." },
              { value: "Please respond with your availability—we would love to have you!", label: "Please respond with your availability—we would love to have you!" },
              { value: "A joyful celebration awaits. Kindly confirm your presence.", label: "A joyful celebration awaits. Kindly confirm your presence." },
              { value: "Your attendance will make our day extra special. Please RSVP.", label: "Your attendance will make our day extra special. Please RSVP." },
              { value: "Please help us plan better by sending your RSVP soon.", label: "Please help us plan better by sending your RSVP soon." },
              { value: "We look forward to welcoming you—kindly confirm your participation.", label: "We look forward to welcoming you—kindly confirm your participation." },
              { value: "Your presence is the best gift. Please RSVP to join the celebration.", label: "Your presence is the best gift. Please RSVP to join the celebration." },
              { value: "Please take a moment to confirm your attendance. We'd be delighted to celebrate with you.", label: "Please take a moment to confirm your attendance. We'd be delighted to celebrate with you." },
              { value: "Your presence completes the celebration—kindly RSVP.", label: "Your presence completes the celebration—kindly RSVP." },
              { value: "A special day deserves special guests. Please confirm your presence.", label: "A special day deserves special guests. Please confirm your presence." },
              { value: "Hope to see you on the big day! Kindly send your RSVP.", label: "Hope to see you on the big day! Kindly send your RSVP." },
              { value: "Your presence will make the moment memorable. Please confirm your attendance.", label: "Your presence will make the moment memorable. Please confirm your attendance." },
              { value: "Please let us know if you will be joining—it helps us prepare warmly.", label: "Please let us know if you will be joining—it helps us prepare warmly." },
              { value: "We value your presence. Kindly RSVP at your earliest.", label: "We value your presence. Kindly RSVP at your earliest." },
              { value: "Join us for joy, laughter, and celebration. Please confirm your presence.", label: "Join us for joy, laughter, and celebration. Please confirm your presence." },
              { value: "Your reply will help us plan a wonderful celebration. Kindly RSVP.", label: "Your reply will help us plan a wonderful celebration. Kindly RSVP." },
              { value: "Please respond to let us know if you can join us. We hope to celebrate together!", label: "Please respond to let us know if you can join us. We hope to celebrate together!" },
            ]}
            span />
        </div>

        {/* — Photo Upload — */}
        <div className="form-stack" style={{ marginBottom: 0 }}>
          <div className="card-photo-upload">
            <label htmlFor="bday-photo">
              📷 Upload Photo <span className="optional">(optional)</span>
            </label>
            <input type="file" id="bday-photo" name="photo" accept="image/*" onChange={onChange} />
            {data.photoPreview && (
              <img src={data.photoPreview} alt="Birthday card photo preview - personalised birthday invitation" className="card-photo-preview card-photo-preview--circle" loading="lazy" />
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
