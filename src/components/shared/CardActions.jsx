/**
 * CardActions — row of buttons shown beneath a card preview.
 */
export default function CardActions({
  onEdit, onBack, onDownload, downloading, dlBtnStyle = {}, dlLabel,
}) {
  return (
    <div className="card-actions">
      <button className="btn-back-card" onClick={onEdit}>✏️ Edit Details</button>
      <button className="btn-back-card outline" onClick={onBack}>🏠 Choose Another</button>

      <button
        className="btn-download"
        onClick={onDownload}
        disabled={downloading}
        style={dlBtnStyle}
      >
        {downloading ? '⏳ Saving…' : (dlLabel || '⬇️ Download Card')}
      </button>
    </div>
  );
}
