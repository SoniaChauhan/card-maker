'use client';
import { useState } from 'react';
import './SelectionScreen.css';
import Particles from '../shared/Particles';
import Toast from '../shared/Toast';

/* ─── Card catalogue grouped by category ─── */
const CATEGORIES = [
  {
    title: '⭐ Featured',
    id: 'featured',
    cards: [
      { id: 'birthday',    label: 'Birthday Invite Designer',      desc: 'Create personalised and stylish birthday party invitations with ease.',       icon: '🎂', badge: '🎉 Festive & Fun' },
      { id: 'wedding',     label: 'Wedding Invite Designer',       desc: 'Create royal and classic wedding invitations with beautiful themes.',          icon: '💐', badge: '🌸 Royal & Classic' },
      { id: 'anniversary', label: 'Anniversary Greeting Designer', desc: 'Craft elegant anniversary greetings to celebrate love and togetherness.',     icon: '💍', badge: '❤️ Romantic' },
    ],
  },
  {
    title: '👨‍👩‍👧 Family & Life Events',
    id: 'family',
    cards: [
      { id: 'babyshower',    label: 'Baby Shower',           desc: 'Design adorable invitations for a joyful baby shower celebration.',        icon: '🍼', badge: '👶 Sweet & Cute',   comingSoon: true },
      { id: 'namingceremony',label: 'Naming Ceremony',       desc: 'Create elegant naming ceremony invitations with cultural themes.',         icon: '🪷', badge: '✨ Traditional',     comingSoon: true },
      { id: 'housewarming',  label: 'Housewarming',          desc: 'Welcome guests to your new home with a warm invitation card.',              icon: '🏠', badge: '🏡 Warm Welcome',   comingSoon: true },
      { id: 'graduation',    label: 'Graduation / Farewell', desc: 'Celebrate academic milestones with stylish graduation invitations.',       icon: '🎓', badge: '🎓 Achievement',    comingSoon: true },
    ],
  },
  {
    title: '💒 Wedding Functions',
    id: 'weddingfns',
    cards: [
      { id: 'haldi',       label: 'Haldi',        desc: 'Bright and cheerful Haldi ceremony invitation cards.',                      icon: '💛', badge: '💛 Vibrant',    comingSoon: true },
      { id: 'mehendi',     label: 'Mehendi',       desc: 'Beautiful Mehendi night invitation with intricate design vibes.',           icon: '🌿', badge: '🌿 Artistic',   comingSoon: true },
      { id: 'sangeet',     label: 'Sangeet',       desc: 'Create fun and musical Sangeet night invitation cards.',                   icon: '🎶', badge: '🎵 Musical',    comingSoon: true },
      { id: 'reception',   label: 'Reception',     desc: 'Design elegant reception party invitations for the big day.',              icon: '🥂', badge: '🥂 Grand',      comingSoon: true },
      { id: 'savethedate', label: 'Save the Date', desc: 'Send gorgeous Save the Date cards to your loved ones.',                   icon: '📅', badge: '💌 Romantic',    comingSoon: true },
    ],
  },
  {
    title: '🙏 Spiritual & Religious',
    id: 'spiritual',
    cards: [
      { id: 'jagrata',      label: 'Jagrata',             desc: 'Design serene and devotional invitations for Jagrata gatherings.',    icon: '🪔', badge: '🙏 Divine Blessing' },
      { id: 'satyanarayan', label: 'Satyanarayan Katha',  desc: 'Create sacred invitations for Satyanarayan Katha pooja.',            icon: '🙏', badge: '🕉️ Sacred',          comingSoon: true },
      { id: 'garba',        label: 'Garba / Navratri',    desc: 'Colourful Garba and Navratri celebration invitation cards.',          icon: '💃', badge: '🔴 Festive',          comingSoon: true },
    ],
  },
  {
    title: '💼 Professional & Documents',
    id: 'professional',
    cards: [
      { id: 'resume',       label: 'Resume Builder',  desc: 'Design a polished resume and download it instantly in PDF format.',    icon: '📄', badge: '💼 Professional' },
      { id: 'biodata',      label: 'Marriage Profile', desc: 'Build a traditional and detailed marriage biodata with a clean layout.', icon: '💍', badge: '🌸 Traditional' },
      { id: 'visitingcard', label: 'Visiting Card',    desc: 'Design sleek and modern visiting cards for professionals.',            icon: '🪪', badge: '🏢 Modern',     comingSoon: true },
      { id: 'businessdocs', label: 'Business Docs',    desc: 'Create professional business documents and letterheads.',             icon: '📋', badge: '📊 Corporate',   comingSoon: true },
    ],
  },
  {
    title: '💌 Greeting Cards',
    id: 'greetings',
    cards: [
      { id: 'thankyou',        label: 'Thank You',       desc: 'Express gratitude with elegant and heartfelt thank you cards.',        icon: '🙏', badge: '💗 Heartfelt',    comingSoon: true },
      { id: 'congratulations', label: 'Congratulations', desc: 'Celebrate achievements with vibrant congratulations cards.',           icon: '🎊', badge: '🎉 Celebratory',  comingSoon: true },
      { id: 'goodluck',        label: 'Good Luck',       desc: 'Send warm good luck wishes with charming card designs.',               icon: '🍀', badge: '🌟 Wishes',       comingSoon: true },
      { id: 'festivalcards',   label: 'Festival Cards',  desc: 'Create festive cards for Diwali, Holi, Eid, Christmas and more.',     icon: '🎆', badge: '🪔 Festive',      comingSoon: true },
    ],
  },
  {
    title: '📱 Social Media',
    id: 'social',
    cards: [
      { id: 'whatsappinvites', label: 'WhatsApp Invites',          desc: 'Create WhatsApp-optimised invitation cards ready to share.',    icon: '💬', badge: '📲 Shareable', comingSoon: true },
      { id: 'instagramstory',  label: 'Instagram Story Templates', desc: 'Design eye-catching Instagram story templates for events.',     icon: '📸', badge: '📷 Trendy',    comingSoon: true },
      { id: 'socialevent',     label: 'Social Event Cards',        desc: 'Create shareable event cards for social media platforms.',      icon: '🌐', badge: '🔗 Social',    comingSoon: true },
    ],
  },
];

