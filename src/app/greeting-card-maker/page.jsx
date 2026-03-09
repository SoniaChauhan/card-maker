import CardPage from '@/components/shared/CardPage';

export const metadata = {
  title: 'Free Greeting Card Maker Online | Cards for All Occasions 2026',
  description:
    'Create free greeting cards online for festivals, birthdays, anniversaries, Holi, Diwali, Eid, Christmas & more. 100+ aesthetic card templates with instant download. Best free card maker online India.',
  keywords: [
    'greeting card maker', 'greeting card maker online', 'free greeting card maker',
    'online greeting card maker free', 'greeting card design', 'free card maker online',
    'festival greeting card maker', 'greeting card creator', 'aesthetic card templates',
    'greeting card templates free', 'e-greeting card maker', 'ग्रीटिंग कार्ड',
  ],
  openGraph: {
    title: 'Free Greeting Card Maker | Cards for All Occasions',
    description: 'Create beautiful greeting cards for festivals, birthdays & more. 100+ aesthetic templates, instant download!',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Creative Thinker Design Hub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Greeting Card Maker Online',
    description: 'Create stunning greeting cards. 100+ templates. Download free!',
  },
  alternates: {
    canonical: 'https://creativethinkerdesignhub.com/greeting-card-maker',
  },
  robots: { index: true, follow: true },
};

const FAQ_DATA = [
  {
    question: 'How can I make a free greeting card online?',
    answer: 'Simply choose a template, customize text and photos, preview your design, and download — all for free in your browser.',
  },
  {
    question: 'What occasions can I create greeting cards for?',
    answer: 'Birthdays, weddings, anniversaries, festivals (Diwali, Holi, Eid, Christmas), thank-you cards, congratulations, and more.',
  },
  {
    question: 'Can I personalize greeting cards with photos?',
    answer: 'Yes! Upload your own photos and add personalized messages to make each card unique.',
  },
  {
    question: 'Do I need to sign up to use the greeting card maker?',
    answer: 'No signup is required. You can start creating greeting cards instantly in your browser.',
  },
  {
    question: 'In what format can I download my greeting card?',
    answer: 'Download your greeting card as a high-quality PNG image, ready for sharing on WhatsApp, Instagram, or printing.',
  },
];

export default function GreetingCardPage() {
  return (
    <>
      <CardPage />
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
              { '@type': 'ListItem', position: 2, name: 'Greeting Card Maker', item: 'https://creativethinkerdesignhub.com/greeting-card-maker' },
            ],
          }),
        }}
      />
      <section className="seo-content" aria-hidden="true">
        <h1>Free Greeting Card Maker Online</h1>
        <p>
          Create beautiful greeting cards for every occasion with our free online card maker. Choose from 100+
          aesthetic templates for birthdays, weddings, festivals, thank-you messages, and more. Customize text,
          colors, and photos with our easy-to-use editor and download instantly.
        </p>
        <p>
          Share your greeting cards on WhatsApp, Instagram, Facebook, or print them for gifting. No app
          installation or signup required — fast and simple for all users.
        </p>
        <h2>Frequently Asked Questions</h2>
        {FAQ_DATA.map((faq, i) => (
          <div key={i}><h3>{faq.question}</h3><p>{faq.answer}</p></div>
        ))}
      </section>
    </>
  );
}
