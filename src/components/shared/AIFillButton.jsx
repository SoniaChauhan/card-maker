/**
 * AIFillButton — shared "✨ Fill with AI" button for card forms.
 */
export default function AIFillButton({ onClick, generating, error }) {
  return (
    <div className="ai-fill-section">
      <button
        type="button"
        className="btn-ai-fill"
        onClick={onClick}
        disabled={generating}
      >
        {generating ? (
          <>
            <span className="ai-spinner" />
            AI is writing…
          </>
        ) : (
          '✨ Fill with AI'
        )}
      </button>
      <span className="ai-fill-hint">
        {generating ? 'Please wait a few seconds' : 'Let AI write the message for you'}
      </span>
      {error && <p className="ai-fill-error">⚠ {error}</p>}
    </div>
  );
}
