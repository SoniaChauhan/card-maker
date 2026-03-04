import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Free Greeting Card Maker Online | Cards for All Occasions 2026',
  description:
    'Create free greeting cards online for festivals, birthdays, anniversaries, Holi, Diwali, Eid, Christmas & more. 100+ aesthetic card templates with instant download. Best free card maker online India.',
  keywords: [
    'greeting card maker', 'greeting card maker online', 'free greeting card maker',
    'online greeting card maker free', 'greeting card design', 'free card maker online',
    'festival greeting card maker', 'greeting card creator', 'aesthetic card templates',
    'greeting card templates free', 'e-greeting card maker', 'ग्रीटिंग कार्ड',
  ],
  openGraph: {
    title: 'Free Greeting Card Maker | Cards for All Occasions',
    description: 'Create beautiful greeting cards for festivals, birthdays & more. 100+ aesthetic templates, instant download!',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Greeting Card Maker Online',
    description: 'Create stunning greeting cards. 100+ templates. Download free!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/greeting-card-maker',
  },
  robots: { index: true, follow: true },
};

export default function GreetingCardPage() {
  redirect('/');
}
