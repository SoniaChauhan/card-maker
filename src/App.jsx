'use client';
import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { isAdmin }     from './services/authService';
import LoginScreen     from './components/LoginScreen/LoginScreen';
import ProfileDashboard from './components/ProfileDashboard/ProfileDashboard';
import BirthdayCard    from './components/BirthdayCard';
import AnniversaryCard from './components/AnniversaryCard';
import JagrataCard     from './components/JagrataCard';
import BiodataCard     from './components/BiodataCard';
import WeddingCard     from './components/WeddingCard';
import ResumeCard      from './components/ResumeCard';
import useScreenshotProtection from './hooks/useScreenshotProtection';

function AppContent() {
  const { user, loading } = useAuth();
  const [selected, setSelected] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null); // template object or null

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

  /* ---------- not logged in ---------- */
  if (!user) return <LoginScreen />;

  /* ---------- card screens ---------- */
  function handleBack() { setSelected(null); setEditingTemplate(null); }

  /** Called from MyTemplates when user clicks "Edit & Generate" */
  function handleEditTemplate(tpl) {
    setEditingTemplate(tpl);
    setSelected(tpl.cardType);
  }

  const cardProps = {
    onBack: handleBack,
    userEmail: user.email,
    isSuperAdmin: isAdmin(user.email),
    ...(editingTemplate ? { initialData: editingTemplate.formData, templateId: editingTemplate.id } : {}),
  };

  if (selected === 'birthday')    return <BirthdayCard    {...cardProps} />;
  if (selected === 'anniversary') return <AnniversaryCard {...cardProps} />;
  if (selected === 'jagrata')     return <JagrataCard     {...cardProps} />;
  if (selected === 'biodata')     return <BiodataCard     {...cardProps} />;
  if (selected === 'wedding')     return <WeddingCard     {...cardProps} />;
  if (selected === 'resume')      return <ResumeCard      {...cardProps} />;

  /* ---------- main dashboard ---------- */
  return <ProfileDashboard onSelect={setSelected} onEditTemplate={handleEditTemplate} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
