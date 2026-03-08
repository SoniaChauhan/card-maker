import { forwardRef } from 'react';
import { RENT_TEMPLATES, PROPERTY_TYPES, PROPERTY_TYPE_CONFIG } from './rentConstants';

/**
 * RentCardPreview — renders a PG / Rent advertisement card
 * Supports 6 colour themes, property types with dynamic labels, and property images.
 */
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

  return (
    <div className="rent-card" ref={ref}>
      {/* ─── Top Header ─── */}
      <div className="rent-header" style={{ background: tpl.headerBg }}>
        {logo && <img className="rent-header-logo" src={logo} alt="" />}
        {pt && <span className="rent-property-badge">{pt.label}</span>}
        <h1 className="rent-header-title">{title}</h1>
        {location && (
          <div className="rent-header-location">
            <span className="rent-loc-pin">📍</span>
            <span>{location}</span>
          </div>
        )}
      </div>

      {/* ─── Property Images ─── */}
      {propertyImages.length > 0 && (
        <div className="rent-section rent-images-section">
          <div className="rent-section-heading" style={{ background: tpl.headingBg }}>PROPERTY PHOTOS</div>
          <div className="rent-images-grid">
            {propertyImages.map((img, i) => (
              <div key={i} className="rent-image-cell">
                <img src={img.src} alt={img.label || `Photo ${i + 1}`} className="rent-image-photo" />
                {img.label && <span className="rent-image-caption">{img.label}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Rent Details (dynamic labels per property type) ─── */}
      {(rentWithoutAC || rentWithAC) && (
        <div className="rent-section">
          <div className="rent-section-heading" style={{ background: tpl.headingBg }}>RENT DETAILS</div>
          <div className="rent-price-row">
            {rentWithoutAC && (
              <div className="rent-price-card">
                <span className="rent-price-icon">{cfg.priceIcon1}</span>
                <span className="rent-price-label">{cfg.priceLabel1}</span>
                <span className="rent-price-value" style={{ color: tpl.priceColor }}>₹{rentWithoutAC}<span className="rent-price-per">{cfg.priceSuffix}</span></span>
              </div>
            )}
            {rentWithAC && (
              <div className="rent-price-card">
                <span className="rent-price-icon">{cfg.priceIcon2}</span>
                <span className="rent-price-label">{cfg.priceLabel2}</span>
                <span className="rent-price-value" style={{ color: tpl.acPriceColor }}>₹{rentWithAC}<span className="rent-price-per">{cfg.priceSuffix}</span></span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Features (dynamic heading per property type) ─── */}
      {features.length > 0 && (
        <div className="rent-section">
          <div className="rent-section-heading" style={{ background: tpl.headingBg }}>{cfg.featuresHeading}</div>
          <ul className="rent-feature-list">
            {features.map((f, i) => (
              <li key={i} className="rent-feature-item">
                <span className="rent-check">✅</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ─── Amenities (dynamic heading per property type) ─── */}
      {amenities.length > 0 && (
        <div className="rent-section">
          <div className="rent-section-heading" style={{ background: tpl.headingBg }}>{cfg.amenitiesHeading}</div>
          <ul className="rent-amenity-list">
            {amenities.map((a, i) => (
              <li key={i} className="rent-amenity-item">
                <span className="rent-amenity-icon">{a.icon || '✔️'}</span>
                <span>{a.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ─── Contact Footer ─── */}
      {(contactName || contactPhone) && (
        <div className="rent-footer" style={{ background: tpl.footerBg }}>
          <div className="rent-footer-heading">CONTACT NOW</div>
          {contactName && <p className="rent-footer-name">{contactName}</p>}
          {contactPhone && (
            <p className="rent-footer-phone">
              <span className="rent-phone-icon">📞</span> {contactPhone}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

export default RentCardPreview;