const PARTICLES = ['⭐', '✨', '🌙', '💫', '🌟', '🎊', '🎉', '💖', '🌸', '💍'];

export default function SelectionScreen({ onSelect }) {
  const [toast, setToast] = useState({ show: false, text: '' });

  function handleClick(card) {
    if (card.comingSoon) {
      setToast({ show: true, text: `🚀 "${card.label}" is coming soon! Stay tuned.` });
      setTimeout(() => setToast({ show: false, text: '' }), 2500);
      return;
    }
    onSelect(card.id);
  }

  return (
    <div className="selection-screen">
      <Particles icons={PARTICLES} count={28} />

      <div className="selection-header">
        <h1>✨ Card Maker</h1>
        <p>Choose an occasion and create a beautiful personalised card in minutes.</p>
      </div>

      <div className="categories-wrapper">
        {CATEGORIES.map(cat => (
          <section key={cat.id} className="card-category">
            <h2 className="category-title">{cat.title}</h2>
            <div className="cards-grid">
              {cat.cards.map(card => (
                <div
                  key={card.id}
                  className={`card-option ${card.id}${card.comingSoon ? ' coming-soon' : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleClick(card)}
                  onKeyDown={e => e.key === 'Enter' && handleClick(card)}
                >
                  {card.comingSoon && <span className="coming-soon-tag">🔒 Coming Soon</span>}
                  <span className="card-option-icon">{card.icon}</span>
                  <h3>{card.label}</h3>
                  <p>{card.desc}</p>
                  <span className="card-option-badge">{card.badge}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="selection-footer">Tap a card type to get started →</p>
      <Toast text={toast.text} show={toast.show} />
    </div>
  );
}

/* Export flat card list for other components */
export const ALL_CARDS = CATEGORIES.flatMap(c => c.cards);
export { CATEGORIES };
