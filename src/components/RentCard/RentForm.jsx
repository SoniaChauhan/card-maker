import { useState, useRef } from 'react';
import FormField from '../shared/FormField';
import { RENT_TEMPLATES, PROPERTY_TYPES, PROPERTY_TYPE_CONFIG, DEFAULT_FEATURES, DEFAULT_AMENITIES } from './rentConstants';
import RentCardPreview from './RentCardPreview';

/* ══════════════════════════════════════════════════
   Preset catalogues — Room Features & Amenities
   ══════════════════════════════════════════════════ */
const FEATURE_PRESETS = [
  {
    category: '🛏️ Bedroom & Sleeping',
    items: [
      'Single Bed', 'Double Bed', 'Bunk Bed', '2–3 Beds in Each Room',
      'Mattress & Pillow Provided', 'Bedsheet & Blanket Provided',
      'Wardrobe / Almirah', 'Personal Locker', 'Mirror',
      'Study Table & Chair', 'Bookshelf',
    ],
  },
  {
    category: '🚿 Bathroom & Washroom',
    items: [
      'Attached / Private Washroom', 'Separate Washroom for Every Room',
      'Common Washroom', 'Western Toilet', 'Indian Toilet',
      'Hot Water (24×7)', 'Geyser / Water Heater', 'Shower',
      'Water Softener (Soft Water – Hair Friendly)',
    ],
  },
  {
    category: '🍳 Kitchen & Dining',
    items: [
      'Small Kitchen in Every Room', 'Common / Shared Kitchen',
      'Modular Kitchen', 'Gas Stove', 'Induction Cooktop',
      'Refrigerator', 'Microwave', 'Water Purifier (RO)',
      'Dining Table', 'Utensils Provided',
    ],
  },
  {
    category: '📐 Room & Space',
    items: [
      'Fully Furnished Room', 'Semi-Furnished Room', 'Spacious Room',
      'Balcony', 'Window with Ventilation', 'Tiled Flooring',
      'Painted Walls', 'Curtains Provided', 'Extra Storage Space',
    ],
  },
  {
    category: '❄️ Cooling & Electrical',
    items: [
      'Air Conditioner (AC)', 'Cooler', 'Ceiling Fan', 'Exhaust Fan',
      'Power Backup / Inverter', 'Separate Electric Meter',
      'LED Lights', 'Charging Points in Every Room',
    ],
  },
  {
    category: '🧹 Cleaning & Maintenance',
    items: [
      'Daily Room Cleaning', 'Weekly Deep Cleaning', 'Pest Control',
      'Dustbin in Every Room', 'Common Area Cleaning',
      'Bathroom Cleaning Daily',
    ],
  },
  {
    category: '👔 Laundry & Washing',
    items: [
      'Washing Machine (Common)', 'Washing Machine (In-Room)',
      'Iron & Ironing Board', 'Clothesline / Drying Area',
      'Laundry Service Available',
    ],
  },
  {
    category: '🔐 Safety & Rules',
    items: [
      'Separate Entry', 'No Owner Restriction', 'Couples Allowed',
      'Visitors Allowed', 'No Curfew / 24×7 Entry',
      'Biometric / Digital Lock', 'CCTV Surveillance',
      'Fire Extinguisher', 'Smoke Detector',
    ],
  },
];

