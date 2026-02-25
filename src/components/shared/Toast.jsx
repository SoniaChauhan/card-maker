/**
 * Toast — slide-up notification bar.
 * @param {{ text: string, show: boolean }} props
 */
export default function Toast({ text, show }) {
  return (
    <div className={`toast ${show ? 'show' : ''}`}>
      {text}
    </div>
  );
}
