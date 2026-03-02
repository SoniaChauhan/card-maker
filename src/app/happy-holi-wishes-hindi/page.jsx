import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Happy Holi Wishes in Hindi 2026 – Free Holi Shayari Cards Download',
  description:
    'Download 50+ free Happy Holi wishes in Hindi. रंगों भरी होली शायरी, रोमांटिक होली मैसेज, भक्ति होली संदेश। Customize colors and download free Holi greeting cards instantly. होली की शुभकामनाएं।',
  keywords: [
    'happy holi wishes in hindi', 'holi shayari', 'holi wishes 2026',
    'होली की शुभकामनाएं', 'होली शायरी', 'holi greeting cards hindi',
    'romantic holi shayari', 'free holi cards download', 'holi wishes images',
    'होली विशेज इन हिंदी', 'holi messages hindi',
  ],
  openGraph: {
    title: 'Happy Holi Wishes in Hindi 2026 – Free Download',
    description: 'Download 50+ free Happy Holi shayari cards in Hindi. Customize colors & download instantly!',
  },
  alternates: {
    canonical: 'https://card-maker-soniachauhan.vercel.app/happy-holi-wishes-hindi',
  },
};

export default function HoliHindiPage() {
  redirect('/?card=holiwishes');
}