const AMENITY_PRESETS = [
  {
    category: '📶 Internet & Entertainment',
    items: [
      { icon: '📶', text: 'High-Speed WiFi' },
      { icon: '📺', text: 'TV / Smart TV' },
      { icon: '🔊', text: 'DTH / Cable Connection' },
      { icon: '🎮', text: 'Gaming Zone / Common Room' },
    ],
  },
  {
    category: '💧 Water & Drinking',
    items: [
      { icon: '💧', text: 'RO Drinking Water' },
      { icon: '🚰', text: '24×7 Water Supply' },
      { icon: '🚿', text: 'Water Softener (Soft Water – Hair Friendly)' },
      { icon: '♨️', text: 'Hot Water Supply' },
    ],
  },
  {
    category: '🔒 Security',
    items: [
      { icon: '📹', text: 'CCTV / Security Cameras' },
      { icon: '👮', text: 'Security Guard (24×7)' },
      { icon: '🔐', text: 'Biometric / Smart Lock Entry' },
      { icon: '🚪', text: 'Gated Entry with Intercom' },
      { icon: '🧯', text: 'Fire Safety Equipment' },
    ],
  },
  {
    category: '🍱 Food & Kitchen',
    items: [
      { icon: '🍱', text: 'Tiffin Service (On Demand)' },
      { icon: '🍳', text: 'Mess / Common Dining' },
      { icon: '☕', text: 'Tea / Coffee Machine' },
      { icon: '🧊', text: 'Refrigerator (Shared)' },
      { icon: '🫖', text: 'Microwave (Shared)' },
      { icon: '🥛', text: 'Milk & Bread Delivery' },
    ],
  },
  {
    category: '🧹 Housekeeping',
    items: [
      { icon: '🧹', text: 'Daily Housekeeping' },
      { icon: '🧺', text: 'Laundry Service' },
      { icon: '👕', text: 'Iron / Ironing Board' },
      { icon: '🧼', text: 'Weekly Deep Cleaning' },
    ],
  },
  {
    category: '🏋️ Fitness & Recreation',
    items: [
      { icon: '🏋️', text: 'Gym / Fitness Room' },
      { icon: '🧘', text: 'Yoga / Meditation Area' },
      { icon: '🏸', text: 'Sports Area (Badminton, TT)' },
      { icon: '🏊', text: 'Swimming Pool' },
      { icon: '🌿', text: 'Garden / Terrace Access' },
    ],
  },
  {
    category: '🚗 Parking & Transport',
    items: [
      { icon: '🚗', text: 'Car Parking' },
      { icon: '🏍️', text: 'Bike / Two-Wheeler Parking' },
      { icon: '🚲', text: 'Bicycle Stand' },
      { icon: '🚌', text: 'Near Bus Stop / Metro' },
      { icon: '🛺', text: 'Auto / Cab Stand Nearby' },
    ],
  },
  {
    category: '⚡ Power & Utilities',
    items: [
      { icon: '⚡', text: 'Power Backup / Inverter' },
      { icon: '🔋', text: 'Generator Backup' },
      { icon: '💡', text: 'Electricity Included in Rent' },
      { icon: '🔌', text: 'Separate Electric Meter' },
    ],
  },
  {
    category: '🏥 Nearby Facilities',
    items: [
      { icon: '🏥', text: 'Hospital / Clinic Nearby' },
      { icon: '🏪', text: 'Market / Shopping Nearby' },
      { icon: '🏫', text: 'School / College Nearby' },
      { icon: '🏦', text: 'Bank / ATM Nearby' },
      { icon: '🕌', text: 'Temple / Mosque / Church Nearby' },
      { icon: '🍕', text: 'Restaurants / Cafes Nearby' },
    ],
  },
  {
    category: '📦 Other Perks',
    items: [
      { icon: '📦', text: 'Courier / Parcel Collection' },
      { icon: '🧑‍💼', text: 'Dedicated Caretaker' },
      { icon: '🛒', text: 'Grocery Delivery Tie-up' },
      { icon: '🩺', text: 'First Aid Kit' },
      { icon: '♿', text: 'Wheelchair Accessible' },
      { icon: '🐾', text: 'Pet Friendly' },
    ],
  },
];

