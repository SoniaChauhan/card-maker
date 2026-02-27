'use client';
import { useState, useEffect } from 'react';

const MONTHS = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December',
];

function daysInMonth(month, year) {
  if (!month) return 31;
  return new Date(year || 2000, Number(month), 0).getDate();
}

function calcAge(year, month, day) {
  if (!year || !month || !day) return '';
  const today = new Date();
  const born  = new Date(Number(year), Number(month) - 1, Number(day));
  let age = today.getFullYear() - born.getFullYear();
  const m = today.getMonth() - born.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < born.getDate())) age--;
  return age >= 0 ? String(age) : '';
}

/**
 * User-friendly Day / Month / Year dropdown date-of-birth picker.
 * Fires onChange({ target: { name: 'dob', value: 'YYYY-MM-DD' } })
 * and onAgeChange(ageString) whenever a complete date is selected.
 */
export default function DobPicker({ value = '', onChange, onAgeChange, error, required }) {
  const currentYear = new Date().getFullYear();

  // Parse existing ISO value → seed state
  const [y, m, d] = value ? value.split('-') : ['', '', ''];
  const [year,  setYear]  = useState(y || '');
  const [month, setMonth] = useState(m ? String(Number(m)) : '');
  const [day,   setDay]   = useState(d ? String(Number(d)) : '');

  const maxDay = daysInMonth(month, year);

  // If selected day becomes invalid after month/year change, clamp it
  useEffect(() => {
    if (day && Number(day) > maxDay) setDay(String(maxDay));
  }, [month, year]);  // eslint-disable-line

  // Fire onChange whenever any part changes
  useEffect(() => {
    if (year && month && day) {
      const iso = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      onChange({ target: { name: 'dob', value: iso } });
      if (onAgeChange) onAgeChange(calcAge(year, month, day));
    } else {
      onChange({ target: { name: 'dob', value: '' } });
      if (onAgeChange) onAgeChange('');
    }
  }, [year, month, day]);  // eslint-disable-line

  const days  = Array.from({ length: maxDay }, (_, i) => i + 1);
  const years = Array.from({ length: currentYear - 1939 }, (_, i) => currentYear - i);
  const cls   = error ? 'dob-select error' : 'dob-select';

  return (
    <div className="form-group">
      <label>
        Date of Birth&nbsp;
        {required ? <span className="req">*</span> : <span className="optional">(optional)</span>}
      </label>

      <div className="dob-picker-row">
        {/* Day */}
        <select className={cls} value={day} onChange={e => setDay(e.target.value)}>
          <option value="">Day</option>
          {days.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        {/* Month */}
        <select className={cls} value={month} onChange={e => setMonth(e.target.value)}>
          <option value="">Month</option>
          {MONTHS.map((name, i) => (
            <option key={i + 1} value={i + 1}>{name}</option>
          ))}
        </select>

        {/* Year */}
        <select className={cls} value={year} onChange={e => setYear(e.target.value)}>
          <option value="">Year</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Computed age badge */}
      {year && month && day && (
        <div className="dob-age-badge">
          🎂 Age: <strong>{calcAge(year, month, day)} years</strong>
        </div>
      )}

      {error && <span className="form-error-msg">{error}</span>}
    </div>
  );
}
