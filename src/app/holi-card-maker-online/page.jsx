import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'Free Holi Card Maker Online | Holi Card Templates 2026 Download',
  description:
    'Create beautiful Holi greeting cards online free. 50+ Hindi Holi shayaris, 47 English Holi messages. Holi card templates with customizable colors. Add your name & download free Holi cards instantly. Best Holi card maker online 2026.',
  keywords: [
    'holi card maker', 'holi card maker online', 'free holi card maker',
    'holi greeting card maker', 'holi wishes card maker', 'happy holi card maker',
    'holi card download free', 'होली कार्ड बनाएं', 'holi card 2026',
    'holi card templates', 'holi templates free download', 'holi invitation card',
    'holi greeting templates', 'free card maker online', 'aesthetic card templates',
  ],
  openGraph: {
    title: 'Free Holi Card Maker | Holi Templates 2026',
    description: 'Create free Holi greeting cards with 50+ shayaris & messages. Beautiful templates, instant download!',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Holi Card Maker Free Online 2026',
    description: 'Create stunning Holi cards with 50+ templates. Download free!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/holi-card-maker-online',
  },
  robots: { index: true, follow: true },
};

const FAQ_DATA = [
  {
    question: 'How can I make a Holi card online?',
    answer: 'Choose a Holi template, customize colors, add your name and message, then download your Holi card instantly — completely free.',
  },
  {
    question: 'Are Holi card templates free to download?',
    answer: 'Yes, you can preview and download Holi cards for free with watermark. Premium downloads are available without watermark.',
  },
  {
    question: 'Can I add Holi shayari to my card?',
    answer: 'Yes! We have 50+ Hindi Holi shayaris and 47 English Holi messages built into our templates for you to choose from.',
  },
  {
    question: 'Can I share Holi cards on WhatsApp?',
    answer: 'Absolutely! Download your Holi card as PNG and share directly on WhatsApp, Instagram, Facebook, or any platform.',
  },
  {
    question: 'Do I need an app to create Holi cards?',
    answer: 'No app needed. Our Holi card maker works entirely in your browser on mobile, tablet, and desktop.',
  },
];

export default function HoliCardMakerPage() {
  return (
    <>
      <CardPage cardType="holiwishes" />
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://creativethinkerdesignhub.com' },
              { '@type': 'ListItem', position: 2, name: 'Holi Card Maker', item: 'https://creativethinkerdesignhub.com/holi-card-maker-online' },
            ],
          }),
        }}
      />
      <section className="seo-content" aria-hidden="true">
        <h1>Free Holi Card Maker Online 2026</h1>
        <p>
          Celebrate Holi with vibrant, colorful greeting cards created using our free Holi Card Maker. Choose
          from beautiful Holi templates, add 50+ Hindi shayaris or 47 English messages, customize colors, and
          download instantly. Perfect for wishing family, friends, and loved ones on WhatsApp and Instagram.
        </p>
        <p>
          Our Holi card maker supports custom names, photos, and personalized messages. No app installation
          or signup required — create and share Holi cards in seconds.
        </p>
        <h2>Frequently Asked Questions</h2>
        {FAQ_DATA.map((faq, i) => (
          <div key={i}><h3>{faq.question}</h3><p>{faq.answer}</p></div>
        ))}
      </section>
    </>
  );
}
