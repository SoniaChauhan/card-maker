import { forwardRef, useMemo } from 'react';

/* Section display order & labels */
const SECTION_ORDER = ['ladies', 'men', 'kids', 'general'];
const SECTION_LABELS = {
  ladies:  '👩 Ladies',
  men:     '👨 Men',
  kids:    '👧 Kids',
  general: '✨ Services',
};

/* Layout groups — 5 distinct layout families */
const LAYOUT_A = ['dark-gold', 'dark-rose', 'blush-pink', 'white-gold'];
const LAYOUT_B = ['teal-cream', 'midnight-plum', 'sage-green', 'coral-peach'];
const LAYOUT_C = ['navy-silver', 'lavender-mist', 'mocha-cream', 'ruby-black'];
const LAYOUT_D = ['mint-fresh', 'sunset-amber', 'ice-blue', 'mauve-silk'];
// LAYOUT_E = everything else (forest-bronze, champagne, berry-wine, pearl-gray)

function getLayout(theme) {
  if (LAYOUT_A.includes(theme)) return 'A';
  if (LAYOUT_B.includes(theme)) return 'B';
  if (LAYOUT_C.includes(theme)) return 'C';
  if (LAYOUT_D.includes(theme)) return 'D';
  return 'E';
}

/**
 * SalonCardPreview — renders an elegant salon / parlour service card
 * 5 distinct layout families × 4 colour themes each = 20 unique templates.
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

  const themeClass = `salon-theme-${theme}`;
  const layout = getLayout(theme);

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
  const allServices = groupedSections.flatMap(s => s.items);

  /* ─── LAYOUT A: Classic Elegant List ─── */
  if (layout === 'A') {
    return (
      <div className={`salon-card salon-layout-a ${themeClass}`} ref={ref}>
        <div className="salon-corner salon-corner-tl" />
        <div className="salon-corner salon-corner-tr" />
        <div className="salon-corner salon-corner-bl" />
        <div className="salon-corner salon-corner-br" />
        <svg className="salon-leaf salon-leaf-tl" viewBox="0 0 120 120" fill="none"><path d="M0 120 C0 60 60 0 120 0 C80 20 20 80 0 120Z" fill="currentColor" opacity=".18"/><path d="M0 90 C10 50 50 10 90 0 C60 20 20 60 0 90Z" fill="currentColor" opacity=".12"/></svg>
        <svg className="salon-leaf salon-leaf-br" viewBox="0 0 120 120" fill="none"><path d="M120 0 C120 60 60 120 0 120 C40 100 100 40 120 0Z" fill="currentColor" opacity=".18"/><path d="M120 30 C110 70 70 110 30 120 C60 100 100 60 120 30Z" fill="currentColor" opacity=".12"/></svg>

        <div className="salon-header">
          {logo && <img className="salon-logo" src={logo} alt="" />}
          {businessName && <h1 className="salon-biz-name">{businessName}</h1>}
          {tagline && <div className="salon-tagline">{tagline}</div>}
        </div>
        <div className="salon-divider"><span className="salon-divider-line" /><span className="salon-divider-icon">✦</span><span className="salon-divider-line" /></div>

        {groupedSections.length > 0 ? (
          <div className="salon-services">
            {groupedSections.map(sec => (
              <div key={sec.key} className="salon-service-group">
                {hasMultipleSections && (
                  <div className="salon-group-header"><span className="salon-group-line" /><span className="salon-group-label">{sec.label}</span><span className="salon-group-line" /></div>
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
          <div className="salon-services-empty"><p>Add your services in the form</p></div>
        )}

        <div className="salon-divider"><span className="salon-divider-line" /><span className="salon-divider-icon">✦</span><span className="salon-divider-line" /></div>
        <div className="salon-footer">
          {contactName && <p className="salon-footer-name">{contactName}</p>}
          {contactPhone && <p className="salon-footer-phone">contact no.{contactPhone}</p>}
          {address && <p className="salon-footer-address">📍 {address}</p>}
        </div>
      </div>
    );
  }

  /* ─── LAYOUT B: Two-Column Grid ─── */
  if (layout === 'B') {
    return (
      <div className={`salon-card salon-layout-b ${themeClass}`} ref={ref}>
        {/* Top accent bar */}
        <div className="salon-b-accent-bar" />

        <div className="salon-b-header">
          {logo && <img className="salon-logo" src={logo} alt="" />}
          <div>
            {businessName && <h1 className="salon-biz-name">{businessName}</h1>}
            {tagline && <div className="salon-tagline">{tagline}</div>}
          </div>
        </div>

        {groupedSections.length > 0 ? (
          <div className="salon-b-grid">
            {groupedSections.map(sec => (
              <div key={sec.key} className="salon-b-section">
                <div className="salon-b-section-title">{sec.label}</div>
                {sec.items.map((s, i) => (
                  <div key={i} className="salon-b-item">
                    <span className="salon-b-item-name">{s.name || 'Service'}</span>
                    {s.details && <span className="salon-b-item-details">{s.details}</span>}
                    <span className="salon-service-price">₹{s.price || '0'}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="salon-services-empty"><p>Add your services in the form</p></div>
        )}

        <div className="salon-b-footer">
          <div className="salon-b-footer-left">
            {contactName && <p className="salon-footer-name">{contactName}</p>}
            {contactPhone && <p className="salon-footer-phone">📞 {contactPhone}</p>}
          </div>
          {address && <p className="salon-footer-address">📍 {address}</p>}
        </div>
      </div>
    );
  }

  /* ─── LAYOUT C: Service Cards ─── */
  if (layout === 'C') {
    return (
      <div className={`salon-card salon-layout-c ${themeClass}`} ref={ref}>
        <div className="salon-c-header">
          {logo && <img className="salon-logo salon-c-logo" src={logo} alt="" />}
          {businessName && <h1 className="salon-biz-name">{businessName}</h1>}
          {tagline && <div className="salon-tagline">{tagline}</div>}
          <div className="salon-c-header-line" />
        </div>

        {allServices.length > 0 ? (
          <div className="salon-c-cards">
            {allServices.map((s, i) => (
              <div key={i} className="salon-c-card">
                <div className="salon-c-card-top">
                  <span className="salon-c-card-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="salon-service-price">₹{s.price || '0'}</span>
                </div>
                <div className="salon-c-card-name">{s.name || 'Service'}</div>
                {s.details && <div className="salon-c-card-details">{s.details}</div>}
              </div>
            ))}
          </div>
        ) : (
          <div className="salon-services-empty"><p>Add your services in the form</p></div>
        )}

        <div className="salon-c-footer">
          <div className="salon-c-footer-line" />
          {contactName && <p className="salon-footer-name">{contactName}</p>}
          {contactPhone && <p className="salon-footer-phone">📞 {contactPhone}</p>}
          {address && <p className="salon-footer-address">📍 {address}</p>}
        </div>
      </div>
    );
  }

  /* ─── LAYOUT D: Horizontal Banded ─── */
  if (layout === 'D') {
    return (
      <div className={`salon-card salon-layout-d ${themeClass}`} ref={ref}>
        <div className="salon-d-top">
          <div className="salon-d-logo-row">
            {logo && <img className="salon-logo" src={logo} alt="" />}
          </div>
          {businessName && <h1 className="salon-biz-name salon-d-name">{businessName}</h1>}
          {tagline && <div className="salon-tagline">{tagline}</div>}
        </div>

        <div className="salon-d-band">
          <span>✦ PRICE LIST ✦</span>
        </div>

        {groupedSections.length > 0 ? (
          <div className="salon-d-services">
            {groupedSections.map(sec => (
              <div key={sec.key} className="salon-d-group">
                {hasMultipleSections && <div className="salon-d-group-title">{sec.label}</div>}
                <div className="salon-d-table">
                  {sec.items.map((s, i) => (
                    <div key={i} className={`salon-d-row ${i % 2 === 0 ? 'salon-d-row-alt' : ''}`}>
                      <div className="salon-d-row-left">
                        <span className="salon-d-dot">●</span>
                        <span className="salon-service-name">{s.name || 'Service'}</span>
                      </div>
                      <span className="salon-service-price">₹{s.price || '0'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="salon-services-empty"><p>Add your services in the form</p></div>
        )}

        <div className="salon-d-contact">
          {contactName && <span className="salon-footer-name">{contactName}</span>}
          {contactPhone && <span className="salon-footer-phone">📞 {contactPhone}</span>}
          {address && <span className="salon-footer-address">📍 {address}</span>}
        </div>
      </div>
    );
  }

  /* ─── LAYOUT E: Premium Table ─── */
  return (
    <div className={`salon-card salon-layout-e ${themeClass}`} ref={ref}>
      <div className="salon-e-border">
        <div className="salon-e-border-inner">
          <div className="salon-e-header">
            {logo && <img className="salon-logo salon-e-logo" src={logo} alt="" />}
            <div className="salon-e-titles">
              {businessName && <h1 className="salon-biz-name">{businessName}</h1>}
              {tagline && <div className="salon-tagline">{tagline}</div>}
            </div>
          </div>

          <div className="salon-e-ornament">❦ ━━━━━━━━━━━━ ❦</div>

          {groupedSections.length > 0 ? (
            <div className="salon-e-services">
              {groupedSections.map(sec => (
                <div key={sec.key} className="salon-e-group">
                  {hasMultipleSections && <div className="salon-e-group-label">{sec.label}</div>}
                  <table className="salon-e-table">
                    <thead><tr><th>Service</th><th>Details</th><th>Price</th></tr></thead>
                    <tbody>
                      {sec.items.map((s, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'salon-e-row-alt' : ''}>
                          <td className="salon-e-td-name">{s.name || 'Service'}</td>
                          <td className="salon-e-td-details">{s.details || '—'}</td>
                          <td className="salon-e-td-price">₹{s.price || '0'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ) : (
            <div className="salon-services-empty"><p>Add your services in the form</p></div>
          )}

          <div className="salon-e-ornament">❦ ━━━━━━━━━━━━ ❦</div>

          <div className="salon-e-footer">
            {contactName && <p className="salon-footer-name">{contactName}</p>}
            {contactPhone && <p className="salon-footer-phone">📞 {contactPhone}</p>}
            {address && <p className="salon-footer-address">📍 {address}</p>}
          </div>
        </div>
      </div>
    </div>
  );
});

export default SalonCardPreview;
