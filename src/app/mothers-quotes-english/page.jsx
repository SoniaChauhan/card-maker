import { redirect } from 'next/navigation';

export const metadata = {
  title: "Mother's Quotes in English 2026 – Beautiful Mom Quotes & Cards Free Download",
  description:
    "Download 50 heartfelt Mother's Day quotes in English. Beautiful cards celebrating a mother's love, sacrifice, and strength. Customize themes and download free!",
  keywords: [
    "mother's quotes english", "mom quotes", "mother's day quotes",
    "mother love quotes", "quotes about mothers", "mother's day cards",
    "free mother quotes download", "mother's quotes images",
    "mother's day 2026", "best mom quotes",
  ],
  openGraph: {
    title: "Mother's Quotes in English 2026 – Free Download",
    description: "Download 50 beautiful English Mother's quotes cards. Customize themes & download free!",
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/mothers-quotes-english',
  },
};

export default function MothersQuotesPage() {
  redirect('/?card=mothers-en');
}
