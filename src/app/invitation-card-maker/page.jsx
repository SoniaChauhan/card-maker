import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Invitation Card Maker Online – Create Free Invitations for Any Occasion',
  description:
    'Create beautiful invitation cards online for birthdays, weddings, anniversaries, religious events and more. 50+ templates in Hindi & English. Customizable designs, instant download. Best invitation maker in India.',
  keywords: [
    'invitation card maker', 'invitation maker online', 'free invitation maker',
    'online invitation maker free', 'digital invitation card maker',
    'party invitation maker', 'event invitation card creator', 'invitation card design',
    'निमंत्रण पत्र', 'invitation card maker india',
  ],
  openGraph: {
    title: 'Invitation Card Maker Online – Free Templates for Every Occasion',
    description: 'Create free invitation cards for birthdays, weddings & more. 50+ templates, instant download!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/invitation-card-maker',
  },
};

export default function InvitationPage() {
  redirect('/');
}
