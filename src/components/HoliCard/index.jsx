'use client';
import './HoliCard.css';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';
import useDownload from '../../hooks/useDownload';
import { logDownload } from '../../services/downloadHistoryService';

const PARTICLES = ['🌈', '💜', '💛', '💚', '💙', '🎨', '✨', '🪷', '💗', '🎉', '🌸', '💐'];

export default function HoliCard({ onBack, userEmail }) {
  const filename = 'happy-holi-wishes.png';
  const { downloading, handleDownload, toast } = useDownload('holi-card-print', filename, {
    onSuccess: () => logDownload(userEmail, 'holi', 'Holi Wishes', 'Happy Holi Greeting', filename, {}).catch(() => {}),
  });

  return (
    <div className="holi-screen">
      <Particles icons={PARTICLES} count={32} />

      <div className="holi-screen-container">
        <p className="holi-screen-title">🌈 Happy Holi Wishes</p>
        <p className="holi-screen-subtitle">Click download to save this beautiful greeting card!</p>

        {/* ═══ The Card ═══ */}
        <div id="holi-card-print" className="holi-card">

          {/* Inner decorative border */}
          <div className="holi-inner-frame" />

          {/* Top color splashes */}
          <svg viewBox="0 0 400 100" className="holi-splash-top" aria-hidden="true">
            <circle cx="50" cy="40" r="35" fill="#ff6f91" opacity=".5" />
            <circle cx="120" cy="60" r="28" fill="#ffc75f" opacity=".45" />
            <circle cx="200" cy="30" r="40" fill="#a29bfe" opacity=".4" />
            <circle cx="280" cy="55" r="30" fill="#55efc4" opacity=".45" />
            <circle cx="350" cy="35" r="32" fill="#fd79a8" opacity=".5" />
            <circle cx="85" cy="80" r="18" fill="#74b9ff" opacity=".35" />
            <circle cx="320" cy="80" r="15" fill="#fdcb6e" opacity=".4" />
            <circle cx="160" cy="85" r="12" fill="#e17055" opacity=".3" />
            <circle cx="240" cy="75" r="14" fill="#00b894" opacity=".35" />
          </svg>

          {/* Big emoji */}
          <div className="holi-big-emoji">🌈</div>

          {/* Heading */}
          <h1 className="holi-heading">
            <span className="holi-h-letter" style={{ color: '#ff6f91' }}>H</span>
            <span className="holi-h-letter" style={{ color: '#ffc75f' }}>a</span>
            <span className="holi-h-letter" style={{ color: '#a29bfe' }}>p</span>
            <span className="holi-h-letter" style={{ color: '#55efc4' }}>p</span>
            <span className="holi-h-letter" style={{ color: '#fd79a8' }}>y</span>
            <span className="holi-h-space"> </span>
            <span className="holi-h-letter" style={{ color: '#74b9ff' }}>H</span>
            <span className="holi-h-letter" style={{ color: '#e17055' }}>o</span>
            <span className="holi-h-letter" style={{ color: '#fdcb6e' }}>l</span>
            <span className="holi-h-letter" style={{ color: '#00b894' }}>i</span>
            <span className="holi-h-letter" style={{ color: '#6c5ce7' }}>!</span>
          </h1>

          <div className="holi-subheading">होली की हार्दिक शुभकामनाएँ</div>

          {/* Divider */}
          <div className="holi-divider">
            <span className="holi-div-dot" style={{ background: '#ff6f91' }} />
            <span className="holi-div-dot" style={{ background: '#ffc75f' }} />
            <span className="holi-div-dot" style={{ background: '#a29bfe' }} />
            <span className="holi-div-line" />
            <span className="holi-div-dot" style={{ background: '#55efc4' }} />
            <span className="holi-div-dot" style={{ background: '#fd79a8' }} />
            <span className="holi-div-dot" style={{ background: '#74b9ff' }} />
          </div>

          {/* Message */}
          <div className="holi-message">
            <p>इस रंगों भरे त्योहार पर आपके घर में हंसी, प्यार और मिलन के रंग बिखरें।</p>
            <p>परिवार, दोस्तों और अपने प्रिय जनों के साथ बिताया गया हर पल आपकी यादों में एक खूबसूरत रंग की तरह बस जाए।</p>
            <p>गम और शिकायतों के रंग पीछे छूट जाएँ, और आपकी ज़िंदगी में सिर्फ खुशियों की रंगोली सजे।</p>
            <p className="holi-message-closing">ढेर सारी मिठाइयाँ, रंग और उमंग के साथ—<br />होली की हार्दिक शुभकामनाएँ! 🎉</p>
          </div>

          {/* Pichkari & Gulaal illustration */}
          <svg viewBox="0 0 300 80" className="holi-art-svg" aria-hidden="true">
            {/* Pichkari */}
            <rect x="60" y="30" width="70" height="12" rx="6" fill="#6c5ce7" opacity=".7" />
            <rect x="125" y="25" width="10" height="22" rx="3" fill="#a29bfe" opacity=".8" />
            <rect x="50" y="33" width="14" height="6" rx="3" fill="#6c5ce7" opacity=".5" />
            {/* Water spray */}
            <circle cx="145" cy="30" r="4" fill="#74b9ff" opacity=".5" />
            <circle cx="155" cy="25" r="3" fill="#74b9ff" opacity=".4" />
            <circle cx="160" cy="35" r="3.5" fill="#74b9ff" opacity=".35" />
            <circle cx="170" cy="28" r="2.5" fill="#74b9ff" opacity=".3" />
            {/* Gulaal bowls */}
            <ellipse cx="220" cy="55" rx="20" ry="10" fill="#e17055" opacity=".5" />
            <ellipse cx="220" cy="50" rx="15" ry="5" fill="#ff6b6b" opacity=".6" />
            <ellipse cx="260" cy="55" rx="16" ry="8" fill="#fdcb6e" opacity=".5" />
            <ellipse cx="260" cy="50" rx="12" ry="4" fill="#ffd700" opacity=".6" />
            {/* Floating gulaal puffs */}
            <circle cx="210" cy="30" r="8" fill="#ff6f91" opacity=".2" />
            <circle cx="235" cy="20" r="10" fill="#ffc75f" opacity=".15" />
            <circle cx="265" cy="25" r="7" fill="#a29bfe" opacity=".2" />
            <circle cx="250" cy="38" r="5" fill="#55efc4" opacity=".15" />
          </svg>

          {/* Bottom splashes */}
          <svg viewBox="0 0 400 60" className="holi-splash-bottom" aria-hidden="true">
            <circle cx="40" cy="25" r="20" fill="#55efc4" opacity=".4" />
            <circle cx="100" cy="35" r="16" fill="#fd79a8" opacity=".35" />
            <circle cx="170" cy="20" r="22" fill="#ffc75f" opacity=".35" />
            <circle cx="240" cy="40" r="18" fill="#74b9ff" opacity=".4" />
            <circle cx="310" cy="25" r="24" fill="#a29bfe" opacity=".35" />
            <circle cx="370" cy="35" r="16" fill="#ff6f91" opacity=".4" />
          </svg>
        </div>

        {/* ═══ Action buttons ═══ */}
        <div className="holi-actions">
          <button className="holi-btn-back" onClick={onBack}>← Back</button>
          <button className="holi-btn-download" onClick={handleDownload} disabled={downloading}>
            {downloading ? '⏳ Downloading…' : '⬇️ Download Card'}
          </button>
        </div>
      </div>

      <Toast text={toast.text} show={toast.show} />
    </div>
  );
}
