/**
 * FormField — reusable labelled input, textarea, or select field.
 *
 * @param {{
 *   label: string,
 *   name: string,
 *   type?: string,
 *   value: string,
 *   onChange: function,
 *   placeholder?: string,
 *   required?: boolean,
 *   error?: string,
 *   rows?: number,
 *   options?: Array<{ value: string, label: string }>,
 *   span?: boolean,
 *   min?: string,
 *   max?: string,
 * }} props
 */
export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  rows,
  options,
  span = false,
  min,
  max,
}) {
  const className = `form-group${span ? ' span-2' : ''}`;
  const inputClass = error ? 'error' : '';

  return (
    <div className={className}>
      <label htmlFor={name}>
        {label}{' '}
        {required ? <span className="req">*</span> : <span className="optional">(optional)</span>}
      </label>

      {options ? (
        <select id={name} name={name} value={value} onChange={onChange} className={inputClass}>
          <option value="">— Select —</option>
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : rows ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className={inputClass}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClass}
          min={min}
          max={max}
        />
      )}

      {error && <span className="err-msg">{error}</span>}
    </div>
  );
}
