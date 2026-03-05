'use client';
import { useState } from 'react';
import './FreeCardsPage.css';
import { getActiveFestivals } from '../../utils/festivalCalendar';

const FREE_CARDS_HINDI = [
  { id: 'motivational',  icon: '💪', name: 'प्रेरणादायक विचार',      desc: 'प्रेरणादायक विचार — थीम चुनें, कस्टमाइज़ करें और डाउनलोड करें!', grad: 'linear-gradient(135deg, #0f0c29, #302b63)' },
  { id: 'fathers',       icon: '👨‍👧', name: 'पिता पर सुविचार',        desc: 'पिता के प्यार को शब्दों में — थीम चुनें और फ्री डाउनलोड करें!', grad: 'linear-gradient(135deg, #2d3436, #636e72)' },
  { id: 'mothers',       icon: '💐', name: 'माँ पर सुविचार',         desc: 'माँ के प्यार को शब्दों में — थीम चुनें और फ्री डाउनलोड करें!', grad: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)' },
];

const FREE_CARDS_ENGLISH = [
  { id: 'motivational-en', icon: '💪', name: 'Motivational Quotes',  desc: 'Inspiring English quotes — pick a theme, customize & download free!', grad: 'linear-gradient(135deg, #134e5e, #71b280)' },
  { id: 'fathers-en',      icon: '👨‍👧', name: "Father's Quotes",     desc: "Heartfelt father's quotes — pick a theme, customize & download free!", grad: 'linear-gradient(135deg, #0c3483, #a2b6df)' },
  { id: 'mothers-en',      icon: '💐', name: "Mother's Quotes",     desc: "Beautiful quotes celebrating a mother's love — customize & download free!", grad: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)' },
];

const TABS = [
  { key: 'hindi', label: '🇮🇳 हिन्दी', icon: '🇮🇳' },
  { key: 'english', label: '🌐 English', icon: '🌐' },
  { key: 'festival', label: '🎉 Festival', icon: '🎉' },
];

export default function FreeCardsPage({ onBack, onSelectCard }) {
  const [activeTab, setActiveTab] = useState('hindi');
  const activeFestivals = getActiveFestivals();

  /* Gather all festival free cards */
  const festivalFreeCards = [];
  activeFestivals.forEach(f => {
    if (f.freeCards?.length > 0) {
      f.freeCards.forEach(c => {
        festivalFreeCards.push({ ...c, festivalName: f.name, festivalIcon: f.icon });
      });
    }
  });

  function getCards() {
    if (activeTab === 'hindi') return FREE_CARDS_HINDI;
    if (activeTab === 'english') return FREE_CARDS_ENGLISH;
    if (activeTab === 'festival') return festivalFreeCards;
    return [];
  }

  const cards = getCards();

  return (
    <div className="fcp-page">
      {/* Top bar */}
      <div className="fcp-topbar">
        <button className="fcp-back-btn" onClick={onBack} aria-label="Go back">
          ← Back
        </button>
        <h1 className="fcp-page-title">🎁 Free Instant Cards</h1>
        <p className="fcp-page-sub">No form needed — just pick, customize colors & download instantly!</p>
      </div>

      {/* Tabs */}
      <div className="fcp-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`fcp-tab ${activeTab === tab.key ? 'fcp-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {tab.key === 'festival' && festivalFreeCards.length > 0 && (
              <span className="fcp-tab-badge">{festivalFreeCards.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="fcp-wrapper">
        {cards.length === 0 ? (
          <div className="fcp-empty">
            <span className="fcp-empty-icon">📭</span>
            <p className="fcp-empty-text">
              {activeTab === 'festival'
                ? 'No active festival free cards right now. Check back during festivals!'
                : 'No cards available in this category.'}
            </p>
          </div>
        ) : (
          <div className="fcp-grid">
            {cards.map(c => (
              <button
                key={c.id}
                className="fcp-card"
                style={{ background: c.grad }}
                type="button"
                onClick={() => onSelectCard(c.id)}
              >
                <span className="fcp-card-badge">FREE</span>
                <span className="fcp-card-icon">{c.icon}</span>
                <h3 className="fcp-card-name">{c.name}</h3>
                <p className="fcp-card-desc">{c.desc}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
