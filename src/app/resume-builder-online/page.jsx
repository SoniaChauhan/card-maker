import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Free Resume Builder Online | Create Professional Resume PDF Download',
  description:
    'Build a professional resume online free and download as PDF instantly. Modern templates, clean layouts, ATS-friendly formats. Easy-to-use resume editor. Best free resume builder India 2026.',
  keywords: [
    'resume builder', 'online resume builder', 'resume maker online free',
    'free resume builder', 'resume builder pdf download', 'professional resume maker',
    'resume creator online', 'cv maker online free', 'resume builder india',
    'free card maker online', 'resume templates free', 'ATS resume builder',
    'रिज्यूम बनाएं', 'job resume maker', 'professional cv maker',
  ],
  openGraph: {
    title: 'Free Resume Builder Online | Professional CV Maker',
    description: 'Build a professional resume with modern templates. Download as PDF instantly. Free resume builder India!',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Resume Builder PDF Download',
    description: 'Create professional resume online. Modern templates. Download free!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/resume-builder-online',
  },
  robots: { index: true, follow: true },
};

export default function ResumePage() {
  redirect('/?card=resume');
}
