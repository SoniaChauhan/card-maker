import { forwardRef } from 'react';

/**
 * RentCardPreview — renders a PG / Rent advertisement card
 * matching the design: blue header, yellow section headings,
 * features with green checkmarks, amenities with icons,
 * and a blue contact footer.
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
  } = data;

  return (
    <div className="rent-card" ref={ref}>
      {/* ─── Top Blue Header ─── */}
      <div className="rent-header">
        {logo && <img className="rent-header-logo" src={logo} alt="" />}
        <h1 className="rent-header-title">{title}</h1>
        {location && (
          <div className="rent-header-location">
            <span className="rent-loc-pin">📍</span>
            <span>{location}</span>
          </div>
        )}
      </div>

      {/* ─── Rent Details ─── */}
      {(rentWithoutAC || rentWithAC) && (
        <div className="rent-section">
          <div className="rent-section-heading">RENT DETAILS</div>
          <div className="rent-price-row">
            {rentWithoutAC && (
              <div className="rent-price-card">
                <span className="rent-price-icon">🪭</span>
                <span className="rent-price-label">Without AC</span>
                <span className="rent-price-value">₹{rentWithoutAC}<span className="rent-price-per"> / Per Bed</span></span>
              </div>
            )}
            {rentWithAC && (
              <div className="rent-price-card">
                <span className="rent-price-icon">❄️</span>
                <span className="rent-price-label">With AC</span>
                <span className="rent-price-value rent-price-ac">₹{rentWithAC}<span className="rent-price-per"> / Per Bed</span></span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Room Features ─── */}
      {features.length > 0 && (
        <div className="rent-section">
          <div className="rent-section-heading">ROOM FEATURES</div>
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

      {/* ─── Amenities ─── */}
      {amenities.length > 0 && (
        <div className="rent-section">
          <div className="rent-section-heading">AMENITIES</div>
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
        <div className="rent-footer">
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
