import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Free Birthday Invitation Maker Online | Create Birthday Cards with Photo',
  description:
    'Create beautiful birthday invitation cards online free. 50+ aesthetic birthday card templates with photo upload. Personalize for kids, adults, 1st birthday, 50th birthday. Preview & download instantly. Best free birthday card maker in India 2026.',
  keywords: [
    'birthday invitation maker', 'birthday card maker', 'free birthday card maker online',
    'birthday party invitation', 'birthday card designer', 'online birthday card maker',
    'free card maker online', 'birthday invitation maker free', 'aesthetic card templates',
    'kids birthday invitation', '1st birthday card', 'birthday card with photo',
    'जन्मदिन कार्ड बनाएं', 'birthday invitation online free', 'birthday card download',
    'birthday invitation templates free', 'happy birthday card maker',
  ],
  openGraph: {
    title: 'Free Birthday Invitation Maker | Create Birthday Cards Online',
    description: 'Create personalized birthday party invitations with 50+ beautiful templates. Add photos, customize & download free!',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Birthday Invitation Maker Free Online',
    description: 'Create stunning birthday cards with photo upload. 50+ templates. Download free!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/birthday-invitation-maker',
  },
  robots: { index: true, follow: true },
};

export default function BirthdayPage() {
  redirect('/?card=birthday');
}
