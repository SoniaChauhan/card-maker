import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Free Online Birthday Invitation Maker – Create Birthday Cards Online',
  description:
    'Create personalised birthday party invitations online. Beautiful birthday card templates, add photos & details, preview in real-time, and download instantly. Birthday invitation maker by Creative Thinker Design Hub.',
  keywords: [
    'birthday invitation maker', 'birthday card maker', 'free birthday card maker online',
    'birthday party invitation', 'birthday card designer', 'online birthday card maker',
    'जन्मदिन कार्ड बनाएं', 'birthday invitation online free',
  ],
  openGraph: {
    title: 'Birthday Invitation Maker – Create Birthday Cards Online',
    description: 'Create personalised birthday party invitations with beautiful templates. Preview & download instantly!',
  },
  alternates: {
    canonical: 'https://card-maker-soniachauhan.vercel.app/birthday-invitation-maker',
  },
};

export default function BirthdayPage() {
  redirect('/?card=birthday');
}
