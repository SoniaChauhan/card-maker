import { useState } from 'react';
import SelectionScreen from './components/SelectionScreen/SelectionScreen';
import BirthdayCard    from './components/BirthdayCard';
import AnniversaryCard from './components/AnniversaryCard';
import JagrataCard     from './components/JagrataCard';
import BiodataCard     from './components/BiodataCard';

export default function App() {
  const [selected, setSelected] = useState(null);

  function handleBack() { setSelected(null); }

  if (selected === 'birthday')    return <BirthdayCard    onBack={handleBack} />;
  if (selected === 'anniversary') return <AnniversaryCard onBack={handleBack} />;
  if (selected === 'jagrata')     return <JagrataCard     onBack={handleBack} />;
  if (selected === 'biodata')     return <BiodataCard     onBack={handleBack} />;

  return <SelectionScreen onSelect={setSelected} />;
}
