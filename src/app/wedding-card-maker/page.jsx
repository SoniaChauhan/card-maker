import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Online Wedding Card Maker – Create Wedding Invitations Free',
  description:
    'Design royal and classic wedding invitations online. Hindu, Muslim, Christian & Sikh wedding card templates. Multi-language support in Hindi and English. Wedding card maker by Creative Thinker Design Hub.',
  keywords: [
    'wedding card maker', 'wedding invitation maker', 'online wedding card maker',
    'free wedding card design', 'hindu wedding card', 'शादी का कार्ड',
    'marriage card maker online', 'wedding invitation designer',
  ],
  openGraph: {
    title: 'Wedding Card Maker – Create Wedding Invitations Online',
    description: 'Design royal & classic wedding invitations with beautiful themes. Multi-language support!',
  },
  alternates: {
    canonical: 'https://card-maker-seven-eta.vercel.app/wedding-card-maker',
  },
};

export default function WeddingPage() {
  redirect('/?card=wedding');
}
