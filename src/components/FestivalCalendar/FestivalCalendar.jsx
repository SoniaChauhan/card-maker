'use client';
import { useState, useMemo } from 'react';
import './FestivalCalendar.css';
import FESTIVAL_CALENDAR from '../../utils/festivalCalendar';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Build a lookup: { 'YYYY-MM-DD' : [festival, …] }
 */
function buildFestivalMap(year) {
  const map = {};
  FESTIVAL_CALENDAR.forEach(f => {
    f.dates.forEach(d => {
      const start = new Date(d.start + 'T00:00:00');
      const end = new Date(d.end + 'T00:00:00');
      if (start.getFullYear() !== year && end.getFullYear() !== year) return;
      for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
        const key = dt.toISOString().slice(0, 10);
        if (!map[key]) map[key] = [];
        if (!map[key].some(x => x.key === f.key)) {
          map[key].push(f);
        }
      }
    });
  });
  return map;
}

/** Get festivals in a specific month (unique), with their start date */
function getMonthFestivals(festMap, year, month) {
  const set = new Map();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    if (festMap[key]) {
      festMap[key].forEach(f => {
        if (!set.has(f.key)) set.set(f.key, { ...f, _dateStr: key });
      });
    }
  }
  return Array.from(set.values());
}

export default function FestivalCalendar({ onFestivalClick, onBack }) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const [year, setYear] = useState(today.getFullYear());
  const [openMonth, setOpenMonth] = useState(currentMonth);
  const [selectedDay, setSelectedDay] = useState(null);
  const [tooltipFest, setTooltipFest] = useState(null);

  const festMap = useMemo(() => buildFestivalMap(year), [year]);
  const todayStr = today.toISOString().slice(0, 10);

  function prevYear() { setYear(y => y - 1); setOpenMonth(-1); setSelectedDay(null); }
  function nextYear() { setYear(y => y + 1); setOpenMonth(-1); setSelectedDay(null); }

  function toggleMonth(mi) {
    setOpenMonth(prev => prev === mi ? -1 : mi);
    setSelectedDay(null);
    setTooltipFest(null);
  }

  function handleDayClick(dateStr, festivals) {
    if (festivals.length > 0) {
      setSelectedDay(dateStr === selectedDay ? null : dateStr);
      setTooltipFest(festivals);
    } else {
      setSelectedDay(null);
      setTooltipFest(null);
    }
  }

  return (
    <div className="fc-page">
      {/* Top bar */}
      <div className="fc-topbar">
        {onBack && (
          <button className="fc-back-btn" onClick={onBack} aria-label="Go back">
            ← Back
          </button>
        )}
        <h1 className="fc-page-title">🗓️ Festival Calendar</h1>
        <p className="fc-page-sub">Explore Indian festivals month‑wise and create cards for each celebration.</p>
      </div>

      <div className="fc-wrapper">
        {/* Year navigation */}
        <div className="fc-year-nav">
          <button className="fc-year-btn" onClick={prevYear} aria-label="Previous year">‹</button>
          <h3 className="fc-year-title">{year}</h3>
          <button className="fc-year-btn" onClick={nextYear} aria-label="Next year">›</button>
        </div>

        {/* Accordion months */}
        <div className="fc-accordion">
          {MONTH_NAMES.map((mName, mi) => {
            const firstDay = new Date(year, mi, 1).getDay();
            const daysInMonth = new Date(year, mi + 1, 0).getDate();
            const monthFestivals = getMonthFestivals(festMap, year, mi);
            const isOpen = openMonth === mi;
            const isCurrent = year === today.getFullYear() && mi === currentMonth;

            return (
              <div key={mi} className={`fc-month-panel ${isOpen ? 'fc-month-panel--open' : ''} ${isCurrent ? 'fc-month-panel--current' : ''}`}>
                {/* Accordion header */}
                <button className="fc-month-header" onClick={() => toggleMonth(mi)}>
                  <div className="fc-month-header-left">
                    <span className={`fc-chevron ${isOpen ? 'fc-chevron--open' : ''}`}>▸</span>
                    <span className="fc-month-name">{mName}</span>
                    {isCurrent && <span className="fc-current-tag">Current</span>}
                  </div>
                  <div className="fc-month-header-right">
                    {monthFestivals.length > 0 && (
                      <span className="fc-month-badge">{monthFestivals.length} {monthFestivals.length === 1 ? 'Festival' : 'Festivals'}</span>
                    )}
                  </div>
                </button>

                {/* Collapsible body */}
                <div className={`fc-month-body ${isOpen ? 'fc-month-body--open' : ''}`}>
                  <div className="fc-month-body-inner">
                    {/* Day names */}
                    <div className="fc-day-names">
                      {DAY_NAMES.map(d => <span key={d} className="fc-day-label">{d}</span>)}
                    </div>

                    {/* Day cells */}
                    <div className="fc-day-grid">
                      {Array.from({ length: firstDay }).map((_, i) => (
                        <span key={`e${i}`} className="fc-day fc-day--empty" />
                      ))}
                      {Array.from({ length: daysInMonth }).map((_, d) => {
                        const dayNum = d + 1;
                        const dateStr = `${year}-${String(mi + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                        const fests = festMap[dateStr] || [];
                        const isToday = dateStr === todayStr;
                        const hasFest = fests.length > 0;
                        const isSelected = dateStr === selectedDay;

                        return (
                          <button
                            key={dayNum}
                            className={`fc-day ${isToday ? 'fc-day--today' : ''} ${hasFest ? 'fc-day--festival' : ''} ${isSelected ? 'fc-day--selected' : ''}`}
                            style={hasFest ? { background: fests[0].grad } : undefined}
                            onClick={() => handleDayClick(dateStr, fests)}
                            title={hasFest ? fests.map(f => `${f.icon} ${f.name}`).join(', ') : undefined}
                          >
                            {dayNum}
                            {hasFest && <span className="fc-day-dot" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* ── Special Days / Festivals below the calendar ── */}
                    {monthFestivals.length > 0 && (
                      <div className="fc-special-days">
                        <h4 className="fc-special-days-title">✨ Special Days</h4>
                        <div className="fc-special-days-list">
                          {monthFestivals.map(f => {
                            const dt = new Date(f._dateStr + 'T00:00:00');
                            const dateLabel = dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                            return (
                              <button
                                key={f.key}
                                className="fc-special-day-item"
                                style={{ background: f.grad }}
                                onClick={() => onFestivalClick?.(f)}
                              >
                                <span className="fc-special-day-icon">{f.icon}</span>
                                <div className="fc-special-day-info">
                                  <strong className="fc-special-day-name">{f.name}</strong>
                                  {f.nameHindi && <span className="fc-special-day-hindi">{f.nameHindi}</span>}
                                  <span className="fc-special-day-date">📅 {dateLabel}</span>
                                </div>
                                <span className="fc-special-day-arrow">→</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tooltip/popup for selected day */}
      {selectedDay && tooltipFest && tooltipFest.length > 0 && (
        <div className="fc-tooltip-overlay" onClick={() => setSelectedDay(null)}>
          <div className="fc-tooltip" onClick={e => e.stopPropagation()}>
            <button className="fc-tooltip-close" onClick={() => setSelectedDay(null)}>✕</button>
            <h4 className="fc-tooltip-date">
              📅 {new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </h4>
            <div className="fc-tooltip-list">
              {tooltipFest.map(f => (
                <button
                  key={f.key}
                  className="fc-tooltip-item"
                  style={{ background: f.grad }}
                  onClick={() => { onFestivalClick?.(f); setSelectedDay(null); }}
                >
                  <span className="fc-tooltip-icon">{f.icon}</span>
                  <div className="fc-tooltip-info">
                    <strong>{f.name}</strong>
                    {f.nameHindi && <span className="fc-tooltip-hindi">{f.nameHindi}</span>}
                    <span className="fc-tooltip-price">{f.offerPrice} — {f.type === 'free' ? 'Free' : 'Premium Card'}</span>
                  </div>
                  <span className="fc-tooltip-arrow">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