export default function RentForm({
  data, errors, onChange, onBack, onGenerate,
  onFeatureChange, onAmenityChange,
  onPropertyTypeChange, onTemplateChange,
  addPropertyImages, removePropertyImage, updatePropertyImageLabel,
}) {
  const features  = data.features  || [];
  const amenities = data.amenities || [];
  const imgInputRef = useRef(null);
  const cfg = PROPERTY_TYPE_CONFIG[data.propertyType] || PROPERTY_TYPE_CONFIG.pg;

  /* ── Feature helpers ── */
  function addFeature()        { onFeatureChange([...features, '']); }
  function removeFeature(idx)  { onFeatureChange(features.filter((_, i) => i !== idx)); }
  function updateFeature(idx, val) { onFeatureChange(features.map((f, i) => i === idx ? val : f)); }
  function addFeaturePreset(text) { onFeatureChange([...features, text]); }
  function isFeatureAdded(text) { return features.includes(text); }

  /* ── Amenity helpers ── */
  function addAmenity()        { onAmenityChange([...amenities, { icon: '✔️', text: '' }]); }
  function removeAmenity(idx)  { onAmenityChange(amenities.filter((_, i) => i !== idx)); }
  function updateAmenity(idx, field, val) {
    onAmenityChange(amenities.map((a, i) => i === idx ? { ...a, [field]: val } : a));
  }
  function addAmenityPreset(item) { onAmenityChange([...amenities, { ...item }]); }
  function isAmenityAdded(text) { return amenities.some(a => a.text === text); }

  function loadDefaults() {
    onFeatureChange([...cfg.defaultFeatures]);
    onAmenityChange(cfg.defaultAmenities.map(a => ({ ...a })));
  }

  return (
    <div className="form-screen rent-form-screen">
      <div className="form-card">
        <div className="form-header">
          <span className="form-header-icon">🏠</span>
          <h2>PG / Rent Card Details</h2>
          <p>Fill in property details and we&apos;ll generate a professional rent advertisement card!</p>
        </div>

        {/* ══ Property Type Tabs ══ */}
        <div className="rent-section-block">
          <h3 className="rent-section-label">🏷️ Property Type</h3>
          <p className="rent-section-hint">Select what type of property you&apos;re listing.</p>
          <div className="rent-type-tabs">
            {PROPERTY_TYPES.map(pt => (
              <button
                key={pt.id}
                type="button"
                className={`rent-type-tab${data.propertyType === pt.id ? ' active' : ''}`}
                onClick={() => onPropertyTypeChange(pt.id)}
              >
                {pt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ══ Template / Color Theme Picker ══ */}
        <div className="rent-section-block">
          <h3 className="rent-section-label">🎨 Card Design &amp; Color Theme</h3>
          <p className="rent-section-hint">Choose a color theme for your card. Tap to preview.</p>
          <div className="rent-tpl-grid">
            {RENT_TEMPLATES.map(tpl => (
              <button
                key={tpl.id}
                type="button"
                className={`rent-tpl-card${data.selectedTemplate === tpl.id ? ' active' : ''}`}
                onClick={() => onTemplateChange(tpl.id)}
              >
                <div className="rent-tpl-preview-mini">
                  <div className="rent-tpl-swatch" style={{ background: tpl.headerBg }} />
                  <div className="rent-tpl-swatch rent-tpl-swatch--heading" style={{ background: tpl.headingBg }} />
                  <div className="rent-tpl-swatch" style={{ background: tpl.footerBg }} />
                </div>
                <span className="rent-tpl-name">{tpl.name}</span>
                {data.selectedTemplate === tpl.id && <span className="rent-tpl-check">✓</span>}
              </button>
            ))}
          </div>

          {/* Live mini-preview */}
          <div className="rent-tpl-live-preview">
            <p className="rent-section-hint" style={{ marginBottom: 8 }}>📋 Live Preview</p>
            <div className="rent-tpl-live-wrap">
              <RentCardPreview data={data} />
            </div>
          </div>
        </div>

        <div className="form-grid">
          <FormField label="Card Title" name="title"
            value={data.title} onChange={onChange}
            placeholder={cfg.titlePlaceholder}
            error={errors.title} span />

          <FormField label="Location / Address" name="location"
            value={data.location} onChange={onChange}
            placeholder={cfg.locationPlaceholder}
            error={errors.location} span />

          <FormField label={cfg.rentLabel1} name="rentWithoutAC"
            value={data.rentWithoutAC} onChange={onChange}
            placeholder={cfg.rentPlaceholder1} type="number" />

          <FormField label={cfg.rentLabel2} name="rentWithAC"
            value={data.rentWithAC} onChange={onChange}
            placeholder={cfg.rentPlaceholder2} type="number" />

          <FormField label="Contact Person Name" name="contactName"
            value={data.contactName} onChange={onChange}
            placeholder="Your name"
            error={errors.contactName} />

          <FormField label="Contact Phone Number" name="contactPhone"
            value={data.contactPhone} onChange={onChange}
            placeholder="Your phone number" type="tel"
            error={errors.contactPhone} />
        </div>

        {/* ══ Room Features — Presets + Custom ══ */}
        <div className="rent-section-block">
          <h3 className="rent-section-label">{cfg.featuresLabel}</h3>
          <p className="rent-section-hint">Tap features to add them to your card, or add your own.</p>

          <div className="rent-preset-list">
            {FEATURE_PRESETS.map(cat => (
              <details key={cat.category} className="rent-preset-group">
                <summary className="rent-preset-cat">{cat.category}</summary>
                <div className="rent-preset-items">
                  {cat.items.map(item => (
                    <button
                      key={item}
                      type="button"
                      className={`rent-preset-btn${isFeatureAdded(item) ? ' added' : ''}`}
                      onClick={() => !isFeatureAdded(item) && addFeaturePreset(item)}
                      disabled={isFeatureAdded(item)}
                    >
                      {isFeatureAdded(item) ? '✓ ' : '+ '}{item}
                    </button>
                  ))}
                </div>
              </details>
            ))}
          </div>

          <div className="rent-preset-actions">
            <button type="button" className="rent-custom-btn" onClick={addFeature}>✏️ Add Custom Feature</button>
            {features.length === 0 && (
              <button type="button" className="rent-custom-btn rent-sample-btn" onClick={loadDefaults}>📋 Load Sample</button>
            )}
          </div>

          {/* Added features — editable list */}
          {features.length > 0 && (
            <div className="rent-added-list">
              <h4 className="rent-added-heading">📝 Your Features ({features.length})</h4>
              {features.map((f, i) => (
                <div key={i} className="rent-edit-row">
                  <input
                    className="rent-edit-input"
                    type="text"
                    placeholder={`Feature ${i + 1}`}
                    value={f}
                    onChange={e => updateFeature(i, e.target.value)}
                  />
                  <button type="button" className="rent-remove-btn" onClick={() => removeFeature(i)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ══ Amenities — Presets + Custom ══ */}
        <div className="rent-section-block">
          <h3 className="rent-section-label">{cfg.amenitiesLabel}</h3>
          <p className="rent-section-hint">Choose amenities from categories below, or add custom ones.</p>

          <div className="rent-preset-list">
            {AMENITY_PRESETS.map(cat => (
              <details key={cat.category} className="rent-preset-group">
                <summary className="rent-preset-cat">{cat.category}</summary>
                <div className="rent-preset-items">
                  {cat.items.map(item => (
                    <button
                      key={item.text}
                      type="button"
                      className={`rent-preset-btn${isAmenityAdded(item.text) ? ' added' : ''}`}
                      onClick={() => !isAmenityAdded(item.text) && addAmenityPreset(item)}
                      disabled={isAmenityAdded(item.text)}
                    >
                      {isAmenityAdded(item.text) ? '✓ ' : '+ '}{item.icon} {item.text}
                    </button>
                  ))}
                </div>
              </details>
            ))}
          </div>

          <div className="rent-preset-actions">
            <button type="button" className="rent-custom-btn" onClick={addAmenity}>✏️ Add Custom Amenity</button>
            {amenities.length === 0 && (
              <button type="button" className="rent-custom-btn rent-sample-btn" onClick={loadDefaults}>📋 Load Sample</button>
            )}
          </div>

          {/* Added amenities — editable list */}
          {amenities.length > 0 && (
            <div className="rent-added-list">
              <h4 className="rent-added-heading">📝 Your Amenities ({amenities.length})</h4>
              {amenities.map((a, i) => (
                <div key={i} className="rent-edit-row">
                  <input
                    className="rent-edit-input rent-edit-icon"
                    type="text"
                    placeholder="Icon"
                    value={a.icon}
                    onChange={e => updateAmenity(i, 'icon', e.target.value)}
                    style={{ maxWidth: 56, textAlign: 'center' }}
                  />
                  <input
                    className="rent-edit-input"
                    type="text"
                    placeholder={`Amenity ${i + 1}`}
                    value={a.text}
                    onChange={e => updateAmenity(i, 'text', e.target.value)}
                  />
                  <button type="button" className="rent-remove-btn" onClick={() => removeAmenity(i)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Logo Upload ── */}
        <div className="rent-section-block">
          <h3 className="rent-section-label">🖼️ Logo (optional)</h3>
          <input type="file" name="logo" accept="image/*" onChange={onChange} />
        </div>

        {/* ══ Property Images Upload ══ */}
        <div className="rent-section-block">
          <h3 className="rent-section-label">📸 Property Images (up to 6)</h3>
          <p className="rent-section-hint">Upload room photos, building exterior, or property images to showcase on your card.</p>

          <div className="rent-img-grid">
            {(data.propertyImages || []).map((img, i) => (
              <div key={i} className="rent-img-thumb">
                <img src={img.src} alt={img.label || `Property ${i + 1}`} />
                <input
                  className="rent-img-label-input"
                  type="text"
                  placeholder="Caption (optional)"
                  value={img.label}
                  onChange={e => updatePropertyImageLabel(i, e.target.value)}
                />
                <button type="button" className="rent-img-remove" onClick={() => removePropertyImage(i)}>✕</button>
              </div>
            ))}

            {(data.propertyImages || []).length < 6 && (
              <button type="button" className="rent-img-add" onClick={() => imgInputRef.current?.click()}>
                <span className="rent-img-add-icon">＋</span>
                <span>Add Photo</span>
              </button>
            )}
          </div>

          <input
            ref={imgInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={e => { addPropertyImages(e.target.files); e.target.value = ''; }}
          />
        </div>

        {/* ── Actions ── */}
        <div className="form-actions">
          <button className="btn-back-form" onClick={onBack}>← Back</button>
          <button className="btn-generate" onClick={onGenerate}
            style={{ background: 'linear-gradient(135deg, #0b3d91, #43a047)', color: '#fff', boxShadow: '0 8px 24px rgba(11,61,145,.4)' }}>
            🎨 Generate Card
          </button>
        </div>
      </div>
    </div>
  );
}
