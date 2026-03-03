import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Father\'s Quotes in Hindi 2026 – पिता के लिए विचार | Free Download',
  description:
    'Download 50 beautiful Father\'s quotes cards in Hindi. Express love for your father with heartfelt messages. Customize colors and download free greeting cards instantly.',
  keywords: [
    'fathers quotes hindi', 'पिता के लिए विचार', 'father quotes in hindi',
    'fathers day quotes hindi', 'papa quotes hindi',
    'free fathers cards download', 'fathers quotes 2026',
    'father love quotes hindi', 'pitaji quotes',
  ],
  openGraph: {
    title: 'Father\'s Quotes in Hindi 2026 – Free Download',
    description: 'Download 50 beautiful Hindi Father\'s quotes cards. Customize colors & download free!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/fathers-quotes-hindi',
  },
};

export default function FathersQuotesPage() {
  redirect('/?card=fathers');
}
