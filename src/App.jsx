import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginScreen     from './components/LoginScreen/LoginScreen';
import ProfileDashboard from './components/ProfileDashboard/ProfileDashboard';
import BirthdayCard    from './components/BirthdayCard';
import AnniversaryCard from './components/AnniversaryCard';
import JagrataCard     from './components/JagrataCard';
import BiodataCard     from './components/BiodataCard';
import WeddingCard     from './components/WeddingCard';
import ResumeCard      from './components/ResumeCard';

function AppContent() {
  const { user, loading } = useAuth();
  const [selected, setSelected] = useState(null);

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
  function handleBack() { setSelected(null); }

  if (selected === 'birthday')    return <BirthdayCard    onBack={handleBack} />;
  if (selected === 'anniversary') return <AnniversaryCard onBack={handleBack} />;
  if (selected === 'jagrata')     return <JagrataCard     onBack={handleBack} />;
  if (selected === 'biodata')     return <BiodataCard     onBack={handleBack} />;
  if (selected === 'wedding')     return <WeddingCard     onBack={handleBack} />;
  if (selected === 'resume')      return <ResumeCard      onBack={handleBack} />;

  /* ---------- main dashboard ---------- */
  return <ProfileDashboard onSelect={setSelected} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
