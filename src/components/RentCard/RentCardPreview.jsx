import { forwardRef } from 'react';
import { RENT_TEMPLATES, PROPERTY_TYPES, PROPERTY_TYPE_CONFIG } from './rentConstants';

/*
 * Layout groups — 5 distinct layout families:
 * A (1-4):   Standard vertical sections (original)
 * B (5-8):   Two-column split (details left, features right)
 * C (9-12):  Compact card-based with icon grid
 * D (13-16): Horizontal header + inline details
 * E (17-20): Premium real-estate style with photo focus
 */
function getLayout(id) {
  if (id <= 4) return 'A';
  if (id <= 8) return 'B';
  if (id <= 12) return 'C';
  if (id <= 16) return 'D';
  return 'E';
}

const RentCardPreview = forwardRef(function RentCardPreview({ data }, ref) {
  const {
    title = 'PG / PER BED RENT AVAILABLE',
    location = '',
    rentWithoutAC = '',
    rentWithAC = '',
    features = [],
    amenities = [],
    contactName = '',
    contactPhone = '',
    logo = null,
    selectedTemplate = 1,
    propertyType = 'pg',
    propertyImages = [],
  } = data;

  const tpl = RENT_TEMPLATES.find(t => t.id === selectedTemplate) || RENT_TEMPLATES[0];
  const pt  = PROPERTY_TYPES.find(t => t.id === propertyType);
  const cfg = PROPERTY_TYPE_CONFIG[propertyType] || PROPERTY_TYPE_CONFIG.pg;
  const layout = getLayout(selectedTemplate);

  /* ─── LAYOUT A: Standard Vertical Sections ─── */
  if (layout === 'A') {
    return (
      <div className="rent-card rent-layout-a" ref={ref}>
        <div className="rent-header" style={{ background: tpl.headerBg }}>
          {logo && <img className="rent-header-logo" src={logo} alt="" />}
          {pt && <span className="rent-property-badge">{pt.label}</span>}
          <h1 className="rent-header-title">{title}</h1>
          {location && <div className="rent-header-location"><span className="rent-loc-pin">📍</span><span>{location}</span></div>}
        </div>

        {propertyImages.length > 0 && (
          <div className="rent-section rent-images-section">
            <div className="rent-section-heading" style={{ background: tpl.headingBg }}>PROPERTY PHOTOS</div>
            <div className="rent-images-grid">
              {propertyImages.map((img, i) => (
                <div key={i} className="rent-image-cell"><img src={img.src} alt={img.label || `Photo ${i + 1}`} className="rent-image-photo" />{img.label && <span className="rent-image-caption">{img.label}</span>}</div>
              ))}
            </div>
          </div>
        )}

        {(rentWithoutAC || rentWithAC) && (
          <div className="rent-section">
            <div className="rent-section-heading" style={{ background: tpl.headingBg }}>RENT DETAILS</div>
            <div className="rent-price-row">
              {rentWithoutAC && <div className="rent-price-card"><span className="rent-price-icon">{cfg.priceIcon1}</span><span className="rent-price-label">{cfg.priceLabel1}</span><span className="rent-price-value" style={{ color: tpl.priceColor }}>₹{rentWithoutAC}<span className="rent-price-per">{cfg.priceSuffix}</span></span></div>}
              {rentWithAC && <div className="rent-price-card"><span className="rent-price-icon">{cfg.priceIcon2}</span><span className="rent-price-label">{cfg.priceLabel2}</span><span className="rent-price-value" style={{ color: tpl.acPriceColor }}>₹{rentWithAC}<span className="rent-price-per">{cfg.priceSuffix}</span></span></div>}
            </div>
          </div>
        )}

        {features.length > 0 && (
          <div className="rent-section">
            <div className="rent-section-heading" style={{ background: tpl.headingBg }}>{cfg.featuresHeading}</div>
            <ul className="rent-feature-list">{features.map((f, i) => <li key={i} className="rent-feature-item"><span className="rent-check">✅</span><span>{f}</span></li>)}</ul>
          </div>
        )}

        {amenities.length > 0 && (
          <div className="rent-section">
            <div className="rent-section-heading" style={{ background: tpl.headingBg }}>{cfg.amenitiesHeading}</div>
            <ul className="rent-amenity-list">{amenities.map((a, i) => <li key={i} className="rent-amenity-item"><span className="rent-amenity-icon">{a.icon || '✔️'}</span><span>{a.text}</span></li>)}</ul>
          </div>
        )}

        {(contactName || contactPhone) && (
          <div className="rent-footer" style={{ background: tpl.footerBg }}>
            <div className="rent-footer-heading">CONTACT NOW</div>
            {contactName && <p className="rent-footer-name">{contactName}</p>}
            {contactPhone && <p className="rent-footer-phone"><span className="rent-phone-icon">📞</span> {contactPhone}</p>}
          </div>
        )}
      </div>
    );
  }

  /* ─── LAYOUT B: Two-Column Split ─── */
  if (layout === 'B') {
    return (
      <div className="rent-card rent-layout-b" ref={ref}>
        <div className="rent-header" style={{ background: tpl.headerBg }}>
          <div className="rent-b-header-row">
            {logo && <img className="rent-header-logo" src={logo} alt="" />}
            <div className="rent-b-header-text">
              {pt && <span className="rent-property-badge">{pt.label}</span>}
              <h1 className="rent-header-title">{title}</h1>
            </div>
          </div>
          {location && <div className="rent-header-location"><span className="rent-loc-pin">📍</span><span>{location}</span></div>}
        </div>

        {propertyImages.length > 0 && (
          <div className="rent-section rent-images-section">
            <div className="rent-section-heading" style={{ background: tpl.headingBg }}>PROPERTY PHOTOS</div>
            <div className="rent-images-grid">{propertyImages.map((img, i) => <div key={i} className="rent-image-cell"><img src={img.src} alt={img.label || `Photo ${i + 1}`} className="rent-image-photo" />{img.label && <span className="rent-image-caption">{img.label}</span>}</div>)}</div>
          </div>
        )}

        <div className="rent-b-columns">
          <div className="rent-b-col-left">
            {(rentWithoutAC || rentWithAC) && (
              <div className="rent-b-price-block">
                <div className="rent-section-heading" style={{ background: tpl.headingBg }}>RENT DETAILS</div>
                {rentWithoutAC && <div className="rent-b-price-item"><span>{cfg.priceIcon1} {cfg.priceLabel1}</span><strong style={{ color: tpl.priceColor }}>₹{rentWithoutAC}</strong></div>}
                {rentWithAC && <div className="rent-b-price-item"><span>{cfg.priceIcon2} {cfg.priceLabel2}</span><strong style={{ color: tpl.acPriceColor }}>₹{rentWithAC}</strong></div>}
              </div>
            )}
            {features.length > 0 && (
              <>
                <div className="rent-section-heading" style={{ background: tpl.headingBg }}>{cfg.featuresHeading}</div>
                <ul className="rent-feature-list">{features.map((f, i) => <li key={i} className="rent-feature-item"><span className="rent-check">✅</span><span>{f}</span></li>)}</ul>
              </>
            )}
          </div>
          <div className="rent-b-col-right">
            {amenities.length > 0 && (
              <>
                <div className="rent-section-heading" style={{ background: tpl.headingBg }}>{cfg.amenitiesHeading}</div>
                <ul className="rent-amenity-list">{amenities.map((a, i) => <li key={i} className="rent-amenity-item"><span className="rent-amenity-icon">{a.icon || '✔️'}</span><span>{a.text}</span></li>)}</ul>
              </>
            )}
          </div>
        </div>

        {(contactName || contactPhone) && (
          <div className="rent-footer" style={{ background: tpl.footerBg }}>
            <div className="rent-footer-heading">CONTACT NOW</div>
            {contactName && <p className="rent-footer-name">{contactName}</p>}
            {contactPhone && <p className="rent-footer-phone"><span className="rent-phone-icon">📞</span> {contactPhone}</p>}
          </div>
        )}
      </div>
    );
  }

  /* ─── LAYOUT C: Compact Icon Grid ─── */
  if (layout === 'C') {
    return (
      <div className="rent-card rent-layout-c" ref={ref}>
        <div className="rent-c-top-bar" style={{ background: tpl.headerBg }} />
        <div className="rent-c-body">
          <div className="rent-c-title-row">
            {logo && <img className="rent-header-logo" src={logo} alt="" />}
            <div>
              {pt && <span className="rent-property-badge rent-c-badge" style={{ background: tpl.acPriceColor }}>{pt.label}</span>}
              <h1 className="rent-c-title">{title}</h1>
              {location && <p className="rent-c-location">📍 {location}</p>}
            </div>
          </div>

          {propertyImages.length > 0 && (
            <div className="rent-images-grid rent-c-images">{propertyImages.map((img, i) => <div key={i} className="rent-image-cell"><img src={img.src} alt={img.label || `Photo ${i + 1}`} className="rent-image-photo" />{img.label && <span className="rent-image-caption">{img.label}</span>}</div>)}</div>
          )}

          {(rentWithoutAC || rentWithAC) && (
            <div className="rent-c-price-row">
              {rentWithoutAC && <div className="rent-c-price-card" style={{ borderColor: tpl.priceColor }}><span className="rent-c-price-label">{cfg.priceLabel1}</span><span className="rent-c-price-val" style={{ color: tpl.priceColor }}>₹{rentWithoutAC}</span><span className="rent-c-price-suffix">{cfg.priceSuffix}</span></div>}
              {rentWithAC && <div className="rent-c-price-card" style={{ borderColor: tpl.acPriceColor }}><span className="rent-c-price-label">{cfg.priceLabel2}</span><span className="rent-c-price-val" style={{ color: tpl.acPriceColor }}>₹{rentWithAC}</span><span className="rent-c-price-suffix">{cfg.priceSuffix}</span></div>}
            </div>
          )}

          {features.length > 0 && (
            <div className="rent-c-section">
              <div className="rent-c-section-label">{cfg.featuresHeading}</div>
              <div className="rent-c-chip-grid">{features.map((f, i) => <span key={i} className="rent-c-chip">✅ {f}</span>)}</div>
            </div>
          )}

          {amenities.length > 0 && (
            <div className="rent-c-section">
              <div className="rent-c-section-label">{cfg.amenitiesHeading}</div>
              <div className="rent-c-chip-grid">{amenities.map((a, i) => <span key={i} className="rent-c-chip">{a.icon || '✔️'} {a.text}</span>)}</div>
            </div>
          )}
        </div>

        {(contactName || contactPhone) && (
          <div className="rent-c-footer" style={{ background: tpl.footerBg }}>
            {contactName && <span className="rent-footer-name">{contactName}</span>}
            {contactPhone && <span className="rent-footer-phone">📞 {contactPhone}</span>}
          </div>
        )}
      </div>
    );
  }

  /* ─── LAYOUT D: Horizontal Header + Inline Details ─── */
  if (layout === 'D') {
    return (
      <div className="rent-card rent-layout-d" ref={ref}>
        <div className="rent-d-header" style={{ background: tpl.headerBg }}>
          <div className="rent-d-header-top">
            {logo && <img className="rent-header-logo rent-d-logo" src={logo} alt="" />}
            <div className="rent-d-header-info">
              {pt && <span className="rent-property-badge">{pt.label}</span>}
              <h1 className="rent-header-title">{title}</h1>
            </div>
          </div>
          {location && <div className="rent-d-location">📍 {location}</div>}
          {(rentWithoutAC || rentWithAC) && (
            <div className="rent-d-prices">
              {rentWithoutAC && <div className="rent-d-price">{cfg.priceIcon1} {cfg.priceLabel1}: <strong>₹{rentWithoutAC}</strong></div>}
              {rentWithAC && <div className="rent-d-price">{cfg.priceIcon2} {cfg.priceLabel2}: <strong>₹{rentWithAC}</strong></div>}
            </div>
          )}
        </div>

        {propertyImages.length > 0 && (
          <div className="rent-section rent-images-section">
            <div className="rent-images-grid">{propertyImages.map((img, i) => <div key={i} className="rent-image-cell"><img src={img.src} alt={img.label || `Photo ${i + 1}`} className="rent-image-photo" />{img.label && <span className="rent-image-caption">{img.label}</span>}</div>)}</div>
          </div>
        )}

        <div className="rent-d-body">
          {features.length > 0 && (
            <div className="rent-d-section">
              <div className="rent-d-section-title" style={{ color: tpl.accentColor }}>{cfg.featuresHeading}</div>
              <div className="rent-d-feature-grid">{features.map((f, i) => <div key={i} className="rent-d-feature">✅ {f}</div>)}</div>
            </div>
          )}
          {amenities.length > 0 && (
            <div className="rent-d-section">
              <div className="rent-d-section-title" style={{ color: tpl.accentColor }}>{cfg.amenitiesHeading}</div>
              <div className="rent-d-feature-grid">{amenities.map((a, i) => <div key={i} className="rent-d-feature">{a.icon || '✔️'} {a.text}</div>)}</div>
            </div>
          )}
        </div>

        {(contactName || contactPhone) && (
          <div className="rent-d-footer" style={{ borderTopColor: tpl.accentColor }}>
            <span className="rent-d-footer-label">CONTACT:</span>
            {contactName && <span>{contactName}</span>}
            {contactPhone && <span className="rent-d-footer-phone">📞 {contactPhone}</span>}
          </div>
        )}
      </div>
    );
  }

  /* ─── LAYOUT E: Premium Real-Estate Style ─── */
  return (
    <div className="rent-card rent-layout-e" ref={ref}>
      <div className="rent-e-hero" style={{ background: tpl.headerBg }}>
        <div className="rent-e-hero-overlay">
          {logo && <img className="rent-header-logo rent-e-logo" src={logo} alt="" />}
          <h1 className="rent-e-hero-title">{title}</h1>
          {pt && <span className="rent-property-badge">{pt.label}</span>}
          {location && <div className="rent-e-location">📍 {location}</div>}
        </div>
      </div>

      {propertyImages.length > 0 && (
        <div className="rent-e-images">
          {propertyImages.map((img, i) => (
            <div key={i} className="rent-image-cell"><img src={img.src} alt={img.label || `Photo ${i + 1}`} className="rent-image-photo" />{img.label && <span className="rent-image-caption">{img.label}</span>}</div>
          ))}
        </div>
      )}

      {(rentWithoutAC || rentWithAC) && (
        <div className="rent-e-price-strip" style={{ background: tpl.headingBg }}>
          {rentWithoutAC && <div className="rent-e-price-item"><span className="rent-e-price-lbl">{cfg.priceLabel1}</span><span className="rent-e-price-val">₹{rentWithoutAC}</span></div>}
          {rentWithAC && <div className="rent-e-price-item"><span className="rent-e-price-lbl">{cfg.priceLabel2}</span><span className="rent-e-price-val">₹{rentWithAC}</span></div>}
        </div>
      )}

      <div className="rent-e-body">
        {features.length > 0 && (
          <div className="rent-e-section">
            <h3 className="rent-e-section-title">{cfg.featuresHeading}</h3>
            <div className="rent-e-list">{features.map((f, i) => <div key={i} className="rent-e-list-item"><span className="rent-e-bullet" style={{ background: tpl.accentColor }} />  {f}</div>)}</div>
          </div>
        )}
        {amenities.length > 0 && (
          <div className="rent-e-section">
            <h3 className="rent-e-section-title">{cfg.amenitiesHeading}</h3>
            <div className="rent-e-amenity-grid">{amenities.map((a, i) => <div key={i} className="rent-e-amenity-card"><span className="rent-e-amenity-icon">{a.icon || '✔️'}</span><span>{a.text}</span></div>)}</div>
          </div>
        )}
      </div>

      {(contactName || contactPhone) && (
        <div className="rent-footer" style={{ background: tpl.footerBg }}>
          <div className="rent-footer-heading">CONTACT NOW</div>
          {contactName && <p className="rent-footer-name">{contactName}</p>}
          {contactPhone && <p className="rent-footer-phone"><span className="rent-phone-icon">📞</span> {contactPhone}</p>}
        </div>
      )}
    </div>
  );
});

export default RentCardPreview;
