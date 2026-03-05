import { useState } from 'react';
import FormField from '../shared/FormField';

const THEME_OPTIONS = [
  { value: 'dark-gold',  label: '🌑 Dark & Gold (Luxury)' },
  { value: 'dark-rose',  label: '🌹 Dark & Rose' },
  { value: 'blush-pink', label: '🌸 Blush Pink' },
  { value: 'white-gold', label: '✨ White & Gold' },
  { value: 'teal-cream', label: '🍃 Teal & Cream' },
];

const DEFAULT_SERVICES = [
  { name: 'Hair Spa', details: 'Threading, Upperlips, Forehead', price: '899', section: 'ladies' },
  { name: 'Rica Hand and Underarms Wax', details: '', price: '449', section: 'ladies' },
  { name: 'Cleanup', details: 'Threading, Upperlips, Forehead', price: '399', section: 'ladies' },
];

/* ══════════════════════════════════════════════════
   Preset service catalogue — Ladies / Men / Kids
   ══════════════════════════════════════════════════ */
const SERVICE_PRESETS = {
  ladies: {
    label: '👩 Ladies',
    categories: [
      {
        category: '💇‍♀️ Hair — Styling',
        items: ['Shampoo & Condition', 'Blow Dry', 'Straightening', 'Curling', 'Updos', 'Hair Extensions'],
      },
      {
        category: '✂️ Hair — Cutting',
        items: ['Haircut (Layers)', 'Haircut (Pixie)', 'Haircut (Bob)', 'Haircut (Blunt)', 'Trimming', 'Bangs / Fringe'],
      },
      {
        category: '🎨 Hair — Coloring',
        items: ['Highlights', 'Lowlights', 'Root Touch-up', 'Global Hair Color', 'Balayage', 'Ombre'],
      },
      {
        category: '💆‍♀️ Hair — Treatments',
        items: ['Keratin Treatment', 'Hair Spa', 'Deep Conditioning', 'Dandruff Treatment', 'Hair Smoothing', 'Rebonding'],
      },
      {
        category: '🧖‍♀️ Facials & Cleanups',
        items: ['Anti-Aging Facial', 'Acne Treatment Facial', 'Brightening Facial', 'Hydrating Facial', 'Medifacial', 'Aromatherapy Facial', 'Fruit Cleanup', 'Gold Facial', 'Diamond Facial', 'Pearl Facial', 'De-Tan Facial', 'Herbal Facial', 'Oxygen Facial', 'Bleach (Face)', 'Bleach (Body)'],
      },
      {
        category: '🧵 Hair Removal',
        items: ['Eyebrow Threading', 'Upper Lip Threading', 'Full Face Threading', 'Forehead Threading', 'Chin Threading', 'Full Arm Wax', 'Half Arm Wax', 'Full Leg Wax', 'Half Leg Wax', 'Underarm Wax', 'Full Body Wax', 'Bikini Wax', 'Rica Wax (Full Body)', 'Rica Hand & Underarms Wax', 'Shaving'],
      },
      {
        category: '💆 Body Treatments',
        items: ['Body Scrub', 'Body Polishing', 'Body Wrap', 'Swedish Massage', 'Deep Tissue Massage', 'Aroma Therapy', 'Steam & Sauna'],
      },
      {
        category: '💅 Nail Services',
        items: ['Classic Manicure', 'Spa Manicure', 'French Manicure', 'Gel Polish Manicure', 'Paraffin Wax (Hands)', 'Classic Pedicure', 'Spa Pedicure', 'French Pedicure', 'Gel Polish Pedicure', 'Paraffin Wax (Feet)'],
      },
      {
        category: '💎 Nail Art & Extensions',
        items: ['Acrylic Nails', 'Gel Extensions', 'Nail Art Design', 'Nail Repair'],
      },
      {
        category: '💄 Makeup',
        items: ['Bridal Makeup', 'Party Makeup', 'Engagement Makeup', 'Airbrush Makeup', 'Editorial Makeup', 'HD Makeup', 'Mehendi'],
      },
      {
        category: '👁️ Eye & Brow',
        items: ['Eyebrow Tinting', 'Lash Lifting', 'Eyelash Extensions', 'Eye Makeup'],
      },
      {
        category: '✨ Skin Treatments',
        items: ['Detan Treatment', 'Skin Polishing', 'Chemical Peel', 'Microdermabrasion'],
      },
      {
        category: '👰 Bridal Packages',
        items: ['Pre-Bridal Package', 'Wedding Day Makeup Package', 'Bridal Hair & Makeup Combo'],
      },
      {
        category: '📦 Combo Packages',
        items: ['Cleanup + Wax + Eyebrows + Upper Lips', 'Diamond Facial + Bleach + Wax + Underarm + Eyebrows', 'Fruit Cleanup + Threading', 'Hair Spa + Threading + Upperlips + Forehead'],
      },
    ],
  },

  men: {
    label: '👨 Men',
    categories: [
      {
        category: '💇‍♂️ Haircut & Styling',
        items: ['Standard Haircut', 'Precision Cut', 'Beard Trimming', 'Beard Styling / Shaping', 'Classic Shave', 'Royal Shave'],
      },
      {
        category: '🎨 Hair Color & Treatments',
        items: ['Hair Coloring (Global)', 'Gray Coverage Color', 'Hair Spa', 'Hair Smoothening', 'Keratin Treatment', 'Hair Detox'],
      },
      {
        category: '🧖‍♂️ Facials & Skin',
        items: ['Basic Facial', 'Gold Facial', 'Diamond Facial', 'Charcoal Facial', 'Anti-Aging Facial', 'Quick Cleanup', 'Exfoliating Treatment', 'Detanning Treatment', 'Facial Bleach', 'Neck Bleach'],
      },
      {
        category: '💆‍♂️ Massage',
        items: ['Head Massage', 'Neck & Shoulder Massage', 'Face Massage', 'Full Body Massage'],
      },
      {
        category: '🤚 Hand & Foot Care',
        items: ['Classic Manicure', 'Spa Manicure', 'Deluxe Manicure', 'Classic Pedicure', 'Spa Pedicure', 'Deluxe Pedicure', 'Foot Reflexology'],
      },
      {
        category: '✨ Specialized',
        items: ['Skin Peel Treatment', 'Groom Makeup (Wedding)', 'Hair Spa / Detox', 'Body Polishing'],
      },
    ],
  },

  kids: {
    label: '👧 Kids',
    categories: [
      {
        category: '✂️ Hair Services',
        items: ['First Haircut (with Certificate)', 'Kids Haircut (Boy)', 'Kids Haircut (Girl)', 'Hair Styling & Detangling', 'Braiding & Themed Hairstyles', 'Glitter Hair Spray / Hair Art', 'Hair Wash & Conditioning'],
      },
      {
        category: '💅 Beauty & Spa',
        items: ['Mini Manicure', 'Mini Pedicure', 'Nail Art for Kids', 'Gentle Facial (Pre-teens)', 'Temporary Tattoos', 'Light Party Makeup'],
      },
      {
        category: '🎁 Pampering Packages',
        items: ['Birthday Party Package', 'Mommy & Me Package', 'Daddy & Me Package', 'Back-to-School Haircut Package'],
      },
    ],
  },
};

