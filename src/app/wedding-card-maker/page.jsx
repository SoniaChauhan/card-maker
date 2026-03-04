import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Free Wedding Card Maker Online | Wedding Invitation Design Templates',
  description:
    'Create stunning wedding invitations online free. Royal Hindu, Muslim, Christian & Sikh wedding card templates. Wedding card design online free with photo upload. Multi-language support in Hindi & English. Best marriage card maker India 2026.',
  keywords: [
    'wedding card maker', 'wedding invitation maker', 'online wedding card maker',
    'free wedding card design', 'hindu wedding card', 'शादी का कार्ड',
    'marriage card maker online', 'wedding invitation designer',
    'wedding card design online free', 'free card maker online', 'wedding templates',
    'royal wedding invitation', 'indian wedding card maker', 'विवाह निमंत्रण पत्र',
    'wedding card with photo', 'marriage invitation maker free',
  ],
  openGraph: {
    title: 'Wedding Card Maker Free | Create Wedding Invitations Online',
    description: 'Design royal & classic wedding invitations with 30+ beautiful themes. Hindi & English support. Download free!',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Wedding Card Designer Online',
    description: 'Create stunning wedding cards with royal templates. Multi-language support!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/wedding-card-maker',
  },
  robots: { index: true, follow: true },
};

export default function WeddingPage() {
  redirect('/?card=wedding');
}
