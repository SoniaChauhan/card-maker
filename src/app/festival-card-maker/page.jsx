import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Free Festival Card Maker | Diwali, Holi, Eid, Christmas Cards Online',
  description:
    'Create festive greeting cards for all occasions free — Diwali, Holi, Eid, Christmas, Navratri, Raksha Bandhan, Lohri & more. 100+ aesthetic card templates with instant download. Best festival card maker India 2026.',
  keywords: [
    'festival card maker', 'diwali card maker', 'eid card maker',
    'christmas card maker', 'navratri card', 'raksha bandhan card',
    'festival greeting cards', 'free festival cards online', 'free card maker online',
    'aesthetic card templates', 'diwali templates', 'holi templates',
    'दीपावली कार्ड', 'ईद कार्ड', 'festival invite maker',
  ],
  openGraph: {
    title: 'Free Festival Card Maker | Diwali, Holi, Eid, Christmas',
    description: 'Create festive greeting cards for Diwali, Holi, Eid, Christmas & more. 100+ templates, download free!',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Festival Card Maker Free Online',
    description: 'Create beautiful festival cards for any occasion. Download free!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/festival-card-maker',
  },
  robots: { index: true, follow: true },
};

export default function FestivalPage() {
  redirect('/?card=festivalcards');
}
