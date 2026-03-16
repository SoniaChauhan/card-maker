import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'AI Themed Card Maker | Create Personalised Haldi, Mehendi, Festival Cards Online',
  description:
    'Create stunning AI-themed invitation and celebration cards. Choose from Haldi, Mehendi, Sangeet, Diwali, Eid, Christmas themes — upload your photo and get a personalised card instantly!',
  keywords: [
    'ai card maker', 'ai themed card', 'haldi card maker', 'mehendi invitation maker',
    'sangeet card maker', 'festival card maker', 'ai photo card',
    'personalised invitation card', 'face swap card', 'ai invitation maker',
    'wedding function card', 'diwali card maker', 'navratri card maker',
  ],
  openGraph: {
    title: 'AI Themed Card Maker | Personalised Haldi, Mehendi & Festival Cards',
    description: 'Pick a theme, upload your photo, and create stunning personalised cards. 20+ themes available!',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Themed Card Maker',
    description: 'Pick a theme, upload photo, get a personalised card. 20+ themes: Haldi, Mehendi, Diwali & more.',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/ai-themed-card-maker',
  },
  robots: { index: true, follow: true },
};

const FAQ_DATA = [
  {
    question: 'How does the AI themed card maker work?',
    answer: 'Choose a theme (Haldi, Mehendi, Diwali, etc.), upload your face photo, add your name, and the card is generated with your photo placed on the themed background.',
  },
  {
    question: 'What themes are available?',
    answer: 'We offer 20+ themes including Haldi, Mehendi, Sangeet, Reception, Diwali, Holi, Navratri, Eid, Christmas, Baby Shower, Graduation, and more.',
  },
  {
    question: 'Is my uploaded photo safe?',
    answer: 'Yes, all photo processing happens in your browser — we do not store or send your images to any server.',
  },
  {
    question: 'Can I customise the name and subtitle?',
    answer: 'Yes! You can add your name and a custom subtitle/message to personalise the card.',
  },
  {
    question: 'Is it free to use?',
    answer: 'Yes, creating and downloading AI themed cards is completely free.',
  },
];

export default function AIThemedCardPage() {
  return (
    <>
      <CardPage cardType="aifaceswap" />

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
