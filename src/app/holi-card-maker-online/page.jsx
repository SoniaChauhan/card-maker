import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Holi Card Maker Online – Create Free Holi Greeting Cards 2026',
  description:
    'Create beautiful Holi greeting cards online free. 50+ Hindi Holi shayaris, 47 English Holi messages. Customize colors, add your name, and download free Holi cards instantly. Best Holi card maker online.',
  keywords: [
    'holi card maker', 'holi card maker online', 'free holi card maker',
    'holi greeting card maker', 'holi wishes card maker', 'happy holi card maker',
    'holi card download free', 'होली कार्ड बनाएं', 'holi card 2026',
  ],
  openGraph: {
    title: 'Holi Card Maker Online – Free Holi Greeting Cards 2026',
    description: 'Create free Holi greeting cards with 50+ shayaris & messages. Customize & download instantly!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/holi-card-maker-online',
  },
};

export default function HoliCardMakerPage() {
  redirect('/?card=holiwishes');
}
