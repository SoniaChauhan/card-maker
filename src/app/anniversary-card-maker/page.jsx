import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Anniversary Card Maker – Create Anniversary Greetings Online',
  description:
    'Craft elegant anniversary greetings to celebrate love and togetherness. 25th, 50th & wedding anniversary card templates. Upload couple photos, preview & download. Anniversary card maker by Creative Thinker Design Hub.',
  keywords: [
    'anniversary card maker', 'anniversary greeting card', 'wedding anniversary card',
    'free anniversary card maker', '25th anniversary card', '50th anniversary card',
    'anniversary wishes card online',
  ],
  openGraph: {
    title: 'Anniversary Card Maker – Create Anniversary Greetings Online',
    description: 'Craft elegant anniversary greetings with couple photo upload & instant download!',
  },
  alternates: {
    canonical: 'https://card-maker-soniachauhan.vercel.app/anniversary-card-maker',
  },
};

export default function AnniversaryPage() {
  redirect('/?card=anniversary');
}
