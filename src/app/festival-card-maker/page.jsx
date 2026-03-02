import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Festival Card Maker – Diwali, Holi, Eid, Christmas & More',
  description:
    'Create festive greeting cards for all occasions — Diwali, Holi, Eid, Christmas, Navratri, Raksha Bandhan & more. Beautiful templates with instant download. Festival card maker by Creative Thinker Design Hub.',
  keywords: [
    'festival card maker', 'diwali card maker', 'eid card maker',
    'christmas card maker', 'navratri card', 'raksha bandhan card',
    'festival greeting cards', 'free festival cards online',
  ],
  openGraph: {
    title: 'Festival Card Maker – Diwali, Holi, Eid, Christmas & More',
    description: 'Create festive greeting cards for Diwali, Holi, Eid, Christmas & more festivals!',
  },
  alternates: {
    canonical: 'https://card-maker-seven-eta.vercel.app/festival-card-maker',
  },
};

export default function FestivalPage() {
  redirect('/?card=festivalcards');
}
