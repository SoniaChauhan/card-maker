import './SelectionScreen.css';
import Particles from '../shared/Particles';

const CARDS = [
  {
    id: 'birthday',
    label: 'Birthday Invite Designer',
    desc: 'Create personalised and stylish birthday party invitations with ease.',
    icon: '🎂',
    badge: '🎉 Festive & Fun',
  },
  {
    id: 'anniversary',
    label: 'Anniversary Greeting Designer',
    desc: 'Craft elegant anniversary greetings to celebrate love and togetherness.',
    icon: '💍',
    badge: '❤️ Romantic',
  },
  {
    id: 'jagrata',
    label: 'Spiritual Event Invitation',
    desc: 'Design serene and devotional invitations for spiritual gatherings.',
    icon: '🪔',
    badge: '🙏 Divine Blessing',
  },
  {
    id: 'biodata',
    label: 'Marriage Profile Card',
    desc: 'Build a traditional and detailed marriage biodata with a clean layout.',
    icon: '💍',
    badge: '🌸 Traditional & Elegant',
  },
  {
    id: 'wedding',
    label: 'Wedding Invite Designer',
    desc: 'Create royal and classic wedding invitations with beautiful themes.',
    icon: '💐',
    badge: '🌸 Royal & Classic',
  },
  {
    id: 'resume',
    label: 'Professional Resume Builder',
    desc: 'Design a polished resume and download it instantly in PDF format.',
    icon: '📄',
    badge: '💼 Professional',
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
