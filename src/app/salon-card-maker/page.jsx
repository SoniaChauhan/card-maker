import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'Free Salon Price List Card Maker | Parlour Rate Card Designer Online',
  description:
    'Create professional salon price list cards and parlour rate cards online free. Beautiful templates for ladies salon, men salon, kids salon & unisex salons. Add services, prices & offers. Best salon card maker India 2026.',
  keywords: [
    'salon card maker', 'salon price list card maker', 'parlour rate card maker',
    'salon menu card design', 'beauty parlour card maker online', 'salon card design free',
    'salon price list template', 'hair salon price list maker', 'salon rate card online',
    'ladies salon card', 'men salon card', 'unisex salon card maker',
    'salon offer card', 'salon poster maker free', 'सैलून कार्ड', 'ब्यूटी पार्लर कार्ड',
    'salon menu maker', 'barber shop card maker',
  ],
  openGraph: {
    title: 'Salon Price List Card Maker | Parlour Rate Card Designer',
    description: 'Create stunning salon price list cards & parlour rate cards. Ladies, men & kids services. Download free!',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salon Card Maker Free Online',
    description: 'Create professional salon price list & rate cards. Download free!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/salon-card-maker',
  },
  robots: { index: true, follow: true },
};

export default function SalonCardPage() {
  return <CardPage cardType="saloncard" />;
}
