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
import useScreenshotProtection from './hooks/useScreenshotProtection';
import VisitorTracker from './components/shared/VisitorTracker';

const VALID_CARDS = ['birthday','anniversary','jagrata','biodata','wedding','resume','festivalcards','holicard','holiwishes','holiwishes-en','motivational','motivational-en','fathers','fathers-en'];

function AppContent() {
  const { user, loading, isGuest } = useAuth();
  const [selected, setSelected] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);

  /* Auto-select card when redirected from SEO pages via ?card= query param */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const card = params.get('card');
    if (card && VALID_CARDS.includes(card)) {
      setSelected(card);
      // Clean up URL without reload
      window.history.replaceState({}, '', '/');
    }
  }, []);

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
  function handleBack() { setSelected(null); setEditingTemplate(null); }

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
    if (selected === 'festivalcards') return <FestivalCard    {...cardProps} />;
    if (selected === 'holicard')       return <FestivalCard    lockedFestival="holi" {...cardProps} />;
    if (selected === 'holiwishes')     return <HoliCard        {...cardProps} />;
    if (selected === 'holiwishes-en')  return <HoliCardEnglish {...cardProps} />;
    if (selected === 'motivational')    return <MotivationalCard  {...cardProps} />;
    if (selected === 'motivational-en')  return <MotivationalCardEnglish {...cardProps} />;
    if (selected === 'fathers')            return <FathersCard {...cardProps} />;
    if (selected === 'fathers-en')          return <FathersCardEnglish {...cardProps} />;
  }

  /* ---------- Landing page — handles both logged-in and not-logged-in ---------- */
  return <LoginScreen onSelect={setSelected} onEditTemplate={handleEditTemplate} />;
}

export default function App() {
  return (
    <AuthProvider>
      <VisitorTracker />
      <AppContent />
    </AuthProvider>
  );
}
