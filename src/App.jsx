'use client';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { isAdmin }     from './services/authService';
import LoginScreen     from './components/LoginScreen/LoginScreen';
import BirthdayCard    from './components/BirthdayCard';
import AnniversaryCard from './components/AnniversaryCard';
import JagrataCard     from './components/JagrataCard';
import BiodataCard     from './components/BiodataCard';
import WeddingCard     from './components/WeddingCard';
import ResumeCard      from './components/ResumeCard';
import FestivalCard    from './components/FestivalCard';
import HoliCard        from './components/HoliCard';
import HoliCardEnglish from './components/HoliCardEnglish';
import MotivationalCard from './components/MotivationalCard';
import MotivationalCardEnglish from './components/MotivationalCardEnglish';
import FathersCard from './components/FathersCard';
import FathersCardEnglish from './components/FathersCardEnglish';
import MothersCard from './components/MothersCard';
import MothersCardHindi from './components/MothersCardHindi';
import HoliVideo from './components/HoliVideo';
import RentCard from './components/RentCard';
import SalonCard from './components/SalonCard';
import ComboOfferPopup from './components/shared/ComboOfferPopup';
import FestivalCalendar from './components/FestivalCalendar/FestivalCalendar';
import FreeCardsPage from './components/FreeCardsPage/FreeCardsPage';
import useScreenshotProtection from './hooks/useScreenshotProtection';
import VisitorTracker from './components/shared/VisitorTracker';

const VALID_CARDS = ['birthday','anniversary','jagrata','biodata','wedding','resume','festivalcards','holicard','holiwishes','holiwishes-en','holivideo','motivational','motivational-en','fathers','fathers-en','mothers','mothers-en','rentcard','saloncard'];

/* ── Card ID → SEO-friendly URL slug mapping ── */
const CARD_URL_MAP = {
  birthday:          '/birthday-invitation-maker',
  wedding:           '/wedding-card-maker',
  anniversary:       '/anniversary-card-maker',
  festivalcards:     '/festival-card-maker',
  holicard:          '/holi-card-maker-online',
  holiwishes:        '/happy-holi-wishes-hindi',
  'holiwishes-en':   '/happy-holi-wishes-english',
  holivideo:         '/holi-celebration-card',
  jagrata:           '/jagrata-invitation-card',
  resume:            '/resume-builder-online',
  biodata:           '/marriage-biodata-maker',
  motivational:      '/motivational-quotes-images-download',
  'motivational-en': '/motivational-quotes-english',
  'mothers-en':      '/mothers-quotes-english',
  mothers:           '/mothers-quotes-hindi',
  fathers:           '/fathers-quotes-hindi',
  'fathers-en':      '/fathers-quotes-english',
  rentcard:          '/rent-card-maker',
  saloncard:         '/salon-card-maker',
};

/* Reverse map: URL slug → card ID */
const URL_CARD_MAP = Object.fromEntries(
  Object.entries(CARD_URL_MAP).map(([k, v]) => [v, k])
);

