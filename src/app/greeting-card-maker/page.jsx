import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Greeting Card Maker Online – Free Greeting Cards for All Occasions',
  description:
    'Create greeting cards online for festivals, birthdays, anniversaries, Holi, Diwali, Eid, Christmas and more. Beautiful templates with instant download. Free greeting card maker by Creative Thinker Design Hub.',
  keywords: [
    'greeting card maker', 'greeting card maker online', 'free greeting card maker',
    'online greeting card maker free', 'greeting card design',
    'festival greeting card maker', 'greeting card creator',
  ],
  openGraph: {
    title: 'Greeting Card Maker Online – Free Cards for All Occasions',
    description: 'Create beautiful greeting cards for festivals, birthdays & more. Free templates, instant download!',
  },
  alternates: {
    canonical: 'https://card-maker-seven-eta.vercel.app/greeting-card-maker',
  },
};

export default function GreetingCardPage() {
  redirect('/');
}
