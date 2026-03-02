import FormField from '../shared/FormField';
import AIFillButton from '../shared/AIFillButton';

export default function AnniversaryForm({ data, errors, onChange, onBack, onGenerate, onAIFill, aiGenerating, aiError }) {
  return (
    <div className="form-screen anniversary-form-screen">
      <div className="form-card">
        <div className="form-header">
          <span className="form-header-icon">💍</span>
          <h2>Anniversary Greeting Details</h2>
          <p>Send a beautiful anniversary wish with a personalised card.</p>
        </div>

        <div className="form-grid">
          <FormField label="Partner 1 Name" name="partner1"
            value={data.partner1} onChange={onChange}
            placeholder="First person's name" required error={errors.partner1} />

          <FormField label="Partner 2 Name" name="partner2"
            value={data.partner2} onChange={onChange}
            placeholder="Second person's name" required error={errors.partner2} />

          <FormField label="Years Together" name="years"
            type="number" value={data.years} onChange={onChange}
            placeholder="e.g. 10, 25, 50" min="1" />

          <FormField label="Anniversary Date" name="date"
            type="date" value={data.date} onChange={onChange}
            required error={errors.date} />

          <AIFillButton onClick={onAIFill} generating={aiGenerating} error={aiError} />

          <FormField label="Blessing / Message" name="message"
            value={data.message} onChange={onChange}
            placeholder="May the love you share continue to grow even stronger with each passing year."
            rows={3} span />
        </div>

        {/* — Photo Upload — */}
        <div className="form-stack" style={{ marginBottom: 0 }}>
          <div className="card-photo-upload">
            <label htmlFor="anniv-photo">
              📷 Upload Couple Photo <span className="optional">(optional)</span>
            </label>
            <input type="file" id="anniv-photo" name="photo" accept="image/*" onChange={onChange} />
            {data.photoPreview && (
              <img src={data.photoPreview} alt="Preview" className="card-photo-preview card-photo-preview--heart" />
            )}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-back-form" onClick={onBack}>← Back</button>
          <button
            className="btn-generate"
            onClick={onGenerate}
            style={{ background: 'linear-gradient(135deg,#1a2a5e,#c9a84c)', color: '#fff', boxShadow: '0 8px 24px rgba(201,168,76,.4)' }}
          >
            💖 Generate Card
          </button>
        </div>
      </div>
    </div>
  );
}
