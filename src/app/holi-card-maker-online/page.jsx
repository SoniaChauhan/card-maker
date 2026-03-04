import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'Free Holi Card Maker Online | Holi Card Templates 2026 Download',
  description:
    'Create beautiful Holi greeting cards online free. 50+ Hindi Holi shayaris, 47 English Holi messages. Holi card templates with customizable colors. Add your name & download free Holi cards instantly. Best Holi card maker online 2026.',
  keywords: [
    'holi card maker', 'holi card maker online', 'free holi card maker',
    'holi greeting card maker', 'holi wishes card maker', 'happy holi card maker',
    'holi card download free', 'होली कार्ड बनाएं', 'holi card 2026',
    'holi card templates', 'holi templates free download', 'holi invitation card',
    'holi greeting templates', 'free card maker online', 'aesthetic card templates',
  ],
  openGraph: {
    title: 'Free Holi Card Maker | Holi Templates 2026',
    description: 'Create free Holi greeting cards with 50+ shayaris & messages. Beautiful templates, instant download!',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Holi Card Maker Free Online 2026',
    description: 'Create stunning Holi cards with 50+ templates. Download free!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/holi-card-maker-online',
  },
  robots: { index: true, follow: true },
};

export default function HoliCardMakerPage() {
  return <CardPage cardType="holiwishes" />;
}
