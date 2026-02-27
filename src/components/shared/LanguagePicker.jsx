'use client';
import { useState, useRef, useEffect } from 'react';

/**
 * Searchable language picker — replaces the basic <select> on all card screens.
 * @param {{ value: string, onChange: (code: string) => void, languages: Array<{code,label}> }} props
 */
export default function LanguagePicker({ value, onChange, languages }) {
  const [open,   setOpen]   = useState(false);
  const [search, setSearch] = useState('');
  const ref  = useRef(null);
  const inRef = useRef(null);

  const selected = languages.find(l => l.code === value) || languages[0];

  const filtered = search.trim()
    ? languages.filter(l => l.label.toLowerCase().includes(search.toLowerCase()))
    : languages;

  // Close on outside click
  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (open && inRef.current) inRef.current.focus();
  }, [open]);

  function select(code) {
    onChange(code);
    setOpen(false);
    setSearch('');
  }

  return (
    <div className="lp-wrap" ref={ref}>
      {/* Trigger button */}
      <button
        type="button"
        className="lp-trigger"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="lp-globe">🌐</span>
        <span className="lp-selected-label">{selected.label}</span>
        <span className={`lp-arrow ${open ? 'lp-arrow--up' : ''}`}>▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="lp-dropdown" role="listbox">
          {/* Search box */}
          <div className="lp-search-wrap">
            <span className="lp-search-icon">🔍</span>
            <input
              ref={inRef}
              type="text"
              className="lp-search"
              placeholder="Search language…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="lp-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          {/* Options */}
          <ul className="lp-list">
            {filtered.length === 0 && (
              <li className="lp-no-result">No language found</li>
            )}
            {filtered.map(l => (
              <li
                key={l.code}
                role="option"
                aria-selected={l.code === value}
                className={`lp-item ${l.code === value ? 'lp-item--active' : ''}`}
                onClick={() => select(l.code)}
              >
                {l.label}
                {l.code === value && <span className="lp-check">✓</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
