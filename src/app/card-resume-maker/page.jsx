import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'Card Resume Maker Online | Compact Resume Card Designer Free',
  description:
    'Create a professional card-style resume online. Compact, beautiful resume cards perfect for sharing on WhatsApp, LinkedIn & social media. Multiple premium themes. Best card resume maker India 2026.',
  keywords: [
    'card resume maker', 'compact resume card', 'resume card designer',
    'card style resume maker online', 'professional resume card',
    'resume card for whatsapp', 'resume card linkedin', 'mini resume maker',
    'resume card template', 'card resume builder free',
    'digital resume card', 'resume visiting card maker',
    'creative resume card', 'modern resume card design',
    'कार्ड रिज्यूम मेकर', 'रिज्यूम कार्ड डिज़ाइनर',
  ],
  openGraph: {
    title: 'Card Resume Maker | Compact Resume Card Designer',
    description: 'Create stunning card-style resumes with premium themes. Perfect for WhatsApp, LinkedIn & social media sharing!',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Card Resume Maker Free Online',
    description: 'Create professional card-style resumes with premium themes. Download free!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/card-resume-maker',
  },
  robots: { index: true, follow: true },
};

export default function CardResumePage() {
  return <CardPage cardType="cardresume" />;
}
