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
import CardResume from './components/CardResume';
import AITextImageCard from './components/AITextImageCard';
import AIFaceSwapCard from './components/AIFaceSwapCard';
import ComboOfferPopup from './components/shared/ComboOfferPopup';
import FestivalCalendar from './components/FestivalCalendar/FestivalCalendar';
import FreeCardsPage from './components/FreeCardsPage/FreeCardsPage';
import useScreenshotProtection from './hooks/useScreenshotProtection';
import VisitorTracker from './components/shared/VisitorTracker';

const VALID_CARDS = ['birthday','anniversary','jagrata','biodata','wedding','resume','cardresume','festivalcards','holicard','holiwishes','holiwishes-en','holivideo','motivational','motivational-en','fathers','fathers-en','mothers','mothers-en','rentcard','saloncard','aitextimage','aifaceswap'];

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
  cardresume:        '/card-resume-maker',
  biodata:           '/marriage-biodata-maker',
  motivational:      '/motivational-quotes-images-download',
  'motivational-en': '/motivational-quotes-english',
  'mothers-en':      '/mothers-quotes-english',
  mothers:           '/mothers-quotes-hindi',
  fathers:           '/fathers-quotes-hindi',
  'fathers-en':      '/fathers-quotes-english',
  rentcard:          '/rent-card-maker',
  saloncard:         '/salon-card-maker',
  aitextimage:       '/ai-text-image-card',
  aifaceswap:        '/ai-themed-card-maker',
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

  /* ── Subscribe popup — shows once per session on any page ── */
  const [showSubscribePopup, setShowSubscribePopup] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('subscribePopupDismissed') !== 'true';
    }
    return true;
  });
  const [subEmail, setSubEmail] = useState('');
  const [subPhone, setSubPhone] = useState('');
  const [subName, setSubName] = useState('');
  const [subSending, setSubSending] = useState(false);
  const [subMsg, setSubMsg] = useState('');

  function dismissSubscribePopup() {
    setShowSubscribePopup(false);
    sessionStorage.setItem('subscribePopupDismissed', 'true');
  }

  async function handleSubscribe(e) {
    e.preventDefault();
    if (!subEmail.trim() && !subPhone.trim()) { setSubMsg('⚠️ Please enter email or phone.'); return; }
    setSubSending(true);
    setSubMsg('');
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'subscribe', email: subEmail.trim(), phone: subPhone.trim(), name: subName.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubMsg('✅ Subscribed! You\'ll get notified about new cards & festivals.');
        setSubEmail(''); setSubPhone(''); setSubName('');
        sessionStorage.setItem('subscribePopupDismissed', 'true');
      } else {
        setSubMsg('❌ ' + (data.error || 'Failed'));
      }
    } catch { setSubMsg('❌ Something went wrong.'); }
    finally { setSubSending(false); }
  }

  const subscribePopupJSX = showSubscribePopup ? (
    <div className="lp-subscribe-overlay" onClick={dismissSubscribePopup}>
      <div className="lp-subscribe-popup" onClick={e => e.stopPropagation()}>
        <button className="lp-subscribe-close" onClick={dismissSubscribePopup} aria-label="Close">✕</button>
        <div className="lp-subscribe-icon">🔔</div>
        <h2 className="lp-subscribe-title">Never Miss a New Card!</h2>
        <p className="lp-subscribe-desc">
          Subscribe to get notified when we add new card templates, festival offers, and exclusive deals — straight to your inbox.
        </p>
        <form className="lp-subscribe-form" onSubmit={handleSubscribe}>
          <div className="lp-subscribe-row">
            <input className="lp-subscribe-input" type="text" placeholder="Your name" value={subName} onChange={e => setSubName(e.target.value)} autoComplete="off" />
            <input className="lp-subscribe-input" type="email" placeholder="Email address *" value={subEmail} onChange={e => setSubEmail(e.target.value)} autoComplete="off" />
            <input className="lp-subscribe-input" type="tel" placeholder="WhatsApp / Phone" value={subPhone} onChange={e => setSubPhone(e.target.value)} autoComplete="off" />
          </div>
          <button className="lp-subscribe-btn" type="submit" disabled={subSending}>
            {subSending ? '⏳ Subscribing…' : '🔔 Subscribe Now — It\'s Free!'}
          </button>
          {subMsg && <p className={`lp-subscribe-msg ${subMsg.startsWith('✅') ? 'success' : 'warn'}`}>{subMsg}</p>}
        </form>
        <p className="lp-subscribe-privacy">
          📱 We&apos;ll notify you via <strong>Email</strong> &amp; <strong>WhatsApp</strong>. No spam, ever.
        </p>
      </div>
    </div>
  ) : null;

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

    if (selected === 'birthday')    return <>{subscribePopupJSX}<BirthdayCard    {...cardProps} /></>;
    if (selected === 'anniversary') return <>{subscribePopupJSX}<AnniversaryCard {...cardProps} /></>;
    if (selected === 'jagrata')     return <>{subscribePopupJSX}<JagrataCard     {...cardProps} /></>;
    if (selected === 'biodata')     return <>{subscribePopupJSX}<BiodataCard     {...cardProps} /></>;
    if (selected === 'wedding')     return <>{subscribePopupJSX}<WeddingCard     {...cardProps} /></>;
    if (selected === 'resume')      return <>{subscribePopupJSX}<ResumeCard      {...cardProps} /></>;
    if (selected === 'festivalcards') return <>{subscribePopupJSX}<FestivalCard    {...cardProps} initialFestival={festivalKey} /></>;
    if (selected === 'holicard')       return <>{subscribePopupJSX}<FestivalCard    lockedFestival="holi" {...cardProps} /></>;
    if (selected === 'holiwishes')     return <>{subscribePopupJSX}<HoliCard        {...cardProps} /></>;
    if (selected === 'holiwishes-en')  return <>{subscribePopupJSX}<HoliCardEnglish {...cardProps} /></>;
    if (selected === 'holivideo')       return <>{subscribePopupJSX}<HoliVideo        onBack={handleBack} /></>;
    if (selected === 'motivational')    return <>{subscribePopupJSX}<MotivationalCard  {...cardProps} /></>;
    if (selected === 'motivational-en')  return <>{subscribePopupJSX}<MotivationalCardEnglish {...cardProps} /></>;
    if (selected === 'fathers')            return <>{subscribePopupJSX}<FathersCard {...cardProps} /></>;
    if (selected === 'fathers-en')          return <>{subscribePopupJSX}<FathersCardEnglish {...cardProps} /></>;
    if (selected === 'mothers-en')           return <>{subscribePopupJSX}<MothersCard {...cardProps} /></>;
    if (selected === 'mothers')               return <>{subscribePopupJSX}<MothersCardHindi {...cardProps} /></>;
    if (selected === 'rentcard')              return <>{subscribePopupJSX}<RentCard          {...cardProps} /></>;
    if (selected === 'saloncard')             return <>{subscribePopupJSX}<SalonCard         {...cardProps} /></>;
    if (selected === 'cardresume')             return <>{subscribePopupJSX}<CardResume        {...cardProps} /></>;
    if (selected === 'aitextimage')            return <>{subscribePopupJSX}<AITextImageCard   {...cardProps} /></>;
    if (selected === 'aifaceswap')             return <>{subscribePopupJSX}<AIFaceSwapCard    {...cardProps} /></>;
  }

  /* ---------- Calendar full page ---------- */
  if (showCalendar) {
    return (
      <>
        {subscribePopupJSX}
        <FestivalCalendar
          onBack={() => setShowCalendar(false)}
          onFestivalClick={(f) => { setShowCalendar(false); setFestivalKey(f.key); setSelected(f.offerCard); }}
        />
      </>
    );
  }

  /* ---------- Free Cards full page ---------- */
  if (showFreeCards) {
    return (
      <>
        {subscribePopupJSX}
        <FreeCardsPage
          onBack={() => setShowFreeCards(false)}
          onSelectCard={(cardId) => { setShowFreeCards(false); if (!user) { /* guest auto-login handled in LoginScreen */ } setSelected(cardId); }}
        />
      </>
    );
  }

  /* ---------- Landing page — handles both logged-in and not-logged-in ---------- */
  return (
    <>
      {subscribePopupJSX}
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
