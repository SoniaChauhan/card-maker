import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'Holi Celebration Card Maker Online 2026 – Create & Download Holi Greeting Cards',
  description:
    'Create vibrant and colorful Holi celebration cards online. Customize with names, photos, messages, and festive templates. Download your Holi greeting card instantly.',
  keywords: [
    'holi card maker', 'holi celebration card', 'holi greeting card online',
    'create holi card', 'holi card download', 'holi card maker 2026',
    'custom holi card', 'holi wishes card maker', 'free holi card generator',
    'holi festival card',
  ],
  openGraph: {
    title: 'Holi Celebration Card Maker Online 2026',
    description: 'Create vibrant Holi greeting cards with custom names, photos & messages. Download instantly!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/holi-celebration-card',
  },
};

export default function HoliCardPage() {
  return <CardPage cardType="holicard" />;
}
