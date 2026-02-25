import './SelectionScreen.css';
import Particles from '../shared/Particles';

const CARDS = [
  {
    id: 'birthday',
    label: 'Birthday Card',
    desc: 'Celebrate someone special with a colourful, personalised birthday card.',
    icon: '🎂',
    badge: '🎉 Festive & Fun',
  },
  {
    id: 'anniversary',
    label: 'Anniversary Card',
    desc: 'Honour a love story with an elegant romantic anniversary card.',
    icon: '💍',
    badge: '❤️ Romantic',
  },
  {
    id: 'jagrata',
    label: 'Jagrata Invitation',
    desc: 'Create a beautiful divine invitation for Khatushyam Ji Jagrata.',
    icon: '🪔',
    badge: '🙏 Divine Blessing',
  },
  {
    id: 'biodata',
    label: 'Marriage Biodata',
    desc: 'Create a traditional and elegant Indian marriage biodata with all details.',
    icon: '💍',
    badge: '🌸 Traditional & Elegant',
  },
];

const PARTICLES = ['⭐', '✨', '🌙', '💫', '🌟', '🎊', '🎉', '💖', '🌸', '💍'];

export default function SelectionScreen({ onSelect }) {
  return (
    <div className="selection-screen">
      <Particles icons={PARTICLES} count={28} />

      <div className="selection-header">
        <h1>✨ Card Maker</h1>
        <p>Choose an occasion and create a beautiful personalised card in minutes.</p>
      </div>

      <div className="cards-grid">
        {CARDS.map(card => (
          <div
            key={card.id}
            className={`card-option ${card.id}`}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(card.id)}
            onKeyDown={e => e.key === 'Enter' && onSelect(card.id)}
          >
            <span className="card-option-icon">{card.icon}</span>
            <h3>{card.label}</h3>
            <p>{card.desc}</p>
            <span className="card-option-badge">{card.badge}</span>
          </div>
        ))}
      </div>

      <p className="selection-footer">Tap a card type to get started →</p>
    </div>
  );
}
