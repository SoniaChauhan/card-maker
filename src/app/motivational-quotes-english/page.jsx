import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Motivational Quotes in English 2026 – Free Inspirational Cards Download',
  description:
    'Download beautiful motivational quotes cards in English. Self-belief, growth, courage & resilience quotes. Customize colors and download free motivational greeting cards instantly.',
  keywords: [
    'motivational quotes english', 'inspirational quotes cards',
    'english motivational cards', 'free motivational cards download',
    'self-belief quotes', 'courage quotes english',
    'motivational quotes 2026', 'inspirational quotes images',
    'growth quotes english', 'resilience quotes',
  ],
  openGraph: {
    title: 'Motivational Quotes in English 2026 – Free Download',
    description: 'Download beautiful English motivational quotes cards. Customize colors & download free!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/motivational-quotes-english',
  },
};

export default function MotivationalEnglishPage() {
  redirect('/?card=motivational-en');
}