export { DEFAULT_SERVICES, THEME_OPTIONS };

const TAB_KEYS = Object.keys(SERVICE_PRESETS);          // ['ladies', 'men', 'kids']

export default function SalonForm({ data, errors, onChange, onBack, onGenerate, onServiceChange }) {
  const services = data.services || [];
  const [activeTab, setActiveTab] = useState('ladies');  // current gender tab

  function addServiceFromPreset(name) {
    onServiceChange([...services, { name, details: '', price: '', section: activeTab }]);
  }
  function addCustomService() {
    onServiceChange([...services, { name: '', details: '', price: '', section: 'general' }]);
  }
  function removeService(idx) { onServiceChange(services.filter((_, i) => i !== idx)); }
  function updateService(idx, field, val) {
    onServiceChange(services.map((s, i) => i === idx ? { ...s, [field]: val } : s));
  }

  function loadDefaults() {
    onServiceChange([...DEFAULT_SERVICES]);
  }

  /* Check if a preset is already added */
  function isAdded(name) {
    return services.some(s => s.name === name);
  }

  const currentPreset = SERVICE_PRESETS[activeTab];       // { label, categories }

  return (
    <div className="form-screen salon-form-screen">
      <div className="form-card">
        <div className="form-header">
          <span className="form-header-icon">💇</span>
          <h2>Salon / Parlour Card Details</h2>
          <p>Fill in your salon details and we&apos;ll create an elegant service card!</p>
        </div>

        <div className="form-grid">
          <FormField label="Business / Salon Name" name="businessName"
            value={data.businessName} onChange={onChange}
            placeholder="Enter your salon or parlour name"
            error={errors.businessName} span />

          <FormField label="Tagline / Heading" name="tagline"
            value={data.tagline} onChange={onChange}
            placeholder="e.g. Special Packages, Festival Offer" />

          <FormField label="Card Theme" name="theme"
            value={data.theme} onChange={onChange}
            options={THEME_OPTIONS} />

          <FormField label="Contact Person" name="contactName"
            value={data.contactName} onChange={onChange}
            placeholder="Your name" />

          <FormField label="Contact Phone" name="contactPhone"
            value={data.contactPhone} onChange={onChange}
            placeholder="Your phone number" type="tel"
            error={errors.contactPhone} />

          <FormField label="Address" name="address"
            value={data.address} onChange={onChange}
            placeholder="Your shop / salon address" />
        </div>

        {/* ── Quick Add from Presets ── */}
        <div className="salon-section-block">
          <h3 className="salon-section-label">💅 Quick Add Services</h3>
          <p className="salon-section-hint">Choose a category tab, then tap any service to add it to your card.</p>

          {/* ── Gender Tabs ── */}
          <div className="salon-tab-bar">
            {TAB_KEYS.map(key => (
              <button
                key={key}
                type="button"
                className={`salon-tab-btn${activeTab === key ? ' active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                {SERVICE_PRESETS[key].label}
              </button>
            ))}
          </div>

          {/* ── Category dropdowns for the active tab ── */}
          <div className="salon-preset-list">
            {currentPreset.categories.map(cat => (
              <details key={cat.category} className="salon-preset-group">
                <summary className="salon-preset-cat">{cat.category}</summary>
                <div className="salon-preset-items">
                  {cat.items.map(item => (
                    <button
                      key={item}
                      type="button"
                      className={`salon-preset-btn${isAdded(item) ? ' added' : ''}`}
                      onClick={() => !isAdded(item) && addServiceFromPreset(item)}
                      disabled={isAdded(item)}
                    >
                      {isAdded(item) ? '✓ ' : '+ '}{item}
                    </button>
                  ))}
                </div>
              </details>
            ))}
          </div>
          <div className="salon-preset-actions">
            <button type="button" className="salon-custom-btn" onClick={addCustomService}>✏️ Add Custom Service</button>
            {services.length === 0 && (
              <button type="button" className="salon-custom-btn salon-sample-btn" onClick={loadDefaults}>📋 Load Sample</button>
            )}
          </div>
        </div>

        {/* ── Added Services — edit name, details, price ── */}
        {services.length > 0 && (
          <div className="salon-section-block">
            <h3 className="salon-section-label">📝 Your Services ({services.length})</h3>
            {services.map((s, i) => (
              <div key={i} className="salon-service-edit-row">
                <div className="salon-edit-fields">
                  <div className="salon-edit-name-row">
                    <input
                      className="salon-edit-input salon-edit-name"
                      type="text"
                      placeholder="Service name"
                      value={s.name}
                      onChange={e => updateService(i, 'name', e.target.value)}
                    />
                    {s.section && s.section !== 'general' && (
                      <span className={`salon-section-badge salon-badge-${s.section}`}>
                        {s.section === 'ladies' ? '👩' : s.section === 'men' ? '👨' : '👧'} {s.section}
                      </span>
                    )}
                  </div>
                  <input
                    className="salon-edit-input salon-edit-details"
                    type="text"
                    placeholder="Details (optional, e.g. Threading, Upperlips)"
                    value={s.details}
                    onChange={e => updateService(i, 'details', e.target.value)}
                  />
                </div>
                <div className="salon-edit-price-row">
                  <span className="salon-rupee-label">₹</span>
                  <input
                    className="salon-edit-input salon-edit-price"
                    type="number"
                    placeholder="Price"
                    value={s.price}
                    onChange={e => updateService(i, 'price', e.target.value)}
                  />
                  <button type="button" className="salon-remove-btn" onClick={() => removeService(i)}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Logo Upload ── */}
        <div className="salon-section-block">
          <h3 className="salon-section-label">🖼️ Logo (optional)</h3>
          <input type="file" name="logo" accept="image/*" onChange={onChange} />
        </div>

        {/* ── Actions ── */}
        <div className="form-actions">
          <button className="btn-back-form" onClick={onBack}>← Back</button>
          <button className="btn-generate" onClick={onGenerate}
            style={{ background: 'linear-gradient(135deg, #d4af37, #b8860b)', color: '#fff', boxShadow: '0 8px 24px rgba(212,175,55,.4)' }}>
            🎨 Generate Card
          </button>
        </div>
      </div>
    </div>
  );
}
