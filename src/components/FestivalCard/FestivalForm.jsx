import FormField from '../shared/FormField';

/* ── Preset Holi greeting lines ── */
const HOLI_GREETINGS = [
  'Happy Holi! 🌸',
  'Wishing you a colorful Holi!',
  'Let the colors of Holi brighten your life!',
  'Have a joyful and vibrant Holi!',
  'Spread love and colors this Holi!',
  'Enjoy the festival of colors!',
  'Bright colors, happy hearts — Happy Holi!',
  'Celebrate love, laughter, and colors!',
];

/* ── Preset Holi messages ── */
const HOLI_MESSAGES = [
  'Wishing you a Holi filled with love, laughter, and beautiful memories. Let the colours of joy brighten your day! Happy Holi!',
  'May the vibrant colours of Holi bring happiness, peace, and good health to your life. Have a wonderful celebration!',
  'Let this Holi wash away all negativity and fill your world with the brightest shades of love and positivity.',
  'May every colour you play with today bring a new shade of joy to your life. Happy Holi 2026!',
  'Sending you warm wishes on this Festival of Colours. May your day be as vibrant as the colours you wear!',
  'May this Holi bring new beginnings, fresh opportunities, and beautiful moments into your life.',
  "Let's celebrate the triumph of good over evil and the arrival of spring with full hearts and colourful hands. Happy Holi!",
  'May the colours of Holi fill your home with happiness and your heart with peace. Wishing you a joyful celebration!',
  'On this auspicious occasion, may God bless you with health, wealth, and endless happiness. Happy Holi!',
  'May the spirit of Holi inspire you to forgive, forget, and embrace new beginnings with an open heart.',
  "Let's paint this world with the colours of kindness, love, and togetherness. Happy Holi 2026!",
  'May your life always be as colourful and vibrant as this beautiful festival. Wishing you a very Happy Holi!',
  'As the colours spread across the sky, may joy and prosperity spread across your life. Happy Holi!',
  'Bright colours, water balloons, delicious gujiya, and melodious songs, wishing you a Holi that has it all!',
  'May this Holi end all sorrow and fill your days with the colours of happiness and hope.',
  'On the festival of colours, I wish you the red of love, the green of prosperity, the blue of peace, and the yellow of joy. Happy Holi!',
  'Celebrate this Holi with a heart full of gratitude and hands full of colours. Happy Holi!',
  'Wishing you a safe, healthy, and colourful Holi 2026 filled with unforgettable memories.',
  'May the colours of today last a lifetime in your heart. Happy Holi to you and your family!',
  "Let's splash happiness wherever we go and spread love with every colour we throw. Happy Holi!",
  'May this festival of spring bring freshness, renewal, and pure joy into your life.',
  'Holi is a reminder that life is beautiful and meant to be celebrated in full colour. Wishing you a truly joyful one!',
  'Sending you a rainbow full of Holi wishes, may every colour bring something wonderful your way!',
  'May the divine colours of Holi bring peace to your soul and abundance to your home. Happy Holi!',
  'This Holi, let go of everything that weighs you down and dance in the colours of freedom and happiness.',
  'May your celebrations be grand, your sweets be sweet, and your memories be golden. Happy Holi 2026!',
  'Life is a canvas, may this Holi inspire you to paint it with the most beautiful colours!',
  'Wishing you a Holi full of laughter, love, and the company of your favourite people.',
  'May the colours of Holi bring you closer to your loved ones and farther from your worries.',
  "Here's wishing you a Holi as magical, warm, and bright as you are. Happy Holi!",
];

export default function FestivalForm({ data, errors, onChange, onBack, onGenerate, festivals }) {
  const isHoli = data.festival === 'holi';
  const isHoliOnly = festivals.length === 1 && festivals[0].id === 'holi';

  return (
    <div className="form-screen festival-form-screen">
      <div className="form-card">
        <div className="form-header">
          <span className="form-header-icon">{isHoliOnly ? '🌈' : '🎆'}</span>
          <h2>{isHoliOnly ? 'Holi Celebration Card' : 'Festival Greeting Card'}</h2>
          <p>{isHoliOnly 
            ? 'Create a vibrant, colorful Holi greeting card with playful splashes, gulaal effects, and festive typography.'
            : 'Beautiful customizable cards for all Indian festivals — Holi, Diwali, Lohri, Navratri, Eid, Christmas, and more.'}
          </p>
        </div>

        {/* ── Festival selector (hidden when only one festival) ── */}
        {festivals.length > 1 && (
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
        )}

        <div className="form-grid">
          <FormField label="Your Name" name="senderName"
            value={data.senderName} onChange={onChange}
            placeholder="e.g. Rahul Sharma" required
            error={errors.senderName} />

          <FormField label="Recipient Name" name="recipientName"
            value={data.recipientName} onChange={onChange}
            placeholder="Who are you sending this to? (optional)" />

          {!isHoli && (
            <FormField label="Custom Greeting Line" name="customGreeting"
              value={data.customGreeting} onChange={onChange}
              placeholder="e.g. Wishing you joy & happiness!" />
          )}

          {/* Holi preset greeting dropdown — replaces the text input when Holi */}
          {isHoli && (
            <div className="form-group fest-preset-pick">
              <label>🌈 Pick or Type Greeting <span className="optional">(optional)</span></label>
              <select
                value=""
                onChange={e => { if (e.target.value) onChange({ target: { name: 'customGreeting', value: e.target.value } }); }}
                className="fest-preset-select"
              >
                <option value="">— Choose a preset greeting —</option>
                {HOLI_GREETINGS.map((g, i) => (
                  <option key={i} value={g}>{g}</option>
                ))}
              </select>
              <input
                type="text"
                name="customGreeting"
                value={data.customGreeting}
                onChange={onChange}
                placeholder="Or type your own greeting…"
                className="fest-preset-input"
                autoComplete="off"
              />
            </div>
          )}

          {!isHoli && (
            <FormField label="Personal Message" name="message"
              value={data.message} onChange={onChange}
              placeholder="Write a heartfelt message…" rows={3} span />
          )}

          {/* Holi preset message dropdown — replaces the textarea when Holi */}
          {isHoli && (
            <div className="form-group span-2 fest-preset-pick">
              <label>💌 Pick or Type Message <span className="optional">(optional)</span></label>
              <select
                value=""
                onChange={e => { if (e.target.value) onChange({ target: { name: 'message', value: e.target.value } }); }}
                className="fest-preset-select"
              >
                <option value="">— Choose a preset message —</option>
                {HOLI_MESSAGES.map((m, i) => (
                  <option key={i} value={m}>{m.length > 80 ? m.slice(0, 80) + '…' : m}</option>
                ))}
              </select>
              <textarea
                name="message"
                value={data.message}
                onChange={onChange}
                placeholder="Or type your own message…"
                className="fest-preset-textarea"
                rows={3}
                autoComplete="off"
              />
            </div>
          )}
        </div>

        {/* — Photo Upload — */}
        <div className="form-stack" style={{ marginBottom: 0 }}>
          <div className="card-photo-upload">
            <label htmlFor="fest-photo">
              📷 Upload Photo <span className="optional">(optional)</span>
            </label>
            <input type="file" id="fest-photo" name="photo" accept="image/*" onChange={onChange} />
            {data.photoPreview && (
              <img src={data.photoPreview} alt="Festival greeting card photo preview - online festival card maker" className="card-photo-preview card-photo-preview--circle" loading="lazy" />
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
