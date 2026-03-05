import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'Free PG & Rent Card Maker Online | Room for Rent Advertisement Card',
  description:
    'Create professional PG, room for rent, and flat for rent advertisement cards online free. Beautiful templates with amenities, features & contact details. Best rent card maker India 2026. Download instantly!',
  keywords: [
    'rent card maker', 'PG advertisement card maker', 'room for rent card',
    'flat for rent poster', 'pg card maker online', 'rent poster maker free',
    'room available poster', 'paying guest card maker', 'rental advertisement',
    'rent card design online', 'pg room advertisement template', 'किराये का कमरा',
    'PG room card', 'room rent poster free', 'free rent card maker online',
    'rent notice maker', 'accommodation card maker',
  ],
  openGraph: {
    title: 'PG & Rent Card Maker | Room for Rent Advertisement Cards',
    description: 'Create beautiful PG & rent advertisement cards with amenities, features & contact details. Download free!',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PG Rent Card Maker Free Online',
    description: 'Create stunning rent and PG advertisement cards. Download free!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/rent-card-maker',
  },
  robots: { index: true, follow: true },
};

export default function RentCardPage() {
  return <CardPage cardType="rentcard" />;
}
