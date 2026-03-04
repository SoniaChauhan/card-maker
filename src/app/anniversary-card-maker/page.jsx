import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Free Anniversary Card Maker Online | Wedding Anniversary Greetings',
  description:
    'Create elegant anniversary greeting cards online free. Beautiful templates for 25th, 50th, silver & golden wedding anniversary. Upload couple photos, add wishes & download instantly. Best anniversary card maker India.',
  keywords: [
    'anniversary card maker', 'anniversary greeting card', 'wedding anniversary card',
    'free anniversary card maker', '25th anniversary card', '50th anniversary card',
    'anniversary wishes card online', 'free card maker online', 'anniversary templates',
    'silver anniversary card', 'golden anniversary card', 'शादी की सालगिरह कार्ड',
    'marriage anniversary card maker', 'couple card maker',
  ],
  openGraph: {
    title: 'Free Anniversary Card Maker | Wedding Anniversary Cards Online',
    description: 'Create elegant anniversary greetings with couple photo upload. Beautiful templates & instant download!',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anniversary Card Maker Free Online',
    description: 'Create beautiful anniversary cards with photo upload. Download free!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/anniversary-card-maker',
  },
  robots: { index: true, follow: true },
};

export default function AnniversaryPage() {
  redirect('/?card=anniversary');
}