function AppContent({ initialCard }) {
  const { user, loading, isGuest } = useAuth();
  const [selected, setSelected] = useState(initialCard || null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showCombo, setShowCombo] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showFreeCards, setShowFreeCards] = useState(false);
  const [festivalKey, setFestivalKey] = useState(null);

  /* Auto-select card when redirected from SEO pages via ?card= query param (legacy support) */
  useEffect(() => {
    if (initialCard) return; // Skip if already set via prop
    const params = new URLSearchParams(window.location.search);
    const card = params.get('card');
    if (card && VALID_CARDS.includes(card)) {
      setSelected(card);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [initialCard]);

  /* ── Sync URL when card is selected/deselected ── */
  useEffect(() => {
    if (initialCard) return; // SEO route pages manage their own URL
    if (selected) {
      const slug = CARD_URL_MAP[selected];
      if (slug && window.location.pathname !== slug) {
        window.history.pushState({ card: selected }, '', slug);
      }
    } else if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
  }, [selected, initialCard]);

  /* ── Handle browser back/forward navigation ── */
  useEffect(() => {
    if (initialCard) return;
    function onPopState() {
      const path = window.location.pathname;
      const cardId = URL_CARD_MAP[path];
      setSelected(cardId || null);
      setEditingTemplate(null);
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [initialCard]);

  /* Activate screenshot protection globally */
  useScreenshotProtection();

  /* ---------- loading splash ---------- */
  if (loading)
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: 'linear-gradient(135deg,#667eea,#764ba2)',
        color: '#fff', fontSize: '1.2rem', fontFamily: 'inherit',
      }}>
        ⏳ Loading…
      </div>
    );

  /* ---------- card screens ---------- */
  function handleBack() {
    setSelected(null);
    setEditingTemplate(null);
    setFestivalKey(null);
    if (!initialCard && window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
    }
  }

  /** Called from MyTemplates when user clicks "Edit & Generate" */
  function handleEditTemplate(tpl) {
    setEditingTemplate(tpl);
    setSelected(tpl.cardType);
  }

  if (selected && user) {
    const initData = editingTemplate
      ? editingTemplate.formData
      : undefined;

    const cardProps = {
      onBack: handleBack,
      userEmail: isGuest ? '' : user.email,
      isSuperAdmin: !isGuest && isAdmin(user.email),
      ...(editingTemplate ? { initialData: initData, templateId: editingTemplate.id } : initData ? { initialData: initData } : {}),
    };

    if (selected === 'birthday')    return <BirthdayCard    {...cardProps} />;
    if (selected === 'anniversary') return <AnniversaryCard {...cardProps} />;
    if (selected === 'jagrata')     return <JagrataCard     {...cardProps} />;
    if (selected === 'biodata')     return <BiodataCard     {...cardProps} />;
    if (selected === 'wedding')     return <WeddingCard     {...cardProps} />;
    if (selected === 'resume')      return <ResumeCard      {...cardProps} />;
    if (selected === 'festivalcards') return <FestivalCard    {...cardProps} initialFestival={festivalKey} />;
    if (selected === 'holicard')       return <FestivalCard    lockedFestival="holi" {...cardProps} />;
    if (selected === 'holiwishes')     return <HoliCard        {...cardProps} />;
    if (selected === 'holiwishes-en')  return <HoliCardEnglish {...cardProps} />;
    if (selected === 'holivideo')       return <HoliVideo        onBack={handleBack} />;
    if (selected === 'motivational')    return <MotivationalCard  {...cardProps} />;
    if (selected === 'motivational-en')  return <MotivationalCardEnglish {...cardProps} />;
    if (selected === 'fathers')            return <FathersCard {...cardProps} />;
    if (selected === 'fathers-en')          return <FathersCardEnglish {...cardProps} />;
    if (selected === 'mothers-en')           return <MothersCard {...cardProps} />;
    if (selected === 'mothers')               return <MothersCardHindi {...cardProps} />;
    if (selected === 'rentcard')              return <RentCard          {...cardProps} />;
    if (selected === 'saloncard')             return <SalonCard         {...cardProps} />;
  }

  /* ---------- Calendar full page ---------- */
  if (showCalendar) {
    return (
      <FestivalCalendar
        onBack={() => setShowCalendar(false)}
        onFestivalClick={(f) => { setShowCalendar(false); setFestivalKey(f.key); setSelected(f.offerCard); }}
      />
    );
  }

  /* ---------- Free Cards full page ---------- */
  if (showFreeCards) {
    return (
      <FreeCardsPage
        onBack={() => setShowFreeCards(false)}
        onSelectCard={(cardId) => { setShowFreeCards(false); if (!user) { /* guest auto-login handled in LoginScreen */ } setSelected(cardId); }}
      />
    );
  }

  /* ---------- Landing page — handles both logged-in and not-logged-in ---------- */
  return (
    <>
      <LoginScreen onSelect={setSelected} onSelectFestival={setFestivalKey} onEditTemplate={handleEditTemplate} onOpenCombo={() => setShowCombo(true)} onOpenCalendar={() => setShowCalendar(true)} onOpenFreeCards={() => setShowFreeCards(true)} />
      {showCombo && (
        <ComboOfferPopup
          userEmail={isGuest ? '' : user?.email || ''}
          userName={user?.displayName || ''}
          onClose={() => setShowCombo(false)}
          onComboDone={(result) => {
            setShowCombo(false);
            alert(`🎉 Combo Pack activated! You now have 15-day access to ${result.comboCards?.join(' + ')}. Enjoy unlimited downloads!`);
          }}
        />
      )}
    </>
  );
}

export default function App({ initialCard }) {
  return (
    <AuthProvider>
      <VisitorTracker />
      <AppContent initialCard={initialCard} />
    </AuthProvider>
  );
}
