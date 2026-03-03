import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Father\'s Quotes in English 2026 – Free Inspirational Cards Download',
  description:
    'Download 50 beautiful Father\'s quotes cards in English. Express love for your father with heartfelt messages. Customize colors and download free greeting cards instantly.',
  keywords: [
    'fathers quotes english', 'father quotes', 'fathers day quotes english',
    'dad quotes english', 'fathers day cards free',
    'free fathers cards download', 'fathers quotes 2026',
    'father love quotes', 'best dad quotes',
  ],
  openGraph: {
    title: 'Father\'s Quotes in English 2026 – Free Download',
    description: 'Download 50 beautiful English Father\'s quotes cards. Customize colors & download free!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/fathers-quotes-english',
  },
};

export default function FathersQuotesEnglishPage() {
  redirect('/?card=fathers-en');
}
