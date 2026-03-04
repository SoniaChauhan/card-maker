import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'Jagrata Invitation Card Maker – Create Devotional Mata Ki Chowki Invitations',
  description:
    'Create beautiful Jagrata and Mata Ki Chowki invitation cards online. Devotional designs with Hindi text support. Customizable templates, instant download. Jagrata card maker by Creative Thinker Design Hub.',
  keywords: [
    'jagrata invitation card', 'jagrata card maker', 'mata ki chowki invitation',
    'jagran invitation card online', 'devotional invitation card maker',
    'जागरण कार्ड', 'माता की चौकी निमंत्रण', 'jagrata card design',
  ],
  openGraph: {
    title: 'Jagrata Invitation Card Maker – Devotional Designs Online',
    description: 'Create beautiful Jagrata & Mata Ki Chowki invitation cards with devotional themes. Instant download!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/jagrata-invitation-card',
  },
};

export default function JagrataPage() {
  return <CardPage cardType="jagrata" />;
}
