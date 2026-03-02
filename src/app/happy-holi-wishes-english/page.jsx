import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Happy Holi Wishes in English 2026 – Free Holi Messages & Cards Download',
  description:
    'Download 47 beautiful Happy Holi wishes in English. Romantic, inspirational, family-friendly Holi messages. Customize colors and download free Holi greeting cards instantly.',
  keywords: [
    'happy holi wishes in english', 'holi wishes english', 'holi messages',
    'romantic holi wishes english', 'holi greeting cards english',
    'free holi cards download', 'holi wishes 2026', 'happy holi 2026',
    'holi quotes english', 'holi wishes for love',
  ],
  openGraph: {
    title: 'Happy Holi Wishes in English 2026 – Free Download',
    description: 'Download 47 beautiful English Holi messages. Customize colors & download free!',
  },
  alternates: {
    canonical: 'https://card-maker-soniachauhan.vercel.app/happy-holi-wishes-english',
  },
};

export default function HoliEnglishPage() {
  redirect('/?card=holiwishes-en');
}
