import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'Free Festival Card Maker | Diwali, Holi, Eid, Christmas Cards Online',
  description:
    'Create festive greeting cards for all occasions free — Diwali, Holi, Eid, Christmas, Navratri, Raksha Bandhan, Lohri & more. 100+ aesthetic card templates with instant download. Best festival card maker India 2026.',
  keywords: [
    'festival card maker', 'diwali card maker', 'eid card maker',
    'christmas card maker', 'navratri card', 'raksha bandhan card',
    'festival greeting cards', 'free festival cards online', 'free card maker online',
    'aesthetic card templates', 'diwali templates', 'holi templates',
    'दीपावली कार्ड', 'ईद कार्ड', 'festival invite maker',
  ],
  openGraph: {
    title: 'Free Festival Card Maker | Diwali, Holi, Eid, Christmas',
    description: 'Create festive greeting cards for Diwali, Holi, Eid, Christmas & more. 100+ templates, download free!',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Festival Card Maker Free Online',
    description: 'Create beautiful festival cards for any occasion. Download free!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/festival-card-maker',
  },
  robots: { index: true, follow: true },
};

const FAQ_DATA = [
  {
    question: 'Which festivals are supported?',
    answer: 'We support Diwali, Holi, Eid, Christmas, Navratri, Raksha Bandhan, Lohri, Pongal, Baisakhi, Ganesh Chaturthi, and many more Indian and international festivals.',
  },
  {
    question: 'Can I create festival cards in Hindi?',
    answer: 'Yes! Our festival card maker supports Hindi, English, and other Indian languages for your festival greetings.',
  },
  {
    question: 'Are festival card templates free?',
    answer: 'Yes, you can browse and preview all templates for free. Premium downloads are available without watermark.',
  },
  {
    question: 'Can I add my own photo to festival cards?',
    answer: 'Absolutely! Upload your photo, customize text, colors, and messages to make each festival card personal.',
  },
  {
    question: 'How do I share my festival card?',
    answer: 'Download your card as a high-quality PNG and share it on WhatsApp, Instagram, Facebook, or print it.',
  },
];

export default function FestivalPage() {
  return (
    <>
      <CardPage cardType="festivalcards" />
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
              { '@type': 'ListItem', position: 2, name: 'Festival Card Maker', item: 'https://creativethinkerdesignhub.com/festival-card-maker' },
            ],
          }),
        }}
      />
      <section className="seo-content" aria-hidden="true">
        <h1>Free Festival Card Maker Online</h1>
        <p>
          Celebrate every festival with a beautifully designed greeting card. Our Festival Card Maker offers 100+
          templates for Diwali, Holi, Eid, Christmas, Navratri, Raksha Bandhan, and more. Customize colors, text,
          photos, and messages — then download instantly in high-quality PNG format.
        </p>
        <p>
          Whether it is a religious celebration or a national holiday, our festival card templates help you
          share your joy with family and friends on WhatsApp, Instagram, or print.
        </p>
        <h2>Frequently Asked Questions</h2>
        {FAQ_DATA.map((faq, i) => (
          <div key={i}><h3>{faq.question}</h3><p>{faq.answer}</p></div>
        ))}
      </section>
    </>
  );
}
