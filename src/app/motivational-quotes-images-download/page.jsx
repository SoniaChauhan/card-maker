import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Free Motivational Quote Cards | Motivational Quotes Images Download 2026',
  description:
    'Download 100+ free motivational quotes images. Create custom motivational quote cards with beautiful backgrounds. Inspirational, success, life & positive thinking quotes. Free motivational card maker online 2026.',
  keywords: [
    'motivational quotes images download', 'motivational quotes images',
    'inspirational quotes download', 'motivational quotes free download',
    'success quotes images', 'life quotes images download', 'free motivational quote cards',
    'positive thinking quotes', 'motivational card maker', 'free card maker online',
    'motivational quotes 2026', 'inspirational images free', 'aesthetic card templates',
    'motivational poster maker', 'quote card generator', 'प्रेरणादायक विचार',
  ],
  openGraph: {
    title: 'Free Motivational Quote Cards | Download Inspirational Images',
    description: 'Download 100+ motivational quotes images. Create custom quote cards & download free!',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Motivational Quotes Images Free Download',
    description: 'Download stunning motivational quote cards. 100+ templates!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/motivational-quotes-images-download',
  },
  robots: { index: true, follow: true },
};

export default function MotivationalQuotesPage() {
  redirect('/?card=motivational');
}
