import { forwardRef, useMemo } from 'react';

/* Section display order & labels */
const SECTION_ORDER = ['ladies', 'men', 'kids', 'general'];
const SECTION_LABELS = {
  ladies:  '👩 Ladies',
  men:     '👨 Men',
  kids:    '👧 Kids',
  general: '✨ Services',
};

/**
 * SalonCardPreview — renders an elegant salon / parlour service card
 * Dark theme with gold accents, decorative leaf corners, service price list, contact info.
 */
const SalonCardPreview = forwardRef(function SalonCardPreview({ data }, ref) {
  const {
    businessName = '',
    tagline = 'Special Packages',
    services = [],
    contactPhone = '',
    contactName = '',
    address = '',
    logo = null,
    theme = 'dark-gold',
  } = data;

  const isDark = theme === 'dark-gold' || theme === 'dark-rose';
  const themeClass = `salon-theme-${theme}`;

  /* Group services by section — only sections that have items */
  const groupedSections = useMemo(() => {
    const map = {};
    services.forEach(s => {
      const key = s.section || 'general';
      if (!map[key]) map[key] = [];
      map[key].push(s);
    });
    return SECTION_ORDER.filter(k => map[k]?.length > 0).map(k => ({
      key: k,
      label: SECTION_LABELS[k],
      items: map[k],
    }));
  }, [services]);

  const hasMultipleSections = groupedSections.length > 1;

  return (
    <div className={`salon-card ${themeClass}`} ref={ref}>
      {/* Decorative corners */}
      <div className="salon-corner salon-corner-tl" />
      <div className="salon-corner salon-corner-tr" />
      <div className="salon-corner salon-corner-bl" />
      <div className="salon-corner salon-corner-br" />

      {/* Decorative leaf accents */}
      <svg className="salon-leaf salon-leaf-tl" viewBox="0 0 120 120" fill="none"><path d="M0 120 C0 60 60 0 120 0 C80 20 20 80 0 120Z" fill="currentColor" opacity=".18"/><path d="M0 90 C10 50 50 10 90 0 C60 20 20 60 0 90Z" fill="currentColor" opacity=".12"/></svg>
      <svg className="salon-leaf salon-leaf-br" viewBox="0 0 120 120" fill="none"><path d="M120 0 C120 60 60 120 0 120 C40 100 100 40 120 0Z" fill="currentColor" opacity=".18"/><path d="M120 30 C110 70 70 110 30 120 C60 100 100 60 120 30Z" fill="currentColor" opacity=".12"/></svg>

      {/* Header */}
      <div className="salon-header">
        {logo && <img className="salon-logo" src={logo} alt="" />}
        <h1 className="salon-biz-name">{businessName || 'Your Salon Name'}</h1>
        {tagline && <div className="salon-tagline">{tagline}</div>}
      </div>

      {/* Decorative divider */}
      <div className="salon-divider">
        <span className="salon-divider-line" />
        <span className="salon-divider-icon">✦</span>
        <span className="salon-divider-line" />
      </div>

      {/* Services List — grouped by section */}
      {groupedSections.length > 0 ? (
        <div className="salon-services">
          {groupedSections.map(sec => (
            <div key={sec.key} className="salon-service-group">
              {hasMultipleSections && (
                <div className="salon-group-header">
                  <span className="salon-group-line" />
                  <span className="salon-group-label">{sec.label}</span>
                  <span className="salon-group-line" />
                </div>
              )}
              {sec.items.map((s, i) => (
                <div key={i} className="salon-service-row">
                  <div className="salon-service-info">
                    <span className="salon-service-name">{s.name || 'Service'}</span>
                    {s.details && <span className="salon-service-details">{s.details}</span>}
                  </div>
                  <span className="salon-service-price">₹{s.price || '0'}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="salon-services-empty">
          <p>Add your services in the form</p>
        </div>
      )}

      {/* Bottom divider */}
      <div className="salon-divider">
        <span className="salon-divider-line" />
        <span className="salon-divider-icon">✦</span>
        <span className="salon-divider-line" />
      </div>

      {/* Contact Footer */}
      <div className="salon-footer">
        {contactName && <p className="salon-footer-name">{contactName}</p>}
        {contactPhone && (
          <p className="salon-footer-phone">
            contact no.{contactPhone}
          </p>
        )}
        {address && <p className="salon-footer-address">📍 {address}</p>}
      </div>
    </div>
  );
});

export default SalonCardPreview;
