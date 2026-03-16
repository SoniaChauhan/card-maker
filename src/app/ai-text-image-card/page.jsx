import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'AI Text + Image Card Maker | Create Custom Photo Cards Online Free',
  description:
    'Create beautiful AI-powered text + image cards online for free. Upload your photo, add custom text, choose layouts (left, right, top, bottom), pick colors & fonts — download instantly!',
  keywords: [
    'ai card maker', 'text image card maker', 'photo card maker online',
    'custom card maker', 'ai photo card', 'image text card creator',
    'online card designer', 'photo greeting card', 'free card maker',
    'whatsapp card maker', 'social media card maker', 'ai card generator',
  ],
  openGraph: {
    title: 'AI Text + Image Card Maker | Custom Photo Cards Online',
    description: 'Upload photo, add text, pick layout & colors — create stunning cards in seconds. Free download!',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Text + Image Card Maker',
    description: 'Upload photo, add text, pick layout & colors — create stunning cards in seconds.',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/ai-text-image-card',
  },
  robots: { index: true, follow: true },
};

const FAQ_DATA = [
  {
    question: 'How do I create an AI text + image card?',
    answer: 'Upload your photo, add a title and message, choose a layout position, pick a background color and font, then click Generate Card.',
  },
  {
    question: 'Can I change the image position on the card?',
    answer: 'Yes! You can place the image on the left, right, top, or bottom of the card — the text fills the other half.',
  },
  {
    question: 'Is this card maker free?',
    answer: 'Yes, creating and downloading AI Text + Image cards is free.',
  },
  {
    question: 'What image formats are supported?',
    answer: 'JPG, PNG, AVIF, and most common image formats are supported.',
  },
  {
    question: 'Can I share the card on WhatsApp?',
    answer: 'Absolutely! Download the card as a PNG image and share it on WhatsApp, Instagram, or any social platform.',
  },
];

export default function AITextImageCardPage() {
  return (
    <>
      <CardPage cardType="aitextimage" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ_DATA.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          }),
        }}
      />
    </>
  );
}
