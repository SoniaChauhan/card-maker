import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'Free Invitation Card Maker Online | Birthday, Wedding & Event Invitations',
  description:
    'Create free invitation cards online for any occasion - birthdays, weddings, anniversaries, religious events, baby showers. 100+ aesthetic card templates in Hindi & English. Customizable designs, instant download. Best free card maker online India.',
  keywords: [
    'invitation card maker', 'invitation maker online', 'free invitation maker',
    'online invitation maker free', 'digital invitation card maker', 'free card maker online',
    'party invitation maker', 'event invitation card creator', 'invitation card design',
    'aesthetic card templates', 'invitation templates free download',
    'निमंत्रण पत्र', 'invitation card maker india', 'e-invitation maker',
    'whatsapp invitation maker', 'digital invite creator',
  ],
  openGraph: {
    title: 'Free Invitation Card Maker | 100+ Templates for Every Occasion',
    description: 'Create free invitation cards for birthdays, weddings, parties & more. 100+ aesthetic templates, instant download!',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Invitation Maker',
    description: 'Create stunning invitations for any event. 100+ templates. Download free!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/invitation-card-maker',
  },
  robots: { index: true, follow: true },
};

export default function InvitationPage() {
  return <CardPage />;
}
