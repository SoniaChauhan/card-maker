import { redirect } from 'next/navigation';

export const metadata = {
  title: 'माँ पर सुविचार हिन्दी 2026 – Mother Quotes in Hindi Free Download',
  description:
    '50 खूबसूरत माँ पर सुविचार हिन्दी में। माँ के प्यार, ममता और त्याग पर अनमोल विचार। थीम चुनें और फ्री डाउनलोड करें!',
  keywords: [
    'माँ पर सुविचार', 'मां पर शायरी', 'mother quotes hindi',
    'maa quotes hindi', 'माँ का प्यार', 'mothers day quotes hindi',
    'मां पर विचार', 'maa par suvichar', 'mother love quotes hindi',
    'माँ पर अनमोल वचन',
  ],
  openGraph: {
    title: 'माँ पर सुविचार हिन्दी 2026 – फ्री डाउनलोड',
    description: '50 खूबसूरत माँ पर सुविचार हिन्दी में। थीम चुनें और फ्री डाउनलोड करें!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/mothers-quotes-hindi',
  },
};

export default function MothersQuotesHindiPage() {
  redirect('/?card=mothers');
}
